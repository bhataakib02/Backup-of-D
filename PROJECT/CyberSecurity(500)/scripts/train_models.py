#!/usr/bin/env python3
"""
ML Model Training Scripts
AI/ML Cybersecurity Platform
"""

import os
import sys
import json
import numpy as np
import pandas as pd
from sklearn.model_selection import train_test_split, cross_val_score
from sklearn.ensemble import RandomForestClassifier, IsolationForest
from sklearn.metrics import accuracy_score, classification_report, confusion_matrix
from sklearn.preprocessing import StandardScaler, LabelEncoder
import joblib
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Conv1D, MaxPooling1D, Flatten, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
import logging

# Add project root to path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from utils.logging_utils import get_security_logger

logger = logging.getLogger(__name__)
security_logger = get_security_logger()

class ModelTrainer:
    """ML Model Trainer for cybersecurity models"""
    
    def __init__(self):
        self.models_dir = 'models'
        self.datasets_dir = 'datasets'
        self.scalers_dir = 'scalers'
        
        # Create directories if they don't exist
        os.makedirs(self.models_dir, exist_ok=True)
        os.makedirs(self.datasets_dir, exist_ok=True)
        os.makedirs(self.scalers_dir, exist_ok=True)
    
    def train_phishing_classifier(self):
        """Train phishing detection classifier"""
        try:
            logger.info("Training phishing classifier...")
            
            # Load or generate synthetic data
            X, y = self._load_phishing_data()
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Train Random Forest
            rf_model = RandomForestClassifier(
                n_estimators=100,
                max_depth=10,
                random_state=42,
                class_weight='balanced'
            )
            
            rf_model.fit(X_train_scaled, y_train)
            
            # Evaluate model
            y_pred = rf_model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            
            logger.info(f"Phishing classifier accuracy: {accuracy:.4f}")
            
            # Save model and scaler
            joblib.dump(rf_model, os.path.join(self.models_dir, 'phishing_classifier.pkl'))
            joblib.dump(scaler, os.path.join(self.scalers_dir, 'phishing_scaler.pkl'))
            
            # Save evaluation results
            report = classification_report(y_test, y_pred, output_dict=True)
            with open(os.path.join(self.models_dir, 'phishing_classifier_report.json'), 'w') as f:
                json.dump(report, f, indent=2)
            
            return {
                'model': 'phishing_classifier',
                'accuracy': accuracy,
                'report': report
            }
            
        except Exception as e:
            logger.error(f"Error training phishing classifier: {str(e)}")
            return {'error': str(e)}
    
    def train_malware_classifier(self):
        """Train malware detection classifier"""
        try:
            logger.info("Training malware classifier...")
            
            # Load or generate synthetic data
            X, y = self._load_malware_data()
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Train Random Forest
            rf_model = RandomForestClassifier(
                n_estimators=150,
                max_depth=15,
                random_state=42,
                class_weight='balanced'
            )
            
            rf_model.fit(X_train_scaled, y_train)
            
            # Evaluate model
            y_pred = rf_model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            
            logger.info(f"Malware classifier accuracy: {accuracy:.4f}")
            
            # Save model and scaler
            joblib.dump(rf_model, os.path.join(self.models_dir, 'malware_classifier.pkl'))
            joblib.dump(scaler, os.path.join(self.scalers_dir, 'malware_scaler.pkl'))
            
            # Save evaluation results
            report = classification_report(y_test, y_pred, output_dict=True)
            with open(os.path.join(self.models_dir, 'malware_classifier_report.json'), 'w') as f:
                json.dump(report, f, indent=2)
            
            return {
                'model': 'malware_classifier',
                'accuracy': accuracy,
                'report': report
            }
            
        except Exception as e:
            logger.error(f"Error training malware classifier: {str(e)}")
            return {'error': str(e)}
    
    def train_ids_classifier(self):
        """Train IDS detection classifier"""
        try:
            logger.info("Training IDS classifier...")
            
            # Load or generate synthetic data
            X, y = self._load_ids_data()
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Scale features
            scaler = StandardScaler()
            X_train_scaled = scaler.fit_transform(X_train)
            X_test_scaled = scaler.transform(X_test)
            
            # Train Random Forest
            rf_model = RandomForestClassifier(
                n_estimators=200,
                max_depth=20,
                random_state=42,
                class_weight='balanced'
            )
            
            rf_model.fit(X_train_scaled, y_train)
            
            # Evaluate model
            y_pred = rf_model.predict(X_test_scaled)
            accuracy = accuracy_score(y_test, y_pred)
            
            logger.info(f"IDS classifier accuracy: {accuracy:.4f}")
            
            # Save model and scaler
            joblib.dump(rf_model, os.path.join(self.models_dir, 'ids_classifier.pkl'))
            joblib.dump(scaler, os.path.join(self.scalers_dir, 'ids_scaler.pkl'))
            
            # Save evaluation results
            report = classification_report(y_test, y_pred, output_dict=True)
            with open(os.path.join(self.models_dir, 'ids_classifier_report.json'), 'w') as f:
                json.dump(report, f, indent=2)
            
            return {
                'model': 'ids_classifier',
                'accuracy': accuracy,
                'report': report
            }
            
        except Exception as e:
            logger.error(f"Error training IDS classifier: {str(e)}")
            return {'error': str(e)}
    
    def train_anomaly_detector(self):
        """Train anomaly detection model"""
        try:
            logger.info("Training anomaly detector...")
            
            # Load or generate synthetic data
            X, y = self._load_anomaly_data()
            
            # Use only normal data for training
            X_normal = X[y == 0]
            
            # Train Isolation Forest
            iso_model = IsolationForest(
                contamination=0.1,
                random_state=42,
                n_estimators=100
            )
            
            iso_model.fit(X_normal)
            
            # Evaluate on test data
            X_test = X[y == 1]  # Anomalous data
            y_pred = iso_model.predict(X_test)
            accuracy = np.mean(y_pred == -1)  # -1 indicates anomaly
            
            logger.info(f"Anomaly detector accuracy: {accuracy:.4f}")
            
            # Save model
            joblib.dump(iso_model, os.path.join(self.models_dir, 'anomaly_detector.pkl'))
            
            return {
                'model': 'anomaly_detector',
                'accuracy': accuracy
            }
            
        except Exception as e:
            logger.error(f"Error training anomaly detector: {str(e)}")
            return {'error': str(e)}
    
    def train_lstm_model(self):
        """Train LSTM model for sequence detection"""
        try:
            logger.info("Training LSTM model...")
            
            # Load or generate synthetic data
            X, y = self._load_sequence_data()
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Build LSTM model
            model = Sequential([
                LSTM(64, return_sequences=True, input_shape=(X_train.shape[1], X_train.shape[2])),
                Dropout(0.2),
                LSTM(32, return_sequences=False),
                Dropout(0.2),
                Dense(16, activation='relu'),
                Dense(1, activation='sigmoid')
            ])
            
            model.compile(
                optimizer=Adam(learning_rate=0.001),
                loss='binary_crossentropy',
                metrics=['accuracy']
            )
            
            # Callbacks
            early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
            model_checkpoint = ModelCheckpoint(
                os.path.join(self.models_dir, 'lstm_model.h5'),
                monitor='val_accuracy',
                save_best_only=True
            )
            
            # Train model
            history = model.fit(
                X_train, y_train,
                validation_data=(X_test, y_test),
                epochs=100,
                batch_size=32,
                callbacks=[early_stopping, model_checkpoint],
                verbose=1
            )
            
            # Evaluate model
            test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
            
            logger.info(f"LSTM model accuracy: {test_accuracy:.4f}")
            
            # Save training history
            with open(os.path.join(self.models_dir, 'lstm_history.json'), 'w') as f:
                json.dump(history.history, f, indent=2)
            
            return {
                'model': 'lstm_model',
                'accuracy': test_accuracy,
                'loss': test_loss
            }
            
        except Exception as e:
            logger.error(f"Error training LSTM model: {str(e)}")
            return {'error': str(e)}
    
    def train_cnn_model(self):
        """Train CNN model for image analysis"""
        try:
            logger.info("Training CNN model...")
            
            # Load or generate synthetic data
            X, y = self._load_image_data()
            
            # Split data
            X_train, X_test, y_train, y_test = train_test_split(
                X, y, test_size=0.2, random_state=42, stratify=y
            )
            
            # Build CNN model
            model = Sequential([
                Conv2D(32, (3, 3), activation='relu', input_shape=(224, 224, 3)),
                MaxPooling2D(2, 2),
                Conv2D(64, (3, 3), activation='relu'),
                MaxPooling2D(2, 2),
                Conv2D(128, (3, 3), activation='relu'),
                MaxPooling2D(2, 2),
                Flatten(),
                Dense(128, activation='relu'),
                Dropout(0.5),
                Dense(1, activation='sigmoid')
            ])
            
            model.compile(
                optimizer=Adam(learning_rate=0.001),
                loss='binary_crossentropy',
                metrics=['accuracy']
            )
            
            # Callbacks
            early_stopping = EarlyStopping(monitor='val_loss', patience=10, restore_best_weights=True)
            model_checkpoint = ModelCheckpoint(
                os.path.join(self.models_dir, 'cnn_model.h5'),
                monitor='val_accuracy',
                save_best_only=True
            )
            
            # Train model
            history = model.fit(
                X_train, y_train,
                validation_data=(X_test, y_test),
                epochs=50,
                batch_size=32,
                callbacks=[early_stopping, model_checkpoint],
                verbose=1
            )
            
            # Evaluate model
            test_loss, test_accuracy = model.evaluate(X_test, y_test, verbose=0)
            
            logger.info(f"CNN model accuracy: {test_accuracy:.4f}")
            
            # Save training history
            with open(os.path.join(self.models_dir, 'cnn_history.json'), 'w') as f:
                json.dump(history.history, f, indent=2)
            
            return {
                'model': 'cnn_model',
                'accuracy': test_accuracy,
                'loss': test_loss
            }
            
        except Exception as e:
            logger.error(f"Error training CNN model: {str(e)}")
            return {'error': str(e)}
    
    def train_all_models(self):
        """Train all models"""
        try:
            logger.info("Training all models...")
            
            results = {}
            
            # Train individual models
            results['phishing'] = self.train_phishing_classifier()
            results['malware'] = self.train_malware_classifier()
            results['ids'] = self.train_ids_classifier()
            results['anomaly'] = self.train_anomaly_detector()
            results['lstm'] = self.train_lstm_model()
            results['cnn'] = self.train_cnn_model()
            
            # Save overall results
            with open(os.path.join(self.models_dir, 'training_results.json'), 'w') as f:
                json.dump(results, f, indent=2)
            
            logger.info("All models trained successfully")
            return results
            
        except Exception as e:
            logger.error(f"Error training all models: {str(e)}")
            return {'error': str(e)}
    
    def _load_phishing_data(self):
        """Load or generate phishing data"""
        try:
            # Generate synthetic phishing data
            np.random.seed(42)
            n_samples = 1000
            
            # Features: URL length, dots, slashes, IP in URL, keywords, subdomains
            X = np.random.rand(n_samples, 6)
            X[:, 0] = np.random.randint(10, 200, n_samples)  # URL length
            X[:, 1] = np.random.randint(1, 10, n_samples)    # Dots
            X[:, 2] = np.random.randint(1, 20, n_samples)    # Slashes
            X[:, 3] = np.random.randint(0, 2, n_samples)     # IP in URL
            X[:, 4] = np.random.randint(0, 2, n_samples)     # Keywords
            X[:, 5] = np.random.randint(0, 5, n_samples)     # Subdomains
            
            # Labels: 0 = safe, 1 = phishing
            y = np.random.randint(0, 2, n_samples)
            
            return X, y
            
        except Exception as e:
            logger.error(f"Error loading phishing data: {str(e)}")
            return np.array([]), np.array([])
    
    def _load_malware_data(self):
        """Load or generate malware data"""
        try:
            # Generate synthetic malware data
            np.random.seed(42)
            n_samples = 1000
            
            # Features: file size, entropy, sections, imports, exports
            X = np.random.rand(n_samples, 5)
            X[:, 0] = np.random.randint(1000, 10000000, n_samples)  # File size
            X[:, 1] = np.random.uniform(0, 8, n_samples)            # Entropy
            X[:, 2] = np.random.randint(1, 20, n_samples)           # Sections
            X[:, 3] = np.random.randint(0, 100, n_samples)          # Imports
            X[:, 4] = np.random.randint(0, 50, n_samples)           # Exports
            
            # Labels: 0 = benign, 1 = malware
            y = np.random.randint(0, 2, n_samples)
            
            return X, y
            
        except Exception as e:
            logger.error(f"Error loading malware data: {str(e)}")
            return np.array([]), np.array([])
    
    def _load_ids_data(self):
        """Load or generate IDS data"""
        try:
            # Generate synthetic IDS data
            np.random.seed(42)
            n_samples = 1000
            
            # Features: packet count, bytes, duration, protocols, ports
            X = np.random.rand(n_samples, 5)
            X[:, 0] = np.random.randint(1, 1000, n_samples)         # Packet count
            X[:, 1] = np.random.randint(100, 1000000, n_samples)    # Bytes
            X[:, 2] = np.random.uniform(0, 3600, n_samples)         # Duration
            X[:, 3] = np.random.randint(1, 10, n_samples)           # Protocols
            X[:, 4] = np.random.randint(1, 100, n_samples)          # Ports
            
            # Labels: 0 = normal, 1 = intrusion
            y = np.random.randint(0, 2, n_samples)
            
            return X, y
            
        except Exception as e:
            logger.error(f"Error loading IDS data: {str(e)}")
            return np.array([]), np.array([])
    
    def _load_anomaly_data(self):
        """Load or generate anomaly data"""
        try:
            # Generate synthetic anomaly data
            np.random.seed(42)
            n_normal = 800
            n_anomaly = 200
            
            # Normal data
            X_normal = np.random.normal(0, 1, (n_normal, 5))
            y_normal = np.zeros(n_normal)
            
            # Anomalous data
            X_anomaly = np.random.normal(3, 1, (n_anomaly, 5))
            y_anomaly = np.ones(n_anomaly)
            
            # Combine
            X = np.vstack([X_normal, X_anomaly])
            y = np.hstack([y_normal, y_anomaly])
            
            return X, y
            
        except Exception as e:
            logger.error(f"Error loading anomaly data: {str(e)}")
            return np.array([]), np.array([])
    
    def _load_sequence_data(self):
        """Load or generate sequence data for LSTM"""
        try:
            # Generate synthetic sequence data
            np.random.seed(42)
            n_samples = 500
            sequence_length = 50
            n_features = 5
            
            X = np.random.rand(n_samples, sequence_length, n_features)
            y = np.random.randint(0, 2, n_samples)
            
            return X, y
            
        except Exception as e:
            logger.error(f"Error loading sequence data: {str(e)}")
            return np.array([]), np.array([])
    
    def _load_image_data(self):
        """Load or generate image data for CNN"""
        try:
            # Generate synthetic image data
            np.random.seed(42)
            n_samples = 200
            height, width, channels = 224, 224, 3
            
            X = np.random.rand(n_samples, height, width, channels)
            y = np.random.randint(0, 2, n_samples)
            
            return X, y
            
        except Exception as e:
            logger.error(f"Error loading image data: {str(e)}")
            return np.array([]), np.array([])

def main():
    """Main training function"""
    try:
        trainer = ModelTrainer()
        results = trainer.train_all_models()
        
        print("Training completed successfully!")
        print("Results:")
        for model_name, result in results.items():
            if 'error' not in result:
                print(f"  {model_name}: {result.get('accuracy', 'N/A')}")
            else:
                print(f"  {model_name}: Error - {result['error']}")
        
    except Exception as e:
        print(f"Training failed: {str(e)}")
        sys.exit(1)

if __name__ == "__main__":
    main()


