# Evaluation Methodology

## Overview

This document describes the evaluation methodology for the ITDR system, including metrics, experimental setup, and limitations.

---

## Evaluation Metrics

### Detection Performance

1. **Precision**
   - Definition: Proportion of detected anomalies that are true anomalies
   - Formula: Precision = TP / (TP + FP)
   - Interpretation: Higher precision = fewer false alarms

2. **Recall (Detection Rate)**
   - Definition: Proportion of true anomalies that are detected
   - Formula: Recall = TP / (TP + FN)
   - Interpretation: Higher recall = fewer missed threats

3. **F1-Score**
   - Definition: Harmonic mean of precision and recall
   - Formula: F1 = 2 · (Precision · Recall) / (Precision + Recall)
   - Interpretation: Balanced performance metric

4. **False Positive Rate (FPR)**
   - Definition: Proportion of normal events incorrectly flagged as anomalies
   - Formula: FPR = FP / (FP + TN)
   - Interpretation: Lower FPR = fewer false alarms

### Risk Score Calibration

- **Average Risk Score (Anomalies)**: Mean risk score for true anomalies
- **Average Risk Score (Normal)**: Mean risk score for normal events
- **Risk Score Distribution**: Histogram of risk scores for both classes

### Detection Latency

- **Time to Detection**: Time from event occurrence to detection/alert
- **Real-time Performance**: Processing time per event

---

## Experimental Setup

### Dataset Splits

1. **Training Set (80%)**
   - Used for model training
   - Behavioral baseline learning
   - Feature normalization

2. **Validation Set (10%)**
   - Hyperparameter tuning
   - Early stopping
   - Model selection

3. **Test Set (10%)**
   - Final evaluation
   - Performance metrics
   - No model modification

### Evaluation Protocol

1. **Train Models**
   ```bash
   python scripts/train_models.py --config config/config.yaml
   ```

2. **Run Evaluation**
   ```bash
   python scripts/evaluate.py --model data/models/behavioral_model.h5 --test-data data/processed/test/
   ```

3. **Analyze Results**
   - Review precision/recall/F1
   - Analyze false positive rate
   - Examine risk score calibration

---

## Baseline Comparisons

### Baselines (Conceptual)

1. **Rule-Based Detection**
   - Threshold-based rules
   - Simple heuristics
   - Expected: High precision, low recall

2. **Statistical Anomaly Detection**
   - Z-score based
   - Percentile thresholds
   - Expected: Moderate precision/recall

3. **ML-Based (Our System)**
   - Behavioral modeling (LSTM)
   - Multi-factor risk scoring
   - Expected: Balanced precision/recall

---

## Limitations

### Current Limitations

1. **Labeled Data**
   - Limited labeled anomaly data in public datasets
   - Evaluation relies on reconstruction error thresholds
   - Real-world evaluation requires security incident labels

2. **Dataset Scope**
   - Limited to LANL and CERT datasets
   - May not generalize to all environments
   - Domain-specific adaptations needed

3. **Computational Constraints**
   - Single-machine deployment (student laptop)
   - Batch processing (not fully real-time)
   - Limited model complexity

4. **Feature Engineering**
   - Simplified feature extraction
   - Limited geolocation data (IP-based only)
   - Privilege features require domain knowledge

### Future Improvements

1. **Enhanced Evaluation**
   - Labeled test sets
   - Multi-dataset evaluation
   - Cross-domain validation

2. **Real-Time Processing**
   - Stream processing
   - Online learning
   - Incremental model updates

3. **Advanced Features**
   - Real geolocation data
   - Network flow analysis
   - Endpoint telemetry integration

---

## Reproducibility

### Requirements

- Python 3.9+
- Dependencies in `requirements.txt`
- Datasets: LANL and/or CERT
- Configuration: `config/config.yaml`

### Steps

1. Install dependencies
2. Download datasets (see `docs/datasets.md`)
3. Preprocess data
4. Train models
5. Run evaluation

### Configuration

All hyperparameters and settings are in `config/config.yaml`:
- Model architecture
- Risk weights
- Response thresholds
- Feature settings

---

## Academic Context

This evaluation methodology is designed for:
- Final-year project defense
- Academic publication
- Industry review

All metrics and methodologies follow standard security evaluation practices.

---

## References

- Sokolova, M., & Lapalme, G. (2009). A systematic analysis of performance measures for classification tasks. Information processing & management, 45(4), 427-437.
- Davis, J., & Goadrich, M. (2006). The relationship between Precision-Recall and ROC curves. ICML.
- MITRE ATT&CK Evaluation: https://attack.mitre.org/resources/working-groups/evaluations/

