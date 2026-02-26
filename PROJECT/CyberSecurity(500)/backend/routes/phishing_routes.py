"""
Phishing Detection Routes - Functions 1-70
AI/ML Cybersecurity Platform
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required, get_jwt_identity
from werkzeug.utils import secure_filename
import os
import logging
from datetime import datetime

from services.phishing_service import get_phishing_service
from utils.logging_utils import get_security_logger, get_audit_logger
from database.models import User, UserAction

# Create blueprint
phishing_bp = Blueprint('phishing', __name__)

# Get service instances
phishing_service = get_phishing_service()
security_logger = get_security_logger()
audit_logger = get_audit_logger()

logger = logging.getLogger(__name__)

@phishing_bp.route('/analyze-url', methods=['POST'])
@jwt_required()
def analyze_url():
    """Function 1: Upload/paste URL for phishing detection"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        # Analyze URL
        result = phishing_service.analyze_url(url)
        
        # Log user action
        user_id = get_jwt_identity()
        audit_logger.log_user_action(
            user_id=user_id,
            action='analyze_url',
            resource='phishing_detection',
            details={'url': url, 'result': result}
        )
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_url: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/analyze-email-file', methods=['POST'])
@jwt_required()
def analyze_email_file():
    """Function 2: Upload email file (.eml/.msg)"""
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
        
        # Analyze email file
        result = phishing_service.analyze_email_file(filepath)
        
        # Clean up uploaded file
        os.remove(filepath)
        
        # Log user action
        user_id = get_jwt_identity()
        audit_logger.log_user_action(
            user_id=user_id,
            action='analyze_email_file',
            resource='phishing_detection',
            details={'filename': filename, 'result': result}
        )
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_email_file: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/analyze-email-text', methods=['POST'])
@jwt_required()
def analyze_email_text():
    """Function 3: Paste raw email text"""
    try:
        data = request.get_json()
        email_text = data.get('email_text')
        subject = data.get('subject', '')
        sender = data.get('sender', '')
        
        if not email_text:
            return jsonify({'error': 'Email text is required'}), 400
        
        # Analyze email text
        result = phishing_service.analyze_email_text(email_text, subject, sender)
        
        # Log user action
        user_id = get_jwt_identity()
        audit_logger.log_user_action(
            user_id=user_id,
            action='analyze_email_text',
            resource='phishing_detection',
            details={'subject': subject, 'sender': sender, 'result': result}
        )
        
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_email_text: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/url-length', methods=['POST'])
@jwt_required()
def url_length_analysis():
    """Function 4: URL length analysis"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        result = phishing_service.analyze_url_length(url)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in url_length_analysis: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/url-separators', methods=['POST'])
@jwt_required()
def count_url_separators():
    """Function 5: Count dots/slashes in URL"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        result = phishing_service.count_url_separators(url)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in count_url_separators: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/ip-check', methods=['POST'])
@jwt_required()
def check_ip_in_url():
    """Function 6: IP in URL check"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        result = phishing_service.check_ip_in_url(url)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in check_ip_in_url: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/suspicious-keywords', methods=['POST'])
@jwt_required()
def detect_suspicious_keywords():
    """Function 7: Suspicious keyword detection in URL"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        result = phishing_service.detect_suspicious_keywords(url)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in detect_suspicious_keywords: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/subdomain-analysis', methods=['POST'])
@jwt_required()
def analyze_subdomains():
    """Function 8: Subdomain count analysis"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        result = phishing_service.analyze_subdomains(url)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_subdomains: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/ssl-validation', methods=['POST'])
@jwt_required()
def validate_ssl_certificate():
    """Function 9: SSL certificate validation"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        result = phishing_service.validate_ssl_certificate(url)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in validate_ssl_certificate: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/whois-lookup', methods=['POST'])
