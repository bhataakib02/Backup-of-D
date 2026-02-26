from flask import Blueprint, request, jsonify
from utils.rbac import roles_required, tenant_required
from services.datastores import VectorClient

vector_bp = Blueprint('vector', __name__)

@vector_bp.route('/vector/search', methods=['POST'])
@roles_required('admin', 'analyst', 'viewer')
@tenant_required
def vector_search():
    data = request.get_json() or {}
    query = data.get('query')
    k = int(data.get('k', 5))
    if not query:
        return jsonify({'success': False, 'error': 'query is required'}), 400
    # Stubbed search result
    client = VectorClient()
    health = client.health()
    results = [
        {'id': f'item_{i}', 'score': 1.0 - i*0.1, 'metadata': {'type': 'ioc'}}
        for i in range(max(1, min(k, 10)))
    ]
    return jsonify({'success': True, 'vector': {'health': health, 'results': results}})






