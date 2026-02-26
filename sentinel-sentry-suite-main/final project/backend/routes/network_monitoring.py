"""Network security monitoring and analysis module with advanced flow tracking and YARA rules."""

from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from datetime import datetime
from typing import List, Optional, Dict, Any
import asyncio
import json
import hashlib
import tempfile
import os
import time
import yara
from dataclasses import dataclass
from collections import defaultdict
from scapy.all import rdpcap, PacketList, IP, TCP, UDP
from models.network import (
    NetworkTrafficStats,
    PacketAnalysis,
    DDoSAlert,
    PortScanAlert,
    NetworkAnomaly
)

# Constants for rate limiting and flow management
MAX_PCAP_SIZE = 100 * 1024 * 1024  # 100MB
FLOW_TIMEOUT = 300  # 5 minutes in seconds
MAX_FLOWS = 10000  # Maximum number of concurrent flows to track

# Load YARA rules for payload analysis
YARA_RULES = yara.compile(source="""
rule SuspiciousShellcode {
    strings:
        $shellcode1 = { 31 c0 50 68 2f 2f 73 68 68 2f 62 69 6e }  // Basic shellcode pattern
        $shellcode2 = { 90 90 90 90 90 }  // NOP sled
    condition:
        any of them
}

rule Base64EncodedExe {
    strings:
        $b64_exe = "TVqQAAMAAAAEAAAA"  // Base64 encoded MZ header
    condition:
        $b64_exe
}

rule SuspiciousPowershell {
    strings:
        $encoded = "-enc" nocase
        $encoded2 = "-encodedcommand" nocase
        $hidden = "-w hidden" nocase
        $noninteractive = "-noni" nocase
    condition:
        2 of them
}
""")

router = APIRouter()

# Flow tracking models
@dataclass
class FlowKey:
    src_ip: str
    dst_ip: str
    src_port: int
    dst_port: int
    protocol: str

    def __hash__(self):
        return hash((self.src_ip, self.dst_ip, self.src_port, self.dst_port, self.protocol))

class PacketFlow:
    def __init__(self, key: FlowKey, start_time: float):
        self.key = key
        self.start_time = start_time
        self.end_time = start_time
        self.packets = 0
        self.bytes = 0
        self.flags = defaultdict(int)  # For TCP flags
        self.state = "NEW"

    def update(self, pkt, timestamp: float):
        self.packets += 1
        self.bytes += len(pkt)
        self.end_time = timestamp

        if TCP in pkt:
            for flag in ['S', 'A', 'P', 'R', 'F']:
                if pkt[TCP].flags & getattr(TCP, flag):
                    self.flags[flag] += 1

            # Basic TCP state tracking
            if self.flags['S'] == 1 and self.flags['A'] == 1:
                self.state = "ESTABLISHED"
            elif self.flags['F'] > 0 or self.flags['R'] > 0:
                self.state = "CLOSED"

    def to_dict(self):
        return {
            "src_ip": self.key.src_ip,
            "dst_ip": self.key.dst_ip,
            "src_port": self.key.src_port,
            "dst_port": self.key.dst_port,
            "protocol": self.key.protocol,
            "start_time": self.start_time,
            "end_time": self.end_time,
            "packets": self.packets,
            "bytes": self.bytes,
            "state": self.state,
            "tcp_flags": dict(self.flags) if self.key.protocol == "TCP" else None
        }

# Request/Response models
class TrafficMonitoringRequest(BaseModel):
    interface: str
    duration: int  # seconds
    capture_filter: Optional[str] = None

class PacketUploadResponse(BaseModel):
    filename: str
    packet_count: int
    analysis: PacketAnalysis
    alerts: List[Dict[str, Any]]

class DDoSAnalysisResult(BaseModel):
    is_attack: bool
    confidence: float
    attack_type: Optional[str]
    source_ips: List[str]
    timestamp: str

# Network Monitoring Endpoints
@router.post("/monitor/start")
async def start_monitoring(request: TrafficMonitoringRequest):
    """Start real-time network monitoring."""
    try:
        # Initialize network capture (placeholder - would use proper capture lib)
        stats = NetworkTrafficStats(
            packets_total=0,
            bytes_total=0,
            start_time=datetime.utcnow().isoformat()
        )
        return {"status": "started", "stats": stats}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

