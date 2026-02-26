from flask import Blueprint, request, jsonify
from utils.rbac import roles_required, tenant_required
from datetime import datetime
import random

gnn_bp = Blueprint('gnn', __name__)

@gnn_bp.route('/gnn/predict', methods=['POST'])
@roles_required('admin', 'analyst')
@tenant_required
def gnn_predict():
    data = request.get_json() or {}
    graph_summary = data.get('graph_summary', {})
    # Stubbed prediction
    risk = random.random()
    return jsonify({
        'success': True,
        'prediction': {
            'risk_score': round(0.5 + risk/2, 3),
            'confidence': round(0.7 + random.random()*0.3, 3),
            'attribution': ['ActorX', 'CampaignY'],
            'timestamp': datetime.utcnow().isoformat()
        },
        'input': graph_summary
    })






