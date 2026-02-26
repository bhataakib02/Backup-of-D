"""
Explainability Module
Provides human-readable explanations for detections
"""

import numpy as np
from typing import Dict, List, Optional, Tuple
import logging

logger = logging.getLogger(__name__)


class Explainer:
    """Generate explainable insights for identity threat detections"""
    
    def __init__(self, config: Dict):
        """
        Initialize explainer
        
        Args:
            config: Configuration for explainability
        """
        self.config = config
        self.top_features = config.get('top_features', 5)
        self.generate_nl = config.get('generate_natural_language', True)
    
    def explain_risk_score(self, 
                          risk_score: float,
                          risk_level: str,
                          component_risks: Dict,
                          features: Dict,
                          mitre_mapping: Optional[Dict] = None) -> Dict:
        """
        Generate explanation for risk score
        
        Args:
            risk_score: Overall risk score
            risk_level: Risk level
            component_risks: Component risk scores
            features: Feature dictionary
            mitre_mapping: Optional MITRE ATT&CK mapping
        
        Returns:
            Explanation dictionary
        """
        explanation = {
            'risk_score': risk_score,
            'risk_level': risk_level,
            'summary': self._generate_summary(risk_score, risk_level),
            'contributing_factors': self._explain_contributing_factors(component_risks, features),
            'behavioral_analysis': self._analyze_behavior(features),
            'mitre_mapping': mitre_mapping
        }
        
        if self.generate_nl:
            explanation['natural_language'] = self._generate_natural_language_explanation(
                explanation
            )
        
        return explanation
    
    def _generate_summary(self, risk_score: float, risk_level: str) -> str:
        """Generate risk summary"""
        if risk_level == 'Critical':
            return f"CRITICAL risk detected (Score: {risk_score:.2f}). Immediate investigation required."
        elif risk_level == 'High':
            return f"HIGH risk detected (Score: {risk_score:.2f}). Review and response recommended."
        elif risk_level == 'Medium':
            return f"MEDIUM risk detected (Score: {risk_score:.2f}). Monitor and investigate further."
        else:
            return f"LOW risk detected (Score: {risk_score:.2f}). Normal monitoring."
    
    def _explain_contributing_factors(self, component_risks: Dict, features: Dict) -> List[Dict]:
        """Explain top contributing risk factors"""
        factors = []
        
        # Behavioral risk
        if component_risks.get('behavioral', 0) > 0.3:
            factors.append({
                'factor': 'Behavioral Deviation',
                'score': component_risks['behavioral'],
                'description': 'User behavior significantly deviates from learned baseline patterns.',
                'details': self._get_behavioral_details(features)
            })
        
        # Temporal risk
        if component_risks.get('temporal', 0) > 0.3:
            factors.append({
                'factor': 'Temporal Anomaly',
                'score': component_risks['temporal'],
                'description': 'Unusual login time or pattern detected.',
                'details': self._get_temporal_details(features)
            })
        
        # Location risk
        if component_risks.get('location', 0) > 0.3:
            factors.append({
                'factor': 'Location Anomaly',
                'score': component_risks['location'],
                'description': 'Unusual or suspicious location/IP address detected.',
                'details': self._get_location_details(features)
            })
        
        # Privilege risk
        if component_risks.get('privilege', 0) > 0.3:
            factors.append({
                'factor': 'Privilege Escalation',
                'score': component_risks['privilege'],
                'description': 'Unusual privilege usage or escalation attempt detected.',
                'details': self._get_privilege_details(features)
            })
        
        # MITRE risk
        if component_risks.get('mitre', 0) > 0.2:
            factors.append({
                'factor': 'MITRE ATT&CK Match',
                'score': component_risks['mitre'],
                'description': 'Activity matches known attack patterns.',
                'details': []
            })
        
        # Sort by score
        factors.sort(key=lambda x: x['score'], reverse=True)
        
        return factors[:self.top_features]
    
    def _get_behavioral_details(self, features: Dict) -> List[str]:
        """Get behavioral anomaly details"""
        details = []
        
        if features.get('unique_hosts_count', 0) > 5:
            details.append(f"Accessing {features['unique_hosts_count']:.0f} different hosts (unusual pattern)")
        
        if features.get('avg_logins_per_day', 0) > 20:
            details.append(f"High login frequency: {features['avg_logins_per_day']:.1f} logins/day")
        
        return details
    
    def _get_temporal_details(self, features: Dict) -> List[str]:
        """Get temporal anomaly details"""
        details = []
        
        if 'hour' in features:
            hour = features['hour']
            if 2 <= hour <= 6:
                details.append(f"Login at {hour}:00 (unusual off-hours: 2-6 AM)")
            elif hour >= 22 or hour <= 2:
                details.append(f"Login at {hour}:00 (late night/early morning)")
        
        if features.get('is_weekend', 0) == 1:
            details.append("Login occurred on weekend")
        
        if 'time_since_last_login' in features:
            time_since = features['time_since_last_login']
            if time_since < 0.1:
                details.append(f"Very short time since last login ({time_since*60:.1f} minutes)")
            elif time_since > 48:
                details.append(f"Long gap since last login ({time_since:.1f} hours)")
        
        return details
    
    def _get_location_details(self, features: Dict) -> List[str]:
        """Get location anomaly details"""
        details = []
        
        if features.get('ip_changed', 0) == 1:
            details.append("Source IP address changed from previous login")
        
        if features.get('is_new_ip', 0) == 1:
            details.append("New IP address detected (first time seeing this IP for user)")
        
        if features.get('impossible_travel_flag', 0) == 1:
            details.append("IMPOSSIBLE TRAVEL DETECTED: Rapid location change inconsistent with physical travel")
        
        if 'ip_freq_normalized' in features:
            freq_norm = features['ip_freq_normalized']
            if freq_norm < 0.2:
                details.append("Rarely used IP address")
        
        return details
    
    def _get_privilege_details(self, features: Dict) -> List[str]:
        """Get privilege anomaly details"""
        details = []
        
        privilege_score = features.get('privilege_score', 0)
        if privilege_score > 0.7:
            details.append(f"High privilege usage (score: {privilege_score:.2f})")
        
        return details
    
    def _analyze_behavior(self, features: Dict) -> Dict:
        """Analyze behavioral patterns"""
        analysis = {
            'pattern': 'normal',
            'details': []
        }
        
        # Check for suspicious patterns
        if features.get('impossible_travel_flag', 0) == 1:
            analysis['pattern'] = 'suspicious'
            analysis['details'].append('Impossible travel pattern detected')
        
        if features.get('is_new_ip', 0) == 1 and features.get('ip_changed', 0) == 1:
            analysis['pattern'] = 'suspicious'
            analysis['details'].append('New IP address from unusual location')
        
        if features.get('unique_hosts_count', 0) > 10:
            analysis['pattern'] = 'lateral_movement'
            analysis['details'].append('Multiple host access pattern (potential lateral movement)')
        
        return analysis
    
    def _generate_natural_language_explanation(self, explanation: Dict) -> str:
        """Generate human-readable natural language explanation"""
        summary = explanation['summary']
        factors = explanation['contributing_factors']
        
        nl_explanation = f"{summary}\n\n"
        nl_explanation += "Contributing Factors:\n"
        
        for i, factor in enumerate(factors[:3], 1):
            nl_explanation += f"\n{i}. {factor['factor']} (Contribution: {factor['score']*100:.1f}%)\n"
            nl_explanation += f"   {factor['description']}\n"
            if factor.get('details'):
                for detail in factor['details'][:2]:
                    nl_explanation += f"   - {detail}\n"
        
        # MITRE mapping
        if explanation.get('mitre_mapping') and explanation['mitre_mapping'].get('top_techniques'):
            nl_explanation += "\nMITRE ATT&CK Mapping:\n"
            for tech in explanation['mitre_mapping']['top_techniques'][:2]:
                nl_explanation += f"  - {tech['name']} ({tech['id']}) - Confidence: {tech['confidence']*100:.1f}%\n"
        
        return nl_explanation
    
    def format_explanation_for_dashboard(self, explanation: Dict) -> Dict:
        """Format explanation for dashboard display"""
        return {
            'risk_score': explanation['risk_score'],
            'risk_level': explanation['risk_level'],
            'summary': explanation['summary'],
            'top_factors': [
                {
                    'name': f['factor'],
                    'contribution': f['score'],
                    'description': f['description'],
                    'details': f.get('details', [])
                }
                for f in explanation['contributing_factors'][:3]
            ],
            'natural_language': explanation.get('natural_language', ''),
            'mitre': explanation.get('mitre_mapping', {})
        }

