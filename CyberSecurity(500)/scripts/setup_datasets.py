#!/usr/bin/env python3
"""
Dataset Setup Script
AI/ML Cybersecurity Platform
"""

import os
import sys
import json
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
import random
import hashlib
import logging

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.logging_utils import get_security_logger

logger = logging.getLogger(__name__)
security_logger = get_security_logger()

class DatasetSetup:
    """Dataset setup for cybersecurity platform"""
    
    def __init__(self):
        self.datasets_dir = 'datasets'
        self.sample_data_dir = 'sample_data'
        
        # Create directories
        os.makedirs(self.datasets_dir, exist_ok=True)
        os.makedirs(self.sample_data_dir, exist_ok=True)
        
        # Create subdirectories
        for subdir in ['phishing', 'malware', 'ids', 'ransomware', 'threat_intelligence']:
            os.makedirs(os.path.join(self.datasets_dir, subdir), exist_ok=True)
    
    def setup_phishing_datasets(self):
        """Setup phishing detection datasets"""
        try:
            logger.info("Setting up phishing datasets...")
            
            # Generate synthetic phishing URLs
            phishing_urls = self._generate_phishing_urls(500)
            safe_urls = self._generate_safe_urls(500)
            
            # Combine and shuffle
            all_urls = phishing_urls + safe_urls
            random.shuffle(all_urls)
            
            # Save to CSV
            df = pd.DataFrame(all_urls)
            df.to_csv(os.path.join(self.datasets_dir, 'phishing', 'url_dataset.csv'), index=False)
            
            # Generate email dataset
            phishing_emails = self._generate_phishing_emails(300)
            safe_emails = self._generate_safe_emails(300)
            
            all_emails = phishing_emails + safe_emails
            random.shuffle(all_emails)
            
            df_emails = pd.DataFrame(all_emails)
            df_emails.to_csv(os.path.join(self.datasets_dir, 'phishing', 'email_dataset.csv'), index=False)
            
            logger.info("Phishing datasets created successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error setting up phishing datasets: {str(e)}")
            return False
    
    def setup_malware_datasets(self):
        """Setup malware detection datasets"""
        try:
            logger.info("Setting up malware datasets...")
            
            # Generate synthetic malware samples
            malware_samples = self._generate_malware_samples(400)
            benign_samples = self._generate_benign_samples(400)
            
            # Combine and shuffle
            all_samples = malware_samples + benign_samples
            random.shuffle(all_samples)
            
            # Save to CSV
            df = pd.DataFrame(all_samples)
            df.to_csv(os.path.join(self.datasets_dir, 'malware', 'file_dataset.csv'), index=False)
            
            # Generate PE header dataset
            pe_headers = self._generate_pe_headers(800)
            df_pe = pd.DataFrame(pe_headers)
            df_pe.to_csv(os.path.join(self.datasets_dir, 'malware', 'pe_headers.csv'), index=False)
            
            logger.info("Malware datasets created successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error setting up malware datasets: {str(e)}")
            return False
    
    def setup_ids_datasets(self):
        """Setup IDS detection datasets"""
        try:
            logger.info("Setting up IDS datasets...")
            
            # Generate network traffic data
            normal_traffic = self._generate_normal_traffic(600)
            attack_traffic = self._generate_attack_traffic(400)
            
            # Combine and shuffle
            all_traffic = normal_traffic + attack_traffic
            random.shuffle(all_traffic)
            
            # Save to CSV
            df = pd.DataFrame(all_traffic)
            df.to_csv(os.path.join(self.datasets_dir, 'ids', 'network_traffic.csv'), index=False)
            
            # Generate system logs
            system_logs = self._generate_system_logs(1000)
            df_logs = pd.DataFrame(system_logs)
            df_logs.to_csv(os.path.join(self.datasets_dir, 'ids', 'system_logs.csv'), index=False)
            
            logger.info("IDS datasets created successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error setting up IDS datasets: {str(e)}")
            return False
    
    def setup_ransomware_datasets(self):
        """Setup ransomware detection datasets"""
        try:
            logger.info("Setting up ransomware datasets...")
            
            # Generate file operation sequences
            normal_operations = self._generate_normal_file_operations(500)
            ransomware_operations = self._generate_ransomware_operations(300)
            
            # Combine and shuffle
            all_operations = normal_operations + ransomware_operations
            random.shuffle(all_operations)
            
            # Save to CSV
            df = pd.DataFrame(all_operations)
            df.to_csv(os.path.join(self.datasets_dir, 'ransomware', 'file_operations.csv'), index=False)
            
            # Generate entropy data
            entropy_data = self._generate_entropy_data(800)
            df_entropy = pd.DataFrame(entropy_data)
            df_entropy.to_csv(os.path.join(self.datasets_dir, 'ransomware', 'entropy_data.csv'), index=False)
            
            logger.info("Ransomware datasets created successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error setting up ransomware datasets: {str(e)}")
            return False
    
    def setup_threat_intelligence_datasets(self):
        """Setup threat intelligence datasets"""
        try:
            logger.info("Setting up threat intelligence datasets...")
            
            # Generate IOC data
            ioc_data = self._generate_ioc_data(1000)
            df_ioc = pd.DataFrame(ioc_data)
            df_ioc.to_csv(os.path.join(self.datasets_dir, 'threat_intelligence', 'ioc_data.csv'), index=False)
            
            # Generate threat actor profiles
            threat_actors = self._generate_threat_actor_profiles(50)
            df_actors = pd.DataFrame(threat_actors)
            df_actors.to_csv(os.path.join(self.datasets_dir, 'threat_intelligence', 'threat_actors.csv'), index=False)
            
            # Generate threat feeds
            threat_feeds = self._generate_threat_feeds(20)
            with open(os.path.join(self.datasets_dir, 'threat_intelligence', 'threat_feeds.json'), 'w') as f:
                json.dump(threat_feeds, f, indent=2)
            
            logger.info("Threat intelligence datasets created successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error setting up threat intelligence datasets: {str(e)}")
            return False
    
    def setup_sample_data(self):
        """Setup sample data for testing"""
        try:
            logger.info("Setting up sample data...")
            
            # Sample PCAP file (placeholder)
            sample_pcap = {
                'filename': 'sample_traffic.pcap',
                'description': 'Sample network traffic capture',
                'size': '1.2 MB',
                'packets': 1500,
                'duration': '5 minutes'
            }
            
            # Sample email file
            sample_email = {
                'filename': 'sample_email.eml',
                'description': 'Sample phishing email',
                'sender': 'suspicious@example.com',
                'subject': 'Urgent: Verify Your Account',
                'content': 'Click here to verify your account...'
            }
            
            # Sample malware file
            sample_malware = {
                'filename': 'sample_malware.exe',
                'description': 'Sample malware file',
                'size': '2.5 MB',
                'hash': 'a1b2c3d4e5f6...',
                'type': 'PE executable'
            }
            
            # Save sample data
            sample_data = {
                'pcap': sample_pcap,
                'email': sample_email,
                'malware': sample_malware
            }
            
            with open(os.path.join(self.sample_data_dir, 'sample_data.json'), 'w') as f:
                json.dump(sample_data, f, indent=2)
            
            logger.info("Sample data created successfully")
            return True
            
        except Exception as e:
            logger.error(f"Error setting up sample data: {str(e)}")
            return False
    
    def setup_all_datasets(self):
        """Setup all datasets"""
        try:
            logger.info("Setting up all datasets...")
            
            results = {}
            
            # Setup individual datasets
            results['phishing'] = self.setup_phishing_datasets()
            results['malware'] = self.setup_malware_datasets()
            results['ids'] = self.setup_ids_datasets()
            results['ransomware'] = self.setup_ransomware_datasets()
            results['threat_intelligence'] = self.setup_threat_intelligence_datasets()
            results['sample_data'] = self.setup_sample_data()
            
            # Save setup results
            with open(os.path.join(self.datasets_dir, 'setup_results.json'), 'w') as f:
                json.dump(results, f, indent=2)
            
            success_count = sum(1 for result in results.values() if result)
            total_count = len(results)
            
            logger.info(f"Dataset setup completed: {success_count}/{total_count} successful")
            return results
            
        except Exception as e:
            logger.error(f"Error setting up datasets: {str(e)}")
            return {'error': str(e)}
    
    def _generate_phishing_urls(self, count: int) -> List[Dict]:
        """Generate synthetic phishing URLs"""
        phishing_urls = []
        
        for i in range(count):
            # Generate suspicious URL patterns
            suspicious_domains = [
                'secure-bank-verification.com',
                'paypal-security-update.net',
                'amazon-account-alert.org',
                'microsoft-security-check.info'
            ]
            
            suspicious_paths = [
                '/verify-account',
                '/security-update',
                '/login-required',
                '/account-suspended'
            ]
            
            domain = random.choice(suspicious_domains)
            path = random.choice(suspicious_paths)
            url = f"https://{domain}{path}"
            
            phishing_urls.append({
                'url': url,
                'is_phishing': True,
                'url_length': len(url),
                'dots_count': url.count('.'),
                'slashes_count': url.count('/'),
                'has_ip': False,
                'suspicious_keywords': True,
                'subdomain_count': len(domain.split('.')) - 1
            })
        
        return phishing_urls
    
    def _generate_safe_urls(self, count: int) -> List[Dict]:
        """Generate synthetic safe URLs"""
        safe_urls = []
        
        for i in range(count):
            # Generate legitimate URL patterns
            legitimate_domains = [
                'google.com',
                'microsoft.com',
                'amazon.com',
                'github.com',
                'stackoverflow.com'
            ]
            
            legitimate_paths = [
                '/',
                '/about',
                '/contact',
                '/products',
                '/services'
            ]
            
            domain = random.choice(legitimate_domains)
            path = random.choice(legitimate_paths)
            url = f"https://{domain}{path}"
            
            safe_urls.append({
                'url': url,
                'is_phishing': False,
                'url_length': len(url),
                'dots_count': url.count('.'),
                'slashes_count': url.count('/'),
                'has_ip': False,
                'suspicious_keywords': False,
                'subdomain_count': len(domain.split('.')) - 1
            })
        
        return safe_urls
    
    def _generate_phishing_emails(self, count: int) -> List[Dict]:
        """Generate synthetic phishing emails"""
        phishing_emails = []
        
        for i in range(count):
            subjects = [
                'Urgent: Verify Your Account',
                'Security Alert: Action Required',
                'Your Account Will Be Suspended',
                'Important: Update Your Information'
            ]
            
            senders = [
                'security@bank-verification.com',
                'noreply@account-update.net',
                'alerts@security-check.org'
            ]
            
            subject = random.choice(subjects)
            sender = random.choice(senders)
            
            phishing_emails.append({
                'subject': subject,
                'sender': sender,
                'is_phishing': True,
                'has_suspicious_keywords': True,
                'has_urgent_language': True,
                'spf_failed': random.choice([True, False]),
                'dkim_failed': random.choice([True, False])
            })
        
        return phishing_emails
    
    def _generate_safe_emails(self, count: int) -> List[Dict]:
        """Generate synthetic safe emails"""
        safe_emails = []
        
        for i in range(count):
            subjects = [
                'Newsletter: Weekly Update',
                'Product Announcement',
                'Meeting Reminder',
                'Thank You for Your Purchase'
            ]
            
            senders = [
                'newsletter@company.com',
                'support@service.com',
                'noreply@platform.com'
            ]
            
            subject = random.choice(subjects)
            sender = random.choice(senders)
            
            safe_emails.append({
                'subject': subject,
                'sender': sender,
                'is_phishing': False,
                'has_suspicious_keywords': False,
                'has_urgent_language': False,
                'spf_failed': False,
                'dkim_failed': False
            })
        
        return safe_emails
    
    def _generate_malware_samples(self, count: int) -> List[Dict]:
        """Generate synthetic malware samples"""
        malware_samples = []
        
        for i in range(count):
            # Generate random hash
            file_hash = hashlib.sha256(f"malware_sample_{i}".encode()).hexdigest()
            
            malware_samples.append({
                'file_hash': file_hash,
                'filename': f'malware_{i}.exe',
                'is_malware': True,
                'file_size': random.randint(100000, 10000000),
                'entropy': random.uniform(7.0, 8.0),
                'sections': random.randint(5, 15),
                'imports': random.randint(20, 100),
                'exports': random.randint(0, 20),
                'suspicious_strings': random.randint(10, 50)
            })
        
        return malware_samples
    
    def _generate_benign_samples(self, count: int) -> List[Dict]:
        """Generate synthetic benign samples"""
        benign_samples = []
        
        for i in range(count):
            # Generate random hash
            file_hash = hashlib.sha256(f"benign_sample_{i}".encode()).hexdigest()
            
            benign_samples.append({
                'file_hash': file_hash,
                'filename': f'benign_{i}.exe',
                'is_malware': False,
                'file_size': random.randint(50000, 5000000),
                'entropy': random.uniform(4.0, 6.0),
                'sections': random.randint(3, 8),
                'imports': random.randint(5, 30),
                'exports': random.randint(0, 10),
                'suspicious_strings': random.randint(0, 5)
            })
        
        return benign_samples
    
    def _generate_pe_headers(self, count: int) -> List[Dict]:
        """Generate synthetic PE headers"""
        pe_headers = []
        
        for i in range(count):
            pe_headers.append({
                'machine_type': random.choice(['0x014c', '0x8664']),
                'number_of_sections': random.randint(3, 15),
                'timestamp': random.randint(1000000000, 2000000000),
                'characteristics': random.choice(['0x0102', '0x0103']),
                'magic': random.choice(['0x010b', '0x020b']),
                'size_of_code': random.randint(1000, 100000),
                'size_of_initialized_data': random.randint(1000, 50000),
                'size_of_uninitialized_data': random.randint(0, 10000),
                'address_of_entry_point': random.randint(0x1000, 0x10000),
                'base_of_code': random.randint(0x1000, 0x10000),
                'image_base': random.choice(['0x400000', '0x140000000']),
                'section_alignment': random.choice([0x1000, 0x2000]),
                'file_alignment': random.choice([0x200, 0x1000]),
                'subsystem': random.choice(['0x0002', '0x0003']),
                'dll_characteristics': random.choice(['0x0000', '0x0100'])
            })
        
        return pe_headers
    
    def _generate_normal_traffic(self, count: int) -> List[Dict]:
        """Generate synthetic normal network traffic"""
        normal_traffic = []
        
        for i in range(count):
            normal_traffic.append({
                'source_ip': f"192.168.1.{random.randint(1, 254)}",
                'dest_ip': f"10.0.0.{random.randint(1, 254)}",
                'source_port': random.randint(1024, 65535),
                'dest_port': random.choice([80, 443, 22, 21, 25]),
                'protocol': random.choice(['TCP', 'UDP']),
                'packet_count': random.randint(1, 100),
                'byte_count': random.randint(100, 10000),
                'duration': random.uniform(0.1, 60.0),
                'is_attack': False,
                'attack_type': 'normal'
            })
        
        return normal_traffic
    
    def _generate_attack_traffic(self, count: int) -> List[Dict]:
        """Generate synthetic attack traffic"""
        attack_traffic = []
        
        attack_types = ['dos', 'ddos', 'brute_force', 'sql_injection', 'xss']
        
        for i in range(count):
            attack_type = random.choice(attack_types)
            
            attack_traffic.append({
                'source_ip': f"10.0.0.{random.randint(1, 254)}",
                'dest_ip': f"192.168.1.{random.randint(1, 254)}",
                'source_port': random.randint(1024, 65535),
                'dest_port': random.choice([80, 443, 22, 21, 25]),
                'protocol': random.choice(['TCP', 'UDP']),
                'packet_count': random.randint(100, 10000),
                'byte_count': random.randint(10000, 1000000),
                'duration': random.uniform(0.1, 300.0),
                'is_attack': True,
                'attack_type': attack_type
            })
        
        return attack_traffic
    
    def _generate_system_logs(self, count: int) -> List[Dict]:
        """Generate synthetic system logs"""
        system_logs = []
        
        log_types = ['login', 'file_access', 'process_creation', 'network_connection', 'error']
        
        for i in range(count):
            log_type = random.choice(log_types)
            timestamp = datetime.now() - timedelta(minutes=random.randint(0, 1440))
            
            system_logs.append({
                'timestamp': timestamp.isoformat(),
                'log_type': log_type,
                'user': f"user{random.randint(1, 100)}",
                'source_ip': f"192.168.1.{random.randint(1, 254)}",
                'message': f"System log entry {i}",
                'severity': random.choice(['info', 'warning', 'error']),
                'is_suspicious': random.choice([True, False])
            })
        
        return system_logs
    
    def _generate_normal_file_operations(self, count: int) -> List[Dict]:
        """Generate synthetic normal file operations"""
        normal_operations = []
        
        for i in range(count):
            normal_operations.append({
                'operation_type': random.choice(['read', 'write', 'create', 'delete']),
                'file_path': f"/home/user/file_{i}.txt",
                'file_size': random.randint(100, 10000),
                'entropy': random.uniform(4.0, 6.0),
                'timestamp': datetime.now() - timedelta(minutes=random.randint(0, 1440)),
                'is_ransomware': False,
                'bulk_operation': False
            })
        
        return normal_operations
    
    def _generate_ransomware_operations(self, count: int) -> List[Dict]:
        """Generate synthetic ransomware operations"""
        ransomware_operations = []
        
        for i in range(count):
            ransomware_operations.append({
                'operation_type': random.choice(['encrypt', 'rename', 'delete']),
                'file_path': f"/home/user/file_{i}.encrypted",
                'file_size': random.randint(1000, 50000),
                'entropy': random.uniform(7.0, 8.0),
                'timestamp': datetime.now() - timedelta(minutes=random.randint(0, 1440)),
                'is_ransomware': True,
                'bulk_operation': True
            })
        
        return ransomware_operations
    
    def _generate_entropy_data(self, count: int) -> List[Dict]:
        """Generate synthetic entropy data"""
        entropy_data = []
        
        for i in range(count):
            entropy_data.append({
                'file_path': f"/home/user/file_{i}",
                'entropy': random.uniform(0.0, 8.0),
                'file_size': random.randint(100, 1000000),
                'is_encrypted': random.uniform(0.0, 8.0) > 7.0,
                'is_suspicious': random.uniform(0.0, 8.0) > 6.0
            })
        
        return entropy_data
    
    def _generate_ioc_data(self, count: int) -> List[Dict]:
        """Generate synthetic IOC data"""
        ioc_data = []
        
        ioc_types = ['ip_address', 'domain', 'url', 'file_hash', 'email']
        
        for i in range(count):
            ioc_type = random.choice(ioc_types)
            
            if ioc_type == 'ip_address':
                value = f"{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}.{random.randint(1, 255)}"
            elif ioc_type == 'domain':
                value = f"example{random.randint(1, 100)}.com"
            elif ioc_type == 'url':
                value = f"https://example{random.randint(1, 100)}.com/path"
            elif ioc_type == 'file_hash':
                value = hashlib.sha256(f"file_{i}".encode()).hexdigest()
            else:  # email
                value = f"user{random.randint(1, 100)}@example.com"
            
            ioc_data.append({
                'ioc_type': ioc_type,
                'value': value,
                'threat_type': random.choice(['malware', 'phishing', 'botnet', 'c2']),
                'confidence': random.uniform(0.5, 1.0),
                'first_seen': datetime.now() - timedelta(days=random.randint(1, 365)),
                'last_seen': datetime.now() - timedelta(days=random.randint(0, 30)),
                'is_active': random.choice([True, False])
            })
        
        return ioc_data
    
    def _generate_threat_actor_profiles(self, count: int) -> List[Dict]:
        """Generate synthetic threat actor profiles"""
        threat_actors = []
        
        actor_names = [
            'APT1', 'APT28', 'APT29', 'Lazarus Group', 'Carbanak',
            'FIN7', 'FIN8', 'FIN9', 'Cobalt Group', 'Silence'
        ]
        
        for i in range(count):
            name = random.choice(actor_names)
            
            threat_actors.append({
                'name': name,
                'aliases': [f"{name}_alias_{j}" for j in range(random.randint(1, 3))],
                'country': random.choice(['Russia', 'China', 'North Korea', 'Iran', 'Unknown']),
                'motivation': random.choice(['financial', 'espionage', 'disruption', 'political']),
                'capabilities': random.choice(['advanced', 'intermediate', 'basic']),
                'target_sectors': random.sample(['finance', 'healthcare', 'government', 'energy', 'technology'], random.randint(1, 3)),
                'tactics': random.sample(['phishing', 'malware', 'social_engineering', 'exploits'], random.randint(1, 4)),
                'first_seen': datetime.now() - timedelta(days=random.randint(365, 3650)),
                'last_seen': datetime.now() - timedelta(days=random.randint(0, 365)),
                'is_active': random.choice([True, False])
            })
        
        return threat_actors
    
    def _generate_threat_feeds(self, count: int) -> Dict:
        """Generate synthetic threat feeds"""
        threat_feeds = {}
        
        for i in range(count):
            feed_name = f"threat_feed_{i}"
            threat_feeds[feed_name] = {
                'url': f"https://example.com/feed_{i}.json",
                'description': f"Threat intelligence feed {i}",
                'last_updated': datetime.now().isoformat(),
                'ips': {
                    f"192.168.1.{j}": {
                        'threat_types': ['malware', 'botnet'],
                        'confidence': random.uniform(0.5, 1.0)
                    } for j in range(1, 11)
                },
                'domains': {
                    f"malicious{j}.com": {
                        'threat_types': ['phishing', 'c2'],
                        'confidence': random.uniform(0.5, 1.0)
                    } for j in range(1, 11)
                },
                'hashes': {
                    hashlib.sha256(f"malware_{j}".encode()).hexdigest(): {
                        'threat_types': ['malware'],
                        'confidence': random.uniform(0.5, 1.0)
                    } for j in range(1, 11)
                }
            }
        
        return threat_feeds

def main():
    """Main dataset setup function"""
    try:
        setup = DatasetSetup()
        results = setup.setup_all_datasets()
        
        print("Dataset setup completed successfully!")
        print("Results:")
        for dataset_name, result in results.items():
            if result:
                print(f"  {dataset_name}: Success")
            else:
                print(f"  {dataset_name}: Failed")
        
    except Exception as e:
        print(f"Dataset setup failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()


