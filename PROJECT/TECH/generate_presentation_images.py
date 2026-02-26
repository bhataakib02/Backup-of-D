#!/usr/bin/env python3
"""
SPCMS Diagram to Image Converter
Converts Mermaid diagrams to high-quality images for presentations
"""

import os
import subprocess
import json
from pathlib import Path

# Configuration
CONFIG = {
    "output_dir": "presentation_images",
    "image_format": "png",
    "width": 1920,
    "height": 1080,
    "theme": "default",
    "background": "white"
}

# Mermaid diagrams to convert
DIAGRAMS = {
    "system_architecture": """
graph TB
    subgraph "🏛️ SPCMS SYSTEM ARCHITECTURE"
        A[👥 Pilgrims<br/>📱 Mobile App<br/>🌐 Web Portal<br/>🏪 Kiosks] --> B[🌐 API Gateway<br/>🔐 Authentication<br/>📊 Rate Limiting<br/>🔄 Load Balancing]
        C[🏛️ Authorities<br/>🖥️ Dashboard<br/>📊 Analytics<br/>🚨 Alerts] --> B
        D[👨‍💼 Volunteers<br/>📋 Staff App<br/>📞 Communication<br/>🗺️ Maps] --> B
        
        B --> E[⚙️ Microservices Layer<br/>👤 User Service | 🎟️ Queue Service<br/>🗺️ Map Service | 🚨 Alert Service<br/>🌐 Language Service | 💳 Payment Service]
        
        E --> F[🗄️ Database<br/>🐘 PostgreSQL<br/>🍃 MongoDB<br/>⚡ Redis Cache<br/>📊 InfluxDB]
        E --> G[🤖 AI/ML Engine<br/>🧠 Prediction Models<br/>📈 Analytics<br/>🔍 Detection<br/>🎯 ML Models]
        E --> H[📡 IoT Layer<br/>📹 CCTV Cameras<br/>📡 Sensors<br/>🚁 Drones<br/>📱 Beacons]
        
        H --> I[🛕 Temple Sites<br/>🕉️ Somnath<br/>🏛️ Dwarka<br/>🙏 Ambaji<br/>⛰️ Pavagadh]
    end
    
    style A fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style B fill:#f3e5f5,stroke:#7b1fa2,stroke-width:3px
    style C fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style D fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style E fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    style F fill:#e0f2f1,stroke:#00695c,stroke-width:2px
    style G fill:#fff8e1,stroke:#f9a825,stroke-width:2px
    style H fill:#e1f5fe,stroke:#0277bd,stroke-width:2px
    style I fill:#f1f8e9,stroke:#558b2f,stroke-width:3px
""",

    "data_flow": """
flowchart LR
    subgraph "📥 INPUT SOURCES"
        A1[📹 CCTV Feeds<br/>4K Video Streams]
        A2[📡 IoT Sensors<br/>Real-time Data]
        A3[🚁 Drones<br/>Aerial Monitoring]
        A4[📱 Mobile Apps<br/>User Interactions]
        A5[📅 Calendar<br/>Festival Data]
        A6[🌤️ Weather<br/>API Data]
    end
    
    subgraph "⚡ PROCESSING LAYER"
        B1[🔄 Stream Processing<br/>Apache Kafka]
        B2[🗄️ Data Storage<br/>Data Lake]
        B3[🔍 Data Validation<br/>Quality Checks]
        B4[🧹 Data Cleaning<br/>Normalization]
        B5[📦 Aggregation<br/>Time Windows]
    end
    
    subgraph "🧠 AI/ML ANALYSIS"
        C1[🤖 Prediction Models<br/>LSTM Networks]
        C2[📊 Analytics Engine<br/>Real-time Processing]
        C3[🚨 Anomaly Detection<br/>Isolation Forest]
        C4[📈 Trend Analysis<br/>Pattern Recognition]
        C5[🔮 Forecasting<br/>Prophet Algorithm]
    end
    
    subgraph "📤 OUTPUTS"
        D1[📱 Mobile Notifications<br/>Push Alerts]
        D2[🖥️ Admin Dashboard<br/>Real-time Metrics]
        D3[🚨 Emergency Alerts<br/>Automated Response]
        D4[🎟️ Queue Management<br/>Wait Time Updates]
        D5[🗺️ Navigation<br/>Route Optimization]
    end
    
    A1 & A2 & A3 & A4 & A5 & A6 --> B1 & B2 & B3 & B4 & B5
    B1 & B2 & B3 & B4 & B5 --> C1 & C2 & C3 & C4 & C5
    C1 & C2 & C3 & C4 & C5 --> D1 & D2 & D3 & D4 & D5
    
    style A1 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style A2 fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style A3 fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style A4 fill:#fce4ec,stroke:#c2185b,stroke-width:2px
    style A5 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style A6 fill:#e0f2f1,stroke:#00695c,stroke-width:2px
""",

    "technology_stack": """
graph TB
    subgraph "🛠️ SPCMS TECHNOLOGY STACK"
        subgraph "📱 PRESENTATION LAYER"
            PT1[📱 React Native<br/>iOS & Android<br/>TypeScript<br/>Expo Framework]
            PT2[🌐 React.js<br/>Web Application<br/>Redux State<br/>Material-UI]
            PT3[🖥️ Admin Dashboard<br/>Real-time Analytics<br/>Chart.js<br/>Role-based Access]
            PT4[🏪 Kiosk Interface<br/>Touch Optimized<br/>Offline Capable<br/>Multilingual]
        end
        
        subgraph "🌐 API GATEWAY LAYER"
            AGT1[🔐 Kong Gateway<br/>JWT Authentication<br/>OAuth 2.0<br/>Rate Limiting]
            AGT2[🛡️ Security Layer<br/>SSL/TLS<br/>CORS Handling<br/>Input Validation]
            AGT3[📝 Documentation<br/>Swagger/OpenAPI<br/>Version Management<br/>Health Checks]
        end
        
        subgraph "⚙️ BUSINESS LOGIC LAYER"
            BLT1[⚙️ Node.js<br/>Express.js<br/>Async/Await<br/>Error Handling]
            BLT2[🐍 Python<br/>FastAPI<br/>Async Processing<br/>ML Model Serving]
            BLT3[🔄 Message Queue<br/>Apache Kafka<br/>Redis Pub/Sub<br/>Event-driven]
        end
        
        subgraph "🗄️ DATA LAYER"
            DPT1[🐘 PostgreSQL<br/>ACID Transactions<br/>Connection Pooling<br/>Read Replicas]
            DPT2[🍃 MongoDB<br/>Document Storage<br/>Sharding<br/>Replica Sets]
            DPT3[⚡ Redis<br/>In-memory Cache<br/>Session Storage<br/>Pub/Sub]
            DPT4[📊 InfluxDB<br/>Time Series<br/>Real-time Queries<br/>Data Retention]
        end
        
        subgraph "☁️ INFRASTRUCTURE LAYER"
            IT1[☁️ AWS/Azure<br/>Auto Scaling<br/>Load Balancers<br/>Multi-region]
            IT2[🐳 Docker<br/>Containerization<br/>Multi-stage Builds<br/>Security Scanning]
            IT3[☸️ Kubernetes<br/>Orchestration<br/>Service Discovery<br/>Rolling Updates]
            IT4[🔧 CI/CD<br/>GitHub Actions<br/>Automated Testing<br/>Deployment]
        end
    end
    
    PT1 & PT2 & PT3 & PT4 --> AGT1 & AGT2 & AGT3
    AGT1 & AGT2 & AGT3 --> BLT1 & BLT2 & BLT3
    BLT1 & BLT2 & BLT3 --> DPT1 & DPT2 & DPT3 & DPT4
    DPT1 & DPT2 & DPT3 & DPT4 --> IT1 & IT2 & IT3 & IT4
    
    style PT1 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style PT2 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style PT3 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style PT4 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style AGT1 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style AGT2 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style AGT3 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
""",

    "iot_network": """
graph TB
    subgraph "🛕 SMART TEMPLE INFRASTRUCTURE"
        subgraph "🏛️ Temple Complex"
            TC1[🚪 Main Entrance<br/>📹 4K CCTV<br/>👥 People Counter<br/>📱 Emergency Beacon]
            TC2[⏳ Queue Area<br/>📹 Crowd Cameras<br/>📊 Density Sensors<br/>🌡️ Environment Monitor]
            TC3[🛕 Main Temple<br/>📹 Security Cameras<br/>🔊 Audio Analytics<br/>📱 SOS Buttons]
            TC4[🚪 Exit Points<br/>📹 Exit Cameras<br/>👥 Exit Counters<br/>📊 Flow Sensors]
        end
        
        subgraph "🚁 Aerial Network"
            AS1[🚁 Primary Drone<br/>📹 4K Video<br/>🌡️ Thermal Imaging<br/>📍 GPS Tracking]
            AS2[🚁 Backup Drone<br/>📹 Secondary Coverage<br/>🔋 Extended Battery<br/>📡 Mesh Network]
        end
        
        subgraph "📡 Communication"
            CN1[📡 5G Base Station<br/>⚡ High Speed Data<br/>📱 Mobile Connectivity]
            CN2[📶 WiFi Network<br/>🔒 Secure Access<br/>📱 Guest Network]
        end
    end
    
    subgraph "🖥️ EDGE COMPUTING"
        EC1[⚡ Edge Server 1<br/>🖥️ Local Processing<br/>📊 Real-time Analytics]
        EC2[⚡ Edge Server 2<br/>🤖 AI Inference<br/>📹 Video Processing]
        EC3[⚡ Edge Server 3<br/>📊 Aggregation Hub<br/>🔄 Load Distribution]
    end
    
    subgraph "☁️ CLOUD PROCESSING"
        CP1[🤖 AI/ML Cluster<br/>🧠 Deep Learning<br/>📈 Predictive Models]
        CP2[📊 Analytics Engine<br/>📈 Real-time Metrics<br/>📋 Report Generation]
        CP3[🚨 Alert System<br/>📱 Push Notifications<br/>📧 Email Alerts]
    end
    
    TC1 & TC2 & TC3 & TC4 --> EC1 & EC2 & EC3
    AS1 & AS2 --> EC1 & EC2 & EC3
    CN1 & CN2 --> EC1 & EC2 & EC3
    EC1 & EC2 & EC3 --> CP1 & CP2 & CP3
    
    style TC1 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style TC2 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style TC3 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style TC4 fill:#e3f2fd,stroke:#1976d2,stroke-width:2px
    style AS1 fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style AS2 fill:#fff3e0,stroke:#f57c00,stroke-width:2px
    style CN1 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
    style CN2 fill:#f3e5f5,stroke:#7b1fa2,stroke-width:2px
""",

    "security_framework": """
graph TB
    subgraph "🛡️ MULTI-LAYERED SECURITY ARCHITECTURE"
        subgraph "🔥 Layer 1: Perimeter Security"
            L1A[🔥 WAF Firewall<br/>SQL Injection Protection<br/>XSS Prevention]
            L1B[🛡️ DDoS Protection<br/>Rate Limiting<br/>Traffic Analysis]
            L1C[🌐 CDN Security<br/>SSL/TLS Cert<br/>Edge Security]
            L1D[🔒 VPN Access<br/>IP Whitelisting<br/>Multi-factor Auth]
        end
        
        subgraph "🔐 Layer 2: Application Security"
            L2A[🔐 JWT Tokens<br/>Token Rotation<br/>Refresh Mechanism]
            L2B[🔑 OAuth 2.0<br/>PKCE Flow<br/>Scope Control]
            L2C[📊 Rate Limiting<br/>API Throttling<br/>Abuse Detection]
            L2D[✅ Input Validation<br/>Schema Validation<br/>Data Sanitization]
        end
        
        subgraph "🔒 Layer 3: Data Security"
            L3A[🔒 AES Encryption<br/>End-to-End Security<br/>Key Rotation]
            L3B[🗄️ DB Security<br/>Column-level Encryption<br/>Row-level Security]
            L3C[🔐 Key Management<br/>HSM Integration<br/>Secure Distribution]
            L3D[📝 Audit Logs<br/>Access Tracking<br/>Compliance Reports]
        end
        
        subgraph "☁️ Layer 4: Infrastructure Security"
            L4A[☁️ Cloud Security<br/>IAM Policies<br/>Network Segmentation]
            L4B[🐳 Container Security<br/>Image Scanning<br/>Runtime Protection]
            L4C[📊 Monitoring<br/>Real-time Analysis<br/>Threat Intelligence]
            L4D[🚨 SIEM/SOC<br/>Log Aggregation<br/>Incident Response]
        end
    end
    
    L1A & L1B & L1C & L1D --> L2A & L2B & L2C & L2D
    L2A & L2B & L2C & L2D --> L3A & L3B & L3C & L3D
    L3A & L3B & L3C & L3D --> L4A & L4B & L4C & L4D
    
    style L1A fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style L1B fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style L1C fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style L1D fill:#ffebee,stroke:#d32f2f,stroke-width:2px
    style L2A fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style L2B fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style L2C fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
    style L2D fill:#e8f5e8,stroke:#388e3c,stroke-width:2px
"""
}

