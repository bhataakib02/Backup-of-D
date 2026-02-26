"""
MITRE ATT&CK Framework Mapping
Maps identity threats to MITRE ATT&CK tactics and techniques
"""

from typing import Dict, List, Optional
import logging

logger = logging.getLogger(__name__)


class MITREMapper:
    """Maps detections to MITRE ATT&CK framework"""
    
    # MITRE ATT&CK Techniques relevant to identity threats
    TECHNIQUES = {
        'T1078': {
            'name': 'Valid Accounts',
            'tactic': 'TA0001',  # Initial Access
            'description': 'Adversaries may steal credentials or use previously compromised accounts',
            'indicators': ['unusual_login_location', 'unusual_login_time', 'new_account_usage']
        },
        'T1133': {
            'name': 'External Remote Services',
            'tactic': 'TA0001',
            'description': 'Adversaries may leverage external-facing remote services',
            'indicators': ['external_ip_access', 'vpn_usage']
        },
        'T1098': {
            'name': 'Account Manipulation',
            'tactic': 'TA0003',  # Persistence
            'description': 'Adversaries may manipulate accounts to maintain access',
            'indicators': ['privilege_escalation', 'permission_changes']
        },
        'T1021': {
            'name': 'Remote Services',
            'tactic': 'TA0008',  # Lateral Movement
            'description': 'Adversaries may use remote services for lateral movement',
            'indicators': ['lateral_movement', 'remote_access']
        }
    }
    
    TACTICS = {
        'TA0001': {
            'name': 'Initial Access',
            'description': 'The adversary is trying to get into your network'
        },
        'TA0003': {
            'name': 'Persistence',
            'description': 'The adversary is trying to maintain their foothold'
        },
        'TA0008': {
            'name': 'Lateral Movement',
            'description': 'The adversary is trying to move through your environment'
        }
    }
    
    def __init__(self):
        """Initialize MITRE mapper"""
        pass
    
    def map_features_to_techniques(self, features: Dict) -> Dict[str, float]:
        """
        Map feature patterns to MITRE techniques
        
        Args:
            features: Feature dictionary
        
        Returns:
            Dictionary mapping technique IDs to confidence scores [0, 1]
        """
        technique_scores = {}
        
        # T1078: Valid Accounts
        indicators_t1078 = 0
        if features.get('is_new_ip', 0) == 1:
            indicators_t1078 += 1
        if features.get('ip_changed', 0) == 1:
            indicators_t1078 += 1
        if features.get('impossible_travel_flag', 0) == 1:
            indicators_t1078 += 1
        technique_scores['T1078'] = min(1.0, indicators_t1078 / 3.0)
        
        # T1133: External Remote Services
        indicators_t1133 = 0
        if features.get('ip_changed', 0) == 1:
            indicators_t1133 += 0.5
        # Would need external IP detection in real implementation
        technique_scores['T1133'] = min(1.0, indicators_t1133)
        
        # T1098: Account Manipulation
        indicators_t1098 = 0
        if features.get('privilege_score', 0) > 0.7:
            indicators_t1098 += 1
        technique_scores['T1098'] = min(1.0, indicators_t1098)
        
        # T1021: Remote Services (Lateral Movement)
        indicators_t1021 = 0
        if features.get('unique_hosts_count', 0) > 5:  # Multiple hosts
            indicators_t1021 += 0.5
        if features.get('ip_changed', 0) == 1:
            indicators_t1021 += 0.5
        technique_scores['T1021'] = min(1.0, indicators_t1021)
        
        return technique_scores
    
    def aggregate_to_tactics(self, technique_scores: Dict[str, float]) -> Dict[str, float]:
        """
        Aggregate technique scores to tactic scores
        
        Args:
            technique_scores: Dictionary of technique scores
        
        Returns:
            Dictionary mapping tactic IDs to scores
        """
        tactic_scores = {}
        
        for technique_id, score in technique_scores.items():
            if technique_id in self.TECHNIQUES:
                tactic_id = self.TECHNIQUES[technique_id]['tactic']
                if tactic_id not in tactic_scores:
                    tactic_scores[tactic_id] = []
                tactic_scores[tactic_id].append(score)
        
        # Aggregate: use maximum score per tactic
        tactic_scores = {
            tactic_id: max(scores) if scores else 0.0
            for tactic_id, scores in tactic_scores.items()
        }
        
        return tactic_scores
    
    def map_detection(self, features: Dict) -> Dict:
        """
        Map detection to MITRE ATT&CK framework
        
        Args:
            features: Feature dictionary
        
        Returns:
            Dictionary with technique and tactic mappings
        """
        technique_scores = self.map_features_to_techniques(features)
        tactic_scores = self.aggregate_to_tactics(technique_scores)
        
        # Get top techniques
        top_techniques = sorted(
            technique_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )[:3]
        
        # Get top tactics
        top_tactics = sorted(
            tactic_scores.items(),
            key=lambda x: x[1],
            reverse=True
        )[:2]
        
        return {
            'techniques': technique_scores,
            'tactics': tactic_scores,
            'top_techniques': [
                {
                    'id': tech_id,
                    'name': self.TECHNIQUES[tech_id]['name'],
                    'confidence': score,
                    'tactic': self.TECHNIQUES[tech_id]['tactic']
                }
                for tech_id, score in top_techniques if score > 0
            ],
            'top_tactics': [
                {
                    'id': tactic_id,
                    'name': self.TACTICS[tactic_id]['name'],
                    'confidence': score
                }
                for tactic_id, score in top_tactics if score > 0
            ]
        }

