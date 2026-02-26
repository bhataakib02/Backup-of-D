"""
Feature Engineering for ITDR System

Extracts behavioral, temporal, location, and privilege features from authentication logs
"""

import pandas as pd
import numpy as np
from typing import Dict, List, Optional, Tuple
from datetime import datetime, timedelta
import logging
from sklearn.preprocessing import StandardScaler, LabelEncoder
import pickle

logger = logging.getLogger(__name__)


class FeatureEngineer:
    """Feature engineering for identity threat detection"""
    
    def __init__(self, config: Dict):
        """
        Initialize feature engineer
        
        Args:
            config: Configuration dictionary with feature settings
        """
        self.config = config
        self.scalers = {}
        self.encoders = {}
        
    def extract_temporal_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Extract temporal features from timestamps
        
        Args:
            df: DataFrame with 'timestamp' column
        
        Returns:
            DataFrame with temporal features added
        """
        logger.info("Extracting temporal features")
        
        features = df.copy()
        
        if 'timestamp' not in features.columns:
            logger.warning("No timestamp column found")
            return features
        
        # Hour of day (0-23)
        if self.config.get('temporal', {}).get('include_hour', True):
            features['hour'] = features['timestamp'].dt.hour
            features['hour_sin'] = np.sin(2 * np.pi * features['hour'] / 24)
            features['hour_cos'] = np.cos(2 * np.pi * features['hour'] / 24)
        
        # Day of week (0=Monday, 6=Sunday)
        if self.config.get('temporal', {}).get('include_day_of_week', True):
            features['day_of_week'] = features['timestamp'].dt.dayofweek
            features['day_of_week_sin'] = np.sin(2 * np.pi * features['day_of_week'] / 7)
            features['day_of_week_cos'] = np.cos(2 * np.pi * features['day_of_week'] / 7)
        
        # Is weekend
        features['is_weekend'] = (features['day_of_week'] >= 5).astype(int)
        
        # Time since last login (per user)
        if self.config.get('temporal', {}).get('include_time_since_last', True):
            features = features.sort_values(['user', 'timestamp'])
            features['time_since_last_login'] = features.groupby('user')['timestamp'].diff().dt.total_seconds() / 3600  # hours
            features['time_since_last_login'] = features['time_since_last_login'].fillna(24)  # Default 24 hours
        
        # Session duration (if logout events available)
        if 'event_type' in features.columns:
            logon_mask = features['event_type'].str.contains('logon', case=False, na=False)
            logoff_mask = features['event_type'].str.contains('logoff', case=False, na=False)
            
            if logoff_mask.any():
                features['session_duration'] = np.nan
                # Simplified: would need proper session matching in production
                # For now, use time until next event for same user
                features['session_duration'] = features.groupby('user')['timestamp'].shift(-1) - features['timestamp']
                features['session_duration'] = features['session_duration'].dt.total_seconds() / 60  # minutes
        
        return features
    
    def extract_location_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Extract location-based features
        
        Args:
            df: DataFrame with 'source_ip' or similar columns
        
        Returns:
            DataFrame with location features added
        """
        logger.info("Extracting location features")
        
        features = df.copy()
        
        if 'source_ip' not in features.columns:
            logger.warning("No source_ip column found")
            return features
        
        # IP change detection (per user)
        features = features.sort_values(['user', 'timestamp'])
        features['ip_changed'] = (features.groupby('user')['source_ip'].shift(1) != features['source_ip']).astype(int)
        features['ip_changed'] = features['ip_changed'].fillna(0)
        
        # Number of unique IPs per user (rolling window)
        features['unique_ips_count'] = features.groupby('user')['source_ip'].transform(
            lambda x: x.rolling(window=100, min_periods=1).nunique()
        )
        
        # New IP detection (first time seeing this IP for user)
        user_ip_pairs = features.groupby('user')['source_ip'].transform('first')
        features['is_new_ip'] = (features['source_ip'] != user_ip_pairs).astype(int)
        
        # IP frequency (how common is this IP for this user)
        user_ip_counts = features.groupby(['user', 'source_ip']).size().reset_index(name='ip_freq')
        features = features.merge(user_ip_counts, on=['user', 'source_ip'], how='left')
        features['ip_freq_normalized'] = features.groupby('user')['ip_freq'].transform(
            lambda x: (x - x.min()) / (x.max() - x.min() + 1e-6)
        )
        
        # Impossible travel detection (simplified - would need real geolocation in production)
        if self.config.get('location', {}).get('detect_impossible_travel', True):
            features['impossible_travel_flag'] = 0
            
            # Simplified: detect rapid IP changes within short time window
            time_diff_hours = features.groupby('user')['timestamp'].diff().dt.total_seconds() / 3600
            ip_changed = features['ip_changed']
            
            # Flag if IP changed within 1 hour (simplified impossible travel)
            features['impossible_travel_flag'] = ((ip_changed == 1) & (time_diff_hours < 1)).astype(int)
        
        return features
    
    def extract_behavioral_features(self, df: pd.DataFrame) -> pd.DataFrame:
        """
        Extract behavioral features
        
        Args:
            df: DataFrame with user activity data
        
        Returns:
            DataFrame with behavioral features added
        """
        logger.info("Extracting behavioral features")
        
        features = df.copy()
        
        # Device/host usage patterns
        if 'destination_host' in features.columns:
            if self.config.get('behavioral', {}).get('include_device', True):
                features['unique_hosts_count'] = features.groupby('user')['destination_host'].transform(
                    lambda x: x.rolling(window=100, min_periods=1).nunique()
                )
                
                # Host frequency
                user_host_counts = features.groupby(['user', 'destination_host']).size().reset_index(name='host_freq')
                features = features.merge(user_host_counts, on=['user', 'destination_host'], how='left')
                features['host_freq_normalized'] = features.groupby('user')['host_freq'].transform(
                    lambda x: (x - x.min()) / (x.max() - x.min() + 1e-6)
                )
        
        # Resource access patterns
        if 'resource_accessed' in features.columns:
            if self.config.get('behavioral', {}).get('include_resource_access', True):
                features['unique_resources_count'] = features.groupby('user')['resource_accessed'].transform(
                    lambda x: x.rolling(window=100, min_periods=1).nunique()
                )
        
        # Login frequency (events per day)
        features['date'] = features['timestamp'].dt.date
        login_counts = features.groupby(['user', 'date']).size().reset_index(name='logins_per_day')
        features = features.merge(login_counts, on=['user', 'date'], how='left')
        
        # Average logins per day (rolling average)
        features['avg_logins_per_day'] = features.groupby('user')['logins_per_day'].transform(
            lambda x: x.rolling(window=30, min_periods=1).mean()
        )
        
        # Privilege usage (simplified - would need privilege level data)
        if self.config.get('behavioral', {}).get('include_privilege_usage', True):
            # Use authentication_type or similar as proxy
            if 'authentication_type' in features.columns:
                features['auth_type_numeric'] = pd.Categorical(features['authentication_type']).codes
            
            # Admin-like patterns (would need real privilege data)
            features['privilege_score'] = 0.0  # Placeholder
        
        return features
    
    def create_sequences(self, df: pd.DataFrame, user_col: str = 'user', 
                        sequence_length: int = 50) -> Dict[str, np.ndarray]:
        """
        Create sequences for LSTM/GRU models
        
        Args:
            df: DataFrame with features
            user_col: Column name for user identifier
            sequence_length: Length of sequences
        
        Returns:
            Dictionary with sequences per user
        """
        logger.info(f"Creating sequences (length={sequence_length})")
        
        sequences = {}
        
        # Select feature columns (numeric only)
        numeric_cols = df.select_dtypes(include=[np.number]).columns.tolist()
        numeric_cols = [c for c in numeric_cols if c not in ['event_id', 'session_id']]
        
        if not numeric_cols:
            logger.warning("No numeric features found for sequencing")
            return sequences
        
        # Group by user and create sequences
        for user in df[user_col].unique():
            user_df = df[df[user_col] == user].sort_values('timestamp')
            user_features = user_df[numeric_cols].values
            
            if len(user_features) < sequence_length:
                # Pad if sequence is too short
                padding = np.zeros((sequence_length - len(user_features), user_features.shape[1]))
                user_features = np.vstack([padding, user_features])
            
            # Create sliding windows
            user_sequences = []
            for i in range(len(user_features) - sequence_length + 1):
                seq = user_features[i:i + sequence_length]
                user_sequences.append(seq)
            
            if user_sequences:
                sequences[user] = np.array(user_sequences)
        
        logger.info(f"Created sequences for {len(sequences)} users")
        
        return sequences
    
    def encode_categorical_features(self, df: pd.DataFrame, 
                                   categorical_cols: List[str]) -> pd.DataFrame:
        """
        Encode categorical features
        
        Args:
            df: DataFrame with categorical columns
            categorical_cols: List of categorical column names
        
        Returns:
            DataFrame with encoded features
        """
        logger.info(f"Encoding {len(categorical_cols)} categorical features")
        
        encoded_df = df.copy()
        
        for col in categorical_cols:
            if col not in encoded_df.columns:
                continue
            
            if col not in self.encoders:
                self.encoders[col] = LabelEncoder()
                encoded_df[f'{col}_encoded'] = self.encoders[col].fit_transform(encoded_df[col].astype(str))
            else:
                # Handle unseen labels
                encoded_df[f'{col}_encoded'] = encoded_df[col].astype(str).map(
                    lambda x: self.encoders[col].transform([x])[0] 
                    if x in self.encoders[col].classes_ 
                    else -1
                )
        
        return encoded_df
    
    def normalize_features(self, df: pd.DataFrame, 
                          numeric_cols: List[str], 
                          fit: bool = True) -> pd.DataFrame:
        """
        Normalize numeric features
        
        Args:
            df: DataFrame with numeric columns
            numeric_cols: List of numeric column names
            fit: Whether to fit scalers (True for training, False for inference)
        
        Returns:
            DataFrame with normalized features
        """
        logger.info(f"Normalizing {len(numeric_cols)} numeric features")
        
        normalized_df = df.copy()
        
        for col in numeric_cols:
            if col not in normalized_df.columns:
                continue
            
            if fit:
                if col not in self.scalers:
                    self.scalers[col] = StandardScaler()
                normalized_df[col] = self.scalers[col].fit_transform(normalized_df[[col]])
            else:
                if col in self.scalers:
                    normalized_df[col] = self.scalers[col].transform(normalized_df[[col]])
                else:
                    logger.warning(f"Scaler for {col} not found, skipping normalization")
        
        return normalized_df
    
    def extract_all_features(self, df: pd.DataFrame, 
                            fit: bool = True) -> pd.DataFrame:
        """
        Extract all features (main entry point)
        
        Args:
            df: Input DataFrame with timestamp, user, source_ip, etc.
            fit: Whether to fit scalers/encoders
        
        Returns:
            DataFrame with all features
        """
        logger.info("Extracting all features")
        
        # Ensure timestamp is datetime
        if 'timestamp' in df.columns and not pd.api.types.is_datetime64_any_dtype(df['timestamp']):
            df['timestamp'] = pd.to_datetime(df['timestamp'])
        
        # Extract feature groups
        features = self.extract_temporal_features(df)
        features = self.extract_location_features(features)
        features = self.extract_behavioral_features(features)
        
        # Encode categorical features
        categorical_cols = ['user', 'source_ip', 'destination_host', 'event_type']
        categorical_cols = [c for c in categorical_cols if c in features.columns]
        features = self.encode_categorical_features(features, categorical_cols)
        
        # Normalize numeric features
        numeric_cols = features.select_dtypes(include=[np.number]).columns.tolist()
        numeric_cols = [c for c in numeric_cols if not c.endswith('_encoded') and c not in ['event_id']]
        features = self.normalize_features(features, numeric_cols, fit=fit)
        
        logger.info(f"Feature extraction complete: {features.shape[1]} features")
        
        return features
    
    def save_preprocessors(self, filepath: str):
        """Save scalers and encoders"""
        preprocessors = {
            'scalers': self.scalers,
            'encoders': self.encoders
        }
        with open(filepath, 'wb') as f:
            pickle.dump(preprocessors, f)
        logger.info(f"Saved preprocessors to {filepath}")
    
    def load_preprocessors(self, filepath: str):
        """Load scalers and encoders"""
        with open(filepath, 'rb') as f:
            preprocessors = pickle.load(f)
        self.scalers = preprocessors['scalers']
        self.encoders = preprocessors['encoders']
        logger.info(f"Loaded preprocessors from {filepath}")

