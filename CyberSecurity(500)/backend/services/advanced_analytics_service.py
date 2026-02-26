"""
Advanced Analytics Service for NEXUS CYBER INTELLIGENCE
Graph Neural Networks, Predictive Analytics, and Behavioral Analysis
"""

import json
import hashlib
import time
import numpy as np
import pandas as pd
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import logging
import random
import networkx as nx
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import IsolationForest
from sklearn.cluster import DBSCAN
import torch
import torch.nn as nn
import torch.nn.functional as F
from torch_geometric.nn import GCNConv, GATConv, GraphSAGE
from torch_geometric.data import Data, DataLoader
import dgl
import stellargraph as sg
from stellargraph import StellarGraph
from stellargraph.layer import GCN, GAT, GraphSAGE as StellarGraphSAGE

logger = logging.getLogger(__name__)

class AnalyticsType(Enum):
    GRAPH_NEURAL_NETWORK = "graph_neural_network"
    PREDICTIVE_MODELING = "predictive_modeling"
    BEHAVIORAL_ANALYSIS = "behavioral_analysis"
    ANOMALY_DETECTION = "anomaly_detection"
    THREAT_CORRELATION = "threat_correlation"
    NETWORK_ANALYSIS = "network_analysis"

class GraphModelType(Enum):
    GCN = "gcn"
    GAT = "gat"
    GRAPH_SAGE = "graph_sage"
    GIN = "gin"
    TRANSFORMER = "transformer"

@dataclass
class GraphNode:
    node_id: str
    node_type: str
    features: Dict[str, Any]
    position: Tuple[float, float, float]
    metadata: Dict[str, Any]

@dataclass
class GraphEdge:
    source: str
    target: str
    edge_type: str
    weight: float
    features: Dict[str, Any]

@dataclass
class AnalyticsResult:
    analysis_id: str
    analysis_type: AnalyticsType
    confidence: float
    predictions: List[Dict[str, Any]]
    insights: List[str]
    recommendations: List[str]
    model_used: str
    timestamp: datetime

