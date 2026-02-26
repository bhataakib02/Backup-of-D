"""
Database models for the AI/ML Cybersecurity Platform
"""

from datetime import datetime
from flask_sqlalchemy import SQLAlchemy
from werkzeug.security import generate_password_hash, check_password_hash
import json

db = SQLAlchemy()

class User(db.Model):
    """User model for authentication and authorization"""
    __tablename__ = 'users'
    
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False, index=True)
    email = db.Column(db.String(120), unique=True, nullable=False, index=True)
    password_hash = db.Column(db.String(255), nullable=False)
    role = db.Column(db.String(20), default='analyst', nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_login = db.Column(db.DateTime)
    
    # Relationships
    alerts = db.relationship('Alert', backref='user', lazy='dynamic')
    actions = db.relationship('UserAction', backref='user', lazy='dynamic')
    
    def set_password(self, password):
        """Set password hash"""
        self.password_hash = generate_password_hash(password)
    
    def check_password(self, password):
        """Check password"""
        return check_password_hash(self.password_hash, password)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'username': self.username,
            'email': self.email,
            'role': self.role,
            'is_active': self.is_active,
            'created_at': self.created_at.isoformat(),
            'last_login': self.last_login.isoformat() if self.last_login else None
        }

class Alert(db.Model):
    """Alert model for security events"""
    __tablename__ = 'alerts'
    
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), nullable=False)
    description = db.Column(db.Text)
    severity = db.Column(db.String(20), nullable=False, index=True)  # Critical, High, Medium, Low
    status = db.Column(db.String(20), default='open', nullable=False, index=True)  # open, investigating, resolved, false_positive
    category = db.Column(db.String(50), nullable=False, index=True)  # phishing, malware, ids, etc.
    source = db.Column(db.String(100), nullable=False)  # module that generated the alert
    confidence_score = db.Column(db.Float, nullable=False)
    risk_score = db.Column(db.Float, nullable=False)
    raw_data = db.Column(db.JSON)  # Original data that triggered the alert
    alert_metadata = db.Column(db.JSON)  # Additional metadata
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    assigned_to = db.Column(db.Integer, db.ForeignKey('users.id'))
    
    # Relationships
    events = db.relationship('Event', backref='alert', lazy='dynamic')
    actions = db.relationship('AlertAction', backref='alert', lazy='dynamic')
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'severity': self.severity,
            'status': self.status,
            'category': self.category,
            'source': self.source,
            'confidence_score': self.confidence_score,
            'risk_score': self.risk_score,
            'raw_data': self.raw_data,
            'metadata': self.alert_metadata,
            'created_at': self.created_at.isoformat(),
            'updated_at': self.updated_at.isoformat(),
            'assigned_to': self.assigned_to
        }

class Event(db.Model):
    """Event model for individual security events"""
    __tablename__ = 'events'
    
    id = db.Column(db.Integer, primary_key=True)
    alert_id = db.Column(db.Integer, db.ForeignKey('alerts.id'), nullable=False)
    event_type = db.Column(db.String(50), nullable=False, index=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    source_ip = db.Column(db.String(45), index=True)
    destination_ip = db.Column(db.String(45), index=True)
    source_port = db.Column(db.Integer)
    destination_port = db.Column(db.Integer)
    protocol = db.Column(db.String(20))
    payload = db.Column(db.Text)
    event_metadata = db.Column(db.JSON)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'alert_id': self.alert_id,
            'event_type': self.event_type,
            'timestamp': self.timestamp.isoformat(),
            'source_ip': self.source_ip,
            'destination_ip': self.destination_ip,
            'source_port': self.source_port,
            'destination_port': self.destination_port,
            'protocol': self.protocol,
            'payload': self.payload,
            'metadata': self.metadata
        }

