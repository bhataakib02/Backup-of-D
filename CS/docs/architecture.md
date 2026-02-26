# ITDR System Architecture

**Document Version:** 1.0  
**Date:** 2024  
**Purpose:** Comprehensive architecture documentation for final-year project defense

---

## 1. Problem Statement

Enterprise identity security faces increasing challenges from:

1. **Account Takeover (ATO)**: Credential compromise leading to unauthorized access
2. **Insider Threats**: Legitimate users engaging in malicious activities
3. **Privilege Escalation**: Unauthorized access to higher-privilege resources
4. **Lateral Movement**: Attackers moving through networks using compromised identities

Traditional rule-based security controls are insufficient against sophisticated attacks. **Behavioral analytics** combined with **explainable AI** provide a proactive approach to identity threat detection.

---

## 2. Research Gap

Existing identity security solutions:

- **Rule-based systems**: High false positive rates, require manual tuning
- **Black-box ML models**: Lack explainability, difficult to audit
- **Single-factor detection**: Miss complex multi-stage attacks
- **Post-incident focus**: Reactive rather than proactive

**Our Contribution**: An explainable, behavioral-analytics-based ITDR system that:
- Learns per-user behavioral baselines
- Provides human-interpretable risk explanations
- Maps detections to MITRE ATT&CK framework
- Implements Zero Trust principles

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    ITDR System Architecture                  │
└─────────────────────────────────────────────────────────────┘

┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│   Dataset    │─────▶│  Ingestion   │─────▶│ Preprocessing│
│  (LANL/CERT) │      │    Layer     │      │    Pipeline  │
└──────────────┘      └──────────────┘      └──────────────┘
                                                        │
                                                        ▼
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  Dashboard   │◀─────│   Response   │◀─────│ Risk Scoring │
│  & API       │      │    Engine    │      │    Engine    │
└──────────────┘      └──────────────┘      └──────────────┘
       │                      │                      │
       │                      │                      │
       └──────────────────────┼──────────────────────┘
                              │
                              ▼
                    ┌──────────────┐
                    │ Explainability│
                    │    Module     │
                    └──────────────┘
                              │
                              ▼
                    ┌──────────────┐
                    │   Detection  │
                    │    Engine    │
                    └──────────────┘
                              │
                              ▼
                    ┌──────────────┐
                    │  Behavioral  │
                    │   Modeling   │
                    │  (LSTM/GRU)  │
                    └──────────────┘
```

### 3.2 Component Details

#### 3.2.1 Data Ingestion Layer

**Purpose**: Normalize and ingest authentication/access logs from multiple sources.

**Inputs**:
- LANL authentication logs
- CERT user activity logs
- Windows Event Logs (simulated)
- Linux authentication logs

**Outputs**:
- Normalized event stream
- User session windows
- Temporal sequences

**Key Functions**:
- Log parsing (multiple formats)
- Event normalization
- Session identification
- Temporal windowing

#### 3.2.2 Preprocessing & Feature Engineering

**Features Extracted**:

1. **Temporal Features**:
   - Login time (hour, day of week)
   - Session duration
   - Time since last login
   - Login frequency patterns

2. **Location Features**:
   - Source IP address
   - IP geolocation (country, city)
   - IP change frequency
   - New IP detection

3. **Behavioral Features**:
   - Devices/hosts accessed
   - Resource access patterns
   - Privilege usage frequency
   - Command/action sequences

4. **Anomaly Indicators**:
   - Impossible travel (time-distance inconsistency)
   - Unusual access patterns
   - Privilege escalation attempts
   - Lateral movement indicators

**Feature Representation**:
- Sequential: Time-series sequences for LSTM/GRU
- Categorical: One-hot encoded for discrete features
- Numerical: Normalized continuous features

#### 3.2.3 Behavioral Modeling

**Architecture**: LSTM/GRU networks for sequence modeling

**Model Type**: Per-user behavioral baseline

**Input**: 
- Sequence of behavioral events: `[e_1, e_2, ..., e_t]`
- Each event: Feature vector `f_i ∈ R^d`

**Output**:
- Behavioral embedding: `h_t ∈ R^h`
- Reconstruction error (for autoencoder variant)
- Next-event prediction probability

**Training**:
- Learn normal behavior patterns per user
- Sliding window approach (e.g., 30-day windows)
- Separate models for different user roles

**Mathematical Formulation**:

For LSTM:
```
i_t = σ(W_i · [h_{t-1}, f_t] + b_i)     # Input gate
f_t = σ(W_f · [h_{t-1}, f_t] + b_f)     # Forget gate
C_t = f_t ⊙ C_{t-1} + i_t ⊙ tanh(W_C · [h_{t-1}, f_t] + b_C)
o_t = σ(W_o · [h_{t-1}, f_t] + b_o)     # Output gate
h_t = o_t ⊙ tanh(C_t)
```

Where:
- `h_t`: Hidden state (behavioral representation)
- `C_t`: Cell state
- `f_t`: Input feature vector at time t
- `σ`: Sigmoid activation

#### 3.2.4 Anomaly Detection Engine

**Methods**:
1. **Reconstruction Error** (Autoencoder):
   - Train autoencoder on normal behavior
   - High reconstruction error → anomaly

2. **Isolation Forest**:
   - Unsupervised anomaly detection
   - Fast, handles high-dimensional data

3. **Statistical Thresholds**:
   - Z-score based deviation
   - Percentile-based thresholds

**Anomaly Score**:
```
anomaly_score(session) = α · reconstruction_error + β · isolation_score + γ · statistical_deviation
```

Where `α + β + γ = 1` (tunable weights)

#### 3.2.5 Risk Scoring Engine

**Risk Score Formula**:

```
Risk_Score = w_1 · R_behavioral + w_2 · R_temporal + w_3 · R_privilege + w_4 · R_location + w_5 · R_mitre
```

**Components**:

1. **Behavioral Risk (R_behavioral)**:
   - Deviation from learned baseline
   - Sequence anomaly score
   - Range: [0, 1]

2. **Temporal Risk (R_temporal)**:
   - Unusual login times
   - Impossible travel detection
   - Range: [0, 1]

3. **Privilege Risk (R_privilege)**:
   - Privilege escalation attempts
   - Unusual privilege usage
   - Range: [0, 1]

4. **Location Risk (R_location)**:
   - IP address changes
   - Geolocation anomalies
   - Range: [0, 1]

5. **MITRE ATT&CK Risk (R_mitre)**:
   - Tactics detected (Initial Access, Lateral Movement, etc.)
   - Technique matches
   - Range: [0, 1]

**Risk Levels**:
- **Low**: Risk_Score < 0.3
- **Medium**: 0.3 ≤ Risk_Score < 0.7
- **High**: Risk_Score ≥ 0.7

#### 3.2.6 MITRE ATT&CK Mapping

**Relevant Tactics**:

1. **TA0001 - Initial Access**:
   - Valid Accounts (T1078)
   - External Remote Services (T1133)

2. **TA0003 - Persistence**:
   - Account Manipulation (T1098)

3. **TA0008 - Lateral Movement**:
   - Valid Accounts (T1078)
   - Remote Services (T1021)

**Mapping Logic**:
- Pattern matching against ATT&CK techniques
- Behavioral indicators aligned with technique definitions
- Confidence scoring per technique

#### 3.2.7 Explainability Module

**Explainability Methods**:

1. **Feature Attribution**:
   - SHAP values (SHapley Additive exPlanations)
   - Gradient-based attribution
   - Attention weights (if using attention mechanisms)

2. **Behavioral Deviation Analysis**:
   - Comparison with baseline behavior
   - Highlighting anomalous features
   - Temporal evolution visualization

3. **Human-Readable Explanations**:
   - Template-based explanations
   - Natural language generation
   - Explanation confidence scores

**Explanation Template**:
```
Session Risk: HIGH (Score: 0.85)

