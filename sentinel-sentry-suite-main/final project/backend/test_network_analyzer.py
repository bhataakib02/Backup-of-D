import os
import pytest
from fastapi.testclient import TestClient
from scapy.all import IP, TCP, UDP, DNS, DNSQR, wrpcap
import tempfile
from main import app
from routes.network_monitoring import FlowKey, PacketFlow, NetworkAnalyzer

@pytest.fixture(scope="module")
def test_client():
    client = TestClient(app, follow_redirects=True)
    return client

def create_syn_flood_pcap():
    """Create a small PCAP file simulating a SYN flood attack"""
    packets = []
    for i in range(100):
        pkt = IP(src=f"192.168.1.{i%254 + 1}", dst="10.0.0.1")/TCP(sport=1024+i, dport=80, flags="S")
        packets.append(pkt)
    
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pcap')
    wrpcap(temp_file.name, packets)
    return temp_file.name

def create_port_scan_pcap():
    """Create a small PCAP file simulating a port scan"""
    packets = []
    for port in range(20, 120):
        pkt = IP(src="192.168.1.2", dst="10.0.0.1")/TCP(sport=1024, dport=port, flags="S")
        packets.append(pkt)
    
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pcap')
    wrpcap(temp_file.name, packets)
    return temp_file.name

def create_dns_heavy_pcap():
    """Create a small PCAP file simulating DNS tunneling/exfil"""
    packets = []
    for i in range(50):
        # Long subdomain to simulate data exfiltration
        domain = f"data{i}{'a'*30}.evil.com"
        pkt = IP(src="192.168.1.3", dst="8.8.8.8")/UDP(sport=53000, dport=53)/DNS(
            qr=0,
            rd=1,
            qd=DNSQR(qname=domain)
        )
        packets.append(pkt)
    
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pcap')
    wrpcap(temp_file.name, packets)
    return temp_file.name

def test_syn_flood_detection(test_client):
    pcap_file = create_syn_flood_pcap()
    try:
        with open(pcap_file, "rb") as f:
            response = test_client.post("/network/analyze/pcap",
                                      files={"file": ("test.pcap", f, "application/vnd.tcpdump.pcap")})
        
        assert response.status_code == 200
        result = response.json()
        
        # Check for SYN flood detection
        assert any("SYN flood" in alert["message"] for alert in result["alerts"])
        assert result["stats"]["tcp_syns"] >= 100
        
        # Check flow analysis
        assert len(result["flows"]) > 0
        # Should be consolidated into one flow due to time window
        assert result["flows"][0]["packets"] >= 100
    finally:
        os.unlink(pcap_file)

def test_port_scan_detection(test_client):
    pcap_file = create_port_scan_pcap()
    try:
        with open(pcap_file, "rb") as f:
            response = test_client.post("/network/analyze/pcap",
                                      files={"file": ("test.pcap", f, "application/vnd.tcpdump.pcap")})
        
        assert response.status_code == 200
        result = response.json()
        
        # Check for port scan detection
        assert any("port scan" in alert["message"].lower() for alert in result["alerts"])
        assert len(result["flows"]) >= 50  # Multiple flows for different ports
    finally:
        os.unlink(pcap_file)

def test_dns_anomaly_detection(test_client):
    pcap_file = create_dns_heavy_pcap()
    try:
        with open(pcap_file, "rb") as f:
            response = test_client.post("/network/analyze/pcap",
                                      files={"file": ("test.pcap", f, "application/vnd.tcpdump.pcap")})
        
        assert response.status_code == 200
        result = response.json()
        
        # Check for DNS anomaly detection
        assert any("DNS" in alert["message"] and "anomaly" in alert["message"].lower() 
                  for alert in result["alerts"])
        assert result["stats"]["dns_queries"] >= 50
    finally:
        os.unlink(pcap_file)

def test_file_size_limit(test_client):
    # Create a large PCAP that exceeds the limit
    packets = []
    for i in range(1000000):  # Try to create a large file
        pkt = IP(src="192.168.1.1", dst="10.0.0.1")/TCP(sport=1024, dport=80)
        packets.append(pkt)
    
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pcap')
    wrpcap(temp_file.name, packets)
    
    try:
        with open(temp_file.name, "rb") as f:
            response = test_client.post("/network/analyze/pcap",
                                      files={"file": ("test.pcap", f, "application/vnd.tcpdump.pcap")})
        
        assert response.status_code == 413  # Payload Too Large
    finally:
        os.unlink(temp_file.name)

def test_flow_reconstruction(test_client):
    """Test flow reconstruction with time windows"""
    packets = []
    # Create two flows with same 5-tuple but different time windows
    for i in range(10):
        pkt = IP(src="192.168.1.1", dst="10.0.0.1")/TCP(sport=1024, dport=80)
        packets.append(pkt)
    
    temp_file = tempfile.NamedTemporaryFile(delete=False, suffix='.pcap')
    wrpcap(temp_file.name, packets)
    
    try:
        with open(temp_file.name, "rb") as f:
            response = test_client.post("/network/analyze/pcap",
                                      files={"file": ("test.pcap", f, "application/vnd.tcpdump.pcap")})
        
        assert response.status_code == 200
        result = response.json()
        
        # Check flow export format
        flows = result["flows"]
        assert len(flows) > 0
        flow = flows[0]
        assert all(k in flow for k in ["src_ip", "dst_ip", "src_port", "dst_port", "protocol",
                                     "start_time", "end_time", "packets", "bytes"])
    finally:
        os.unlink(temp_file.name)