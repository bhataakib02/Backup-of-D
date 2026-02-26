"""
Pydantic models for Intrusion Detection System
"""

from typing import Dict, Any, List, Optional, Union
from datetime import datetime
from enum import Enum
from pydantic import BaseModel, Field


class SeverityLevel(str, Enum):
    """Severity levels for security alerts"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class AttackType(str, Enum):
    """Types of detected attacks"""
    DDOS_ATTACK = "ddos_attack"
    SQL_INJECTION = "sql_injection"
    PORT_SCAN = "port_scan"
    MALWARE_COMMUNICATION = "malware_communication"
    DATA_EXFILTRATION = "data_exfiltration"
    LATERAL_MOVEMENT = "lateral_movement"
    PRIVILEGE_ESCALATION = "privilege_escalation"
    UNKNOWN = "unknown"


class IDSAnalysisRequest(BaseModel):
    """Request model for IDS analysis"""
    analysis_type: str = Field(default="pcap", description="Type of analysis to perform")
    source_description: str = Field(default="Network Capture", description="Description of data source")
    time_window_hours: int = Field(default=24, description="Time window for analysis in hours")


class NetworkAlert(BaseModel):
    """Network alert model"""
    alert_id: str
    timestamp: datetime
    alert_type: str
    severity: SeverityLevel
    source_ip: str
    destination_ip: str
    source_port: int
    destination_port: int
    protocol: str
    description: str
    signature: str
    confidence: float = Field(ge=0.0, le=1.0)
    threat_intelligence: Dict[str, Any] = {}
    geographical_data: Dict[str, Any] = {}
    affected_hosts: List[str] = []
    recommendations: List[str] = []


class IDSAnalysisResult(BaseModel):
    """Result model for IDS analysis"""
    analysis_id: str
    source_description: str
    analysis_type: str
    is_intrusion: bool
    attack_type: Optional[AttackType] = None
    confidence: float = Field(ge=0.0, le=1.0)
    risk_score: float = Field(ge=0.0, le=1.0)
    affected_ips: List[str] = []
    detected_patterns: List[str] = []
    recommendations: List[str] = []
    analysis_results: Dict[str, Any] = {}
    created_at: datetime

    class Config:
        use_enum_values = True
