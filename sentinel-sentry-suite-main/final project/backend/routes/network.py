from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
import ipaddress
from datetime import datetime
import re
import hashlib

router = APIRouter()

class NetworkScanRequest(BaseModel):
    indicator: str
    type: str

class NetworkScanResult(BaseModel):
    indicator: str
    type: str
    risk_score: float
    alerts: List[str]
    timestamp: str

def validate_ip(ip: str) -> bool:
    try:
        ipaddress.ip_address(ip)
        return True
    except ValueError:
        return False

def validate_domain(domain: str) -> bool:
    domain_pattern = r'^(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$'
    return bool(re.match(domain_pattern, domain))

def validate_hash(hash_str: str) -> bool:
    # Check if it's a valid MD5, SHA1, or SHA256 hash
    valid_lengths = {32, 40, 64}  # MD5=32, SHA1=40, SHA256=64
    return bool(re.match(r'^[a-fA-F0-9]+$', hash_str) and len(hash_str) in valid_lengths)

@router.post("/network/analyze", response_model=NetworkScanResult)
async def analyze_network(request: NetworkScanRequest):
    # Validate input based on type
    if request.type == "ip" and not validate_ip(request.indicator):
        raise HTTPException(status_code=400, detail="Invalid IP address format")
    elif request.type == "domain" and not validate_domain(request.indicator):
        raise HTTPException(status_code=400, detail="Invalid domain format")
    elif request.type == "hash" and not validate_hash(request.indicator):
        raise HTTPException(status_code=400, detail="Invalid hash format")

    # Perform security analysis
    # This is a placeholder implementation - replace with actual security analysis
    alerts = []
    risk_score = 0.0

    if request.type == "ip":
        # Example IP checks
        if request.indicator.startswith("10.") or request.indicator.startswith("192.168."):
            alerts.append("Private IP range detected")
            risk_score = 0.2
        else:
            # Here you would typically check against threat intelligence feeds,
            # reputation databases, etc.
            alerts.append("Public IP address - no known threats")
            risk_score = 0.4

    elif request.type == "domain":
        # Example domain checks
        if len(request.indicator) > 50:
            alerts.append("Unusually long domain name")
            risk_score += 0.3
        if request.indicator.count(".") > 3:
            alerts.append("Multiple subdomain levels")
            risk_score += 0.2
        if not alerts:
            alerts.append("No suspicious patterns detected")

    elif request.type == "hash":
        # Example hash checks
        if len(request.indicator) == 32:
            alerts.append("MD5 hash detected")
            risk_score = 0.5
        elif len(request.indicator) == 40:
            alerts.append("SHA1 hash detected")
            risk_score = 0.4
        elif len(request.indicator) == 64:
            alerts.append("SHA256 hash detected")
            risk_score = 0.3

    # Ensure risk score is between 0 and 1
    risk_score = max(0.0, min(1.0, risk_score))

    return NetworkScanResult(
        indicator=request.indicator,
        type=request.type,
        risk_score=risk_score,
        alerts=alerts,
        timestamp=datetime.utcnow().isoformat()
    )