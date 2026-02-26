"""
Web API and Dashboard for Honeyport
FastAPI-based web interface for monitoring and management
"""

import asyncio
import logging
import json
from pathlib import Path
from typing import Dict, List, Optional
from datetime import datetime, timedelta

from fastapi import FastAPI, HTTPException, Depends, WebSocket, WebSocketDisconnect
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from .config import Config


class BlockIPRequest(BaseModel):
    ip: str
    reason: str
    duration_hours: Optional[int] = None


class UnblockIPRequest(BaseModel):
    ip: str


class WebAPI:
    """FastAPI web interface for Honeyport"""
    
    def __init__(self, config: Config, listener_manager, metrics):
        self.config = config
        self.listener_manager = listener_manager
        self.metrics = metrics
        self.logger = logging.getLogger(__name__)
        
        self.app = FastAPI(
            title="Honeyport Dashboard",
            description="Professional Network Honeypot Management Interface",
            version="1.0.0"
        )
        
        self.websocket_connections: List[WebSocket] = []
        self.recent_events: List[Dict] = []
        self.max_recent_events = 1000
        
        self._setup_routes()
        self._setup_middleware()
    
    def _setup_middleware(self):
        """Setup CORS and other middleware"""
        self.app.add_middleware(
            CORSMiddleware,
            allow_origins=self.config.web.cors_origins,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )
    
    def _setup_routes(self):
        """Setup API routes"""
        
        @self.app.get("/", response_class=HTMLResponse)
        async def dashboard():
            """Serve main dashboard"""
            return self._get_dashboard_html()
        
        @self.app.get("/api/health")
        async def health():
            """Health check endpoint"""
            return {"status": "healthy", "timestamp": datetime.utcnow().isoformat()}
        
        @self.app.get("/api/status")
        async def status():
            """Get system status"""
            return {
                "listeners": self.listener_manager.get_status(),
                "metrics": self.metrics.get_metrics_summary(),
                "config": {
                    "ports": self.config.ports,
                    "blocking_enabled": self.config.blocking.enabled,
                    "auto_block": self.config.blocking.auto_block,
                    "alerts_enabled": self.config.alerts.enabled
                }
            }
        
        @self.app.get("/api/events")
        async def get_events(limit: int = 50):
            """Get recent events"""
            return {
                "events": self.recent_events[-limit:],
                "total": len(self.recent_events)
            }
        
        @self.app.get("/api/stats")
        async def get_stats():
            """Get statistics"""
            return {
                "total_connections": len(self.recent_events),
                "unique_ips": len(set(event.get('src_ip') for event in self.recent_events)),
                "ports_hit": list(set(event.get('dst_port') for event in self.recent_events)),
                "countries": list(set(event.get('geo', {}).get('country') for event in self.recent_events if event.get('geo', {}).get('country'))),
                "last_24h": len([e for e in self.recent_events if self._is_recent(e)])
            }
        
        @self.app.post("/api/block")
        async def block_ip(request: BlockIPRequest):
            """Block an IP address"""
            if not self.config.blocking.enabled:
                raise HTTPException(status_code=400, detail="Blocking is disabled")
            
            success = await self.listener_manager.connection_handler.blocker.block_ip(
                request.ip, request.reason, request.duration_hours
            )
            
            if success:
                return {"message": f"IP {request.ip} blocked successfully"}
            else:
                raise HTTPException(status_code=400, detail="Failed to block IP")
        
        @self.app.post("/api/unblock")
        async def unblock_ip(request: UnblockIPRequest):
            """Unblock an IP address"""
            if not self.config.blocking.enabled:
                raise HTTPException(status_code=400, detail="Blocking is disabled")
            
            success = await self.listener_manager.connection_handler.blocker.unblock_ip(request.ip)
            
            if success:
                return {"message": f"IP {request.ip} unblocked successfully"}
            else:
                raise HTTPException(status_code=400, detail="Failed to unblock IP")
        
        @self.app.get("/api/blocked")
        async def get_blocked_ips():
            """Get list of blocked IPs"""
            return {
                "blocked_ips": self.listener_manager.connection_handler.blocker.get_blocked_ips(),
                "count": self.listener_manager.connection_handler.blocker.get_blocked_count()
            }
        
        @self.app.websocket("/ws")
        async def websocket_endpoint(websocket: WebSocket):
            """WebSocket for real-time updates"""
            await websocket.accept()
            self.websocket_connections.append(websocket)
            
            try:
                while True:
                    await websocket.receive_text()
            except WebSocketDisconnect:
                self.websocket_connections.remove(websocket)
    
    def _is_recent(self, event: Dict) -> bool:
        """Check if event is from last 24 hours"""
        try:
            event_time = datetime.fromisoformat(event.get('timestamp', '').replace('Z', '+00:00'))
            return event_time > datetime.utcnow() - timedelta(hours=24)
        except:
            return False
    
    def add_event(self, event: Dict):
        """Add new event and broadcast to WebSocket clients"""
        self.recent_events.append(event)
        
        # Keep only recent events
        if len(self.recent_events) > self.max_recent_events:
            self.recent_events = self.recent_events[-self.max_recent_events:]
        
        # Broadcast to WebSocket clients
        asyncio.create_task(self._broadcast_event(event))
    
    async def _broadcast_event(self, event: Dict):
        """Broadcast event to all WebSocket clients"""
        if not self.websocket_connections:
            return
        
        message = json.dumps({
            "type": "new_event",
            "data": event
        })
        
        disconnected = []
        for websocket in self.websocket_connections:
            try:
                await websocket.send_text(message)
            except:
                disconnected.append(websocket)
        
        # Remove disconnected clients
        for websocket in disconnected:
            self.websocket_connections.remove(websocket)
    
    def _get_dashboard_html(self) -> str:
        """Generate dashboard HTML"""
        return """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Honeyport Dashboard</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 1200px; margin: 0 auto; }
        .header { background: #2c3e50; color: white; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
        .stats { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 20px; margin-bottom: 20px; }
        .stat-card { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .stat-number { font-size: 2em; font-weight: bold; color: #e74c3c; }
        .events { background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        .event { border-left: 4px solid #e74c3c; padding: 10px; margin: 10px 0; background: #f8f9fa; }
        .event-time { color: #666; font-size: 0.9em; }
        .event-ip { font-weight: bold; color: #2c3e50; }
        .status-indicator { display: inline-block; width: 10px; height: 10px; border-radius: 50%; margin-right: 5px; }
        .status-online { background: #27ae60; }
        .status-offline { background: #e74c3c; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>🚨 Honeyport Dashboard</h1>
            <p>Professional Network Honeypot Monitoring System</p>
            <div>
                <span class="status-indicator status-online"></span>
                <span id="status">System Online</span>
            </div>
        </div>
        
        <div class="stats">
            <div class="stat-card">
                <div class="stat-number" id="total-connections">0</div>
                <div>Total Connections</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="unique-ips">0</div>
                <div>Unique IPs</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="blocked-ips">0</div>
                <div>Blocked IPs</div>
            </div>
            <div class="stat-card">
                <div class="stat-number" id="last-24h">0</div>
                <div>Last 24h</div>
            </div>
        </div>
        
        <div class="events">
            <h3>Recent Events</h3>
            <div id="events-list">
                <p>No events yet...</p>
            </div>
        </div>
    </div>
    
    <script>
        const ws = new WebSocket('ws://localhost:8080/ws');
        const eventsList = document.getElementById('events-list');
        
        ws.onmessage = function(event) {
            const data = JSON.parse(event.data);
            if (data.type === 'new_event') {
                addEvent(data.data);
            }
        };
        
        function addEvent(event) {
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.innerHTML = `
                <div class="event-time">${new Date(event.timestamp).toLocaleString()}</div>
                <div class="event-ip">${event.src_ip}:${event.src_port} → Port ${event.dst_port}</div>
                <div>${event.geo?.country || 'Unknown Location'} | ${event.labels?.join(', ') || ''}</div>
            `;
            
            eventsList.insertBefore(eventDiv, eventsList.firstChild);
            
            // Keep only last 20 events visible
            while (eventsList.children.length > 20) {
                eventsList.removeChild(eventsList.lastChild);
            }
        }
        
        // Load initial data
        fetch('/api/stats')
            .then(response => response.json())
            .then(data => {
                document.getElementById('total-connections').textContent = data.total_connections;
                document.getElementById('unique-ips').textContent = data.unique_ips;
                document.getElementById('last-24h').textContent = data.last_24h;
            });
        
        fetch('/api/blocked')
            .then(response => response.json())
            .then(data => {
                document.getElementById('blocked-ips').textContent = data.count;
            });
        
        // Load recent events
        fetch('/api/events?limit=20')
            .then(response => response.json())
            .then(data => {
                eventsList.innerHTML = '';
                data.events.reverse().forEach(event => addEvent(event));
            });
    </script>
</body>
</html>
        """
    
    async def start(self):
        """Start web server"""
        if not self.config.web.enabled:
            self.logger.info("Web dashboard disabled")
            return
        
        try:
            import uvicorn
            config = uvicorn.Config(
                self.app,
                host=self.config.web.host,
                port=self.config.web.port,
                log_level="info"
            )
            server = uvicorn.Server(config)
            
            # Start server in background
            asyncio.create_task(server.serve())
            
            self.logger.info(f"Web dashboard started on http://{self.config.web.host}:{self.config.web.port}")
            
        except Exception as e:
            self.logger.error(f"Failed to start web dashboard: {e}")
    
    async def stop(self):
        """Stop web server"""
        # Close all WebSocket connections
        for websocket in self.websocket_connections:
            try:
                await websocket.close()
            except:
                pass
        
        self.websocket_connections.clear()
        self.logger.info("Web dashboard stopped")
