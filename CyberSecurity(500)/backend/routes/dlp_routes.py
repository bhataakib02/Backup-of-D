from flask import Blueprint, request, jsonify
from utils.rbac import roles_required, tenant_required
from datetime import datetime
import re

dlp_bp = Blueprint('dlp', __name__)

SIMPLE_PATTERNS = {
    'PII_EMAIL': re.compile(r'[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}'),
    'PII_PHONE': re.compile(r'\b\+?\d[\d\s\-]{7,}\b'),
    'CREDIT_CARD': re.compile(r'\b(?:\d[ -]*?){13,16}\b')
}

@dlp_bp.route('/dlp/classify', methods=['POST'])
@roles_required('admin', 'analyst', 'viewer')
@tenant_required
def dlp_classify():
    data = request.get_json() or {}
    content = data.get('content', '')
    tags = []
    for label, pattern in SIMPLE_PATTERNS.items():
        if pattern.search(content):
            tags.append(label)
    return jsonify({'success': True, 'tags': tags, 'timestamp': datetime.utcnow().isoformat()})

@dlp_bp.route('/dlp/tag', methods=['POST'])
@roles_required('admin', 'analyst')
@tenant_required
def dlp_tag():
    data = request.get_json() or {}
    resource_id = data.get('resource_id')
    tags = data.get('tags', [])
    if not resource_id:
        return jsonify({'success': False, 'error': 'resource_id is required'}), 400
    # Stub persistence
    return jsonify({'success': True, 'resource_id': resource_id, 'tags': tags})






