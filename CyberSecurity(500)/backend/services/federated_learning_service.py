"""
Federated Learning Service for NEXUS CYBER INTELLIGENCE
Privacy-preserving collaborative AI training across organizations
"""

import json
import hashlib
import time
import numpy as np
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import logging
import random
import os
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives.kdf.pbkdf2 import PBKDF2HMAC
import base64

logger = logging.getLogger(__name__)

class FederationRole(Enum):
    COORDINATOR = "coordinator"
    PARTICIPANT = "participant"
    AGGREGATOR = "aggregator"

class ModelType(Enum):
    THREAT_DETECTION = "threat_detection"
    BEHAVIORAL_ANALYSIS = "behavioral_analysis"
    ANOMALY_DETECTION = "anomaly_detection"
    PHISHING_DETECTION = "phishing_detection"
    MALWARE_CLASSIFICATION = "malware_classification"

class PrivacyLevel(Enum):
    DIFFERENTIAL_PRIVACY = "differential_privacy"
    SECURE_AGGREGATION = "secure_aggregation"
    HOMOMORPHIC_ENCRYPTION = "homomorphic_encryption"
    FEDERATED_AVERAGING = "federated_averaging"

@dataclass
class FederationParticipant:
    participant_id: str
    organization: str
    role: FederationRole
    public_key: str
    is_active: bool
    last_seen: datetime
    contribution_score: float
    privacy_level: PrivacyLevel
    models_contributed: List[str]

@dataclass
class FederatedModel:
    model_id: str
    model_type: ModelType
    version: str
    global_parameters: Dict[str, Any]
    local_parameters: Dict[str, str]  # participant_id -> encrypted parameters
    aggregation_method: str
    privacy_level: PrivacyLevel
    created_at: datetime
    last_updated: datetime
    performance_metrics: Dict[str, float]

@dataclass
class TrainingRound:
    round_id: str
    model_id: str
    participants: List[str]
    global_parameters: Dict[str, Any]
    local_updates: Dict[str, Dict[str, Any]]  # participant_id -> encrypted update
    aggregated_parameters: Dict[str, Any]
    privacy_budget_used: float
    started_at: datetime
    completed_at: Optional[datetime]
    status: str

class DifferentialPrivacy:
    """Differential privacy implementation for federated learning"""
    
    def __init__(self, epsilon: float = 1.0, delta: float = 1e-5):
        self.epsilon = epsilon
        self.delta = delta
        self.privacy_budget_used = 0.0
    
    def add_noise(self, data: np.ndarray, sensitivity: float = 1.0) -> np.ndarray:
        """Add calibrated noise for differential privacy"""
        noise_scale = (2 * sensitivity * np.log(1.25 / self.delta)) / self.epsilon
        noise = np.random.normal(0, noise_scale, data.shape)
        return data + noise
    
    def calculate_privacy_budget(self, rounds: int) -> float:
        """Calculate privacy budget consumption"""
        # Advanced composition theorem
        return np.sqrt(2 * rounds * np.log(1 / self.delta)) * self.epsilon + rounds * self.epsilon * (np.exp(self.epsilon) - 1)
    
    def is_privacy_budget_exhausted(self) -> bool:
        """Check if privacy budget is exhausted"""
        return self.privacy_budget_used >= self.epsilon

class SecureAggregation:
    """Secure aggregation protocol for federated learning"""
    
    def __init__(self):
        self.participants = {}
        self.aggregation_keys = {}
    
    def generate_shares(self, participant_id: str, value: float, num_participants: int) -> List[float]:
        """Generate secret shares for secure aggregation"""
        shares = []
        total = 0
        
        # Generate random shares
        for i in range(num_participants - 1):
            share = random.uniform(-value, value)
            shares.append(share)
            total += share
        
        # Last share ensures sum equals original value
        shares.append(value - total)
        return shares
    
    def aggregate_shares(self, shares: Dict[str, List[float]]) -> float:
        """Aggregate secret shares to get final result"""
        total = 0
        for participant_shares in shares.values():
            total += sum(participant_shares)
        return total
    
    def verify_aggregation(self, expected_sum: float, actual_sum: float, tolerance: float = 1e-6) -> bool:
        """Verify aggregation integrity"""
        return abs(expected_sum - actual_sum) < tolerance

