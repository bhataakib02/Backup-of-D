# NEXUS CYBER INTELLIGENCE
## *Platform Deployment & Operations Guide*

<div align="center">

![Platform Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Deployment](https://img.shields.io/badge/Deployment-Multi--Environment-blue)
![Support](https://img.shields.io/badge/Support-24%2F7-orange)

**Enterprise-Grade Cybersecurity Platform Deployment Guide**

[🚀 Quick Start](#-quick-start) • [🐳 Docker Deployment](#-docker-deployment) • [☁️ Cloud Deployment](#️-cloud-deployment) • [🔧 Configuration](#-configuration)

</div>

---

## 📋 **Prerequisites & System Requirements**

### **🖥️ Minimum System Requirements**
- **CPU**: 4 cores (8 cores recommended)
- **RAM**: 8GB (16GB recommended for production)
- **Storage**: 50GB available space (SSD recommended)
- **Network**: Stable internet connection for threat intelligence feeds
- **OS**: Windows 10+, macOS 10.15+, Ubuntu 18.04+

### **📦 Required Software**
- **Python**: 3.9+ with pip
- **Node.js**: 18+ with npm
- **Docker**: 20.10+ (for containerized deployment)
- **Git**: Latest version
- **PostgreSQL**: 13+ (for production database)
- **Redis**: 6+ (for caching and sessions)

### **🔑 API Keys & Credentials** (Optional but Recommended)
- **VirusTotal API Key**: For enhanced malware analysis
- **AbuseIPDB API Key**: For IP reputation checking
- **Shodan API Key**: For network intelligence
- **MISP API Key**: For threat intelligence feeds

---

## 🚀 **Quick Start Deployment**

### **⚡ Option 1: One-Click Docker Deployment** (Recommended)
```bash
# Clone the repository
git clone https://github.com/nexus-cyber-intelligence/platform.git
cd platform

# Quick production deployment
./scripts/quick-deploy.sh

# Access the platform
open http://localhost:3000
```

### **🛠️ Option 2: Manual Development Setup**

#### **Step 1: Backend API Server**
```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Initialize database
python scripts/init_database.py

# Train ML models (first-time setup)
python scripts/train_models.py

# Start the Flask API server
python app.py
```
**✅ Backend Status**: API server running on `http://localhost:5000`

#### **Step 2: Frontend Dashboard**
```bash
# Open new terminal and navigate to frontend
cd frontend

# Install dependencies with legacy peer deps support
npm install --legacy-peer-deps

# Start the React development server
npm start
```
**✅ Frontend Status**: Dashboard running on `http://localhost:3000`

#### **Step 3: Verification & Testing**
```bash
# Test backend health
curl http://localhost:5000/api/health

# Test API documentation
curl http://localhost:5000/api/docs

# Test authentication endpoint
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "nexus2024"}'
```

---

## 🐳 **Docker Deployment**

### **🔧 Development Environment**
```bash
# Start all services with hot-reload
docker-compose up --build

# Run in background
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### **🏭 Production Environment**
```bash
# Production deployment with optimizations
docker-compose -f docker-compose.prod.yml up -d

# Scale services for high availability
docker-compose -f docker-compose.prod.yml up -d --scale api=3 --scale worker=2

# Health check all services
docker-compose -f docker-compose.prod.yml ps
```

### **📊 Monitoring Stack**
```bash
# Deploy with monitoring (Prometheus + Grafana)
docker-compose -f docker-compose.monitoring.yml up -d

# Access monitoring dashboards
open http://localhost:3001  # Grafana
open http://localhost:9090  # Prometheus
```

---

## ☁️ **Cloud Deployment**

### **🌐 AWS Deployment**
```bash
# Deploy to AWS ECS
./deploy/aws/deploy-ecs.sh

# Deploy to AWS EKS (Kubernetes)
./deploy/aws/deploy-eks.sh

# Deploy with Terraform
cd deploy/aws/terraform
terraform init && terraform apply
```

### **☁️ Azure Deployment**
```bash
# Deploy to Azure Container Instances
./deploy/azure/deploy-aci.sh

# Deploy to Azure Kubernetes Service
./deploy/azure/deploy-aks.sh
```

### **🔵 Google Cloud Deployment**
```bash
# Deploy to Google Cloud Run
./deploy/gcp/deploy-cloudrun.sh

# Deploy to Google Kubernetes Engine
./deploy/gcp/deploy-gke.sh
```

---

## 🔧 **Configuration & Environment Setup**

### **🔐 Environment Variables**
Create `.env` file in the root directory:
```bash
# Application Configuration
APP_NAME=NEXUS_CYBER_INTELLIGENCE
APP_VERSION=2.0.0
FLASK_ENV=production
NODE_ENV=production

# Security Configuration
SECRET_KEY=your-super-secure-secret-key-here
JWT_SECRET_KEY=your-jwt-secret-key-here
ENCRYPTION_KEY=your-encryption-key-here

# Database Configuration
DATABASE_URL=postgresql://nexus:password@localhost:5432/nexus_ci
POSTGRES_DB=nexus_ci
POSTGRES_USER=nexus
POSTGRES_PASSWORD=your-secure-password

# Redis Configuration
REDIS_URL=redis://localhost:6379/0
REDIS_PASSWORD=your-redis-password

# API Keys (Optional but Recommended)
VIRUSTOTAL_API_KEY=your-virustotal-api-key
ABUSEIPDB_API_KEY=your-abuseipdb-api-key
SHODAN_API_KEY=your-shodan-api-key
MISP_API_KEY=your-misp-api-key
MISP_URL=https://your-misp-instance.com

# Email Configuration (for alerts)
SMTP_SERVER=smtp.gmail.com
SMTP_PORT=587
SMTP_USERNAME=alerts@nexus-ci.com
SMTP_PASSWORD=your-email-password

# Monitoring Configuration
PROMETHEUS_ENABLED=true
GRAFANA_ADMIN_PASSWORD=secure-grafana-password
LOG_LEVEL=INFO
```

### **🗄️ Database Setup**
```bash
# PostgreSQL setup (production)
sudo -u postgres createdb nexus_ci
sudo -u postgres createuser nexus
sudo -u postgres psql -c "ALTER USER nexus WITH PASSWORD 'your-password';"
sudo -u postgres psql -c "GRANT ALL PRIVILEGES ON DATABASE nexus_ci TO nexus;"

# Initialize database schema
python backend/scripts/init_database.py

# Load initial data
python backend/scripts/load_sample_data.py
```

### **🔄 Redis Setup**
```bash
# Install and start Redis
sudo apt-get install redis-server
sudo systemctl start redis-server
sudo systemctl enable redis-server

# Configure Redis for production
sudo nano /etc/redis/redis.conf
# Set: requirepass your-redis-password
sudo systemctl restart redis-server
```

---

## 🌐 **Access Points & Service URLs**

### **🖥️ Main Application**
- **🏠 Main Dashboard**: `http://localhost:3000`
- **🔐 Login Portal**: `http://localhost:3000/login`
- **👤 Admin Panel**: `http://localhost:3000/admin`
- **📊 Analytics**: `http://localhost:3000/analytics`

### **🔧 API Endpoints**
- **📚 API Documentation**: `http://localhost:5000/api/docs`
- **❤️ Health Check**: `http://localhost:5000/api/health`
- **🔐 Authentication**: `http://localhost:5000/api/auth`
- **📊 Metrics**: `http://localhost:5000/api/metrics`

### **🛡️ Security Modules**
- **🎣 Phishing Detection**: `http://localhost:5000/api/phishing`
- **🦠 Malware Analysis**: `http://localhost:5000/api/malware`
- **🔍 Network IDS**: `http://localhost:5000/api/ids`
- **⚡ Fusion Engine**: `http://localhost:5000/api/fusion`
- **🔒 Ransomware Detection**: `http://localhost:5000/api/ransomware`
- **🌐 Threat Intelligence**: `http://localhost:5000/api/threat-intel`

### **📊 Monitoring & Analytics**
- **📈 Grafana Dashboard**: `http://localhost:3001` (admin/admin)
- **🎯 Prometheus Metrics**: `http://localhost:9090`
- **📋 Application Logs**: `http://localhost:5601` (ELK Stack)
- **🔍 Jaeger Tracing**: `http://localhost:16686`

---

## 🧪 **Testing & Validation**

### **🔍 System Health Checks**
```bash
# Comprehensive health check
./scripts/health-check.sh

# Individual service checks
curl -f http://localhost:5000/api/health || echo "Backend DOWN"
curl -f http://localhost:3000 || echo "Frontend DOWN"
curl -f http://localhost:3001/api/health || echo "Grafana DOWN"
```

### **🎯 API Testing**
```bash
# Test authentication
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "nexus2024"}'

# Test phishing detection
curl -X POST http://localhost:5000/api/phishing/url \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Test malware analysis
curl -X POST http://localhost:5000/api/malware/hash \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{"hash": "d41d8cd98f00b204e9800998ecf8427e"}'
```

### **⚡ Performance Testing**
```bash
# Load testing with Apache Bench
ab -n 1000 -c 10 http://localhost:5000/api/health

# Stress testing with Locust
cd tests/performance
locust -f locustfile.py --host=http://localhost:5000
```

---

## 🏗️ **Platform Architecture Overview**

### **📁 Project Structure**
```
NEXUS-CYBER-INTELLIGENCE/
├── 📂 backend/                    # Flask API Server
│   ├── 📂 api/                   # API routes and endpoints
│   ├── 📂 models/                # ML models and algorithms
│   ├── 📂 services/              # Business logic services
│   ├── 📂 utils/                 # Utility functions
│   ├── 📂 config/                # Configuration files
│   └── 📄 app.py                 # Main application entry
├── 📂 frontend/                   # React Dashboard
│   ├── 📂 src/                   # Source code
│   │   ├── 📂 components/        # React components
│   │   ├── 📂 pages/             # Page components
│   │   ├── 📂 services/          # API services
│   │   ├── 📂 utils/             # Utility functions
│   │   └── 📂 styles/            # CSS and styling
│   ├── 📂 public/                # Static assets
│   └── 📄 package.json           # Dependencies
├── 📂 docs/                       # Documentation
├── 📂 scripts/                    # Deployment and utility scripts
├── 📂 monitoring/                 # Prometheus and Grafana configs
├── 📂 deploy/                     # Deployment configurations
│   ├── 📂 docker/                # Docker configurations
│   ├── 📂 kubernetes/            # K8s manifests
│   ├── 📂 aws/                   # AWS deployment
│   ├── 📂 azure/                 # Azure deployment
│   └── 📂 gcp/                   # Google Cloud deployment
├── 📂 tests/                      # Test suites
│   ├── 📂 unit/                  # Unit tests
│   ├── 📂 integration/           # Integration tests
│   └── 📂 performance/           # Performance tests
├── 📄 docker-compose.yml         # Development environment
├── 📄 docker-compose.prod.yml    # Production environment
├── 📄 .env.example               # Environment template
└── 📄 README.md                  # Project documentation
```

### **🔧 Service Architecture**
```
┌─────────────────────────────────────────────────────────────┐
│                    NEXUS CYBER INTELLIGENCE                 │
├─────────────────────────────────────────────────────────────┤
│  Frontend (React.js)     │  API Gateway (Nginx)            │
│  - Dashboard             │  - Load Balancing               │
│  - Analytics             │  - SSL Termination              │
│  - Real-time Updates     │  - Rate Limiting                │
├─────────────────────────────────────────────────────────────┤
│  Backend Services (Flask/FastAPI)                          │
│  ├── Phishing Detection Engine (70 Functions)              │
│  ├── Malware Analysis Engine (70 Functions)                │
│  ├── Network IDS Engine (70 Functions)                     │
│  ├── Fusion Correlation Engine (40 Functions)              │
│  ├── Ransomware Detection (30 Functions)                   │
│  ├── Threat Intelligence (40 Functions)                    │
│  └── Advanced AI/ML Engine (460+ Functions)                │
├─────────────────────────────────────────────────────────────┤
│  Data Layer                                                 │
│  ├── PostgreSQL (Primary Database)                         │
│  ├── Redis (Caching & Sessions)                            │
│  ├── TimescaleDB (Time Series Data)                        │
│  └── Elasticsearch (Log Analytics)                         │
├─────────────────────────────────────────────────────────────┤
│  Infrastructure & Monitoring                               │
│  ├── Prometheus (Metrics Collection)                       │
│  ├── Grafana (Visualization)                               │
│  ├── Jaeger (Distributed Tracing)                          │
│  └── ELK Stack (Logging)                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📊 **Function Coverage & Capabilities**

### **🛡️ Security Module Distribution**
| Module | Functions | Description | Status |
|--------|-----------|-------------|---------|
| **🎣 Phishing Detection** | 70 | URL analysis, email security, ML classification | ✅ Active |
| **🦠 Malware Analysis** | 70 | Static/dynamic analysis, behavioral detection | ✅ Active |
| **🔍 Network IDS** | 70 | Traffic analysis, intrusion detection, anomaly detection | ✅ Active |
| **⚡ Fusion Engine** | 40 | Event correlation, attack chain reconstruction | ✅ Active |
| **🔒 Ransomware Detection** | 30 | File entropy monitoring, behavioral analysis | ✅ Active |
| **🌐 Threat Intelligence** | 40 | IOC management, threat actor profiling | ✅ Active |
| **🚀 Advanced AI/ML** | 460+ | Zero-day prediction, quantum-safe monitoring | ✅ Active |

**📈 Total Platform Capability**: **780+ Security Functions**

### **🤖 AI/ML Model Distribution**
- **Deep Learning Models**: 8 (CNN, LSTM, Transformer)
- **Traditional ML Models**: 12 (XGBoost, RandomForest, SVM)
- **Ensemble Methods**: 3 (Voting, Stacking, Boosting)
- **Specialized Models**: 2 (Autoencoder, IsolationForest)

---

## 🚨 **Troubleshooting & Support**

### **🔧 Common Issues & Solutions**

#### **Backend Issues**
```bash
# Port already in use
sudo lsof -i :5000
sudo kill -9 <PID>

# Database connection issues
python backend/scripts/test_db_connection.py

# Missing dependencies
pip install -r backend/requirements.txt --force-reinstall
```

#### **Frontend Issues**
```bash
# Node modules issues
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps

# Port conflicts
export PORT=3001
npm start
```

#### **Docker Issues**
```bash
# Clean Docker environment
docker system prune -a
docker-compose down --volumes

# Rebuild containers
docker-compose build --no-cache
docker-compose up --force-recreate
```

### **📞 Support Channels**
- **🔧 Technical Support**: support@nexus-ci.com
- **📚 Documentation**: [docs.nexus-ci.com](https://docs.nexus-ci.com)
- **💬 Community Forum**: [community.nexus-ci.com](https://community.nexus-ci.com)
- **🐛 Bug Reports**: [GitHub Issues](https://github.com/nexus-cyber-intelligence/platform/issues)
- **💡 Feature Requests**: [GitHub Discussions](https://github.com/nexus-cyber-intelligence/platform/discussions)

---

## 🎯 **Next Steps After Deployment**

### **✅ Post-Deployment Checklist**
- [ ] **Verify all services are running** (`./scripts/health-check.sh`)
- [ ] **Configure API keys** for enhanced functionality
- [ ] **Set up monitoring alerts** in Grafana
- [ ] **Configure backup procedures** for database
- [ ] **Review security settings** and access controls
- [ ] **Test core functionality** with sample data
- [ ] **Configure SSL certificates** for production
- [ ] **Set up log rotation** and retention policies

### **🔐 Security Hardening**
- [ ] **Change default passwords** for all services
- [ ] **Configure firewall rules** and network security
- [ ] **Enable audit logging** for compliance
- [ ] **Set up intrusion detection** monitoring
- [ ] **Configure backup encryption** and secure storage
- [ ] **Review user access controls** and permissions
- [ ] **Enable multi-factor authentication** for admin accounts

### **📈 Performance Optimization**
- [ ] **Configure caching strategies** for better performance
- [ ] **Set up database indexing** for query optimization
- [ ] **Configure load balancing** for high availability
- [ ] **Implement auto-scaling** for cloud deployments
- [ ] **Optimize ML model inference** for faster processing
- [ ] **Configure CDN** for static asset delivery

---

<div align="center">

## 🚀 **Platform Successfully Deployed!**

**Your NEXUS CYBER INTELLIGENCE platform is now ready for enterprise cybersecurity operations.**

**[📊 Access Dashboard](http://localhost:3000)** • **[📚 View Documentation](http://localhost:5000/api/docs)** • **[📈 Monitor Performance](http://localhost:3001)**

---

**NEXUS CYBER INTELLIGENCE** - *Next-Generation AI Security Operations Platform*

![Success](https://img.shields.io/badge/Deployment-Successful-brightgreen)

</div>