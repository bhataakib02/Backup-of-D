# Training on Kaggle

## Overview

Kaggle provides free GPU/TPU resources, which can significantly speed up model training. This guide explains how to adapt the ITDR system for Kaggle.

---

## Benefits of Kaggle

- **Free GPU/TPU access** (30+ hours/week)
- **Faster training** (especially for LSTM models)
- **No local resource constraints**
- **Easy dataset management**

---

## Option 1: Complete Training on Kaggle (Recommended)

### Step 1: Prepare Kaggle Dataset

1. **Create a Kaggle Dataset**:
   - Go to https://www.kaggle.com/datasets
   - Click "New Dataset"
   - Upload `auth.txt` (or compressed version)
   - Name it (e.g., "lanl-auth-log")

2. **Alternative: Use Public Datasets**:
   - Search for "LANL cyber security" on Kaggle
   - May already have processed versions

### Step 2: Create Kaggle Notebook

1. Go to https://www.kaggle.com/code
2. Click "New Notebook"
3. Set:
   - **Language**: Python
   - **Accelerator**: GPU (TPU P100 or T4)

### Step 3: Upload Code to Kaggle

**Option A: Upload as Dataset**
1. Zip your `src/` directory
2. Create a dataset with the code
3. Add dataset to notebook

**Option B: Copy code directly**
1. Copy-paste code into notebook cells
2. Organize into cells

### Step 4: Adapt Code for Kaggle

Create a Kaggle-ready training script:

```python
# Kaggle environment setup
import os
import sys
import pandas as pd
import numpy as np

# Set paths for Kaggle
INPUT_PATH = '/kaggle/input'
OUTPUT_PATH = '/kaggle/working'

# Add your code directory to path
if '/kaggle/input/itdr-code' in os.listdir(INPUT_PATH):
    sys.path.insert(0, '/kaggle/input/itdr-code/src')

# Import your modules (after uploading)
from ingestion.lanl_loader import load_lanl_dataset
from preprocessing.feature_engineer import FeatureEngineer
from modeling.behavioral_model import BehavioralModel
```

### Step 5: Update Paths

- Dataset: `/kaggle/input/your-dataset-name/auth.txt`
- Output: `/kaggle/working/models/`
- Config: Copy `config.yaml` or hardcode settings

---

## Option 2: Preprocess Locally, Train on Kaggle

### Step 1: Preprocess Locally (Current Setup)

Continue with your current preprocessing:
```bash
python scripts/preprocess_data.py --dataset lanl --output data/processed --max-rows 1000000
```

### Step 2: Upload Preprocessed Data to Kaggle

1. Create a Kaggle dataset with:
   - `processed_features.csv`
   - `preprocessors.pkl`
   - `sequences/` folder (or zip it)

2. Create dataset: "itdr-processed-data"

### Step 3: Training Notebook on Kaggle

```python
# Install dependencies
!pip install tensorflow==2.13.0 pandas numpy scikit-learn

# Load preprocessed data
import pandas as pd
import numpy as np
import pickle

INPUT_PATH = '/kaggle/input/itdr-processed-data'

# Load features
df = pd.read_csv(f'{INPUT_PATH}/processed_features.csv')

# Load sequences
import os
sequences = {}
for file in os.listdir(f'{INPUT_PATH}/sequences'):
    if file.endswith('_sequences.npy'):
        user_id = file.replace('_sequences.npy', '')
        sequences[user_id] = np.load(f'{INPUT_PATH}/sequences/{file}')

# Load preprocessors
with open(f'{INPUT_PATH}/preprocessors.pkl', 'rb') as f:
    preprocessors = pickle.load(f)

# Training code (from your scripts/train_models.py)
from tensorflow import keras
from tensorflow.keras import layers

# Build and train model
# ... (your training code)
```

---

## Recommended Approach: Hybrid

1. **Preprocess locally** (smaller, faster, no GPU needed)
2. **Train on Kaggle** (GPU-accelerated)

### Quick Setup Script for Kaggle

Create `kaggle_train.py`:

