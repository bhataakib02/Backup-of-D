"""
Response Engine
Implements risk-adaptive response actions
"""

from typing import Dict, List, Optional
from datetime import datetime
import logging
import json
import os

logger = logging.getLogger(__name__)


class ResponseEngine:
    """Risk-adaptive response engine"""
    
    # Response actions (ordered by severity)
    RESPONSE_ACTIONS = {
        'monitor_only': {
            'name': 'Monitor Only',
            'description': 'Log event for review, no action taken',
            'severity': 0
        },
        'alert_analyst': {
            'name': 'Alert Security Analyst',
            'description': 'Create alert and notify security team',
            'severity': 1
        },
        'force_reauth': {
            'name': 'Force Re-authentication',
            'description': 'Require user to re-enter credentials',
            'severity': 2
        },
        'step_up_mfa': {
            'name': 'Step-up Authentication (MFA)',
            'description': 'Require multi-factor authentication',
            'severity': 3
        },
        'disable_account': {
            'name': 'Temporary Account Disable',
            'description': 'Disable account, require admin intervention',
            'severity': 4
        }
    }
    
    def __init__(self, config: Dict):
        """
        Initialize response engine
        
        Args:
            config: Configuration with response thresholds
        """
        self.config = config
        self.thresholds = config.get('actions', {
            'monitor_only': {'threshold': 0.3},
            'alert_analyst': {'threshold': 0.5},
            'force_reauth': {'threshold': 0.7},
            'step_up_mfa': {'threshold': 0.85},
            'disable_account': {'threshold': 0.95}
        })
        self.audit_log_path = config.get('audit_log_path', 'logs/audit.log')
        
        # Ensure audit log directory exists
        os.makedirs(os.path.dirname(self.audit_log_path), exist_ok=True)
    
    def determine_response(self, risk_score: float, risk_level: str) -> str:
        """
        Determine appropriate response action based on risk score
        
        Args:
            risk_score: Computed risk score [0, 1]
            risk_level: Risk level (Low/Medium/High/Critical)
        
        Returns:
            Response action name
        """
        # Check thresholds in order of severity (reverse)
        action_order = [
            'disable_account',
            'step_up_mfa',
            'force_reauth',
            'alert_analyst',
            'monitor_only'
        ]
        
        for action_name in action_order:
            threshold = self.thresholds.get(action_name, {}).get('threshold', 1.0)
            if risk_score >= threshold:
                return action_name
        
        # Default: monitor only
        return 'monitor_only'
    
    def execute_response(self, action: str, session_id: str, user_id: str,
                        risk_score: float, details: Dict) -> Dict:
        """
        Execute response action (simulated for academic project)
        
        Args:
            action: Response action name
            session_id: Session identifier
            user_id: User identifier
            risk_score: Risk score
            details: Additional details
        
        Returns:
            Response execution result
        """
        logger.info(f"Executing response: {action} for user {user_id}, session {session_id}")
        
        action_info = self.RESPONSE_ACTIONS.get(action, self.RESPONSE_ACTIONS['monitor_only'])
        
        result = {
            'action': action,
            'action_name': action_info['name'],
            'timestamp': datetime.now().isoformat(),
            'session_id': session_id,
            'user_id': user_id,
            'risk_score': risk_score,
            'status': 'simulated',  # In production, this would be 'executed'
            'details': details
        }
        
        # Log to audit trail
        self._log_audit(result)
        
        # In production, actual actions would be executed here:
        # - API calls to identity provider
        # - Session invalidation
        # - MFA trigger
        # - Account disable
        
        logger.info(f"Response {action} executed (simulated) for session {session_id}")
        
        return result
    
    def _log_audit(self, result: Dict):
        """Log response action to audit trail"""
        try:
            with open(self.audit_log_path, 'a') as f:
                f.write(json.dumps(result) + '\n')
        except Exception as e:
            logger.error(f"Error writing to audit log: {e}")
    
    def get_response_history(self, user_id: Optional[str] = None,
                            limit: int = 100) -> List[Dict]:
        """
        Get response action history from audit log
        
        Args:
            user_id: Optional user ID filter
            limit: Maximum number of entries to return
        
        Returns:
            List of response actions
        """
        if not os.path.exists(self.audit_log_path):
            return []
        
        history = []
        
        try:
            with open(self.audit_log_path, 'r') as f:
                for line in f:
                    try:
                        entry = json.loads(line.strip())
                        if user_id is None or entry.get('user_id') == user_id:
                            history.append(entry)
                    except json.JSONDecodeError:
                        continue
            
            # Sort by timestamp (most recent first)
            history.sort(key=lambda x: x.get('timestamp', ''), reverse=True)
            
            return history[:limit]
        
        except Exception as e:
            logger.error(f"Error reading audit log: {e}")
            return []

