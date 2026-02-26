"""
Configuration Management for Honeyport
Handles YAML config loading, validation, and dynamic reloading
"""

import os
import yaml
import logging
from pathlib import Path
from typing import List, Dict, Any, Optional
from dataclasses import dataclass, field


@dataclass
class AlertConfig:
    """Alert configuration"""
    enabled: bool = True
    telegram_token: Optional[str] = None
    telegram_chat_id: Optional[str] = None
    discord_webhook: Optional[str] = None
    email_smtp_server: Optional[str] = None
    email_smtp_port: int = 587
    email_username: Optional[str] = None
    email_password: Optional[str] = None
    email_to: Optional[str] = None
    rate_limit_minutes: int = 5


@dataclass
class BlockingConfig:
    """IP blocking configuration"""
    enabled: bool = True
    auto_block: bool = False  # Start with manual approval
    block_duration_hours: int = 24
    whitelist_ips: List[str] = field(default_factory=list)
    whitelist_ranges: List[str] = field(default_factory=list)


@dataclass
class GeoIPConfig:
    """GeoIP lookup configuration"""
    enabled: bool = True
    database_path: str = "data/GeoLite2-City.mmdb"
    api_key: Optional[str] = None  # For online services


@dataclass
class LoggingConfig:
    """Logging configuration"""
    level: str = "INFO"
    file_path: str = "logs/honeyport.jsonl"
    max_file_size_mb: int = 100
    backup_count: int = 5
    retention_days: int = 90


@dataclass
class WebConfig:
    """Web dashboard configuration"""
    enabled: bool = True
    host: str = "0.0.0.0"
    port: int = 8080
    api_key: Optional[str] = None
    cors_origins: List[str] = field(default_factory=lambda: ["*"])


@dataclass
class MetricsConfig:
    """Prometheus metrics configuration"""
    enabled: bool = True
    port: int = 9090
    path: str = "/metrics"


