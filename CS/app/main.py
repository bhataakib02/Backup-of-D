"""
ITDR Dashboard - Main Entry Point
Flask-based dashboard for identity threat detection
"""

from flask import Flask, render_template, jsonify, request
from flask_cors import CORS
import yaml
import logging
import os
from datetime import datetime, timedelta
import json

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
CORS(app)

# Load configuration
config_path = os.path.join(os.path.dirname(os.path.dirname(__file__)), 'config', 'config.yaml')
with open(config_path, 'r') as f:
    config = yaml.safe_load(f)

# Import detection pipeline (will be initialized when needed)
detection_pipeline = None


def init_detection_pipeline():
    """Initialize detection pipeline (lazy loading)"""
    global detection_pipeline
    if detection_pipeline is None:
        from src.modeling.behavioral_model import BehavioralModel
        from src.detection.detection_pipeline import DetectionPipeline
        
        # Load behavioral model if available
        model_path = os.path.join('data', 'models', 'behavioral_model.h5')
        behavioral_model = None
        if os.path.exists(model_path):
            try:
                behavioral_model = BehavioralModel()
                behavioral_model.load(model_path)
                logger.info("Loaded behavioral model")
            except Exception as e:
                logger.warning(f"Could not load behavioral model: {e}")
        
        detection_pipeline = DetectionPipeline(config, behavioral_model)
        logger.info("Detection pipeline initialized")
    
    return detection_pipeline


@app.route('/')
def index():
    """Main dashboard page"""
    return render_template('index.html')


@app.route('/api/health')
def health():
    """Health check endpoint"""
    return jsonify({'status': 'ok', 'timestamp': datetime.now().isoformat()})


@app.route('/api/detections', methods=['GET'])
def get_detections():
    """Get recent detections"""
    # For demo: return sample detections
    # In production, would query from database
    
    # Read from audit log if available
    audit_log_path = config.get('logging', {}).get('audit_file', 'logs/audit.log')
    detections = []
    
    if os.path.exists(audit_log_path):
        try:
            with open(audit_log_path, 'r') as f:
                lines = f.readlines()
                for line in lines[-100:]:  # Last 100 entries
                    try:
                        entry = json.loads(line.strip())
                        detections.append(entry)
                    except json.JSONDecodeError:
                        continue
        except Exception as e:
            logger.error(f"Error reading audit log: {e}")
    
    # Sort by timestamp
    detections.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
    
    return jsonify({
        'detections': detections[:50],  # Return top 50
        'count': len(detections)
    })


@app.route('/api/stats', methods=['GET'])
def get_stats():
    """Get dashboard statistics"""
    # For demo: compute basic stats
    audit_log_path = config.get('logging', {}).get('audit_file', 'logs/audit.log')
    
    stats = {
        'total_detections': 0,
        'high_risk_count': 0,
        'medium_risk_count': 0,
        'low_risk_count': 0,
        'recent_detections': 0
    }
    
    if os.path.exists(audit_log_path):
        try:
            with open(audit_log_path, 'r') as f:
                for line in f:
                    try:
                        entry = json.loads(line.strip())
                        stats['total_detections'] += 1
                        
                        # Check risk level (would need to parse from entry)
                        # For now, use risk_score
                        risk_score = entry.get('risk_score', 0)
                        if risk_score >= 0.7:
                            stats['high_risk_count'] += 1
                        elif risk_score >= 0.3:
                            stats['medium_risk_count'] += 1
                        else:
                            stats['low_risk_count'] += 1
                        
                        # Recent (last 24 hours)
                        timestamp_str = entry.get('timestamp', '')
                        if timestamp_str:
                            timestamp = datetime.fromisoformat(timestamp_str.replace('Z', '+00:00'))
                            if timestamp > datetime.now() - timedelta(days=1):
                                stats['recent_detections'] += 1
                    except (json.JSONDecodeError, ValueError):
                        continue
        except Exception as e:
            logger.error(f"Error computing stats: {e}")
    
    return jsonify(stats)


@app.route('/api/detection/<session_id>', methods=['GET'])
def get_detection(session_id):
    """Get detailed detection for a specific session"""
    audit_log_path = config.get('logging', {}).get('audit_file', 'logs/audit.log')
    
    if os.path.exists(audit_log_path):
        try:
            with open(audit_log_path, 'r') as f:
                for line in f:
                    try:
                        entry = json.loads(line.strip())
                        if entry.get('session_id') == session_id:
                            return jsonify(entry)
                    except json.JSONDecodeError:
                        continue
        except Exception as e:
            logger.error(f"Error reading audit log: {e}")
    
    return jsonify({'error': 'Detection not found'}), 404


if __name__ == '__main__':
    # Ensure directories exist
    os.makedirs('logs', exist_ok=True)
    os.makedirs('data/models', exist_ok=True)
    
    host = config.get('dashboard', {}).get('host', '0.0.0.0')
    port = config.get('dashboard', {}).get('port', 5000)
    debug = config.get('dashboard', {}).get('debug', False)
    
    logger.info(f"Starting ITDR Dashboard on {host}:{port}")
    app.run(host=host, port=port, debug=debug)