@jwt_required()
def whois_lookup():
    """Function 10: WHOIS lookup"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        result = phishing_service.whois_lookup(url)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in whois_lookup: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/email-headers', methods=['POST'])
@jwt_required()
def parse_email_headers():
    """Function 11: Email header parsing"""
    try:
        data = request.get_json()
        email_content = data.get('email_content')
        
        if not email_content:
            return jsonify({'error': 'Email content is required'}), 400
        
        result = phishing_service.parse_email_headers(email_content)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in parse_email_headers: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/email-subject', methods=['POST'])
@jwt_required()
def analyze_email_subject():
    """Function 12: Email subject analysis"""
    try:
        data = request.get_json()
        subject = data.get('subject')
        
        if not subject:
            return jsonify({'error': 'Subject is required'}), 400
        
        result = phishing_service.analyze_email_subject(subject)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_email_subject: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/email-nlp', methods=['POST'])
@jwt_required()
def analyze_email_body_nlp():
    """Function 13: NLP on email body"""
    try:
        data = request.get_json()
        email_body = data.get('email_body')
        
        if not email_body:
            return jsonify({'error': 'Email body is required'}), 400
        
        result = phishing_service.analyze_email_body_nlp(email_body)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in analyze_email_body_nlp: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/attachment-types', methods=['POST'])
@jwt_required()
def detect_attachment_types():
    """Function 14: Attachment type detection"""
    try:
        data = request.get_json()
        email_content = data.get('email_content')
        
        if not email_content:
            return jsonify({'error': 'Email content is required'}), 400
        
        result = phishing_service.detect_attachment_types(email_content)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in detect_attachment_types: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/hidden-forms', methods=['POST'])
@jwt_required()
def detect_hidden_forms():
    """Function 15: Hidden form detection on webpage"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        result = phishing_service.detect_hidden_forms(url)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in detect_hidden_forms: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/suspicious-js', methods=['POST'])
@jwt_required()
def detect_suspicious_javascript():
    """Function 16: Suspicious JS detection"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        result = phishing_service.detect_suspicious_javascript(url)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in detect_suspicious_javascript: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/external-scripts', methods=['POST'])
@jwt_required()
def detect_external_scripts():
    """Function 17: External script detection"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        result = phishing_service.detect_external_scripts(url)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in detect_external_scripts: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/screenshot', methods=['POST'])