class Config:
    """Main configuration manager"""
    
    def __init__(self, config_path: str = "configs/honeyport.yml"):
        self.config_path = Path(config_path)
        self.logger = logging.getLogger(__name__)
        
        # Default configuration
        self.ports: List[int] = [22, 80, 443, 445, 3389]
        self.protocols: List[str] = ["tcp"]
        self.host: str = "0.0.0.0"
        
        # Component configurations
        self.alerts = AlertConfig()
        self.blocking = BlockingConfig()
        self.geoip = GeoIPConfig()
        self.logging = LoggingConfig()
        self.web = WebConfig()
        self.metrics = MetricsConfig()
        
        # Runtime properties
        self.web_port = self.web.port
        self.metrics_port = self.metrics.port
        
    async def load(self):
        """Load configuration from file"""
        if not self.config_path.exists():
            self.logger.warning(f"Config file not found: {self.config_path}")
            await self.create_default_config()
            return
        
        try:
            with open(self.config_path, 'r') as f:
                config_data = yaml.safe_load(f)
            
            self._parse_config(config_data)
            self.logger.info(f"Configuration loaded from {self.config_path}")
            
        except Exception as e:
            self.logger.error(f"Failed to load config: {e}")
            raise
    
    def _parse_config(self, data: Dict[str, Any]):
        """Parse configuration data"""
        # Basic settings
        self.ports = data.get('ports', self.ports)
        self.protocols = data.get('protocols', self.protocols)
        self.host = data.get('host', self.host)
        
        # Alert configuration
        if 'alerts' in data:
            alert_data = data['alerts']
            self.alerts.enabled = alert_data.get('enabled', True)
            self.alerts.telegram_token = alert_data.get('telegram_token')
            self.alerts.telegram_chat_id = alert_data.get('telegram_chat_id')
            self.alerts.discord_webhook = alert_data.get('discord_webhook')
            self.alerts.email_smtp_server = alert_data.get('email_smtp_server')
            self.alerts.email_smtp_port = alert_data.get('email_smtp_port', 587)
            self.alerts.email_username = alert_data.get('email_username')
            self.alerts.email_password = alert_data.get('email_password')
            self.alerts.email_to = alert_data.get('email_to')
            self.alerts.rate_limit_minutes = alert_data.get('rate_limit_minutes', 5)
        
        # Blocking configuration
        if 'blocking' in data:
            block_data = data['blocking']
            self.blocking.enabled = block_data.get('enabled', True)
            self.blocking.auto_block = block_data.get('auto_block', False)
            self.blocking.block_duration_hours = block_data.get('block_duration_hours', 24)
            self.blocking.whitelist_ips = block_data.get('whitelist_ips', [])
            self.blocking.whitelist_ranges = block_data.get('whitelist_ranges', [])
        
        # GeoIP configuration
        if 'geoip' in data:
            geo_data = data['geoip']
            self.geoip.enabled = geo_data.get('enabled', True)
            self.geoip.database_path = geo_data.get('database_path', self.geoip.database_path)
            self.geoip.api_key = geo_data.get('api_key')
        
        # Logging configuration
        if 'logging' in data:
            log_data = data['logging']
            self.logging.level = log_data.get('level', 'INFO')
            self.logging.file_path = log_data.get('file_path', self.logging.file_path)
            self.logging.max_file_size_mb = log_data.get('max_file_size_mb', 100)
            self.logging.backup_count = log_data.get('backup_count', 5)
            self.logging.retention_days = log_data.get('retention_days', 90)
        
        # Web configuration
        if 'web' in data:
            web_data = data['web']
            self.web.enabled = web_data.get('enabled', True)
            self.web.host = web_data.get('host', '0.0.0.0')
            self.web.port = web_data.get('port', 8080)
            self.web.api_key = web_data.get('api_key')
            self.web.cors_origins = web_data.get('cors_origins', ['*'])
            self.web_port = self.web.port
        
        # Metrics configuration
        if 'metrics' in data:
            metrics_data = data['metrics']
            self.metrics.enabled = metrics_data.get('enabled', True)
            self.metrics.port = metrics_data.get('port', 9090)
            self.metrics.path = metrics_data.get('path', '/metrics')
            self.metrics_port = self.metrics.port
    
    async def create_default_config(self):
        """Create default configuration file"""
        default_config = {
            'ports': [22, 80, 443, 445, 3389],
            'protocols': ['tcp'],
            'host': '0.0.0.0',
            'alerts': {
                'enabled': True,
                'telegram_token': None,
                'telegram_chat_id': None,
                'discord_webhook': None,
                'email_smtp_server': None,
                'email_smtp_port': 587,
                'email_username': None,
                'email_password': None,
                'email_to': None,
                'rate_limit_minutes': 5
            },
            'blocking': {
                'enabled': True,
                'auto_block': False,
                'block_duration_hours': 24,
                'whitelist_ips': ['127.0.0.1', '::1'],
                'whitelist_ranges': ['192.168.0.0/16', '10.0.0.0/8']
            },
            'geoip': {
                'enabled': True,
                'database_path': 'data/GeoLite2-City.mmdb',
                'api_key': None
            },
            'logging': {
                'level': 'INFO',
                'file_path': 'logs/honeyport.jsonl',
                'max_file_size_mb': 100,
                'backup_count': 5,
                'retention_days': 90
            },
            'web': {
                'enabled': True,
                'host': '0.0.0.0',
                'port': 8080,
                'api_key': None,
                'cors_origins': ['*']
            },
            'metrics': {
                'enabled': True,
                'port': 9090,
                'path': '/metrics'
            }
        }
        
        # Ensure config directory exists
        self.config_path.parent.mkdir(parents=True, exist_ok=True)
        
        with open(self.config_path, 'w') as f:
            yaml.dump(default_config, f, default_flow_style=False, indent=2)
        
        self.logger.info(f"Created default configuration at {self.config_path}")
    
    def reload(self):
        """Reload configuration from file"""
        self.logger.info("Reloading configuration...")
        # Note: This would need to be called from an async context
        # For now, just log the reload request
    
    def is_ip_whitelisted(self, ip: str) -> bool:
        """Check if IP is in whitelist"""
        import ipaddress
        
        # Check exact IP matches
        if ip in self.blocking.whitelist_ips:
            return True
        
        # Check IP ranges
        try:
            client_ip = ipaddress.ip_address(ip)
            for range_str in self.blocking.whitelist_ranges:
                network = ipaddress.ip_network(range_str, strict=False)
                if client_ip in network:
                    return True
        except ValueError:
            pass
        
        return False
