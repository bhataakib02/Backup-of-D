"""
IDS/Intrusion Detection Routes - Functions 141-210
AI/ML Cybersecurity Platform
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import logging
from datetime import datetime

from services.ids_service import get_ids_service
from utils.logging_utils import get_security_logger, get_audit_logger
from database.models import User, UserAction

# Create blueprint
ids_bp = Blueprint('ids', __name__)

# Get service instances
ids_service = get_ids_service()
security_logger = get_security_logger()
audit_logger = get_audit_logger()

logger = logging.getLogger(__name__)

@ids_bp.route('/analyze-pcap', methods=['POST'])
@jwt_required()
def analyze_pcap_file():
    """Function 49: Upload PCAP file for IDS"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze PCAP file
        result = ids_service.analyze_pcap_file(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        # Log user action
        user_id = get_jwt_identity()
        audit_logger.log_user_action(
            user_id=user_id,
            action='analyze_pcap',
            resource='ids_detection',
            details={'filename': filename, 'result': result}
        )
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_pcap_file: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/live-capture', methods=['POST'])
@jwt_required()
def live_capture():
    """Function 50: Live capture via NIC"""
    try:
        data = request.get_json()
        interface = data.get('interface', 'eth0')
        duration = data.get('duration', 60)
        
        result = ids_service.live_capture(interface, duration)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in live_capture: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/analyze-netflow', methods=['POST'])
@jwt_required()
def analyze_netflow_logs():
    """Function 51: Import NetFlow logs"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze NetFlow logs
        result = ids_service.analyze_netflow_logs(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_netflow_logs: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/analyze-system-logs', methods=['POST'])
@jwt_required()
def analyze_system_logs():
    """Function 52: Import system logs"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze system logs
        result = ids_service.analyze_system_logs(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_system_logs: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/ip-features', methods=['POST'])
@jwt_required()
def extract_ip_features():
    """Function 53: Network feature extraction - source/dest IP"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Extract IP features
        result = ids_service.extract_ip_features(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in extract_ip_features: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/port-features', methods=['POST'])
@jwt_required()
def extract_port_features():
    """Function 54: Network feature extraction - ports, bytes, duration"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Extract port features
        result = ids_service.extract_port_features(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in extract_port_features: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/tcp-flags', methods=['POST'])
@jwt_required()
def analyze_tcp_flags():
    """Function 55: TCP flags analysis"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze TCP flags
        result = ids_service.analyze_tcp_flags(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_tcp_flags: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/protocol-analysis', methods=['POST'])
@jwt_required()
def analyze_protocols():
    """Function 56: Protocol analysis"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze protocols
        result = ids_service.analyze_protocols(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_protocols: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/failed-logins', methods=['POST'])
@jwt_required()
def analyze_failed_logins():
    """Function 57: Host features - failed logins"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze failed logins
        result = ids_service.analyze_failed_logins(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_failed_logins: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/privilege-escalations', methods=['POST'])
@jwt_required()
def analyze_privilege_escalations():
    """Function 58: Host features - privilege escalations"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze privilege escalations
        result = ids_service.analyze_privilege_escalations(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_privilege_escalations: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/file-integrity', methods=['POST'])
@jwt_required()
def analyze_file_integrity():
    """Function 59: Host features - file integrity changes"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze file integrity
        result = ids_service.analyze_file_integrity(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_file_integrity: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/suspicious-processes', methods=['POST'])
@jwt_required()
def analyze_suspicious_processes():
    """Function 60: Host features - suspicious process detection"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Analyze suspicious processes
        result = ids_service.analyze_suspicious_processes(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_suspicious_processes: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/supervised-classifier', methods=['POST'])
@jwt_required()
def classify_attacks_supervised():
    """Function 61: Supervised classifier"""
    try:
        data = request.get_json()
        features = data.get('features')
        
        if not features:
            return jsonify({'error': 'Features are required'}), 400
        
        result = ids_service.classify_attacks_supervised(features)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in classify_attacks_supervised: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/anomaly-detection', methods=['POST'])
@jwt_required()
def detect_anomalies():
    """Function 62: Anomaly detection"""
    try:
        data = request.get_json()
        features = data.get('features')
        
        if not features:
            return jsonify({'error': 'Features are required'}), 400
        
        result = ids_service.detect_anomalies(features)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in detect_anomalies: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/sequence-detection', methods=['POST'])
@jwt_required()
def detect_attack_sequences():
    """Function 63: Sequence-based detection"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Detect attack sequences
        result = ids_service.detect_attack_sequences(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in detect_attack_sequences: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict_intrusion():
    """Function 64: IDS prediction"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Input data is required'}), 400
        
        result = ids_service.predict_intrusion(data)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in predict_intrusion: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/identify-attack-type', methods=['POST'])
@jwt_required()
def identify_attack_type():
    """Function 65: IDS output - Attack type"""
    try:
        data = request.get_json()
        attack_detections = data.get('attack_detections', [])
        
        result = ids_service.identify_attack_type(attack_detections)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in identify_attack_type: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/traffic-visualization', methods=['POST'])
@jwt_required()
def visualize_traffic():
    """Function 66: Traffic visualization"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Visualize traffic
        result = ids_service.visualize_traffic(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in visualize_traffic: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/suggest-ip-block', methods=['POST'])
@jwt_required()
def suggest_ip_block():
    """Function 67: Suggested mitigation - block IP"""
    try:
        data = request.get_json()
        source_ip = data.get('source_ip')
        
        if not source_ip:
            return jsonify({'error': 'Source IP is required'}), 400
        
        result = ids_service.suggest_ip_block(source_ip)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in suggest_ip_block: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/suggest-admin-alert', methods=['POST'])
@jwt_required()
def suggest_admin_alert():
    """Function 68: Suggested mitigation - alert admin"""
    try:
        data = request.get_json()
        attack_details = data.get('attack_details')
        
        if not attack_details:
            return jsonify({'error': 'Attack details are required'}), 400
        
        result = ids_service.suggest_admin_alert(attack_details)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in suggest_admin_alert: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/comprehensive-analysis', methods=['POST'])
@jwt_required()
def comprehensive_analysis():
    """Comprehensive IDS analysis combining multiple functions"""
    try:
        if 'file' not in request.files:
            return jsonify({'error': 'No file provided'}), 400
        
        file = request.files['file']
        if file.filename == '':
            return jsonify({'error': 'No file selected'}), 400
        
        # Save uploaded file
        filename = secure_filename(file.filename)
        filepath = os.path.join(current_app.config['UPLOAD_FOLDER'], filename)
        file.save(filepath)
        
        # Perform comprehensive analysis
        results = {}
        
        # Basic PCAP analysis
        results['pcap_analysis'] = ids_service.analyze_pcap_file(filepath)
        
        # Network feature analysis
        results['ip_features'] = ids_service.extract_ip_features(filepath)
        results['port_features'] = ids_service.extract_port_features(filepath)
        results['tcp_flags'] = ids_service.analyze_tcp_flags(filepath)
        results['protocol_analysis'] = ids_service.analyze_protocols(filepath)
        
        # ML analysis
        if results['pcap_analysis'].get('network_features'):
            features = results['pcap_analysis']['network_features']
            results['supervised_classification'] = ids_service.classify_attacks_supervised(features)
            results['anomaly_detection'] = ids_service.detect_anomalies(features)
        
        # Sequence analysis
        results['sequence_detection'] = ids_service.detect_attack_sequences(filepath)
        
        # Traffic visualization
        results['traffic_visualization'] = ids_service.visualize_traffic(filepath)
        
        # Final prediction
        input_data = {
            'features': results['pcap_analysis'].get('network_features', {}),
            'packets': filepath
        }
        results['final_prediction'] = ids_service.predict_intrusion(input_data)
        
        # Attack type identification
        results['attack_type_identification'] = ids_service.identify_attack_type(
            results['pcap_analysis'].get('attack_detections', [])
        )
        
        # Clean up uploaded file
        os.remove(filepath)
        
        # Log user action
        user_id = get_jwt_identity()
        audit_logger.log_user_action(
            user_id=user_id,
            action='comprehensive_ids_analysis',
            resource='ids_detection',
            details={'filename': filename, 'result': results}
        )
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Error in comprehensive_analysis: {str(e)}")
        return jsonify({'error': str(e)}), 500

@ids_bp.route('/health', methods=['GET'])
def health_check():
    """Health check for IDS detection service"""
    try:
        return jsonify({
            'status': 'healthy',
            'service': 'ids_detection',
            'functions_implemented': list(range(141, 211)),
            'models_loaded': list(ids_service.models.keys()),
            'attack_patterns_loaded': len(ids_service.attack_patterns),
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in health_check: {str(e)}")
        return jsonify({'error': str(e)}), 500


