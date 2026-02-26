# 🚨 HONEYPORT - CLEAN PROJECT

## 📁 **ESSENTIAL FILES ONLY:**

```
Honeyport/
├── src/                          # ✅ Core Python modules
│   ├── __init__.py
│   ├── main.py
│   ├── config.py
│   ├── listener_manager.py
│   ├── connection_handler.py
│   ├── blocker.py
│   ├── alert_manager.py
│   ├── geoip_lookup.py
│   ├── metrics.py
│   ├── web_api.py
│   └── utils/
│       ├── __init__.py
│       └── logger.py
├── configs/
│   └── honeyport.yml             # ✅ Configuration
├── deploy/
│   ├── requirements.txt          # ✅ Dependencies
│   ├── honeyport.service         # ✅ Ubuntu service
│   └── ubuntu_setup.sh           # ✅ Setup script
├── run_honeyport.py              # ✅ Quick launcher
├── test_honeyport.py             # ✅ Simple test
└── README.md                     # ✅ Documentation
```

## 🚀 **HOW TO START:**

### **Step 1: Install Dependencies**
```bash
pip3 install -r deploy/requirements.txt
```

### **Step 2: Start Honeyport**
```bash
python3 run_honeyport.py
```

### **Step 3: Test It's Working**
```bash
# In another terminal:
nc localhost 22
nc localhost 80

# Check Telegram for alerts!
```

### **Step 4: Run Test Script**
```bash
python3 test_honeyport.py
```

## ✅ **SUCCESS INDICATORS:**

- ✅ **Terminal shows**: "Listening on 0.0.0.0:22", "Listening on 0.0.0.0:80"
- ✅ **Connection test**: `nc localhost 22` shows "Intrusion detected"
- ✅ **Telegram alerts**: You receive messages in your bot
- ✅ **Web dashboard**: http://localhost:8080 shows live data
- ✅ **Test script**: Shows "4/4 tests passed"

## 🎯 **QUICK TEST:**

```bash
# 1. Start
python3 run_honeyport.py

# 2. Test (new terminal)
nc localhost 22

# 3. Check results
python3 test_honeyport.py
```

**If you see Telegram alerts and "4/4 tests passed", it's working!** 🎉

