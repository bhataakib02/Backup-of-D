"""
Logging utilities for the AI/ML Cybersecurity Platform
"""

import logging
import logging.handlers
import os
import json
from datetime import datetime
import hashlib
from typing import Dict, Any, Optional
import structlog
from pythonjsonlogger import jsonlogger

class SecurityLogger:
    """Custom logger for security events"""
    
    def __init__(self, name: str = 'cybersecurity', log_file: str = 'logs/security.log'):
        self.name = name
        self.log_file = log_file
        self.logger = self._setup_logger()
    
    def _setup_logger(self) -> logging.Logger:
        """Setup structured logging"""
        # Create logs directory if it doesn't exist
        os.makedirs(os.path.dirname(self.log_file), exist_ok=True)
        
        # Configure structlog
        structlog.configure(
            processors=[
                structlog.stdlib.filter_by_level,
                structlog.stdlib.add_logger_name,
                structlog.stdlib.add_log_level,
                structlog.stdlib.PositionalArgumentsFormatter(),
                structlog.processors.TimeStamper(fmt="iso"),
                structlog.processors.StackInfoRenderer(),
                structlog.processors.format_exc_info,
                structlog.processors.UnicodeDecoder(),
                structlog.processors.JSONRenderer()
            ],
            context_class=dict,
            logger_factory=structlog.stdlib.LoggerFactory(),
            wrapper_class=structlog.stdlib.BoundLogger,
            cache_logger_on_first_use=True,
        )
        
        # Create logger
        logger = structlog.get_logger(self.name)
        
        # Add file handler
        file_handler = logging.handlers.RotatingFileHandler(
            self.log_file,
            maxBytes=10*1024*1024,  # 10MB
            backupCount=5
        )
        
        # Add JSON formatter
        json_formatter = jsonlogger.JsonFormatter(
            '%(asctime)s %(name)s %(levelname)s %(message)s'
        )
        file_handler.setFormatter(json_formatter)
        
        # Add console handler
        console_handler = logging.StreamHandler()
        console_formatter = logging.Formatter(
            '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
        )
        console_handler.setFormatter(console_formatter)
        
        # Configure logger
        logger.addHandler(file_handler)
        logger.addHandler(console_handler)
        logger.setLevel(logging.INFO)
        
        return logger
    
    def log_security_event(self, event_type: str, severity: str, details: Dict[str, Any]):
        """Log security event"""
        self.logger.info(
            "Security event",
            event_type=event_type,
            severity=severity,
            details=details,
            timestamp=datetime.utcnow().isoformat()
        )
    
    def log_phishing_detection(self, url: str, is_phishing: bool, confidence: float, features: Dict[str, Any]):
        """Log phishing detection event"""
        self.logger.info(
            "Phishing detection",
            url=url,
            is_phishing=is_phishing,
            confidence=confidence,
            features=features,
            timestamp=datetime.utcnow().isoformat()
        )
    
    def log_malware_detection(self, file_hash: str, is_malware: bool, confidence: float, family: str = None):
        """Log malware detection event"""
        self.logger.info(
            "Malware detection",
            file_hash=file_hash,
            is_malware=is_malware,
            confidence=confidence,
            family=family,
            timestamp=datetime.utcnow().isoformat()
        )
    
    def log_intrusion_detection(self, source_ip: str, attack_type: str, confidence: float, details: Dict[str, Any]):
        """Log intrusion detection event"""
        self.logger.info(
            "Intrusion detection",
            source_ip=source_ip,
            attack_type=attack_type,
            confidence=confidence,
            details=details,
            timestamp=datetime.utcnow().isoformat()
        )
    
    def log_user_action(self, user_id: int, action: str, resource: str, details: Dict[str, Any] = None):
        """Log user action"""
        self.logger.info(
            "User action",
            user_id=user_id,
            action=action,
            resource=resource,
            details=details or {},
            timestamp=datetime.utcnow().isoformat()
        )
    
    def log_system_event(self, event: str, level: str, details: Dict[str, Any] = None):
        """Log system event"""
        self.logger.info(
            "System event",
            event=event,
            level=level,
            details=details or {},
            timestamp=datetime.utcnow().isoformat()
        )
    
    def log_error(self, error: Exception, context: Dict[str, Any] = None):
        """Log error with context"""
        self.logger.error(
            "Error occurred",
            error=str(error),
            error_type=type(error).__name__,
            context=context or {},
            timestamp=datetime.utcnow().isoformat()
        )

