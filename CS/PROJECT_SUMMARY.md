# ITDR System - Project Summary

## Executive Summary

This project implements a **production-realistic Identity Threat Detection & Response (ITDR) system** using behavioral analytics and explainable AI. The system is designed for final-year university evaluation and industry review, following Zero Trust security principles.

---

## Key Features

### 1. Real-World Dataset Support
- **LANL Cyber Security Dataset**: Authentication logs
- **CERT Insider Threat Dataset**: User activity logs
- No dummy or synthetic data

### 2. Behavioral Modeling
- LSTM/GRU networks for user behavior analysis
- Per-user behavioral baselines
- Sequence-based anomaly detection
- Reconstruction error for anomaly scoring

### 3. Multi-Factor Risk Scoring
- Behavioral risk (35%)
- Temporal risk (20%)
- Location risk (15%)
- Privilege risk (25%)
- MITRE ATT&CK risk (5%)

### 4. Explainable AI
- Feature attribution
- Human-readable explanations
- Contributing factor analysis
- Natural language explanations

### 5. MITRE ATT&CK Integration
- Maps detections to ATT&CK tactics
- Technique matching
- Confidence scoring

### 6. Risk-Adaptive Responses
- Monitor only (< 0.3)
- Alert analyst (0.3 - 0.5)
- Force re-authentication (0.5 - 0.7)
- Step-up MFA (0.7 - 0.85)
- Temporary account disable (≥ 0.85)

### 7. Dashboard & Visualization
- Real-time detection view
- Risk score visualization
- Explanation panels
- Statistics and analytics

---

## Architecture Overview

```
Dataset (LANL/CERT)
    ↓
Ingestion Layer
    ↓
Preprocessing & Feature Engineering
    ↓
Behavioral Modeling (LSTM/GRU)
    ↓
Anomaly Detection
    ↓
Risk Scoring Engine
    ↓
MITRE ATT&CK Mapping
    ↓
Explainability Module
    ↓
Response Engine
    ↓
Dashboard / API
```

---

## Project Structure

```
ITDR-System/
├── app/                    # Dashboard application
├── src/                    # Core modules
│   ├── ingestion/         # Data loading (LANL/CERT)
│   ├── preprocessing/     # Feature engineering
│   ├── modeling/          # Behavioral models
│   ├── detection/         # Anomaly detection
│   ├── risk/              # Risk scoring
│   ├── mitre/             # MITRE ATT&CK mapping
│   ├── explainability/    # XAI components
│   └── response/          # Response engine
├── scripts/               # Utility scripts
├── config/                # Configuration
├── data/                  # Data storage
├── docs/                  # Documentation
└── tests/                 # Unit tests
```

---

## Quick Start

### 1. Installation

```bash
# Clone/download project
cd ITDR-System

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### 2. Prepare Data

Download datasets to `data/raw/`:
- LANL: `data/raw/lanl/auth.txt`
- CERT: `data/raw/cert/` (log files)

### 3. Preprocess

```bash
python scripts/preprocess_data.py --dataset lanl --output data/processed
```

### 4. Train Models

```bash
python scripts/train_models.py --config config/config.yaml
```

### 5. Start Dashboard

```bash
python app/main.py
```

Access: http://localhost:5000

---

## Academic Deliverables

### Documentation

1. **Architecture Document** (`docs/architecture.md`)
   - System design
   - Component descriptions
   - Data flow
   - Mathematical formulations

2. **Algorithm Documentation** (`docs/algorithms.md`)
   - LSTM/GRU architecture
   - Risk scoring formulas
   - Feature engineering
   - MITRE mapping logic

3. **Evaluation Methodology** (`docs/evaluation.md`)
   - Metrics definitions
   - Experimental setup
   - Baseline comparisons
   - Limitations

4. **Research Documentation** (`docs/research.md`)
   - Problem statement
   - Research gap
   - Contributions
   - Related work

5. **Deployment Guide** (`docs/deployment.md`)
   - Installation instructions
   - Configuration
   - Troubleshooting

### Code

- **Production-realistic implementation**
- **Well-documented code**
- **Modular architecture**
- **Reproducible results**

---

## Technical Highlights

### Behavioral Modeling

- **Architecture**: Stacked LSTM/GRU (2 layers, 128 hidden units)
- **Input**: Sequences of 50 behavioral events
- **Output**: Behavioral embeddings + reconstructions
- **Training**: Autoencoder approach (reconstruction error)

### Risk Scoring

- **Multi-factor weighted combination**
- **Normalized component risks [0, 1]**
- **Threshold-based risk levels**
- **Configurable weights**

### Explainability

- **Contributing factor analysis**
- **Natural language explanations**
- **MITRE ATT&CK mapping**
- **Human-readable summaries**

---

## Evaluation Metrics

- **Precision**: TP / (TP + FP)
- **Recall**: TP / (TP + FN)
- **F1-Score**: Harmonic mean
- **False Positive Rate**: FP / (FP + TN)
- **Detection Latency**: Time to detection

---

## Limitations & Future Work

### Current Limitations

- Single-machine deployment
- Batch processing (not fully real-time)
- Limited dataset diversity
- Simplified feature extraction

### Future Enhancements

- Distributed processing
- Online learning
- Multi-dataset ensemble
- Real-time streaming
- Advanced feature engineering

---

## Defensibility (Viva-Ready)

### For University Panels

- **Real datasets**: LANL, CERT (publicly available)
- **Academic rigor**: Proper methodology, evaluation
- **Documentation**: Comprehensive documentation
- **Reproducibility**: Clear instructions, config files

### For Security Engineers

- **Production-realistic**: Real-world architecture
- **Zero Trust alignment**: Continuous verification
- **MITRE ATT&CK**: Standard framework mapping
- **Explainability**: Auditable decisions

### For Zero-Trust Architects

- **Principles alignment**: Never trust, always verify
- **Risk-adaptive**: Dynamic responses
- **Continuous monitoring**: Real-time assessment
- **Least privilege**: Privilege usage monitoring

---

## Key Files

- `README.md`: Project overview
- `docs/architecture.md`: System architecture
- `config/config.yaml`: Configuration
- `scripts/preprocess_data.py`: Data preprocessing
- `scripts/train_models.py`: Model training
- `app/main.py`: Dashboard entry point

---

## Contact & Support

For questions or issues:
1. Review documentation in `docs/`
2. Check configuration in `config/`
3. Review code comments
4. Check logs in `logs/`

---

## License

Academic Use Only

---

## Acknowledgments

- LANL Cyber Security Dataset
- CERT Insider Threat Dataset
- MITRE ATT&CK Framework
- Zero Trust Architecture (NIST SP 800-207)

---

**Status**: Production-ready for evaluation  
**Version**: 1.0  
**Last Updated**: 2024

