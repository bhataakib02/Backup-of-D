"""
SOAR Playbooks: simple runner with Slack notify and IP block (iptables placeholder)
"""

from flask import Blueprint, request, jsonify, current_app
from flask_jwt_extended import jwt_required
from utils.rbac import roles_required
from utils.security_utils import zero_trust_required
import requests
import subprocess
from datetime import datetime

soar_bp = Blueprint('soar', __name__)

def notify_slack(webhook_url: str, message: str) -> bool:
    try:
        resp = requests.post(webhook_url, json={'text': message}, timeout=5)
        return resp.status_code in (200, 204)
    except Exception:
        return False

def block_ip(ip: str) -> bool:
    # Placeholder: In real env, integrate with firewall/API
    try:
        # subprocess.run(['iptables', '-A', 'INPUT', '-s', ip, '-j', 'DROP'], check=True)
        return True
    except Exception:
        return False

@soar_bp.route('/soar/run', methods=['POST'])
@roles_required('analyst', 'admin')
@zero_trust_required
def run_playbook():
    data = request.get_json() or {}
    playbook = data.get('playbook')
    params = data.get('params', {})
    if not playbook:
        return jsonify({'error': 'playbook is required'}), 400

    results = {}

    if playbook == 'notify_slack':
        webhook = current_app.config.get('SLACK_WEBHOOK_URL')
        message = params.get('message', 'Security event triggered')
        ok = notify_slack(webhook, message) if webhook else False
        results['notify_slack'] = ok
    elif playbook == 'block_ip':
        ip = params.get('ip')
        if not ip:
            return jsonify({'error': 'ip parameter required'}), 400
        ok = block_ip(ip)
        results['block_ip'] = ok
    elif playbook == 'notify_and_block':
        webhook = current_app.config.get('SLACK_WEBHOOK_URL')
        ip = params.get('ip')
        message = params.get('message', f'Blocking IP {ip}')
        ok1 = notify_slack(webhook, message) if webhook else False
        ok2 = block_ip(ip) if ip else False
        results['notify_slack'] = ok1
        results['block_ip'] = ok2
    else:
        return jsonify({'error': 'Unknown playbook'}), 400

    return jsonify({'success': True, 'results': results})


@soar_bp.route('/soar/playbooks', methods=['GET'])
@roles_required('analyst', 'admin', 'viewer')
@zero_trust_required
def list_playbooks():
    playbooks = [
        {
            'name': 'notify_slack',
            'params': ['message'],
            'description': 'Send a Slack notification via configured webhook'
        },
        {
            'name': 'block_ip',
            'params': ['ip'],
            'description': 'Block an IP address at the network perimeter'
        },
        {
            'name': 'notify_and_block',
            'params': ['ip', 'message'],
            'description': 'Notify Slack then block the IP address'
        }
    ]
    return jsonify({'success': True, 'playbooks': playbooks, 'timestamp': datetime.utcnow().isoformat()})


@soar_bp.route('/soar/validate', methods=['POST'])
@roles_required('analyst', 'admin')
@zero_trust_required
def validate_playbook():
    data = request.get_json() or {}
    name = data.get('playbook')
    params = data.get('params', {})
    required = {
        'notify_slack': ['message'],
        'block_ip': ['ip'],
        'notify_and_block': ['ip', 'message']
    }
    if name not in required:
        return jsonify({'success': False, 'error': 'Unknown playbook'}), 400
    missing = [p for p in required[name] if p not in params or params.get(p) in (None, '')]
    return jsonify({'success': len(missing) == 0, 'missing': missing})