def create_output_directory():
    """Create output directory for images"""
    output_path = Path(CONFIG["output_dir"])
    output_path.mkdir(exist_ok=True)
    return output_path

def save_mermaid_file(name, content):
    """Save Mermaid diagram to .mmd file"""
    output_path = create_output_directory()
    mmd_file = output_path / f"{name}.mmd"
    
    with open(mmd_file, 'w', encoding='utf-8') as f:
        f.write(content.strip())
    
    return mmd_file

def convert_to_image(mmd_file, output_file):
    """Convert Mermaid file to image using mermaid-cli"""
    try:
        cmd = [
            "mmdc",
            "-i", str(mmd_file),
            "-o", str(output_file),
            "-w", str(CONFIG["width"]),
            "-H", str(CONFIG["height"]),
            "-t", CONFIG["theme"],
            "-b", CONFIG["background"]
        ]
        
        result = subprocess.run(cmd, capture_output=True, text=True)
        
        if result.returncode == 0:
            print(f"✅ Successfully created: {output_file}")
            return True
        else:
            print(f"❌ Error creating {output_file}: {result.stderr}")
            return False
            
    except FileNotFoundError:
        print("❌ mermaid-cli not found. Please install with: npm install -g @mermaid-js/mermaid-cli")
        return False

def generate_all_images():
    """Generate all diagram images"""
    print("🎨 SPCMS Diagram to Image Converter")
    print("=" * 50)
    
    output_path = create_output_directory()
    success_count = 0
    
    for name, content in DIAGRAMS.items():
        print(f"\n🔄 Processing: {name}")
        
        # Save Mermaid file
        mmd_file = save_mermaid_file(name, content)
        
        # Convert to image
        output_file = output_path / f"{name}.{CONFIG['image_format']}"
        
        if convert_to_image(mmd_file, output_file):
            success_count += 1
    
    print(f"\n🎯 Summary:")
    print(f"✅ Successfully created: {success_count}/{len(DIAGRAMS)} images")
    print(f"📁 Output directory: {output_path.absolute()}")
    
    if success_count == 0:
        print("\n💡 Alternative methods:")
        print("1. Use Mermaid Live Editor: https://mermaid.live/")
        print("2. Copy diagram code from .mmd files and paste online")
        print("3. Use VS Code with Mermaid Preview extension")

