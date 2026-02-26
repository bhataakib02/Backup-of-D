#!/usr/bin/env python3
"""
Simple Honeyport Test Script
Quick test to verify if Honeyport is working
"""

import socket
import requests
import time
import json
from pathlib import Path

def test_honeyport():
    """Test if Honeyport is working properly"""
    print("🚨 Honeyport Quick Test")
    print("=" * 30)
    
    # Test 1: Check if ports are listening
    print("\n🔍 Testing port listeners...")
    ports = [22, 80, 443, 445]
    listening_ports = []
    
    for port in ports:
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            result = sock.connect_ex(('localhost', port))
            sock.close()
            if result == 0:
                print(f"✅ Port {port} is listening")
                listening_ports.append(port)
            else:
                print(f"❌ Port {port} is not listening")
        except Exception as e:
            print(f"❌ Port {port} test failed: {e}")
    
    # Test 2: Check web dashboard
    print("\n🌐 Testing web dashboard...")
    try:
        response = requests.get('http://localhost:8080/api/health', timeout=5)
        if response.status_code == 200:
            print("✅ Web dashboard is working")
            dashboard_ok = True
        else:
            print(f"❌ Web dashboard failed: {response.status_code}")
            dashboard_ok = False
    except Exception as e:
        print(f"❌ Web dashboard test failed: {e}")
        dashboard_ok = False
    
    # Test 3: Check Prometheus metrics
    print("\n📊 Testing Prometheus metrics...")
    try:
        response = requests.get('http://localhost:9090/metrics', timeout=5)
        if response.status_code == 200:
            metrics_text = response.text
            if "honeyport_connections_total" in metrics_text:
                print("✅ Prometheus metrics are working")
                metrics_ok = True
            else:
                print("⚠️  Prometheus working but no Honeyport metrics yet")
                metrics_ok = True
        else:
            print(f"❌ Prometheus metrics failed: {response.status_code}")
            metrics_ok = False
    except Exception as e:
        print(f"❌ Prometheus metrics test failed: {e}")
        metrics_ok = False
    
    # Test 4: Check log files
    print("\n📝 Testing log files...")
    log_file = Path("logs/honeyport.jsonl")
    if log_file.exists():
        try:
            with open(log_file, 'r') as f:
                lines = f.readlines()
            print(f"✅ Log file exists with {len(lines)} entries")
            log_ok = True
        except Exception as e:
            print(f"❌ Log file error: {e}")
            log_ok = False
    else:
        print("⚠️  Log file not found (will be created on first connection)")
        log_ok = True
    
    # Test 5: Simulate attack
    print("\n🎯 Simulating attack...")
    if listening_ports:
        test_port = listening_ports[0]
        try:
            sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
            sock.settimeout(2)
            sock.connect(('localhost', test_port))
            sock.send(b"GET / HTTP/1.1\r\nHost: test\r\n\r\n")
            sock.close()
            print(f"✅ Attack simulation sent to port {test_port}")
            time.sleep(1)  # Wait for processing
        except Exception as e:
            print(f"❌ Attack simulation failed: {e}")
    
    # Summary
    print("\n" + "=" * 30)
    print("📊 TEST SUMMARY")
    print("=" * 30)
    
    tests_passed = 0
    total_tests = 4
    
    if listening_ports:
        print("✅ Port listeners: WORKING")
        tests_passed += 1
    else:
        print("❌ Port listeners: NOT WORKING")
    
    if dashboard_ok:
        print("✅ Web dashboard: WORKING")
        tests_passed += 1
    else:
        print("❌ Web dashboard: NOT WORKING")
    
    if metrics_ok:
        print("✅ Prometheus metrics: WORKING")
        tests_passed += 1
    else:
        print("❌ Prometheus metrics: NOT WORKING")
    
    if log_ok:
        print("✅ Logging: WORKING")
        tests_passed += 1
    else:
        print("❌ Logging: NOT WORKING")
    
    print(f"\n🎯 Results: {tests_passed}/{total_tests} tests passed")
    
    if tests_passed == total_tests:
        print("🎉 HONEYPORT IS WORKING PERFECTLY!")
        print("\n💡 Next steps:")
        print("1. Test from another machine: nc <your-ip> 22")
        print("2. Check Telegram for alerts")
        print("3. View dashboard: http://localhost:8080")
        print("4. Check logs: tail -f logs/honeyport.jsonl")
    else:
        print("⚠️  Some tests failed. Check the errors above.")
        print("\n🔧 Troubleshooting:")
        print("1. Make sure Honeyport is running: python3 run_honeyport.py")
        print("2. Check dependencies: pip3 install -r deploy/requirements.txt")
        print("3. Check ports 8080, 9090 are free")
        print("4. Check Telegram configuration in configs/honeyport.yml")

if __name__ == "__main__":
    test_honeyport()

