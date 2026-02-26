"""
IDS/Intrusion Detection Service - Functions 141-210
AI/ML Cybersecurity Platform
"""

import os
import json
import numpy as np
import pandas as pd
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
import logging
import scapy.all as scapy
from scapy.layers.inet import IP, TCP, UDP, ICMP
from scapy.layers.l2 import Ether
import pyshark
import requests
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
from sklearn.preprocessing import StandardScaler
import joblib
import tensorflow as tf
try:
    from tensorflow.keras.models import Sequential, load_model
    from tensorflow.keras.layers import LSTM, Dense, Dropout, Conv1D, MaxPooling1D
    from tensorflow.keras.preprocessing.sequence import pad_sequences
    TENSORFLOW_AVAILABLE = True
except ImportError:
    TENSORFLOW_AVAILABLE = False
import pickle

from utils.logging_utils import get_security_logger
from database.models import IDSAnalysis, Alert, Event

logger = logging.getLogger(__name__)
security_logger = get_security_logger()

class IDSDetectionService:
    """IDS detection service implementing functions 141-210"""
    
    def __init__(self):
        self.models = {}
        self.scalers = {}
        self.attack_patterns = {}
        self.load_models()
        self.load_attack_patterns()
    
    def load_models(self):
        """Load pre-trained models"""
        try:
            # Load supervised classifier
            if os.path.exists('models/ids_supervised_classifier.pkl'):
                self.models['supervised_classifier'] = joblib.load('models/ids_supervised_classifier.pkl')
            
            # Load anomaly detection model
            if os.path.exists('models/ids_anomaly_detector.pkl'):
                self.models['anomaly_detector'] = joblib.load('models/ids_anomaly_detector.pkl')
            
            # Load LSTM model for sequence detection (only if TensorFlow is available)
            if TENSORFLOW_AVAILABLE and os.path.exists('models/ids_lstm_model.h5'):
                self.models['lstm_model'] = load_model('models/ids_lstm_model.h5')
            
            # Load scalers
            if os.path.exists('models/ids_scaler.pkl'):
                self.scalers['feature_scaler'] = joblib.load('models/ids_scaler.pkl')
            
            logger.info("IDS detection models loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading IDS models: {str(e)}")
    
    def load_attack_patterns(self):
        """Load attack patterns and signatures"""
        try:
            # Load attack patterns from JSON file
            if os.path.exists('rules/attack_patterns.json'):
                with open('rules/attack_patterns.json', 'r') as f:
                    self.attack_patterns = json.load(f)
            
            logger.info(f"Loaded {len(self.attack_patterns)} attack patterns")
            
        except Exception as e:
            logger.error(f"Error loading attack patterns: {str(e)}")
    
    # Function 49: Upload PCAP file for IDS
    def analyze_pcap_file(self, pcap_file: str) -> Dict[str, Any]:
        """Analyze PCAP file for intrusion detection"""
        try:
            # Parse PCAP file
            packets = scapy.rdpcap(pcap_file)
            
            # Extract network features
            network_features = self._extract_network_features(packets)
            
            # Detect attacks
            attack_detections = self._detect_attacks(packets)
            
            # ML-based classification
            ml_analysis = self._perform_ml_analysis(network_features)
            
            # Anomaly detection
            anomaly_analysis = self._perform_anomaly_detection(network_features)
            
            # Sequence-based detection
            sequence_analysis = self._perform_sequence_detection(packets)
            
            analysis = {
                'pcap_file': pcap_file,
                'packet_count': len(packets),
                'network_features': network_features,
                'attack_detections': attack_detections,
                'ml_analysis': ml_analysis,
                'anomaly_analysis': anomaly_analysis,
                'sequence_analysis': sequence_analysis,
                'is_intrusion': len(attack_detections) > 0 or ml_analysis.get('is_intrusion', False),
                'confidence_score': self._calculate_confidence_score(attack_detections, ml_analysis),
                'risk_score': self._calculate_risk_score(attack_detections, network_features),
                'attack_types': [detection['attack_type'] for detection in attack_detections]
            }
            
            # Store analysis in database
            self._store_ids_analysis(analysis)
            
            # Log security event
            security_logger.log_intrusion_detection(
                source_ip=network_features.get('source_ip', 'unknown'),
                attack_type=analysis.get('attack_types', ['unknown'])[0] if analysis.get('attack_types') else 'unknown',
                confidence=analysis.get('confidence_score', 0.0),
                details=analysis
            )
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing PCAP file {pcap_file}: {str(e)}")
            return {'error': str(e)}
    
    # Function 50: Live capture via NIC
    def live_capture(self, interface: str = 'eth0', duration: int = 60) -> Dict[str, Any]:
        """Perform live network capture"""
        try:
            # This would perform live capture in a real implementation
            # For now, return a placeholder
            analysis = {
                'interface': interface,
                'duration': duration,
                'packets_captured': 0,
                'attacks_detected': [],
                'is_intrusion': False,
                'confidence_score': 0.0,
                'note': 'Live capture not implemented in this version'
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error in live capture: {str(e)}")
            return {'error': str(e)}
    
    # Function 51: Import NetFlow logs
    def analyze_netflow_logs(self, netflow_file: str) -> Dict[str, Any]:
        """Analyze NetFlow logs for intrusion detection"""
        try:
            # Parse NetFlow logs
            netflow_data = self._parse_netflow_logs(netflow_file)
            
            # Extract features from NetFlow data
            features = self._extract_netflow_features(netflow_data)
            
            # Detect attacks in NetFlow data
            attack_detections = self._detect_netflow_attacks(netflow_data)
            
            analysis = {
                'netflow_file': netflow_file,
                'flow_count': len(netflow_data),
                'features': features,
                'attack_detections': attack_detections,
                'is_intrusion': len(attack_detections) > 0,
                'confidence_score': len(attack_detections) * 0.3,
                'risk_score': min(len(attack_detections) * 0.2, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing NetFlow logs: {str(e)}")
            return {'error': str(e)}
    
    # Function 52: Import system logs
    def analyze_system_logs(self, log_file: str) -> Dict[str, Any]:
        """Analyze system logs for intrusion detection"""
        try:
            # Parse system logs
            log_data = self._parse_system_logs(log_file)
            
            # Extract features from log data
            features = self._extract_log_features(log_data)
            
            # Detect attacks in log data
            attack_detections = self._detect_log_attacks(log_data)
            
            analysis = {
                'log_file': log_file,
                'log_entries': len(log_data),
                'features': features,
                'attack_detections': attack_detections,
                'is_intrusion': len(attack_detections) > 0,
                'confidence_score': len(attack_detections) * 0.4,
                'risk_score': min(len(attack_detections) * 0.3, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing system logs: {str(e)}")
            return {'error': str(e)}
    
    # Function 53: Network feature extraction - source/dest IP
    def extract_ip_features(self, packets: List) -> Dict[str, Any]:
        """Extract IP-based features from packets"""
        try:
            source_ips = []
            dest_ips = []
            
            for packet in packets:
                if IP in packet:
                    source_ips.append(packet[IP].src)
                    dest_ips.append(packet[IP].dst)
            
            # Calculate IP statistics
            unique_source_ips = len(set(source_ips))
            unique_dest_ips = len(set(dest_ips))
            total_ips = unique_source_ips + unique_dest_ips
            
            # Check for suspicious IP patterns
            suspicious_ips = self._identify_suspicious_ips(source_ips + dest_ips)
            
            features = {
                'source_ips': source_ips,
                'dest_ips': dest_ips,
                'unique_source_ips': unique_source_ips,
                'unique_dest_ips': unique_dest_ips,
                'total_unique_ips': total_ips,
                'suspicious_ips': suspicious_ips,
                'ip_diversity_score': total_ips / len(packets) if packets else 0,
                'is_suspicious': len(suspicious_ips) > 0
            }
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting IP features: {str(e)}")
            return {'error': str(e)}
    
    # Function 54: Network feature extraction - ports, bytes, duration
    def extract_port_features(self, packets: List) -> Dict[str, Any]:
        """Extract port-based features from packets"""
        try:
            source_ports = []
            dest_ports = []
            packet_sizes = []
            
            for packet in packets:
                if IP in packet:
                    packet_sizes.append(len(packet))
                    
                    if TCP in packet:
                        source_ports.append(packet[TCP].sport)
                        dest_ports.append(packet[TCP].dport)
                    elif UDP in packet:
                        source_ports.append(packet[UDP].sport)
                        dest_ports.append(packet[UDP].dport)
            
            # Calculate port statistics
            unique_source_ports = len(set(source_ports))
            unique_dest_ports = len(set(dest_ports))
            total_bytes = sum(packet_sizes)
            avg_packet_size = total_bytes / len(packets) if packets else 0
            
            # Check for suspicious port patterns
            suspicious_ports = self._identify_suspicious_ports(dest_ports)
            
            features = {
                'source_ports': source_ports,
                'dest_ports': dest_ports,
                'packet_sizes': packet_sizes,
                'unique_source_ports': unique_source_ports,
                'unique_dest_ports': unique_dest_ports,
                'total_bytes': total_bytes,
                'avg_packet_size': avg_packet_size,
                'suspicious_ports': suspicious_ports,
                'port_diversity_score': (unique_source_ports + unique_dest_ports) / len(packets) if packets else 0,
                'is_suspicious': len(suspicious_ports) > 0
            }
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting port features: {str(e)}")
            return {'error': str(e)}
    
    # Function 55: TCP flags analysis
    def analyze_tcp_flags(self, packets: List) -> Dict[str, Any]:
        """Analyze TCP flags for attack patterns"""
        try:
            tcp_flags = []
            flag_combinations = []
            
            for packet in packets:
                if TCP in packet:
                    flags = packet[TCP].flags
                    tcp_flags.append(flags)
                    flag_combinations.append(str(flags))
            
            # Count flag occurrences
            flag_counts = {}
            for flags in tcp_flags:
                flag_counts[flags] = flag_counts.get(flags, 0) + 1
            
            # Check for suspicious flag patterns
            suspicious_patterns = self._identify_suspicious_tcp_flags(flag_combinations)
            
            analysis = {
                'tcp_flags': tcp_flags,
                'flag_combinations': flag_combinations,
                'flag_counts': flag_counts,
                'suspicious_patterns': suspicious_patterns,
                'is_suspicious': len(suspicious_patterns) > 0,
                'risk_score': min(len(suspicious_patterns) * 0.3, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing TCP flags: {str(e)}")
            return {'error': str(e)}
    
    # Function 56: Protocol analysis
    def analyze_protocols(self, packets: List) -> Dict[str, Any]:
        """Analyze network protocols for anomalies"""
        try:
            protocols = []
            protocol_counts = {}
            
            for packet in packets:
                if IP in packet:
                    protocol = packet[IP].proto
                    protocols.append(protocol)
                    protocol_counts[protocol] = protocol_counts.get(protocol, 0) + 1
            
            # Identify protocol names
            protocol_names = {
                1: 'ICMP',
                6: 'TCP',
                17: 'UDP',
                47: 'GRE',
                50: 'ESP',
                51: 'AH'
            }
            
            # Check for suspicious protocols
            suspicious_protocols = self._identify_suspicious_protocols(protocol_counts)
            
            analysis = {
                'protocols': protocols,
                'protocol_counts': protocol_counts,
                'protocol_names': {k: protocol_names.get(k, f'Unknown({k})') for k in protocol_counts.keys()},
                'suspicious_protocols': suspicious_protocols,
                'is_suspicious': len(suspicious_protocols) > 0,
                'risk_score': min(len(suspicious_protocols) * 0.2, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing protocols: {str(e)}")
            return {'error': str(e)}
    
    # Function 57: Host features - failed logins
    def analyze_failed_logins(self, log_data: List[Dict]) -> Dict[str, Any]:
        """Analyze failed login attempts"""
        try:
            failed_logins = []
            login_attempts = {}
            
            for entry in log_data:
                if 'failed' in entry.get('message', '').lower() and 'login' in entry.get('message', '').lower():
                    failed_logins.append(entry)
                    source_ip = entry.get('source_ip', 'unknown')
                    login_attempts[source_ip] = login_attempts.get(source_ip, 0) + 1
            
            # Identify brute force attempts
            brute_force_ips = [ip for ip, count in login_attempts.items() if count > 5]
            
            analysis = {
                'failed_logins': failed_logins,
                'login_attempts': login_attempts,
                'brute_force_ips': brute_force_ips,
                'total_failed_logins': len(failed_logins),
                'unique_attackers': len(login_attempts),
                'is_brute_force': len(brute_force_ips) > 0,
                'risk_score': min(len(brute_force_ips) * 0.3, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing failed logins: {str(e)}")
            return {'error': str(e)}
    
    # Function 58: Host features - privilege escalations
    def analyze_privilege_escalations(self, log_data: List[Dict]) -> Dict[str, Any]:
        """Analyze privilege escalation attempts"""
        try:
            privilege_escalations = []
            
            for entry in log_data:
                message = entry.get('message', '').lower()
                if any(keyword in message for keyword in ['sudo', 'su', 'runas', 'elevate', 'privilege']):
                    privilege_escalations.append(entry)
            
            analysis = {
                'privilege_escalations': privilege_escalations,
                'escalation_count': len(privilege_escalations),
                'is_suspicious': len(privilege_escalations) > 0,
                'risk_score': min(len(privilege_escalations) * 0.4, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing privilege escalations: {str(e)}")
            return {'error': str(e)}
    
    # Function 59: Host features - file integrity changes
    def analyze_file_integrity(self, log_data: List[Dict]) -> Dict[str, Any]:
        """Analyze file integrity changes"""
        try:
            file_changes = []
            critical_files = []
            
            for entry in log_data:
                message = entry.get('message', '').lower()
                if any(keyword in message for keyword in ['modified', 'changed', 'deleted', 'created']):
                    file_changes.append(entry)
                    
                    # Check for critical system files
                    if any(critical in message for critical in ['/etc/', '/bin/', '/sbin/', '/usr/bin/']):
                        critical_files.append(entry)
            
            analysis = {
                'file_changes': file_changes,
                'critical_files': critical_files,
                'change_count': len(file_changes),
                'critical_change_count': len(critical_files),
                'is_suspicious': len(critical_files) > 0,
                'risk_score': min(len(critical_files) * 0.5, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing file integrity: {str(e)}")
            return {'error': str(e)}
    
    # Function 60: Host features - suspicious process detection
    def analyze_suspicious_processes(self, log_data: List[Dict]) -> Dict[str, Any]:
        """Analyze suspicious process activities"""
        try:
            suspicious_processes = []
            process_activities = {}
            
            for entry in log_data:
                message = entry.get('message', '').lower()
                if any(keyword in message for keyword in ['process', 'exec', 'spawn', 'fork']):
                    suspicious_processes.append(entry)
                    
                    # Extract process name if possible
                    if 'exec' in message:
                        process_activities[entry.get('process_name', 'unknown')] = process_activities.get(entry.get('process_name', 'unknown'), 0) + 1
            
            analysis = {
                'suspicious_processes': suspicious_processes,
                'process_activities': process_activities,
                'process_count': len(suspicious_processes),
                'unique_processes': len(process_activities),
                'is_suspicious': len(suspicious_processes) > 10,
                'risk_score': min(len(suspicious_processes) / 50.0, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing suspicious processes: {str(e)}")
            return {'error': str(e)}
    
    # Function 61: Supervised classifier
    def classify_attacks_supervised(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Classify attacks using supervised learning"""
        try:
            if not self.models.get('supervised_classifier'):
                return {'error': 'Supervised classifier model not loaded'}
            
            # Extract features for classification
            feature_vector = self._extract_classification_features(features)
            
            # Make prediction
            prediction = self.models['supervised_classifier'].predict([feature_vector])[0]
            probability = self.models['supervised_classifier'].predict_proba([feature_vector])[0]
            
            # Map prediction to attack type
            attack_types = ['Normal', 'DoS', 'DDoS', 'Brute Force', 'SQLi', 'XSS']
            predicted_attack = attack_types[prediction] if prediction < len(attack_types) else 'Unknown'
            
            analysis = {
                'prediction': predicted_attack,
                'confidence': float(max(probability)),
                'is_intrusion': prediction != 0,  # 0 is Normal
                'attack_type': predicted_attack,
                'feature_vector': feature_vector
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error in supervised classification: {str(e)}")
            return {'error': str(e)}
    
    # Function 62: Anomaly detection
    def detect_anomalies(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Detect anomalies using unsupervised learning"""
        try:
            if not self.models.get('anomaly_detector'):
                return {'error': 'Anomaly detector model not loaded'}
            
            # Extract features for anomaly detection
            feature_vector = self._extract_anomaly_features(features)
            
            # Make prediction
            prediction = self.models['anomaly_detector'].predict([feature_vector])[0]
            anomaly_score = self.models['anomaly_detector'].decision_function([feature_vector])[0]
            
            analysis = {
                'is_anomaly': prediction == -1,
                'anomaly_score': float(anomaly_score),
                'confidence': abs(anomaly_score),
                'feature_vector': feature_vector
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error in anomaly detection: {str(e)}")
            return {'error': str(e)}
    
    # Function 63: Sequence-based detection
    def detect_attack_sequences(self, packets: List) -> Dict[str, Any]:
        """Detect attack sequences using LSTM"""
        try:
            if not self.models.get('lstm_model'):
                return {'error': 'LSTM model not loaded'}
            
            # Extract sequence features
            sequences = self._extract_sequence_features(packets)
            
            if not sequences:
                return {'error': 'No sequences found'}
            
            # Pad sequences
            padded_sequences = pad_sequences(sequences, maxlen=100, padding='post')
            
            # Make prediction
            prediction = self.models['lstm_model'].predict(padded_sequences)
            
            analysis = {
                'sequences': sequences,
                'padded_sequences': padded_sequences.tolist(),
                'predictions': prediction.tolist(),
                'is_intrusion': any(pred[0] > 0.5 for pred in prediction),
                'confidence': float(max(pred[0] for pred in prediction))
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error in sequence detection: {str(e)}")
            return {'error': str(e)}
    
    # Function 64: IDS prediction
    def predict_intrusion(self, input_data: Dict[str, Any]) -> Dict[str, Any]:
        """Make final intrusion prediction"""
        try:
            predictions = []
            confidences = []
            
            # Supervised classification
            if 'features' in input_data:
                supervised_result = self.classify_attacks_supervised(input_data['features'])
                if 'error' not in supervised_result:
                    predictions.append(supervised_result.get('is_intrusion', False))
                    confidences.append(supervised_result.get('confidence', 0.0))
            
            # Anomaly detection
            if 'features' in input_data:
                anomaly_result = self.detect_anomalies(input_data['features'])
                if 'error' not in anomaly_result:
                    predictions.append(anomaly_result.get('is_anomaly', False))
                    confidences.append(anomaly_result.get('confidence', 0.0))
            
            # Sequence detection
            if 'packets' in input_data:
                sequence_result = self.detect_attack_sequences(input_data['packets'])
                if 'error' not in sequence_result:
                    predictions.append(sequence_result.get('is_intrusion', False))
                    confidences.append(sequence_result.get('confidence', 0.0))
            
            # Calculate ensemble prediction
            if predictions:
                final_prediction = sum(predictions) / len(predictions) > 0.5
                final_confidence = sum(confidences) / len(confidences)
            else:
                final_prediction = False
                final_confidence = 0.0
            
            analysis = {
                'input_data': input_data,
                'prediction': 'intrusion' if final_prediction else 'normal',
                'confidence': final_confidence,
                'is_intrusion': final_prediction,
                'individual_predictions': predictions,
                'individual_confidences': confidences
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error predicting intrusion: {str(e)}")
            return {'error': str(e)}
    
    # Function 65: IDS output - Attack type
    def identify_attack_type(self, attack_detections: List[Dict]) -> Dict[str, Any]:
        """Identify specific attack types"""
        try:
            attack_types = []
            attack_counts = {}
            
            for detection in attack_detections:
                attack_type = detection.get('attack_type', 'unknown')
                attack_types.append(attack_type)
                attack_counts[attack_type] = attack_counts.get(attack_type, 0) + 1
            
            # Determine primary attack type
            primary_attack = max(attack_counts.items(), key=lambda x: x[1])[0] if attack_counts else 'none'
            
            analysis = {
                'attack_types': attack_types,
                'attack_counts': attack_counts,
                'primary_attack': primary_attack,
                'total_attacks': len(attack_detections),
                'unique_attack_types': len(attack_counts)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error identifying attack type: {str(e)}")
            return {'error': str(e)}
    
    # Function 66: Traffic visualization
    def visualize_traffic(self, packets: List) -> Dict[str, Any]:
        """Generate traffic visualization data"""
        try:
            # Extract traffic statistics
            traffic_stats = {
                'total_packets': len(packets),
                'total_bytes': sum(len(p) for p in packets),
                'protocols': {},
                'source_ips': {},
                'dest_ips': {},
                'ports': {},
                'timeline': []
            }
            
            for packet in packets:
                if IP in packet:
                    # Protocol statistics
                    proto = packet[IP].proto
                    traffic_stats['protocols'][proto] = traffic_stats['protocols'].get(proto, 0) + 1
                    
                    # IP statistics
                    src_ip = packet[IP].src
                    dst_ip = packet[IP].dst
                    traffic_stats['source_ips'][src_ip] = traffic_stats['source_ips'].get(src_ip, 0) + 1
                    traffic_stats['dest_ips'][dst_ip] = traffic_stats['dest_ips'].get(dst_ip, 0) + 1
                    
                    # Port statistics
                    if TCP in packet:
                        port = packet[TCP].dport
                        traffic_stats['ports'][port] = traffic_stats['ports'].get(port, 0) + 1
                    elif UDP in packet:
                        port = packet[UDP].dport
                        traffic_stats['ports'][port] = traffic_stats['ports'].get(port, 0) + 1
                    
                    # Timeline data
                    timestamp = packet.time
                    traffic_stats['timeline'].append({
                        'timestamp': timestamp,
                        'bytes': len(packet),
                        'protocol': proto
                    })
            
            return traffic_stats
            
        except Exception as e:
            logger.error(f"Error visualizing traffic: {str(e)}")
            return {'error': str(e)}
    
    # Function 67: Suggested mitigation - block IP
    def suggest_ip_block(self, source_ip: str) -> Dict[str, Any]:
        """Suggest blocking an IP address"""
        try:
            suggestion = {
                'action': 'block_ip',
                'source_ip': source_ip,
                'reason': 'Malicious activity detected',
                'priority': 'high',
                'implementation': [
                    'Add to firewall blocklist',
                    'Update IDS rules',
                    'Notify security team',
                    'Update threat intelligence'
                ],
                'estimated_impact': 'Prevents further attacks from this IP',
                'rollback_plan': 'Remove from blocklist if false positive'
            }
            
            return suggestion
            
        except Exception as e:
            logger.error(f"Error suggesting IP block: {str(e)}")
            return {'error': str(e)}
    
    # Function 68: Suggested mitigation - alert admin
    def suggest_admin_alert(self, attack_details: Dict[str, Any]) -> Dict[str, Any]:
        """Suggest alerting administrator"""
        try:
            suggestion = {
                'action': 'alert_admin',
                'attack_details': attack_details,
                'reason': 'Critical security incident detected',
                'priority': 'critical',
                'implementation': [
                    'Send email alert to security team',
                    'Create incident ticket',
                    'Notify on-call security personnel',
                    'Update security dashboard'
                ],
                'estimated_impact': 'Ensures timely response to security incident',
                'rollback_plan': 'Close incident if false positive'
            }
            
            return suggestion
            
        except Exception as e:
            logger.error(f"Error suggesting admin alert: {str(e)}")
            return {'error': str(e)}
    
    # Helper methods
    def _extract_network_features(self, packets: List) -> Dict[str, Any]:
        """Extract comprehensive network features"""
        try:
            features = {}
            
            # IP features
            ip_features = self.extract_ip_features(packets)
            features.update(ip_features)
            
            # Port features
            port_features = self.extract_port_features(packets)
            features.update(port_features)
            
            # TCP flags
            tcp_flags = self.analyze_tcp_flags(packets)
            features.update(tcp_flags)
            
            # Protocol analysis
            protocols = self.analyze_protocols(packets)
            features.update(protocols)
            
            return features
            
        except Exception as e:
            logger.error(f"Error extracting network features: {str(e)}")
            return {}
    
    def _detect_attacks(self, packets: List) -> List[Dict[str, Any]]:
        """Detect various types of attacks"""
        try:
            attacks = []
            
            # Check against attack patterns
            for pattern_name, pattern in self.attack_patterns.items():
                if self._matches_pattern(packets, pattern):
                    attacks.append({
                        'attack_type': pattern_name,
                        'confidence': 0.8,
                        'description': pattern.get('description', ''),
                        'severity': pattern.get('severity', 'medium')
                    })
            
            return attacks
            
        except Exception as e:
            logger.error(f"Error detecting attacks: {str(e)}")
            return []
    
    def _perform_ml_analysis(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Perform ML-based analysis"""
        try:
            ml_analysis = {}
            
            # Supervised classification
            if self.models.get('supervised_classifier'):
                supervised_result = self.classify_attacks_supervised(features)
                ml_analysis['supervised_classification'] = supervised_result
            
            # Anomaly detection
            if self.models.get('anomaly_detector'):
                anomaly_result = self.detect_anomalies(features)
                ml_analysis['anomaly_detection'] = anomaly_result
            
            return ml_analysis
            
        except Exception as e:
            logger.error(f"Error in ML analysis: {str(e)}")
            return {}
    
    def _perform_anomaly_detection(self, features: Dict[str, Any]) -> Dict[str, Any]:
        """Perform anomaly detection"""
        try:
            return self.detect_anomalies(features)
        except Exception as e:
            logger.error(f"Error in anomaly detection: {str(e)}")
            return {}
    
    def _perform_sequence_detection(self, packets: List) -> Dict[str, Any]:
        """Perform sequence-based detection"""
        try:
            return self.detect_attack_sequences(packets)
        except Exception as e:
            logger.error(f"Error in sequence detection: {str(e)}")
            return {}
    
    def _calculate_confidence_score(self, attack_detections: List[Dict], ml_analysis: Dict[str, Any]) -> float:
        """Calculate confidence score for intrusion detection"""
        try:
            scores = []
            
            # Attack detection scores
            for attack in attack_detections:
                scores.append(attack.get('confidence', 0.0))
            
            # ML analysis scores
            if ml_analysis.get('supervised_classification', {}).get('is_intrusion', False):
                scores.append(ml_analysis['supervised_classification'].get('confidence', 0.0))
            
            if ml_analysis.get('anomaly_detection', {}).get('is_anomaly', False):
                scores.append(ml_analysis['anomaly_detection'].get('confidence', 0.0))
            
            # Calculate average
            return sum(scores) / len(scores) if scores else 0.0
            
        except Exception as e:
            logger.error(f"Error calculating confidence score: {str(e)}")
            return 0.0
    
    def _calculate_risk_score(self, attack_detections: List[Dict], features: Dict[str, Any]) -> float:
        """Calculate risk score for intrusion detection"""
        try:
            risk_factors = []
            
            # Attack-based risk
            for attack in attack_detections:
                severity = attack.get('severity', 'medium')
                if severity == 'critical':
                    risk_factors.append(0.9)
                elif severity == 'high':
                    risk_factors.append(0.7)
                elif severity == 'medium':
                    risk_factors.append(0.5)
                else:
                    risk_factors.append(0.3)
            
            # Feature-based risk
            if features.get('is_suspicious', False):
                risk_factors.append(0.6)
            
            # Calculate final risk score
            return sum(risk_factors) / len(risk_factors) if risk_factors else 0.0
            
        except Exception as e:
            logger.error(f"Error calculating risk score: {str(e)}")
            return 0.0
    
    def _parse_netflow_logs(self, netflow_file: str) -> List[Dict]:
        """Parse NetFlow logs"""
        try:
            # This would parse NetFlow logs in a real implementation
            # For now, return empty list
            return []
        except Exception as e:
            logger.error(f"Error parsing NetFlow logs: {str(e)}")
            return []
    
    def _extract_netflow_features(self, netflow_data: List[Dict]) -> Dict[str, Any]:
        """Extract features from NetFlow data"""
        try:
            # This would extract NetFlow features in a real implementation
            # For now, return empty dict
            return {}
        except Exception as e:
            logger.error(f"Error extracting NetFlow features: {str(e)}")
            return {}
    
    def _detect_netflow_attacks(self, netflow_data: List[Dict]) -> List[Dict[str, Any]]:
        """Detect attacks in NetFlow data"""
        try:
            # This would detect NetFlow attacks in a real implementation
            # For now, return empty list
            return []
        except Exception as e:
            logger.error(f"Error detecting NetFlow attacks: {str(e)}")
            return []
    
    def _parse_system_logs(self, log_file: str) -> List[Dict]:
        """Parse system logs"""
        try:
            log_data = []
            with open(log_file, 'r') as f:
                for line in f:
                    # Simple log parsing - would be more sophisticated in real implementation
                    log_data.append({
                        'timestamp': datetime.now().isoformat(),
                        'message': line.strip(),
                        'source_ip': 'unknown'
                    })
            return log_data
        except Exception as e:
            logger.error(f"Error parsing system logs: {str(e)}")
            return []
    
    def _extract_log_features(self, log_data: List[Dict]) -> Dict[str, Any]:
        """Extract features from log data"""
        try:
            features = {
                'total_entries': len(log_data),
                'error_count': sum(1 for entry in log_data if 'error' in entry.get('message', '').lower()),
                'warning_count': sum(1 for entry in log_data if 'warning' in entry.get('message', '').lower()),
                'critical_count': sum(1 for entry in log_data if 'critical' in entry.get('message', '').lower())
            }
            return features
        except Exception as e:
            logger.error(f"Error extracting log features: {str(e)}")
            return {}
    
    def _detect_log_attacks(self, log_data: List[Dict]) -> List[Dict[str, Any]]:
        """Detect attacks in log data"""
        try:
            attacks = []
            
            # Check for brute force attacks
            brute_force = self.analyze_failed_logins(log_data)
            if brute_force.get('is_brute_force', False):
                attacks.append({
                    'attack_type': 'brute_force',
                    'confidence': 0.8,
                    'description': 'Brute force login attempts detected',
                    'severity': 'high'
                })
            
            # Check for privilege escalation
            priv_esc = self.analyze_privilege_escalations(log_data)
            if priv_esc.get('is_suspicious', False):
                attacks.append({
                    'attack_type': 'privilege_escalation',
                    'confidence': 0.7,
                    'description': 'Privilege escalation attempts detected',
                    'severity': 'high'
                })
            
            return attacks
        except Exception as e:
            logger.error(f"Error detecting log attacks: {str(e)}")
            return []
    
    def _identify_suspicious_ips(self, ips: List[str]) -> List[str]:
        """Identify suspicious IP addresses"""
        try:
            suspicious_ips = []
            
            # Check for private IPs (could indicate internal attacks)
            for ip in ips:
                if ip.startswith(('192.168.', '10.', '172.')):
                    suspicious_ips.append(ip)
            
            return suspicious_ips
        except Exception as e:
            logger.error(f"Error identifying suspicious IPs: {str(e)}")
            return []
    
    def _identify_suspicious_ports(self, ports: List[int]) -> List[int]:
        """Identify suspicious ports"""
        try:
            suspicious_ports = []
            
            # Common attack ports
            attack_ports = [21, 22, 23, 25, 53, 80, 110, 143, 443, 993, 995]
            
            for port in ports:
                if port in attack_ports:
                    suspicious_ports.append(port)
            
            return suspicious_ports
        except Exception as e:
            logger.error(f"Error identifying suspicious ports: {str(e)}")
            return []
    
    def _identify_suspicious_tcp_flags(self, flag_combinations: List[str]) -> List[str]:
        """Identify suspicious TCP flag combinations"""
        try:
            suspicious_patterns = []
            
            # Common attack flag patterns
            attack_patterns = ['F', 'R', 'S', 'P', 'U']
            
            for flags in flag_combinations:
                if any(pattern in flags for pattern in attack_patterns):
                    suspicious_patterns.append(flags)
            
            return suspicious_patterns
        except Exception as e:
            logger.error(f"Error identifying suspicious TCP flags: {str(e)}")
            return []
    
    def _identify_suspicious_protocols(self, protocol_counts: Dict[int, int]) -> List[int]:
        """Identify suspicious protocols"""
        try:
            suspicious_protocols = []
            
            # Protocols that are often used in attacks
            attack_protocols = [1, 47, 50, 51]  # ICMP, GRE, ESP, AH
            
            for protocol, count in protocol_counts.items():
                if protocol in attack_protocols and count > 10:
                    suspicious_protocols.append(protocol)
            
            return suspicious_protocols
        except Exception as e:
            logger.error(f"Error identifying suspicious protocols: {str(e)}")
            return []
    
    def _extract_classification_features(self, features: Dict[str, Any]) -> List[float]:
        """Extract features for classification"""
        try:
            feature_vector = []
            
            # Add key features
            feature_vector.append(features.get('unique_source_ips', 0))
            feature_vector.append(features.get('unique_dest_ips', 0))
            feature_vector.append(features.get('unique_source_ports', 0))
            feature_vector.append(features.get('unique_dest_ports', 0))
            feature_vector.append(features.get('total_bytes', 0))
            feature_vector.append(features.get('avg_packet_size', 0))
            feature_vector.append(len(features.get('suspicious_ips', [])))
            feature_vector.append(len(features.get('suspicious_ports', [])))
            feature_vector.append(len(features.get('suspicious_patterns', [])))
            feature_vector.append(len(features.get('suspicious_protocols', [])))
            
            return feature_vector
        except Exception as e:
            logger.error(f"Error extracting classification features: {str(e)}")
            return [0.0] * 10
    
    def _extract_anomaly_features(self, features: Dict[str, Any]) -> List[float]:
        """Extract features for anomaly detection"""
        try:
            # Use same features as classification for now
            return self._extract_classification_features(features)
        except Exception as e:
            logger.error(f"Error extracting anomaly features: {str(e)}")
            return [0.0] * 10
    
    def _extract_sequence_features(self, packets: List) -> List[List[int]]:
        """Extract sequence features for LSTM"""
        try:
            sequences = []
            current_sequence = []
            
            for packet in packets:
                if IP in packet:
                    # Extract packet features
                    features = [
                        packet[IP].src.count('.'),
                        packet[IP].dst.count('.'),
                        len(packet),
                        packet[IP].proto
                    ]
                    
                    if TCP in packet:
                        features.extend([packet[TCP].sport, packet[TCP].dport, packet[TCP].flags])
                    elif UDP in packet:
                        features.extend([packet[UDP].sport, packet[UDP].dport, 0])
                    else:
                        features.extend([0, 0, 0])
                    
                    current_sequence.append(features)
                    
                    # Create sequences of length 10
                    if len(current_sequence) == 10:
                        sequences.append([sum(seq) for seq in zip(*current_sequence)])
                        current_sequence = current_sequence[1:]  # Slide window
            
            return sequences
        except Exception as e:
            logger.error(f"Error extracting sequence features: {str(e)}")
            return []
    
    def _matches_pattern(self, packets: List, pattern: Dict) -> bool:
        """Check if packets match an attack pattern"""
        try:
            # Simple pattern matching - would be more sophisticated in real implementation
            return False
        except Exception as e:
            logger.error(f"Error matching pattern: {str(e)}")
            return False
    
    def _store_ids_analysis(self, analysis: Dict[str, Any]):
        """Store IDS analysis in database"""
        try:
            # This would store in database in a real implementation
            # For now, just log the analysis
            logger.info("Storing IDS analysis")
        except Exception as e:
            logger.error(f"Error storing IDS analysis: {str(e)}")

# Global instance
ids_service = IDSDetectionService()

def get_ids_service() -> IDSDetectionService:
    """Get IDS detection service instance"""
    return ids_service
