# Dataset Preparation Guide

## Overview

The ITDR system supports real-world security datasets for training and evaluation:

- **LANL Cyber Security Dataset**: Authentication logs
- **CERT Insider Threat Dataset**: User activity logs

---

## LANL Dataset

### Download

1. Visit: https://csr.lanl.gov/data/cyber1/
2. Download authentication logs (`auth.txt`)
3. Extract to `data/raw/lanl/auth.txt`

### Format

LANL authentication logs contain:
- Timestamp (Unix epoch)
- Source user@domain
- Destination user@domain
- Source computer
- Destination computer
- Authentication type
- Logon type
- Authentication orientation
- Success/Failure

### Preprocessing

```bash
python scripts/preprocess_data.py --dataset lanl --output data/processed
```

---

## CERT Dataset

### Download

1. Visit: https://www.cert.org/insider-threat-tools/
2. Download CERT Insider Threat Dataset v6.2
3. Extract to `data/raw/cert/`
4. Expected structure:
   ```
   data/raw/cert/
   ├── logon.csv
   ├── file.csv
   ├── email.csv
   └── ...
   ```

### Format

CERT dataset contains:
- Login/logout events
- File access logs
- Email activity
- Device usage

### Preprocessing

```bash
python scripts/preprocess_data.py --dataset cert --output data/processed
```

---

## Combined Dataset

To use both datasets:

```bash
python scripts/preprocess_data.py --dataset both --output data/processed
```

---

## Dataset Requirements

- **Minimum size**: 10,000 events (for basic training)
- **Recommended**: 100,000+ events (for robust models)
- **Time range**: At least 30 days of data (for temporal patterns)

---

## Notes

- Datasets must be placed in `data/raw/` before preprocessing
- Processed data will be saved to `data/processed/`
- Preprocessing may take several minutes for large datasets
- Ensure sufficient disk space (processed data may be 2-3x original size)

---

## Academic Use

These datasets are publicly available for research purposes. Please cite:

- **LANL**: Kent, A. D. (2016). Comprehensive, Multi-Source Cyber-Security Events. Los Alamos National Laboratory.
- **CERT**: Glasser, J., & Lindauer, B. (2013). Bridging the gap: A pragmatic approach to generating insider threat data. IEEE Security and Privacy Workshops.

