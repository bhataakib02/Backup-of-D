"""Phishing detection and analysis endpoints."""
from fastapi import APIRouter, HTTPException, UploadFile, File
from typing import Dict, List, Any
import asyncio
import base64
from datetime import datetime
import tldextract
import re
import hashlib
import numpy as np
from urllib.parse import urlparse

from ..models.phishing import (
    EmailAnalysisRequest,
    URLAnalysisRequest,
    EmailAnalysisResult,
    URLAnalysisResult,
    PhishingIndicators,
    NLPAnalysisResult,
    LogoDetectionResult,
    FormAnalysisResult
)

from ..security import phishing_detection

router = APIRouter()

@router.post("/analyze/email", response_model=EmailAnalysisResult)
async def analyze_email(request: EmailAnalysisRequest):
    """Analyze email for phishing indicators."""
    try:
        # Initialize analysis components
        nlp_result = await analyze_text_content(request.subject, request.body)
        url_results = []
        
        # Analyze URLs if present
        if request.urls:
            for url in request.urls:
                url_analysis = await analyze_url(URLAnalysisRequest(url=url))
                url_results.append(url_analysis)
        
        # Email authentication checks
        auth_results = check_email_authentication(request.headers)
        
        # Calculate risk scores
        indicators = calculate_phishing_indicators(
            request, nlp_result, url_results, auth_results
        )
        
        # Overall phishing score
        risk_score = calculate_overall_risk(indicators)
        
        return EmailAnalysisResult(
            is_phishing=risk_score > 0.7,
            risk_score=risk_score,
            indicators=indicators,
            analysis_timestamp=datetime.utcnow().isoformat(),
            detected_urls=url_results,
            spf_result=auth_results.get('spf'),
            dkim_result=auth_results.get('dkim'),
            dmarc_result=auth_results.get('dmarc'),
            recommendations=generate_recommendations(risk_score, indicators),
            blocked=risk_score > 0.8,
            malicious_attachments=[],  # Would be populated by attachment scanner
            extracted_iocs=extract_iocs(request)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/url", response_model=URLAnalysisResult)
async def analyze_url(request: URLAnalysisRequest):
    """Analyze URL for phishing indicators."""
    try:
        # Extract domain info
        domain_info = analyze_domain(request.url)
        
        # Analyze HTML content if provided
        html_analysis = None
        if request.html_content:
            html_analysis = analyze_html_content(request.html_content)
        
        # Screenshot analysis if provided
        screenshot_analysis = None
        if request.screenshot_base64:
            screenshot_analysis = analyze_screenshot(request.screenshot_base64)
        
        # Calculate risk indicators
        indicators = calculate_url_risk_indicators(
            request.url,
            domain_info,
            html_analysis,
            screenshot_analysis
        )
        
        risk_score = calculate_url_risk_score(indicators)
        
        return URLAnalysisResult(
            url=request.url,
            is_phishing=risk_score > 0.7,
            risk_score=risk_score,
            indicators=indicators,
            analysis_timestamp=datetime.utcnow().isoformat(),
            suspicious_elements=get_suspicious_elements(html_analysis),
            screenshot_analysis=screenshot_analysis,
            ssl_info=check_ssl_certificate(request.url),
            domain_info=domain_info,
            recommendations=generate_url_recommendations(risk_score, indicators)
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/analyze/form", response_model=FormAnalysisResult)
async def analyze_form(html_content: str):
    """Analyze HTML form for phishing indicators."""
    try:
        form_analysis = analyze_login_form(html_content)
        return FormAnalysisResult(
            has_login_form=form_analysis['has_login_form'],
            form_fields=form_analysis['fields'],
            suspicious_elements=form_analysis['suspicious'],
            javascript_risks=form_analysis['js_risks'],
            data_exfiltration_risks=form_analysis['exfiltration_risks']
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# Helper functions
def analyze_domain(url: str) -> Dict[str, Any]:
    """Analyze domain age, reputation, and characteristics."""
    parsed = urlparse(url)
    ext = tldextract.extract(url)
    
    return {
        "domain": ext.domain,
        "subdomain": ext.subdomain,
        "tld": ext.suffix,
        "is_ip": bool(re.match(r'^\d+\.\d+\.\d+\.\d+$', parsed.netloc)),
        "length": len(parsed.netloc),
        "entropy": calculate_entropy(parsed.netloc),
        "suspicious_keywords": check_suspicious_keywords(parsed.netloc)
    }

def check_email_authentication(headers: Dict[str, str]) -> Dict[str, str]:
    """Check email authentication headers (SPF, DKIM, DMARC)."""
    return {
        "spf": headers.get("Received-SPF", "none"),
        "dkim": "pass" if "dkim=pass" in headers.get("Authentication-Results", "") else "fail",
        "dmarc": headers.get("DMARC-Status", "none")
    }

async def analyze_text_content(subject: str, body: str) -> NLPAnalysisResult:
    """Analyze text content using NLP for phishing indicators."""
    # This would use proper NLP models in production
    combined_text = f"{subject} {body}".lower()
    
    return NLPAnalysisResult(
        text=combined_text[:100],  # Preview
        sentiment_score=0.5,  # Placeholder
        urgency_score=calculate_urgency_score(combined_text),
        manipulation_score=calculate_manipulation_score(combined_text),
        detected_keywords=detect_phishing_keywords(combined_text),
        language_sophistication=0.5,  # Placeholder
        contextual_relevance=0.5,  # Placeholder
        topic_classification="unknown"
    )

def calculate_entropy(text: str) -> float:
    """Calculate Shannon entropy of text."""
    text = text.lower()
    prob = [float(text.count(c)) / len(text) for c in set(text)]
    return -sum(p * np.log2(p) for p in prob)

def calculate_overall_risk(indicators: PhishingIndicators) -> float:
    """Calculate overall risk score from various indicators."""
    weights = {
        'suspicious_sender_score': 0.2,
        'suspicious_content_score': 0.3,
        'malicious_links_score': 0.3,
        'spoofing_attempt_score': 0.1,
        'social_engineering_score': 0.1
    }
    
    score = sum(
        getattr(indicators, field) * weight
        for field, weight in weights.items()
    )
    
    return min(max(score, 0.0), 1.0)

def generate_recommendations(risk_score: float, indicators: PhishingIndicators) -> List[str]:
    """Generate recommendations based on risk analysis."""
    recs = []
    
    if risk_score > 0.7:
        recs.append("Block this sender and report the email")
    if indicators.suspicious_content_score > 0.6:
        recs.append("Review email content for suspicious patterns")
    if indicators.malicious_links_score > 0.5:
        recs.append("Do not click on any links in this email")
        
    return recs

def extract_iocs(request: EmailAnalysisRequest) -> Dict[str, List[str]]:
    """Extract indicators of compromise from email."""
    iocs = {
        'urls': [],
        'ips': [],
        'emails': [],
        'domains': []
    }
    
    # Basic pattern matching - would use more sophisticated methods in production
    if request.urls:
        iocs['urls'] = request.urls
    
    # Extract domains from URLs
    iocs['domains'] = [urlparse(url).netloc for url in (request.urls or [])]
    
    # Extract IPs using regex
    ip_pattern = r'\b\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}\b'
    iocs['ips'] = re.findall(ip_pattern, request.body)
    
    return iocs