```python
"""
Kaggle Training Script for ITDR System
Upload preprocessed data and run this notebook
"""

import pandas as pd
import numpy as np
import pickle
import os
from pathlib import Path

# Kaggle paths
INPUT_PATH = Path('/kaggle/input')
OUTPUT_PATH = Path('/kaggle/working')

# Load preprocessed data
data_dir = INPUT_PATH / 'itdr-lanl-processed'  # Your dataset name
sequences_dir = data_dir / 'sequences'

# Load sequences
print("Loading sequences...")
user_sequences = {}
for seq_file in sequences_dir.glob('*_sequences.npy'):
    user_id = seq_file.stem.replace('_sequences', '')
    sequences = np.load(seq_file)
    user_sequences[user_id] = sequences
    print(f"Loaded {len(sequences)} sequences for user {user_id}")

# Combine sequences for training
all_sequences = []
for user_id, seqs in user_sequences.items():
    all_sequences.append(seqs)

X_train = np.vstack(all_sequences)
print(f"Total training sequences: {len(X_train)}")

# Build model (simplified - adjust based on your BehavioralModel class)
from tensorflow import keras
from tensorflow.keras import layers

sequence_length = X_train.shape[1]
feature_dim = X_train.shape[2]

model = keras.Sequential([
    layers.LSTM(128, return_sequences=True, input_shape=(sequence_length, feature_dim)),
    layers.Dropout(0.2),
    layers.LSTM(128),
    layers.Dropout(0.2),
    layers.Dense(64, activation='relu'),
    layers.Dense(feature_dim, activation='linear')
])

model.compile(optimizer='adam', loss='mse', metrics=['mae'])

# Train
print("Starting training...")
history = model.fit(
    X_train, X_train,  # Autoencoder: reconstruct input
    validation_split=0.2,
    epochs=50,
    batch_size=32,
    verbose=1
)

# Save model
model_dir = OUTPUT_PATH / 'models'
model_dir.mkdir(exist_ok=True)
model.save(model_dir / 'behavioral_model.h5')
print(f"Model saved to {model_dir / 'behavioral_model.h5'}")

# Save training history
import json
with open(model_dir / 'training_history.json', 'w') as f:
    json.dump(history.history, f)

print("Training complete!")
```

---

## Step-by-Step: Upload Preprocessed Data to Kaggle

### 1. Prepare Data

```bash
# On your local machine
cd data/processed

# Create a zip of sequences (if too many files)
# Windows PowerShell:
Compress-Archive -Path sequences -DestinationPath sequences.zip

# Or compress entire processed folder
cd ..
Compress-Archive -Path processed -DestinationPath itdr_processed_data.zip
```

### 2. Upload to Kaggle

1. Go to https://www.kaggle.com/datasets
2. Click "New Dataset"
3. Upload:
   - `processed_features.csv` (or a sample)
   - `preprocessors.pkl`
   - `sequences.zip` (or individual files)
4. Name: "itdr-lanl-processed"
5. Make it **Private** (if using real data)

### 3. Create Training Notebook

1. New Notebook on Kaggle
2. Add dataset: "itdr-lanl-processed"
3. Enable GPU (T4 x2 or P100)
4. Copy training code
5. Run!

---

## Kaggle Notebook Template

```python
# Cell 1: Setup
import os
import pandas as pd
import numpy as np
from pathlib import Path

INPUT_PATH = Path('/kaggle/input/itdr-lanl-processed')
OUTPUT_PATH = Path('/kaggle/working')

# Cell 2: Load Data
# ... (loading code)

# Cell 3: Build Model
# ... (model architecture)

# Cell 4: Train
# ... (training code)

# Cell 5: Save Results
# Model will be saved to /kaggle/working/
# Download from Output tab
```

---

## Downloading Trained Model

After training on Kaggle:

1. Go to notebook Output tab
2. Download `behavioral_model.h5`
3. Place in `data/models/` on your local machine
4. Use for inference/dashboard

---

## Advantages

- **GPU Speed**: 10-100x faster than CPU
- **Free**: No cost for GPU hours
- **Scalable**: Can process larger datasets
- **Reproducible**: Easy to share notebooks

---

## Tips

1. **Start Small**: Test with 100K rows first
2. **Monitor GPU Usage**: Kaggle limits hours
3. **Save Checkpoints**: Use ModelCheckpoint callback
4. **Use TPU**: For even faster training (if available)
5. **Batch Size**: Larger batches work better on GPU

---

## Alternative: Google Colab

Similar process but with Google Colab:
- Free GPU (T4) with time limits
- Can mount Google Drive
- Easier file management

---

## Next Steps

1. **Decide**: Full Kaggle or hybrid (preprocess local, train Kaggle)
2. **Upload**: Preprocessed data or raw dataset
3. **Create**: Kaggle notebook with training code
4. **Train**: Run on GPU
5. **Download**: Trained model for local use

---

## References

- Kaggle Notebooks: https://www.kaggle.com/code
- Kaggle Datasets: https://www.kaggle.com/datasets
- GPU Limits: 30+ hours/week for verified accounts