class PhishingAnalysis(db.Model):
    """Phishing analysis results"""
    __tablename__ = 'phishing_analyses'
    
    id = db.Column(db.Integer, primary_key=True)
    url = db.Column(db.Text, nullable=False)
    email_content = db.Column(db.Text)
    subject = db.Column(db.String(500))
    sender = db.Column(db.String(255))
    recipient = db.Column(db.String(255))
    analysis_type = db.Column(db.String(50), nullable=False)  # url, email, screenshot
    is_phishing = db.Column(db.Boolean, nullable=False)
    confidence_score = db.Column(db.Float, nullable=False)
    risk_score = db.Column(db.Float, nullable=False)
    features = db.Column(db.JSON)  # Extracted features
    explanation = db.Column(db.JSON)  # XAI explanation
    screenshot_path = db.Column(db.String(500))
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'url': self.url,
            'email_content': self.email_content,
            'subject': self.subject,
            'sender': self.sender,
            'recipient': self.recipient,
            'analysis_type': self.analysis_type,
            'is_phishing': self.is_phishing,
            'confidence_score': self.confidence_score,
            'risk_score': self.risk_score,
            'features': self.features,
            'explanation': self.explanation,
            'screenshot_path': self.screenshot_path,
            'created_at': self.created_at.isoformat()
        }

class MalwareAnalysis(db.Model):
    """Malware analysis results"""
    __tablename__ = 'malware_analyses'
    
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(255), nullable=False)
    file_hash = db.Column(db.String(64), nullable=False, index=True)
    file_size = db.Column(db.BigInteger)
    file_type = db.Column(db.String(100))
    is_malware = db.Column(db.Boolean, nullable=False)
    confidence_score = db.Column(db.Float, nullable=False)
    risk_score = db.Column(db.Float, nullable=False)
    malware_family = db.Column(db.String(100))
    malware_type = db.Column(db.String(100))
    features = db.Column(db.JSON)  # Static features
    behavior_analysis = db.Column(db.JSON)  # Sandbox results
    explanation = db.Column(db.JSON)  # XAI explanation
    file_path = db.Column(db.String(500))
    sandbox_report = db.Column(db.JSON)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'filename': self.filename,
            'file_hash': self.file_hash,
            'file_size': self.file_size,
            'file_type': self.file_type,
            'is_malware': self.is_malware,
            'confidence_score': self.confidence_score,
            'risk_score': self.risk_score,
            'malware_family': self.malware_family,
            'malware_type': self.malware_type,
            'features': self.features,
            'behavior_analysis': self.behavior_analysis,
            'explanation': self.explanation,
            'file_path': self.file_path,
            'sandbox_report': self.sandbox_report,
            'created_at': self.created_at.isoformat()
        }

class IDSAnalysis(db.Model):
    """IDS analysis results"""
    __tablename__ = 'ids_analyses'
    
    id = db.Column(db.Integer, primary_key=True)
    pcap_file = db.Column(db.String(500))
    log_file = db.Column(db.String(500))
    analysis_type = db.Column(db.String(50), nullable=False)  # pcap, netflow, logs
    is_intrusion = db.Column(db.Boolean, nullable=False)
    confidence_score = db.Column(db.Float, nullable=False)
    risk_score = db.Column(db.Float, nullable=False)
    attack_type = db.Column(db.String(100))
    attack_category = db.Column(db.String(100))
    source_ip = db.Column(db.String(45), index=True)
    destination_ip = db.Column(db.String(45), index=True)
    features = db.Column(db.JSON)  # Network features
    anomaly_scores = db.Column(db.JSON)  # Anomaly detection scores
    explanation = db.Column(db.JSON)  # XAI explanation
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'pcap_file': self.pcap_file,
            'log_file': self.log_file,
            'analysis_type': self.analysis_type,
            'is_intrusion': self.is_intrusion,
            'confidence_score': self.confidence_score,
            'risk_score': self.risk_score,
            'attack_type': self.attack_type,
            'attack_category': self.attack_category,
            'source_ip': self.source_ip,
            'destination_ip': self.destination_ip,
            'features': self.features,
            'anomaly_scores': self.anomaly_scores,
            'explanation': self.explanation,
            'created_at': self.created_at.isoformat()
        }

