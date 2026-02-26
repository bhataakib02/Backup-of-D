# API Documentation

## Overview

The AI/ML Cybersecurity Platform provides a comprehensive REST API for all security functions. The API is built with Flask and follows RESTful principles.

## Base URL

```
http://localhost:5000/api
```

## Authentication

All API endpoints require authentication using JWT tokens.

### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "username": "admin",
  "password": "password"
}
```

**Response:**
```json
{
  "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "email": "admin@example.com",
    "role": "admin"
  }
}
```

### Using the Token

Include the token in the Authorization header:

```http
Authorization: Bearer <your-token>
```

## Phishing Detection API

### URL Analysis

```http
POST /api/phishing/detect/url
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://suspicious-site.com"
}
```

**Response:**
```json
{
  "prediction": "Phishing",
  "confidence": 0.85,
  "is_phishing": true,
  "risk_score": 0.8,
  "suspicious_features": [
    "Long URL",
    "Suspicious keywords",
    "Invalid SSL certificate"
  ],
  "explanation": "URL contains multiple phishing indicators",
  "mitigation_suggestions": [
    "Block domain",
    "Warn users",
    "Update threat intelligence"
  ]
}
```

### Email Analysis

```http
POST /api/phishing/detect/email/text
Authorization: Bearer <token>
Content-Type: application/json

{
  "email_text": "Click here to verify your account...",
  "subject": "Urgent: Account Verification",
  "sender": "security@bank.com"
}
```

**Response:**
```json
{
  "prediction": "Phishing",
  "confidence": 0.92,
  "is_phishing": true,
  "risk_score": 0.9,
  "suspicious_features": [
    "Urgent language",
    "Suspicious sender",
    "Suspicious keywords"
  ],
  "explanation": "Email contains multiple phishing indicators",
  "mitigation_suggestions": [
    "Mark as spam",
    "Block sender",
    "Educate users"
  ]
}
```

### Email File Upload

```http
POST /api/phishing/detect/email/file
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <email-file.eml>
```

## Malware Analysis API

### File Upload

```http
POST /api/malware/analyze-file
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <malware-file.exe>
```

**Response:**
```json
{
  "prediction": "Malware",
  "confidence": 0.88,
  "is_malware": true,
  "malware_family": "Trojan",
  "malware_type": "Banking Trojan",
  "risk_score": 0.9,
  "static_analysis": {
    "entropy": 7.8,
    "suspicious_strings": 15,
    "yara_matches": 3
  },
  "dynamic_analysis": {
    "sandbox_result": "Suspicious behavior detected",
    "network_connections": 5,
    "file_modifications": 12
  },
  "mitigation_suggestions": [
    "Quarantine file",
    "Scan system",
    "Update antivirus"
  ]
}
```

### Hash Analysis

```http
POST /api/malware/analyze-hash
Authorization: Bearer <token>
Content-Type: application/json

{
  "file_hash": "a1b2c3d4e5f6789012345678901234567890abcdef",
  "hash_type": "sha256"
}
```

### PE Header Analysis

```http
POST /api/malware/pe-header
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <executable-file.exe>
```

## IDS Detection API

### PCAP Analysis

```http
POST /api/ids/analyze-pcap
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <network-traffic.pcap>
```

**Response:**
```json
{
  "prediction": "Intrusion",
  "confidence": 0.75,
  "is_intrusion": true,
  "attack_types": ["DoS", "Brute Force"],
  "risk_score": 0.8,
  "network_features": {
    "packet_count": 1500,
    "unique_ips": 25,
    "suspicious_ports": 3
  },
  "attack_detections": [
    {
      "attack_type": "DoS",
      "confidence": 0.8,
      "source_ip": "192.168.1.100",
      "description": "High packet rate detected"
    }
  ],
  "mitigation_suggestions": [
    "Block source IP",
    "Rate limit connections",
    "Monitor network"
  ]
}
```

### Live Capture

```http
POST /api/ids/live-capture
Authorization: Bearer <token>
Content-Type: application/json

{
  "interface": "eth0",
  "duration": 60
}
```

### System Log Analysis

```http
POST /api/ids/analyze-system-logs
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <system-logs.log>
```

## Threat Intelligence API

### IP Reputation Check

```http
POST /api/threat-intel/check-ip
Authorization: Bearer <token>
Content-Type: application/json

{
  "ip_address": "192.168.1.100"
}
```

**Response:**
```json
{
  "ip_address": "192.168.1.100",
  "is_malicious": true,
  "reputation_score": 0.8,
  "threat_types": ["Botnet", "Malware"],
  "sources": ["VirusTotal", "AbuseIPDB"],
  "country": "US",
  "asn": "AS12345",
  "last_seen": "2024-01-15T10:30:00Z"
}
```

### Domain Reputation Check

```http
POST /api/threat-intel/check-domain
Authorization: Bearer <token>
Content-Type: application/json

{
  "domain": "suspicious-site.com"
}
```

### Hash Reputation Check

```http
POST /api/threat-intel/check-hash
Authorization: Bearer <token>
Content-Type: application/json

{
  "file_hash": "a1b2c3d4e5f6789012345678901234567890abcdef"
}
```

### IOC Extraction

```http
POST /api/threat-intel/extract-iocs
Authorization: Bearer <token>
Content-Type: application/json

