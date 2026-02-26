#!/bin/bash
# Honeyport Ubuntu Setup Script
# Professional Network Honeypot Installation

set -e

echo "🚨 Honeyport Professional Network Honeypot Setup"
echo "=============================================="

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   echo "❌ Please do not run this script as root. It will use sudo when needed."
   exit 1
fi

# Update system packages
echo "📦 Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install required system packages
echo "🔧 Installing system dependencies..."
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    ufw \
    net-tools \
    nmap \
    tcpdump \
    whois \
    curl \
    wget \
    git \
    unzip \
    logrotate

# Create honeyport user
echo "👤 Creating honeyport user..."
sudo adduser --system --group --home /opt/honeyport honeyport || true

# Create directory structure
echo "📁 Creating directory structure..."
sudo mkdir -p /opt/honeyport/{src,configs,logs,data,docs,deploy}
sudo chown -R honeyport:honeyport /opt/honeyport

# Copy files to installation directory
echo "📋 Copying Honeyport files..."
sudo cp -r src/ /opt/honeyport/
sudo cp -r configs/ /opt/honeyport/
sudo cp -r deploy/ /opt/honeyport/
sudo cp README.md /opt/honeyport/ 2>/dev/null || true

# Set proper permissions
sudo chown -R honeyport:honeyport /opt/honeyport
sudo chmod +x /opt/honeyport/src/main.py

# Install Python dependencies
echo "🐍 Installing Python dependencies..."
sudo -u honeyport python3 -m pip install --user -r /opt/honeyport/deploy/requirements.txt

# Configure firewall
echo "🔥 Configuring firewall..."
sudo ufw --force enable
sudo ufw allow 22/tcp comment 'SSH'
sudo ufw allow 8080/tcp comment 'Honeyport Dashboard'
sudo ufw allow 9090/tcp comment 'Prometheus Metrics'
sudo ufw default deny incoming
sudo ufw default allow outgoing

# Configure sudo for honeyport user
echo "🔐 Configuring sudo permissions..."
sudo tee /etc/sudoers.d/honeyport > /dev/null <<EOF
# Honeyport user can run UFW commands without password
honeyport ALL=(ALL) NOPASSWD: /usr/sbin/ufw
honeyport ALL=(ALL) NOPASSWD: /sbin/iptables
EOF

# Install systemd service
echo "⚙️ Installing systemd service..."
sudo cp /opt/honeyport/deploy/honeyport.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable honeyport

# Create logrotate configuration
echo "📊 Configuring log rotation..."
sudo tee /etc/logrotate.d/honeyport > /dev/null <<EOF
/opt/honeyport/logs/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 honeyport honeyport
    postrotate
        systemctl reload honeyport
    endscript
}
EOF

# Download GeoLite2 database (optional)
echo "🌍 Setting up GeoIP database..."
echo "To enable GeoIP lookups, download GeoLite2-City.mmdb from MaxMind:"
echo "1. Create account at https://www.maxmind.com/"
echo "2. Download GeoLite2-City.mmdb"
echo "3. Place in /opt/honeyport/data/"

# Create data directory
sudo mkdir -p /opt/honeyport/data
sudo chown honeyport:honeyport /opt/honeyport/data

# Test configuration
echo "🧪 Testing configuration..."
sudo -u honeyport python3 -c "
import sys
sys.path.insert(0, '/opt/honeyport')
from src.config import Config
config = Config('/opt/honeyport/configs/honeyport.yml')
print('✅ Configuration loaded successfully')
print(f'📡 Will listen on ports: {config.ports}')
print(f'🌐 Dashboard: http://localhost:{config.web_port}')
"

echo ""
echo "🎉 Honeyport installation completed!"
echo ""
echo "📋 Next steps:"
echo "1. Edit configuration: sudo nano /opt/honeyport/configs/honeyport.yml"
echo "2. Set up Telegram alerts (optional):"
echo "   - Create bot with @BotFather"
echo "   - Add token and chat ID to config"
echo "3. Download GeoIP database (optional):"
echo "   - Place GeoLite2-City.mmdb in /opt/honeyport/data/"
echo "4. Start Honeyport:"
echo "   sudo systemctl start honeyport"
echo "5. Check status:"
echo "   sudo systemctl status honeyport"
echo "6. View logs:"
echo "   sudo journalctl -u honeyport -f"
echo "7. Open dashboard:"
echo "   http://$(hostname -I | awk '{print $1}'):8080"
echo ""
echo "🔧 Management commands:"
echo "   Start:   sudo systemctl start honeyport"
echo "   Stop:    sudo systemctl stop honeyport"
echo "   Restart: sudo systemctl restart honeyport"
echo "   Status:  sudo systemctl status honeyport"
echo "   Logs:    sudo journalctl -u honeyport -f"
echo ""
echo "⚠️  Security notes:"
echo "   - Honeyport runs as non-root user 'honeyport'"
echo "   - Only UFW/iptables commands require sudo"
echo "   - Firewall is configured to block incoming traffic"
echo "   - Dashboard is accessible on port 8080"
echo ""
echo "🚨 Ready to catch attackers! 🚨"