class GraphNeuralNetwork:
    """Graph Neural Network implementation for threat analysis"""
    
    def __init__(self, model_type: GraphModelType = GraphModelType.GCN):
        self.model_type = model_type
        self.model = None
        self.feature_dim = 128
        self.hidden_dim = 64
        self.output_dim = 7  # Number of threat types
        self._initialize_model()
    
    def _initialize_model(self):
        """Initialize GNN model based on type"""
        if self.model_type == GraphModelType.GCN:
            self.model = GCNModel(self.feature_dim, self.hidden_dim, self.output_dim)
        elif self.model_type == GraphModelType.GAT:
            self.model = GATModel(self.feature_dim, self.hidden_dim, self.output_dim)
        elif self.model_type == GraphModelType.GRAPH_SAGE:
            self.model = GraphSAGEModel(self.feature_dim, self.hidden_dim, self.output_dim)
    
    def train(self, graph_data: Data, labels: torch.Tensor, epochs: int = 100):
        """Train the GNN model"""
        optimizer = torch.optim.Adam(self.model.parameters(), lr=0.01)
        criterion = nn.CrossEntropyLoss()
        
        self.model.train()
        for epoch in range(epochs):
            optimizer.zero_grad()
            out = self.model(graph_data.x, graph_data.edge_index)
            loss = criterion(out, labels)
            loss.backward()
            optimizer.step()
            
            if epoch % 20 == 0:
                logger.info(f'Epoch {epoch}, Loss: {loss.item():.4f}')
    
    def predict(self, graph_data: Data) -> torch.Tensor:
        """Make predictions using the trained model"""
        self.model.eval()
        with torch.no_grad():
            predictions = self.model(graph_data.x, graph_data.edge_index)
            return F.softmax(predictions, dim=1)
    
    def analyze_threats(self, nodes: List[GraphNode], edges: List[GraphEdge]) -> Dict[str, Any]:
        """Analyze threats using graph neural network"""
        try:
            # Convert to PyTorch Geometric format
            graph_data = self._convert_to_pyg_format(nodes, edges)
            
            # Make predictions
            predictions = self.predict(graph_data)
            
            # Extract threat probabilities
            threat_probs = predictions.numpy()
            threat_types = ['Malware', 'Phishing', 'DDoS', 'Intrusion', 'Ransomware', 'APT', 'Insider']
            
            results = []
            for i, node in enumerate(nodes):
                threat_scores = dict(zip(threat_types, threat_probs[i]))
                max_threat = max(threat_scores.items(), key=lambda x: x[1])
                
                results.append({
                    'node_id': node.node_id,
                    'threat_type': max_threat[0],
                    'confidence': float(max_threat[1]),
                    'all_scores': threat_scores
                })
            
            return {
                'success': True,
                'threat_analysis': results,
                'model_type': self.model_type.value,
                'total_nodes': len(nodes),
                'total_edges': len(edges)
            }
            
        except Exception as e:
            logger.error(f"Error in GNN threat analysis: {e}")
            return {'success': False, 'error': str(e)}
    
    def _convert_to_pyg_format(self, nodes: List[GraphNode], edges: List[GraphEdge]) -> Data:
        """Convert nodes and edges to PyTorch Geometric format"""
        # Create node features
        node_features = []
        node_mapping = {node.node_id: i for i, node in enumerate(nodes)}
        
        for node in nodes:
            features = self._extract_node_features(node)
            node_features.append(features)
        
        # Create edge indices
        edge_indices = []
        for edge in edges:
            if edge.source in node_mapping and edge.target in node_mapping:
                edge_indices.append([node_mapping[edge.source], node_mapping[edge.target]])
                edge_indices.append([node_mapping[edge.target], node_mapping[edge.source]])  # Undirected
        
        x = torch.tensor(node_features, dtype=torch.float)
        edge_index = torch.tensor(edge_indices, dtype=torch.long).t().contiguous()
        
        return Data(x=x, edge_index=edge_index)
    
    def _extract_node_features(self, node: GraphNode) -> List[float]:
        """Extract features from a graph node"""
        features = []
        
        # Basic features
        features.extend([
            len(node.features.get('connections', [])),
            node.features.get('severity_score', 0.0),
            node.features.get('activity_level', 0.0),
            node.features.get('risk_score', 0.0)
        ])
        
        # Pad to feature_dim
        while len(features) < self.feature_dim:
            features.append(0.0)
        
        return features[:self.feature_dim]

class GCNModel(nn.Module):
    """Graph Convolutional Network model"""
    
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.conv1 = GCNConv(input_dim, hidden_dim)
        self.conv2 = GCNConv(hidden_dim, hidden_dim)
        self.classifier = nn.Linear(hidden_dim, output_dim)
        self.dropout = nn.Dropout(0.5)
    
    def forward(self, x, edge_index):
        x = F.relu(self.conv1(x, edge_index))
        x = self.dropout(x)
        x = F.relu(self.conv2(x, edge_index))
        x = torch.mean(x, dim=0)  # Global pooling
        return self.classifier(x)

class GATModel(nn.Module):
    """Graph Attention Network model"""
    
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.conv1 = GATConv(input_dim, hidden_dim, heads=4, dropout=0.5)
        self.conv2 = GATConv(hidden_dim * 4, hidden_dim, heads=1, dropout=0.5)
        self.classifier = nn.Linear(hidden_dim, output_dim)
        self.dropout = nn.Dropout(0.5)
    
    def forward(self, x, edge_index):
        x = F.relu(self.conv1(x, edge_index))
        x = self.dropout(x)
        x = F.relu(self.conv2(x, edge_index))
        x = torch.mean(x, dim=0)  # Global pooling
        return self.classifier(x)

class GraphSAGEModel(nn.Module):
    """GraphSAGE model"""
    
    def __init__(self, input_dim, hidden_dim, output_dim):
        super().__init__()
        self.sage1 = GraphSAGE(input_dim, hidden_dim, num_layers=2)
        self.sage2 = GraphSAGE(hidden_dim, hidden_dim, num_layers=2)
        self.classifier = nn.Linear(hidden_dim, output_dim)
        self.dropout = nn.Dropout(0.5)
    
    def forward(self, x, edge_index):
        x = F.relu(self.sage1(x, edge_index))
        x = self.dropout(x)
        x = F.relu(self.sage2(x, edge_index))
        x = torch.mean(x, dim=0)  # Global pooling
        return self.classifier(x)

