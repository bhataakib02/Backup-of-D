"""
Threat Intelligence Service - Functions 281-320
AI/ML Cybersecurity Platform
"""

import os
import json
import requests
import hashlib
from typing import Dict, List, Optional, Any
from datetime import datetime, timedelta
import logging
import ipaddress
import dns.resolver
import whois
from urllib.parse import urlparse

from utils.logging_utils import get_security_logger
from database.models import ThreatIntelligence, Alert

logger = logging.getLogger(__name__)
security_logger = get_security_logger()

class ThreatIntelligenceService:
    """Threat intelligence service implementing functions 281-320"""
    
    def __init__(self):
        self.api_keys = {
            'virustotal': os.environ.get('VIRUSTOTAL_API_KEY'),
            'abuseipdb': os.environ.get('ABUSEIPDB_API_KEY'),
            'shodan': os.environ.get('SHODAN_API_KEY')
        }
        self.threat_feeds = {}
        self.load_threat_feeds()
    
    def load_threat_feeds(self):
        """Load threat intelligence feeds"""
        try:
            if os.path.exists('feeds/threat_feeds.json'):
                with open('feeds/threat_feeds.json', 'r') as f:
                    self.threat_feeds = json.load(f)
            
            logger.info(f"Loaded {len(self.threat_feeds)} threat feeds")
            
        except Exception as e:
            logger.error(f"Error loading threat feeds: {str(e)}")
    
    # Function 89: IP reputation check
    def check_ip_reputation(self, ip_address: str) -> Dict[str, Any]:
        """Check IP address reputation"""
        try:
            # Validate IP address
            try:
                ipaddress.ip_address(ip_address)
            except ValueError:
                return {'error': 'Invalid IP address'}
            
            reputation_data = {
                'ip_address': ip_address,
                'is_malicious': False,
                'reputation_score': 0.0,
                'threat_types': [],
                'sources': [],
                'last_seen': None,
                'country': None,
                'asn': None
            }
            
            # Check VirusTotal
            vt_result = self._check_virustotal_ip(ip_address)
            if vt_result:
                reputation_data.update(vt_result)
            
            # Check AbuseIPDB
            abuse_result = self._check_abuseipdb(ip_address)
            if abuse_result:
                reputation_data.update(abuse_result)
            
            # Check Shodan
            shodan_result = self._check_shodan_ip(ip_address)
            if shodan_result:
                reputation_data.update(shodan_result)
            
            # Check threat feeds
            feed_result = self._check_threat_feeds_ip(ip_address)
            if feed_result:
                reputation_data.update(feed_result)
            
            return reputation_data
            
        except Exception as e:
            logger.error(f"Error checking IP reputation: {str(e)}")
            return {'error': str(e)}
    
    # Function 90: Domain reputation check
    def check_domain_reputation(self, domain: str) -> Dict[str, Any]:
        """Check domain reputation"""
        try:
            # Validate domain
            try:
                parsed = urlparse(f"http://{domain}")
                if not parsed.netloc:
                    return {'error': 'Invalid domain'}
            except:
                return {'error': 'Invalid domain'}
            
            reputation_data = {
                'domain': domain,
                'is_malicious': False,
                'reputation_score': 0.0,
                'threat_types': [],
                'sources': [],
                'registration_date': None,
                'expiration_date': None,
                'registrar': None,
                'nameservers': []
            }
            
            # Check VirusTotal
            vt_result = self._check_virustotal_domain(domain)
            if vt_result:
                reputation_data.update(vt_result)
            
            # Check WHOIS
            whois_result = self._check_whois_domain(domain)
            if whois_result:
                reputation_data.update(whois_result)
            
            # Check DNS
            dns_result = self._check_dns_domain(domain)
            if dns_result:
                reputation_data.update(dns_result)
            
            # Check threat feeds
            feed_result = self._check_threat_feeds_domain(domain)
            if feed_result:
                reputation_data.update(feed_result)
            
            return reputation_data
            
        except Exception as e:
            logger.error(f"Error checking domain reputation: {str(e)}")
            return {'error': str(e)}
    
    # Function 91: Hash reputation check
    def check_hash_reputation(self, file_hash: str) -> Dict[str, Any]:
        """Check file hash reputation"""
        try:
            # Validate hash
            if len(file_hash) not in [32, 40, 64]:  # MD5, SHA1, SHA256
                return {'error': 'Invalid hash format'}
            
            reputation_data = {
                'file_hash': file_hash,
                'hash_type': 'md5' if len(file_hash) == 32 else 'sha1' if len(file_hash) == 40 else 'sha256',
                'is_malicious': False,
                'reputation_score': 0.0,
                'threat_types': [],
                'sources': [],
                'detection_count': 0,
                'total_scans': 0,
                'first_seen': None,
                'last_seen': None
            }
            
            # Check VirusTotal
            vt_result = self._check_virustotal_hash(file_hash)
            if vt_result:
                reputation_data.update(vt_result)
            
            # Check threat feeds
            feed_result = self._check_threat_feeds_hash(file_hash)
            if feed_result:
                reputation_data.update(feed_result)
            
            return reputation_data
            
        except Exception as e:
            logger.error(f"Error checking hash reputation: {str(e)}")
            return {'error': str(e)}
    
    # Function 92: URL reputation check
    def check_url_reputation(self, url: str) -> Dict[str, Any]:
        """Check URL reputation"""
        try:
            # Validate URL
            try:
                parsed = urlparse(url)
                if not parsed.scheme or not parsed.netloc:
                    return {'error': 'Invalid URL'}
            except:
                return {'error': 'Invalid URL'}
            
            reputation_data = {
                'url': url,
                'domain': parsed.netloc,
                'is_malicious': False,
                'reputation_score': 0.0,
                'threat_types': [],
                'sources': [],
                'first_seen': None,
                'last_seen': None
            }
            
            # Check VirusTotal
            vt_result = self._check_virustotal_url(url)
            if vt_result:
                reputation_data.update(vt_result)
            
            # Check domain reputation
            domain_result = self.check_domain_reputation(parsed.netloc)
            if domain_result and not domain_result.get('error'):
                reputation_data.update(domain_result)
            
            # Check threat feeds
            feed_result = self._check_threat_feeds_url(url)
            if feed_result:
                reputation_data.update(feed_result)
            
            return reputation_data
            
        except Exception as e:
            logger.error(f"Error checking URL reputation: {str(e)}")
            return {'error': str(e)}
    
    # Function 93: Threat feed integration
    def integrate_threat_feeds(self, feed_urls: List[str]) -> Dict[str, Any]:
        """Integrate threat intelligence feeds"""
        try:
            integrated_feeds = []
            failed_feeds = []
            
            for feed_url in feed_urls:
                try:
                    feed_data = self._fetch_threat_feed(feed_url)
                    if feed_data:
                        integrated_feeds.append({
                            'url': feed_url,
                            'data': feed_data,
                            'status': 'success'
                        })
                    else:
                        failed_feeds.append({
                            'url': feed_url,
                            'error': 'Failed to fetch data'
                        })
                except Exception as e:
                    failed_feeds.append({
                        'url': feed_url,
                        'error': str(e)
                    })
            
            # Update threat feeds
            self.threat_feeds.update({
                feed['url']: feed['data'] for feed in integrated_feeds
            })
            
            return {
                'integrated_feeds': integrated_feeds,
                'failed_feeds': failed_feeds,
                'total_feeds': len(feed_urls),
                'success_count': len(integrated_feeds),
                'failure_count': len(failed_feeds)
            }
            
        except Exception as e:
            logger.error(f"Error integrating threat feeds: {str(e)}")
            return {'error': str(e)}
    
    # Function 94: IOC extraction
    def extract_iocs(self, text: str) -> Dict[str, Any]:
        """Extract Indicators of Compromise from text"""
        try:
            iocs = {
                'ip_addresses': [],
                'domains': [],
                'urls': [],
                'file_hashes': [],
                'email_addresses': []
            }
            
            # Extract IP addresses
            import re
            ip_pattern = r'\b(?:[0-9]{1,3}\.){3}[0-9]{1,3}\b'
            iocs['ip_addresses'] = re.findall(ip_pattern, text)
            
            # Extract domains
            domain_pattern = r'\b(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}\b'
            iocs['domains'] = re.findall(domain_pattern, text)
            
            # Extract URLs
            url_pattern = r'https?://[^\s<>"{}|\\^`\[\]]+'
            iocs['urls'] = re.findall(url_pattern, text)
            
            # Extract file hashes
            hash_patterns = [
                r'\b[a-fA-F0-9]{32}\b',  # MD5
                r'\b[a-fA-F0-9]{40}\b',  # SHA1
                r'\b[a-fA-F0-9]{64}\b'   # SHA256
            ]
            for pattern in hash_patterns:
                iocs['file_hashes'].extend(re.findall(pattern, text))
            
            # Extract email addresses
            email_pattern = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
            iocs['email_addresses'] = re.findall(email_pattern, text)
            
            # Remove duplicates
            for key in iocs:
                iocs[key] = list(set(iocs[key]))
            
            return iocs
            
        except Exception as e:
            logger.error(f"Error extracting IOCs: {str(e)}")
            return {'error': str(e)}
    
    # Function 95: Threat actor profiling
    def profile_threat_actor(self, indicators: Dict[str, Any]) -> Dict[str, Any]:
        """Profile threat actor based on indicators"""
        try:
            profile = {
                'threat_actor': 'Unknown',
                'confidence': 0.0,
                'tactics': [],
                'techniques': [],
                'indicators': indicators,
                'attribution': 'Unknown',
                'motivation': 'Unknown',
                'capabilities': []
            }
            
            # Analyze indicators for threat actor patterns
            if indicators.get('ip_addresses'):
                ip_analysis = self._analyze_ip_patterns(indicators['ip_addresses'])
                profile.update(ip_analysis)
            
            if indicators.get('domains'):
                domain_analysis = self._analyze_domain_patterns(indicators['domains'])
                profile.update(domain_analysis)
            
            if indicators.get('file_hashes'):
                hash_analysis = self._analyze_hash_patterns(indicators['file_hashes'])
                profile.update(hash_analysis)
            
            # Determine threat actor based on patterns
            threat_actor = self._identify_threat_actor(profile)
            profile['threat_actor'] = threat_actor['name']
            profile['confidence'] = threat_actor['confidence']
            
            return profile
            
        except Exception as e:
            logger.error(f"Error profiling threat actor: {str(e)}")
            return {'error': str(e)}
    
    # Helper methods
    def _check_virustotal_ip(self, ip_address: str) -> Dict[str, Any]:
        """Check IP in VirusTotal"""
        try:
            if not self.api_keys.get('virustotal'):
                return {}
            
            url = f"https://www.virustotal.com/vtapi/v2/ip-address/report"
            params = {
                'apikey': self.api_keys['virustotal'],
                'ip': ip_address
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return {
                    'is_malicious': data.get('detected_urls', []) != [],
                    'reputation_score': len(data.get('detected_urls', [])) / 10.0,
                    'sources': ['virustotal'],
                    'last_seen': data.get('as_of')
                }
            
            return {}
            
        except Exception as e:
            logger.error(f"Error checking VirusTotal IP: {str(e)}")
            return {}
    
    def _check_abuseipdb(self, ip_address: str) -> Dict[str, Any]:
        """Check IP in AbuseIPDB"""
        try:
            if not self.api_keys.get('abuseipdb'):
                return {}
            
            url = "https://api.abuseipdb.com/api/v2/check"
            headers = {
                'Key': self.api_keys['abuseipdb'],
                'Accept': 'application/json'
            }
            params = {
                'ipAddress': ip_address,
                'maxAgeInDays': 90,
                'verbose': ''
            }
            
            response = requests.get(url, headers=headers, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                abuse_confidence = data.get('data', {}).get('abuseConfidencePercentage', 0)
                return {
                    'is_malicious': abuse_confidence > 25,
                    'reputation_score': abuse_confidence / 100.0,
                    'sources': ['abuseipdb'],
                    'country': data.get('data', {}).get('countryCode')
                }
            
            return {}
            
        except Exception as e:
            logger.error(f"Error checking AbuseIPDB: {str(e)}")
            return {}
    
    def _check_shodan_ip(self, ip_address: str) -> Dict[str, Any]:
        """Check IP in Shodan"""
        try:
            if not self.api_keys.get('shodan'):
                return {}
            
            url = f"https://api.shodan.io/shodan/host/{ip_address}"
            params = {'key': self.api_keys['shodan']}
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return {
                    'sources': ['shodan'],
                    'country': data.get('country_name'),
                    'asn': data.get('asn')
                }
            
            return {}
            
        except Exception as e:
            logger.error(f"Error checking Shodan: {str(e)}")
            return {}
    
    def _check_threat_feeds_ip(self, ip_address: str) -> Dict[str, Any]:
        """Check IP in threat feeds"""
        try:
            threat_types = []
            sources = []
            
            for feed_name, feed_data in self.threat_feeds.items():
                if 'ips' in feed_data and ip_address in feed_data['ips']:
                    threat_types.extend(feed_data['ips'][ip_address].get('threat_types', []))
                    sources.append(feed_name)
            
            if threat_types:
                return {
                    'is_malicious': True,
                    'threat_types': list(set(threat_types)),
                    'sources': sources
                }
            
            return {}
            
        except Exception as e:
            logger.error(f"Error checking threat feeds IP: {str(e)}")
            return {}
    
    def _check_virustotal_domain(self, domain: str) -> Dict[str, Any]:
        """Check domain in VirusTotal"""
        try:
            if not self.api_keys.get('virustotal'):
                return {}
            
            url = f"https://www.virustotal.com/vtapi/v2/domain/report"
            params = {
                'apikey': self.api_keys['virustotal'],
                'domain': domain
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                return {
                    'is_malicious': data.get('detected_urls', []) != [],
                    'reputation_score': len(data.get('detected_urls', [])) / 10.0,
                    'sources': ['virustotal']
                }
            
            return {}
            
        except Exception as e:
            logger.error(f"Error checking VirusTotal domain: {str(e)}")
            return {}
    
    def _check_whois_domain(self, domain: str) -> Dict[str, Any]:
        """Check domain WHOIS information"""
        try:
            w = whois.whois(domain)
            return {
                'registration_date': w.creation_date.isoformat() if w.creation_date else None,
                'expiration_date': w.expiration_date.isoformat() if w.expiration_date else None,
                'registrar': w.registrar,
                'nameservers': w.name_servers
            }
            
        except Exception as e:
            logger.error(f"Error checking WHOIS: {str(e)}")
            return {}
    
    def _check_dns_domain(self, domain: str) -> Dict[str, Any]:
        """Check domain DNS information"""
        try:
            # Check A records
            try:
                a_records = dns.resolver.resolve(domain, 'A')
                return {
                    'a_records': [str(record) for record in a_records]
                }
            except:
                return {}
            
        except Exception as e:
            logger.error(f"Error checking DNS: {str(e)}")
            return {}
    
    def _check_threat_feeds_domain(self, domain: str) -> Dict[str, Any]:
        """Check domain in threat feeds"""
        try:
            threat_types = []
            sources = []
            
            for feed_name, feed_data in self.threat_feeds.items():
                if 'domains' in feed_data and domain in feed_data['domains']:
                    threat_types.extend(feed_data['domains'][domain].get('threat_types', []))
                    sources.append(feed_name)
            
            if threat_types:
                return {
                    'is_malicious': True,
                    'threat_types': list(set(threat_types)),
                    'sources': sources
                }
            
            return {}
            
        except Exception as e:
            logger.error(f"Error checking threat feeds domain: {str(e)}")
            return {}
    
    def _check_virustotal_hash(self, file_hash: str) -> Dict[str, Any]:
        """Check hash in VirusTotal"""
        try:
            if not self.api_keys.get('virustotal'):
                return {}
            
            url = f"https://www.virustotal.com/vtapi/v2/file/report"
            params = {
                'apikey': self.api_keys['virustotal'],
                'resource': file_hash
            }
            
            response = requests.get(url, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('response_code') == 1:
                    return {
                        'is_malicious': data.get('positives', 0) > 0,
                        'reputation_score': data.get('positives', 0) / data.get('total', 1),
                        'detection_count': data.get('positives', 0),
                        'total_scans': data.get('total', 0),
                        'sources': ['virustotal']
                    }
            
            return {}
            
        except Exception as e:
            logger.error(f"Error checking VirusTotal hash: {str(e)}")
            return {}
    
    def _check_threat_feeds_hash(self, file_hash: str) -> Dict[str, Any]:
        """Check hash in threat feeds"""
        try:
            threat_types = []
            sources = []
            
            for feed_name, feed_data in self.threat_feeds.items():
                if 'hashes' in feed_data and file_hash in feed_data['hashes']:
                    threat_types.extend(feed_data['hashes'][file_hash].get('threat_types', []))
                    sources.append(feed_name)
            
            if threat_types:
                return {
                    'is_malicious': True,
                    'threat_types': list(set(threat_types)),
                    'sources': sources
                }
            
            return {}
            
        except Exception as e:
            logger.error(f"Error checking threat feeds hash: {str(e)}")
            return {}
    
    def _check_virustotal_url(self, url: str) -> Dict[str, Any]:
        """Check URL in VirusTotal"""
        try:
            if not self.api_keys.get('virustotal'):
                return {}
            
            url_endpoint = f"https://www.virustotal.com/vtapi/v2/url/report"
            params = {
                'apikey': self.api_keys['virustotal'],
                'resource': url
            }
            
            response = requests.get(url_endpoint, params=params, timeout=10)
            if response.status_code == 200:
                data = response.json()
                if data.get('response_code') == 1:
                    return {
                        'is_malicious': data.get('positives', 0) > 0,
                        'reputation_score': data.get('positives', 0) / data.get('total', 1),
                        'sources': ['virustotal']
                    }
            
            return {}
            
        except Exception as e:
            logger.error(f"Error checking VirusTotal URL: {str(e)}")
            return {}
    
    def _check_threat_feeds_url(self, url: str) -> Dict[str, Any]:
        """Check URL in threat feeds"""
        try:
            threat_types = []
            sources = []
            
            for feed_name, feed_data in self.threat_feeds.items():
                if 'urls' in feed_data and url in feed_data['urls']:
                    threat_types.extend(feed_data['urls'][url].get('threat_types', []))
                    sources.append(feed_name)
            
            if threat_types:
                return {
                    'is_malicious': True,
                    'threat_types': list(set(threat_types)),
                    'sources': sources
                }
            
            return {}
            
        except Exception as e:
            logger.error(f"Error checking threat feeds URL: {str(e)}")
            return {}
    
    def _fetch_threat_feed(self, feed_url: str) -> Optional[Dict[str, Any]]:
        """Fetch threat feed data"""
        try:
            response = requests.get(feed_url, timeout=30)
            if response.status_code == 200:
                return response.json()
            return None
            
        except Exception as e:
            logger.error(f"Error fetching threat feed {feed_url}: {str(e)}")
            return None
    
    def _analyze_ip_patterns(self, ip_addresses: List[str]) -> Dict[str, Any]:
        """Analyze IP address patterns"""
        try:
            # Simple pattern analysis
            return {
                'tactics': ['network_communication'],
                'techniques': ['command_and_control']
            }
            
        except Exception as e:
            logger.error(f"Error analyzing IP patterns: {str(e)}")
            return {}
    
    def _analyze_domain_patterns(self, domains: List[str]) -> Dict[str, Any]:
        """Analyze domain patterns"""
        try:
            # Simple pattern analysis
            return {
                'tactics': ['command_and_control'],
                'techniques': ['domain_generation_algorithm']
            }
            
        except Exception as e:
            logger.error(f"Error analyzing domain patterns: {str(e)}")
            return {}
    
    def _analyze_hash_patterns(self, file_hashes: List[str]) -> Dict[str, Any]:
        """Analyze hash patterns"""
        try:
            # Simple pattern analysis
            return {
                'tactics': ['execution'],
                'techniques': ['malware']
            }
            
        except Exception as e:
            logger.error(f"Error analyzing hash patterns: {str(e)}")
            return {}
    
    def _identify_threat_actor(self, profile: Dict[str, Any]) -> Dict[str, Any]:
        """Identify threat actor based on profile"""
        try:
            # Simple threat actor identification
            return {
                'name': 'Unknown Threat Actor',
                'confidence': 0.5
            }
            
        except Exception as e:
            logger.error(f"Error identifying threat actor: {str(e)}")
            return {'name': 'Unknown', 'confidence': 0.0}

# Global instance
threat_intel_service = ThreatIntelligenceService()

def get_threat_intel_service() -> ThreatIntelligenceService:
    """Get threat intelligence service instance"""
    return threat_intel_service
