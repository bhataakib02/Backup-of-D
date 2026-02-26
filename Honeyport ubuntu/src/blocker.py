"""
IP Blocking Module for Honeyport
Handles automatic IP blocking with UFW/iptables integration
"""

import asyncio
import logging
import subprocess
import json
import time
from pathlib import Path
from typing import Dict, List, Optional, Set
from dataclasses import dataclass, field
from datetime import datetime, timedelta

from .config import Config


@dataclass
class BlockedIP:
    """Blocked IP record"""
    ip: str
    timestamp: str
    reason: str
    duration_hours: int
    expires_at: str
    blocked_by: str = "honeyport"


class IPBlocker:
    """Manages IP blocking with UFW/iptables"""
    
    def __init__(self, config: Config):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
        self.blocked_ips: Dict[str, BlockedIP] = {}
        self.blocklist_file = Path("data/blocked_ips.json")
        self.blocklist_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Load existing blocked IPs
        self._load_blocklist()
    
    async def block_ip(self, ip: str, reason: str, duration_hours: Optional[int] = None) -> bool:
        """Block an IP address"""
        if self.config.is_ip_whitelisted(ip):
            self.logger.info(f"Skipping block for whitelisted IP: {ip}")
            return False
        
        if ip in self.blocked_ips:
            self.logger.info(f"IP {ip} already blocked")
            return True
        
        duration = duration_hours or self.config.blocking.block_duration_hours
        
        try:
            # Execute blocking command
            success = await self._execute_block_command(ip)
            
            if success:
                # Record the block
                blocked_ip = BlockedIP(
                    ip=ip,
                    timestamp=datetime.utcnow().isoformat() + "Z",
                    reason=reason,
                    duration_hours=duration,
                    expires_at=(datetime.utcnow() + timedelta(hours=duration)).isoformat() + "Z"
                )
                
                self.blocked_ips[ip] = blocked_ip
                await self._save_blocklist()
                
                self.logger.warning(f"BLOCKED IP: {ip} - {reason}")
                return True
            else:
                self.logger.error(f"Failed to block IP: {ip}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error blocking IP {ip}: {e}")
            return False
    
    async def unblock_ip(self, ip: str) -> bool:
        """Unblock an IP address"""
        if ip not in self.blocked_ips:
            self.logger.info(f"IP {ip} not in blocklist")
            return False
        
        try:
            # Execute unblock command
            success = await self._execute_unblock_command(ip)
            
            if success:
                del self.blocked_ips[ip]
                await self._save_blocklist()
                
                self.logger.info(f"UNBLOCKED IP: {ip}")
                return True
            else:
                self.logger.error(f"Failed to unblock IP: {ip}")
                return False
                
        except Exception as e:
            self.logger.error(f"Error unblocking IP {ip}: {e}")
            return False
    
    async def _execute_block_command(self, ip: str) -> bool:
        """Execute the actual blocking command"""
        try:
            # Try UFW first
            cmd = ["sudo", "ufw", "deny", "from", ip]
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await result.communicate()
            
            if result.returncode == 0:
                self.logger.debug(f"UFW blocked IP {ip}")
                return True
            else:
                # Fallback to iptables
                return await self._execute_iptables_block(ip)
                
        except Exception as e:
            self.logger.error(f"UFW block failed for {ip}: {e}")
            return await self._execute_iptables_block(ip)
    
    async def _execute_iptables_block(self, ip: str) -> bool:
        """Fallback to iptables blocking"""
        try:
            cmd = ["sudo", "iptables", "-I", "INPUT", "1", "-s", ip, "-j", "DROP"]
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await result.communicate()
            
            if result.returncode == 0:
                self.logger.debug(f"iptables blocked IP {ip}")
                return True
            else:
                self.logger.error(f"iptables block failed for {ip}: {stderr.decode()}")
                return False
                
        except Exception as e:
            self.logger.error(f"iptables block error for {ip}: {e}")
            return False
    
    async def _execute_unblock_command(self, ip: str) -> bool:
        """Execute the actual unblocking command"""
        try:
            # Try UFW first
            cmd = ["sudo", "ufw", "delete", "deny", "from", ip]
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await result.communicate()
            
            if result.returncode == 0:
                self.logger.debug(f"UFW unblocked IP {ip}")
                return True
            else:
                # Fallback to iptables
                return await self._execute_iptables_unblock(ip)
                
        except Exception as e:
            self.logger.error(f"UFW unblock failed for {ip}: {e}")
            return await self._execute_iptables_unblock(ip)
    
    async def _execute_iptables_unblock(self, ip: str) -> bool:
        """Fallback to iptables unblocking"""
        try:
            cmd = ["sudo", "iptables", "-D", "INPUT", "-s", ip, "-j", "DROP"]
            result = await asyncio.create_subprocess_exec(
                *cmd,
                stdout=asyncio.subprocess.PIPE,
                stderr=asyncio.subprocess.PIPE
            )
            
            stdout, stderr = await result.communicate()
            
            if result.returncode == 0:
                self.logger.debug(f"iptables unblocked IP {ip}")
                return True
            else:
                self.logger.error(f"iptables unblock failed for {ip}: {stderr.decode()}")
                return False
                
        except Exception as e:
            self.logger.error(f"iptables unblock error for {ip}: {e}")
            return False
    
    def _load_blocklist(self):
        """Load blocked IPs from file"""
        if not self.blocklist_file.exists():
            return
        
        try:
            with open(self.blocklist_file, 'r') as f:
                data = json.load(f)
            
            for ip, ip_data in data.items():
                self.blocked_ips[ip] = BlockedIP(**ip_data)
            
            self.logger.info(f"Loaded {len(self.blocked_ips)} blocked IPs")
            
        except Exception as e:
            self.logger.error(f"Failed to load blocklist: {e}")
    
    async def _save_blocklist(self):
        """Save blocked IPs to file"""
        try:
            data = {}
            for ip, blocked_ip in self.blocked_ips.items():
                data[ip] = {
                    "ip": blocked_ip.ip,
                    "timestamp": blocked_ip.timestamp,
                    "reason": blocked_ip.reason,
                    "duration_hours": blocked_ip.duration_hours,
                    "expires_at": blocked_ip.expires_at,
                    "blocked_by": blocked_ip.blocked_by
                }
            
            with open(self.blocklist_file, 'w') as f:
                json.dump(data, f, indent=2)
                
        except Exception as e:
            self.logger.error(f"Failed to save blocklist: {e}")
    
    async def cleanup_expired_blocks(self):
        """Remove expired IP blocks"""
        now = datetime.utcnow()
        expired_ips = []
        
        for ip, blocked_ip in self.blocked_ips.items():
            expires_at = datetime.fromisoformat(blocked_ip.expires_at.replace('Z', '+00:00'))
            if now > expires_at:
                expired_ips.append(ip)
        
        for ip in expired_ips:
            await self.unblock_ip(ip)
            self.logger.info(f"Auto-unblocked expired IP: {ip}")
    
    def get_blocked_count(self) -> int:
        """Get number of blocked IPs"""
        return len(self.blocked_ips)
    
    def get_blocked_ips(self) -> List[Dict]:
        """Get list of blocked IPs"""
        return [
            {
                "ip": blocked_ip.ip,
                "timestamp": blocked_ip.timestamp,
                "reason": blocked_ip.reason,
                "expires_at": blocked_ip.expires_at
            }
            for blocked_ip in self.blocked_ips.values()
        ]
    
    def is_blocked(self, ip: str) -> bool:
        """Check if IP is currently blocked"""
        return ip in self.blocked_ips
