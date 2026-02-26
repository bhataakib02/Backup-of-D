"""
Advanced Threat Hunting Routes with Natural Language Queries
Enterprise-grade threat hunting capabilities for NEXUS CYBER INTELLIGENCE
"""

from flask import Blueprint, request, jsonify
try:
    from backend.utils.rbac import roles_required, tenant_required
    from backend.utils.logging_utils import get_audit_logger
    from backend.services.ai_ml_service import ai_ml_service, ThreatType
except ImportError:
    from utils.rbac import roles_required, tenant_required
    from utils.logging_utils import get_audit_logger
    from services.ai_ml_service import ai_ml_service, ThreatType
import json
import hashlib
import time
from datetime import datetime, timedelta
import random
import re
from typing import Dict, List, Any, Optional

threat_hunting_bp = Blueprint('threat_hunting', __name__)

class NaturalLanguageProcessor:
    """Advanced NLP processor for threat hunting queries"""
    
    def __init__(self):
        self.intent_patterns = {
            'search_indicators': [
                r'find.*indicators?', r'search.*for', r'look.*for',
                r'what.*indicators?', r'show.*me'
            ],
            'analyze_behavior': [
                r'analyze.*behavior', r'user.*activity', r'behavioral.*analysis',
                r'what.*did.*user', r'user.*actions?'
            ],
            'correlate_events': [
                r'correlate.*events?', r'find.*connections?', r'related.*events?',
                r'connect.*the.*dots', r'association.*analysis'
            ],
            'timeline_analysis': [
                r'timeline', r'chronological', r'sequence.*of.*events?',
                r'what.*happened.*when', r'order.*of.*events?'
            ],
            'threat_attribution': [
                r'who.*attacked', r'attribution', r'threat.*actor',
                r'attack.*source', r'origin.*of.*attack'
            ],
            'predictive_analysis': [
                r'predict', r'forecast', r'future.*threats?',
                r'what.*might.*happen', r'risk.*assessment'
            ]
        }
        
        self.entity_patterns = {
            'ip_address': r'\b(?:\d{1,3}\.){3}\d{1,3}\b',
            'domain': r'\b[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9\-]{0,61}[a-zA-Z0-9])?)*\b',
            'hash': r'\b[a-fA-F0-9]{32,64}\b',
            'email': r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b',
            'url': r'https?://[^\s]+',
            'file_path': r'[A-Za-z]:\\(?:[^\\/:*?"<>|\r\n]+\\)*[^\\/:*?"<>|\r\n]*',
            'user': r'user\s+[a-zA-Z0-9_]+',
            'process': r'process\s+[a-zA-Z0-9_.exe]+'
        }
        
        self.time_patterns = {
            'relative': [
                r'last\s+(\d+)\s+(hour|day|week|month)s?',
                r'past\s+(\d+)\s+(hour|day|week|month)s?',
                r'(\d+)\s+(hour|day|week|month)s?\s+ago'
            ],
            'absolute': [
                r'\d{4}-\d{2}-\d{2}',
                r'\d{2}/\d{2}/\d{4}',
                r'(january|february|march|april|may|june|july|august|september|october|november|december)\s+\d{1,2},?\s+\d{4}'
            ]
        }
    
    def parse_query(self, query: str) -> Dict[str, Any]:
        """Parse natural language query into structured intent and entities"""
        query_lower = query.lower()
        
        # Extract intent
        intent = self._extract_intent(query_lower)
        
        # Extract entities
        entities = self._extract_entities(query)
        
        # Extract time range
        time_range = self._extract_time_range(query_lower)
        
        # Extract threat types
        threat_types = self._extract_threat_types(query_lower)
        
        # Extract severity levels
        severity = self._extract_severity(query_lower)
        
        return {
            'intent': intent,
            'entities': entities,
            'time_range': time_range,
            'threat_types': threat_types,
            'severity': severity,
            'confidence': self._calculate_confidence(intent, entities),
            'original_query': query
        }
    
    def _extract_intent(self, query: str) -> str:
        """Extract the primary intent from the query"""
        for intent, patterns in self.intent_patterns.items():
            for pattern in patterns:
                if re.search(pattern, query, re.IGNORECASE):
                    return intent
        return 'general_search'
    
    def _extract_entities(self, query: str) -> Dict[str, List[str]]:
        """Extract entities from the query"""
        entities = {}
        
        for entity_type, pattern in self.entity_patterns.items():
            matches = re.findall(pattern, query, re.IGNORECASE)
            if matches:
                entities[entity_type] = matches
        
        return entities
    
    def _extract_time_range(self, query: str) -> Dict[str, Any]:
        """Extract time range from the query"""
        # Check for relative time patterns
        for pattern in self.time_patterns['relative']:
            match = re.search(pattern, query, re.IGNORECASE)
            if match:
                groups = match.groups()
                if len(groups) >= 2:
                    amount = int(groups[0])
                    unit = groups[1]
                    
                    # Convert to hours
                    hours = amount
                    if unit == 'day':
                        hours *= 24
                    elif unit == 'week':
                        hours *= 24 * 7
                    elif unit == 'month':
                        hours *= 24 * 30
                    
                    return {
                        'type': 'relative',
                        'hours': hours,
                        'start': datetime.now() - timedelta(hours=hours),
                        'end': datetime.now()
                    }
        
        # Check for absolute time patterns
        for pattern in self.time_patterns['absolute']:
            match = re.search(pattern, query, re.IGNORECASE)
            if match:
                return {
                    'type': 'absolute',
                    'date': match.group(),
                    'parsed': True
                }
        
        # Default to last 24 hours
        return {
            'type': 'default',
            'hours': 24,
            'start': datetime.now() - timedelta(hours=24),
            'end': datetime.now()
        }
    
    def _extract_threat_types(self, query: str) -> List[str]:
        """Extract threat types from the query"""
        threat_keywords = {
            'malware': ['malware', 'virus', 'trojan', 'worm', 'backdoor'],
            'phishing': ['phishing', 'spoofing', 'fake', 'fraud'],
            'intrusion': ['intrusion', 'breach', 'hack', 'unauthorized'],
            'ddos': ['ddos', 'dos', 'denial', 'flood'],
            'insider': ['insider', 'employee', 'internal', 'privilege'],
            'apt': ['apt', 'advanced', 'persistent', 'sophisticated'],
            'ransomware': ['ransomware', 'encryption', 'ransom']
        }
        
        detected_types = []
        for threat_type, keywords in threat_keywords.items():
            if any(keyword in query for keyword in keywords):
                detected_types.append(threat_type)
        
        return detected_types
    
    def _extract_severity(self, query: str) -> str:
        """Extract severity level from the query"""
        if any(word in query for word in ['critical', 'urgent', 'immediate', 'high']):
            return 'High'
        elif any(word in query for word in ['medium', 'moderate', 'normal']):
            return 'Medium'
        elif any(word in query for word in ['low', 'minor', 'informational']):
            return 'Low'
        else:
            return 'All'
    
    def _calculate_confidence(self, intent: str, entities: Dict[str, List[str]]) -> float:
        """Calculate confidence score for the parsed query"""
        confidence = 0.5  # Base confidence
        
        # Increase confidence based on intent clarity
        if intent != 'general_search':
            confidence += 0.2
        
        # Increase confidence based on entity extraction
        if entities:
            confidence += min(0.3, len(entities) * 0.1)
        
        return min(confidence, 1.0)

