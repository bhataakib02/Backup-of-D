"""
Ransomware Detection Service - Functions 251-280
AI/ML Cybersecurity Platform
"""

import os
import json
import numpy as np
import pandas as pd
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
import logging
import hashlib
import magic
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import joblib
import tensorflow as tf
from tensorflow.keras.models import Sequential, load_model
from tensorflow.keras.layers import LSTM, Dense, Dropout, Conv1D, MaxPooling1D
from tensorflow.keras.preprocessing.sequence import pad_sequences

from utils.logging_utils import get_security_logger
from database.models import RansomwareAnalysis, Alert

logger = logging.getLogger(__name__)
security_logger = get_security_logger()

class RansomwareDetectionService:
    """Ransomware detection service implementing functions 251-280"""
    
    def __init__(self):
        self.models = {}
        self.ransomware_patterns = {}
        self.load_models()
        self.load_ransomware_patterns()
    
    def load_models(self):
        """Load pre-trained models"""
        try:
            # Load file entropy classifier
            if os.path.exists('models/ransomware_entropy_classifier.pkl'):
                self.models['entropy_classifier'] = joblib.load('models/ransomware_entropy_classifier.pkl')
            
            # Load bulk operation detector
            if os.path.exists('models/ransomware_bulk_detector.pkl'):
                self.models['bulk_detector'] = joblib.load('models/ransomware_bulk_detector.pkl')
            
            # Load LSTM model for file operations
            if os.path.exists('models/ransomware_lstm_model.h5'):
                self.models['lstm_model'] = load_model('models/ransomware_lstm_model.h5')
            
            logger.info("Ransomware detection models loaded successfully")
            
        except Exception as e:
            logger.error(f"Error loading ransomware models: {str(e)}")
    
    def load_ransomware_patterns(self):
        """Load ransomware patterns"""
        try:
            if os.path.exists('rules/ransomware_patterns.json'):
                with open('rules/ransomware_patterns.json', 'r') as f:
                    self.ransomware_patterns = json.load(f)
            
            logger.info(f"Loaded {len(self.ransomware_patterns)} ransomware patterns")
            
        except Exception as e:
            logger.error(f"Error loading ransomware patterns: {str(e)}")
    
    # Function 79: File entropy monitoring
    def monitor_file_entropy(self, file_path: str) -> Dict[str, Any]:
        """Monitor file entropy for ransomware detection"""
        try:
            # Calculate file entropy
            with open(file_path, 'rb') as f:
                data = f.read()
            
            # Calculate entropy
            entropy = self._calculate_entropy(data)
            
            # Check against patterns
            is_suspicious = entropy > 7.5  # High entropy threshold
            
            # ML classification
            if self.models.get('entropy_classifier'):
                features = [entropy, len(data), self._get_file_type_score(file_path)]
                prediction = self.models['entropy_classifier'].predict([features])[0]
                confidence = self.models['entropy_classifier'].predict_proba([features])[0]
                is_ransomware = prediction == 1
                ml_confidence = max(confidence)
            else:
                is_ransomware = is_suspicious
                ml_confidence = 0.5
            
            analysis = {
                'file_path': file_path,
                'entropy': entropy,
                'file_size': len(data),
                'is_suspicious': is_suspicious,
                'is_ransomware': is_ransomware,
                'confidence': ml_confidence,
                'risk_score': min(entropy / 8.0, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error monitoring file entropy: {str(e)}")
            return {'error': str(e)}
    
    # Function 80: Bulk file operations detection
    def detect_bulk_operations(self, operations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Detect bulk file operations indicative of ransomware"""
        try:
            if not operations:
                return {'error': 'No operations provided'}
            
            # Analyze operation patterns
            operation_types = [op.get('type', '') for op in operations]
            file_extensions = [op.get('file_extension', '') for op in operations]
            operation_times = [op.get('timestamp', '') for op in operations]
            
            # Calculate bulk operation metrics
            bulk_metrics = {
                'total_operations': len(operations),
                'unique_extensions': len(set(file_extensions)),
                'operation_rate': len(operations) / 60,  # Operations per minute
                'suspicious_extensions': self._identify_suspicious_extensions(file_extensions),
                'time_span': self._calculate_time_span(operation_times)
            }
            
            # ML classification
            if self.models.get('bulk_detector'):
                features = [
                    bulk_metrics['total_operations'],
                    bulk_metrics['unique_extensions'],
                    bulk_metrics['operation_rate'],
                    len(bulk_metrics['suspicious_extensions'])
                ]
                prediction = self.models['bulk_detector'].predict([features])[0]
                confidence = self.models['bulk_detector'].predict_proba([features])[0]
                is_ransomware = prediction == 1
                ml_confidence = max(confidence)
            else:
                # Heuristic detection
                is_ransomware = (
                    bulk_metrics['total_operations'] > 100 and
                    bulk_metrics['operation_rate'] > 10 and
                    len(bulk_metrics['suspicious_extensions']) > 0
                )
                ml_confidence = 0.7 if is_ransomware else 0.3
            
            analysis = {
                'operations': operations,
                'bulk_metrics': bulk_metrics,
                'is_ransomware': is_ransomware,
                'confidence': ml_confidence,
                'risk_score': min(bulk_metrics['operation_rate'] / 20.0, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error detecting bulk operations: {str(e)}")
            return {'error': str(e)}
    
    # Function 81: File renaming pattern analysis
    def analyze_renaming_patterns(self, rename_operations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze file renaming patterns for ransomware detection"""
        try:
            if not rename_operations:
                return {'error': 'No rename operations provided'}
            
            # Extract patterns
            old_names = [op.get('old_name', '') for op in rename_operations]
            new_names = [op.get('new_name', '') for op in rename_operations]
            
            # Analyze naming patterns
            patterns = {
                'random_suffixes': self._detect_random_suffixes(new_names),
                'encryption_indicators': self._detect_encryption_indicators(new_names),
                'ransomware_extensions': self._detect_ransomware_extensions(new_names),
                'name_length_changes': self._analyze_name_length_changes(old_names, new_names)
            }
            
            # Calculate suspicion score
            suspicion_score = 0.0
            if patterns['random_suffixes']:
                suspicion_score += 0.3
            if patterns['encryption_indicators']:
                suspicion_score += 0.4
            if patterns['ransomware_extensions']:
                suspicion_score += 0.5
            if patterns['name_length_changes']:
                suspicion_score += 0.2
            
            is_ransomware = suspicion_score > 0.6
            
            analysis = {
                'rename_operations': rename_operations,
                'patterns': patterns,
                'suspicion_score': suspicion_score,
                'is_ransomware': is_ransomware,
                'confidence': min(suspicion_score, 1.0),
                'risk_score': suspicion_score
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing renaming patterns: {str(e)}")
            return {'error': str(e)}
    
    # Function 82: Encryption detection
    def detect_encryption(self, file_path: str) -> Dict[str, Any]:
        """Detect file encryption patterns"""
        try:
            # Read file data
            with open(file_path, 'rb') as f:
                data = f.read()
            
            # Calculate entropy
            entropy = self._calculate_entropy(data)
            
            # Check for encryption patterns
            encryption_indicators = {
                'high_entropy': entropy > 7.5,
                'uniform_distribution': self._check_uniform_distribution(data),
                'no_compression': not self._is_compressed(data),
                'random_looking': self._appears_random(data)
            }
            
            # Calculate encryption probability
            encryption_score = sum(encryption_indicators.values()) / len(encryption_indicators)
            is_encrypted = encryption_score > 0.7
            
            analysis = {
                'file_path': file_path,
                'entropy': entropy,
                'encryption_indicators': encryption_indicators,
                'encryption_score': encryption_score,
                'is_encrypted': is_encrypted,
                'confidence': encryption_score,
                'risk_score': encryption_score
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error detecting encryption: {str(e)}")
            return {'error': str(e)}
    
    # Function 83: Ransom note detection
    def detect_ransom_notes(self, file_path: str) -> Dict[str, Any]:
        """Detect ransom notes in files"""
        try:
            # Read file content
            with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
                content = f.read().lower()
            
            # Check for ransom note patterns
            ransom_patterns = [
                'ransom', 'encrypted', 'decrypt', 'bitcoin', 'payment',
                'restore', 'recover', 'key', 'password', 'unlock',
                'your files', 'all files', 'important files'
            ]
            
            # Count pattern matches
            pattern_matches = sum(1 for pattern in ransom_patterns if pattern in content)
            pattern_score = pattern_matches / len(ransom_patterns)
            
            # Check for ransom note structure
            structure_indicators = {
                'has_instructions': any(word in content for word in ['how', 'instructions', 'steps']),
                'has_payment_info': any(word in content for word in ['bitcoin', 'payment', 'wallet']),
                'has_threats': any(word in content for word in ['delete', 'destroy', 'permanent']),
                'has_contact': any(word in content for word in ['email', 'contact', 'support'])
            }
            
            structure_score = sum(structure_indicators.values()) / len(structure_indicators)
            
            # Calculate final score
            final_score = (pattern_score + structure_score) / 2
            is_ransom_note = final_score > 0.5
            
            analysis = {
                'file_path': file_path,
                'pattern_matches': pattern_matches,
                'pattern_score': pattern_score,
                'structure_indicators': structure_indicators,
                'structure_score': structure_score,
                'final_score': final_score,
                'is_ransom_note': is_ransom_note,
                'confidence': final_score,
                'risk_score': final_score
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error detecting ransom notes: {str(e)}")
            return {'error': str(e)}
    
    # Function 84: File operation sequence analysis
    def analyze_file_sequences(self, operations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze file operation sequences for ransomware patterns"""
        try:
            if not operations:
                return {'error': 'No operations provided'}
            
            # Sort operations by timestamp
            sorted_operations = sorted(operations, key=lambda x: x.get('timestamp', ''))
            
            # Extract sequences
            operation_sequences = [op.get('type', '') for op in sorted_operations]
            file_sequences = [op.get('file_path', '') for op in sorted_operations]
            
            # Analyze sequences
            sequence_analysis = {
                'operation_patterns': self._analyze_operation_patterns(operation_sequences),
                'file_access_patterns': self._analyze_file_access_patterns(file_sequences),
                'temporal_patterns': self._analyze_temporal_patterns(sorted_operations),
                'ransomware_indicators': self._detect_ransomware_sequence_indicators(sorted_operations)
            }
            
            # ML classification
            if self.models.get('lstm_model'):
                # Convert sequences to features
                features = self._sequence_to_features(sorted_operations)
                if features:
                    prediction = self.models['lstm_model'].predict(features)
                    is_ransomware = prediction[0][0] > 0.5
                    ml_confidence = float(prediction[0][0])
                else:
                    is_ransomware = False
                    ml_confidence = 0.0
            else:
                # Heuristic detection
                is_ransomware = len(sequence_analysis['ransomware_indicators']) > 2
                ml_confidence = 0.6 if is_ransomware else 0.3
            
            analysis = {
                'operations': sorted_operations,
                'sequence_analysis': sequence_analysis,
                'is_ransomware': is_ransomware,
                'confidence': ml_confidence,
                'risk_score': min(len(sequence_analysis['ransomware_indicators']) / 5.0, 1.0)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error analyzing file sequences: {str(e)}")
            return {'error': str(e)}
    
    # Function 85: Ransomware prediction
    def predict_ransomware(self, analysis_data: Dict[str, Any]) -> Dict[str, Any]:
        """Make final ransomware prediction"""
        try:
            predictions = []
            confidences = []
            
            # Entropy analysis
            if 'entropy_analysis' in analysis_data:
                entropy_result = analysis_data['entropy_analysis']
                predictions.append(entropy_result.get('is_ransomware', False))
                confidences.append(entropy_result.get('confidence', 0.0))
            
            # Bulk operations analysis
            if 'bulk_analysis' in analysis_data:
                bulk_result = analysis_data['bulk_analysis']
                predictions.append(bulk_result.get('is_ransomware', False))
                confidences.append(bulk_result.get('confidence', 0.0))
            
            # Renaming patterns analysis
            if 'renaming_analysis' in analysis_data:
                renaming_result = analysis_data['renaming_analysis']
                predictions.append(renaming_result.get('is_ransomware', False))
                confidences.append(renaming_result.get('confidence', 0.0))
            
            # Encryption detection
            if 'encryption_analysis' in analysis_data:
                encryption_result = analysis_data['encryption_analysis']
                predictions.append(encryption_result.get('is_encrypted', False))
                confidences.append(encryption_result.get('confidence', 0.0))
            
            # Ransom note detection
            if 'ransom_note_analysis' in analysis_data:
                ransom_note_result = analysis_data['ransom_note_analysis']
                predictions.append(ransom_note_result.get('is_ransom_note', False))
                confidences.append(ransom_note_result.get('confidence', 0.0))
            
            # Sequence analysis
            if 'sequence_analysis' in analysis_data:
                sequence_result = analysis_data['sequence_analysis']
                predictions.append(sequence_result.get('is_ransomware', False))
                confidences.append(sequence_result.get('confidence', 0.0))
            
            # Calculate ensemble prediction
            if predictions and confidences:
                final_prediction = sum(predictions) / len(predictions) > 0.5
                final_confidence = sum(confidences) / len(confidences)
            else:
                final_prediction = False
                final_confidence = 0.0
            
            # Calculate risk score
            risk_score = min(final_confidence * 1.2, 1.0)
            
            analysis = {
                'analysis_data': analysis_data,
                'individual_predictions': predictions,
                'individual_confidences': confidences,
                'final_prediction': final_prediction,
                'final_confidence': final_confidence,
                'risk_score': risk_score,
                'is_ransomware': final_prediction
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error predicting ransomware: {str(e)}")
            return {'error': str(e)}
    
    # Function 86: Suggested mitigation - isolate system
    def suggest_system_isolation(self, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        """Suggest system isolation for ransomware"""
        try:
            suggestion = {
                'action': 'isolate_system',
                'reason': 'Ransomware activity detected',
                'priority': 'critical',
                'implementation': [
                    'Disconnect system from network',
                    'Block all network access',
                    'Notify security team immediately',
                    'Begin incident response procedures',
                    'Preserve evidence for analysis'
                ],
                'estimated_impact': 'Prevents ransomware spread to other systems',
                'rollback_plan': 'Restore network access after remediation',
                'confidence': analysis_result.get('final_confidence', 0.0)
            }
            
            return suggestion
            
        except Exception as e:
            logger.error(f"Error suggesting system isolation: {str(e)}")
            return {'error': str(e)}
    
    # Function 87: Suggested mitigation - backup restoration
    def suggest_backup_restoration(self, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        """Suggest backup restoration for ransomware"""
        try:
            suggestion = {
                'action': 'restore_backup',
                'reason': 'Ransomware encryption detected',
                'priority': 'high',
                'implementation': [
                    'Identify affected files',
                    'Locate clean backup copies',
                    'Restore files from backup',
                    'Verify file integrity',
                    'Update security measures'
                ],
                'estimated_impact': 'Restores encrypted files without paying ransom',
                'rollback_plan': 'Keep original encrypted files as evidence',
                'confidence': analysis_result.get('final_confidence', 0.0)
            }
            
            return suggestion
            
        except Exception as e:
            logger.error(f"Error suggesting backup restoration: {str(e)}")
            return {'error': str(e)}
    
    # Function 88: Suggested mitigation - decryption tools
    def suggest_decryption_tools(self, analysis_result: Dict[str, Any]) -> Dict[str, Any]:
        """Suggest decryption tools for ransomware"""
        try:
            suggestion = {
                'action': 'use_decryption_tools',
                'reason': 'Ransomware encryption detected',
                'priority': 'medium',
                'implementation': [
                    'Identify ransomware family',
                    'Search for available decryption tools',
                    'Test decryption tools on sample files',
                    'Apply decryption to affected files',
                    'Verify decryption success'
                ],
                'estimated_impact': 'May restore files without paying ransom',
                'rollback_plan': 'Keep encrypted files as backup',
                'confidence': analysis_result.get('final_confidence', 0.0)
            }
            
            return suggestion
            
        except Exception as e:
            logger.error(f"Error suggesting decryption tools: {str(e)}")
            return {'error': str(e)}
    
    # Helper methods
    def _calculate_entropy(self, data: bytes) -> float:
        """Calculate entropy of data"""
        try:
            if not data:
                return 0.0
            
            # Count byte frequencies
            byte_counts = [0] * 256
            for byte in data:
                byte_counts[byte] += 1
            
            # Calculate entropy
            entropy = 0.0
            data_len = len(data)
            for count in byte_counts:
                if count > 0:
                    probability = count / data_len
                    entropy -= probability * np.log2(probability)
            
            return entropy
            
        except Exception as e:
            logger.error(f"Error calculating entropy: {str(e)}")
            return 0.0
    
    def _get_file_type_score(self, file_path: str) -> float:
        """Get file type score for classification"""
        try:
            file_ext = os.path.splitext(file_path)[1].lower()
            
            # Common file types that are often targeted by ransomware
            target_extensions = ['.doc', '.docx', '.pdf', '.txt', '.jpg', '.png', '.mp4', '.mp3']
            
            return 1.0 if file_ext in target_extensions else 0.0
            
        except Exception as e:
            logger.error(f"Error getting file type score: {str(e)}")
            return 0.0
    
    def _identify_suspicious_extensions(self, extensions: List[str]) -> List[str]:
        """Identify suspicious file extensions"""
        try:
            suspicious_extensions = []
            
            for ext in extensions:
                if ext.lower() in ['.encrypted', '.locked', '.crypto', '.ransom']:
                    suspicious_extensions.append(ext)
            
            return suspicious_extensions
            
        except Exception as e:
            logger.error(f"Error identifying suspicious extensions: {str(e)}")
            return []
    
    def _calculate_time_span(self, timestamps: List[str]) -> float:
        """Calculate time span in minutes"""
        try:
            if len(timestamps) < 2:
                return 0.0
            
            start_time = datetime.fromisoformat(timestamps[0])
            end_time = datetime.fromisoformat(timestamps[-1])
            time_span = (end_time - start_time).total_seconds() / 60
            
            return time_span
            
        except Exception as e:
            logger.error(f"Error calculating time span: {str(e)}")
            return 0.0
    
    def _detect_random_suffixes(self, filenames: List[str]) -> bool:
        """Detect random suffixes in filenames"""
        try:
            random_count = 0
            
            for filename in filenames:
                # Check for random-looking suffixes
                if len(filename) > 10 and filename[-10:].isalnum():
                    random_count += 1
            
            return random_count > len(filenames) * 0.5
            
        except Exception as e:
            logger.error(f"Error detecting random suffixes: {str(e)}")
            return False
    
    def _detect_encryption_indicators(self, filenames: List[str]) -> bool:
        """Detect encryption indicators in filenames"""
        try:
            encryption_keywords = ['encrypted', 'locked', 'crypto', 'ransom']
            
            for filename in filenames:
                if any(keyword in filename.lower() for keyword in encryption_keywords):
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error detecting encryption indicators: {str(e)}")
            return False
    
    def _detect_ransomware_extensions(self, filenames: List[str]) -> bool:
        """Detect ransomware extensions in filenames"""
        try:
            ransomware_extensions = ['.encrypted', '.locked', '.crypto', '.ransom']
            
            for filename in filenames:
                if any(ext in filename.lower() for ext in ransomware_extensions):
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error detecting ransomware extensions: {str(e)}")
            return False
    
    def _analyze_name_length_changes(self, old_names: List[str], new_names: List[str]) -> bool:
        """Analyze name length changes"""
        try:
            if len(old_names) != len(new_names):
                return False
            
            length_changes = []
            for old_name, new_name in zip(old_names, new_names):
                length_change = abs(len(new_name) - len(old_name))
                length_changes.append(length_change)
            
            # Check if there are significant length changes
            avg_length_change = sum(length_changes) / len(length_changes)
            return avg_length_change > 5
            
        except Exception as e:
            logger.error(f"Error analyzing name length changes: {str(e)}")
            return False
    
    def _check_uniform_distribution(self, data: bytes) -> bool:
        """Check if data has uniform distribution"""
        try:
            if not data:
                return False
            
            # Count byte frequencies
            byte_counts = [0] * 256
            for byte in data:
                byte_counts[byte] += 1
            
            # Check for uniform distribution
            expected_count = len(data) / 256
            variance = sum((count - expected_count) ** 2 for count in byte_counts) / 256
            
            return variance < expected_count * 0.1
            
        except Exception as e:
            logger.error(f"Error checking uniform distribution: {str(e)}")
            return False
    
    def _is_compressed(self, data: bytes) -> bool:
        """Check if data is compressed"""
        try:
            # Simple compression detection
            if len(data) < 100:
                return False
            
            # Check for common compression signatures
            compression_signatures = [
                b'\x1f\x8b',  # gzip
                b'PK',        # zip
                b'\x78\x9c',  # zlib
                b'BZ'         # bzip2
            ]
            
            for signature in compression_signatures:
                if data.startswith(signature):
                    return True
            
            return False
            
        except Exception as e:
            logger.error(f"Error checking compression: {str(e)}")
            return False
    
    def _appears_random(self, data: bytes) -> bool:
        """Check if data appears random"""
        try:
            if len(data) < 100:
                return False
            
            # Check for patterns that indicate randomness
            # High entropy is already calculated, this checks for other patterns
            
            # Check for lack of common text patterns
            text_chars = sum(1 for byte in data if 32 <= byte <= 126)
            text_ratio = text_chars / len(data)
            
            return text_ratio < 0.1
            
        except Exception as e:
            logger.error(f"Error checking randomness: {str(e)}")
            return False
    
    def _analyze_operation_patterns(self, operations: List[str]) -> Dict[str, Any]:
        """Analyze operation patterns"""
        try:
            patterns = {
                'read_write_ratio': 0.0,
                'delete_operations': 0,
                'rename_operations': 0,
                'create_operations': 0
            }
            
            if not operations:
                return patterns
            
            read_count = operations.count('read')
            write_count = operations.count('write')
            delete_count = operations.count('delete')
            rename_count = operations.count('rename')
            create_count = operations.count('create')
            
            patterns['read_write_ratio'] = write_count / max(read_count, 1)
            patterns['delete_operations'] = delete_count
            patterns['rename_operations'] = rename_count
            patterns['create_operations'] = create_count
            
            return patterns
            
        except Exception as e:
            logger.error(f"Error analyzing operation patterns: {str(e)}")
            return {}
    
    def _analyze_file_access_patterns(self, file_paths: List[str]) -> Dict[str, Any]:
        """Analyze file access patterns"""
        try:
            patterns = {
                'unique_files': len(set(file_paths)),
                'file_types': {},
                'directory_patterns': {}
            }
            
            for file_path in file_paths:
                # Extract file extension
                ext = os.path.splitext(file_path)[1].lower()
                patterns['file_types'][ext] = patterns['file_types'].get(ext, 0) + 1
                
                # Extract directory
                directory = os.path.dirname(file_path)
                patterns['directory_patterns'][directory] = patterns['directory_patterns'].get(directory, 0) + 1
            
            return patterns
            
        except Exception as e:
            logger.error(f"Error analyzing file access patterns: {str(e)}")
            return {}
    
    def _analyze_temporal_patterns(self, operations: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Analyze temporal patterns"""
        try:
            patterns = {
                'operation_rate': 0.0,
                'burst_detected': False,
                'time_distribution': {}
            }
            
            if len(operations) < 2:
                return patterns
            
            # Calculate operation rate
            start_time = datetime.fromisoformat(operations[0].get('timestamp', ''))
            end_time = datetime.fromisoformat(operations[-1].get('timestamp', ''))
            time_span = (end_time - start_time).total_seconds() / 60
            patterns['operation_rate'] = len(operations) / max(time_span, 1)
            
            # Detect bursts
            patterns['burst_detected'] = patterns['operation_rate'] > 10
            
            return patterns
            
        except Exception as e:
            logger.error(f"Error analyzing temporal patterns: {str(e)}")
            return {}
    
    def _detect_ransomware_sequence_indicators(self, operations: List[Dict[str, Any]]) -> List[str]:
        """Detect ransomware sequence indicators"""
        try:
            indicators = []
            
            # Check for bulk operations
            if len(operations) > 100:
                indicators.append('bulk_operations')
            
            # Check for rapid file access
            if len(operations) > 10:
                start_time = datetime.fromisoformat(operations[0].get('timestamp', ''))
                end_time = datetime.fromisoformat(operations[-1].get('timestamp', ''))
                time_span = (end_time - start_time).total_seconds() / 60
                if time_span < 5:  # Less than 5 minutes
                    indicators.append('rapid_file_access')
            
            # Check for encryption patterns
            encrypted_files = [op for op in operations if 'encrypted' in op.get('file_path', '').lower()]
            if len(encrypted_files) > 0:
                indicators.append('encryption_detected')
            
            return indicators
            
        except Exception as e:
            logger.error(f"Error detecting ransomware sequence indicators: {str(e)}")
            return []
    
    def _sequence_to_features(self, operations: List[Dict[str, Any]]) -> Optional[np.ndarray]:
        """Convert operation sequence to features for LSTM"""
        try:
            if not operations:
                return None
            
            # Extract features from operations
            features = []
            for op in operations:
                feature = [
                    1.0 if op.get('type') == 'read' else 0.0,
                    1.0 if op.get('type') == 'write' else 0.0,
                    1.0 if op.get('type') == 'delete' else 0.0,
                    1.0 if op.get('type') == 'rename' else 0.0,
                    len(op.get('file_path', '')) / 100.0,  # Normalized path length
                ]
                features.append(feature)
            
            # Pad sequences
            max_length = 100
            if len(features) > max_length:
                features = features[:max_length]
            else:
                features.extend([[0.0] * 5] * (max_length - len(features)))
            
            return np.array([features])
            
        except Exception as e:
            logger.error(f"Error converting sequence to features: {str(e)}")
            return None

# Global instance
ransomware_service = RansomwareDetectionService()

def get_ransomware_service() -> RansomwareDetectionService:
    """Get ransomware detection service instance"""
    return ransomware_service


