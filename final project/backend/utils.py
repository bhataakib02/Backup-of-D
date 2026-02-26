"""Security analysis and detection utilities."""

import re
from urllib.parse import urlparse
from typing import Optional, Dict, Any
import hashlib

def validate_url(url: str) -> bool:
    """Validate URL format."""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except:
        return False

def normalize_indicators(value: str) -> str:
    """Normalize IOCs for consistent analysis."""
    value = value.strip().lower()
    # Remove common prefixes
    value = re.sub(r'^(https?://|hxxps?://|www\.)', '', value)
    # Convert defanged indicators
    value = value.replace('[.]', '.').replace('(.)', '.')
    return value

def extract_iocs_from_text(text: str) -> Dict[str, list]:
    """Extract potential IOCs from text."""
    iocs = {
        'urls': [],
        'ips': [],
        'hashes': [],
        'domains': []
    }
    
    # URLs
    url_pattern = r'https?://[^\s<>"\']+|www\.[^\s<>"\']+\.[a-zA-Z]{2,}'
    iocs['urls'].extend(re.findall(url_pattern, text))
    
    # IPs
    ip_pattern = r'\b(?:\d{1,3}\.){3}\d{1,3}\b'
    iocs['ips'].extend(re.findall(ip_pattern, text))
    
    # MD5/SHA hashes
    hash_pattern = r'\b[a-fA-F0-9]{32}\b|\b[a-fA-F0-9]{40}\b|\b[a-fA-F0-9]{64}\b'
    iocs['hashes'].extend(re.findall(hash_pattern, text))
    
    # Domains
    domain_pattern = r'\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b'
    domains = re.findall(domain_pattern, text)
    iocs['domains'].extend([d for d in domains if d not in iocs['urls']])
    
    return iocs

def generate_threat_score(indicators: Dict[str, Any]) -> float:
    """Generate a normalized threat score from various indicators."""
    score = 0.0
    weights = {
        'suspicious_tld': 0.4,
        'ip_hostname': 0.6,
        'long_subdomain': 0.3,
        'suspicious_keywords': 0.4,
        'entropy': 0.3
    }
    
    # Check TLD
    suspicious_tlds = {'.xyz', '.top', '.click', '.loan', '.work'}
    if any(ind.endswith(tld) for tld in suspicious_tlds for ind in indicators.get('domains', [])):
        score += weights['suspicious_tld']
    
    # Check for IP as hostname
    if any(re.match(r'^\d+\.\d+\.\d+\.\d+$', d) for d in indicators.get('domains', [])):
        score += weights['ip_hostname']
    
    # Long subdomains
    if any(d.count('.') > 3 for d in indicators.get('domains', [])):
        score += weights['long_subdomain']
    
    # Suspicious keywords
    keywords = {'login', 'account', 'secure', 'verify', 'update', 'auth'}
    text = ' '.join(str(v) for v in indicators.values())
    if any(k in text.lower() for k in keywords):
        score += weights['suspicious_keywords']
    
    # Calculate Shannon entropy for domains
    for domain in indicators.get('domains', []):
        entropy = shannon_entropy(domain)
        if entropy > 4.5:  # High entropy often indicates DGA
            score += weights['entropy']
    
    return min(score, 1.0)

def shannon_entropy(text: str) -> float:
    """Calculate Shannon entropy of text."""
    text = text.lower()
    prob = [float(text.count(c)) / len(text) for c in set(text)]
    return -sum(p * log2(p) for p in prob)

def log2(x: float) -> float:
    """Calculate log base 2."""
    from math import log
    return log(x, 2) if x > 0 else 0