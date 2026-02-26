"""
Verification script for ITDR system installation
Checks all dependencies and module imports
"""

import sys
import importlib

def check_import(module_name, package_name=None):
    """Check if a module can be imported"""
    try:
        importlib.import_module(module_name)
        print(f"✓ {package_name or module_name}")
        return True
    except ImportError as e:
        print(f"✗ {package_name or module_name}: {e}")
        return False

def main():
    print("ITDR System - Installation Verification")
    print("=" * 50)
    
    # Core dependencies
    print("\nCore Dependencies:")
    core_deps = [
        ('numpy', 'numpy'),
        ('pandas', 'pandas'),
        ('sklearn', 'scikit-learn'),
        ('scipy', 'scipy'),
    ]
    
    core_ok = all(check_import(mod, pkg) for mod, pkg in core_deps)
    
    # Deep learning
    print("\nDeep Learning:")
    tf_ok = check_import('tensorflow', 'tensorflow')
    keras_ok = check_import('keras', 'keras')
    
    # Web framework
    print("\nWeb Framework:")
    flask_ok = check_import('flask', 'flask')
    flask_cors_ok = check_import('flask_cors', 'flask-cors')
    
    # Data processing
    print("\nData Processing:")
    yaml_ok = check_import('yaml', 'pyyaml')
    dateutil_ok = check_import('dateutil', 'python-dateutil')
    
    # ITDR modules
    print("\nITDR Modules:")
    sys.path.insert(0, '.')
    
    itdr_modules = [
        ('src.ingestion.lanl_loader', 'LANL Loader'),
        ('src.ingestion.cert_loader', 'CERT Loader'),
        ('src.preprocessing.feature_engineer', 'Feature Engineer'),
        ('src.risk.risk_scorer', 'Risk Scorer'),
        ('src.mitre.mitre_mapper', 'MITRE Mapper'),
        ('src.explainability.explainer', 'Explainer'),
        ('src.response.response_engine', 'Response Engine'),
    ]
    
    itdr_ok = True
    for mod, name in itdr_modules:
        try:
            importlib.import_module(mod)
            print(f"✓ {name}")
        except Exception as e:
            print(f"✗ {name}: {e}")
            itdr_ok = False
    
    # Behavioral model (may have TensorFlow issues)
    print("\nBehavioral Model:")
    try:
        from src.modeling.behavioral_model import BehavioralModel
        print("✓ Behavioral Model")
        behavioral_ok = True
    except Exception as e:
        print(f"⚠ Behavioral Model: {e}")
        print("  (This may require TensorFlow/Keras setup)")
        behavioral_ok = False
    
    # Summary
    print("\n" + "=" * 50)
    print("Summary:")
    
    all_ok = core_ok and flask_ok and yaml_ok and itdr_ok
    
    if all_ok:
        print("✅ Core system is ready!")
        if behavioral_ok:
            print("✅ All components including ML models are ready!")
        else:
            print("⚠ ML models need TensorFlow/Keras setup")
            print("  Run: pip install tensorflow>=2.13.0")
    else:
        print("❌ Some dependencies are missing")
        print("  Run: pip install -r requirements.txt")
    
    return all_ok

if __name__ == '__main__':
    success = main()
    sys.exit(0 if success else 1)

