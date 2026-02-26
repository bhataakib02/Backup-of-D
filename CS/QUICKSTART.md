# ITDR System - Quick Start Guide

## 🚀 5-Minute Quick Start

### Step 1: Setup Environment

```bash
# Install Python dependencies
pip install -r requirements.txt

# Run setup script (creates directories)
python setup.py
```

### Step 2: Download Datasets

**Option A: LANL Dataset**
1. Visit: https://csr.lanl.gov/data/cyber1/
2. Download `auth.txt`
3. Place in: `data/raw/lanl/auth.txt`

**Option B: CERT Dataset**
1. Visit: https://www.cert.org/insider-threat-tools/
2. Download CERT Insider Threat Dataset
3. Extract to: `data/raw/cert/`

### Step 3: Preprocess Data

```bash
# For LANL
python scripts/preprocess_data.py --dataset lanl --output data/processed

# For CERT
python scripts/preprocess_data.py --dataset cert --output data/processed

# For both
python scripts/preprocess_data.py --dataset both --output data/processed
```

### Step 4: Train Models

```bash
python scripts/train_models.py --config config/config.yaml
```

**Note**: Training may take 30-60 minutes depending on dataset size and hardware.

### Step 5: Start Dashboard

```bash
python app/main.py
```

Open browser: **http://localhost:5000**

---

## 📋 What You'll See

### Dashboard Features

1. **Statistics Panel**
   - Total detections
   - High/Medium/Low risk counts
   - Recent activity

2. **Detection Table**
   - Recent detections
   - Risk scores and levels
   - Response actions taken

3. **Detection Details**
   - Click any detection for details
   - Explanation of risk factors
   - MITRE ATT&CK mapping
   - Contributing factors

---

## 🐳 Docker Alternative

### Quick Docker Deployment

```bash
# Build and run
docker-compose up --build

# Access dashboard
# http://localhost:5000
```

---

## ⚙️ Configuration

Edit `config/config.yaml` to customize:

- **Model parameters**: Architecture, epochs, batch size
- **Risk weights**: Adjust component risk weights
- **Response thresholds**: Modify risk-based responses
- **Feature settings**: Enable/disable features

---

## 📚 Next Steps

1. **Read Documentation**
   - `docs/architecture.md` - System design
   - `docs/algorithms.md` - Algorithm details
   - `docs/evaluation.md` - Evaluation methodology

2. **Customize System**
   - Adjust risk weights
   - Modify response thresholds
   - Add custom features

3. **Evaluate Performance**
   ```bash
   python scripts/evaluate.py --model data/models/behavioral_model.h5
   ```

---

## ❓ Troubleshooting

### Common Issues

**Import Errors**
```bash
pip install -r requirements.txt
```

**Dataset Not Found**
- Verify dataset paths in `config/config.yaml`
- Check file permissions
- Ensure files are extracted correctly

**Out of Memory**
- Reduce dataset size: `--max-rows 10000`
- Use smaller batch size in config
- Increase system RAM

**Training Slow**
- Reduce model complexity (hidden_dim, layers)
- Use fewer epochs for testing
- Consider GPU acceleration (TensorFlow GPU)

---

## 📖 Full Documentation

- **Architecture**: `docs/architecture.md`
- **Algorithms**: `docs/algorithms.md`
- **Evaluation**: `docs/evaluation.md`
- **Research**: `docs/research.md`
- **Deployment**: `docs/deployment.md`
- **Datasets**: `docs/datasets.md`

---

## ✅ Verification Checklist

- [ ] Python 3.9+ installed
- [ ] Dependencies installed (`pip install -r requirements.txt`)
- [ ] Datasets downloaded and placed in `data/raw/`
- [ ] Data preprocessed (`scripts/preprocess_data.py`)
- [ ] Models trained (`scripts/train_models.py`)
- [ ] Dashboard running (`python app/main.py`)
- [ ] Dashboard accessible at http://localhost:5000

---

## 🎓 For Academic Use

This system is designed for:
- Final-year university projects
- Security research
- Industry evaluation

All components are:
- Real-world realistic
- Well-documented
- Defendable in viva
- Reproducible

---

**Ready to start? Run the setup script and follow the steps above!**

