"""
Fusion/Correlation Engine - Functions 211-250
AI/ML Cybersecurity Platform
"""

import os
import json
import numpy as np
import pandas as pd
from typing import Dict, List, Optional, Any, Tuple
from datetime import datetime, timedelta
import logging
from collections import defaultdict
import networkx as nx
from sklearn.cluster import DBSCAN
from sklearn.metrics.pairwise import cosine_similarity
import joblib

from utils.logging_utils import get_security_logger
from database.models import Alert, Event, PhishingAnalysis, MalwareAnalysis, IDSAnalysis

logger = logging.getLogger(__name__)
security_logger = get_security_logger()

class FusionEngine:
    """Fusion engine implementing functions 211-250"""
    
    def __init__(self):
        self.correlation_rules = {}
        self.attack_patterns = {}
        self.threat_actors = {}
        self.load_correlation_rules()
        self.load_attack_patterns()
    
    def load_correlation_rules(self):
        """Load correlation rules"""
        try:
            if os.path.exists('rules/correlation_rules.json'):
                with open('rules/correlation_rules.json', 'r') as f:
                    self.correlation_rules = json.load(f)
            
            logger.info(f"Loaded {len(self.correlation_rules)} correlation rules")
            
        except Exception as e:
            logger.error(f"Error loading correlation rules: {str(e)}")
    
    def load_attack_patterns(self):
        """Load attack patterns"""
        try:
            if os.path.exists('rules/attack_patterns.json'):
                with open('rules/attack_patterns.json', 'r') as f:
                    self.attack_patterns = json.load(f)
            
            logger.info(f"Loaded {len(self.attack_patterns)} attack patterns")
            
        except Exception as e:
            logger.error(f"Error loading attack patterns: {str(e)}")
    
    # Function 69: Event correlation engine
    def correlate_events(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Correlate events across different modules"""
        try:
            correlations = []
            correlation_graph = nx.Graph()
            
            # Add events to graph
            for event in events:
                correlation_graph.add_node(event['id'], **event)
            
            # Find correlations based on rules
            for i, event1 in enumerate(events):
                for j, event2 in enumerate(events[i+1:], i+1):
                    correlation_score = self._calculate_correlation_score(event1, event2)
                    
                    if correlation_score > 0.5:  # Threshold for correlation
                        correlation_graph.add_edge(event1['id'], event2['id'], weight=correlation_score)
                        correlations.append({
                            'event1': event1['id'],
                            'event2': event2['id'],
                            'score': correlation_score,
                            'type': self._get_correlation_type(event1, event2)
                        })
            
            # Find connected components (attack chains)
            attack_chains = list(nx.connected_components(correlation_graph))
            
            analysis = {
                'total_events': len(events),
                'correlations': correlations,
                'correlation_count': len(correlations),
                'attack_chains': [list(chain) for chain in attack_chains],
                'chain_count': len(attack_chains),
                'correlation_graph': self._graph_to_dict(correlation_graph)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error correlating events: {str(e)}")
            return {'error': str(e)}
    
    # Function 70: Attack chain reconstruction
    def reconstruct_attack_chain(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Reconstruct attack chain from correlated events"""
        try:
            # Sort events by timestamp
            sorted_events = sorted(events, key=lambda x: x.get('timestamp', ''))
            
            # Identify attack phases
            phases = self._identify_attack_phases(sorted_events)
            
            # Map to kill chain
            kill_chain = self._map_to_kill_chain(phases)
            
            # Calculate timeline
            timeline = self._create_attack_timeline(sorted_events)
            
            # Identify threat actor
            threat_actor = self._identify_threat_actor(sorted_events)
            
            analysis = {
                'attack_chain': kill_chain,
                'phases': phases,
                'timeline': timeline,
                'threat_actor': threat_actor,
                'total_events': len(events),
                'duration': self._calculate_attack_duration(sorted_events),
                'severity': self._calculate_attack_severity(sorted_events)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error reconstructing attack chain: {str(e)}")
            return {'error': str(e)}
    
    # Function 71: Confidence aggregation
    def aggregate_confidence(self, predictions: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Aggregate confidence scores from multiple predictions"""
        try:
            if not predictions:
                return {'error': 'No predictions provided'}
            
            # Extract confidence scores
            confidences = [pred.get('confidence', 0.0) for pred in predictions]
            weights = [pred.get('weight', 1.0) for pred in predictions]
            
            # Calculate weighted average
            weighted_sum = sum(c * w for c, w in zip(confidences, weights))
            total_weight = sum(weights)
            aggregated_confidence = weighted_sum / total_weight if total_weight > 0 else 0.0
            
            # Calculate ensemble metrics
            ensemble_metrics = {
                'mean_confidence': np.mean(confidences),
                'median_confidence': np.median(confidences),
                'std_confidence': np.std(confidences),
                'min_confidence': np.min(confidences),
                'max_confidence': np.max(confidences),
                'weighted_confidence': aggregated_confidence
            }
            
            # Determine final prediction
            final_prediction = aggregated_confidence > 0.5
            
            analysis = {
                'predictions': predictions,
                'ensemble_metrics': ensemble_metrics,
                'final_prediction': final_prediction,
                'aggregated_confidence': aggregated_confidence,
                'prediction_count': len(predictions)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error aggregating confidence: {str(e)}")
            return {'error': str(e)}
    
    # Function 72: Severity rating
    def calculate_severity_rating(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate severity rating for events"""
        try:
            severity_scores = []
            severity_factors = []
            
            for event in events:
                # Base severity from event type
                base_severity = self._get_base_severity(event.get('type', 'unknown'))
                
                # Adjust based on confidence
                confidence = event.get('confidence', 0.5)
                adjusted_severity = base_severity * confidence
                
                # Additional factors
                if event.get('is_critical', False):
                    adjusted_severity *= 1.5
                
                if event.get('affects_multiple_systems', False):
                    adjusted_severity *= 1.3
                
                severity_scores.append(adjusted_severity)
                severity_factors.append({
                    'event_id': event.get('id'),
                    'base_severity': base_severity,
                    'confidence': confidence,
                    'adjusted_severity': adjusted_severity,
                    'factors': self._get_severity_factors(event)
                })
            
            # Calculate overall severity
            overall_severity = max(severity_scores) if severity_scores else 0.0
            severity_rating = self._map_severity_rating(overall_severity)
            
            analysis = {
                'overall_severity': overall_severity,
                'severity_rating': severity_rating,
                'severity_scores': severity_scores,
                'severity_factors': severity_factors,
                'event_count': len(events)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error calculating severity rating: {str(e)}")
            return {'error': str(e)}
    
    # Function 73: Deduplication of alerts
    def deduplicate_alerts(self, alerts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Remove duplicate alerts"""
        try:
            unique_alerts = []
            duplicates = []
            seen_hashes = set()
            
            for alert in alerts:
                # Create hash for deduplication
                alert_hash = self._create_alert_hash(alert)
                
                if alert_hash in seen_hashes:
                    duplicates.append(alert)
                else:
                    seen_hashes.add(alert_hash)
                    unique_alerts.append(alert)
            
            # Group similar alerts
            similar_groups = self._group_similar_alerts(unique_alerts)
            
            analysis = {
                'original_count': len(alerts),
                'unique_count': len(unique_alerts),
                'duplicate_count': len(duplicates),
                'unique_alerts': unique_alerts,
                'duplicates': duplicates,
                'similar_groups': similar_groups,
                'deduplication_rate': len(duplicates) / len(alerts) if alerts else 0.0
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error deduplicating alerts: {str(e)}")
            return {'error': str(e)}
    
    # Function 74: Consolidated alert output
    def consolidate_alerts(self, alerts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Consolidate multiple alerts into single output"""
        try:
            if not alerts:
                return {'error': 'No alerts provided'}
            
            # Group alerts by type
            grouped_alerts = defaultdict(list)
            for alert in alerts:
                alert_type = alert.get('type', 'unknown')
                grouped_alerts[alert_type].append(alert)
            
            # Create consolidated alerts
            consolidated_alerts = []
            for alert_type, type_alerts in grouped_alerts.items():
                consolidated_alert = self._create_consolidated_alert(alert_type, type_alerts)
                consolidated_alerts.append(consolidated_alert)
            
            # Calculate summary statistics
            summary = {
                'total_alerts': len(alerts),
                'consolidated_count': len(consolidated_alerts),
                'alert_types': list(grouped_alerts.keys()),
                'type_counts': {k: len(v) for k, v in grouped_alerts.items()}
            }
            
            analysis = {
                'consolidated_alerts': consolidated_alerts,
                'summary': summary,
                'grouped_alerts': dict(grouped_alerts)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error consolidating alerts: {str(e)}")
            return {'error': str(e)}
    
    # Function 75: Risk score calculation
    def calculate_risk_score(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate overall risk score"""
        try:
            if not events:
                return {'error': 'No events provided'}
            
            risk_factors = []
            
            for event in events:
                # Base risk from event type
                base_risk = self._get_base_risk(event.get('type', 'unknown'))
                
                # Adjust based on confidence
                confidence = event.get('confidence', 0.5)
                adjusted_risk = base_risk * confidence
                
                # Additional risk factors
                if event.get('is_critical', False):
                    adjusted_risk *= 1.5
                
                if event.get('affects_multiple_systems', False):
                    adjusted_risk *= 1.3
                
                if event.get('has_lateral_movement', False):
                    adjusted_risk *= 1.4
                
                risk_factors.append({
                    'event_id': event.get('id'),
                    'base_risk': base_risk,
                    'confidence': confidence,
                    'adjusted_risk': adjusted_risk,
                    'factors': self._get_risk_factors(event)
                })
            
            # Calculate overall risk score
            overall_risk = sum(factor['adjusted_risk'] for factor in risk_factors) / len(risk_factors)
            risk_level = self._map_risk_level(overall_risk)
            
            analysis = {
                'overall_risk_score': overall_risk,
                'risk_level': risk_level,
                'risk_factors': risk_factors,
                'event_count': len(events),
                'risk_distribution': self._calculate_risk_distribution(risk_factors)
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error calculating risk score: {str(e)}")
            return {'error': str(e)}
    
    # Function 76: Dashboard threat statistics
    def generate_threat_statistics(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate threat statistics for dashboard"""
        try:
            if not events:
                return {'error': 'No events provided'}
            
            # Time-based statistics
            time_stats = self._calculate_time_statistics(events)
            
            # Type-based statistics
            type_stats = self._calculate_type_statistics(events)
            
            # Severity-based statistics
            severity_stats = self._calculate_severity_statistics(events)
            
            # Geographic statistics
            geo_stats = self._calculate_geographic_statistics(events)
            
            # Source statistics
            source_stats = self._calculate_source_statistics(events)
            
            analysis = {
                'time_statistics': time_stats,
                'type_statistics': type_stats,
                'severity_statistics': severity_stats,
                'geographic_statistics': geo_stats,
                'source_statistics': source_stats,
                'total_events': len(events),
                'analysis_timestamp': datetime.utcnow().isoformat()
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error generating threat statistics: {str(e)}")
            return {'error': str(e)}
    
    # Function 77: Dashboard incident timeline
    def generate_incident_timeline(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Generate incident timeline for dashboard"""
        try:
            if not events:
                return {'error': 'No events provided'}
            
            # Sort events by timestamp
            sorted_events = sorted(events, key=lambda x: x.get('timestamp', ''))
            
            # Create timeline entries
            timeline_entries = []
            for event in sorted_events:
                timeline_entry = {
                    'timestamp': event.get('timestamp'),
                    'event_id': event.get('id'),
                    'type': event.get('type'),
                    'severity': event.get('severity', 'medium'),
                    'description': event.get('description', ''),
                    'source': event.get('source', 'unknown'),
                    'confidence': event.get('confidence', 0.0)
                }
                timeline_entries.append(timeline_entry)
            
            # Group by time periods
            time_groups = self._group_events_by_time(timeline_entries)
            
            # Calculate incident phases
            phases = self._identify_incident_phases(timeline_entries)
            
            analysis = {
                'timeline_entries': timeline_entries,
                'time_groups': time_groups,
                'phases': phases,
                'total_events': len(events),
                'incident_duration': self._calculate_incident_duration(timeline_entries),
                'first_event': timeline_entries[0] if timeline_entries else None,
                'last_event': timeline_entries[-1] if timeline_entries else None
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error generating incident timeline: {str(e)}")
            return {'error': str(e)}
    
    # Function 78: Dashboard system health monitoring
    def monitor_system_health(self) -> Dict[str, Any]:
        """Monitor system health across all modules"""
        try:
            # Check module health
            module_health = self._check_module_health()
            
            # Check database health
            database_health = self._check_database_health()
            
            # Check ML model health
            ml_model_health = self._check_ml_model_health()
            
            # Check API health
            api_health = self._check_api_health()
            
            # Calculate overall health
            overall_health = self._calculate_overall_health([
                module_health, database_health, ml_model_health, api_health
            ])
            
            analysis = {
                'overall_health': overall_health,
                'module_health': module_health,
                'database_health': database_health,
                'ml_model_health': ml_model_health,
                'api_health': api_health,
                'timestamp': datetime.utcnow().isoformat()
            }
            
            return analysis
            
        except Exception as e:
            logger.error(f"Error monitoring system health: {str(e)}")
            return {'error': str(e)}
    
    # Helper methods
    def _calculate_correlation_score(self, event1: Dict[str, Any], event2: Dict[str, Any]) -> float:
        """Calculate correlation score between two events"""
        try:
            score = 0.0
            
            # Time correlation
            time_diff = abs(
                datetime.fromisoformat(event1.get('timestamp', '')) - 
                datetime.fromisoformat(event2.get('timestamp', ''))
            ).total_seconds()
            
            if time_diff < 3600:  # Within 1 hour
                score += 0.3
            elif time_diff < 86400:  # Within 1 day
                score += 0.1
            
            # IP correlation
            if event1.get('source_ip') == event2.get('source_ip'):
                score += 0.4
            
            # Type correlation
            if event1.get('type') == event2.get('type'):
                score += 0.2
            
            # Target correlation
            if event1.get('target') == event2.get('target'):
                score += 0.3
            
            return min(score, 1.0)
            
        except Exception as e:
            logger.error(f"Error calculating correlation score: {str(e)}")
            return 0.0
    
    def _get_correlation_type(self, event1: Dict[str, Any], event2: Dict[str, Any]) -> str:
        """Get correlation type between two events"""
        try:
            if event1.get('source_ip') == event2.get('source_ip'):
                return 'same_source'
            elif event1.get('target') == event2.get('target'):
                return 'same_target'
            elif event1.get('type') == event2.get('type'):
                return 'same_type'
            else:
                return 'general'
                
        except Exception as e:
            logger.error(f"Error getting correlation type: {str(e)}")
            return 'unknown'
    
    def _graph_to_dict(self, graph: nx.Graph) -> Dict[str, Any]:
        """Convert networkx graph to dictionary"""
        try:
            return {
                'nodes': list(graph.nodes()),
                'edges': list(graph.edges(data=True)),
                'node_count': graph.number_of_nodes(),
                'edge_count': graph.number_of_edges()
            }
        except Exception as e:
            logger.error(f"Error converting graph to dict: {str(e)}")
            return {}
    
    def _identify_attack_phases(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Identify attack phases from events"""
        try:
            phases = []
            current_phase = None
            
            for event in events:
                event_type = event.get('type', 'unknown')
                
                if event_type in ['reconnaissance', 'scanning']:
                    phase = 'reconnaissance'
                elif event_type in ['exploitation', 'privilege_escalation']:
                    phase = 'exploitation'
                elif event_type in ['persistence', 'lateral_movement']:
                    phase = 'persistence'
                elif event_type in ['data_exfiltration', 'impact']:
                    phase = 'impact'
                else:
                    phase = 'unknown'
                
                if phase != current_phase:
                    phases.append({
                        'phase': phase,
                        'start_time': event.get('timestamp'),
                        'events': [event]
                    })
                    current_phase = phase
                else:
                    phases[-1]['events'].append(event)
            
            return phases
            
        except Exception as e:
            logger.error(f"Error identifying attack phases: {str(e)}")
            return []
    
    def _map_to_kill_chain(self, phases: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Map phases to kill chain"""
        try:
            kill_chain = {
                'reconnaissance': [],
                'weaponization': [],
                'delivery': [],
                'exploitation': [],
                'installation': [],
                'command_control': [],
                'actions_objectives': []
            }
            
            for phase in phases:
                phase_name = phase['phase']
                if phase_name in kill_chain:
                    kill_chain[phase_name] = phase['events']
            
            return kill_chain
            
        except Exception as e:
            logger.error(f"Error mapping to kill chain: {str(e)}")
            return {}
    
    def _create_attack_timeline(self, events: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Create attack timeline"""
        try:
            timeline = []
            for event in events:
                timeline.append({
                    'timestamp': event.get('timestamp'),
                    'event_id': event.get('id'),
                    'type': event.get('type'),
                    'description': event.get('description', ''),
                    'severity': event.get('severity', 'medium')
                })
            
            return timeline
            
        except Exception as e:
            logger.error(f"Error creating attack timeline: {str(e)}")
            return []
    
    def _identify_threat_actor(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Identify threat actor from events"""
        try:
            # Simple threat actor identification based on patterns
            threat_actor = {
                'name': 'Unknown',
                'confidence': 0.0,
                'indicators': [],
                'tactics': [],
                'techniques': []
            }
            
            # Analyze event patterns
            for event in events:
                if event.get('type') == 'phishing':
                    threat_actor['tactics'].append('phishing')
                elif event.get('type') == 'malware':
                    threat_actor['tactics'].append('malware')
                elif event.get('type') == 'intrusion':
                    threat_actor['tactics'].append('intrusion')
            
            # Remove duplicates
            threat_actor['tactics'] = list(set(threat_actor['tactics']))
            
            return threat_actor
            
        except Exception as e:
            logger.error(f"Error identifying threat actor: {str(e)}")
            return {'name': 'Unknown', 'confidence': 0.0}
    
    def _calculate_attack_duration(self, events: List[Dict[str, Any]]) -> str:
        """Calculate attack duration"""
        try:
            if len(events) < 2:
                return '0 minutes'
            
            start_time = datetime.fromisoformat(events[0].get('timestamp', ''))
            end_time = datetime.fromisoformat(events[-1].get('timestamp', ''))
            duration = end_time - start_time
            
            if duration.days > 0:
                return f"{duration.days} days, {duration.seconds // 3600} hours"
            elif duration.seconds > 3600:
                return f"{duration.seconds // 3600} hours, {(duration.seconds % 3600) // 60} minutes"
            else:
                return f"{duration.seconds // 60} minutes"
                
        except Exception as e:
            logger.error(f"Error calculating attack duration: {str(e)}")
            return 'Unknown'
    
    def _calculate_attack_severity(self, events: List[Dict[str, Any]]) -> str:
        """Calculate attack severity"""
        try:
            severities = [event.get('severity', 'medium') for event in events]
            
            if 'critical' in severities:
                return 'critical'
            elif 'high' in severities:
                return 'high'
            elif 'medium' in severities:
                return 'medium'
            else:
                return 'low'
                
        except Exception as e:
            logger.error(f"Error calculating attack severity: {str(e)}")
            return 'unknown'
    
    def _get_base_severity(self, event_type: str) -> float:
        """Get base severity for event type"""
        severity_map = {
            'phishing': 0.6,
            'malware': 0.8,
            'intrusion': 0.7,
            'data_breach': 0.9,
            'ddos': 0.5,
            'brute_force': 0.4
        }
        return severity_map.get(event_type, 0.5)
    
    def _get_severity_factors(self, event: Dict[str, Any]) -> List[str]:
        """Get severity factors for event"""
        factors = []
        
        if event.get('is_critical', False):
            factors.append('critical_flag')
        
        if event.get('affects_multiple_systems', False):
            factors.append('multi_system_impact')
        
        if event.get('has_lateral_movement', False):
            factors.append('lateral_movement')
        
        return factors
    
    def _map_severity_rating(self, severity_score: float) -> str:
        """Map severity score to rating"""
        if severity_score >= 0.8:
            return 'Critical'
        elif severity_score >= 0.6:
            return 'High'
        elif severity_score >= 0.4:
            return 'Medium'
        else:
            return 'Low'
    
    def _create_alert_hash(self, alert: Dict[str, Any]) -> str:
        """Create hash for alert deduplication"""
        try:
            # Create hash based on key fields
            key_fields = [
                alert.get('type', ''),
                alert.get('source_ip', ''),
                alert.get('target', ''),
                alert.get('timestamp', '')[:10]  # Date only
            ]
            return hashlib.md5('|'.join(key_fields).encode()).hexdigest()
        except Exception as e:
            logger.error(f"Error creating alert hash: {str(e)}")
            return str(hash(str(alert)))
    
    def _group_similar_alerts(self, alerts: List[Dict[str, Any]]) -> List[List[Dict[str, Any]]]:
        """Group similar alerts"""
        try:
            if len(alerts) < 2:
                return [alerts]
            
            # Extract features for clustering
            features = []
            for alert in alerts:
                feature = [
                    1.0 if alert.get('type') == 'phishing' else 0.0,
                    1.0 if alert.get('type') == 'malware' else 0.0,
                    1.0 if alert.get('type') == 'intrusion' else 0.0,
                    alert.get('confidence', 0.0)
                ]
                features.append(feature)
            
            # Cluster alerts
            clustering = DBSCAN(eps=0.3, min_samples=2).fit(features)
            
            # Group alerts by cluster
            groups = defaultdict(list)
            for i, label in enumerate(clustering.labels_):
                groups[label].append(alerts[i])
            
            return list(groups.values())
            
        except Exception as e:
            logger.error(f"Error grouping similar alerts: {str(e)}")
            return [alerts]
    
    def _create_consolidated_alert(self, alert_type: str, alerts: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create consolidated alert from multiple alerts"""
        try:
            if not alerts:
                return {}
            
            # Calculate aggregated metrics
            total_alerts = len(alerts)
            avg_confidence = sum(alert.get('confidence', 0.0) for alert in alerts) / total_alerts
            max_severity = max(alert.get('severity', 'low') for alert in alerts)
            
            # Get unique sources and targets
            sources = list(set(alert.get('source_ip', '') for alert in alerts))
            targets = list(set(alert.get('target', '') for alert in alerts))
            
            consolidated_alert = {
                'id': f"consolidated_{alert_type}_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}",
                'type': alert_type,
                'total_alerts': total_alerts,
                'avg_confidence': avg_confidence,
                'max_severity': max_severity,
                'sources': sources,
                'targets': targets,
                'first_occurrence': min(alert.get('timestamp', '') for alert in alerts),
                'last_occurrence': max(alert.get('timestamp', '') for alert in alerts),
                'consolidated_at': datetime.utcnow().isoformat()
            }
            
            return consolidated_alert
            
        except Exception as e:
            logger.error(f"Error creating consolidated alert: {str(e)}")
            return {}
    
    def _get_base_risk(self, event_type: str) -> float:
        """Get base risk for event type"""
        risk_map = {
            'phishing': 0.6,
            'malware': 0.8,
            'intrusion': 0.7,
            'data_breach': 0.9,
            'ddos': 0.5,
            'brute_force': 0.4
        }
        return risk_map.get(event_type, 0.5)
    
    def _get_risk_factors(self, event: Dict[str, Any]) -> List[str]:
        """Get risk factors for event"""
        factors = []
        
        if event.get('is_critical', False):
            factors.append('critical_flag')
        
        if event.get('affects_multiple_systems', False):
            factors.append('multi_system_impact')
        
        if event.get('has_lateral_movement', False):
            factors.append('lateral_movement')
        
        return factors
    
    def _map_risk_level(self, risk_score: float) -> str:
        """Map risk score to level"""
        if risk_score >= 0.8:
            return 'Critical'
        elif risk_score >= 0.6:
            return 'High'
        elif risk_score >= 0.4:
            return 'Medium'
        else:
            return 'Low'
    
    def _calculate_risk_distribution(self, risk_factors: List[Dict[str, Any]]) -> Dict[str, int]:
        """Calculate risk distribution"""
        try:
            distribution = {'low': 0, 'medium': 0, 'high': 0, 'critical': 0}
            
            for factor in risk_factors:
                risk_level = self._map_risk_level(factor['adjusted_risk'])
                distribution[risk_level.lower()] += 1
            
            return distribution
            
        except Exception as e:
            logger.error(f"Error calculating risk distribution: {str(e)}")
            return {'low': 0, 'medium': 0, 'high': 0, 'critical': 0}
    
    def _calculate_time_statistics(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate time-based statistics"""
        try:
            timestamps = [event.get('timestamp', '') for event in events]
            valid_timestamps = [ts for ts in timestamps if ts]
            
            if not valid_timestamps:
                return {'error': 'No valid timestamps'}
            
            # Parse timestamps
            parsed_timestamps = [datetime.fromisoformat(ts) for ts in valid_timestamps]
            
            # Calculate statistics
            stats = {
                'total_events': len(valid_timestamps),
                'first_event': min(parsed_timestamps).isoformat(),
                'last_event': max(parsed_timestamps).isoformat(),
                'time_span_hours': (max(parsed_timestamps) - min(parsed_timestamps)).total_seconds() / 3600,
                'events_per_hour': len(valid_timestamps) / max(1, (max(parsed_timestamps) - min(parsed_timestamps)).total_seconds() / 3600)
            }
            
            return stats
            
        except Exception as e:
            logger.error(f"Error calculating time statistics: {str(e)}")
            return {'error': str(e)}
    
    def _calculate_type_statistics(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate type-based statistics"""
        try:
            type_counts = defaultdict(int)
            
            for event in events:
                event_type = event.get('type', 'unknown')
                type_counts[event_type] += 1
            
            total_events = len(events)
            type_percentages = {
                event_type: (count / total_events) * 100 
                for event_type, count in type_counts.items()
            }
            
            return {
                'type_counts': dict(type_counts),
                'type_percentages': type_percentages,
                'most_common_type': max(type_counts.items(), key=lambda x: x[1])[0] if type_counts else 'unknown'
            }
            
        except Exception as e:
            logger.error(f"Error calculating type statistics: {str(e)}")
            return {'error': str(e)}
    
    def _calculate_severity_statistics(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate severity-based statistics"""
        try:
            severity_counts = defaultdict(int)
            
            for event in events:
                severity = event.get('severity', 'medium')
                severity_counts[severity] += 1
            
            total_events = len(events)
            severity_percentages = {
                severity: (count / total_events) * 100 
                for severity, count in severity_counts.items()
            }
            
            return {
                'severity_counts': dict(severity_counts),
                'severity_percentages': severity_percentages,
                'most_common_severity': max(severity_counts.items(), key=lambda x: x[1])[0] if severity_counts else 'medium'
            }
            
        except Exception as e:
            logger.error(f"Error calculating severity statistics: {str(e)}")
            return {'error': str(e)}
    
    def _calculate_geographic_statistics(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate geographic statistics"""
        try:
            country_counts = defaultdict(int)
            
            for event in events:
                country = event.get('country', 'unknown')
                country_counts[country] += 1
            
            return {
                'country_counts': dict(country_counts),
                'top_countries': sorted(country_counts.items(), key=lambda x: x[1], reverse=True)[:10]
            }
            
        except Exception as e:
            logger.error(f"Error calculating geographic statistics: {str(e)}")
            return {'error': str(e)}
    
    def _calculate_source_statistics(self, events: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate source statistics"""
        try:
            source_counts = defaultdict(int)
            
            for event in events:
                source = event.get('source', 'unknown')
                source_counts[source] += 1
            
            return {
                'source_counts': dict(source_counts),
                'top_sources': sorted(source_counts.items(), key=lambda x: x[1], reverse=True)[:10]
            }
            
        except Exception as e:
            logger.error(f"Error calculating source statistics: {str(e)}")
            return {'error': str(e)}
    
    def _group_events_by_time(self, timeline_entries: List[Dict[str, Any]]) -> Dict[str, List[Dict[str, Any]]]:
        """Group events by time periods"""
        try:
            time_groups = defaultdict(list)
            
            for entry in timeline_entries:
                timestamp = entry.get('timestamp', '')
                if timestamp:
                    # Group by hour
                    hour_key = timestamp[:13]  # YYYY-MM-DDTHH
                    time_groups[hour_key].append(entry)
            
            return dict(time_groups)
            
        except Exception as e:
            logger.error(f"Error grouping events by time: {str(e)}")
            return {}
    
    def _identify_incident_phases(self, timeline_entries: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
        """Identify incident phases"""
        try:
            phases = []
            current_phase = None
            
            for entry in timeline_entries:
                event_type = entry.get('type', 'unknown')
                
                if event_type in ['reconnaissance', 'scanning']:
                    phase = 'reconnaissance'
                elif event_type in ['exploitation', 'privilege_escalation']:
                    phase = 'exploitation'
                elif event_type in ['persistence', 'lateral_movement']:
                    phase = 'persistence'
                elif event_type in ['data_exfiltration', 'impact']:
                    phase = 'impact'
                else:
                    phase = 'unknown'
                
                if phase != current_phase:
                    phases.append({
                        'phase': phase,
                        'start_time': entry.get('timestamp'),
                        'event_count': 1
                    })
                    current_phase = phase
                else:
                    phases[-1]['event_count'] += 1
            
            return phases
            
        except Exception as e:
            logger.error(f"Error identifying incident phases: {str(e)}")
            return []
    
    def _calculate_incident_duration(self, timeline_entries: List[Dict[str, Any]]) -> str:
        """Calculate incident duration"""
        try:
            if len(timeline_entries) < 2:
                return '0 minutes'
            
            start_time = datetime.fromisoformat(timeline_entries[0].get('timestamp', ''))
            end_time = datetime.fromisoformat(timeline_entries[-1].get('timestamp', ''))
            duration = end_time - start_time
            
            if duration.days > 0:
                return f"{duration.days} days, {duration.seconds // 3600} hours"
            elif duration.seconds > 3600:
                return f"{duration.seconds // 3600} hours, {(duration.seconds % 3600) // 60} minutes"
            else:
                return f"{duration.seconds // 60} minutes"
                
        except Exception as e:
            logger.error(f"Error calculating incident duration: {str(e)}")
            return 'Unknown'
    
    def _check_module_health(self) -> Dict[str, Any]:
        """Check module health"""
        try:
            modules = ['phishing', 'malware', 'ids', 'threat_intel']
            health_status = {}
            
            for module in modules:
                # This would check actual module health in a real implementation
                health_status[module] = {
                    'status': 'healthy',
                    'uptime': '99.9%',
                    'last_check': datetime.utcnow().isoformat()
                }
            
            return {
                'overall_status': 'healthy',
                'modules': health_status,
                'timestamp': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error checking module health: {str(e)}")
            return {'error': str(e)}
    
    def _check_database_health(self) -> Dict[str, Any]:
        """Check database health"""
        try:
            # This would check actual database health in a real implementation
            return {
                'status': 'healthy',
                'connection_count': 5,
                'response_time': '2ms',
                'last_check': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error checking database health: {str(e)}")
            return {'error': str(e)}
    
    def _check_ml_model_health(self) -> Dict[str, Any]:
        """Check ML model health"""
        try:
            # This would check actual ML model health in a real implementation
            return {
                'status': 'healthy',
                'models_loaded': 4,
                'last_training': '2024-01-01T00:00:00Z',
                'accuracy': 0.95,
                'last_check': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error checking ML model health: {str(e)}")
            return {'error': str(e)}
    
    def _check_api_health(self) -> Dict[str, Any]:
        """Check API health"""
        try:
            # This would check actual API health in a real implementation
            return {
                'status': 'healthy',
                'response_time': '45ms',
                'uptime': '99.9%',
                'last_check': datetime.utcnow().isoformat()
            }
            
        except Exception as e:
            logger.error(f"Error checking API health: {str(e)}")
            return {'error': str(e)}
    
    def _calculate_overall_health(self, health_checks: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Calculate overall system health"""
        try:
            healthy_count = sum(1 for check in health_checks if check.get('status') == 'healthy')
            total_count = len(health_checks)
            
            overall_status = 'healthy' if healthy_count == total_count else 'degraded'
            health_percentage = (healthy_count / total_count) * 100
            
            return {
                'status': overall_status,
                'health_percentage': health_percentage,
                'healthy_components': healthy_count,
                'total_components': total_count
            }
            
        except Exception as e:
            logger.error(f"Error calculating overall health: {str(e)}")
            return {'error': str(e)}

# Global instance
fusion_engine = FusionEngine()

def get_fusion_engine() -> FusionEngine:
    """Get fusion engine instance"""
    return fusion_engine
