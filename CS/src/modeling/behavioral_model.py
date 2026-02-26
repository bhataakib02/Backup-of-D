"""
Behavioral Modeling using LSTM/GRU
Learns normal user behavior patterns for anomaly detection
"""

import numpy as np
try:
    import tensorflow as tf
    # TensorFlow 2.x includes Keras
    from tensorflow import keras
    from tensorflow.keras import layers
except ImportError:
    raise ImportError(
        "TensorFlow is required but not installed. "
        "Install with: pip install tensorflow>=2.13.0"
    )
except AttributeError:
    # Fallback if tensorflow.keras not available
    try:
        import keras
        from keras import layers
    except ImportError:
        raise ImportError(
            "Keras is required but not installed. "
            "Install with: pip install tensorflow>=2.13.0"
        )
from typing import Dict, List, Tuple, Optional
import logging
import os
import pickle

logger = logging.getLogger(__name__)


class BehavioralModel:
    """LSTM/GRU-based behavioral model for user behavior analysis"""
    
    def __init__(self, model_type: str = 'lstm', 
                 embedding_dim: int = 64,
                 hidden_dim: int = 128,
                 num_layers: int = 2,
                 dropout: float = 0.2,
                 sequence_length: int = 50,
                 feature_dim: int = 32):
        """
        Initialize behavioral model
        
        Args:
            model_type: 'lstm' or 'gru'
            embedding_dim: Embedding dimension
            hidden_dim: Hidden layer dimension
            num_layers: Number of LSTM/GRU layers
            dropout: Dropout rate
            sequence_length: Input sequence length
            feature_dim: Input feature dimension
        """
        self.model_type = model_type.lower()
        self.embedding_dim = embedding_dim
        self.hidden_dim = hidden_dim
        self.num_layers = num_layers
        self.dropout = dropout
        self.sequence_length = sequence_length
        self.feature_dim = feature_dim
        
        self.model = None
        self.history = None
        
        # User-specific models (per-user baselines)
        self.user_models: Dict[str, keras.Model] = {}
        self.user_baselines: Dict[str, Dict] = {}
    
    def build_model(self, input_shape: Tuple[int, int]) -> keras.Model:
        """
        Build LSTM/GRU model architecture
        
        Args:
            input_shape: (sequence_length, feature_dim)
        
        Returns:
            Compiled Keras model
        """
        logger.info(f"Building {self.model_type.upper()} model with input shape {input_shape}")
        
        inputs = keras.Input(shape=input_shape, name='input_sequence')
        
        x = inputs
        
        # Stacked LSTM/GRU layers
        for i in range(self.num_layers):
            return_sequences = (i < self.num_layers - 1)  # Return sequences except for last layer
            
            if self.model_type == 'lstm':
                x = layers.LSTM(
                    self.hidden_dim,
                    return_sequences=return_sequences,
                    name=f'lstm_{i+1}'
                )(x)
            else:  # GRU
                x = layers.GRU(
                    self.hidden_dim,
                    return_sequences=return_sequences,
                    name=f'gru_{i+1}'
                )(x)
            
            x = layers.Dropout(self.dropout, name=f'dropout_{i+1}')(x)
        
        # Output: behavioral embedding
        embedding = layers.Dense(self.embedding_dim, activation='relu', name='behavioral_embedding')(x)
        
        # For reconstruction-based anomaly detection
        # Reconstruct input sequence
        reconstructed = layers.RepeatVector(input_shape[0])(embedding)
        for i in range(self.num_layers - 1, -1, -1):
            if self.model_type == 'lstm':
                reconstructed = layers.LSTM(
                    self.hidden_dim,
                    return_sequences=True,
                    name=f'decoder_lstm_{i+1}'
                )(reconstructed)
            else:
                reconstructed = layers.GRU(
                    self.hidden_dim,
                    return_sequences=True,
                    name=f'decoder_gru_{i+1}'
                )(reconstructed)
            reconstructed = layers.Dropout(self.dropout)(reconstructed)
        
        output = layers.TimeDistributed(
            layers.Dense(input_shape[1], activation='linear'),
            name='reconstructed_sequence'
        )(reconstructed)
        
        model = keras.Model(inputs=inputs, outputs=[embedding, output], name='behavioral_model')
        
        # Compile model
        model.compile(
            optimizer=keras.optimizers.Adam(learning_rate=0.001),
            loss={
                'behavioral_embedding': 'mse',  # Not used directly, but required
                'reconstructed_sequence': 'mse'
            },
            loss_weights={
                'behavioral_embedding': 0.0,
                'reconstructed_sequence': 1.0
            },
            metrics=['mae']
        )
        
        logger.info(f"Model built: {model.count_params()} parameters")
        
        return model
    
    def train(self, X_train: np.ndarray, 
              validation_split: float = 0.2,
              epochs: int = 50,
              batch_size: int = 32,
              verbose: int = 1) -> keras.callbacks.History:
        """
        Train the behavioral model
        
        Args:
            X_train: Training sequences (n_samples, sequence_length, feature_dim)
            validation_split: Validation split ratio
            epochs: Number of training epochs
            batch_size: Batch size
            verbose: Verbosity level
        
        Returns:
            Training history
        """
        logger.info(f"Training behavioral model on {len(X_train)} samples")
        
        if self.model is None:
            self.model = self.build_model((X_train.shape[1], X_train.shape[2]))
        
        # Training: reconstruct input (autoencoder approach)
        # Target is the input itself
        y_train_reconstruction = X_train  # For reconstruction
        y_train_embedding = X_train[:, -1, :]  # Last timestep for embedding (dummy target)
        
        # Callbacks
        callbacks = [
            keras.callbacks.EarlyStopping(
                monitor='val_loss',
                patience=10,
                restore_best_weights=True
            ),
            keras.callbacks.ReduceLROnPlateau(
                monitor='val_loss',
                factor=0.5,
                patience=5,
                min_lr=1e-6
            )
        ]
        
        # Train model
        history = self.model.fit(
            X_train,
            {'behavioral_embedding': y_train_embedding, 'reconstructed_sequence': y_train_reconstruction},
            validation_split=validation_split,
            epochs=epochs,
            batch_size=batch_size,
            callbacks=callbacks,
            verbose=verbose
        )
        
        self.history = history
        
        logger.info("Training completed")
        
        return history
    
    def train_per_user(self, user_sequences: Dict[str, np.ndarray],
                      epochs: int = 30,
                      batch_size: int = 16,
                      min_samples: int = 50) -> Dict[str, keras.callbacks.History]:
        """
        Train per-user behavioral models
        
        Args:
            user_sequences: Dictionary mapping user IDs to sequences
            epochs: Number of epochs per user
            batch_size: Batch size
            min_samples: Minimum samples required to train a user model
        
        Returns:
            Dictionary of training histories per user
        """
        logger.info(f"Training per-user models for {len(user_sequences)} users")
        
        histories = {}
        
        for user_id, sequences in user_sequences.items():
            if len(sequences) < min_samples:
                logger.debug(f"Skipping user {user_id}: insufficient samples ({len(sequences)})")
                continue
            
            logger.info(f"Training model for user {user_id} ({len(sequences)} sequences)")
            
            # Flatten user sequences (each user may have multiple sequences)
            X_user = sequences.reshape(-1, sequences.shape[1], sequences.shape[2])
            
            # Build user-specific model
            user_model = self.build_model((sequences.shape[1], sequences.shape[2]))
            
            # Train user model
            history = user_model.fit(
                X_user,
                {'behavioral_embedding': X_user[:, -1, :], 'reconstructed_sequence': X_user},
                epochs=epochs,
                batch_size=batch_size,
                verbose=0
            )
            
            self.user_models[user_id] = user_model
            histories[user_id] = history
            
            # Compute baseline reconstruction error for this user
            pred_embedding, pred_reconstruction = user_model.predict(X_user, verbose=0)
            reconstruction_errors = np.mean(np.square(X_user - pred_reconstruction), axis=(1, 2))
            
            self.user_baselines[user_id] = {
                'mean_error': np.mean(reconstruction_errors),
                'std_error': np.std(reconstruction_errors),
                'threshold': np.percentile(reconstruction_errors, 95)  # 95th percentile as threshold
            }
        
        logger.info(f"Trained models for {len(self.user_models)} users")
        
        return histories
    
    def predict(self, X: np.ndarray, user_id: Optional[str] = None) -> Tuple[np.ndarray, np.ndarray]:
        """
        Predict behavioral embeddings and reconstructions
        
        Args:
            X: Input sequences (n_samples, sequence_length, feature_dim)
            user_id: Optional user ID for user-specific model
        
        Returns:
            Tuple of (embeddings, reconstructions)
        """
        if user_id and user_id in self.user_models:
            model = self.user_models[user_id]
        elif self.model is not None:
            model = self.model
        else:
            raise ValueError("No model available. Train model first.")
        
        return model.predict(X, verbose=0)
    
    def compute_reconstruction_error(self, X: np.ndarray, user_id: Optional[str] = None) -> np.ndarray:
        """
        Compute reconstruction error (anomaly score)
        
        Args:
            X: Input sequences
            user_id: Optional user ID
        
        Returns:
            Reconstruction errors per sample
        """
        _, reconstructions = self.predict(X, user_id=user_id)
        
        # Mean squared error per sequence
        errors = np.mean(np.square(X - reconstructions), axis=(1, 2))
        
        return errors
    
    def compute_anomaly_score(self, X: np.ndarray, user_id: Optional[str] = None) -> np.ndarray:
        """
        Compute normalized anomaly score
        
        Args:
            X: Input sequences
            user_id: Optional user ID
        
        Returns:
            Anomaly scores (0-1 range, higher = more anomalous)
        """
        errors = self.compute_reconstruction_error(X, user_id=user_id)
        
        if user_id and user_id in self.user_baselines:
            baseline = self.user_baselines[user_id]
            # Normalize based on user baseline
            normalized = (errors - baseline['mean_error']) / (baseline['std_error'] + 1e-6)
            # Convert to 0-1 range using sigmoid
            scores = 1 / (1 + np.exp(-normalized))
        else:
            # Global normalization (fallback)
            scores = (errors - errors.mean()) / (errors.std() + 1e-6)
            scores = 1 / (1 + np.exp(-scores))
        
        return scores
    
    def save(self, filepath: str):
        """Save model and baselines"""
        if self.model is not None:
            self.model.save(filepath)
            logger.info(f"Saved model to {filepath}")
        
        # Save user models and baselines
        baseline_path = filepath.replace('.h5', '_baselines.pkl')
        with open(baseline_path, 'wb') as f:
            pickle.dump({
                'user_baselines': self.user_baselines,
                'model_config': {
                    'model_type': self.model_type,
                    'embedding_dim': self.embedding_dim,
                    'hidden_dim': self.hidden_dim,
                    'num_layers': self.num_layers,
                    'dropout': self.dropout,
                    'sequence_length': self.sequence_length,
                    'feature_dim': self.feature_dim
                }
            }, f)
        
        # Save user models separately
        if self.user_models:
            user_models_dir = filepath.replace('.h5', '_user_models')
            os.makedirs(user_models_dir, exist_ok=True)
            for user_id, model in self.user_models.items():
                model.save(os.path.join(user_models_dir, f"{user_id}.h5"))
        
        logger.info(f"Saved baselines and user models")
    
    def load(self, filepath: str):
        """Load model and baselines"""
        self.model = keras.models.load_model(filepath)
        logger.info(f"Loaded model from {filepath}")
        
        # Load baselines
        baseline_path = filepath.replace('.h5', '_baselines.pkl')
        if os.path.exists(baseline_path):
            with open(baseline_path, 'rb') as f:
                data = pickle.load(f)
                self.user_baselines = data.get('user_baselines', {})
                config = data.get('model_config', {})
                self.model_type = config.get('model_type', self.model_type)
                logger.info(f"Loaded baselines for {len(self.user_baselines)} users")

