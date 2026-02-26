from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, Dict, Any
from .security import phishing_detection, malware_analysis, network_security
from .utils import validate_url, normalize_indicators

app = FastAPI(title="Sentinel Security Platform API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PhishingRequest(BaseModel):
    url: str
    email_text: Optional[str] = None

class ThreatRequest(BaseModel):
    indicator: str
    type: str = "url"  # url, ip, hash, domain

@app.post("/api/security/phishing")
async def check_phishing(request: PhishingRequest) -> Dict[str, Any]:
    """Check URL and email content for phishing indicators."""
    if not validate_url(request.url):
        raise HTTPException(status_code=400, message="Invalid URL format")
    
    result = phishing_detection.analyze(
        url=request.url,
        email_text=request.email_text
    )
    return result

@app.post("/api/security/threat-intel")
async def analyze_threat(request: ThreatRequest) -> Dict[str, Any]:
    """Analyze potential threats using threat intelligence."""
    normalized = normalize_indicators(request.indicator)
    return await network_security.analyze_indicator(
        indicator=normalized,
        indicator_type=request.type
    )

@app.post("/api/security/malware")
async def scan_malware(file: bytes) -> Dict[str, Any]:
    """Scan file or content for malware signatures."""
    return await malware_analysis.scan_sample(file)