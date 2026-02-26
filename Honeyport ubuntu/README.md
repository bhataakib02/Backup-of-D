# 🚨 Honeyport - Professional Network Honeypot System

[![Python](https://img.shields.io/badge/Python-3.11+-blue.svg)](https://python.org)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue.svg)](docker/)
[![Ubuntu](https://img.shields.io/badge/Ubuntu-20.04+-orange.svg)](deploy/ubuntu_setup.sh)

A professional-grade network honeypot system designed for intrusion detection, automated response, and security monitoring. Honeyport listens on multiple ports, logs connection attempts, provides real-time alerts, and can automatically block malicious IPs.

## 🌟 Features

### Core Functionality
- **Multi-Port Listening**: Simultaneously monitors multiple ports (SSH, HTTP, SMB, RDP, etc.)
- **Real-Time Alerts**: Instant notifications via Telegram, Discord, or Email
- **Automatic IP Blocking**: UFW/iptables integration with whitelist support
- **GeoIP Lookup**: Identifies attacker location and ISP
- **Structured Logging**: JSON-formatted logs for SIEM integration
- **Web Dashboard**: Real-time monitoring interface with live event feed

### Professional Features
- **Prometheus Metrics**: Comprehensive monitoring and alerting
- **Docker Support**: Containerized deployment with Docker Compose
- **Systemd Integration**: Production-ready service management
- **Security Hardening**: Non-root execution with minimal privileges
- **Rate Limiting**: Prevents alert spam and DoS attacks
- **Configuration Management**: YAML-based configuration with validation

## 🚀 Quick Start

### Ubuntu Installation (Recommended)

1. **Clone and Setup**:
```bash
git clone https://github.com/yourusername/honeyport.git
cd honeyport
chmod +x deploy/ubuntu_setup.sh
./deploy/ubuntu_setup.sh
```

2. **Configure Alerts** (Optional):
```bash
sudo nano /opt/honeyport/configs/honeyport.yml
# Add your Telegram bot token and chat ID
```

3. **Start Honeyport**:
```bash
sudo systemctl start honeyport
sudo systemctl status honeyport
```

4. **Access Dashboard**:
Open http://your-server-ip:8080 in your browser

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# With monitoring stack
docker-compose --profile monitoring up -d
```

## 📊 Dashboard Screenshots

![Dashboard](docs/screenshots/dashboard.png)
*Real-time attack monitoring with live event feed*

![Alerts](docs/screenshots/alerts.png)
*Telegram alerts with GeoIP information*

## ⚙️ Configuration

### Basic Configuration (`configs/honeyport.yml`)

```yaml
# Honeypot ports
ports: [22, 80, 443, 445, 3389]

# Alerting
alerts:
  enabled: true
  telegram_token: "your_bot_token"
  telegram_chat_id: "your_chat_id"

# IP Blocking
blocking:
  enabled: true
  auto_block: false  # Start with manual approval
  whitelist_ips: ['192.168.1.1']

# Web Dashboard
web:
  enabled: true
  port: 8080
```

### Advanced Configuration

See [Configuration Guide](docs/Configuration_Guide.md) for detailed options.

## 🔧 Management Commands

### Systemd Commands
```bash
# Service management
sudo systemctl start honeyport
sudo systemctl stop honeyport
sudo systemctl restart honeyport
sudo systemctl status honeyport

# View logs
sudo journalctl -u honeyport -f
```

### Docker Commands
```bash
# Container management
docker-compose up -d
docker-compose down
docker-compose logs -f

# Update and restart
docker-compose pull
docker-compose up -d
```

### Manual IP Management
```bash
# Block an IP manually
curl -X POST http://localhost:8080/api/block \
  -H "Content-Type: application/json" \
  -d '{"ip": "1.2.3.4", "reason": "Manual block"}'

# Unblock an IP
curl -X POST http://localhost:8080/api/unblock \
  -H "Content-Type: application/json" \
  -d '{"ip": "1.2.3.4"}'
```

## 📈 Monitoring & Metrics

### Prometheus Metrics
- `honeyport_connections_total`: Total connections by IP and port
- `honeyport_blocked_ips_total`: Total blocked IPs
- `honeyport_alerts_sent_total`: Total alerts sent
- `honeyport_active_connections`: Currently active connections

### Grafana Dashboard
Import the provided Grafana dashboard for comprehensive monitoring:
```bash
# Dashboard JSON available in dashboards/grafana_dashboard.json
```

## 🛡️ Security Features

### Network Security
- **Firewall Integration**: Automatic UFW/iptables blocking
- **Whitelist Support**: Prevent false positives
- **Rate Limiting**: Protect against DoS attacks
- **Non-Root Execution**: Minimal privilege requirements

### Operational Security
- **Audit Logging**: All actions logged with timestamps
- **Secure Configuration**: YAML validation and sanitization
- **Container Security**: Read-only filesystem and capabilities
- **Service Hardening**: Systemd security features

## 📚 Documentation

- [Setup Guide](docs/Setup_Guide.md) - Complete installation instructions
- [Configuration Guide](docs/Configuration_Guide.md) - Detailed configuration options
- [API Reference](docs/API_Reference.md) - REST API documentation
- [Incident Response](docs/Incident_Playbook.md) - Security incident procedures
- [Architecture](docs/Architecture.md) - System design and components

## 🧪 Testing

### Unit Tests
```bash
python -m pytest tests/
```

### Integration Tests
```bash
# Test honeypot locally
nc localhost 22

# Test from remote machine
nmap -p22,80,445 your-server-ip
```

### Load Testing
```bash
# Simulate multiple connections
for i in {1..100}; do nc your-server-ip 22 & done
```

## 🔍 Troubleshooting

### Common Issues

**Service won't start**:
```bash
sudo journalctl -u honeyport -n 50
sudo systemctl status honeyport
```

**Ports not accessible**:
```bash
sudo ufw status
sudo netstat -tlnp | grep :22
```

**Alerts not working**:
```bash
# Check configuration
sudo -u honeyport python3 -c "
import sys; sys.path.insert(0, '/opt/honeyport')
from src.config import Config
config = Config('/opt/honeyport/configs/honeyport.yml')
print('Telegram enabled:', config.alerts.telegram_token is not None)
"
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## ⚠️ Legal Notice

**Important**: This software is for authorized security testing and research purposes only. Users are responsible for ensuring compliance with applicable laws and regulations. The authors are not responsible for any misuse of this software.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/yourusername/honeyport/issues)
- **Discussions**: [GitHub Discussions](https://github.com/yourusername/honeyport/discussions)
- **Security**: Report security issues privately to security@honeyport.dev

## 🙏 Acknowledgments

- MaxMind for GeoIP database
- Prometheus community for monitoring tools
- FastAPI for the web framework
- All contributors and testers

---

**🚨 Ready to catch attackers! 🚨**

*Honeyport - Professional Network Honeypot System*

