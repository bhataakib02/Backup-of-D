"""
Kaggle Training Script for ITDR System
Use this script in a Kaggle Notebook to train models on GPU

Setup:
1. Upload preprocessed data to Kaggle as a dataset
2. Create a new Kaggle Notebook
3. Add your dataset to the notebook
4. Enable GPU accelerator
5. Copy this code into the notebook
6. Run!
"""

import pandas as pd
import numpy as np
import pickle
import json
import os
from pathlib import Path
import tensorflow as tf
from tensorflow import keras
from tensorflow.keras import layers

# Kaggle paths
INPUT_PATH = Path('/kaggle/input')
OUTPUT_PATH = Path('/kaggle/working')

print("=" * 50)
print("ITDR System - Kaggle Training")
print("=" * 50)

# Configuration
DATASET_NAME = 'itdr-lanl-processed'  # Change this to your dataset name
SEQUENCE_LENGTH = 50
HIDDEN_DIM = 128
NUM_LAYERS = 2
DROPOUT = 0.2
EMBEDDING_DIM = 64
EPOCHS = 50
BATCH_SIZE = 32
VALIDATION_SPLIT = 0.2

# Load sequences
print("\n[1/4] Loading sequences...")
data_dir = INPUT_PATH / DATASET_NAME
sequences_dir = data_dir / 'sequences'

if not sequences_dir.exists():
    print(f"ERROR: Sequences directory not found at {sequences_dir}")
    print(f"Available directories: {list(data_dir.glob('*')) if data_dir.exists() else 'Dataset not found'}")
    raise FileNotFoundError(f"Sequences directory not found. Please check dataset name: {DATASET_NAME}")

user_sequences = {}
sequence_count = 0

for seq_file in sequences_dir.glob('*_sequences.npy'):
    user_id = seq_file.stem.replace('_sequences', '')
    sequences = np.load(seq_file)
    user_sequences[user_id] = sequences
    sequence_count += len(sequences)
    print(f"  Loaded {len(sequences)} sequences for user {user_id}")

print(f"Total sequences loaded: {sequence_count}")

if not user_sequences:
    print("ERROR: No sequences found!")
    raise ValueError("No sequences found in dataset")

# Combine sequences
print("\n[2/4] Preparing training data...")
all_sequences = []
for user_id, seqs in user_sequences.items():
    all_sequences.append(seqs)

X_train = np.vstack(all_sequences)
print(f"Training data shape: {X_train.shape}")
print(f"  - Samples: {X_train.shape[0]}")
print(f"  - Sequence length: {X_train.shape[1]}")
print(f"  - Features: {X_train.shape[2]}")

# Determine dimensions
sequence_length = X_train.shape[1]
feature_dim = X_train.shape[2]

# Build model
print("\n[3/4] Building model...")
def build_behavioral_model(seq_len, feat_dim, hidden_dim, num_layers, dropout, embedding_dim):
    """Build LSTM-based behavioral model"""
    inputs = keras.Input(shape=(seq_len, feat_dim), name='input_sequence')
    
    x = inputs
    
    # Encoder: Stacked LSTM layers
    for i in range(num_layers):
        return_sequences = (i < num_layers - 1)
        x = layers.LSTM(
            hidden_dim,
            return_sequences=return_sequences,
            name=f'lstm_{i+1}'
        )(x)
        x = layers.Dropout(dropout, name=f'dropout_{i+1}')(x)
    
    # Embedding
    embedding = layers.Dense(embedding_dim, activation='relu', name='behavioral_embedding')(x)
    
    # Decoder: Reconstruct sequence
    reconstructed = layers.RepeatVector(seq_len)(embedding)
    for i in range(num_layers - 1, -1, -1):
        reconstructed = layers.LSTM(
            hidden_dim,
            return_sequences=True,
            name=f'decoder_lstm_{i+1}'
        )(reconstructed)
        reconstructed = layers.Dropout(dropout)(reconstructed)
    
    output = layers.TimeDistributed(
        layers.Dense(feat_dim, activation='linear'),
        name='reconstructed_sequence'
    )(reconstructed)
    
    model = keras.Model(inputs=inputs, outputs=[embedding, output], name='behavioral_model')
    
    return model

model = build_behavioral_model(
    sequence_length, feature_dim,
    HIDDEN_DIM, NUM_LAYERS, DROPOUT, EMBEDDING_DIM
)

model.compile(
    optimizer=keras.optimizers.Adam(learning_rate=0.001),
    loss={
        'behavioral_embedding': 'mse',
        'reconstructed_sequence': 'mse'
    },
    loss_weights={
        'behavioral_embedding': 0.0,
        'reconstructed_sequence': 1.0
    },
    metrics=['mae']
)

print(f"Model parameters: {model.count_params():,}")

# Callbacks
callbacks = [
    keras.callbacks.EarlyStopping(
        monitor='val_loss',
        patience=10,
        restore_best_weights=True,
        verbose=1
    ),
    keras.callbacks.ReduceLROnPlateau(
        monitor='val_loss',
        factor=0.5,
        patience=5,
        min_lr=1e-6,
        verbose=1
    ),
    keras.callbacks.ModelCheckpoint(
        filepath=str(OUTPUT_PATH / 'models' / 'checkpoint.h5'),
        monitor='val_loss',
        save_best_only=True,
        verbose=1
    )
]

# Create output directory
model_dir = OUTPUT_PATH / 'models'
model_dir.mkdir(exist_ok=True)

# Train model
print("\n[4/4] Training model...")
print(f"Training on {len(X_train)} sequences")
print(f"Epochs: {EPOCHS}, Batch size: {BATCH_SIZE}")
print(f"GPU Available: {len(tf.config.list_physical_devices('GPU')) > 0}")

history = model.fit(
    X_train,
    {'behavioral_embedding': X_train[:, -1, :], 'reconstructed_sequence': X_train},
    validation_split=VALIDATION_SPLIT,
    epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    callbacks=callbacks,
    verbose=1
)

# Save final model
final_model_path = model_dir / 'behavioral_model.h5'
model.save(final_model_path)
print(f"\n✓ Model saved to {final_model_path}")

# Save training history
history_path = model_dir / 'training_history.json'
with open(history_path, 'w') as f:
    # Convert numpy types to native Python types for JSON
    history_dict = {k: [float(val) for val in v] for k, v in history.history.items()}
    json.dump(history_dict, f, indent=2)
print(f"✓ Training history saved to {history_path}")

# Print summary
print("\n" + "=" * 50)
print("Training Complete!")
print("=" * 50)
print(f"Final validation loss: {min(history.history['val_loss']):.6f}")
print(f"Model saved to: {final_model_path}")
print(f"\nNext steps:")
print("1. Download model from Kaggle Output tab")
print("2. Place in data/models/ on local machine")
print("3. Use with dashboard: python app/main.py")

