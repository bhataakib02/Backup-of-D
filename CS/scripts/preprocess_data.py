"""
Data Preprocessing Script
Preprocesses LANL/CERT datasets for ITDR training
"""

import argparse
import os
import sys
import yaml
import pandas as pd
import numpy as np
import logging
from pathlib import Path

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.ingestion.lanl_loader import load_lanl_dataset
from src.ingestion.cert_loader import load_cert_dataset
from src.preprocessing.feature_engineer import FeatureEngineer

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def main():
    parser = argparse.ArgumentParser(description='Preprocess datasets for ITDR')
    parser.add_argument('--dataset', type=str, choices=['lanl', 'cert', 'both'], 
                       default='lanl', help='Dataset to preprocess')
    parser.add_argument('--config', type=str, default='config/config.yaml',
                       help='Configuration file path')
    parser.add_argument('--output', type=str, default='data/processed',
                       help='Output directory for processed data')
    parser.add_argument('--max-rows', type=int, default=None,
                       help='Maximum rows to process (for testing)')
    
    args = parser.parse_args()
    
    # Load configuration
    with open(args.config, 'r') as f:
        config = yaml.safe_load(f)
    
    # Create output directory
    os.makedirs(args.output, exist_ok=True)
    
    # Initialize feature engineer
    feature_engineer = FeatureEngineer(config.get('features', {}))
    
    all_data = []
    
    # Process LANL dataset
    if args.dataset in ['lanl', 'both']:
        logger.info("Processing LANL dataset...")
        lanl_path = config.get('datasets', {}).get('lanl', {}).get('path', 'data/raw/lanl')
        auth_file = os.path.join(lanl_path, 'auth.txt')
        
        if os.path.exists(auth_file):
            try:
                lanl_df = load_lanl_dataset(auth_file, max_rows=args.max_rows)
                all_data.append(lanl_df)
                logger.info(f"Loaded {len(lanl_df)} LANL events")
            except Exception as e:
                logger.error(f"Error loading LANL dataset: {e}")
        else:
            logger.warning(f"LANL file not found: {auth_file}")
    
    # Process CERT dataset
    if args.dataset in ['cert', 'both']:
        logger.info("Processing CERT dataset...")
        cert_path = config.get('datasets', {}).get('cert', {}).get('path', 'data/raw/cert')
        
        if os.path.exists(cert_path):
            try:
                cert_df = load_cert_dataset(cert_path, include_file_access=True)
                all_data.append(cert_df)
                logger.info(f"Loaded {len(cert_df)} CERT events")
            except Exception as e:
                logger.error(f"Error loading CERT dataset: {e}")
        else:
            logger.warning(f"CERT directory not found: {cert_path}")
    
    if not all_data:
        logger.error("No data loaded. Please check dataset paths.")
        return
    
    # Combine datasets
    combined_df = pd.concat(all_data, ignore_index=True)
    logger.info(f"Combined dataset: {len(combined_df)} events")
    
    # Extract features
    logger.info("Extracting features...")
    features_df = feature_engineer.extract_all_features(combined_df, fit=True)
    
    # Save processed data
    output_file = os.path.join(args.output, 'processed_features.csv')
    features_df.to_csv(output_file, index=False)
    logger.info(f"Saved processed features to {output_file}")
    
    # Save preprocessors
    preprocessor_file = os.path.join(args.output, 'preprocessors.pkl')
    feature_engineer.save_preprocessors(preprocessor_file)
    logger.info(f"Saved preprocessors to {preprocessor_file}")
    
    # Create sequences
    logger.info("Creating sequences...")
    sequences = feature_engineer.create_sequences(
        features_df,
        sequence_length=config.get('features', {}).get('sequence', {}).get('max_sequence_length', 50)
    )
    
    # Save sequences (per user)
    sequences_dir = os.path.join(args.output, 'sequences')
    os.makedirs(sequences_dir, exist_ok=True)
    
    for user_id, user_sequences in sequences.items():
        seq_file = os.path.join(sequences_dir, f"{user_id}_sequences.npy")
        np.save(seq_file, user_sequences)
    
    logger.info(f"Saved sequences for {len(sequences)} users to {sequences_dir}")
    
    logger.info("Preprocessing complete!")


if __name__ == '__main__':
    main()