class ThreatIntelligence(db.Model):
    """Threat intelligence data"""
    __tablename__ = 'threat_intelligence'
    
    id = db.Column(db.Integer, primary_key=True)
    indicator_type = db.Column(db.String(50), nullable=False, index=True)  # ip, domain, hash, url
    indicator_value = db.Column(db.String(500), nullable=False, index=True)
    threat_type = db.Column(db.String(100), nullable=False)
    severity = db.Column(db.String(20), nullable=False)
    confidence = db.Column(db.Float, nullable=False)
    source = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text)
    tags = db.Column(db.JSON)  # List of tags
    event_metadata = db.Column(db.JSON)
    first_seen = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    last_seen = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    is_active = db.Column(db.Boolean, default=True, nullable=False)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'indicator_type': self.indicator_type,
            'indicator_value': self.indicator_value,
            'threat_type': self.threat_type,
            'severity': self.severity,
            'confidence': self.confidence,
            'source': self.source,
            'description': self.description,
            'tags': self.tags,
            'metadata': self.alert_metadata,
            'first_seen': self.first_seen.isoformat(),
            'last_seen': self.last_seen.isoformat(),
            'is_active': self.is_active
        }

class ModelPerformance(db.Model):
    """ML model performance tracking"""
    __tablename__ = 'model_performance'
    
    id = db.Column(db.Integer, primary_key=True)
    model_name = db.Column(db.String(100), nullable=False, index=True)
    model_version = db.Column(db.String(50), nullable=False)
    accuracy = db.Column(db.Float, nullable=False)
    precision = db.Column(db.Float, nullable=False)
    recall = db.Column(db.Float, nullable=False)
    f1_score = db.Column(db.Float, nullable=False)
    auc_score = db.Column(db.Float)
    confusion_matrix = db.Column(db.JSON)
    feature_importance = db.Column(db.JSON)
    training_samples = db.Column(db.Integer, nullable=False)
    test_samples = db.Column(db.Integer, nullable=False)
    training_time = db.Column(db.Float, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'model_name': self.model_name,
            'model_version': self.model_version,
            'accuracy': self.accuracy,
            'precision': self.precision,
            'recall': self.recall,
            'f1_score': self.f1_score,
            'auc_score': self.auc_score,
            'confusion_matrix': self.confusion_matrix,
            'feature_importance': self.feature_importance,
            'training_samples': self.training_samples,
            'test_samples': self.test_samples,
            'training_time': self.training_time,
            'created_at': self.created_at.isoformat()
        }

class UserAction(db.Model):
    """User action logging"""
    __tablename__ = 'user_actions'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    action_type = db.Column(db.String(100), nullable=False)
    resource_type = db.Column(db.String(100), nullable=False)
    resource_id = db.Column(db.Integer)
    details = db.Column(db.JSON)
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(500))
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'user_id': self.user_id,
            'action_type': self.action_type,
            'resource_type': self.resource_type,
            'resource_id': self.resource_id,
            'details': self.details,
            'ip_address': self.ip_address,
            'user_agent': self.user_agent,
            'timestamp': self.timestamp.isoformat()
        }

class AlertAction(db.Model):
    """Alert action tracking"""
    __tablename__ = 'alert_actions'
    
    id = db.Column(db.Integer, primary_key=True)
    alert_id = db.Column(db.Integer, db.ForeignKey('alerts.id'), nullable=False)
    action_type = db.Column(db.String(100), nullable=False)  # acknowledge, resolve, escalate, etc.
    performed_by = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    details = db.Column(db.JSON)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'alert_id': self.alert_id,
            'action_type': self.action_type,
            'performed_by': self.performed_by,
            'details': self.details,
            'timestamp': self.timestamp.isoformat()
        }

class SystemMetrics(db.Model):
    """System performance metrics"""
    __tablename__ = 'system_metrics'
    
    id = db.Column(db.Integer, primary_key=True)
    metric_name = db.Column(db.String(100), nullable=False, index=True)
    metric_value = db.Column(db.Float, nullable=False)
    metric_unit = db.Column(db.String(20))
    tags = db.Column(db.JSON)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow, nullable=False, index=True)
    
    def to_dict(self):
        """Convert to dictionary"""
        return {
            'id': self.id,
            'metric_name': self.metric_name,
            'metric_value': self.metric_value,
            'metric_unit': self.metric_unit,
            'tags': self.tags,
            'timestamp': self.timestamp.isoformat()
        }

