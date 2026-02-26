"""
Security utilities for the AI/ML Cybersecurity Platform
"""

import re
import hashlib
import hmac
import secrets
import base64
import ipaddress
import dns.resolver
import ssl
import socket
from urllib.parse import urlparse, urljoin
from typing import Dict, List, Optional, Tuple, Any
import requests
import yara
import logging
from datetime import datetime, timedelta
import json

logger = logging.getLogger(__name__)

class URLAnalyzer:
    """URL analysis utilities for phishing detection"""
    
    def __init__(self):
        self.suspicious_keywords = [
            'secure', 'account', 'verify', 'update', 'confirm', 'login', 'password',
            'bank', 'paypal', 'amazon', 'microsoft', 'apple', 'google', 'facebook',
            'suspended', 'locked', 'expired', 'urgent', 'immediate', 'action',
            'click', 'here', 'now', 'today', 'limited', 'offer', 'free', 'win',
            'congratulations', 'winner', 'prize', 'lottery', 'inheritance'
        ]
        
        self.suspicious_domains = [
            'bit.ly', 'tinyurl.com', 'goo.gl', 't.co', 'ow.ly', 'short.link',
            'is.gd', 'v.gd', 'clck.ru', 'cutt.ly', 'shorturl.at'
        ]
        
        self.trusted_domains = [
            'google.com', 'microsoft.com', 'apple.com', 'amazon.com', 'paypal.com',
            'facebook.com', 'twitter.com', 'linkedin.com', 'github.com', 'stackoverflow.com'
        ]
    
    def analyze_url(self, url: str) -> Dict[str, Any]:
        """Comprehensive URL analysis"""
        try:
            parsed_url = urlparse(url)
            
            analysis = {
                'url': url,
                'domain': parsed_url.netloc,
                'path': parsed_url.path,
                'query': parsed_url.query,
                'fragment': parsed_url.fragment,
                'scheme': parsed_url.scheme,
                'port': parsed_url.port,
                'is_valid': self._is_valid_url(url),
                'is_https': parsed_url.scheme == 'https',
                'is_ip_address': self._is_ip_address(parsed_url.netloc),
                'url_length': len(url),
                'domain_length': len(parsed_url.netloc),
                'path_length': len(parsed_url.path),
                'query_length': len(parsed_url.query),
                'dot_count': url.count('.'),
                'slash_count': url.count('/'),
                'hyphen_count': url.count('-'),
                'suspicious_keywords': self._find_suspicious_keywords(url),
                'is_shortened': self._is_shortened_url(parsed_url.netloc),
                'is_trusted_domain': self._is_trusted_domain(parsed_url.netloc),
                'subdomain_count': self._count_subdomains(parsed_url.netloc),
                'has_suspicious_tld': self._has_suspicious_tld(parsed_url.netloc),
                'ssl_certificate': self._check_ssl_certificate(parsed_url.netloc),
                'dns_records': self._get_dns_records(parsed_url.netloc),
                'whois_info': self._get_whois_info(parsed_url.netloc),
                'reputation_score': self._calculate_reputation_score(url),
                'risk_score': 0.0,
                'is_phishing': False,
                'confidence': 0.0
            }
            
            # Calculate risk score
            analysis['risk_score'] = self._calculate_risk_score(analysis)
            
            # Determine if phishing
            analysis['is_phishing'] = analysis['risk_score'] > 0.7
            analysis['confidence'] = min(analysis['risk_score'], 1.0)
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing URL {url}: {str(e)}")
            return {'error': str(e), 'url': url}
    
    def _is_valid_url(self, url: str) -> bool:
        """Check if URL is valid"""
        try:
            result = urlparse(url)
            return all([result.scheme, result.netloc])
        except:
            return False
    
    def _is_ip_address(self, hostname: str) -> bool:
        """Check if hostname is an IP address"""
        try:
            ipaddress.ip_address(hostname)
            return True
        except ValueError:
            return False
    
    def _find_suspicious_keywords(self, url: str) -> List[str]:
        """Find suspicious keywords in URL"""
        found_keywords = []
        url_lower = url.lower()
        
        for keyword in self.suspicious_keywords:
            if keyword in url_lower:
                found_keywords.append(keyword)
        
        return found_keywords
    
    def _is_shortened_url(self, domain: str) -> bool:
        """Check if URL is shortened"""
        return domain in self.suspicious_domains
    
    def _is_trusted_domain(self, domain: str) -> bool:
        """Check if domain is trusted"""
        return domain in self.trusted_domains
    
    def _count_subdomains(self, domain: str) -> int:
        """Count number of subdomains"""
        return domain.count('.') - 1
    
    def _has_suspicious_tld(self, domain: str) -> bool:
        """Check for suspicious TLD"""
        suspicious_tlds = ['.tk', '.ml', '.ga', '.cf', '.click', '.download']
        return any(domain.endswith(tld) for tld in suspicious_tlds)
    
    def _check_ssl_certificate(self, domain: str) -> Dict[str, Any]:
        """Check SSL certificate"""
        try:
            context = ssl.create_default_context()
            with socket.create_connection((domain, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=domain) as ssock:
                    cert = ssock.getpeercert()
                    return {
                        'valid': True,
                        'issuer': cert.get('issuer', {}),
                        'subject': cert.get('subject', {}),
                        'version': cert.get('version'),
                        'serial_number': cert.get('serialNumber'),
                        'not_before': cert.get('notBefore'),
                        'not_after': cert.get('notAfter'),
                        'signature_algorithm': cert.get('signatureAlgorithm')
                    }
        except:
            return {'valid': False, 'error': 'SSL certificate check failed'}
    
    def _get_dns_records(self, domain: str) -> Dict[str, Any]:
        """Get DNS records for domain"""
        try:
            records = {}
            
            # A records
            try:
                a_records = dns.resolver.resolve(domain, 'A')
                records['A'] = [str(record) for record in a_records]
            except:
                records['A'] = []
            
            # AAAA records
            try:
                aaaa_records = dns.resolver.resolve(domain, 'AAAA')
                records['AAAA'] = [str(record) for record in aaaa_records]
            except:
                records['AAAA'] = []
            
            # MX records
            try:
                mx_records = dns.resolver.resolve(domain, 'MX')
                records['MX'] = [str(record) for record in mx_records]
            except:
                records['MX'] = []
            
            # TXT records
            try:
                txt_records = dns.resolver.resolve(domain, 'TXT')
                records['TXT'] = [str(record) for record in txt_records]
            except:
                records['TXT'] = []
            
            return records
            
        except Exception as e:
            logger.error(f"Error getting DNS records for {domain}: {str(e)}")
            return {'error': str(e)}
    
    def _get_whois_info(self, domain: str) -> Dict[str, Any]:
        """Get WHOIS information for domain"""
        try:
            import whois
            w = whois.whois(domain)
            return {
                'domain_name': w.domain_name,
                'registrar': w.registrar,
                'creation_date': str(w.creation_date) if w.creation_date else None,
                'expiration_date': str(w.expiration_date) if w.expiration_date else None,
                'updated_date': str(w.updated_date) if w.updated_date else None,
                'name_servers': w.name_servers,
                'status': w.status,
                'emails': w.emails,
                'dnssec': w.dnssec,
                'country': w.country,
                'state': w.state,
                'city': w.city,
                'org': w.org
            }
        except Exception as e:
            logger.error(f"Error getting WHOIS info for {domain}: {str(e)}")
            return {'error': str(e)}
    
    def _calculate_reputation_score(self, url: str) -> float:
        """Calculate reputation score for URL"""
        score = 0.5  # Base score
        
        # Check against threat intelligence
        # This would integrate with external APIs
        # For now, return base score
        return score
    
    def _calculate_risk_score(self, analysis: Dict[str, Any]) -> float:
        """Calculate overall risk score"""
        risk_factors = []
        
        # URL length risk
        if analysis['url_length'] > 100:
            risk_factors.append(0.3)
        
        # IP address risk
        if analysis['is_ip_address']:
            risk_factors.append(0.4)
        
        # Suspicious keywords risk
        if analysis['suspicious_keywords']:
            risk_factors.append(0.2 * len(analysis['suspicious_keywords']))
        
        # Shortened URL risk
        if analysis['is_shortened']:
            risk_factors.append(0.3)
        
        # Subdomain count risk
        if analysis['subdomain_count'] > 2:
            risk_factors.append(0.2)
        
        # Suspicious TLD risk
        if analysis['has_suspicious_tld']:
            risk_factors.append(0.4)
        
        # SSL certificate risk
        if not analysis['ssl_certificate']['valid']:
            risk_factors.append(0.3)
        
        # Trusted domain bonus
        if analysis['is_trusted_domain']:
            risk_factors.append(-0.2)
        
        # Calculate final risk score
        risk_score = sum(risk_factors)
        return max(0.0, min(1.0, risk_score))

class EmailAnalyzer:
    """Email analysis utilities for phishing detection"""
    
    def __init__(self):
        self.suspicious_subjects = [
            'urgent', 'immediate', 'action required', 'verify', 'confirm',
            'suspended', 'locked', 'expired', 'security alert', 'fraud',
            'win', 'congratulations', 'prize', 'lottery', 'inheritance'
        ]
        
        self.suspicious_senders = [
            'noreply', 'no-reply', 'donotreply', 'support', 'security',
            'admin', 'administrator', 'system', 'automated'
        ]
    
    def analyze_email(self, email_content: str, subject: str = '', sender: str = '') -> Dict[str, Any]:
        """Comprehensive email analysis"""
        try:
            analysis = {
                'subject': subject,
                'sender': sender,
                'content_length': len(email_content),
                'subject_length': len(subject),
                'sender_length': len(sender),
                'has_attachments': self._has_attachments(email_content),
                'has_links': self._has_links(email_content),
                'link_count': self._count_links(email_content),
                'suspicious_subject_keywords': self._find_suspicious_subject_keywords(subject),
                'suspicious_sender_keywords': self._find_suspicious_sender_keywords(sender),
                'spelling_errors': self._count_spelling_errors(email_content),
                'grammar_errors': self._count_grammar_errors(email_content),
                'urgency_indicators': self._find_urgency_indicators(email_content),
                'threat_indicators': self._find_threat_indicators(email_content),
                'social_engineering_indicators': self._find_social_engineering_indicators(email_content),
                'headers_analysis': self._analyze_headers(email_content),
                'risk_score': 0.0,
                'is_phishing': False,
                'confidence': 0.0
            }
            
            # Calculate risk score
            analysis['risk_score'] = self._calculate_email_risk_score(analysis)
            
            # Determine if phishing
            analysis['is_phishing'] = analysis['risk_score'] > 0.6
            analysis['confidence'] = min(analysis['risk_score'], 1.0)
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing email: {str(e)}")
            return {'error': str(e)}
    
    def _has_attachments(self, content: str) -> bool:
        """Check if email has attachments"""
        attachment_indicators = ['attachment', 'attached', 'enclosed', 'file']
        return any(indicator in content.lower() for indicator in attachment_indicators)
    
    def _has_links(self, content: str) -> bool:
        """Check if email has links"""
        url_pattern = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        return bool(re.search(url_pattern, content))
    
    def _count_links(self, content: str) -> int:
        """Count number of links in email"""
        url_pattern = r'http[s]?://(?:[a-zA-Z]|[0-9]|[$-_@.&+]|[!*\\(\\),]|(?:%[0-9a-fA-F][0-9a-fA-F]))+'
        return len(re.findall(url_pattern, content))
    
    def _find_suspicious_subject_keywords(self, subject: str) -> List[str]:
        """Find suspicious keywords in subject"""
        found_keywords = []
        subject_lower = subject.lower()
        
        for keyword in self.suspicious_subjects:
            if keyword in subject_lower:
                found_keywords.append(keyword)
        
        return found_keywords
    
    def _find_suspicious_sender_keywords(self, sender: str) -> List[str]:
        """Find suspicious keywords in sender"""
        found_keywords = []
        sender_lower = sender.lower()
        
        for keyword in self.suspicious_senders:
            if keyword in sender_lower:
                found_keywords.append(keyword)
        
        return found_keywords
    
    def _count_spelling_errors(self, content: str) -> int:
        """Count spelling errors in content"""
        # Simple implementation - would use spell checker in production
        common_misspellings = ['recieve', 'seperate', 'occured', 'definately', 'accomodate']
        error_count = 0
        
        for misspelling in common_misspellings:
            error_count += content.lower().count(misspelling)
        
        return error_count
    
    def _count_grammar_errors(self, content: str) -> int:
        """Count grammar errors in content"""
        # Simple implementation - would use grammar checker in production
        grammar_errors = ['you are', 'your', 'there', 'their', 'they\'re']
        error_count = 0
        
        for error in grammar_errors:
            error_count += content.lower().count(error)
        
        return error_count
    
    def _find_urgency_indicators(self, content: str) -> List[str]:
        """Find urgency indicators in content"""
        urgency_indicators = [
            'urgent', 'immediate', 'asap', 'now', 'today', 'deadline',
            'expires', 'limited time', 'act now', 'don\'t delay'
        ]
        
        found_indicators = []
        content_lower = content.lower()
        
        for indicator in urgency_indicators:
            if indicator in content_lower:
                found_indicators.append(indicator)
        
        return found_indicators
    
    def _find_threat_indicators(self, content: str) -> List[str]:
        """Find threat indicators in content"""
        threat_indicators = [
            'suspended', 'locked', 'closed', 'terminated', 'fraud',
            'security breach', 'unauthorized access', 'compromised'
        ]
        
        found_indicators = []
        content_lower = content.lower()
        
        for indicator in threat_indicators:
            if indicator in content_lower:
                found_indicators.append(indicator)
        
        return found_indicators
    
    def _find_social_engineering_indicators(self, content: str) -> List[str]:
        """Find social engineering indicators in content"""
        se_indicators = [
            'verify your account', 'confirm your identity', 'update your information',
            'click here', 'download now', 'free offer', 'limited time',
            'congratulations', 'you have won', 'inheritance', 'lottery'
        ]
        
        found_indicators = []
        content_lower = content.lower()
        
        for indicator in se_indicators:
            if indicator in content_lower:
                found_indicators.append(indicator)
        
        return found_indicators
    
    def _analyze_headers(self, content: str) -> Dict[str, Any]:
        """Analyze email headers"""
        try:
            # Extract headers from email content
            headers = {}
            lines = content.split('\n')
            
            for line in lines:
                if ':' in line and not line.startswith(' '):
                    key, value = line.split(':', 1)
                    headers[key.strip().lower()] = value.strip()
            
            return {
                'from': headers.get('from', ''),
                'to': headers.get('to', ''),
                'subject': headers.get('subject', ''),
                'date': headers.get('date', ''),
                'message-id': headers.get('message-id', ''),
                'return-path': headers.get('return-path', ''),
                'received': headers.get('received', ''),
                'spf': headers.get('received-spf', ''),
                'dkim': headers.get('dkim-signature', ''),
                'dmarc': headers.get('dmarc', '')
            }
            
        except Exception as e:
            logger.error(f"Error analyzing headers: {str(e)}")
            return {'error': str(e)}
    
    def _calculate_email_risk_score(self, analysis: Dict[str, Any]) -> float:
        """Calculate email risk score"""
        risk_factors = []
        
        # Suspicious subject keywords
        if analysis['suspicious_subject_keywords']:
            risk_factors.append(0.2 * len(analysis['suspicious_subject_keywords']))
        
        # Suspicious sender keywords
        if analysis['suspicious_sender_keywords']:
            risk_factors.append(0.1 * len(analysis['suspicious_sender_keywords']))
        
        # Urgency indicators
        if analysis['urgency_indicators']:
            risk_factors.append(0.3 * len(analysis['urgency_indicators']))
        
        # Threat indicators
        if analysis['threat_indicators']:
            risk_factors.append(0.4 * len(analysis['threat_indicators']))
        
        # Social engineering indicators
        if analysis['social_engineering_indicators']:
            risk_factors.append(0.3 * len(analysis['social_engineering_indicators']))
        
        # Spelling errors
        if analysis['spelling_errors'] > 0:
            risk_factors.append(0.1 * analysis['spelling_errors'])
        
        # Grammar errors
        if analysis['grammar_errors'] > 0:
            risk_factors.append(0.1 * analysis['grammar_errors'])
        
        # Calculate final risk score
        risk_score = sum(risk_factors)
        return max(0.0, min(1.0, risk_score))

class ThreatIntelligence:
    """Threat intelligence utilities"""
    
    def __init__(self):
        self.virustotal_api_key = None
        self.abuseipdb_api_key = None
        self.otx_api_key = None
    
    def check_ip_reputation(self, ip_address: str) -> Dict[str, Any]:
        """Check IP reputation using multiple sources"""
        try:
            reputation = {
                'ip': ip_address,
                'virustotal': self._check_virustotal_ip(ip_address),
                'abuseipdb': self._check_abuseipdb_ip(ip_address),
                'otx': self._check_otx_ip(ip_address),
                'overall_score': 0.0,
                'is_malicious': False
            }
            
            # Calculate overall score
            scores = []
            if reputation['virustotal']:
                scores.append(reputation['virustotal'].get('score', 0.5))
            if reputation['abuseipdb']:
                scores.append(reputation['abuseipdb'].get('score', 0.5))
            if reputation['otx']:
                scores.append(reputation['otx'].get('score', 0.5))
            
            if scores:
                reputation['overall_score'] = sum(scores) / len(scores)
                reputation['is_malicious'] = reputation['overall_score'] > 0.7
            
            return reputation
            
        except Exception as e:
            logger.error(f"Error checking IP reputation for {ip_address}: {str(e)}")
            return {'error': str(e)}
    
    def check_domain_reputation(self, domain: str) -> Dict[str, Any]:
        """Check domain reputation using multiple sources"""
        try:
            reputation = {
                'domain': domain,
                'virustotal': self._check_virustotal_domain(domain),
                'otx': self._check_otx_domain(domain),
                'overall_score': 0.0,
                'is_malicious': False
            }
            
            # Calculate overall score
            scores = []
            if reputation['virustotal']:
                scores.append(reputation['virustotal'].get('score', 0.5))
            if reputation['otx']:
                scores.append(reputation['otx'].get('score', 0.5))
            
            if scores:
                reputation['overall_score'] = sum(scores) / len(scores)
                reputation['is_malicious'] = reputation['overall_score'] > 0.7
            
            return reputation
            
        except Exception as e:
            logger.error(f"Error checking domain reputation for {domain}: {str(e)}")
            return {'error': str(e)}
    
    def check_hash_reputation(self, file_hash: str) -> Dict[str, Any]:
        """Check file hash reputation using multiple sources"""
        try:
            reputation = {
                'hash': file_hash,
                'virustotal': self._check_virustotal_hash(file_hash),
                'otx': self._check_otx_hash(file_hash),
                'overall_score': 0.0,
                'is_malicious': False
            }
            
            # Calculate overall score
            scores = []
            if reputation['virustotal']:
                scores.append(reputation['virustotal'].get('score', 0.5))
            if reputation['otx']:
                scores.append(reputation['otx'].get('score', 0.5))
            
            if scores:
                reputation['overall_score'] = sum(scores) / len(scores)
                reputation['is_malicious'] = reputation['overall_score'] > 0.7
            
            return reputation
            
        except Exception as e:
            logger.error(f"Error checking hash reputation for {file_hash}: {str(e)}")
            return {'error': str(e)}
    
    def _check_virustotal_ip(self, ip_address: str) -> Dict[str, Any]:
        """Check IP reputation with VirusTotal"""
        try:
            if not self.virustotal_api_key:
                return None
            
            url = f"https://www.virustotal.com/vtapi/v2/ip-address/report"
            params = {
                'apikey': self.virustotal_api_key,
                'ip': ip_address
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return {
                    'score': data.get('positives', 0) / max(data.get('total', 1), 1),
                    'detections': data.get('positives', 0),
                    'total_scans': data.get('total', 0),
                    'country': data.get('country', ''),
                    'asn': data.get('asn', ''),
                    'last_scan': data.get('scan_date', '')
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error checking VirusTotal IP: {str(e)}")
            return None
    
    def _check_virustotal_domain(self, domain: str) -> Dict[str, Any]:
        """Check domain reputation with VirusTotal"""
        try:
            if not self.virustotal_api_key:
                return None
            
            url = f"https://www.virustotal.com/vtapi/v2/domain/report"
            params = {
                'apikey': self.virustotal_api_key,
                'domain': domain
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return {
                    'score': data.get('positives', 0) / max(data.get('total', 1), 1),
                    'detections': data.get('positives', 0),
                    'total_scans': data.get('total', 0),
                    'last_scan': data.get('scan_date', '')
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error checking VirusTotal domain: {str(e)}")
            return None
    
    def _check_virustotal_hash(self, file_hash: str) -> Dict[str, Any]:
        """Check file hash reputation with VirusTotal"""
        try:
            if not self.virustotal_api_key:
                return None
            
            url = f"https://www.virustotal.com/vtapi/v2/file/report"
            params = {
                'apikey': self.virustotal_api_key,
                'resource': file_hash
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return {
                    'score': data.get('positives', 0) / max(data.get('total', 1), 1),
                    'detections': data.get('positives', 0),
                    'total_scans': data.get('total', 0),
                    'scan_date': data.get('scan_date', ''),
                    'md5': data.get('md5', ''),
                    'sha1': data.get('sha1', ''),
                    'sha256': data.get('sha256', '')
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error checking VirusTotal hash: {str(e)}")
            return None
    
    def _check_abuseipdb_ip(self, ip_address: str) -> Dict[str, Any]:
        """Check IP reputation with AbuseIPDB"""
        try:
            if not self.abuseipdb_api_key:
                return None
            
            url = "https://api.abuseipdb.com/api/v2/check"
            params = {
                'ipAddress': ip_address,
                'maxAgeInDays': 90,
                'verbose': ''
            }
            headers = {
                'Key': self.abuseipdb_api_key,
                'Accept': 'application/json'
            }
            
            response = requests.get(url, params=params, headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                result = data.get('data', {})
                return {
                    'score': result.get('abuseConfidencePercentage', 0) / 100.0,
                    'abuse_confidence': result.get('abuseConfidencePercentage', 0),
                    'country': result.get('countryCode', ''),
                    'usage_type': result.get('usageType', ''),
                    'isp': result.get('isp', ''),
                    'last_reported': result.get('lastReportedAt', '')
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error checking AbuseIPDB IP: {str(e)}")
            return None
    
    def _check_otx_ip(self, ip_address: str) -> Dict[str, Any]:
        """Check IP reputation with OTX"""
        try:
            if not self.otx_api_key:
                return None
            
            url = f"https://otx.alienvault.com/api/v1/indicators/IPv4/{ip_address}/general"
            headers = {
                'X-OTX-API-KEY': self.otx_api_key
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return {
                    'score': 0.8 if data.get('pulse_info', {}).get('count', 0) > 0 else 0.2,
                    'pulse_count': data.get('pulse_info', {}).get('count', 0),
                    'references': data.get('pulse_info', {}).get('references', []),
                    'tags': data.get('pulse_info', {}).get('tags', [])
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error checking OTX IP: {str(e)}")
            return None
    
    def _check_otx_domain(self, domain: str) -> Dict[str, Any]:
        """Check domain reputation with OTX"""
        try:
            if not self.otx_api_key:
                return None
            
            url = f"https://otx.alienvault.com/api/v1/indicators/domain/{domain}/general"
            headers = {
                'X-OTX-API-KEY': self.otx_api_key
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return {
                    'score': 0.8 if data.get('pulse_info', {}).get('count', 0) > 0 else 0.2,
                    'pulse_count': data.get('pulse_info', {}).get('count', 0),
                    'references': data.get('pulse_info', {}).get('references', []),
                    'tags': data.get('pulse_info', {}).get('tags', [])
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error checking OTX domain: {str(e)}")
            return None
    
    def _check_otx_hash(self, file_hash: str) -> Dict[str, Any]:
        """Check file hash reputation with OTX"""
        try:
            if not self.otx_api_key:
                return None
            
            url = f"https://otx.alienvault.com/api/v1/indicators/file/{file_hash}/general"
            headers = {
                'X-OTX-API-KEY': self.otx_api_key
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return {
                    'score': 0.8 if data.get('pulse_info', {}).get('count', 0) > 0 else 0.2,
                    'pulse_count': data.get('pulse_info', {}).get('count', 0),
                    'references': data.get('pulse_info', {}).get('references', []),
                    'tags': data.get('pulse_info', {}).get('tags', [])
                }
            
            return None
            
        except Exception as e:
            logger.error(f"Error checking OTX hash: {str(e)}")
            return None

# Global instances
url_analyzer = URLAnalyzer()
email_analyzer = EmailAnalyzer()
threat_intelligence = ThreatIntelligence()

def get_url_analyzer() -> URLAnalyzer:
    """Get URL analyzer instance"""
    return url_analyzer

def get_email_analyzer() -> EmailAnalyzer:
    """Get email analyzer instance"""
    return email_analyzer

def get_threat_intelligence() -> ThreatIntelligence:
    """Get threat intelligence instance"""
    return threat_intelligence