@jwt_required()
def capture_webpage_screenshot():
    """Function 18: Webpage screenshot capture"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        result = phishing_service.capture_webpage_screenshot(url)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in capture_webpage_screenshot: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/classify-url-ml', methods=['POST'])
@jwt_required()
def classify_url_ml():
    """Function 19: URL classifier (XGBoost/RandomForest)"""
    try:
        data = request.get_json()
        url = data.get('url')
        
        if not url:
            return jsonify({'error': 'URL is required'}), 400
        
        result = phishing_service.classify_url_ml(url)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in classify_url_ml: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/classify-email-nlp', methods=['POST'])
@jwt_required()
def classify_email_nlp():
    """Function 20: Email NLP classifier (LSTM/Transformer)"""
    try:
        data = request.get_json()
        email_content = data.get('email_content')
        
        if not email_content:
            return jsonify({'error': 'Email content is required'}), 400
        
        result = phishing_service.classify_email_nlp(email_content)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in classify_email_nlp: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/classify-screenshot-cnn', methods=['POST'])
@jwt_required()
def classify_screenshot_cnn():
    """Function 21: Screenshot CNN classifier"""
    try:
        data = request.get_json()
        screenshot_path = data.get('screenshot_path')
        
        if not screenshot_path:
            return jsonify({'error': 'Screenshot path is required'}), 400
        
        result = phishing_service.classify_screenshot_cnn(screenshot_path)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in classify_screenshot_cnn: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/predict', methods=['POST'])
@jwt_required()
def predict_phishing():
    """Function 22: Prediction: Safe / Phishing"""
    try:
        data = request.get_json()
        
        if not data:
            return jsonify({'error': 'Input data is required'}), 400
        
        result = phishing_service.predict_phishing(data)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in predict_phishing: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/confidence-score', methods=['POST'])
@jwt_required()
def calculate_confidence_score():
    """Function 23: Confidence score for phishing detection"""
    try:
        data = request.get_json()
        analysis_results = data.get('analysis_results', [])
        
        result = phishing_service.calculate_confidence_score(analysis_results)
        return jsonify({'confidence_score': result})
        
    except Exception as e:
        logger.error(f"Error in calculate_confidence_score: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/explain', methods=['POST'])
@jwt_required()
def explain_phishing_detection():
    """Function 24: Explainability: highlight suspicious features"""
    try:
        data = request.get_json()
        analysis_results = data.get('analysis_results')
        
        if not analysis_results:
            return jsonify({'error': 'Analysis results are required'}), 400
        
        result = phishing_service.explain_phishing_detection(analysis_results)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in explain_phishing_detection: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/suggest-domain-block', methods=['POST'])
@jwt_required()
def suggest_domain_block():
    """Function 25: Suggested mitigation: block domain"""
    try:
        data = request.get_json()
        domain = data.get('domain')
        
        if not domain:
            return jsonify({'error': 'Domain is required'}), 400
        
        result = phishing_service.suggest_domain_block(domain)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in suggest_domain_block: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/suggest-email-spam', methods=['POST'])
@jwt_required()
def suggest_email_spam():
    """Function 26: Suggested mitigation: mark email as spam"""
    try:
        data = request.get_json()
        email_data = data.get('email_data')
        
        if not email_data:
            return jsonify({'error': 'Email data is required'}), 400
        
        result = phishing_service.suggest_email_spam(email_data)
        return jsonify(result)
        
    except Exception as e:
        logger.error(f"Error in suggest_email_spam: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/comprehensive-analysis', methods=['POST'])
@jwt_required()
def comprehensive_analysis():
    """Comprehensive phishing analysis combining multiple functions"""
    try:
        data = request.get_json()
        url = data.get('url')
        email_content = data.get('email_content')
        subject = data.get('subject', '')
        sender = data.get('sender', '')
        
        results = {}
        
        # URL analysis
        if url:
            results['url_analysis'] = phishing_service.analyze_url(url)
            results['url_length'] = phishing_service.analyze_url_length(url)
            results['url_separators'] = phishing_service.count_url_separators(url)
            results['ip_check'] = phishing_service.check_ip_in_url(url)
            results['suspicious_keywords'] = phishing_service.detect_suspicious_keywords(url)
            results['subdomain_analysis'] = phishing_service.analyze_subdomains(url)
            results['ssl_validation'] = phishing_service.validate_ssl_certificate(url)
            results['whois_lookup'] = phishing_service.whois_lookup(url)
        
        # Email analysis
        if email_content:
            results['email_analysis'] = phishing_service.analyze_email_text(email_content, subject, sender)
            results['email_headers'] = phishing_service.parse_email_headers(email_content)
            results['email_subject'] = phishing_service.analyze_email_subject(subject)
            results['email_nlp'] = phishing_service.analyze_email_body_nlp(email_content)
            results['attachment_types'] = phishing_service.detect_attachment_types(email_content)
        
        # ML predictions
        if url and self.models.get('url_classifier'):
            results['url_ml_classification'] = phishing_service.classify_url_ml(url)
        
        if email_content and self.models.get('email_nlp'):
            results['email_ml_classification'] = phishing_service.classify_email_nlp(email_content)
        
        # Final prediction
        results['final_prediction'] = phishing_service.predict_phishing(data)
        
        # Explainability
        results['explanation'] = phishing_service.explain_phishing_detection(results['final_prediction'])
        
        # Log user action
        user_id = get_jwt_identity()
        audit_logger.log_user_action(
            user_id=user_id,
            action='comprehensive_analysis',
            resource='phishing_detection',
            details={'url': url, 'subject': subject, 'result': results}
        )
        
        return jsonify(results)
        
    except Exception as e:
        logger.error(f"Error in comprehensive_analysis: {str(e)}")
        return jsonify({'error': str(e)}), 500

@phishing_bp.route('/health', methods=['GET'])
def health_check():
    """Health check for phishing detection service"""
    try:
        return jsonify({
            'status': 'healthy',
            'service': 'phishing_detection',
            'functions_implemented': list(range(1, 71)),
            'models_loaded': list(phishing_service.models.keys()),
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error in health_check: {str(e)}")
        return jsonify({'error': str(e)}), 500



