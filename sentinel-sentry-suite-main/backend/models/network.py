"""Network security models and schemas."""

from pydantic import BaseModel
from typing import Dict, List, Optional, Any
from datetime import datetime

class NetworkTrafficStats(BaseModel):
    """Real-time network traffic statistics."""
    packets_total: int
    bytes_total: int
    start_time: str
    protocols: Optional[Dict[str, int]] = None
    top_ips: Optional[Dict[str, int]] = None

class PacketAnalysis(BaseModel):
    """PCAP file analysis results."""
    file_hash: str
    packet_count: int
    protocols: Dict[str, int]
    timestamp: str
    duration: Optional[float] = None
    avg_packet_size: Optional[float] = None
    top_sources: Optional[Dict[str, int]] = None
    top_destinations: Optional[Dict[str, int]] = None

class DDoSAlert(BaseModel):
    """DDoS attack detection alert."""
    attack_type: str
    confidence: float
    source_ips: List[str]
    target_ip: str
    pps: float  # packets per second
    bps: float  # bytes per second
    start_time: str
    duration: Optional[float] = None

class PortScanAlert(BaseModel):
    """Port scanning activity alert."""
    source_ip: str
    target_ip: str
    ports_scanned: List[int]
    scan_type: str  # e.g., "SYN", "FIN", "XMAS"
    timestamp: str
    duration: float

class NetworkAnomaly(BaseModel):
    """Network traffic anomaly detection."""
    type: str  # e.g., "volume", "protocol", "behavior"
    severity: float
    description: str
    affected_hosts: List[str]
    timestamp: str
    indicators: Dict[str, Any]

class TrafficVisualizationData(BaseModel):
    """Data for traffic visualization."""
    timestamp: str
    metrics: Dict[str, float]
    protocol_distribution: Dict[str, int]
    geo_distribution: Dict[str, int]
    top_talkers: Dict[str, float]

class SecurityAlert(BaseModel):
    """Generic security alert."""
    alert_id: str
    type: str
    severity: str
    description: str
    timestamp: str
    source_ip: Optional[str] = None
    target_ip: Optional[str] = None
    indicators: Dict[str, Any]
    recommendations: List[str]

class BlockedIP(BaseModel):
    """Blocked IP address record."""
    ip: str
    reason: str
    timestamp: str
    expires: Optional[str] = None
    added_by: str
    evidence: Dict[str, Any]