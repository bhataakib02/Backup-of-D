"""
Alert Manager for Honeyport
Handles sending alerts via Telegram, Discord, Email, and webhooks
"""

import asyncio
import logging
import json
import time
from typing import Dict, List, Optional
from datetime import datetime, timedelta
import aiohttp
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from .config import Config
from .connection_handler import ConnectionEvent


class AlertManager:
    """Manages alert sending with rate limiting and deduplication"""
    
    def __init__(self, config: Config):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
        self.alerts_sent = 0
        self.rate_limit_cache: Dict[str, float] = {}
        self.session: Optional[aiohttp.ClientSession] = None
        
    async def start(self):
        """Initialize alert manager"""
        self.session = aiohttp.ClientSession()
        self.logger.info("Alert manager started")
    
    async def stop(self):
        """Cleanup alert manager"""
        if self.session:
            await self.session.close()
        self.logger.info("Alert manager stopped")
    
    async def send_alert(self, event: ConnectionEvent):
        """Send alert for connection event"""
        if not self.config.alerts.enabled:
            return
        
        # Check rate limiting
        if self._is_rate_limited(event.src_ip):
            self.logger.debug(f"Rate limited alert for {event.src_ip}")
            return
        
        # Create alert message
        message = self._create_alert_message(event)
        
        # Send via configured channels
        tasks = []
        
        if self.config.alerts.telegram_token and self.config.alerts.telegram_chat_id:
            tasks.append(self._send_telegram_alert(message))
        
        if self.config.alerts.discord_webhook:
            tasks.append(self._send_discord_alert(message))
        
        if self.config.alerts.email_smtp_server and self.config.alerts.email_to:
            tasks.append(self._send_email_alert(message, event))
        
        # Execute all alert tasks
        if tasks:
            await asyncio.gather(*tasks, return_exceptions=True)
            self.alerts_sent += 1
            
            # Update rate limit cache
            self.rate_limit_cache[event.src_ip] = time.time()
    
    def _create_alert_message(self, event: ConnectionEvent) -> str:
        """Create formatted alert message"""
        geo_info = ""
        if event.geo_country:
            geo_info = f" ({event.geo_country}"
            if event.geo_city:
                geo_info += f", {event.geo_city}"
            geo_info += ")"
        
        banner_info = ""
        if event.banner:
            banner_info = f"\nBanner: {event.banner[:50]}..."
        
        message = f"""
🚨 HONEYPOT TRIGGERED 🚨

Source IP: {event.src_ip}:{event.src_port}
Target Port: {event.dst_port}
Time: {event.timestamp}
Location: {geo_info}
Labels: {', '.join(event.labels)}{banner_info}

This IP has been logged and may be blocked automatically.
"""
        return message.strip()
    
    async def _send_telegram_alert(self, message: str):
        """Send alert via Telegram"""
        try:
            url = f"https://api.telegram.org/bot{self.config.alerts.telegram_token}/sendMessage"
            data = {
                "chat_id": self.config.alerts.telegram_chat_id,
                "text": message,
                "parse_mode": "HTML"
            }
            
            async with self.session.post(url, json=data) as response:
                if response.status == 200:
                    self.logger.info("Telegram alert sent successfully")
                else:
                    self.logger.error(f"Telegram alert failed: {response.status}")
                    
        except Exception as e:
            self.logger.error(f"Failed to send Telegram alert: {e}")
    
    async def _send_discord_alert(self, message: str):
        """Send alert via Discord webhook"""
        try:
            data = {
                "content": message,
                "username": "Honeyport Alert",
                "avatar_url": "https://cdn-icons-png.flaticon.com/512/2917/2917995.png"
            }
            
            async with self.session.post(self.config.alerts.discord_webhook, json=data) as response:
                if response.status in [200, 204]:
                    self.logger.info("Discord alert sent successfully")
                else:
                    self.logger.error(f"Discord alert failed: {response.status}")
                    
        except Exception as e:
            self.logger.error(f"Failed to send Discord alert: {e}")
    
    async def _send_email_alert(self, message: str, event: ConnectionEvent):
        """Send alert via email"""
        try:
            # Create email
            msg = MIMEMultipart()
            msg['From'] = self.config.alerts.email_username
            msg['To'] = self.config.alerts.email_to
            msg['Subject'] = f"Honeyport Alert: {event.src_ip} triggered port {event.dst_port}"
            
            # Add body
            msg.attach(MIMEText(message, 'plain'))
            
            # Send email
            server = smtplib.SMTP(self.config.alerts.email_smtp_server, self.config.alerts.email_smtp_port)
            server.starttls()
            server.login(self.config.alerts.email_username, self.config.alerts.email_password)
            
            text = msg.as_string()
            server.sendmail(self.config.alerts.email_username, self.config.alerts.email_to, text)
            server.quit()
            
            self.logger.info("Email alert sent successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to send email alert: {e}")
    
    def _is_rate_limited(self, ip: str) -> bool:
        """Check if IP is rate limited"""
        if ip not in self.rate_limit_cache:
            return False
        
        last_alert = self.rate_limit_cache[ip]
        rate_limit_seconds = self.config.alerts.rate_limit_minutes * 60
        
        return (time.time() - last_alert) < rate_limit_seconds
    
    def get_alerts_sent(self) -> int:
        """Get number of alerts sent"""
        return self.alerts_sent
    
    def get_rate_limit_stats(self) -> Dict[str, int]:
        """Get rate limiting statistics"""
        now = time.time()
        rate_limit_seconds = self.config.alerts.rate_limit_minutes * 60
        
        active_limits = 0
        for last_alert in self.rate_limit_cache.values():
            if (now - last_alert) < rate_limit_seconds:
                active_limits += 1
        
        return {
            "total_cached_ips": len(self.rate_limit_cache),
            "currently_rate_limited": active_limits,
            "rate_limit_minutes": self.config.alerts.rate_limit_minutes
        }
