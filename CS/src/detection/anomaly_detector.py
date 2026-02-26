"""
Anomaly Detection using Isolation Forest and Reconstruction Errors
"""

import numpy as np
from sklearn.ensemble import IsolationForest
from typing import Dict, Optional
import logging
import pickle

logger = logging.getLogger(__name__)


class AnomalyDetector:
    """Anomaly detection using multiple methods"""
    
    def __init__(self, method: str = 'isolation_forest', contamination: float = 0.1):
        """
        Initialize anomaly detector
        
        Args:
            method: 'isolation_forest' or 'reconstruction_error'
            contamination: Expected proportion of anomalies (for Isolation Forest)
        """
        self.method = method
        self.contamination = contamination
        self.detector = None
    
    def fit(self, X: np.ndarray):
        """
        Fit the anomaly detector
        
        Args:
            X: Training data (n_samples, n_features)
        """
        logger.info(f"Fitting {self.method} anomaly detector on {len(X)} samples")
        
        if self.method == 'isolation_forest':
            self.detector = IsolationForest(
                contamination=self.contamination,
                random_state=42,
                n_estimators=100
            )
            self.detector.fit(X)
        else:
            logger.warning(f"Method {self.method} not implemented, using Isolation Forest")
            self.detector = IsolationForest(contamination=self.contamination, random_state=42)
            self.detector.fit(X)
        
        logger.info("Anomaly detector fitted")
    
    def predict(self, X: np.ndarray) -> np.ndarray:
        """
        Predict anomalies
        
        Args:
            X: Input data
        
        Returns:
            Anomaly scores (-1 for anomalies, 1 for normal)
        """
        if self.detector is None:
            raise ValueError("Detector not fitted. Call fit() first.")
        
        return self.detector.predict(X)
    
    def score_samples(self, X: np.ndarray) -> np.ndarray:
        """
        Compute anomaly scores
        
        Args:
            X: Input data
        
        Returns:
            Anomaly scores (lower = more anomalous)
        """
        if self.detector is None:
            raise ValueError("Detector not fitted. Call fit() first.")
        
        scores = self.detector.score_samples(X)
        return scores
    
    def normalize_scores(self, scores: np.ndarray) -> np.ndarray:
        """
        Normalize scores to [0, 1] range (higher = more anomalous)
        
        Args:
            scores: Raw anomaly scores
        
        Returns:
            Normalized scores [0, 1]
        """
        # Isolation Forest: lower scores = more anomalous
        # Normalize: min -> 1, max -> 0, then invert
        min_score = scores.min()
        max_score = scores.max()
        
        if max_score == min_score:
            return np.ones_like(scores) * 0.5
        
        normalized = (scores - min_score) / (max_score - min_score)
        # Invert so higher = more anomalous
        normalized = 1 - normalized
        
        return normalized