class ThreatHuntingEngine:
    """Advanced threat hunting engine with AI-powered analysis"""
    
    def __init__(self):
        self.nlp_processor = NaturalLanguageProcessor()
        self.search_engines = {
            'elasticsearch': self._elasticsearch_search,
            'graph': self._graph_search,
            'vector': self._vector_search,
            'timeseries': self._timeseries_search
        }
    
    def execute_hunt(self, parsed_query: Dict[str, Any]) -> Dict[str, Any]:
        """Execute threat hunting query based on parsed intent"""
        intent = parsed_query['intent']
        entities = parsed_query['entities']
        time_range = parsed_query['time_range']
        
        # Route to appropriate search engine
        if intent == 'search_indicators':
            return self._search_indicators(entities, time_range)
        elif intent == 'analyze_behavior':
            return self._analyze_behavior(entities, time_range)
        elif intent == 'correlate_events':
            return self._correlate_events(entities, time_range)
        elif intent == 'timeline_analysis':
            return self._timeline_analysis(entities, time_range)
        elif intent == 'threat_attribution':
            return self._threat_attribution(entities, time_range)
        elif intent == 'predictive_analysis':
            return self._predictive_analysis(entities, time_range)
        else:
            return self._general_search(entities, time_range)
    
    def _search_indicators(self, entities: Dict[str, List[str]], time_range: Dict[str, Any]) -> Dict[str, Any]:
        """Search for threat indicators"""
        results = []
        
        # Simulate indicator search
        for entity_type, values in entities.items():
            for value in values:
                # Simulate finding related indicators
                indicators = self._find_related_indicators(value, entity_type)
                results.extend(indicators)
        
        return {
            'query_type': 'indicator_search',
            'results': results,
            'total_found': len(results),
            'search_time': time.time(),
            'confidence': 0.85
        }
    
    def _analyze_behavior(self, entities: Dict[str, List[str]], time_range: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze user behavior patterns"""
        behavior_analysis = {
            'anomalies_detected': random.randint(0, 5),
            'risk_score': random.uniform(0.3, 0.9),
            'behavioral_patterns': [
                'Unusual login times',
                'Excessive data access',
                'Off-hours activity',
                'Privilege escalation attempts'
            ],
            'user_risk_level': random.choice(['Low', 'Medium', 'High']),
            'recommendations': [
                'Monitor user activity',
                'Review access permissions',
                'Implement additional controls'
            ]
        }
        
        return {
            'query_type': 'behavioral_analysis',
            'analysis': behavior_analysis,
            'confidence': 0.78
        }
    
    def _correlate_events(self, entities: Dict[str, List[str]], time_range: Dict[str, Any]) -> Dict[str, Any]:
        """Correlate security events"""
        correlations = []
        
        # Simulate event correlation
        for i in range(random.randint(3, 8)):
            correlations.append({
                'event_id': f'evt_{i}',
                'timestamp': datetime.now().isoformat(),
                'event_type': random.choice(['Login', 'File Access', 'Network Activity', 'Process Execution']),
                'correlation_strength': random.uniform(0.6, 0.95),
                'related_events': [f'evt_{j}' for j in range(i-1, i+2) if j != i and j >= 0]
            })
        
        return {
            'query_type': 'event_correlation',
            'correlations': correlations,
            'total_correlations': len(correlations),
            'confidence': 0.82
        }
    
    def _timeline_analysis(self, entities: Dict[str, List[str]], time_range: Dict[str, Any]) -> Dict[str, Any]:
        """Perform timeline analysis"""
        timeline_events = []
        
        # Generate timeline events
        for i in range(random.randint(5, 15)):
            event_time = datetime.now() - timedelta(hours=random.randint(1, 24))
            timeline_events.append({
                'timestamp': event_time.isoformat(),
                'event': random.choice([
                    'Suspicious login attempt',
                    'File modification',
                    'Network connection',
                    'Process execution',
                    'Data access'
                ]),
                'severity': random.choice(['Low', 'Medium', 'High']),
                'source': f'source_{random.randint(1, 5)}',
                'details': f'Event details for timeline item {i}'
            })
        
        # Sort by timestamp
        timeline_events.sort(key=lambda x: x['timestamp'])
        
        return {
            'query_type': 'timeline_analysis',
            'timeline': timeline_events,
            'total_events': len(timeline_events),
            'time_span': f"{time_range.get('hours', 24)} hours",
            'confidence': 0.88
        }
    
    def _threat_attribution(self, entities: Dict[str, List[str]], time_range: Dict[str, Any]) -> Dict[str, Any]:
        """Perform threat attribution analysis"""
        attribution = {
            'threat_actor': random.choice(['APT29', 'Lazarus Group', 'FIN7', 'Unknown']),
            'confidence': random.uniform(0.6, 0.9),
            'attribution_factors': [
                'TTPs match known actor',
                'Infrastructure overlap',
                'Geographic indicators',
                'Timing patterns'
            ],
            'threat_intelligence': {
                'iocs': random.randint(5, 20),
                'campaigns': random.randint(1, 5),
                'targets': random.randint(10, 50)
            },
            'recommendations': [
                'Monitor for known TTPs',
                'Update threat intelligence',
                'Implement countermeasures'
            ]
        }
        
        return {
            'query_type': 'threat_attribution',
            'attribution': attribution,
            'confidence': attribution['confidence']
        }
    
    def _predictive_analysis(self, entities: Dict[str, List[str]], time_range: Dict[str, Any]) -> Dict[str, Any]:
        """Perform predictive threat analysis"""
        predictions = {
            'threat_probability': random.uniform(0.2, 0.8),
            'predicted_threats': [
                'Phishing campaign',
                'Malware distribution',
                'Insider threat',
                'Data breach'
            ],
            'risk_factors': [
                'Vulnerable systems detected',
                'User behavior anomalies',
                'External threat indicators',
                'Security control gaps'
            ],
            'mitigation_strategies': [
                'Implement additional monitoring',
                'Update security controls',
                'User awareness training',
                'Incident response preparation'
            ],
            'confidence': random.uniform(0.7, 0.9)
        }
        
        return {
            'query_type': 'predictive_analysis',
            'predictions': predictions,
            'confidence': predictions['confidence']
        }
    
    def _general_search(self, entities: Dict[str, List[str]], time_range: Dict[str, Any]) -> Dict[str, Any]:
        """General search across all data sources"""
        results = []
        
        # Simulate general search results
        for i in range(random.randint(10, 30)):
            results.append({
                'id': f'result_{i}',
                'type': random.choice(['Event', 'Indicator', 'Alert', 'Log']),
                'content': f'Search result {i}',
                'relevance_score': random.uniform(0.3, 0.95),
                'timestamp': datetime.now().isoformat()
            })
        
        return {
            'query_type': 'general_search',
            'results': results,
            'total_found': len(results),
            'confidence': 0.75
        }
    
    def _find_related_indicators(self, value: str, entity_type: str) -> List[Dict[str, Any]]:
        """Find indicators related to a specific entity"""
        indicators = []
        
        # Simulate finding related indicators
        for i in range(random.randint(1, 5)):
            indicators.append({
                'indicator_id': f'ind_{hashlib.md5(f"{value}_{i}".encode()).hexdigest()[:8]}',
                'value': f'related_{value}_{i}',
                'type': entity_type,
                'confidence': random.uniform(0.6, 0.95),
                'first_seen': datetime.now().isoformat(),
                'last_seen': datetime.now().isoformat(),
                'sources': ['Threat Intelligence', 'Internal Analysis', 'External Feeds']
            })
        
        return indicators
    
    def _elasticsearch_search(self, query: str) -> List[Dict[str, Any]]:
        """Simulate Elasticsearch search"""
        return []
    
    def _graph_search(self, query: str) -> List[Dict[str, Any]]:
        """Simulate graph database search"""
        return []
    
    def _vector_search(self, query: str) -> List[Dict[str, Any]]:
        """Simulate vector database search"""
        return []
    
    def _timeseries_search(self, query: str) -> List[Dict[str, Any]]:
        """Simulate time series database search"""
        return []

# Global instances
nlp_processor = NaturalLanguageProcessor()
hunting_engine = ThreatHuntingEngine()

@threat_hunting_bp.route('/hunt/query', methods=['POST'])
@roles_required('admin', 'analyst', 'hunter')
@tenant_required
def natural_language_hunt():
    """Advanced threat hunting with natural language queries"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'success': False, 'error': 'Query is required'}), 400
        
        # Parse natural language query
        parsed_query = nlp_processor.parse_query(query)
        
        # Execute threat hunting
        results = hunting_engine.execute_hunt(parsed_query)
        
        # Add metadata
        results['metadata'] = {
            'query_id': hashlib.md5(f"{query}_{time.time()}".encode()).hexdigest()[:12],
            'execution_time': time.time(),
            'parsed_query': parsed_query,
            'timestamp': datetime.now().isoformat()
        }
        
        # Audit logging
        try:
            audit_logger = get_audit_logger()
            audit_logger.log_data_access(
                user_id=0,  # Would be actual user ID in production
                data_type='threat_hunt',
                action='natural_language_query',
                details={'query': query, 'intent': parsed_query['intent']}
            )
        except Exception:
            pass
        
        return jsonify({
            'success': True,
            'results': results
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@threat_hunting_bp.route('/hunt/indicators', methods=['POST'])
@roles_required('admin', 'analyst', 'hunter')
@tenant_required
def search_indicators():
    """Search for threat indicators with advanced filtering"""
    try:
        data = request.get_json()
        
        # Extract search parameters
        indicators = data.get('indicators', [])
        time_range = data.get('time_range', '24h')
        severity = data.get('severity', 'All')
        threat_types = data.get('threat_types', [])
        
        # Simulate indicator search
        results = []
        for indicator in indicators:
            for i in range(random.randint(1, 5)):
                results.append({
                    'indicator_id': f'ind_{hashlib.md5(f"{indicator}_{i}".encode()).hexdigest()[:8]}',
                    'value': indicator,
                    'type': random.choice(['IP', 'Domain', 'Hash', 'Email']),
                    'severity': random.choice(['Low', 'Medium', 'High']),
                    'confidence': random.uniform(0.6, 0.95),
                    'first_seen': datetime.now().isoformat(),
                    'last_seen': datetime.now().isoformat(),
                    'sources': ['Threat Intelligence', 'Internal Analysis'],
                    'related_indicators': [f'related_{j}' for j in range(random.randint(1, 3))]
                })
        
        return jsonify({
            'success': True,
            'indicators': results,
            'total_found': len(results),
            'search_parameters': {
                'time_range': time_range,
                'severity': severity,
                'threat_types': threat_types
            }
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@threat_hunting_bp.route('/hunt/behavior', methods=['POST'])
@roles_required('admin', 'analyst', 'hunter')
@tenant_required
def analyze_behavior():
    """Analyze user behavior for insider threats"""
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        time_range = data.get('time_range', '7d')
        
        # Simulate behavioral analysis
        behavior_analysis = {
            'user_id': user_id,
            'analysis_period': time_range,
            'risk_score': random.uniform(0.2, 0.9),
            'anomalies': [
                {
                    'type': 'Unusual login time',
                    'severity': 'Medium',
                    'description': 'Login at 3:00 AM',
                    'timestamp': datetime.now().isoformat()
                },
                {
                    'type': 'Excessive data access',
                    'severity': 'High',
                    'description': 'Accessed 1000+ files in 1 hour',
                    'timestamp': datetime.now().isoformat()
                }
            ],
            'behavioral_patterns': {
                'login_times': ['09:00', '13:00', '17:00'],
                'access_patterns': ['Normal', 'Elevated'],
                'data_volume': 'Above average'
            },
            'recommendations': [
                'Monitor user activity closely',
                'Review access permissions',
                'Consider additional authentication'
            ]
        }
        
        return jsonify({
            'success': True,
            'analysis': behavior_analysis
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@threat_hunting_bp.route('/hunt/correlate', methods=['POST'])
@roles_required('admin', 'analyst', 'hunter')
@tenant_required
def correlate_events():
    """Correlate security events for pattern detection"""
    try:
        data = request.get_json()
        event_ids = data.get('event_ids', [])
        correlation_type = data.get('type', 'temporal')
        
        # Simulate event correlation
        correlations = []
        for i, event_id in enumerate(event_ids):
            correlations.append({
                'correlation_id': f'corr_{i}',
                'event_ids': [event_id] + [f'evt_{j}' for j in range(i+1, min(i+3, len(event_ids)))],
                'correlation_strength': random.uniform(0.6, 0.95),
                'pattern_type': random.choice(['Temporal', 'Spatial', 'Behavioral', 'Network']),
                'confidence': random.uniform(0.7, 0.9),
                'description': f'Correlation pattern {i}',
                'timestamp': datetime.now().isoformat()
            })
        
        return jsonify({
            'success': True,
            'correlations': correlations,
            'total_correlations': len(correlations)
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@threat_hunting_bp.route('/hunt/timeline', methods=['POST'])
@roles_required('admin', 'analyst', 'hunter')
@tenant_required
def build_timeline():
    """Build chronological timeline of security events"""
    try:
        data = request.get_json()
        entity = data.get('entity')
        time_range = data.get('time_range', '24h')
        
        # Simulate timeline construction
        timeline_events = []
        for i in range(random.randint(5, 20)):
            event_time = datetime.now() - timedelta(hours=random.randint(1, 24))
            timeline_events.append({
                'event_id': f'evt_{i}',
                'timestamp': event_time.isoformat(),
                'event_type': random.choice(['Login', 'File Access', 'Network Activity', 'Process Execution']),
                'severity': random.choice(['Low', 'Medium', 'High']),
                'source': f'source_{random.randint(1, 5)}',
                'description': f'Timeline event {i}',
                'related_events': [f'evt_{j}' for j in range(max(0, i-1), min(i+2, 20)) if j != i]
            })
        
        # Sort by timestamp
        timeline_events.sort(key=lambda x: x['timestamp'])
        
        return jsonify({
            'success': True,
            'timeline': timeline_events,
            'entity': entity,
            'time_range': time_range,
            'total_events': len(timeline_events)
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@threat_hunting_bp.route('/hunt/attribution', methods=['POST'])
@roles_required('admin', 'analyst', 'hunter')
@tenant_required
def threat_attribution():
    """Perform threat attribution analysis"""
    try:
        data = request.get_json()
        indicators = data.get('indicators', [])
        
        # Simulate threat attribution
        attribution = {
            'threat_actor': random.choice(['APT29', 'Lazarus Group', 'FIN7', 'Unknown']),
            'confidence': random.uniform(0.6, 0.9),
            'attribution_factors': [
                'TTPs match known actor',
                'Infrastructure overlap',
                'Geographic indicators',
                'Timing patterns'
            ],
            'threat_intelligence': {
                'iocs': random.randint(5, 20),
                'campaigns': random.randint(1, 5),
                'targets': random.randint(10, 50)
            },
            'recommendations': [
                'Monitor for known TTPs',
                'Update threat intelligence',
                'Implement countermeasures'
            ]
        }
        
        return jsonify({
            'success': True,
            'attribution': attribution
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@threat_hunting_bp.route('/hunt/predict', methods=['POST'])
@roles_required('admin', 'analyst', 'hunter')
@tenant_required
def predictive_analysis():
    """Perform predictive threat analysis"""
    try:
        data = request.get_json()
        analysis_type = data.get('type', 'general')
        
        # Simulate predictive analysis
        predictions = {
            'threat_probability': random.uniform(0.2, 0.8),
            'predicted_threats': [
                'Phishing campaign',
                'Malware distribution',
                'Insider threat',
                'Data breach'
            ],
            'risk_factors': [
                'Vulnerable systems detected',
                'User behavior anomalies',
                'External threat indicators',
                'Security control gaps'
            ],
            'mitigation_strategies': [
                'Implement additional monitoring',
                'Update security controls',
                'User awareness training',
                'Incident response preparation'
            ],
            'confidence': random.uniform(0.7, 0.9)
        }
        
        return jsonify({
            'success': True,
            'predictions': predictions
        })
        
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@threat_hunting_bp.route('/hunt/status', methods=['GET'])
@roles_required('admin', 'analyst', 'hunter', 'viewer')
@tenant_required
def hunting_status():
    """Get threat hunting system status"""
    return jsonify({
        'success': True,
        'status': {
            'system_health': 'Operational',
            'active_hunts': random.randint(0, 5),
            'total_indicators': random.randint(10000, 50000),
            'last_update': datetime.now().isoformat(),
            'capabilities': [
                'Natural Language Queries',
                'Behavioral Analysis',
                'Event Correlation',
                'Timeline Analysis',
                'Threat Attribution',
                'Predictive Analysis'
            ]
        }
    })