class NetworkAnalyzer:
    def __init__(self):
        self.flows: Dict[FlowKey, PacketFlow] = {}
        self.stats = defaultdict(int)
        self.alerts = []
        self.last_cleanup = time.time()

    def cleanup_flows(self, current_time: float):
        """Remove expired flows"""
        if current_time - self.last_cleanup < 60:  # Only cleanup every minute
            return

        expired = []
        for key, flow in self.flows.items():
            if current_time - flow.end_time > FLOW_TIMEOUT:
                expired.append(key)

        for key in expired:
            del self.flows[key]

        self.last_cleanup = current_time

    def get_flow_key(self, pkt) -> Optional[FlowKey]:
        """Extract 5-tuple flow key from packet"""
        if IP not in pkt:
            return None

        if TCP in pkt:
            proto = "TCP"
            sport = pkt[TCP].sport
            dport = pkt[TCP].dport
        elif UDP in pkt:
            proto = "UDP"
            sport = pkt[UDP].sport
            dport = pkt[UDP].dport
        else:
            return None

        return FlowKey(
            src_ip=pkt[IP].src,
            dst_ip=pkt[IP].dst,
            src_port=sport,
            dst_port=dport,
            protocol=proto
        )

    def process_packet(self, pkt, timestamp: float):
        """Process a single packet"""
        # Get basic packet info
        if IP not in pkt:
            return

        # Update general stats
        self.stats["total_packets"] += 1
        self.stats["total_bytes"] += len(pkt)

        if TCP in pkt:
            self.stats["tcp_packets"] += 1
            if pkt[TCP].flags & 0x02:  # SYN flag
                self.stats["tcp_syns"] += 1
        elif UDP in pkt:
            self.stats["udp_packets"] += 1
            if pkt[UDP].dport == 53:
                self.stats["dns_queries"] += 1

        # Flow tracking
        flow_key = self.get_flow_key(pkt)
        if not flow_key:
            return

        # Cleanup expired flows if needed
        self.cleanup_flows(timestamp)

        # Create or update flow
        if flow_key not in self.flows:
            if len(self.flows) >= MAX_FLOWS:
                # If we hit the flow limit, don't create new ones
                return
            self.flows[flow_key] = PacketFlow(flow_key, timestamp)
        
        self.flows[flow_key].update(pkt, timestamp)

        # Extract payload for YARA scanning
        if TCP in pkt or UDP in pkt:
            payload = bytes(pkt[TCP if TCP in pkt else UDP].payload)
            if payload:
                matches = YARA_RULES.match(data=payload)
                if matches:
                    for match in matches:
                        self.alerts.append({
                            "timestamp": timestamp,
                            "type": "signature_match",
                            "message": f"YARA rule '{match.rule}' matched in flow {flow_key.src_ip}:{flow_key.src_port} -> {flow_key.dst_ip}:{flow_key.dst_port}",
                            "severity": "high"
                        })

    def detect_anomalies(self):
        """Detect various network anomalies"""
        # SYN flood detection
        if self.stats.get("tcp_syns", 0) > 100 and \
           self.stats.get("tcp_syns", 0) / max(1, self.stats.get("tcp_packets", 1)) > 0.8:
            self.alerts.append({
                "timestamp": time.time(),
                "type": "attack",
                "message": "Possible SYN flood detected - High rate of SYN packets",
                "severity": "high"
            })

        # Port scan detection
        port_scan_threshold = 50
        for flow_key in self.flows:
            if flow_key.protocol == "TCP":
                unique_ports = len(set(f.key.dst_port for f in self.flows.values()
                                    if f.key.src_ip == flow_key.src_ip))
                if unique_ports > port_scan_threshold:
                    self.alerts.append({
                        "timestamp": time.time(),
                        "type": "recon",
                        "message": f"Possible port scan detected from {flow_key.src_ip} - {unique_ports} unique ports",
                        "severity": "medium"
                    })

        # DNS anomaly detection
        if self.stats.get("dns_queries", 0) > 50:
            dns_rate = self.stats["dns_queries"] / max(1, self.stats["total_packets"])
            if dns_rate > 0.5:
                self.alerts.append({
                    "timestamp": time.time(),
                    "type": "anomaly",
                    "message": "High rate of DNS queries - possible DNS tunneling or exfiltration",
                    "severity": "medium"
                })

    def analyze_pcap(self, pcap_path: str):
        """Analyze a PCAP file"""
        packets = rdpcap(pcap_path)
        
        # Process each packet
        for pkt in packets:
            if hasattr(pkt, "time"):
                timestamp = float(pkt.time)
            else:
                timestamp = time.time()
            
            self.process_packet(pkt, timestamp)

        # Detect anomalies based on collected stats
        self.detect_anomalies()

        return {
            "stats": dict(self.stats),
            "alerts": self.alerts,
            "flows": [flow.to_dict() for flow in self.flows.values()]
        }

@router.post("/analyze/pcap")
async def analyze_pcap(file: UploadFile = File(...)):
    """Analyze uploaded PCAP file using advanced flow tracking and YARA rules."""
    try:
        # Check file size first
        if file.size > MAX_PCAP_SIZE:
            raise HTTPException(status_code=413, detail="PCAP file too large")

        contents = await file.read()
        file_hash = hashlib.sha256(contents).hexdigest()

        # Save to a temporary file for scapy to read
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pcap") as tmp:
            tmp.write(contents)
            tmp_path = tmp.name

        try:
            # Initialize and run the analyzer
            analyzer = NetworkAnalyzer()
            results = analyzer.analyze_pcap(tmp_path)
            
            # Add file metadata
            results["file_hash"] = file_hash
            results["filename"] = file.filename
            results["timestamp"] = datetime.utcnow().isoformat()

            return results

        finally:
            # Clean up temp file
            try:
                os.unlink(tmp_path)
            except:
                pass  # Ignore cleanup errors

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

        return PacketUploadResponse(
            filename=file.filename,
            packet_count=packet_count,
            analysis=analysis,
            alerts=alerts
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/detect/ddos")
async def detect_ddos(data: Dict[str, Any]):
    """Analyze traffic for DDoS patterns."""
    try:
        # Placeholder for DDoS detection logic
        return DDoSAnalysisResult(
            is_attack=False,
            confidence=0.0,
            attack_type=None,
            source_ips=[],
            timestamp=datetime.utcnow().isoformat()
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/detect/portscan")
async def detect_port_scan(data: Dict[str, Any]):
    """Detect port scanning activity."""
    try:
        # Placeholder for port scan detection
        return {
            "detected": False,
            "source_ip": None,
            "target_ports": [],
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/anomaly")
async def detect_anomalies(data: Dict[str, Any]):
    """Detect network traffic anomalies."""
    try:
        return {
            "anomalies_detected": False,
            "confidence": 0.0,
            "details": [],
            "timestamp": datetime.utcnow().isoformat()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))