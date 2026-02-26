# Algorithm Documentation

## Behavioral Modeling

### LSTM Architecture

The behavioral model uses Long Short-Term Memory (LSTM) networks to learn user behavior patterns.

**Architecture**:
- Input: Sequences of behavioral features (length: 50, dimension: variable)
- Encoder: Stacked LSTM layers (default: 2 layers, 128 hidden units)
- Embedding: Dense layer (64 dimensions)
- Decoder: LSTM layers for reconstruction
- Output: Reconstructed sequence

**Training**:
- Objective: Minimize reconstruction error (MSE)
- Optimizer: Adam (learning rate: 0.001)
- Batch size: 32 (global) or 16 (per-user)
- Epochs: 50 (global) or 30 (per-user)

**Mathematical Formulation**:

For input sequence `X = [x_1, x_2, ..., x_T]`:

LSTM cell at time t:
```
i_t = σ(W_i · [h_{t-1}, x_t] + b_i)      # Input gate
f_t = σ(W_f · [h_{t-1}, x_t] + b_f)      # Forget gate
C_t = f_t ⊙ C_{t-1} + i_t ⊙ tanh(W_C · [h_{t-1}, x_t] + b_C)
o_t = σ(W_o · [h_{t-1}, x_t] + b_o)      # Output gate
h_t = o_t ⊙ tanh(C_t)
```

Reconstruction error:
```
E = (1/T) · Σ ||x_t - x̂_t||²
```

Anomaly score:
```
S_anomaly = sigmoid((E - μ_E) / σ_E)
```

Where `μ_E` and `σ_E` are mean and standard deviation of reconstruction errors for normal behavior.

---

## Risk Scoring

### Multi-Factor Risk Computation

Overall risk score:
```
R_total = w_1·R_behavioral + w_2·R_temporal + w_3·R_location + w_4·R_privilege + w_5·R_mitre
```

**Component Risks**:

1. **Behavioral Risk (R_behavioral)**:
   - Based on reconstruction error from behavioral model
   - Normalized against user baseline
   - Range: [0, 1]

2. **Temporal Risk (R_temporal)**:
   - Unusual login times (off-hours)
   - Weekend logins
   - Time since last login anomalies
   - Range: [0, 1]

3. **Location Risk (R_location)**:
   - IP address changes
   - New IP detection
   - Impossible travel detection
   - IP frequency (rare IPs)
   - Range: [0, 1]

4. **Privilege Risk (R_privilege)**:
   - Privilege escalation attempts
   - Unusual privilege usage
   - Range: [0, 1]

5. **MITRE ATT&CK Risk (R_mitre)**:
   - Technique match scores
   - Tactic aggregation
   - Range: [0, 1]

**Default Weights**:
- w_1 = 0.35 (behavioral)
- w_2 = 0.20 (temporal)
- w_3 = 0.15 (location)
- w_4 = 0.25 (privilege)
- w_5 = 0.05 (MITRE)

---

## Feature Engineering

### Temporal Features

- Hour of day (sine/cosine encoding)
- Day of week (sine/cosine encoding)
- Weekend indicator
- Time since last login (hours)
- Session duration (minutes)

### Location Features

- IP change indicator
- New IP indicator
- Unique IP count (rolling window)
- IP frequency (normalized)
- Impossible travel flag

### Behavioral Features

- Unique hosts count (rolling window)
- Host frequency (normalized)
- Login frequency (logins per day)
- Average logins per day (rolling average)
- Privilege score

### Sequence Creation

Sequences are created using sliding windows:
- Window length: 50 events (configurable)
- Step size: 1 event
- Padding: Zero-padding for short sequences

---

## MITRE ATT&CK Mapping

### Technique Detection

Techniques are detected based on feature patterns:

**T1078 (Valid Accounts)**:
- Indicators: New IP, IP change, impossible travel
- Confidence: Based on number of indicators matched

**T1133 (External Remote Services)**:
- Indicators: External IP access, VPN usage
- Confidence: Based on location features

**T1098 (Account Manipulation)**:
- Indicators: Privilege escalation
- Confidence: Based on privilege score

**T1021 (Remote Services)**:
- Indicators: Multiple host access, lateral movement
- Confidence: Based on host access patterns

### Tactic Aggregation

Tactic scores are computed as:
```
R_tactic = max(R_technique_1, R_technique_2, ...)
```

Where `R_technique_i` are scores for techniques belonging to the tactic.

---

## Response Engine

### Risk-Adaptive Responses

Response actions are selected based on risk thresholds:

| Risk Score | Action | Severity |
|------------|--------|----------|
| < 0.3 | Monitor Only | 0 |
| 0.3 - 0.5 | Alert Analyst | 1 |
| 0.5 - 0.7 | Force Re-authentication | 2 |
| 0.7 - 0.85 | Step-up MFA | 3 |
| 0.85 - 0.95 | Temporary Account Disable | 4 |
| ≥ 0.95 | Critical Response | 4 |

---

## Evaluation Metrics

### Detection Metrics

- **Precision**: TP / (TP + FP)
- **Recall**: TP / (TP + FN)
- **F1-Score**: 2 · (Precision · Recall) / (Precision + Recall)
- **False Positive Rate**: FP / (FP + TN)

### Risk Score Metrics

- **Calibration**: Risk score distribution for anomalies vs. normal
- **Detection Latency**: Time from event to detection

---

## References

- Hochreiter, S., & Schmidhuber, J. (1997). Long short-term memory. Neural computation, 9(8), 1735-1780.
- MITRE ATT&CK Framework: https://attack.mitre.org/
- Zero Trust Architecture: NIST SP 800-207

