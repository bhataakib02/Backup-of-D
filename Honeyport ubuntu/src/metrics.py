"""
Prometheus Metrics Collector for Honeyport
Exposes metrics for monitoring and alerting
"""

import asyncio
import logging
import time
from typing import Dict, Any
from prometheus_client import Counter, Histogram, Gauge, start_http_server, CollectorRegistry

from .config import Config


class MetricsCollector:
    """Collects and exposes Prometheus metrics"""
    
    def __init__(self, config: Config):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
        # Create custom registry
        self.registry = CollectorRegistry()
        
        # Define metrics
        self.connections_total = Counter(
            'honeyport_connections_total',
            'Total number of connections received',
            ['src_ip', 'dst_port'],
            registry=self.registry
        )
        
        self.blocked_ips_total = Counter(
            'honeyport_blocked_ips_total',
            'Total number of IPs blocked',
            ['ip', 'reason'],
            registry=self.registry
        )
        
        self.alerts_sent_total = Counter(
            'honeyport_alerts_sent_total',
            'Total number of alerts sent',
            ['channel'],
            registry=self.registry
        )
        
        self.connection_duration = Histogram(
            'honeyport_connection_duration_seconds',
            'Connection duration in seconds',
            ['dst_port'],
            buckets=[0.1, 0.5, 1.0, 2.0, 5.0, 10.0],
            registry=self.registry
        )
        
        self.active_connections = Gauge(
            'honeyport_active_connections',
            'Number of currently active connections',
            registry=self.registry
        )
        
        self.active_listeners = Gauge(
            'honeyport_active_listeners',
            'Number of active listeners',
            registry=self.registry
        )
        
        self.blocked_ips_count = Gauge(
            'honeyport_blocked_ips_count',
            'Number of currently blocked IPs',
            registry=self.registry
        )
        
        self.geoip_lookups_total = Counter(
            'honeyport_geoip_lookups_total',
            'Total number of GeoIP lookups',
            ['country'],
            registry=self.registry
        )
        
        self.errors_total = Counter(
            'honeyport_errors_total',
            'Total number of errors',
            ['error_type'],
            registry=self.registry
        )
        
        self.server = None
        self.running = False
    
    async def start(self):
        """Start metrics server"""
        if not self.config.metrics.enabled:
            self.logger.info("Metrics collection disabled")
            return
        
        try:
            self.server = start_http_server(
                self.config.metrics.port,
                registry=self.registry
            )
            self.running = True
            self.logger.info(f"Metrics server started on port {self.config.metrics.port}")
            
        except Exception as e:
            self.logger.error(f"Failed to start metrics server: {e}")
    
    async def stop(self):
        """Stop metrics server"""
        if self.server:
            self.server.shutdown()
            self.running = False
            self.logger.info("Metrics server stopped")
    
    def increment_connections(self, src_ip: str, dst_port: int):
        """Increment connection counter"""
        self.connections_total.labels(src_ip=src_ip, dst_port=str(dst_port)).inc()
    
    def increment_blocked_ips(self, ip: str, reason: str):
        """Increment blocked IP counter"""
        self.blocked_ips_total.labels(ip=ip, reason=reason).inc()
    
    def increment_alerts_sent(self, channel: str):
        """Increment alerts sent counter"""
        self.alerts_sent_total.labels(channel=channel).inc()
    
    def observe_connection_duration(self, dst_port: int, duration: float):
        """Observe connection duration"""
        self.connection_duration.labels(dst_port=str(dst_port)).observe(duration)
    
    def set_active_connections(self, count: int):
        """Set active connections gauge"""
        self.active_connections.set(count)
    
    def set_active_listeners(self, count: int):
        """Set active listeners gauge"""
        self.active_listeners.set(count)
    
    def set_blocked_ips_count(self, count: int):
        """Set blocked IPs count gauge"""
        self.blocked_ips_count.set(count)
    
    def increment_geoip_lookups(self, country: str):
        """Increment GeoIP lookups counter"""
        self.geoip_lookups_total.labels(country=country or 'unknown').inc()
    
    def increment_errors(self, error_type: str):
        """Increment errors counter"""
        self.errors_total.labels(error_type=error_type).inc()
    
    def get_metrics_summary(self) -> Dict[str, Any]:
        """Get metrics summary for API"""
        return {
            "metrics_enabled": self.config.metrics.enabled,
            "metrics_port": self.config.metrics.port,
            "metrics_path": self.config.metrics.path,
            "server_running": self.running,
            "registry_size": len(self.registry.collect())
        }
