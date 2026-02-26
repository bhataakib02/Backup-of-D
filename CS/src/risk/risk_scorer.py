"""
Risk Scoring Engine
Computes multi-factor identity risk scores
"""

import numpy as np
import pandas as pd
from typing import Dict, List, Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class RiskScorer:
    """Multi-factor identity risk scoring"""
    
    def __init__(self, config: Dict):
        """
        Initialize risk scorer
        
        Args:
            config: Configuration with risk weights and thresholds
        """
        self.config = config
        self.weights = config.get('weights', {
            'behavioral': 0.35,
            'temporal': 0.20,
            'privilege': 0.25,
            'location': 0.15,
            'mitre': 0.05
        })
        self.thresholds = config.get('thresholds', {
            'low': 0.3,
            'medium': 0.7,
            'high': 0.85
        })
    
    def compute_behavioral_risk(self, reconstruction_error: float, 
                               user_baseline: Optional[Dict] = None) -> float:
        """
        Compute behavioral risk from reconstruction error
        
        Args:
            reconstruction_error: Model reconstruction error
            user_baseline: Optional user baseline statistics
        
        Returns:
            Behavioral risk score [0, 1]
        """
        if user_baseline:
            # Normalize based on user baseline
            mean_error = user_baseline.get('mean_error', 0)
            std_error = user_baseline.get('std_error', 1)
            threshold = user_baseline.get('threshold', mean_error + 2 * std_error)
            
            # Risk increases as error exceeds threshold
            if reconstruction_error <= threshold:
                risk = 0.5 * (reconstruction_error / threshold)
            else:
                risk = 0.5 + 0.5 * min(1.0, (reconstruction_error - threshold) / threshold)
        else:
            # Fallback: use raw error (normalized)
            risk = min(1.0, reconstruction_error / 10.0)  # Rough normalization
        
        return np.clip(risk, 0.0, 1.0)
    
    def compute_temporal_risk(self, features: Dict) -> float:
        """
        Compute temporal risk
        
        Args:
            features: Dictionary with temporal features
        
        Returns:
            Temporal risk score [0, 1]
        """
        risk = 0.0
        
        # Unusual login time
        if 'hour' in features:
            hour = features['hour']
            # High risk for off-hours (e.g., 2-6 AM)
            if 2 <= hour <= 6:
                risk += 0.4
            elif 22 <= hour or hour <= 2:
                risk += 0.3
            else:
                risk += 0.1
        
        # Weekend login (if unusual for user)
        if features.get('is_weekend', 0) == 1:
            risk += 0.2
        
        # Time since last login
        if 'time_since_last_login' in features:
            time_since = features['time_since_last_login']
            if time_since < 0.1:  # Very short time (potential rapid logins)
                risk += 0.2
            elif time_since > 48:  # Long gap (unusual)
                risk += 0.1
        
        return np.clip(risk, 0.0, 1.0)
    
    def compute_location_risk(self, features: Dict) -> float:
        """
        Compute location risk
        
        Args:
            features: Dictionary with location features
        
        Returns:
            Location risk score [0, 1]
        """
        risk = 0.0
        
        # IP change
        if features.get('ip_changed', 0) == 1:
            risk += 0.3
        
        # New IP
        if features.get('is_new_ip', 0) == 1:
            risk += 0.4
        
        # Impossible travel
        if features.get('impossible_travel_flag', 0) == 1:
            risk += 0.5
        
        # IP frequency (low frequency = unusual)
        if 'ip_freq_normalized' in features:
            freq_normalized = features['ip_freq_normalized']
            if freq_normalized < 0.2:  # Rarely used IP
                risk += 0.2
        
        return np.clip(risk, 0.0, 1.0)
    
    def compute_privilege_risk(self, features: Dict) -> float:
        """
        Compute privilege risk
        
        Args:
            features: Dictionary with privilege features
        
        Returns:
            Privilege risk score [0, 1]
        """
        risk = 0.0
        
        # High privilege score
        privilege_score = features.get('privilege_score', 0)
        if privilege_score > 0.7:
            risk += 0.4
        
        # Unusual privilege usage pattern
        if 'auth_type_numeric' in features:
            # Would need domain knowledge for real implementation
            pass
        
        return np.clip(risk, 0.0, 1.0)
    
    def compute_mitre_risk(self, mitre_scores: Dict) -> float:
        """
        Compute MITRE ATT&CK risk
        
        Args:
            mitre_scores: Dictionary with MITRE tactic/technique scores
        
        Returns:
            MITRE risk score [0, 1]
        """
        # Aggregate MITRE scores
        if not mitre_scores:
            return 0.0
        
        # Weighted average of tactic scores
        tactic_scores = mitre_scores.get('tactics', {})
        if tactic_scores:
            max_tactic_score = max(tactic_scores.values()) if tactic_scores.values() else 0.0
            return min(1.0, max_tactic_score)
        
        return 0.0
    
    def compute_risk_score(self, 
                          reconstruction_error: float,
                          features: Dict,
                          user_baseline: Optional[Dict] = None,
                          mitre_scores: Optional[Dict] = None) -> Tuple[float, Dict, str]:
        """
        Compute overall risk score
        
        Args:
            reconstruction_error: Behavioral reconstruction error
            features: Feature dictionary
            user_baseline: Optional user baseline
            mitre_scores: Optional MITRE ATT&CK scores
        
        Returns:
            Tuple of (risk_score, component_risks, risk_level)
        """
        # Compute component risks
        r_behavioral = self.compute_behavioral_risk(reconstruction_error, user_baseline)
        r_temporal = self.compute_temporal_risk(features)
        r_location = self.compute_location_risk(features)
        r_privilege = self.compute_privilege_risk(features)
        r_mitre = self.compute_mitre_risk(mitre_scores or {})
        
        component_risks = {
            'behavioral': r_behavioral,
            'temporal': r_temporal,
            'location': r_location,
            'privilege': r_privilege,
            'mitre': r_mitre
        }
        
        # Weighted combination
        risk_score = (
            self.weights['behavioral'] * r_behavioral +
            self.weights['temporal'] * r_temporal +
            self.weights['location'] * r_location +
            self.weights['privilege'] * r_privilege +
            self.weights['mitre'] * r_mitre
        )
        
        risk_score = np.clip(risk_score, 0.0, 1.0)
        
        # Determine risk level
        if risk_score < self.thresholds['low']:
            risk_level = 'Low'
        elif risk_score < self.thresholds['medium']:
            risk_level = 'Medium'
        elif risk_score < self.thresholds['high']:
            risk_level = 'High'
        else:
            risk_level = 'Critical'
        
        return risk_score, component_risks, risk_level
    
    def get_top_contributors(self, component_risks: Dict, top_k: int = 3) -> List[Tuple[str, float]]:
        """
        Get top contributing risk factors
        
        Args:
            component_risks: Component risk dictionary
            top_k: Number of top contributors
        
        Returns:
            List of (factor, contribution) tuples, sorted by contribution
        """
        # Weight contributions
        weighted_contributions = {
            factor: self.weights.get(factor, 0) * score
            for factor, score in component_risks.items()
        }
        
        # Sort by contribution
        sorted_contributors = sorted(
            weighted_contributions.items(),
            key=lambda x: x[1],
            reverse=True
        )
        
        return sorted_contributors[:top_k]

