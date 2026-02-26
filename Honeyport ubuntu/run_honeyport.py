#!/usr/bin/env python3
"""
Honeyport Launcher Script
Simple script to run Honeyport for testing and development
"""

import os
import sys
import subprocess
from pathlib import Path

def main():
    """Launch Honeyport with proper environment setup"""
    
    # Get the directory containing this script
    script_dir = Path(__file__).parent.absolute()
    src_dir = script_dir / "src"
    
    # Change to src directory
    os.chdir(src_dir)
    
    # Add src to Python path
    sys.path.insert(0, str(src_dir))
    
    # Set environment variables
    os.environ['PYTHONPATH'] = str(src_dir)
    os.environ['PYTHONUNBUFFERED'] = '1'
    
    print("🚨 Starting Honeyport...")
    print(f"📁 Working directory: {src_dir}")
    print(f"🐍 Python path: {sys.path[0]}")
    print("=" * 50)
    
    try:
        # Import and run main
        from main import main as honeyport_main
        honeyport_main()
    except KeyboardInterrupt:
        print("\n🛑 Honeyport stopped by user")
    except Exception as e:
        print(f"❌ Error starting Honeyport: {e}")
        sys.exit(1)

if __name__ == "__main__":
    main()

