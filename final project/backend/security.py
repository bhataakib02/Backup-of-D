"""Security analysis modules for phishing, malware, and network threats."""

from typing import Dict, Any, Optional
import re
from urllib.parse import urlparse
import asyncio
from datetime import datetime
import hashlib

class PhishingDetector:
    def __init__(self):
        self.suspicious_tlds = {'.xyz', '.top', '.click', '.loan', '.work'}
        self.phishing_keywords = {
            'login', 'account', 'secure', 'verify', 'update', 'bank',
            'paypal', 'password', 'credential', 'wallet', 'authenticate'
        }
    
    def analyze(self, url: str, email_text: Optional[str] = None) -> Dict[str, Any]:
        """Analyze URL and optional email text for phishing indicators."""
        score = 0.0
        details = {}
        
        # Analyze URL
        if url:
            parsed = urlparse(url)
            hostname = parsed.netloc
            
            # Check TLD
            tld = '.' + hostname.split('.')[-1]
            if tld in self.suspicious_tlds:
                score += 0.4
                details['suspicious_tld'] = tld
            
            # Check for IP as hostname
            if re.match(r'^\d+\.\d+\.\d+\.\d+$', hostname):
                score += 0.6
                details['ip_as_hostname'] = True
            
            # Check subdomain length/complexity
            parts = hostname.split('.')
            if len(parts) > 3:
                score += 0.3
                details['complex_subdomain'] = True
            
            # Entropy check on domain
            entropy = self._calculate_entropy(hostname)
            if entropy > 4.5:
                score += 0.3
                details['high_entropy'] = True
        
        # Analyze email text
        if email_text:
            text = email_text.lower()
            matches = [w for w in self.phishing_keywords if w in text]
            if matches:
                score += min(0.4, len(matches) * 0.1)
                details['suspicious_keywords'] = matches
            
            # Look for urgency indicators
            urgency = len(re.findall(r'urgent|immediate|now|asap|today', text, re.I))
            if urgency > 0:
                score += min(0.3, urgency * 0.1)
                details['urgency_indicators'] = urgency
        
        threat = score >= 0.7
        return {
            "threat": threat,
            "score": round(score, 2),
            "risk_level": "High" if score >= 0.7 else "Medium" if score >= 0.4 else "Low",
            "timestamp": datetime.utcnow().isoformat(),
            "details": details
        }
    
    def _calculate_entropy(self, text: str) -> float:
        """Calculate Shannon entropy of text."""
        text = text.lower()
        prob = [float(text.count(c)) / len(text) for c in set(text)]
        return -sum(p * log2(p) for p in prob)

class MalwareAnalyzer:
    def __init__(self):
        self.signature_db = {}  # Would load signatures in production
        
    async def scan_sample(self, content: bytes) -> Dict[str, Any]:
        """Scan binary content for malware indicators."""
        # Calculate hashes
        md5 = hashlib.md5(content).hexdigest()
        sha256 = hashlib.sha256(content).hexdigest()
        
        # Basic static analysis (demo)
        results = {
            "md5": md5,
            "sha256": sha256,
            "size": len(content),
            "timestamp": datetime.utcnow().isoformat(),
            "indicators": [],
            "risk_score": 0.0
        }
        
        # Demo analysis (would be much more comprehensive in production)
        if b'MZ' in content[:2]:  # PE file
            results["file_type"] = "PE/Windows Executable"
            if b'This program cannot be run in DOS mode' in content:
                results["indicators"].append("DOS Stub present")
        
        # Simulate some async processing
        await asyncio.sleep(0.1)
        
        return results

class NetworkSecurityAnalyzer:
    def __init__(self):
        self.known_bad_ips = set()  # Would load from threat feeds
        self.known_bad_domains = set()
    
    async def analyze_indicator(self, indicator: str, indicator_type: str) -> Dict[str, Any]:
        """Analyze network indicator for threats."""
        result = {
            "indicator": indicator,
            "type": indicator_type,
            "timestamp": datetime.utcnow().isoformat(),
            "risk_score": 0.0,
            "alerts": []
        }
        
        if indicator_type == "ip":
            # IP reputation check (demo)
            octets = indicator.split('.')
            if len(octets) == 4:
                if octets[0] in {'10', '172', '192'}:
                    result["alerts"].append("Private IP range")
                if indicator in self.known_bad_ips:
                    result["risk_score"] = 1.0
                    result["alerts"].append("Known malicious IP")
        
        elif indicator_type == "domain":
            # Domain analysis
            if indicator in self.known_bad_domains:
                result["risk_score"] = 1.0
                result["alerts"].append("Known malicious domain")
            elif any(tld in indicator for tld in {'.xyz', '.top', '.click'}):
                result["risk_score"] = 0.4
                result["alerts"].append("Suspicious TLD")
        
        # Simulate external lookups
        await asyncio.sleep(0.1)
        
        return result

# Initialize modules
phishing_detection = PhishingDetector()
malware_analysis = MalwareAnalyzer()
network_security = NetworkSecurityAnalyzer()

def log2(x: float) -> float:
    """Calculate log base 2."""
    from math import log
    return log(x, 2) if x > 0 else 0