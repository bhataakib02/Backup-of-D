"""
Phishing Detection Service - Functions 1-70
AI/ML Cybersecurity Platform
"""

import os
import re
import hashlib
import requests
import numpy as np
import pandas as pd
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime
import logging
from urllib.parse import urlparse, urljoin
import dns.resolver
import ssl
import socket
from PIL import Image
import cv2
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import tensorflow as tf
try:
    from tensorflow.keras.models import Sequential, load_model
    from tensorflow.keras.layers import LSTM, Dense, Embedding, Dropout
    from tensorflow.keras.preprocessing.text import Tokenizer
    from tensorflow.keras.preprocessing.sequence import pad_sequences
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False
import pickle

from utils.security_utils import get_url_analyzer, get_email_analyzer
from utils.logging_utils import get_security_logger
from database.models import PhishingAnalysis, Alert

logger = logging.getLogger(__name__)
security_logger = get_security_logger()

class PhishingDetectionService:
    """Phishing detection service implementing functions 1-70"""
    
    def __init__(self):
        self.url_analyzer = get_url_analyzer()
        self.email_analyzer = get_email_analyzer()
        self.models = {}
        self.vectorizers = {}
        self.load_models()
    
    def load_models(self):
        """Load pre-trained models"""
        try:
            # Load URL classifier
            if os.path.exists('models/url_classifier.pkl'):
                self.models['url_classifier'] = joblib.load('models/url_classifier.pkl')
            
            # Load email NLP model (only if TensorFlow is available)
            if TENSORFLOW_AVAILABLE and os.path.exists('models/email_nlp_model.h5'):
                self.models['email_nlp'] = load_model('models/email_nlp_model.h5')
            
            # Load screenshot CNN model (only if TensorFlow is available)
            if TENSORFLOW_AVAILABLE and os.path.exists('models/screenshot_cnn_model.h5'):
                self.models['screenshot_cnn'] = load_model('models/screenshot_cnn_model.h5')
            
            # Load vectorizers
            if os.path.exists('models/url_vectorizer.pkl'):
                self.vectorizers['url'] = pickle.load(open('models/url_vectorizer.pkl', 'rb'))
            
            if os.path.exists('models/email_vectorizer.pkl'):
                self.vectorizers['email'] = pickle.load(open('models/email_vectorizer.pkl', 'rb'))
            
            logger.info("Phishing detection models loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading models: {str(e)}")
    
    # Function 1: Upload/paste URL for phishing detection
    def analyze_url(self, url: str) -> Dict[str, Any]:
        """Analyze URL for phishing indicators"""
        try:
            # Basic URL analysis
            analysis = self.url_analyzer.analyze_url(url)
            
            # ML-based classification
            if self.models.get('url_classifier') and self.vectorizers.get('url'):
                features = self._extract_url_features(url)
                prediction = self.models['url_classifier'].predict([features])[0]
                probability = self.models['url_classifier'].predict_proba([features])[0]
                
                analysis.update({
                    'ml_prediction': 'phishing' if prediction == 1 else 'safe',
                    'ml_confidence': float(max(probability)),
                    'ml_features': features
                })
            
            # Store analysis in database
            self._store_phishing_analysis(analysis, 'url')
            
            # Log security event
            security_logger.log_phishing_detection(
                url=url,
                is_phishing=analysis.get('is_phishing', False),
                confidence=analysis.get('confidence', 0.0),
                features=analysis
            )
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing URL {url}: {str(e)}")
            return {'error': str(e)}
    
    # Function 2: Upload email file (.eml/.msg)
    def analyze_email_file(self, file_path: str) -> Dict[str, Any]:
        """Analyze email file for phishing indicators"""
        try:
            # Parse email file
            email_content = self._parse_email_file(file_path)
            
            # Analyze email content
            analysis = self.email_analyzer.analyze_email(
                email_content['content'],
                email_content.get('subject', ''),
                email_content.get('sender', '')
            )
            
            # ML-based classification
            if self.models.get('email_nlp') and self.vectorizers.get('email'):
                features = self._extract_email_features(email_content['content'])
                prediction = self.models['email_nlp'].predict(features)
                analysis.update({
                    'ml_prediction': 'phishing' if prediction[0][0] > 0.5 else 'safe',
                    'ml_confidence': float(prediction[0][0]),
                    'ml_features': features.tolist()
                })
            
            # Store analysis in database
            self._store_phishing_analysis(analysis, 'email')
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing email file {file_path}: {str(e)}")
            return {'error': str(e)}
    
    # Function 3: Paste raw email text
    def analyze_email_text(self, email_text: str, subject: str = '', sender: str = '') -> Dict[str, Any]:
        """Analyze raw email text for phishing indicators"""
        try:
            # Analyze email content
            analysis = self.email_analyzer.analyze_email(email_text, subject, sender)
            
            # ML-based classification
            if self.models.get('email_nlp') and self.vectorizers.get('email'):
                features = self._extract_email_features(email_text)
                prediction = self.models['email_nlp'].predict(features)
                analysis.update({
                    'ml_prediction': 'phishing' if prediction[0][0] > 0.5 else 'safe',
                    'ml_confidence': float(prediction[0][0]),
                    'ml_features': features.tolist()
                })
            
            # Store analysis in database
            self._store_phishing_analysis(analysis, 'email')
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing email text: {str(e)}")
            return {'error': str(e)}
    
    # Function 4: URL length analysis
    def analyze_url_length(self, url: str) -> Dict[str, Any]:
        """Analyze URL length for phishing indicators"""
        try:
            length = len(url)
            analysis = {
                'url': url,
                'length': length,
                'is_suspicious': length > 100,  # URLs longer than 100 chars are suspicious
                'risk_score': min(length / 200.0, 1.0),  # Normalize to 0-1
                'category': 'suspicious' if length > 100 else 'normal'
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing URL length: {str(e)}")
            return {'error': str(e)}
    
    # Function 5: Count dots/slashes in URL
    def count_url_separators(self, url: str) -> Dict[str, Any]:
        """Count dots and slashes in URL"""
        try:
            dot_count = url.count('.')
            slash_count = url.count('/')
            analysis = {
                'url': url,
                'dot_count': dot_count,
                'slash_count': slash_count,
                'is_suspicious': dot_count > 3 or slash_count > 5,
                'risk_score': min((dot_count + slash_count) / 10.0, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error counting URL separators: {str(e)}")
            return {'error': str(e)}
    
    # Function 6: IP in URL check
    def check_ip_in_url(self, url: str) -> Dict[str, Any]:
        """Check if URL contains IP address"""
        try:
            parsed_url = urlparse(url)
            hostname = parsed_url.netloc
            
            # Check if hostname is an IP address
            ip_pattern = r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
            is_ip = bool(re.match(ip_pattern, hostname))
            
            analysis = {
                'url': url,
                'hostname': hostname,
                'is_ip_address': is_ip,
                'is_suspicious': is_ip,  # IP addresses in URLs are suspicious
                'risk_score': 0.8 if is_ip else 0.0
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error checking IP in URL: {str(e)}")
            return {'error': str(e)}
    
    # Function 7: Suspicious keyword detection in URL
    def detect_suspicious_keywords(self, url: str) -> Dict[str, Any]:
        """Detect suspicious keywords in URL"""
        try:
            suspicious_keywords = [
                'secure', 'account', 'verify', 'update', 'confirm', 'login', 'password',
                'bank', 'paypal', 'amazon', 'microsoft', 'apple', 'google', 'facebook',
                'suspended', 'locked', 'expired', 'urgent', 'immediate', 'action'
            ]
            
            found_keywords = []
            url_lower = url.lower()
            
            for keyword in suspicious_keywords:
                if keyword in url_lower:
                    found_keywords.append(keyword)
            
            analysis = {
                'url': url,
                'found_keywords': found_keywords,
                'keyword_count': len(found_keywords),
                'is_suspicious': len(found_keywords) > 0,
                'risk_score': min(len(found_keywords) / 5.0, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error detecting suspicious keywords: {str(e)}")
            return {'error': str(e)}
    
    # Function 8: Subdomain count analysis
    def analyze_subdomains(self, url: str) -> Dict[str, Any]:
        """Analyze subdomain count in URL"""
        try:
            parsed_url = urlparse(url)
            hostname = parsed_url.netloc
            
            subdomain_count = hostname.count('.') - 1  # Subtract 1 for TLD
            analysis = {
                'url': url,
                'hostname': hostname,
                'subdomain_count': subdomain_count,
                'is_suspicious': subdomain_count > 2,
                'risk_score': min(subdomain_count / 5.0, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing subdomains: {str(e)}")
            return {'error': str(e)}
    
    # Function 9: SSL certificate validation
    def validate_ssl_certificate(self, url: str) -> Dict[str, Any]:
        """Validate SSL certificate for URL"""
        try:
            parsed_url = urlparse(url)
            hostname = parsed_url.netloc
            
            if parsed_url.scheme != 'https':
                return {
                    'url': url,
                    'hostname': hostname,
                    'has_ssl': False,
                    'is_suspicious': True,
                    'risk_score': 0.8
                }
            
            # Check SSL certificate
            context = ssl.create_default_context()
            with socket.create_connection((hostname, 443), timeout=10) as sock:
                with context.wrap_socket(sock, server_hostname=hostname) as ssock:
                    cert = ssock.getpeercert()
                    
                    analysis = {
                        'url': url,
                        'hostname': hostname,
                        'has_ssl': True,
                        'cert_valid': True,
                        'issuer': cert.get('issuer', {}),
                        'subject': cert.get('subject', {}),
                        'not_after': cert.get('notAfter', ''),
                        'is_suspicious': False,
                        'risk_score': 0.0
                    }
                    
                    # Check if certificate is expired
                    if cert.get('notAfter'):
                        from datetime import datetime
                        not_after = datetime.strptime(cert['notAfter'], '%b %d %H:%M:%S %Y %Z')
                        if not_after < datetime.now():
                            analysis['is_suspicious'] = True
                            analysis['risk_score'] = 0.6
                    
                    return analysis
            
        except Exception as e:
            logger.error(f"Error validating SSL certificate: {str(e)}")
            return {
                'url': url,
                'hostname': hostname,
                'has_ssl': False,
                'is_suspicious': True,
                'risk_score': 0.8,
                'error': str(e)
            }
    
    # Function 10: WHOIS lookup
    def whois_lookup(self, url: str) -> Dict[str, Any]:
        """Perform WHOIS lookup for domain"""
        try:
            parsed_url = urlparse(url)
            domain = parsed_url.netloc
            
            # Use the URL analyzer's WHOIS functionality
            whois_info = self.url_analyzer._get_whois_info(domain)
            
            analysis = {
                'url': url,
                'domain': domain,
                'whois_info': whois_info,
                'is_suspicious': False,
                'risk_score': 0.0
            }
            
            # Check for suspicious indicators
            if whois_info.get('creation_date'):
                from datetime import datetime, timedelta
                try:
                    creation_date = datetime.strptime(whois_info['creation_date'], '%Y-%m-%d')
                    if creation_date > datetime.now() - timedelta(days=30):
                        analysis['is_suspicious'] = True
                        analysis['risk_score'] = 0.4
                except:
                    pass
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error performing WHOIS lookup: {str(e)}")
            return {'error': str(e)}
    
    # Function 11: Email header parsing
    def parse_email_headers(self, email_content: str) -> Dict[str, Any]:
        """Parse email headers for analysis"""
        try:
            headers = {}
            lines = email_content.split('\n')
            
            for line in lines:
                if ':' in line and not line.startswith(' '):
                    key, value = line.split(':', 1)
                    headers[key.strip().lower()] = value.strip()
            
            analysis = {
                'headers': headers,
                'from': headers.get('from', ''),
                'to': headers.get('to', ''),
                'subject': headers.get('subject', ''),
                'date': headers.get('date', ''),
                'message_id': headers.get('message-id', ''),
                'return_path': headers.get('return-path', ''),
                'received': headers.get('received', ''),
                'spf': headers.get('received-spf', ''),
                'dkim': headers.get('dkim-signature', ''),
                'dmarc': headers.get('dmarc', ''),
                'is_suspicious': False,
                'risk_score': 0.0
            }
            
            # Check for suspicious header patterns
            if not headers.get('dkim') or not headers.get('spf'):
                analysis['is_suspicious'] = True
                analysis['risk_score'] = 0.3
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error parsing email headers: {str(e)}")
            return {'error': str(e)}
    
    # Function 12: Email subject analysis
    def analyze_email_subject(self, subject: str) -> Dict[str, Any]:
        """Analyze email subject for phishing indicators"""
        try:
            suspicious_keywords = [
                'urgent', 'immediate', 'action required', 'verify', 'confirm',
                'suspended', 'locked', 'expired', 'security alert', 'fraud'
            ]
            
            found_keywords = []
            subject_lower = subject.lower()
            
            for keyword in suspicious_keywords:
                if keyword in subject_lower:
                    found_keywords.append(keyword)
            
            analysis = {
                'subject': subject,
                'length': len(subject),
                'found_keywords': found_keywords,
                'keyword_count': len(found_keywords),
                'is_suspicious': len(found_keywords) > 0,
                'risk_score': min(len(found_keywords) / 3.0, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing email subject: {str(e)}")
            return {'error': str(e)}
    
    # Function 13: NLP on email body
    def analyze_email_body_nlp(self, email_body: str) -> Dict[str, Any]:
        """Perform NLP analysis on email body"""
        try:
            # Basic NLP features
            word_count = len(email_body.split())
            char_count = len(email_body)
            sentence_count = len(email_body.split('.'))
            
            # Sentiment analysis (simplified)
            positive_words = ['good', 'great', 'excellent', 'wonderful', 'amazing']
            negative_words = ['bad', 'terrible', 'awful', 'horrible', 'disgusting']
            
            positive_count = sum(1 for word in positive_words if word in email_body.lower())
            negative_count = sum(1 for word in negative_words if word in email_body.lower())
            
            sentiment_score = (positive_count - negative_count) / max(word_count, 1)
            
            analysis = {
                'email_body': email_body,
                'word_count': word_count,
                'char_count': char_count,
                'sentence_count': sentence_count,
                'sentiment_score': sentiment_score,
                'positive_words': positive_count,
                'negative_words': negative_count,
                'is_suspicious': sentiment_score < -0.1,
                'risk_score': abs(sentiment_score)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing email body NLP: {str(e)}")
            return {'error': str(e)}
    
    # Function 14: Attachment type detection
    def detect_attachment_types(self, email_content: str) -> Dict[str, Any]:
        """Detect attachment types in email"""
        try:
            attachment_patterns = [
                r'attachment[:\s]+([^\s]+)',
                r'attached[:\s]+([^\s]+)',
                r'enclosed[:\s]+([^\s]+)',
                r'file[:\s]+([^\s]+)'
            ]
            
            attachments = []
            for pattern in attachment_patterns:
                matches = re.findall(pattern, email_content, re.IGNORECASE)
                attachments.extend(matches)
            
            # Analyze attachment types
            suspicious_extensions = ['.exe', '.bat', '.cmd', '.scr', '.pif', '.com']
            suspicious_attachments = []
            
            for attachment in attachments:
                if any(attachment.lower().endswith(ext) for ext in suspicious_extensions):
                    suspicious_attachments.append(attachment)
            
            analysis = {
                'attachments': attachments,
                'attachment_count': len(attachments),
                'suspicious_attachments': suspicious_attachments,
                'suspicious_count': len(suspicious_attachments),
                'is_suspicious': len(suspicious_attachments) > 0,
                'risk_score': min(len(suspicious_attachments) / 2.0, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error detecting attachment types: {str(e)}")
            return {'error': str(e)}
    
    # Function 15: Hidden form detection on webpage
    def detect_hidden_forms(self, url: str) -> Dict[str, Any]:
        """Detect hidden forms on webpage"""
        try:
            # This would require web scraping in a real implementation
            # For now, return a placeholder
            analysis = {
                'url': url,
                'hidden_forms': [],
                'form_count': 0,
                'is_suspicious': False,
                'risk_score': 0.0,
                'note': 'Web scraping not implemented in this version'
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error detecting hidden forms: {str(e)}")
            return {'error': str(e)}
    
    # Function 16: Suspicious JS detection
    def detect_suspicious_javascript(self, url: str) -> Dict[str, Any]:
        """Detect suspicious JavaScript on webpage"""
        try:
            # This would require web scraping in a real implementation
            # For now, return a placeholder
            analysis = {
                'url': url,
                'suspicious_js': [],
                'js_count': 0,
                'is_suspicious': False,
                'risk_score': 0.0,
                'note': 'Web scraping not implemented in this version'
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error detecting suspicious JavaScript: {str(e)}")
            return {'error': str(e)}
    
    # Function 17: External script detection
    def detect_external_scripts(self, url: str) -> Dict[str, Any]:
        """Detect external scripts on webpage"""
        try:
            # This would require web scraping in a real implementation
            # For now, return a placeholder
            analysis = {
                'url': url,
                'external_scripts': [],
                'script_count': 0,
                'is_suspicious': False,
                'risk_score': 0.0,
                'note': 'Web scraping not implemented in this version'
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error detecting external scripts: {str(e)}")
            return {'error': str(e)}
    
    # Function 18: Webpage screenshot capture
    def capture_webpage_screenshot(self, url: str) -> Dict[str, Any]:
        """Capture webpage screenshot for analysis"""
        try:
            # This would require a headless browser in a real implementation
            # For now, return a placeholder
            analysis = {
                'url': url,
                'screenshot_path': None,
                'screenshot_captured': False,
                'note': 'Screenshot capture not implemented in this version'
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error capturing webpage screenshot: {str(e)}")
            return {'error': str(e)}
    
    # Function 19: URL classifier (XGBoost/RandomForest)
    def classify_url_ml(self, url: str) -> Dict[str, Any]:
        """Classify URL using ML model"""
        try:
            if not self.models.get('url_classifier'):
                return {'error': 'URL classifier model not loaded'}
            
            features = self._extract_url_features(url)
            prediction = self.models['url_classifier'].predict([features])[0]
            probability = self.models['url_classifier'].predict_proba([features])[0]
            
            analysis = {
                'url': url,
                'prediction': 'phishing' if prediction == 1 else 'safe',
                'confidence': float(max(probability)),
                'features': features,
                'is_phishing': prediction == 1
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error classifying URL with ML: {str(e)}")
            return {'error': str(e)}
    
    # Function 20: Email NLP classifier (LSTM/Transformer)
    def classify_email_nlp(self, email_content: str) -> Dict[str, Any]:
        """Classify email using NLP model"""
        try:
            if not self.models.get('email_nlp'):
                return {'error': 'Email NLP model not loaded'}
            
            features = self._extract_email_features(email_content)
            prediction = self.models['email_nlp'].predict(features)
            
            analysis = {
                'email_content': email_content,
                'prediction': 'phishing' if prediction[0][0] > 0.5 else 'safe',
                'confidence': float(prediction[0][0]),
                'features': features.tolist(),
                'is_phishing': prediction[0][0] > 0.5
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error classifying email with NLP: {str(e)}")
            return {'error': str(e)}
    
    # Function 21: Screenshot CNN classifier
    def classify_screenshot_cnn(self, screenshot_path: str) -> Dict[str, Any]:
        """Classify screenshot using CNN model"""
        try:
            if not self.models.get('screenshot_cnn'):
                return {'error': 'Screenshot CNN model not loaded'}
            
            # Load and preprocess image
            img = Image.open(screenshot_path)
            img = img.resize((224, 224))
            img_array = np.array(img) / 255.0
            img_array = np.expand_dims(img_array, axis=0)
            
            prediction = self.models['screenshot_cnn'].predict(img_array)
            
            analysis = {
                'screenshot_path': screenshot_path,
                'prediction': 'phishing' if prediction[0][0] > 0.5 else 'safe',
                'confidence': float(prediction[0][0]),
                'is_phishing': prediction[0][0] > 0.5
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error classifying screenshot with CNN: {str(e)}")
            return {'error': str(e)}
    
    # Function 22: Prediction: Safe / Phishing
    def predict_phishing(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Make final phishing prediction"""
        try:
            predictions = []
            confidences = []
            
            # URL analysis
            if 'url' in input_data:
                url_result = self.analyze_url(input_data['url'])
                predictions.append(url_result.get('is_phishing', False))
                confidences.append(url_result.get('confidence', 0.0))
            
            # Email analysis
            if 'email_content' in input_data:
                email_result = self.analyze_email_text(
                    input_data['email_content'],
                    input_data.get('subject', ''),
                    input_data.get('sender', '')
                )
                predictions.append(email_result.get('is_phishing', False))
                confidences.append(email_result.get('confidence', 0.0))
            
            # Calculate ensemble prediction
            if predictions:
                final_prediction = sum(predictions) / len(predictions) > 0.5
                final_confidence = sum(confidences) / len(confidences)
            else:
                final_prediction = False
                final_confidence = 0.0
            
            analysis = {
                'input_data': input_data,
                'prediction': 'phishing' if final_prediction else 'safe',
                'confidence': final_confidence,
                'is_phishing': final_prediction,
                'individual_predictions': predictions,
                'individual_confidences': confidences
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error making phishing prediction: {str(e)}")
            return {'error': str(e)}
    
    # Function 23: Confidence score for phishing detection
    def calculate_confidence_score(self, analysis_results: List[Dict[str, Any]]) -> float:
        """Calculate confidence score for phishing detection"""
        try:
            if not analysis_results:
                return 0.0
            
            # Weight different analysis types
            weights = {
                'url_analysis': 0.3,
                'email_analysis': 0.4,
                'ml_prediction': 0.3
            }
            
            weighted_score = 0.0
            total_weight = 0.0
            
            for result in analysis_results:
                analysis_type = result.get('type', 'unknown')
                confidence = result.get('confidence', 0.0)
                weight = weights.get(analysis_type, 0.1)
                
                weighted_score += confidence * weight
                total_weight += weight
            
            return weighted_score / total_weight if total_weight > 0 else 0.0
            
        except Exception as e:
            logger.error(f"Error calculating confidence score: {str(e)}")
            return 0.0
    
    # Function 24: Explainability: highlight suspicious features
    def explain_phishing_detection(self, analysis_results: Dict[str, Any]) -> Dict[str, Any]:
        """Provide explainability for phishing detection"""
        try:
            explanation = {
                'overall_prediction': analysis_results.get('prediction', 'unknown'),
                'confidence': analysis_results.get('confidence', 0.0),
                'suspicious_features': [],
                'risk_factors': [],
                'recommendations': []
            }
            
            # Analyze suspicious features
            if analysis_results.get('is_phishing', False):
                explanation['suspicious_features'].append('High risk of phishing detected')
            
            if analysis_results.get('url_length', 0) > 100:
                explanation['suspicious_features'].append('URL is unusually long')
            
            if analysis_results.get('suspicious_keywords'):
                explanation['suspicious_features'].append('Contains suspicious keywords')
            
            if analysis_results.get('is_ip_address', False):
                explanation['suspicious_features'].append('URL contains IP address instead of domain')
            
            # Risk factors
            if explanation['confidence'] > 0.8:
                explanation['risk_factors'].append('Very high confidence in phishing detection')
            elif explanation['confidence'] > 0.6:
                explanation['risk_factors'].append('High confidence in phishing detection')
            
            # Recommendations
            if explanation['overall_prediction'] == 'phishing':
                explanation['recommendations'].append('Block this URL/email')
                explanation['recommendations'].append('Report to security team')
                explanation['recommendations'].append('Update threat intelligence')
            else:
                explanation['recommendations'].append('Monitor for similar patterns')
                explanation['recommendations'].append('Continue normal operations')
            
            return explanation
            
        except Exception as e:
            logger.error(f"Error explaining phishing detection: {str(e)}")
            return {'error': str(e)}
    
    # Function 25: Suggested mitigation: block domain
    def suggest_domain_block(self, domain: str) -> Dict[str, Any]:
        """Suggest blocking a domain"""
        try:
            suggestion = {
                'action': 'block_domain',
                'domain': domain,
                'reason': 'Phishing domain detected',
                'priority': 'high',
                'implementation': [
                    'Add to firewall blocklist',
                    'Update DNS filtering rules',
                    'Notify security team',
                    'Update threat intelligence feeds'
                ],
                'estimated_impact': 'Prevents access to malicious domain',
                'rollback_plan': 'Remove from blocklist if false positive'
            }
            
            return suggestion
            
        except Exception as e:
            logger.error(f"Error suggesting domain block: {str(e)}")
            return {'error': str(e)}
    
    # Function 26: Suggested mitigation: mark email as spam
    def suggest_email_spam(self, email_data: Dict[str, Any]) -> Dict[str, Any]:
        """Suggest marking email as spam"""
        try:
            suggestion = {
                'action': 'mark_spam',
                'email_data': email_data,
                'reason': 'Phishing email detected',
                'priority': 'high',
                'implementation': [
                    'Add sender to spam filter',
                    'Update email security rules',
                    'Notify users about phishing attempt',
                    'Update threat intelligence'
                ],
                'estimated_impact': 'Prevents similar emails from reaching users',
                'rollback_plan': 'Remove from spam filter if false positive'
            }
            
            return suggestion
            
        except Exception as e:
            logger.error(f"Error suggesting email spam: {str(e)}")
            return {'error': str(e)}
    
    # Helper methods
    def _extract_url_features(self, url: str) -> List[float]:
        """Extract features from URL for ML model"""
        try:
            features = []
            
            # Basic URL features
            features.append(len(url))  # URL length
            features.append(url.count('.'))  # Dot count
            features.append(url.count('/'))  # Slash count
            features.append(url.count('-'))  # Hyphen count
            
            # Check for IP address
            ip_pattern = r'^(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$'
            features.append(1.0 if re.match(ip_pattern, urlparse(url).netloc) else 0.0)
            
            # Check for suspicious keywords
            suspicious_keywords = ['secure', 'account', 'verify', 'login', 'password']
            keyword_count = sum(1 for keyword in suspicious_keywords if keyword in url.lower())
            features.append(keyword_count)
            
            # Check for HTTPS
            features.append(1.0 if url.startswith('https://') else 0.0)
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting URL features: {str(e)}")
            return [0.0] * 8
    
    def _extract_email_features(self, email_content: str) -> np.ndarray:
        """Extract features from email for ML model"""
        try:
            if not self.vectorizers.get('email'):
                # Create dummy features if vectorizer not available
                return np.array([[0.0] * 100])
            
            # Vectorize email content
            features = self.vectorizers['email'].transform([email_content])
            return features.toarray()
            
        except Exception as e:
            logger.error(f"Error extracting email features: {str(e)}")
            return np.array([[0.0] * 100])
    
    def _parse_email_file(self, file_path: str) -> Dict[str, Any]:
        """Parse email file (.eml/.msg)"""
        try:
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read()
            
            # Simple email parsing
            lines = content.split('\n')
            headers = {}
            body_start = 0
            
            for i, line in enumerate(lines):
                if ':' in line and not line.startswith(' '):
                    key, value = line.split(':', 1)
                    headers[key.strip().lower()] = value.strip()
                elif line.strip() == '':
                    body_start = i + 1
                    break
            
            body = '\n'.join(lines[body_start:])
            
            return {
                'content': body,
                'subject': headers.get('subject', ''),
                'sender': headers.get('from', ''),
                'recipient': headers.get('to', ''),
                'headers': headers
            }
            
        except Exception as e:
            logger.error(f"Error parsing email file: {str(e)}")
            return {'content': '', 'subject': '', 'sender': '', 'recipient': '', 'headers': {}}
    
    def _store_phishing_analysis(self, analysis: Dict[str, Any], analysis_type: str):
        """Store phishing analysis in database"""
        try:
            # This would store in database in a real implementation
            # For now, just log the analysis
            logger.info(f"Storing phishing analysis: {analysis_type}")
            
        except Exception as e:
            logger.error(f"Error storing phishing analysis: {str(e)}")

# Global instance
phishing_service = PhishingDetectionService()

def get_phishing_service() -> PhishingDetectionService:
    """Get phishing detection service instance"""
    return phishing_service

