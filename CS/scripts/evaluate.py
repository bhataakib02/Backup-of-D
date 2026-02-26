"""
Evaluation Script
Evaluates ITDR system performance
"""

import argparse
import os
import sys
import yaml
import numpy as np
import pandas as pd
import logging
from pathlib import Path
from sklearn.metrics import precision_score, recall_score, f1_score, confusion_matrix

# Add parent directory to path
sys.path.insert(0, str(Path(__file__).parent.parent))

from src.modeling.behavioral_model import BehavioralModel
from src.detection.detection_pipeline import DetectionPipeline

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


def evaluate_detection(y_true, y_pred, risk_scores):
    """Evaluate detection performance"""
    metrics = {
        'precision': precision_score(y_true, y_pred, zero_division=0),
        'recall': recall_score(y_true, y_pred, zero_division=0),
        'f1': f1_score(y_true, y_pred, zero_division=0)
    }
    
    # False positive rate
    tn, fp, fn, tp = confusion_matrix(y_true, y_pred).ravel()
    metrics['fpr'] = fp / (fp + tn) if (fp + tn) > 0 else 0.0
    
    # Risk score statistics
    metrics['avg_risk_score_anomaly'] = np.mean(risk_scores[y_true == 1])
    metrics['avg_risk_score_normal'] = np.mean(risk_scores[y_true == 0])
    
    return metrics


def main():
    parser = argparse.ArgumentParser(description='Evaluate ITDR system')
    parser.add_argument('--config', type=str, default='config/config.yaml',
                       help='Configuration file path')
    parser.add_argument('--model', type=str, default='data/models/behavioral_model.h5',
                       help='Path to trained model')
    parser.add_argument('--test-data', type=str, default='data/processed/processed_features.csv',
                       help='Path to test data')
    parser.add_argument('--output', type=str, default='results',
                       help='Output directory for results')
    
    args = parser.parse_args()
    
    # Load configuration
    with open(args.config, 'r') as f:
        config = yaml.safe_load(f)
    
    os.makedirs(args.output, exist_ok=True)
    
    # Load model
    logger.info(f"Loading model from {args.model}")
    if not os.path.exists(args.model):
        logger.error(f"Model not found: {args.model}")
        return
    
    behavioral_model = BehavioralModel()
    behavioral_model.load(args.model)
    
    # Initialize pipeline
    pipeline = DetectionPipeline(config, behavioral_model)
    
    # Load test data
    logger.info(f"Loading test data from {args.test_data}")
    if not os.path.exists(args.test_data):
        logger.error(f"Test data not found: {args.test_data}")
        return
    
    test_df = pd.read_csv(args.test_data)
    
    logger.info(f"Evaluating on {len(test_df)} samples")
    
    # For evaluation, we need ground truth labels
    # In real scenario, would use labeled test set
    # For now, use reconstruction error as proxy
    
    # Sample evaluation (simplified)
    # In production, would need labeled anomalies
    logger.warning("Evaluation requires labeled test data. This is a simplified evaluation.")
    
    # Compute reconstruction errors
    # This is a placeholder - real evaluation would use labeled data
    
    results = {
        'note': 'This is a simplified evaluation. Real evaluation requires labeled anomaly data.',
        'test_samples': len(test_df)
    }
    
    # Save results
    results_file = os.path.join(args.output, 'evaluation_results.txt')
    with open(results_file, 'w') as f:
        f.write("ITDR System Evaluation Results\n")
        f.write("=" * 50 + "\n\n")
        for key, value in results.items():
            f.write(f"{key}: {value}\n")
    
    logger.info(f"Evaluation results saved to {results_file}")
    logger.info("Evaluation complete (simplified)")


if __name__ == '__main__':
    main()

