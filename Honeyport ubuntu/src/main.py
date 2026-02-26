#!/usr/bin/env python3
"""
Honeyport Main Entry Point
Professional Network Honeypot System
"""

import asyncio
import logging
import signal
import sys
from pathlib import Path

try:
    from .config import Config
    from .listener_manager import ListenerManager
    from .web_api import WebAPI
    from .metrics import MetricsCollector
    from .utils.logger import setup_logging
except ImportError:
    # Fallback for direct execution
    import sys
    import os
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    from config import Config
    from listener_manager import ListenerManager
    from web_api import WebAPI
    from metrics import MetricsCollector
    from utils.logger import setup_logging


class HoneyportService:
    """Main Honeyport service orchestrator"""
    
    def __init__(self):
        self.config = None
        self.listener_manager = None
        self.web_api = None
        self.metrics = None
        self.running = False
        
    async def initialize(self):
        """Initialize all components"""
        try:
            # Load configuration
            self.config = Config()
            await self.config.load()
            
            # Setup logging
            setup_logging(self.config)
            self.logger = logging.getLogger(__name__)
            
            # Initialize components
            self.metrics = MetricsCollector(self.config)
            self.listener_manager = ListenerManager(self.config, self.metrics)
            self.web_api = WebAPI(self.config, self.listener_manager, self.metrics)
            
            self.logger.info("Honeyport service initialized successfully")
            
        except Exception as e:
            self.logger.error(f"Failed to initialize Honeyport: {e}")
            raise
    
    async def start(self):
        """Start all services"""
        try:
            self.running = True
            
            # Start metrics collector
            await self.metrics.start()
            
            # Start listener manager
            await self.listener_manager.start()
            
            # Start web API
            await self.web_api.start()
            
            self.logger.info("Honeyport service started successfully")
            self.logger.info(f"Listening on ports: {self.config.ports}")
            self.logger.info(f"Web dashboard: http://localhost:{self.config.web_port}")
            
        except Exception as e:
            self.logger.error(f"Failed to start Honeyport: {e}")
            raise
    
    async def stop(self):
        """Stop all services gracefully"""
        self.running = False
        
        if self.web_api:
            await self.web_api.stop()
        
        if self.listener_manager:
            await self.listener_manager.stop()
        
        if self.metrics:
            await self.metrics.stop()
        
        self.logger.info("Honeyport service stopped")
    
    def setup_signal_handlers(self):
        """Setup graceful shutdown handlers"""
        def signal_handler(signum, frame):
            self.logger.info(f"Received signal {signum}, shutting down...")
            asyncio.create_task(self.stop())
        
        signal.signal(signal.SIGINT, signal_handler)
        signal.signal(signal.SIGTERM, signal_handler)


async def main():
    """Main entry point"""
    service = HoneyportService()
    
    try:
        await service.initialize()
        service.setup_signal_handlers()
        await service.start()
        
        # Keep running until stopped
        while service.running:
            await asyncio.sleep(1)
            
    except KeyboardInterrupt:
        pass
    except Exception as e:
        print(f"Fatal error: {e}")
        sys.exit(1)
    finally:
        await service.stop()


if __name__ == "__main__":
    asyncio.run(main())
