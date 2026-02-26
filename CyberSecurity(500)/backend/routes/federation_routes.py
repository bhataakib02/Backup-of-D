from flask import Blueprint, request, jsonify
from utils.rbac import roles_required, tenant_required
from services.federation_service import get_federation

federation_bp = Blueprint('federation', __name__)

@federation_bp.route('/federation/join', methods=['POST'])
@roles_required('admin', 'mlops')
@tenant_required
def federation_join():
    data = request.get_json() or {}
    org_id = data.get('org_id')
    capabilities = data.get('capabilities', {})
    if not org_id:
        return jsonify({'success': False, 'error': 'org_id is required'}), 400
    result = get_federation().join(org_id, capabilities)
    return jsonify({'success': True, 'data': result})

@federation_bp.route('/federation/submit', methods=['POST'])
@roles_required('admin', 'mlops')
@tenant_required
def federation_submit():
    data = request.get_json() or {}
    org_id = data.get('org_id')
    update_hash = data.get('update_hash')
    metrics = data.get('metrics', {})
    if not org_id or not update_hash:
        return jsonify({'success': False, 'error': 'org_id and update_hash required'}), 400
    result = get_federation().submit_update(org_id, update_hash, metrics)
    return jsonify({'success': True, 'data': result})

@federation_bp.route('/federation/aggregate', methods=['POST'])
@roles_required('admin', 'mlops')
@tenant_required
def federation_aggregate():
    result = get_federation().aggregate()
    return jsonify({'success': True, 'data': result})

@federation_bp.route('/federation/status', methods=['GET'])
@roles_required('admin', 'mlops', 'analyst', 'viewer')
@tenant_required
def federation_status():
    result = get_federation().status()
    return jsonify({'success': True, 'data': result})






