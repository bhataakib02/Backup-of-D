"""Phishing detection models and data structures."""
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
from datetime import datetime

class EmailAnalysisRequest(BaseModel):
    subject: str
    body: str
    headers: Dict[str, str]
    attachments: Optional[List[Dict[str, Any]]] = None
    sender: str
    recipient: str
    urls: Optional[List[str]] = None

class URLAnalysisRequest(BaseModel):
    url: str
    html_content: Optional[str] = None
    screenshot_base64: Optional[str] = None

class PhishingIndicators(BaseModel):
    suspicious_sender_score: float
    suspicious_content_score: float
    malicious_links_score: float
    spoofing_attempt_score: float
    social_engineering_score: float
    attachment_risk_score: Optional[float] = None
    domain_age_score: Optional[float] = None
    ssl_cert_score: Optional[float] = None
    html_analysis_score: Optional[float] = None
    homograph_detection_score: Optional[float] = None

class URLAnalysisResult(BaseModel):
    url: str
    is_phishing: bool
    risk_score: float
    indicators: PhishingIndicators
    analysis_timestamp: str
    suspicious_elements: List[str]
    screenshot_analysis: Optional[Dict[str, Any]] = None
    ssl_info: Optional[Dict[str, Any]] = None
    domain_info: Optional[Dict[str, Any]] = None
    recommendations: List[str]

class EmailAnalysisResult(BaseModel):
    is_phishing: bool
    risk_score: float
    indicators: PhishingIndicators
    analysis_timestamp: str
    detected_urls: List[URLAnalysisResult]
    spf_result: Optional[str] = None
    dkim_result: Optional[str] = None
    dmarc_result: Optional[str] = None
    recommendations: List[str]
    blocked: bool
    malicious_attachments: List[str]
    extracted_iocs: Dict[str, List[str]]

class NLPAnalysisResult(BaseModel):
    text: str
    sentiment_score: float
    urgency_score: float
    manipulation_score: float
    detected_keywords: List[str]
    language_sophistication: float
    contextual_relevance: float
    topic_classification: str

class LogoDetectionResult(BaseModel):
    detected_brand: Optional[str] = None
    similarity_score: Optional[float] = None
    is_legitimate: bool
    visual_indicators: List[str]

class FormAnalysisResult(BaseModel):
    has_login_form: bool
    form_fields: List[str]
    suspicious_elements: List[str]
    javascript_risks: List[str]
    data_exfiltration_risks: List[str]