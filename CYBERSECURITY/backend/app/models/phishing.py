"""
Data models for phishing detection
"""

from pydantic import BaseModel, HttpUrl
from typing import Dict, Any, List, Optional
from datetime import datetime
from enum import Enum


class PhishingRiskLevel(str, Enum):
    """Phishing risk levels"""
    LOW = "low"
    MEDIUM = "medium"
    HIGH = "high"
    CRITICAL = "critical"


class PhishingResult(BaseModel):
    """Phishing detection result"""
    is_phishing: bool
    confidence: float
    risk_score: float  # 0-1 scale
    features: Dict[str, Any]
    explanation: str
    recommendations: List[str]
    
    class Config:
        schema_extra = {
            "example": {
                "is_phishing": True,
                "confidence": 0.85,
                "risk_score": 0.7,
                "features": {
                    "url_features": {
                        "length": 45,
                        "suspicious_chars": 2,
                        "brand_impersonation": True
                    },
                    "domain_info": {
                        "age_days": 5,
                        "ssl_valid": False
                    }
                },
                "explanation": "URL contains suspicious characters and appears to impersonate a known brand",
                "recommendations": [
                    "DO NOT click on the link",
                    "Report this as phishing",
                    "Verify with official sources"
                ]
            }
        }


class PhishingAnalysis(BaseModel):
    """Complete phishing analysis record"""
    id: str
    url: Optional[HttpUrl] = None
    email_content: Optional[str] = None
    email_sender: Optional[str] = None
    subject: Optional[str] = None
    analysis_type: str  # "url", "email", "file"
    
    # Results
    result: PhishingResult
    
    # Metadata
    created_at: datetime
    user_id: Optional[str] = None
    status: str = "completed"
    
    # Additional data
    screenshot_data: Optional[str] = None
    additional_notes: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "id": "analysis_12345",
                "url": "https://suspicious-site.com",
                "analysis_type": "url",
                "result": PhishingResult(
                    is_phishing=True,
                    confidence=0.85,
                    risk_score=0.7,
                    features={},
                    explanation="Suspicious URL detected",
                    recommendations=["Do not visit"]
                ),
                "created_at": "2024-01-01T12:00:00Z",
                "status": "completed"
            }
        }


class PhishingStatistics(BaseModel):
    """Phishing detection statistics"""
    total_analyzed: int
    phishing_detected: int
    false_positives: int
    accuracy_rate: float
    
    # Time-based statistics
    daily_detections: List[int]
    weekly_trends: Dict[str, int]
    
    # Confidence distribution
    confidence_distribution: Dict[str, int]  # high, medium, low
    
    # Risk level distribution
    risk_level_distribution: Dict[str, int]
    
    # Top threats
    top_threat_types: List[Dict[str, Any]]
    top_targeted_brands: List[Dict[str, Any]]
    
    class Config:
        schema_extra = {
            "example": {
                "total_analyzed": 1250,
                "phishing_detected": 89,
                "false_positives": 12,
                "accuracy_rate": 0.924,
                "daily_detections": [5, 7, 3, 8, 12, 6, 9],
                "confidence_distribution": {"high": 65, "medium": 28, "low": 7},
                "risk_level_distribution": {"critical": 15, "high": 25, "medium": 35, "low": 14}
            }
        }


class EmailSample(BaseModel):
    """Email sample for analysis"""
    sender: str
    subject: str
    content: str
    received_at: datetime
    attachment_info: Optional[List[Dict[str, Any]]] = None
    
    class Config:
        schema_extra = {
            "example": {
                "sender": "noreply@suspicious-site.com",
                "subject": "Urgent: Verify Your Account",
                "content": "Click here to verify your account immediately...",
                "received_at": "2024-01-01T10:00:00Z",
                "attachment_info": [{"filename": "invoice.pdf", "size": 100000}]
            }
        }


class URLSample(BaseModel):
    """URL sample for analysis"""
    url: HttpUrl
    referrer: Optional[str] = None
    collected_at: datetime
    source: str  # "email", "search", "click", "manual"
    
    class Config:
        schema_extra = {
            "example": {
                "url": "https://verify-paypal-security.com",
                "referrer": "https://email-provider.com",
                "collected_at": "2024-01-01T10:00:00Z",
                "source": "email"
            }
        }


