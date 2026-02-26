"""
Main Detection Pipeline
Orchestrates the complete ITDR detection workflow
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Optional, Tuple
import logging
from datetime import datetime

from src.modeling.behavioral_model import BehavioralModel
from src.detection.anomaly_detector import AnomalyDetector
from src.risk.risk_scorer import RiskScorer
from src.mitre.mitre_mapper import MITREMapper
from src.explainability.explainer import Explainer
from src.response.response_engine import ResponseEngine

logger = logging.getLogger(__name__)


class DetectionPipeline:
    """Main detection pipeline for ITDR system"""
    
    def __init__(self, config: Dict, behavioral_model: Optional[BehavioralModel] = None):
        """
        Initialize detection pipeline
        
        Args:
            config: System configuration
            behavioral_model: Optional pre-trained behavioral model
        """
        self.config = config
        
        # Initialize components
        self.behavioral_model = behavioral_model
        self.anomaly_detector = AnomalyDetector(
            method=config.get('models', {}).get('anomaly', {}).get('type', 'isolation_forest'),
            contamination=config.get('models', {}).get('anomaly', {}).get('contamination', 0.1)
        )
        self.risk_scorer = RiskScorer(config.get('risk', {}))
        self.mitre_mapper = MITREMapper()
        self.explainer = Explainer(config.get('explainability', {}))
        self.response_engine = ResponseEngine(config.get('response', {}))
        
        self.sequence_length = config.get('features', {}).get('sequence', {}).get('max_sequence_length', 50)
    
    def detect(self, 
              sequence: np.ndarray,
              features: Dict,
              user_id: str,
              session_id: str) -> Dict:
        """
        Run detection pipeline on a session/sequence
        
        Args:
            sequence: Input sequence (sequence_length, feature_dim)
            features: Feature dictionary for this session
            user_id: User identifier
            session_id: Session identifier
        
        Returns:
            Detection result dictionary
        """
        logger.info(f"Running detection for user {user_id}, session {session_id}")
        
        # Reshape sequence if needed (add batch dimension)
        if len(sequence.shape) == 2:
            sequence = sequence.reshape(1, sequence.shape[0], sequence.shape[1])
        
        # Step 1: Behavioral analysis
        reconstruction_error = 0.0
        user_baseline = None
        
        if self.behavioral_model:
            try:
                reconstruction_error = self.behavioral_model.compute_reconstruction_error(
                    sequence, user_id=user_id
                )[0]  # Get scalar error
                
                if user_id in self.behavioral_model.user_baselines:
                    user_baseline = self.behavioral_model.user_baselines[user_id]
            except Exception as e:
                logger.warning(f"Error in behavioral model prediction: {e}")
        
        # Step 2: MITRE ATT&CK mapping
        mitre_mapping = self.mitre_mapper.map_detection(features)
        
        # Step 3: Risk scoring
        risk_score, component_risks, risk_level = self.risk_scorer.compute_risk_score(
            reconstruction_error=reconstruction_error,
            features=features,
            user_baseline=user_baseline,
            mitre_scores={'tactics': mitre_mapping.get('tactics', {})}
        )
        
        # Step 4: Explainability
        explanation = self.explainer.explain_risk_score(
            risk_score=risk_score,
            risk_level=risk_level,
            component_risks=component_risks,
            features=features,
            mitre_mapping=mitre_mapping
        )
        
        # Step 5: Response decision
        response_action = self.response_engine.determine_response(risk_score, risk_level)
        response_result = self.response_engine.execute_response(
            action=response_action,
            session_id=session_id,
            user_id=user_id,
            risk_score=risk_score,
            details={
                'risk_level': risk_level,
                'component_risks': component_risks,
                'mitre_mapping': mitre_mapping
            }
        )
        
        # Compile result
        result = {
            'session_id': session_id,
            'user_id': user_id,
            'timestamp': datetime.now().isoformat(),
            'risk_score': float(risk_score),
            'risk_level': risk_level,
            'component_risks': {k: float(v) for k, v in component_risks.items()},
            'reconstruction_error': float(reconstruction_error),
            'mitre_mapping': mitre_mapping,
            'explanation': explanation,
            'response': response_result,
            'features': features  # Include features for debugging/analysis
        }
        
        logger.info(f"Detection complete: {risk_level} risk (score: {risk_score:.3f})")
        
        return result
    
    def batch_detect(self, 
                    sequences: Dict[str, np.ndarray],
                    features_dict: Dict[str, Dict],
                    user_ids: List[str],
                    session_ids: List[str]) -> List[Dict]:
        """
        Run detection on multiple sessions
        
        Args:
            sequences: Dictionary mapping session_id to sequence
            features_dict: Dictionary mapping session_id to features
            user_ids: List of user IDs (same order as sessions)
            session_ids: List of session IDs
        
        Returns:
            List of detection results
        """
        results = []
        
        for user_id, session_id in zip(user_ids, session_ids):
            if session_id not in sequences or session_id not in features_dict:
                logger.warning(f"Missing data for session {session_id}")
                continue
            
            try:
                result = self.detect(
                    sequence=sequences[session_id],
                    features=features_dict[session_id],
                    user_id=user_id,
                    session_id=session_id
                )
                results.append(result)
            except Exception as e:
                logger.error(f"Error detecting session {session_id}: {e}")
        
        return results

