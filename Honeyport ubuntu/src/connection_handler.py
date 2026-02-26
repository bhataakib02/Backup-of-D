"""
Connection Handler for Honeyport
Processes incoming connections, logs events, and triggers responses
"""

import asyncio
import socket
import logging
import json
import time
import base64
from datetime import datetime
from typing import Dict, Any, Optional, Tuple
from dataclasses import dataclass

from .config import Config
from .blocker import IPBlocker
from .alert_manager import AlertManager
from .geoip_lookup import GeoIPLookup


@dataclass
class ConnectionEvent:
    """Connection event data structure"""
    timestamp: str
    src_ip: str
    src_port: int
    dst_port: int
    protocol: str
    initial_bytes: str
    banner: Optional[str]
    geo_country: Optional[str]
    geo_city: Optional[str]
    labels: List[str]
    handler_version: str = "1.0.0"


class ConnectionHandler:
    """Handles individual connections and generates events"""
    
    def __init__(self, config: Config, metrics):
        self.config = config
        self.metrics = metrics
        self.logger = logging.getLogger(__name__)
        
        # Initialize components
        self.blocker = IPBlocker(config)
        self.alert_manager = AlertManager(config)
        self.geoip_lookup = GeoIPLookup(config)
        
        # Connection tracking
        self.active_connections = 0
        self.total_connections = 0
        
        # Fake banners for different ports
        self.fake_banners = {
            22: "SSH-2.0-OpenSSH_7.6p1 Ubuntu-4ubuntu0.3",
            80: "HTTP/1.1 200 OK\r\nServer: Apache/2.4.41",
            443: "HTTP/1.1 200 OK\r\nServer: Apache/2.4.41",
            445: "SMB 2.002",
            3389: "RDP 10.0.19041"
        }
    
    async def handle_connection(self, port: int, client_sock: socket.socket, addr: Tuple[str, int]):
        """Handle incoming connection"""
        src_ip, src_port = addr
        self.active_connections += 1
        self.total_connections += 1
        
        try:
            # Check if IP is whitelisted
            if self.config.is_ip_whitelisted(src_ip):
                self.logger.info(f"Whitelisted IP {src_ip} connected to port {port}")
                return
            
            # Read initial bytes
            initial_bytes = await self._read_initial_bytes(client_sock)
            
            # Get GeoIP information
            geo_info = await self.geoip_lookup.get_location(src_ip)
            
            # Create connection event
            event = ConnectionEvent(
                timestamp=datetime.utcnow().isoformat() + "Z",
                src_ip=src_ip,
                src_port=src_port,
                dst_port=port,
                protocol="tcp",
                initial_bytes=base64.b64encode(initial_bytes).decode() if initial_bytes else "",
                banner=self._detect_banner(port, initial_bytes),
                geo_country=geo_info.get('country'),
                geo_city=geo_info.get('city'),
                labels=self._generate_labels(port, initial_bytes, src_ip)
            )
            
            # Log the event
            await self._log_event(event)
            
            # Update metrics
            self.metrics.increment_connections(src_ip, port)
            
            # Send fake banner if configured
            await self._send_fake_banner(client_sock, port)
            
            # Trigger alerts
            await self.alert_manager.send_alert(event)
            
            # Block IP if configured
            if self.config.blocking.enabled and self.config.blocking.auto_block:
                await self.blocker.block_ip(src_ip, f"Connection to honeypot port {port}")
            
            self.logger.warning(f"HONEYPOT TRIGGERED: {src_ip}:{src_port} -> port {port} "
                              f"({geo_info.get('country', 'Unknown')})")
            
        except Exception as e:
            self.logger.error(f"Error handling connection from {src_ip}:{src_port}: {e}")
        finally:
            self.active_connections -= 1
    
    async def _read_initial_bytes(self, client_sock: socket.socket, timeout: float = 5.0) -> bytes:
        """Read initial bytes from connection"""
        try:
            client_sock.settimeout(timeout)
            data = client_sock.recv(1024)
            return data
        except socket.timeout:
            return b""
        except Exception:
            return b""
    
    def _detect_banner(self, port: int, data: bytes) -> Optional[str]:
        """Detect service banner from initial data"""
        if not data:
            return None
        
        try:
            text = data.decode('utf-8', errors='ignore').strip()
            if text:
                return text[:100]  # Limit banner length
        except:
            pass
        
        return None
    
    def _generate_labels(self, port: int, data: bytes, src_ip: str) -> List[str]:
        """Generate labels for the connection"""
        labels = ["honeypot", "trapped"]
        
        # Port-based labels
        port_labels = {
            22: "ssh",
            80: "http",
            443: "https",
            445: "smb",
            3389: "rdp"
        }
        
        if port in port_labels:
            labels.append(port_labels[port])
        
        # Data-based labels
        if data:
            text = data.decode('utf-8', errors='ignore').lower()
            if 'ssh' in text:
                labels.append("ssh-scan")
            elif 'http' in text:
                labels.append("http-scan")
            elif 'smb' in text:
                labels.append("smb-scan")
        
        return labels
    
    async def _send_fake_banner(self, client_sock: socket.socket, port: int):
        """Send fake service banner"""
        if port in self.fake_banners:
            try:
                banner = self.fake_banners[port]
                if isinstance(banner, str):
                    banner = banner.encode()
                
                client_sock.send(banner)
                await asyncio.sleep(0.1)  # Small delay
            except Exception as e:
                self.logger.debug(f"Failed to send fake banner for port {port}: {e}")
    
    async def _log_event(self, event: ConnectionEvent):
        """Log connection event to file"""
        try:
            log_entry = {
                "timestamp": event.timestamp,
                "src_ip": event.src_ip,
                "src_port": event.src_port,
                "dst_port": event.dst_port,
                "protocol": event.protocol,
                "initial_bytes": event.initial_bytes,
                "banner": event.banner,
                "geo": {
                    "country": event.geo_country,
                    "city": event.geo_city
                },
                "labels": event.labels,
                "handler_version": event.handler_version
            }
            
            # Ensure log directory exists
            log_path = Path(self.config.logging.file_path)
            log_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Append to JSONL file
            with open(log_path, 'a') as f:
                f.write(json.dumps(log_entry) + '\n')
            
        except Exception as e:
            self.logger.error(f"Failed to log event: {e}")
    
    def get_active_connections(self) -> int:
        """Get number of active connections"""
        return self.active_connections
    
    def get_total_connections(self) -> int:
        """Get total connections processed"""
        return self.total_connections
    
    def get_stats(self) -> Dict[str, Any]:
        """Get connection handler statistics"""
        return {
            "active_connections": self.active_connections,
            "total_connections": self.total_connections,
            "blocked_ips": self.blocker.get_blocked_count(),
            "alerts_sent": self.alert_manager.get_alerts_sent()
        }