class PhishingAlert(BaseModel):
    """Real-time phishing alert"""
    id: str
    alert_type: str  # "new_phishing_site", "mass_campaign", "brand_impersonation"
    severity: PhishingRiskLevel
    title: str
    description: str
    
    # Affected entities
    affected_urls: List[str]
    affected_brands: List[str]
    
    # Detection metadata
    detection_methods: List[str]  # "ml", "url_analysis", "email_analysis", "visual"
    confidence: float
    
    # Timing
    first_seen: datetime
    last_updated: datetime
    
    # Impact assessment
    potential_victims: Optional[int] = None
    geographical_impact: Optional[List[str]] = None
    
    class Config:
        schema_extra = {
            "example": {
                "id": "alert_12345",
                "alert_type": "brand_impersonation",
                "severity": PhishingRiskLevel.HIGH,
                "title": "New PayPal Phishing Campaign Detected",
                "description": "Massive phishing campaign targeting PayPal users",
                "affected_urls": ["https://paypal-security-verification.com"],
                "affected_brands": ["PayPal"],
                "detection_methods": ["ml", "visual"],
                "confidence": 0.95,
                "first_seen": "2024-01-01T09:00:00Z",
                "last_updated": "2024-01-01T10:00:00Z"
            }
        }


class PhishingRule(BaseModel):
    """Custom phishing detection rule"""
    id: str
    name: str
    description: str
    
    # Rule conditions
    conditions: Dict[str, Any]
    
    # Rule actions
    actions: List[str]  # "block", "quarantine", "alert", "log"
    
    # Rule metadata
    created_by: str
    created_at: datetime
    is_active: bool = True
    
    # Performance metrics
    matches: int = 0
    false_positives: int = 0
    accuracy: Optional[float] = None
    
    class Config:
        schema_extra = {
            "example": {
                "id": "rule_001",
                "name": "PayPal Domain Check",
                "description": "Check for PayPal domain impersonation",
                "conditions": {
                    "domain_contains": "paypal",
                    "ssl_invalid": True,
                    "age_days_max": 30
                },
                "actions": ["block", "alert"],
                "created_by": "admin",
                "created_at": "2024-01-01T00:00:00Z",
                "is_active": True,
                "matches": 5,
                "false_positives": 1,
                "accuracy": 0.95
            }
        }


class PhishingReport(BaseModel):
    """Phishing analysis report"""
    id: str
    title: str
    report_type: str  # "daily", "weekly", "monthly", "custom"
    
    # Report period
    start_date: datetime
    end_date: datetime
    
    # Summary statistics
    summary: PhishingStatistics
    
    # Detailed findings
    top_threats: List[PhishingAlert]
    emerging_patterns: List[str]
    
    # Recommendations
    recommendations: List[str]
    
    # Report metadata
    generated_by: str
    generated_at: datetime
    
    class Config:
        schema_extra = {
            "example": {
                "id": "report_2024_01",
                "title": "Phishing Security Report - January 2024",
                "report_type": "monthly",
                "start_date": "2024-01-01T00:00:00Z",
                "end_date": "2024-01-31T23:59:59Z",
                "summary": PhishingStatistics(
                    total_analyzed=1250,
                    phishing_detected=89,
                    false_positives=12,
                    accuracy_rate=0.924,
                    daily_detections=[5, 7, 3],
                    weekly_trends={"week1": 24},
                    confidence_distribution={"high": 65},
                    risk_level_distribution={"critical": 15},
                    top_threat_types=[{"type": "brand_impersonation", "count": 45}],
                    top_targeted_brands=[{"brand": "PayPal", "count": 23}]
                ),
                "generated_by": "system",
                "generated_at": "2024-01-31T23:59:59Z"
            }
        }


class ThreatIntelligence(BaseModel):
    """Threat intelligence data"""
    indicator_type: str  # "domain", "ip", "email", "hash"
    indicator_value: str
    threat_type: str  # "phishing", "malware", "spam"
    
    # Intelligence data
    reputation_score: float  # 0-1, where 0 is malicious
    confidence: float
    source: str
    first_seen: datetime
    last_seen: datetime
    
    # Related entities
    associated_campaigns: List[str]
    related_indicators: List[str]
    
    # Additional metadata
    tags: List[str]
    description: Optional[str] = None
    
    class Config:
        schema_extra = {
            "example": {
                "indicator_type": "domain",
                "indicator_value": "fake-paypal-verification.com",
                "threat_type": "phishing",
                "reputation_score": 0.1,
                "confidence": 0.95,
                "source": "community",
                "first_seen": "2024-01-01T08:00:00Z",
                "last_seen": "2024-01-01T15:00:00Z",
                "associated_campaigns": ["paypal_2024_campaign"],
                "related_indicators": ["phishing_email_template_v1"],
                "tags": ["banking", "fintech", "brand_impersonation"]
            }
        }





