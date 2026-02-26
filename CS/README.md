# Identity Threat Detection & Response (ITDR) System

**Final-Year University Project | Production-Realistic Identity Security System**

---

## 📋 Project Overview

This ITDR system implements a comprehensive identity threat detection framework aligned with Zero Trust security principles. The system analyzes real authentication and access logs to detect account takeover, privilege escalation, insider misuse, and lateral movement using behavioral analytics and explainable AI.

---

## 🏗️ Architecture

### Core Components

1. **Data Ingestion Layer**
   - Real dataset support (LANL, CERT Insider Threat)
   - Log parsing and normalization
   - Temporal windowing

2. **Feature Engineering**
   - Behavioral features (login patterns, IP changes, device usage)
   - Temporal sequences
   - Privilege usage patterns

3. **Behavioral Modeling**
   - LSTM/GRU networks for user behavior baselines
   - Per-user behavioral profiling
   - Sequence-based anomaly detection

4. **Risk Scoring Engine**
   - Multi-factor risk computation
   - MITRE ATT&CK tactic mapping
   - Threshold-based alerting

5. **Explainability Module**
   - Feature attribution
   - Behavioral deviation analysis
   - Human-readable explanations

6. **Response Engine**
   - Risk-adaptive responses
   - Audit logging
   - Non-destructive actions

7. **Dashboard & Visualization**
   - Identity risk timeline
   - High-risk session views
   - Explanation panels

---

## 🚀 Quick Start

### Prerequisites

- Python 3.9+
- Docker & Docker Compose
- 8GB+ RAM recommended

### Installation

```bash
# Clone and setup
git clone <repository>
cd ITDR-System

# Build Docker containers
docker-compose build

# Run the system
docker-compose up
```

### Manual Setup

```bash
# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run preprocessing
python scripts/preprocess_data.py --dataset lanl --output data/processed/

# Train models
python scripts/train_models.py --config config/model_config.yaml

# Start dashboard
python app/main.py
```

---

## 📁 Project Structure

```
ITDR-System/
├── app/                    # Main application
│   ├── main.py            # Dashboard entry point
│   ├── api/               # REST API endpoints
│   ├── dashboard/         # Dashboard components
│   └── models/            # ML model wrappers
├── src/                    # Core modules
│   ├── ingestion/         # Data ingestion
│   ├── preprocessing/     # Feature engineering
│   ├── modeling/          # Behavioral models
│   ├── detection/         # Anomaly detection
│   ├── risk/              # Risk scoring
│   ├── explainability/    # XAI components
│   ├── response/          # Response engine
│   └── mitre/             # MITRE ATT&CK mapping
├── scripts/                # Utility scripts
│   ├── preprocess_data.py
│   ├── train_models.py
│   └── evaluate.py
├── config/                 # Configuration files
├── data/                   # Data storage
│   ├── raw/               # Raw datasets
│   ├── processed/         # Preprocessed data
│   └── models/            # Trained models
├── docs/                   # Documentation
│   ├── architecture.md
│   ├── algorithms.md
│   └── evaluation.md
├── tests/                  # Unit tests
├── docker-compose.yml
├── Dockerfile
└── requirements.txt
```

---

## 📊 Datasets

The system supports:

- **LANL Cyber Security Dataset**: Authentication logs, network flows
- **CERT Insider Threat Dataset**: User activity, file access, email
- Custom log formats (Windows Event Log, Linux auth.log)

See `docs/datasets.md` for dataset preparation instructions.

---

## 🧪 Evaluation Metrics

- Precision, Recall, F1-Score
- False Positive Rate
- Detection Latency
- Risk Score Calibration

Run evaluation:
```bash
python scripts/evaluate.py --model models/lstm_behavioral.h5 --test data/processed/test/
```

---

## 📚 Documentation

- [Architecture Documentation](docs/architecture.md)
- [Algorithm Details](docs/algorithms.md)
- [Evaluation Methodology](docs/evaluation.md)
- [Research Gap & Problem Statement](docs/research.md)

---

## 🔒 Security & Compliance

- Zero Trust principles
- MITRE ATT&CK mapping
- Audit logging
- Non-destructive response actions

---

## 👥 Academic Context

This system is designed for:
- Final-year university evaluation
- Industry review
- Viva defense

All components are:
- Real-world realistic
- Defendable
- Well-documented
- Reproducible

---

## 📝 License

Academic Use Only

---

## 🙏 Acknowledgments

- LANL Cyber Security Dataset
- CERT Insider Threat Dataset
- MITRE ATT&CK Framework

