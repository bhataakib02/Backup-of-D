from flask import Blueprint, request, jsonify
from utils.rbac import roles_required, tenant_required
from datetime import datetime

darkweb_bp = Blueprint('darkweb', __name__)

@darkweb_bp.route('/darkweb/search', methods=['POST'])
@roles_required('admin', 'analyst')
@tenant_required
def darkweb_search():
    data = request.get_json() or {}
    query = data.get('query')
    if not query:
        return jsonify({'success': False, 'error': 'query is required'}), 400
    # Stub results
    results = [
        {'source': 'forumX', 'title': f'Leak related to {query}', 'date': datetime.utcnow().isoformat()},
        {'source': 'marketY', 'title': f'Credentials mentioning {query}', 'date': datetime.utcnow().isoformat()}
    ]
    return jsonify({'success': True, 'results': results})

@darkweb_bp.route('/darkweb/crawlers/config', methods=['POST'])
@roles_required('admin')
@tenant_required
def crawlers_config():
    data = request.get_json() or {}
    enabled_sources = data.get('enabled_sources', [])
    interval_minutes = int(data.get('interval_minutes', 60))
    return jsonify({'success': True, 'config': {'enabled_sources': enabled_sources, 'interval_minutes': interval_minutes}})






