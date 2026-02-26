"""
Utility functions for Honeyport
Logging setup and other helper functions
"""

import logging
import logging.handlers
import json
from pathlib import Path
from typing import Dict, Any

from ..config import Config


def setup_logging(config: Config):
    """Setup logging configuration"""
    
    # Create logs directory
    log_path = Path(config.logging.file_path)
    log_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Configure root logger
    logging.basicConfig(
        level=getattr(logging, config.logging.level.upper()),
        format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        handlers=[
            logging.StreamHandler(),  # Console output
            logging.handlers.RotatingFileHandler(
                log_path,
                maxBytes=config.logging.max_file_size_mb * 1024 * 1024,
                backupCount=config.logging.backup_count
            )
        ]
    )
    
    # Reduce noise from some libraries
    logging.getLogger('urllib3').setLevel(logging.WARNING)
    logging.getLogger('aiohttp').setLevel(logging.WARNING)


def format_event_json(event: Dict[str, Any]) -> str:
    """Format event as JSON string"""
    return json.dumps(event, indent=2)


def sanitize_ip(ip: str) -> str:
    """Sanitize IP address for logging (mask last octet)"""
    try:
        parts = ip.split('.')
        if len(parts) == 4:
            return f"{parts[0]}.{parts[1]}.{parts[2]}.xxx"
    except:
        pass
    return ip


def get_system_info() -> Dict[str, Any]:
    """Get system information"""
    import platform
    import os
    
    return {
        "platform": platform.platform(),
        "python_version": platform.python_version(),
        "hostname": platform.node(),
        "pid": os.getpid(),
        "user": os.getenv('USER', 'unknown')
    }