{
  "text": "Malware connects to 192.168.1.100 and downloads from evil.com"
}
```

**Response:**
```json
{
  "ip_addresses": ["192.168.1.100"],
  "domains": ["evil.com"],
  "urls": [],
  "file_hashes": [],
  "email_addresses": []
}
```

## Ransomware Detection API

### File Entropy Monitoring

```http
POST /api/ransomware/monitor-entropy
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <suspicious-file>
```

### Bulk Operations Detection

```http
POST /api/ransomware/detect-bulk-operations
Authorization: Bearer <token>
Content-Type: application/json

{
  "operations": [
    {
      "type": "encrypt",
      "file_path": "/home/user/file1.txt",
      "timestamp": "2024-01-15T10:30:00Z"
    },
    {
      "type": "encrypt",
      "file_path": "/home/user/file2.txt",
      "timestamp": "2024-01-15T10:30:01Z"
    }
  ]
}
```

### Ransom Note Detection

```http
POST /api/ransomware/detect-ransom-notes
Authorization: Bearer <token>
Content-Type: multipart/form-data

file: <ransom-note.txt>
```

## Dashboard API

### Get Statistics

```http
GET /api/dashboard/stats
Authorization: Bearer <token>
```

**Response:**
```json
{
  "stats": {
    "total_alerts": 150,
    "critical_alerts": 5,
    "phishing_detected": 25,
    "malware_detected": 15,
    "intrusions_detected": 20,
    "threats_blocked": 100
  },
  "recent_alerts": [
    {
      "id": 1,
      "title": "Phishing Attack Detected",
      "description": "Suspicious email detected",
      "severity": "high",
      "timestamp": "2024-01-15T10:30:00Z"
    }
  ],
  "system_health": {
    "status": "healthy",
    "uptime": "99.9%",
    "response_time": "45ms"
  }
}
```

### Event Correlation

```http
POST /api/dashboard/correlate-events
Authorization: Bearer <token>
Content-Type: application/json

{
  "events": [
    {
      "id": "event1",
      "type": "phishing",
      "timestamp": "2024-01-15T10:30:00Z",
      "source_ip": "192.168.1.100"
    },
    {
      "id": "event2",
      "type": "malware",
      "timestamp": "2024-01-15T10:31:00Z",
      "source_ip": "192.168.1.100"
    }
  ]
}
```

### System Health

```http
GET /api/dashboard/system-health
Authorization: Bearer <token>
```

## Error Handling

All API endpoints return consistent error responses:

```json
{
  "error": "Error message",
  "code": "ERROR_CODE",
  "details": "Additional error details"
}
```

### Common Error Codes

- `AUTH_REQUIRED`: Authentication required
- `INVALID_TOKEN`: Invalid or expired token
- `INVALID_INPUT`: Invalid input data
- `FILE_TOO_LARGE`: File size exceeds limit
- `UNSUPPORTED_FORMAT`: Unsupported file format
- `RATE_LIMIT_EXCEEDED`: Rate limit exceeded
- `INTERNAL_ERROR`: Internal server error

## Rate Limiting

API endpoints are rate limited:

- **Authentication**: 5 requests per minute
- **Analysis endpoints**: 10 requests per second
- **Upload endpoints**: 5 requests per minute
- **General endpoints**: 100 requests per minute

Rate limit headers are included in responses:

```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642248000
```

## Pagination

List endpoints support pagination:

```http
GET /api/alerts?page=1&limit=20&sort=timestamp&order=desc
```

**Response:**
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8,
    "has_next": true,
    "has_prev": false
  }
}
```

## Webhooks

Configure webhooks for real-time notifications:

```http
POST /api/webhooks
Authorization: Bearer <token>
Content-Type: application/json

{
  "url": "https://your-app.com/webhook",
  "events": ["alert.created", "threat.detected"],
  "secret": "webhook-secret"
}
```

## SDKs

### Python SDK

```python
from cybersecurity_sdk import CybersecurityClient

client = CybersecurityClient(
    base_url="http://localhost:5000",
    api_key="your-api-key"
)

# Phishing detection
result = client.phishing.detect_url("https://suspicious-site.com")
print(f"Prediction: {result.prediction}")

# Malware analysis
result = client.malware.analyze_file("suspicious_file.exe")
print(f"Malware: {result.is_malware}")
```

### JavaScript SDK

```javascript
import { CybersecurityClient } from 'cybersecurity-sdk';

const client = new CybersecurityClient({
  baseUrl: 'http://localhost:5000',
  apiKey: 'your-api-key'
});

// Phishing detection
const result = await client.phishing.detectUrl('https://suspicious-site.com');
console.log(`Prediction: ${result.prediction}`);
```

## Testing

### Postman Collection

Import the Postman collection for easy API testing:

[Download Postman Collection](postman/cybersecurity-api.json)

### cURL Examples

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "password"}'

# Phishing detection
curl -X POST http://localhost:5000/api/phishing/detect/url \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://suspicious-site.com"}'

# File upload
curl -X POST http://localhost:5000/api/malware/analyze-file \
  -H "Authorization: Bearer <token>" \
  -F "file=@suspicious_file.exe"
```

## Changelog

### Version 1.0.0
- Initial API release
- All core endpoints implemented
- Authentication and authorization
- Rate limiting and error handling

### Version 0.9.0
- Beta API release
- Core security endpoints
- Basic authentication

### Version 0.8.0
- Alpha API release
- Phishing detection endpoints
- Basic malware analysis