class HomomorphicEncryption:
    """Homomorphic encryption for privacy-preserving computation"""
    
    def __init__(self):
        self.private_key = None
        self.public_key = None
        self._generate_keypair()
    
    def _generate_keypair(self):
        """Generate RSA keypair for homomorphic encryption"""
        self.private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048
        )
        self.public_key = self.private_key.public_key()
    
    def encrypt(self, value: float) -> str:
        """Encrypt a value using homomorphic encryption"""
        # Convert float to integer for encryption
        int_value = int(value * 10000)  # Scale for precision
        encrypted = self.public_key.encrypt(
            int_value.to_bytes(8, 'big'),
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        return base64.b64encode(encrypted).decode()
    
    def decrypt(self, encrypted_value: str) -> float:
        """Decrypt a homomorphically encrypted value"""
        encrypted_bytes = base64.b64decode(encrypted_value)
        decrypted = self.private_key.decrypt(
            encrypted_bytes,
            padding.OAEP(
                mgf=padding.MGF1(algorithm=hashes.SHA256()),
                algorithm=hashes.SHA256(),
                label=None
            )
        )
        int_value = int.from_bytes(decrypted, 'big')
        return int_value / 10000.0  # Scale back
    
    def homomorphic_add(self, encrypted_a: str, encrypted_b: str) -> str:
        """Homomorphic addition of encrypted values"""
        # Simplified implementation - in practice, would use specialized libraries
        decrypted_a = self.decrypt(encrypted_a)
        decrypted_b = self.decrypt(encrypted_b)
        result = decrypted_a + decrypted_b
        return self.encrypt(result)

class FederatedLearningService:
    """Enterprise federated learning service with privacy preservation"""
    
    def __init__(self):
        self.participants = {}
        self.federated_models = {}
        self.training_rounds = {}
        self.differential_privacy = DifferentialPrivacy()
        self.secure_aggregation = SecureAggregation()
        self.homomorphic_encryption = HomomorphicEncryption()
        self._initialize_federation()
    
    def _initialize_federation(self):
        """Initialize federation with default participants"""
        # Add coordinator
        self.participants['coordinator'] = FederationParticipant(
            participant_id='coordinator',
            organization='NEXUS CYBER INTELLIGENCE',
            role=FederationRole.COORDINATOR,
            public_key=self._generate_public_key(),
            is_active=True,
            last_seen=datetime.now(),
            contribution_score=1.0,
            privacy_level=PrivacyLevel.DIFFERENTIAL_PRIVACY,
            models_contributed=[]
        )
        
        logger.info("Federated learning service initialized")
    
    def _generate_public_key(self) -> str:
        """Generate public key for participant"""
        private_key = rsa.generate_private_key(
            public_exponent=65537,
            key_size=2048
        )
        public_key = private_key.public_key()
        pem = public_key.public_bytes(
            encoding=serialization.Encoding.PEM,
            format=serialization.PublicFormat.SubjectPublicKeyInfo
        )
        return pem.decode()
    
    def register_participant(self, 
                           participant_id: str,
                           organization: str,
                           role: FederationRole = FederationRole.PARTICIPANT,
                           privacy_level: PrivacyLevel = PrivacyLevel.DIFFERENTIAL_PRIVACY) -> Dict[str, Any]:
        """Register a new participant in the federation"""
        try:
            participant = FederationParticipant(
                participant_id=participant_id,
                organization=organization,
                role=role,
                public_key=self._generate_public_key(),
                is_active=True,
                last_seen=datetime.now(),
                contribution_score=0.0,
                privacy_level=privacy_level,
                models_contributed=[]
            )
            
            self.participants[participant_id] = participant
            
            logger.info(f"Registered participant: {participant_id} from {organization}")
            
            return {
                'success': True,
                'participant_id': participant_id,
                'public_key': participant.public_key,
                'federation_id': self._get_federation_id(),
                'privacy_level': privacy_level.value,
                'welcome_message': f"Welcome to NEXUS Federation, {organization}!"
            }
            
        except Exception as e:
            logger.error(f"Error registering participant: {e}")
            return {'success': False, 'error': str(e)}
    
    def create_federated_model(self,
                              model_id: str,
                              model_type: ModelType,
                              aggregation_method: str = 'fedavg',
                              privacy_level: PrivacyLevel = PrivacyLevel.DIFFERENTIAL_PRIVACY) -> Dict[str, Any]:
        """Create a new federated model"""
        try:
            federated_model = FederatedModel(
                model_id=model_id,
                model_type=model_type,
                version='1.0.0',
                global_parameters=self._initialize_global_parameters(model_type),
                local_parameters={},
                aggregation_method=aggregation_method,
                privacy_level=privacy_level,
                created_at=datetime.now(),
                last_updated=datetime.now(),
                performance_metrics={}
            )
            
            self.federated_models[model_id] = federated_model
            
            logger.info(f"Created federated model: {model_id}")
            
            return {
                'success': True,
                'model_id': model_id,
                'model_type': model_type.value,
                'version': federated_model.version,
                'global_parameters': federated_model.global_parameters,
                'privacy_level': privacy_level.value,
                'aggregation_method': aggregation_method
            }
            
        except Exception as e:
            logger.error(f"Error creating federated model: {e}")
            return {'success': False, 'error': str(e)}
    
    def start_training_round(self,
                           model_id: str,
                           participant_ids: List[str],
                           privacy_budget: float = 0.1) -> Dict[str, Any]:
        """Start a new federated training round"""
        try:
            if model_id not in self.federated_models:
                return {'success': False, 'error': 'Model not found'}
            
            # Check privacy budget
            if self.differential_privacy.is_privacy_budget_exhausted():
                return {'success': False, 'error': 'Privacy budget exhausted'}
            
            round_id = f"round_{int(time.time())}"
            
            training_round = TrainingRound(
                round_id=round_id,
                model_id=model_id,
                participants=participant_ids,
                global_parameters=self.federated_models[model_id].global_parameters.copy(),
                local_updates={},
                aggregated_parameters={},
                privacy_budget_used=privacy_budget,
                started_at=datetime.now(),
                completed_at=None,
                status='active'
            )
            
            self.training_rounds[round_id] = training_round
            
            # Distribute global parameters to participants
            for participant_id in participant_ids:
                if participant_id in self.participants:
                    self.participants[participant_id].last_seen = datetime.now()
            
            logger.info(f"Started training round: {round_id}")
            
            return {
                'success': True,
                'round_id': round_id,
                'model_id': model_id,
                'participants': participant_ids,
                'global_parameters': training_round.global_parameters,
                'privacy_budget': privacy_budget,
                'estimated_duration': '30-60 minutes'
            }
            
        except Exception as e:
            logger.error(f"Error starting training round: {e}")
            return {'success': False, 'error': str(e)}
    
    def submit_local_update(self,
                           round_id: str,
                           participant_id: str,
                           local_parameters: Dict[str, Any],
                           privacy_level: PrivacyLevel = PrivacyLevel.DIFFERENTIAL_PRIVACY) -> Dict[str, Any]:
        """Submit local model update from participant"""
        try:
            if round_id not in self.training_rounds:
                return {'success': False, 'error': 'Training round not found'}
            
            if participant_id not in self.participants:
                return {'success': False, 'error': 'Participant not found'}
            
            training_round = self.training_rounds[round_id]
            
            # Apply privacy-preserving techniques
            if privacy_level == PrivacyLevel.DIFFERENTIAL_PRIVACY:
                # Add differential privacy noise
                for key, value in local_parameters.items():
                    if isinstance(value, (int, float)):
                        local_parameters[key] = self.differential_privacy.add_noise(
                            np.array([value]), sensitivity=1.0
                        )[0]
            
            elif privacy_level == PrivacyLevel.HOMOMORPHIC_ENCRYPTION:
                # Encrypt parameters using homomorphic encryption
                encrypted_parameters = {}
                for key, value in local_parameters.items():
                    if isinstance(value, (int, float)):
                        encrypted_parameters[key] = self.homomorphic_encryption.encrypt(value)
                    else:
                        encrypted_parameters[key] = value
                local_parameters = encrypted_parameters
            
            # Store local update
            training_round.local_updates[participant_id] = local_parameters
            
            # Update participant contribution score
            self.participants[participant_id].contribution_score += 0.1
            self.participants[participant_id].last_seen = datetime.now()
            
            logger.info(f"Received local update from {participant_id} for round {round_id}")
            
            return {
                'success': True,
                'round_id': round_id,
                'participant_id': participant_id,
                'update_received': True,
                'privacy_applied': privacy_level.value,
                'contribution_score': self.participants[participant_id].contribution_score
            }
            
        except Exception as e:
            logger.error(f"Error submitting local update: {e}")
            return {'success': False, 'error': str(e)}
    
    def aggregate_updates(self, round_id: str) -> Dict[str, Any]:
        """Aggregate local updates using specified method"""
        try:
            if round_id not in self.training_rounds:
                return {'success': False, 'error': 'Training round not found'}
            
            training_round = self.training_rounds[round_id]
            model_id = training_round.model_id
            
            if model_id not in self.federated_models:
                return {'success': False, 'error': 'Model not found'}
            
            federated_model = self.federated_models[model_id]
            
            # Perform aggregation based on method
            if federated_model.aggregation_method == 'fedavg':
                aggregated_parameters = self._federated_averaging(training_round.local_updates)
            elif federated_model.aggregation_method == 'secure_agg':
                aggregated_parameters = self._secure_aggregation(training_round.local_updates)
            else:
                aggregated_parameters = self._federated_averaging(training_round.local_updates)
            
            # Update global parameters
            federated_model.global_parameters = aggregated_parameters
            federated_model.last_updated = datetime.now()
            
            # Complete training round
            training_round.aggregated_parameters = aggregated_parameters
            training_round.completed_at = datetime.now()
            training_round.status = 'completed'
            
            # Update privacy budget
            self.differential_privacy.privacy_budget_used += training_round.privacy_budget_used
            
            logger.info(f"Aggregated updates for round {round_id}")
            
            return {
                'success': True,
                'round_id': round_id,
                'aggregated_parameters': aggregated_parameters,
                'aggregation_method': federated_model.aggregation_method,
                'participants_count': len(training_round.participants),
                'privacy_budget_used': training_round.privacy_budget_used,
                'completion_time': training_round.completed_at.isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error aggregating updates: {e}")
            return {'success': False, 'error': str(e)}
    
    def _federated_averaging(self, local_updates: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        """Federated averaging aggregation"""
        if not local_updates:
            return {}
        
        # Get parameter keys from first update
        param_keys = list(local_updates[list(local_updates.keys())[0]].keys())
        aggregated = {}
        
        for key in param_keys:
            values = []
            for participant_id, update in local_updates.items():
                if key in update:
                    values.append(update[key])
            
            if values:
                aggregated[key] = np.mean(values)
        
        return aggregated
    
    def _secure_aggregation(self, local_updates: Dict[str, Dict[str, Any]]) -> Dict[str, Any]:
        """Secure aggregation with secret sharing"""
        if not local_updates:
            return {}
        
        # Get parameter keys from first update
        param_keys = list(local_updates[list(local_updates.keys())[0]].keys())
        aggregated = {}
        
        for key in param_keys:
            # Generate shares for each participant's value
            shares = {}
            for participant_id, update in local_updates.items():
                if key in update:
                    value = update[key]
                    shares[participant_id] = self.secure_aggregation.generate_shares(
                        participant_id, value, len(local_updates)
                    )
            
            # Aggregate shares
            if shares:
                aggregated[key] = self.secure_aggregation.aggregate_shares(shares)
        
        return aggregated
    
    def _initialize_global_parameters(self, model_type: ModelType) -> Dict[str, Any]:
        """Initialize global model parameters"""
        if model_type == ModelType.THREAT_DETECTION:
            return {
                'weights': np.random.normal(0, 0.1, (100, 50)).tolist(),
                'bias': np.random.normal(0, 0.1, 50).tolist(),
                'learning_rate': 0.01,
                'epochs': 10
            }
        elif model_type == ModelType.BEHAVIORAL_ANALYSIS:
            return {
                'weights': np.random.normal(0, 0.1, (200, 100)).tolist(),
                'bias': np.random.normal(0, 0.1, 100).tolist(),
                'learning_rate': 0.005,
                'epochs': 15
            }
        else:
            return {
                'weights': np.random.normal(0, 0.1, (50, 25)).tolist(),
                'bias': np.random.normal(0, 0.1, 25).tolist(),
                'learning_rate': 0.01,
                'epochs': 10
            }
    
    def _get_federation_id(self) -> str:
        """Get federation identifier"""
        return f"nexus_federation_{hashlib.md5('nexus_cyber_intelligence'.encode()).hexdigest()[:8]}"
    
    def get_federation_status(self) -> Dict[str, Any]:
        """Get federation status and statistics"""
        active_participants = [p for p in self.participants.values() if p.is_active]
        
        return {
            'federation_id': self._get_federation_id(),
            'total_participants': len(self.participants),
            'active_participants': len(active_participants),
            'federated_models': len(self.federated_models),
            'training_rounds': len(self.training_rounds),
            'privacy_budget_used': self.differential_privacy.privacy_budget_used,
            'privacy_budget_remaining': self.differential_privacy.epsilon - self.differential_privacy.privacy_budget_used,
            'participants': [
                {
                    'participant_id': p.participant_id,
                    'organization': p.organization,
                    'role': p.role.value,
                    'is_active': p.is_active,
                    'contribution_score': p.contribution_score,
                    'privacy_level': p.privacy_level.value
                }
                for p in active_participants
            ],
            'models': [
                {
                    'model_id': m.model_id,
                    'model_type': m.model_type.value,
                    'version': m.version,
                    'privacy_level': m.privacy_level.value,
                    'last_updated': m.last_updated.isoformat()
                }
                for m in self.federated_models.values()
            ]
        }
    
    def get_participant_contribution_score(self, participant_id: str) -> Dict[str, Any]:
        """Get contribution score for a participant"""
        if participant_id not in self.participants:
            return {'success': False, 'error': 'Participant not found'}
        
        participant = self.participants[participant_id]
        
        return {
            'success': True,
            'participant_id': participant_id,
            'contribution_score': participant.contribution_score,
            'organization': participant.organization,
            'models_contributed': participant.models_contributed,
            'privacy_level': participant.privacy_level.value,
            'last_seen': participant.last_seen.isoformat()
        }

# Global instance
federated_learning_service = FederatedLearningService()

