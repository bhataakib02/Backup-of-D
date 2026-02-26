"""
Threat Intelligence API Routes
AI/ML Cybersecurity Platform
"""

from flask import Blueprint, request, jsonify, current_app
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
import logging
from datetime import datetime

from services.threat_intel_service import get_threat_intel_service

threat_intel_bp = Blueprint('threat_intel', __name__)
logger = logging.getLogger(__name__)

# Limiter will be initialized in the route decorators

@threat_intel_bp.route('/analyze-ip', methods=['POST'])
def analyze_ip():
    """Analyze IP address for threat intelligence"""
    try:
        data = request.get_json()
        if not data or 'ip_address' not in data:
            return jsonify({'error': 'IP address is required'}), 400
        
        ip_address = data['ip_address']
        service = get_threat_intel_service()
        
        result = service.analyze_ip_address(ip_address)
        
        return jsonify({
            'success': True,
            'data': result,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error analyzing IP: {str(e)}")
        return jsonify({'error': str(e)}), 500

@threat_intel_bp.route('/analyze-domain', methods=['POST'])
def analyze_domain():
    """Analyze domain for threat intelligence"""
    try:
        data = request.get_json()
        if not data or 'domain' not in data:
            return jsonify({'error': 'Domain is required'}), 400
        
        domain = data['domain']
        service = get_threat_intel_service()
        
        result = service.analyze_domain(domain)
        
        return jsonify({
            'success': True,
            'data': result,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error analyzing domain: {str(e)}")
        return jsonify({'error': str(e)}), 500

@threat_intel_bp.route('/analyze-hash', methods=['POST'])
def analyze_hash():
    """Analyze file hash for threat intelligence"""
    try:
        data = request.get_json()
        if not data or 'hash' not in data:
            return jsonify({'error': 'Hash is required'}), 400
        
        file_hash = data['hash']
        service = get_threat_intel_service()
        
        result = service.analyze_file_hash(file_hash)
        
        return jsonify({
            'success': True,
            'data': result,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error analyzing hash: {str(e)}")
        return jsonify({'error': str(e)}), 500

@threat_intel_bp.route('/threat-actors', methods=['GET'])
def get_threat_actors():
    """Get list of known threat actors"""
    try:
        service = get_threat_intel_service()
        result = service.get_threat_actors()
        
        return jsonify({
            'success': True,
            'data': result,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting threat actors: {str(e)}")
        return jsonify({'error': str(e)}), 500

@threat_intel_bp.route('/ioc-search', methods=['POST'])
def search_ioc():
    """Search for indicators of compromise"""
    try:
        data = request.get_json()
        if not data or 'ioc' not in data:
            return jsonify({'error': 'IOC is required'}), 400
        
        ioc = data['ioc']
        ioc_type = data.get('type', 'auto')
        
        service = get_threat_intel_service()
        result = service.search_ioc(ioc, ioc_type)
        
        return jsonify({
            'success': True,
            'data': result,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error searching IOC: {str(e)}")
        return jsonify({'error': str(e)}), 500

@threat_intel_bp.route('/reputation-check', methods=['POST'])
def reputation_check():
    """Check reputation of IP, domain, or hash"""
    try:
        data = request.get_json()
        if not data or 'indicator' not in data:
            return jsonify({'error': 'Indicator is required'}), 400
        
        indicator = data['indicator']
        indicator_type = data.get('type', 'auto')
        
        service = get_threat_intel_service()
        result = service.check_reputation(indicator, indicator_type)
        
        return jsonify({
            'success': True,
            'data': result,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error checking reputation: {str(e)}")
        return jsonify({'error': str(e)}), 500

@threat_intel_bp.route('/threat-feeds', methods=['GET'])
def get_threat_feeds():
    """Get available threat feeds"""
    try:
        service = get_threat_intel_service()
        result = service.get_threat_feeds()
        
        return jsonify({
            'success': True,
            'data': result,
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Error getting threat feeds: {str(e)}")
        return jsonify({'error': str(e)}), 500

@threat_intel_bp.route('/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    try:
        service = get_threat_intel_service()
        status = service.health_check()
        
        return jsonify({
            'status': 'healthy' if status else 'unhealthy',
            'service': 'threat_intel',
            'timestamp': datetime.utcnow().isoformat()
        })
        
    except Exception as e:
        logger.error(f"Health check failed: {str(e)}")
        return jsonify({
            'status': 'unhealthy',
            'service': 'threat_intel',
            'error': str(e),
            'timestamp': datetime.utcnow().isoformat()
        }), 500