Top Contributing Factors:
1. Behavioral Deviation (Contribution: 35%)
   - User logged in from new IP address (192.168.1.100)
   - Unusual access time (03:15 AM, typically 9 AM - 5 PM)
   
2. Privilege Escalation (Contribution: 30%)
   - Attempted access to admin resources
   - Unusual privilege usage pattern
   
3. MITRE ATT&CK: TA0001 - Initial Access (Contribution: 20%)
   - Technique T1078: Valid Accounts (Medium confidence)
   
4. Location Anomaly (Contribution: 15%)
   - IP geolocation changed (previous: US, current: EU)
   - Impossible travel detected (time-distance inconsistency)
```

#### 3.2.8 Response Engine

**Response Actions** (Risk-Adaptive):

1. **Monitor Only** (Risk < 0.3):
   - Log event
   - No action taken

2. **Alert Analyst** (0.3 ≤ Risk < 0.5):
   - Create alert
   - Notify security team
   - Log for review

3. **Force Re-authentication** (0.5 ≤ Risk < 0.7):
   - Require password re-entry
   - Session invalidation
   - Log action

4. **Step-up Authentication (MFA)** (0.7 ≤ Risk < 0.85):
   - Require multi-factor authentication
   - Additional verification step
   - Log action

5. **Temporary Account Disable** (Risk ≥ 0.85):
   - Disable account (simulated)
   - Require admin intervention
   - Full audit trail

**Response Principles**:
- Non-destructive by default
- Risk-adaptive thresholds
- Audit logging for all actions
- Manual override capability

---

## 4. Data Flow

### 4.1 Training Phase

```
Raw Dataset → Preprocessing → Feature Engineering → Behavioral Model Training → Model Persistence
```

### 4.2 Detection Phase

```
New Event → Preprocessing → Feature Extraction → Behavioral Model Inference → Anomaly Detection 
→ Risk Scoring → MITRE Mapping → Explainability → Response Decision → Dashboard/Audit Log
```

---

## 5. Zero Trust Principles

1. **Never Trust, Always Verify**: Every session is evaluated
2. **Least Privilege**: Monitor privilege usage patterns
3. **Assume Breach**: Detect anomalies, not just known threats
4. **Continuous Monitoring**: Real-time risk assessment
5. **Explicit Verification**: Risk-adaptive authentication

---

## 6. Scalability Considerations

- **Model Serving**: Batch inference for efficiency
- **Streaming**: Real-time processing for critical events
- **Storage**: Efficient feature storage and retrieval
- **Caching**: Behavioral baseline caching per user

---

## 7. Limitations & Future Work

**Current Limitations**:
- Single-machine deployment (student laptop constraint)
- Limited dataset diversity
- Model retraining frequency (batch updates)

**Future Enhancements**:
- Distributed processing
- Online learning (incremental model updates)
- Multi-dataset ensemble models
- Integration with SIEM systems

---

## 8. References

- MITRE ATT&CK Framework: https://attack.mitre.org/
- Zero Trust Architecture: NIST SP 800-207
- LANL Cyber Security Dataset
- CERT Insider Threat Dataset