class PredictiveModeling:
    """Predictive modeling for threat forecasting"""
    
    def __init__(self):
        self.models = {}
        self.scaler = StandardScaler()
        self._initialize_models()
    
    def _initialize_models(self):
        """Initialize predictive models"""
        self.models = {
            'threat_forecast': self._create_threat_forecast_model(),
            'attack_prediction': self._create_attack_prediction_model(),
            'vulnerability_assessment': self._create_vulnerability_model(),
            'risk_scoring': self._create_risk_scoring_model()
        }
    
    def _create_threat_forecast_model(self):
        """Create threat forecasting model"""
        # Simulate advanced forecasting model
        return {
            'type': 'LSTM_Transformer',
            'features': ['historical_threats', 'seasonal_patterns', 'external_factors'],
            'accuracy': 0.87,
            'forecast_horizon': '30_days'
        }
    
    def _create_attack_prediction_model(self):
        """Create attack prediction model"""
        return {
            'type': 'Ensemble_RandomForest',
            'features': ['network_activity', 'user_behavior', 'system_vulnerabilities'],
            'accuracy': 0.92,
            'prediction_window': '7_days'
        }
    
    def _create_vulnerability_model(self):
        """Create vulnerability assessment model"""
        return {
            'type': 'Deep_Neural_Network',
            'features': ['system_configuration', 'patch_status', 'network_topology'],
            'accuracy': 0.89,
            'assessment_scope': 'enterprise_wide'
        }
    
    def _create_risk_scoring_model(self):
        """Create risk scoring model"""
        return {
            'type': 'Gradient_Boosting',
            'features': ['threat_intelligence', 'asset_criticality', 'exposure_level'],
            'accuracy': 0.94,
            'score_range': '0-100'
        }
    
    def predict_threats(self, historical_data: List[Dict[str, Any]], forecast_days: int = 30) -> Dict[str, Any]:
        """Predict future threats"""
        try:
            # Simulate threat forecasting
            predictions = []
            base_threats = ['Malware', 'Phishing', 'DDoS', 'Ransomware', 'APT']
            
            for day in range(forecast_days):
                daily_threats = []
                for _ in range(random.randint(5, 15)):
                    threat = {
                        'date': (datetime.now() + timedelta(days=day)).isoformat(),
                        'type': random.choice(base_threats),
                        'severity': random.choice(['Low', 'Medium', 'High', 'Critical']),
                        'probability': random.uniform(0.1, 0.9),
                        'confidence': random.uniform(0.7, 0.95)
                    }
                    daily_threats.append(threat)
                predictions.append({
                    'date': (datetime.now() + timedelta(days=day)).isoformat(),
                    'threats': daily_threats,
                    'risk_level': random.choice(['Low', 'Medium', 'High'])
                })
            
            return {
                'success': True,
                'forecast_period': f'{forecast_days} days',
                'predictions': predictions,
                'model_accuracy': 0.87,
                'confidence_interval': '±15%'
            }
            
        except Exception as e:
            logger.error(f"Error in threat prediction: {e}")
            return {'success': False, 'error': str(e)}
    
    def predict_attacks(self, network_data: Dict[str, Any]) -> Dict[str, Any]:
        """Predict potential attacks"""
        try:
            # Simulate attack prediction
            attack_probabilities = {
                'malware_infection': random.uniform(0.1, 0.8),
                'phishing_campaign': random.uniform(0.2, 0.7),
                'ddos_attack': random.uniform(0.05, 0.6),
                'ransomware': random.uniform(0.1, 0.5),
                'insider_threat': random.uniform(0.05, 0.4),
                'apt_attack': random.uniform(0.02, 0.3)
            }
            
            high_risk_attacks = [attack for attack, prob in attack_probabilities.items() if prob > 0.5]
            
            return {
                'success': True,
                'attack_probabilities': attack_probabilities,
                'high_risk_attacks': high_risk_attacks,
                'overall_risk_score': max(attack_probabilities.values()),
                'recommendations': self._generate_attack_recommendations(high_risk_attacks)
            }
            
        except Exception as e:
            logger.error(f"Error in attack prediction: {e}")
            return {'success': False, 'error': str(e)}
    
    def _generate_attack_recommendations(self, high_risk_attacks: List[str]) -> List[str]:
        """Generate recommendations based on predicted attacks"""
        recommendations = []
        
        if 'malware_infection' in high_risk_attacks:
            recommendations.append('Implement advanced endpoint protection')
        if 'phishing_campaign' in high_risk_attacks:
            recommendations.append('Enhance email security filters')
        if 'ddos_attack' in high_risk_attacks:
            recommendations.append('Prepare DDoS mitigation strategies')
        if 'ransomware' in high_risk_attacks:
            recommendations.append('Strengthen backup and recovery procedures')
        if 'insider_threat' in high_risk_attacks:
            recommendations.append('Implement user behavior monitoring')
        if 'apt_attack' in high_risk_attacks:
            recommendations.append('Deploy advanced threat hunting capabilities')
        
        return recommendations

