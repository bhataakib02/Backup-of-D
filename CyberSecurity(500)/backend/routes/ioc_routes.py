"""
IOC Management Routes with basic CRUD and STIX/TAXII placeholders
"""

from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required
from utils.rbac import roles_required
from database.models import ThreatIntelligence as TI, db
from datetime import datetime

ioc_bp = Blueprint('ioc', __name__)

@ioc_bp.route('/ioc', methods=['POST'])
@roles_required('analyst', 'admin')
def create_ioc():
    data = request.get_json() or {}
    required = {'indicator_type', 'indicator_value', 'threat_type', 'severity', 'confidence', 'source'}
    if not required.issubset(set(data.keys())):
        return jsonify({'error': 'Missing required fields'}), 400

    ti = TI(
        indicator_type=data['indicator_type'],
        indicator_value=data['indicator_value'],
        threat_type=data['threat_type'],
        severity=data['severity'],
        confidence=float(data['confidence']),
        source=data['source'],
        description=data.get('description'),
        tags=data.get('tags', []),
        event_metadata=data.get('metadata', {}),
        first_seen=datetime.utcnow(),
        last_seen=datetime.utcnow(),
        is_active=True
    )
    db.session.add(ti)
    db.session.commit()
    return jsonify({'success': True, 'ioc': ti.to_dict()}), 201

@ioc_bp.route('/ioc', methods=['GET'])
@jwt_required()
def list_iocs():
    query = TI.query
    indicator_type = request.args.get('type')
    if indicator_type:
        query = query.filter_by(indicator_type=indicator_type)
    indicators = [i.to_dict() for i in query.order_by(TI.last_seen.desc()).limit(200).all()]
    return jsonify({'items': indicators, 'total': len(indicators)})

@ioc_bp.route('/ioc/<int:ioc_id>', methods=['PUT'])
@roles_required('analyst', 'admin')
def update_ioc(ioc_id: int):
    ti = TI.query.get_or_404(ioc_id)
    data = request.get_json() or {}
    for field in ['threat_type', 'severity', 'confidence', 'description', 'tags', 'is_active']:
        if field in data:
            setattr(ti, field, data[field])
    ti.last_seen = datetime.utcnow()
    db.session.commit()
    return jsonify({'success': True, 'ioc': ti.to_dict()})

@ioc_bp.route('/ioc/<int:ioc_id>', methods=['DELETE'])
@roles_required('admin')
def delete_ioc(ioc_id: int):
    ti = TI.query.get_or_404(ioc_id)
    db.session.delete(ti)
    db.session.commit()
    return jsonify({'success': True})

@ioc_bp.route('/ioc/stix/import', methods=['POST'])
@roles_required('analyst', 'admin')
def import_stix():
    # Placeholder for parsing STIX bundles
    bundle = request.get_json() or {}
    count = len(bundle.get('objects', []))
    return jsonify({'success': True, 'imported': count})

@ioc_bp.route('/ioc/stix/export', methods=['GET'])
@roles_required('analyst', 'admin')
def export_stix():
    # Placeholder STIX bundle
    items = [i.to_dict() for i in TI.query.limit(100).all()]
    bundle = {'type': 'bundle', 'objects': items}
    return jsonify(bundle)


