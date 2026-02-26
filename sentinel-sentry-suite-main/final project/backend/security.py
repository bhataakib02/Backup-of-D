"""Security analysis modules for phishing, malware, and network threats."""

from typing import Dict, List, Any, Optional
import re
from urllib.parse import urlparse
import asyncio
from datetime import datetime
import hashlib
from bs4 import BeautifulSoup
import ssl
import socket
import tldextract
import whois
import numpy as np
import requests
import unicodedata
from dataclasses import dataclass

@dataclass
class PhishingIndicators:
    """Phishing risk indicators with normalized scores (0-1)."""
    suspicious_sender_score: float = 0.0
    suspicious_content_score: float = 0.0
    malicious_links_score: float = 0.0
    spoofing_attempt_score: float = 0.0
    social_engineering_score: float = 0.0
    attachment_risk_score: float = 0.0
    ssl_cert_score: float = 0.0
    html_analysis_score: float = 0.0
    homograph_detection_score: float = 0.0
    domain_age_score: float = 0.0

class PhishingDetector:
    def __init__(self):
        self.suspicious_tlds = {'.xyz', '.top', '.click', '.loan', '.work'}
        self.phishing_keywords = {
            'login', 'account', 'secure', 'verify', 'update', 'bank',
            'paypal', 'password', 'credential', 'wallet', 'authenticate'
        }
        self.urgency_keywords = {
            'urgent', 'immediate', 'now', 'asap', 'today', 'warning',
            'limited time', 'act now', 'expires', 'deadline'
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
            
            # Check for suspicious keywords
            matches = [w for w in self.phishing_keywords if w in text]
            if matches:
                score += min(0.4, len(matches) * 0.1)
                details['suspicious_keywords'] = matches
            
            # Look for urgency indicators
            urgency_matches = [w for w in self.urgency_keywords 
                             if w in text]
            if urgency_matches:
                score += min(0.3, len(urgency_matches) * 0.1)
                details['urgency_indicators'] = len(urgency_matches)
                details['suspicious_keywords'] = list(set(
                    matches + urgency_matches
                )) if matches else urgency_matches
            
            # Look for suspicious patterns
            patterns = [
                (r'account.*(?:suspend|block|close)', 'Account status threat'),
                (r'(?:unusual|suspicious).*activity', 'Activity alert'),
                (r'verify.*(?:identity|account)', 'Identity verification'),
                (r'(?:unauthorized|unrecognized).*access', 'Access alert')
            ]
            
            pattern_matches = []
            for pattern, desc in patterns:
                if re.search(pattern, text, re.I):
                    pattern_matches.append(desc)
                    score += 0.2
            
            if pattern_matches:
                details['suspicious_patterns'] = pattern_matches
        
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

def analyze_sender_reputation(sender: str) -> float:
    """Analyze email sender reputation."""
    # In production would check:
    # - SPF/DKIM records
    # - Sender domain age
    # - Known spam patterns
    # - Reputation databases
    return 0.0

def calculate_spoofing_score(auth_results: Dict[str, Any]) -> float:
    """Calculate likelihood of spoofing based on authentication results."""
    score = 0.0
    
    if not auth_results.get('spf_pass'):
        score += 0.4
    if not auth_results.get('dkim_pass'):
        score += 0.4
    if not auth_results.get('dmarc_pass'):
        score += 0.2
        
    return min(score, 1.0)

def analyze_attachments(attachments: List[Dict[str, Any]]) -> float:
    """Analyze attachments for suspicious indicators."""
    if not attachments:
        return 0.0
        
    score = 0.0
    suspicious_exts = {'.exe', '.scr', '.bat', '.cmd', '.js', '.vbs'}
    
    for attachment in attachments:
        ext = attachment.get('filename', '').lower()[-4:]
        if ext in suspicious_exts:
            score += 0.5
        if attachment.get('size', 0) < 1000:  # Suspiciously small
            score += 0.2
            
    return min(score, 1.0)

def detect_homographs(email_content: Dict[str, Any]) -> float:
    """Detect homograph attacks in URLs and domains."""
    score = 0.0
    
    # Check for mixed scripts
    def has_mixed_scripts(text: str) -> bool:
        scripts = set()
        for char in text:
            if char.isalpha():
                scripts.add(unicodedata.name(char).split()[0])
        return len(scripts) > 1
    
    # Check domains in links
    for url in email_content.get('urls', []):
        domain = urlparse(url).netloc
        if has_mixed_scripts(domain):
            score += 0.5
            
    return min(score, 1.0)

def analyze_html_risk(html: str) -> float:
    """Analyze HTML content for suspicious patterns."""
    if not html:
        return 0.0
        
    score = 0.0
    soup = BeautifulSoup(html, 'html.parser')
    
    # Check for forms
    forms = soup.find_all('form')
    for form in forms:
        if not form.get('action'):
            score += 0.3
        if 'password' in str(form).lower():
            score += 0.2
            
    # Check for hidden elements
    hidden = soup.find_all(style=re.compile(r'display:\s*none'))
    if hidden:
        score += 0.2 * len(hidden)
        
    # Check for suspicious redirects
    scripts = soup.find_all('script')
    for script in scripts:
        if 'window.location' in str(script):
            score += 0.3
            
    return min(score, 1.0)

def analyze_forms(soup: BeautifulSoup) -> Dict[str, Any]:
    """Analyze forms in HTML content."""
    forms_analysis = {
        'login_forms': 0,
        'suspicious_forms': [],
        'data_fields': []
    }
    
    for form in soup.find_all('form'):
        inputs = form.find_all('input')
        
        # Check for login forms
        if any(inp.get('type') == 'password' for inp in inputs):
            forms_analysis['login_forms'] += 1
            
            # Check suspicious patterns
            if not form.get('action'):
                forms_analysis['suspicious_forms'].append('No form action')
            if 'javascript:' in str(form.get('action', '')):
                forms_analysis['suspicious_forms'].append('JavaScript form action')
                
        # Track collected data fields
        forms_analysis['data_fields'].extend(
            inp.get('name') for inp in inputs if inp.get('name')
        )
        
    return forms_analysis

def analyze_links(soup: BeautifulSoup) -> Dict[str, Any]:
    """Analyze links in HTML content."""
    links = soup.find_all('a')
    return {
        'total_links': len(links),
        'external_links': sum(1 for link in links if link.get('href', '').startswith('http')),
        'javascript_links': sum(1 for link in links if 'javascript:' in str(link.get('href', '')))
    }

def analyze_images(soup: BeautifulSoup) -> Dict[str, Any]:
    """Analyze images in HTML content."""
    images = soup.find_all('img')
    return {
        'total_images': len(images),
        'hidden_images': sum(1 for img in images if 'display:none' in str(img.get('style', ''))),
        'logo_keywords': sum(1 for img in images if 'logo' in str(img).lower())
    }

def analyze_scripts(soup: BeautifulSoup) -> Dict[str, Any]:
    """Analyze scripts in HTML content."""
    scripts = soup.find_all('script')
    return {
        'total_scripts': len(scripts),
        'external_scripts': sum(1 for script in scripts if script.get('src', '').startswith('http')),
        'suspicious_patterns': [
            'window.location' in str(script) or
            'document.cookie' in str(script)
            for script in scripts
        ].count(True)
    }

def find_hidden_elements(soup: BeautifulSoup) -> List[str]:
    """Find hidden elements that might be used for deception."""
    hidden = []
    
    # Check style attribute
    for elem in soup.find_all(style=re.compile(r'display:\s*none|visibility:\s*hidden')):
        hidden.append(f"Hidden {elem.name}: {elem.get_text()[:50]}")
        
    # Check class names
    for elem in soup.find_all(class_=re.compile(r'hidden|invisible')):
        hidden.append(f"Hidden class {elem.name}: {elem.get_text()[:50]}")
        
    return hidden

def detect_suspicious_patterns(html: str) -> List[str]:
    """Detect suspicious patterns in HTML content."""
    patterns = [
        (r'password.*</label>', 'Password field label'),
        (r'login.*</button>', 'Login button'),
        (r'document\.cookie', 'Cookie manipulation'),
        (r'window\.location', 'Page redirect'),
        (r'eval\(', 'Dynamic code execution')
    ]
    
    found = []
    for pattern, description in patterns:
        if re.search(pattern, html, re.I):
            found.append(description)
            
    return found