"""
Listener Manager for Honeyport
Handles multiple port listeners concurrently with async operations
"""

import asyncio
import socket
import logging
import threading
from typing import Dict, List, Optional
from concurrent.futures import ThreadPoolExecutor

from .connection_handler import ConnectionHandler
from .config import Config


class ListenerManager:
    """Manages multiple port listeners"""
    
    def __init__(self, config: Config, metrics):
        self.config = config
        self.metrics = metrics
        self.logger = logging.getLogger(__name__)
        
        self.listeners: Dict[int, socket.socket] = {}
        self.connection_handler = ConnectionHandler(config, metrics)
        self.executor = ThreadPoolExecutor(max_workers=20)
        self.running = False
        
    async def start(self):
        """Start all listeners"""
        self.running = True
        
        for port in self.config.ports:
            try:
                await self._start_listener(port)
                self.logger.info(f"Started listener on port {port}")
            except Exception as e:
                self.logger.error(f"Failed to start listener on port {port}: {e}")
        
        self.logger.info(f"Listener manager started with {len(self.listeners)} listeners")
    
    async def stop(self):
        """Stop all listeners"""
        self.running = False
        
        for port, sock in self.listeners.items():
            try:
                sock.close()
                self.logger.info(f"Stopped listener on port {port}")
            except Exception as e:
                self.logger.error(f"Error stopping listener on port {port}: {e}")
        
        self.listeners.clear()
        self.executor.shutdown(wait=True)
        self.logger.info("Listener manager stopped")
    
    async def _start_listener(self, port: int):
        """Start a single port listener"""
        sock = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        
        try:
            sock.bind((self.config.host, port))
            sock.listen(5)
            sock.setblocking(False)
            
            self.listeners[port] = sock
            
            # Start listener task
            asyncio.create_task(self._listen_loop(port, sock))
            
        except Exception as e:
            sock.close()
            raise e
    
    async def _listen_loop(self, port: int, sock: socket.socket):
        """Main listening loop for a port"""
        loop = asyncio.get_event_loop()
        
        while self.running:
            try:
                # Wait for connection
                client_sock, addr = await loop.run_in_executor(
                    self.executor, self._accept_connection, sock
                )
                
                if client_sock:
                    # Handle connection in background
                    asyncio.create_task(
                        self._handle_connection(port, client_sock, addr)
                    )
                
            except Exception as e:
                if self.running:
                    self.logger.error(f"Error in listen loop for port {port}: {e}")
                await asyncio.sleep(0.1)
    
    def _accept_connection(self, sock: socket.socket):
        """Accept connection (blocking operation)"""
        try:
            sock.setblocking(True)
            client_sock, addr = sock.accept()
            sock.setblocking(False)
            return client_sock, addr
        except socket.error:
            sock.setblocking(False)
            return None, None
    
    async def _handle_connection(self, port: int, client_sock: socket.socket, addr):
        """Handle incoming connection"""
        try:
            # Process connection
            await self.connection_handler.handle_connection(
                port, client_sock, addr
            )
        except Exception as e:
            self.logger.error(f"Error handling connection on port {port}: {e}")
        finally:
            try:
                client_sock.close()
            except:
                pass
    
    def get_status(self) -> Dict:
        """Get listener status"""
        return {
            'running': self.running,
            'listeners': len(self.listeners),
            'ports': list(self.listeners.keys()),
            'active_connections': self.connection_handler.get_active_connections()
        }