def create_html_preview():
    """Create HTML file to preview all diagrams"""
    output_path = create_output_directory()
    html_content = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>SPCMS Technical Diagrams</title>
    <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { text-align: center; margin-bottom: 40px; }
        .diagram { background: white; margin: 20px 0; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .diagram h2 { color: #1976d2; border-bottom: 2px solid #1976d2; padding-bottom: 10px; }
        .mermaid { text-align: center; }
        .badge { display: inline-block; padding: 4px 8px; background: #1976d2; color: white; border-radius: 4px; font-size: 12px; margin: 5px; }
    </style>
    <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🏛️ SPCMS Technical Diagrams</h1>
            <div class="badge">Smart India Hackathon 2025</div>
            <div class="badge">Problem Statement ID: 25165</div>
            <div class="badge">Government of Gujarat</div>
        </div>
"""
    
    for name, content in DIAGRAMS.items():
        title = name.replace('_', ' ').title()
        html_content += f"""
        <div class="diagram">
            <h2>📊 {title}</h2>
            <div class="mermaid">
{content}
            </div>
        </div>
"""
    
    html_content += """
    </div>
    <script>
        mermaid.initialize({
            startOnLoad: true,
            theme: 'default',
            themeVariables: {
                primaryColor: '#1976d2',
                primaryTextColor: '#ffffff',
                primaryBorderColor: '#1976d2',
                lineColor: '#1976d2'
            }
        });
    </script>
</body>
</html>
"""
    
    html_file = output_path / "diagrams_preview.html"
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(html_content)
    
    print(f"📄 HTML preview created: {html_file.absolute()}")
    print("🌐 Open this file in your browser to view all diagrams")

if __name__ == "__main__":
    # Generate images
    generate_all_images()
    
    # Create HTML preview
    create_html_preview()
    
    print("\n🎯 Next Steps:")
    print("1. Install mermaid-cli: npm install -g @mermaid-js/mermaid-cli")
    print("2. Run this script again to generate images")
    print("3. Or use the HTML preview file to view diagrams in browser")
    print("4. Use Mermaid Live Editor for manual conversion: https://mermaid.live/")
