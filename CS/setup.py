"""
Setup script for ITDR System
Creates necessary directories and validates setup
"""

import os
import sys
from pathlib import Path

def create_directories():
    """Create necessary directories"""
    directories = [
        'data/raw/lanl',
        'data/raw/cert',
        'data/processed',
        'data/models',
        'logs',
        'results',
        'app/templates'
    ]
    
    for directory in directories:
        os.makedirs(directory, exist_ok=True)
        print(f"Created directory: {directory}")

def check_python_version():
    """Check Python version"""
    if sys.version_info < (3, 9):
        print("Error: Python 3.9 or higher is required")
        return False
    print(f"Python version: {sys.version}")
    return True

def check_dependencies():
    """Check if required packages are installed"""
    required_packages = [
        'numpy', 'pandas', 'scikit-learn', 'tensorflow', 'flask', 'yaml'
    ]
    
    missing = []
    for package in required_packages:
        try:
            __import__(package.replace('-', '_'))
        except ImportError:
            missing.append(package)
    
    if missing:
        print(f"Warning: Missing packages: {', '.join(missing)}")
        print("Install with: pip install -r requirements.txt")
        return False
    else:
        print("All required packages are installed")
        return True

def main():
    print("ITDR System Setup")
    print("=" * 50)
    
    # Check Python version
    if not check_python_version():
        sys.exit(1)
    
    # Create directories
    print("\nCreating directories...")
    create_directories()
    
    # Check dependencies
    print("\nChecking dependencies...")
    check_dependencies()
    
    print("\n" + "=" * 50)
    print("Setup complete!")
    print("\nNext steps:")
    print("1. Download datasets (see docs/datasets.md)")
    print("2. Preprocess data: python scripts/preprocess_data.py --dataset lanl")
    print("3. Train models: python scripts/train_models.py")
    print("4. Start dashboard: python app/main.py")

if __name__ == '__main__':
    main()

