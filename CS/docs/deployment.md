# Deployment Guide

## Overview

This guide provides instructions for deploying the ITDR system in a development or evaluation environment.

---

## Prerequisites

### Hardware Requirements

- **CPU**: 4+ cores recommended
- **RAM**: 8GB+ recommended (16GB for large datasets)
- **Storage**: 10GB+ free space (for datasets and models)
- **OS**: Linux, macOS, or Windows (with WSL2)

### Software Requirements

- **Python**: 3.9 or higher
- **Docker**: 20.10+ (optional, for containerized deployment)
- **Docker Compose**: 1.29+ (optional)

---

## Installation Methods

### Method 1: Docker Deployment (Recommended)

#### Step 1: Clone/Download Project

```bash
cd /path/to/project
```

#### Step 2: Build Docker Image

```bash
docker-compose build
```

#### Step 3: Prepare Data

Place datasets in `data/raw/`:
- LANL: `data/raw/lanl/auth.txt`
- CERT: `data/raw/cert/` (with log files)

#### Step 4: Run Container

```bash
docker-compose up -d
```

#### Step 5: Access Dashboard

Open browser: http://localhost:5000

---

### Method 2: Native Python Deployment

#### Step 1: Create Virtual Environment

```bash
python -m venv venv

# On Linux/macOS:
source venv/bin/activate

# On Windows:
venv\Scripts\activate
```

#### Step 2: Install Dependencies

```bash
pip install -r requirements.txt
```

#### Step 3: Prepare Data

```bash
# Create directories
mkdir -p data/raw/lanl data/raw/cert data/processed data/models logs

# Place datasets in data/raw/
```

#### Step 4: Preprocess Data

```bash
python scripts/preprocess_data.py --dataset lanl --output data/processed
```

#### Step 5: Train Models

```bash
python scripts/train_models.py --config config/config.yaml
```

#### Step 6: Start Dashboard

```bash
python app/main.py
```

---

## Configuration

### Configuration File

Edit `config/config.yaml` to customize:

- Dataset paths
- Model parameters
- Risk weights
- Response thresholds
- Dashboard settings

### Key Settings

```yaml
datasets:
  lanl:
    path: "data/raw/lanl"
  
models:
  behavioral:
    type: "lstm"
    epochs: 50
    
risk:
  weights:
    behavioral: 0.35
    temporal: 0.20
    
dashboard:
  host: "0.0.0.0"
  port: 5000
```

---

## Data Preparation

### LANL Dataset

1. Download from: https://csr.lanl.gov/data/cyber1/
2. Extract `auth.txt` to `data/raw/lanl/auth.txt`
3. Run preprocessing: `python scripts/preprocess_data.py --dataset lanl`

### CERT Dataset

1. Download from: https://www.cert.org/insider-threat-tools/
2. Extract to `data/raw/cert/`
3. Run preprocessing: `python scripts/preprocess_data.py --dataset cert`

---

## Training Workflow

### 1. Preprocess Data

```bash
python scripts/preprocess_data.py \
  --dataset lanl \
  --output data/processed \
  --max-rows 100000  # Optional: limit for testing
```

### 2. Train Global Model

```bash
python scripts/train_models.py \
  --config config/config.yaml \
  --data data/processed/sequences \
  --output data/models
```

### 3. Train Per-User Models (Optional)

```bash
python scripts/train_models.py \
  --config config/config.yaml \
  --data data/processed/sequences \
  --output data/models \
  --per-user
```

---

## Evaluation

### Run Evaluation

```bash
python scripts/evaluate.py \
  --model data/models/behavioral_model.h5 \
  --test-data data/processed/processed_features.csv \
  --output results
```

### View Results

Results are saved to `results/evaluation_results.txt`

---

## Usage

### Dashboard

1. Start system: `python app/main.py` or `docker-compose up`
2. Open browser: http://localhost:5000
3. View:
   - Detection statistics
   - Recent detections
   - Risk scores
   - Explanations

### API Endpoints

- `GET /api/health` - Health check
- `GET /api/detections` - List detections
- `GET /api/stats` - Statistics
- `GET /api/detection/<session_id>` - Detection details

---

## Troubleshooting

### Common Issues

1. **Import Errors**
   - Ensure virtual environment is activated
   - Check Python version (3.9+)
   - Reinstall dependencies: `pip install -r requirements.txt`

2. **Dataset Not Found**
   - Verify dataset paths in `config/config.yaml`
   - Check file permissions
   - Ensure datasets are extracted correctly

3. **Out of Memory**
   - Reduce `--max-rows` in preprocessing
   - Use smaller batch sizes in training
   - Increase system RAM

4. **Model Training Slow**
   - Reduce model complexity (hidden_dim, num_layers)
   - Use GPU if available (requires TensorFlow GPU)
   - Reduce epochs for testing

5. **Dashboard Not Loading**
   - Check port 5000 is available
   - Verify logs for errors
   - Check firewall settings

---

## Production Considerations

### Security

- **Authentication**: Add authentication to dashboard
- **Encryption**: Use HTTPS for dashboard
- **Access Control**: Restrict access to API endpoints
- **Audit Logging**: Review audit logs regularly

### Performance

- **Scaling**: Use load balancer for multiple instances
- **Caching**: Implement caching for frequent queries
- **Database**: Use database instead of file-based storage
- **Streaming**: Implement stream processing for real-time

### Monitoring

- **Health Checks**: Monitor `/api/health` endpoint
- **Logs**: Centralize logging
- **Metrics**: Track detection rates, false positives
- **Alerts**: Set up alerts for system failures

---

## Support

For issues or questions:

1. Check documentation: `docs/`
2. Review logs: `logs/itdr.log`
3. Check configuration: `config/config.yaml`

---

## References

- Architecture: `docs/architecture.md`
- Algorithms: `docs/algorithms.md`
- Datasets: `docs/datasets.md`
- Evaluation: `docs/evaluation.md`