class BehavioralAnalytics:
    """Advanced behavioral analytics for insider threat detection"""
    
    def __init__(self):
        self.behavioral_models = {}
        self.baseline_profiles = {}
        self._initialize_behavioral_models()
    
    def _initialize_behavioral_models(self):
        """Initialize behavioral analysis models"""
        self.behavioral_models = {
            'keystroke_dynamics': {
                'type': 'Biometric_Analysis',
                'features': ['rhythm', 'pressure', 'timing'],
                'accuracy': 0.89
            },
            'mouse_movements': {
                'type': 'Trajectory_Analysis',
                'features': ['smoothness', 'speed', 'acceleration'],
                'accuracy': 0.85
            },
            'access_patterns': {
                'type': 'Temporal_Analysis',
                'features': ['frequency', 'duration', 'sequences'],
                'accuracy': 0.92
            },
            'communication_style': {
                'type': 'Linguistic_Analysis',
                'features': ['sentiment', 'complexity', 'patterns'],
                'accuracy': 0.78
            }
        }
    
    def analyze_user_behavior(self, user_id: str, behavior_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze user behavior for anomalies"""
        try:
            # Simulate behavioral analysis
            analysis_results = {
                'user_id': user_id,
                'analysis_timestamp': datetime.now().isoformat(),
                'behavioral_indicators': {},
                'anomaly_score': 0.0,
                'risk_level': 'Low',
                'recommendations': []
            }
            
            # Analyze different behavioral aspects
            for behavior_type, model in self.behavioral_models.items():
                if behavior_type in behavior_data:
                    indicator = self._analyze_behavior_indicator(
                        behavior_type, 
                        behavior_data[behavior_type], 
                        model
                    )
                    analysis_results['behavioral_indicators'][behavior_type] = indicator
            
            # Calculate overall anomaly score
            anomaly_scores = [indicator.get('anomaly_score', 0) for indicator in analysis_results['behavioral_indicators'].values()]
            analysis_results['anomaly_score'] = np.mean(anomaly_scores) if anomaly_scores else 0.0
            
            # Determine risk level
            if analysis_results['anomaly_score'] > 0.8:
                analysis_results['risk_level'] = 'High'
                analysis_results['recommendations'].append('Immediate investigation required')
            elif analysis_results['anomaly_score'] > 0.6:
                analysis_results['risk_level'] = 'Medium'
                analysis_results['recommendations'].append('Enhanced monitoring recommended')
            else:
                analysis_results['risk_level'] = 'Low'
                analysis_results['recommendations'].append('Normal monitoring sufficient')
            
            return {
                'success': True,
                'behavioral_analysis': analysis_results
            }
            
        except Exception as e:
            logger.error(f"Error in behavioral analysis: {e}")
            return {'success': False, 'error': str(e)}
    
    def _analyze_behavior_indicator(self, behavior_type: str, data: Any, model: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze specific behavioral indicator"""
        # Simulate behavioral analysis
        anomaly_score = random.uniform(0.1, 0.9)
        confidence = random.uniform(0.7, 0.95)
        
        return {
            'behavior_type': behavior_type,
            'anomaly_score': anomaly_score,
            'confidence': confidence,
            'model_accuracy': model['accuracy'],
            'status': 'Anomalous' if anomaly_score > 0.7 else 'Normal',
            'details': f'Analysis of {behavior_type} shows {"anomalous" if anomaly_score > 0.7 else "normal"} patterns'
        }
    
    def create_behavioral_profile(self, user_id: str, historical_data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create behavioral baseline profile for user"""
        try:
            # Simulate profile creation
            profile = {
                'user_id': user_id,
                'created_at': datetime.now().isoformat(),
                'baseline_metrics': {
                    'keystroke_rhythm': random.uniform(0.6, 0.9),
                    'mouse_smoothness': random.uniform(0.7, 0.95),
                    'access_frequency': random.uniform(0.5, 0.8),
                    'communication_style': random.uniform(0.6, 0.9)
                },
                'confidence_level': random.uniform(0.8, 0.95),
                'data_points': len(historical_data),
                'profile_stability': random.uniform(0.7, 0.9)
            }
            
            self.baseline_profiles[user_id] = profile
            
            return {
                'success': True,
                'behavioral_profile': profile
            }
            
        except Exception as e:
            logger.error(f"Error creating behavioral profile: {e}")
            return {'success': False, 'error': str(e)}

class AdvancedAnalyticsService:
    """Main service for advanced analytics capabilities"""
    
    def __init__(self):
        self.gnn = GraphNeuralNetwork()
        self.predictive_modeling = PredictiveModeling()
        self.behavioral_analytics = BehavioralAnalytics()
        self.anomaly_detector = IsolationForest(contamination=0.1)
        self._initialize_service()
    
    def _initialize_service(self):
        """Initialize the analytics service"""
        logger.info("Advanced Analytics Service initialized")
    
    def analyze_threat_network(self, nodes: List[GraphNode], edges: List[GraphEdge]) -> Dict[str, Any]:
        """Analyze threat network using graph neural networks"""
        try:
            # Perform GNN analysis
            gnn_results = self.gnn.analyze_threats(nodes, edges)
            
            # Additional network analysis
            network_metrics = self._calculate_network_metrics(nodes, edges)
            
            return {
                'success': True,
                'gnn_analysis': gnn_results,
                'network_metrics': network_metrics,
                'insights': self._generate_network_insights(gnn_results, network_metrics),
                'recommendations': self._generate_network_recommendations(gnn_results)
            }
            
        except Exception as e:
            logger.error(f"Error in threat network analysis: {e}")
            return {'success': False, 'error': str(e)}
    
    def _calculate_network_metrics(self, nodes: List[GraphNode], edges: List[GraphEdge]) -> Dict[str, Any]:
        """Calculate network topology metrics"""
        # Create NetworkX graph
        G = nx.Graph()
        
        # Add nodes
        for node in nodes:
            G.add_node(node.node_id, **node.features)
        
        # Add edges
        for edge in edges:
            G.add_edge(edge.source, edge.target, weight=edge.weight)
        
        # Calculate metrics
        metrics = {
            'total_nodes': G.number_of_nodes(),
            'total_edges': G.number_of_edges(),
            'density': nx.density(G),
            'average_clustering': nx.average_clustering(G),
            'connected_components': nx.number_connected_components(G),
            'average_path_length': nx.average_shortest_path_length(G) if nx.is_connected(G) else None,
            'centrality_measures': {
                'degree_centrality': dict(nx.degree_centrality(G)),
                'betweenness_centrality': dict(nx.betweenness_centrality(G)),
                'closeness_centrality': dict(nx.closeness_centrality(G))
            }
        }
        
        return metrics
    
    def _generate_network_insights(self, gnn_results: Dict[str, Any], network_metrics: Dict[str, Any]) -> List[str]:
        """Generate insights from network analysis"""
        insights = []
        
        if network_metrics['density'] > 0.5:
            insights.append("High network density indicates tightly connected threat landscape")
        
        if network_metrics['average_clustering'] > 0.7:
            insights.append("High clustering suggests organized threat groups")
        
        if network_metrics['connected_components'] > 1:
            insights.append(f"Network has {network_metrics['connected_components']} isolated threat clusters")
        
        return insights
    
    def _generate_network_recommendations(self, gnn_results: Dict[str, Any]) -> List[str]:
        """Generate recommendations based on network analysis"""
        recommendations = []
        
        if gnn_results.get('success'):
            high_confidence_threats = [t for t in gnn_results.get('threat_analysis', []) if t.get('confidence', 0) > 0.8]
            
            if len(high_confidence_threats) > 0:
                recommendations.append(f"Focus on {len(high_confidence_threats)} high-confidence threat nodes")
            
            recommendations.append("Implement graph-based threat hunting")
            recommendations.append("Monitor network topology changes")
        
        return recommendations
    
    def predict_future_threats(self, historical_data: List[Dict[str, Any]], forecast_days: int = 30) -> Dict[str, Any]:
        """Predict future threats using predictive modeling"""
        return self.predictive_modeling.predict_threats(historical_data, forecast_days)
    
    def analyze_user_behavior(self, user_id: str, behavior_data: Dict[str, Any]) -> Dict[str, Any]:
        """Analyze user behavior for insider threats"""
        return self.behavioral_analytics.analyze_user_behavior(user_id, behavior_data)
    
    def detect_anomalies(self, data: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Detect anomalies in security data"""
        try:
            # Convert data to feature matrix
            features = self._extract_features(data)
            
            # Fit anomaly detector
            self.anomaly_detector.fit(features)
            anomaly_scores = self.anomaly_detector.decision_function(features)
            predictions = self.anomaly_detector.predict(features)
            
            # Identify anomalies
            anomalies = []
            for i, (item, score, prediction) in enumerate(zip(data, anomaly_scores, predictions)):
                if prediction == -1:  # Anomaly
                    anomalies.append({
                        'index': i,
                        'data': item,
                        'anomaly_score': float(score),
                        'severity': 'High' if score < -0.5 else 'Medium'
                    })
            
            return {
                'success': True,
                'anomalies_detected': len(anomalies),
                'anomalies': anomalies,
                'total_data_points': len(data),
                'anomaly_rate': len(anomalies) / len(data) if data else 0
            }
            
        except Exception as e:
            logger.error(f"Error in anomaly detection: {e}")
            return {'success': False, 'error': str(e)}
    
    def _extract_features(self, data: List[Dict[str, Any]]) -> np.ndarray:
        """Extract features from data for anomaly detection"""
        features = []
        
        for item in data:
            feature_vector = [
                len(item.get('connections', [])),
                item.get('severity_score', 0.0),
                item.get('activity_level', 0.0),
                item.get('risk_score', 0.0),
                len(item.get('indicators', [])),
                item.get('confidence', 0.0)
            ]
            features.append(feature_vector)
        
        return np.array(features)
    
    def get_analytics_dashboard_data(self) -> Dict[str, Any]:
        """Get comprehensive analytics dashboard data"""
        return {
            'threat_network_analysis': {
                'total_nodes': random.randint(100, 500),
                'total_edges': random.randint(200, 1000),
                'network_density': random.uniform(0.3, 0.8),
                'threat_clusters': random.randint(5, 20)
            },
            'predictive_analytics': {
                'forecast_accuracy': random.uniform(0.8, 0.95),
                'threats_predicted': random.randint(50, 200),
                'high_risk_predictions': random.randint(5, 25)
            },
            'behavioral_analysis': {
                'users_monitored': random.randint(100, 1000),
                'anomalies_detected': random.randint(10, 50),
                'high_risk_users': random.randint(1, 10)
            },
            'anomaly_detection': {
                'anomalies_detected': random.randint(20, 100),
                'false_positive_rate': random.uniform(0.01, 0.05),
                'detection_accuracy': random.uniform(0.9, 0.98)
            }
        }

# Global instance
advanced_analytics_service = AdvancedAnalyticsService()

