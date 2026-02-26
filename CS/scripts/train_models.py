"""
Model Training Script
Trains behavioral models on preprocessed data
"""

import argparse
import os
import sys
import yaml
import numpy as np
import logging
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.modeling.behavioral_model import BehavioralModel

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser(description='Train behavioral models')
    parser.add_argument('--config', type=str, default='config/config.yaml',
                       help='Configuration file path')
    parser.add_argument('--data', type=str, default='data/processed/sequences',
                       help='Directory containing sequence data')
    parser.add_argument('--output', type=str, default='data/models',
                       help='Output directory for trained models')
    parser.add_argument('--per-user', action='store_true',
                       help='Train per-user models')
    
    args = parser.parse_args()
    
    # Load configuration
    with open(args.config, 'r') as f:
        config = yaml.safe_load(f)
    
    # Create output directory
    os.makedirs(args.output, exist_ok=True)
    
    # Model configuration
    model_config = config.get('models', {}).get('behavioral', {})
    
    # Load sequences
    logger.info(f"Loading sequences from {args.data}")
    user_sequences = {}
    
    if os.path.isdir(args.data):
        for filename in os.listdir(args.data):
            if filename.endswith('_sequences.npy'):
                user_id = filename.replace('_sequences.npy', '')
                seq_path = os.path.join(args.data, filename)
                sequences = np.load(seq_path)
                user_sequences[user_id] = sequences
                logger.info(f"Loaded {len(sequences)} sequences for user {user_id}")
    
    if not user_sequences:
        logger.error("No sequences found. Please run preprocessing first.")
        return
    
    # Determine feature dimension from first sequence
    first_user = list(user_sequences.keys())[0]
    first_seq = user_sequences[first_user]
    sequence_length, feature_dim = first_seq.shape[1], first_seq.shape[2]
    
    logger.info(f"Sequence length: {sequence_length}, Feature dimension: {feature_dim}")
    
    if args.per_user:
        # Train per-user models
        logger.info("Training per-user models...")
        model = BehavioralModel(
            model_type=model_config.get('type', 'lstm'),
            embedding_dim=model_config.get('embedding_dim', 64),
            hidden_dim=model_config.get('hidden_dim', 128),
            num_layers=model_config.get('num_layers', 2),
            dropout=model_config.get('dropout', 0.2),
            sequence_length=sequence_length,
            feature_dim=feature_dim
        )
        
        histories = model.train_per_user(
            user_sequences,
            epochs=model_config.get('epochs', 30),
            batch_size=model_config.get('batch_size', 16)
        )
        
        # Save model
        model_path = os.path.join(args.output, 'behavioral_model.h5')
        model.save(model_path)
        logger.info(f"Saved per-user models to {model_path}")
    else:
        # Train global model
        logger.info("Training global behavioral model...")
        
        # Combine all user sequences
        all_sequences = []
        for user_id, sequences in user_sequences.items():
            all_sequences.append(sequences)
        
        X_train = np.vstack(all_sequences)
        logger.info(f"Training on {len(X_train)} sequences")
        
        model = BehavioralModel(
            model_type=model_config.get('type', 'lstm'),
            embedding_dim=model_config.get('embedding_dim', 64),
            hidden_dim=model_config.get('hidden_dim', 128),
            num_layers=model_config.get('num_layers', 2),
            dropout=model_config.get('dropout', 0.2),
            sequence_length=sequence_length,
            feature_dim=feature_dim
        )
        
        history = model.train(
            X_train,
            validation_split=0.2,
            epochs=model_config.get('epochs', 50),
            batch_size=model_config.get('batch_size', 32)
        )
        
        # Save model
        model_path = os.path.join(args.output, 'behavioral_model.h5')
        model.save(model_path)
        logger.info(f"Saved model to {model_path}")
    
    logger.info("Training complete!")


if __name__ == '__main__':
    main()