class AuditLogger:
    """Audit logger for compliance and security auditing"""
    
    def __init__(self, log_file: str = 'logs/audit.log'):
        self.log_file = log_file
        self.hash_file = f"{self.log_file}.hash"
        self._prev_hash = self._load_last_hash()
        self.logger = self._setup_audit_logger()
    
    def _setup_audit_logger(self) -> logging.Logger:
        """Setup audit logger"""
        os.makedirs(os.path.dirname(self.log_file), exist_ok=True)
        
        logger = logging.getLogger('audit')
        logger.setLevel(logging.INFO)
        
        # File handler for audit logs
        file_handler = logging.handlers.RotatingFileHandler(
            self.log_file,
            maxBytes=50*1024*1024,  # 50MB
            backupCount=10
        )
        
        # JSON formatter for audit logs
        json_formatter = jsonlogger.JsonFormatter(
            '%(asctime)s %(name)s %(levelname)s %(message)s'
        )
        file_handler.setFormatter(json_formatter)
        
        logger.addHandler(file_handler)
        
        return logger

    def _load_last_hash(self) -> str:
        try:
            if os.path.exists(self.hash_file):
                with open(self.hash_file, 'r', encoding='utf-8') as f:
                    return f.read().strip()
        except Exception:
            pass
        return ''

    def _update_hash(self, record: Dict[str, Any]) -> str:
        # Create deterministic string for hashing
        payload = json.dumps(record, sort_keys=True)
        base = (self._prev_hash or '') + payload
        current_hash = hashlib.sha256(base.encode('utf-8')).hexdigest()
        # Persist
        try:
            with open(self.hash_file, 'w', encoding='utf-8') as f:
                f.write(current_hash)
        except Exception:
            pass
        self._prev_hash = current_hash
        return current_hash
    
    def log_authentication(self, user_id: int, username: str, success: bool, ip_address: str, user_agent: str = None):
        """Log authentication event"""
        record = {
            'event': 'Authentication',
            'user_id': user_id,
            'username': username,
            'success': success,
            'ip_address': ip_address,
            'user_agent': user_agent,
            'timestamp': datetime.utcnow().isoformat()
        }
        record['hash'] = self._update_hash(record)
        self.logger.info("Authentication", **record)
    
    def log_authorization(self, user_id: int, resource: str, action: str, allowed: bool, reason: str = None):
        """Log authorization event"""
        record = {
            'event': 'Authorization',
            'user_id': user_id,
            'resource': resource,
            'action': action,
            'allowed': allowed,
            'reason': reason,
            'timestamp': datetime.utcnow().isoformat()
        }
        record['hash'] = self._update_hash(record)
        self.logger.info("Authorization", **record)
    
    def log_data_access(self, user_id: int, data_type: str, action: str, record_id: int = None):
        """Log data access event"""
        record = {
            'event': 'Data access',
            'user_id': user_id,
            'data_type': data_type,
            'action': action,
            'record_id': record_id,
            'timestamp': datetime.utcnow().isoformat()
        }
        record['hash'] = self._update_hash(record)
        self.logger.info("Data access", **record)
    
    def log_configuration_change(self, user_id: int, config_item: str, old_value: Any, new_value: Any):
        """Log configuration change"""
        record = {
            'event': 'Configuration change',
            'user_id': user_id,
            'config_item': config_item,
            'old_value': old_value,
            'new_value': new_value,
            'timestamp': datetime.utcnow().isoformat()
        }
        record['hash'] = self._update_hash(record)
        self.logger.info("Configuration change", **record)

class PerformanceLogger:
    """Performance logger for monitoring system performance"""
    
    def __init__(self, log_file: str = 'logs/performance.log'):
        self.log_file = log_file
        self.logger = self._setup_performance_logger()
    
    def _setup_performance_logger(self) -> logging.Logger:
        """Setup performance logger"""
        os.makedirs(os.path.dirname(self.log_file), exist_ok=True)
        
        logger = logging.getLogger('performance')
        logger.setLevel(logging.INFO)
        
        # File handler for performance logs
        file_handler = logging.handlers.RotatingFileHandler(
            self.log_file,
            maxBytes=20*1024*1024,  # 20MB
            backupCount=5
        )
        
        # JSON formatter for performance logs
        json_formatter = jsonlogger.JsonFormatter(
            '%(asctime)s %(name)s %(levelname)s %(message)s'
        )
        file_handler.setFormatter(json_formatter)
        
        logger.addHandler(file_handler)
        
        return logger
    
    def log_model_performance(self, model_name: str, accuracy: float, precision: float, recall: float, f1_score: float, training_time: float):
        """Log model performance metrics"""
        self.logger.info(
            "Model performance",
            model_name=model_name,
            accuracy=accuracy,
            precision=precision,
            recall=recall,
            f1_score=f1_score,
            training_time=training_time,
            timestamp=datetime.utcnow().isoformat()
        )
    
    def log_api_performance(self, endpoint: str, method: str, response_time: float, status_code: int, user_id: int = None):
        """Log API performance metrics"""
        self.logger.info(
            "API performance",
            endpoint=endpoint,
            method=method,
            response_time=response_time,
            status_code=status_code,
            user_id=user_id,
            timestamp=datetime.utcnow().isoformat()
        )
    
    def log_database_performance(self, query: str, execution_time: float, rows_affected: int = None):
        """Log database performance metrics"""
        self.logger.info(
            "Database performance",
            query=query[:100],  # Truncate long queries
            execution_time=execution_time,
            rows_affected=rows_affected,
            timestamp=datetime.utcnow().isoformat()
        )
    
    def log_system_metrics(self, cpu_usage: float, memory_usage: float, disk_usage: float, network_io: Dict[str, float]):
        """Log system performance metrics"""
        self.logger.info(
            "System metrics",
            cpu_usage=cpu_usage,
            memory_usage=memory_usage,
            disk_usage=disk_usage,
            network_io=network_io,
            timestamp=datetime.utcnow().isoformat()
        )

# Global logger instances
security_logger = SecurityLogger()
audit_logger = AuditLogger()
performance_logger = PerformanceLogger()

def get_security_logger() -> SecurityLogger:
    """Get security logger instance"""
    return security_logger

def get_audit_logger() -> AuditLogger:
    """Get audit logger instance"""
    return audit_logger

def get_performance_logger() -> PerformanceLogger:
    """Get performance logger instance"""
    return performance_logger



