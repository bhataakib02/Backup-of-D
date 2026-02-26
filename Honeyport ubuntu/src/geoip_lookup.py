"""
GeoIP Lookup Module for Honeyport
Provides IP geolocation using MaxMind GeoLite2 database or online APIs
"""

import asyncio
import logging
import json
import time
from pathlib import Path
from typing import Dict, Optional
import aiohttp

try:
    import geoip2.database
    import geoip2.errors
    GEOIP2_AVAILABLE = True
except ImportError:
    GEOIP2_AVAILABLE = False

from .config import Config


class GeoIPLookup:
    """Handles IP geolocation lookups"""
    
    def __init__(self, config: Config):
        self.config = config
        self.logger = logging.getLogger(__name__)
        
        self.db_reader = None
        self.session: Optional[aiohttp.ClientSession] = None
        self.cache: Dict[str, Dict] = {}
        self.cache_ttl = 3600  # 1 hour cache
        
        # Initialize database if available
        if self.config.geoip.enabled and GEOIP2_AVAILABLE:
            self._load_database()
    
    async def start(self):
        """Initialize GeoIP lookup"""
        self.session = aiohttp.ClientSession()
        self.logger.info("GeoIP lookup started")
    
    async def stop(self):
        """Cleanup GeoIP lookup"""
        if self.session:
            await self.session.close()
        if self.db_reader:
            self.db_reader.close()
        self.logger.info("GeoIP lookup stopped")
    
    def _load_database(self):
        """Load MaxMind GeoLite2 database"""
        db_path = Path(self.config.geoip.database_path)
        
        if not db_path.exists():
            self.logger.warning(f"GeoIP database not found at {db_path}")
            self.logger.info("Download GeoLite2-City.mmdb from MaxMind and place in data/")
            return
        
        try:
            self.db_reader = geoip2.database.Reader(str(db_path))
            self.logger.info(f"Loaded GeoIP database: {db_path}")
        except Exception as e:
            self.logger.error(f"Failed to load GeoIP database: {e}")
            self.db_reader = None
    
    async def get_location(self, ip: str) -> Dict[str, Optional[str]]:
        """Get location information for IP address"""
        if not self.config.geoip.enabled:
            return {"country": None, "city": None, "isp": None}
        
        # Check cache first
        if ip in self.cache:
            cached_data = self.cache[ip]
            if time.time() - cached_data.get('timestamp', 0) < self.cache_ttl:
                return {
                    "country": cached_data.get('country'),
                    "city": cached_data.get('city'),
                    "isp": cached_data.get('isp')
                }
        
        # Try offline database first
        if self.db_reader:
            result = await self._lookup_offline(ip)
            if result["country"]:  # If we got a result
                self._cache_result(ip, result)
                return result
        
        # Fallback to online API
        if self.config.geoip.api_key:
            result = await self._lookup_online(ip)
            if result["country"]:  # If we got a result
                self._cache_result(ip, result)
                return result
        
        # Return empty result
        return {"country": None, "city": None, "isp": None}
    
    async def _lookup_offline(self, ip: str) -> Dict[str, Optional[str]]:
        """Lookup IP using offline MaxMind database"""
        try:
            response = self.db_reader.city(ip)
            
            country = response.country.name
            city = response.city.name
            isp = None
            
            # Try to get ISP if available
            try:
                isp = response.traits.isp
            except:
                pass
            
            return {
                "country": country,
                "city": city,
                "isp": isp
            }
            
        except geoip2.errors.AddressNotFoundError:
            self.logger.debug(f"IP {ip} not found in GeoIP database")
            return {"country": None, "city": None, "isp": None}
        except Exception as e:
            self.logger.error(f"GeoIP lookup error for {ip}: {e}")
            return {"country": None, "city": None, "isp": None}
    
    async def _lookup_online(self, ip: str) -> Dict[str, Optional[str]]:
        """Lookup IP using online API service"""
        try:
            # Using ipapi.co as example (free tier available)
            url = f"http://ipapi.co/{ip}/json/"
            
            async with self.session.get(url, timeout=5) as response:
                if response.status == 200:
                    data = await response.json()
                    
                    return {
                        "country": data.get('country_name'),
                        "city": data.get('city'),
                        "isp": data.get('org')
                    }
                else:
                    self.logger.debug(f"Online GeoIP lookup failed for {ip}: {response.status}")
                    return {"country": None, "city": None, "isp": None}
                    
        except Exception as e:
            self.logger.debug(f"Online GeoIP lookup error for {ip}: {e}")
            return {"country": None, "city": None, "isp": None}
    
    def _cache_result(self, ip: str, result: Dict[str, Optional[str]]):
        """Cache lookup result"""
        result['timestamp'] = time.time()
        self.cache[ip] = result
        
        # Clean old cache entries
        now = time.time()
        expired_keys = [
            key for key, data in self.cache.items()
            if now - data.get('timestamp', 0) > self.cache_ttl
        ]
        
        for key in expired_keys:
            del self.cache[key]
    
    def get_cache_stats(self) -> Dict[str, int]:
        """Get cache statistics"""
        return {
            "cached_ips": len(self.cache),
            "cache_ttl_seconds": self.cache_ttl,
            "database_loaded": self.db_reader is not None
        }
    
    async def download_geolite_database(self):
        """Download GeoLite2 database (requires MaxMind account)"""
        if not self.config.geoip.api_key:
            self.logger.error("MaxMind API key required for database download")
            return False
        
        try:
            # This would require MaxMind API integration
            # For now, just log instructions
            self.logger.info("""
To download GeoLite2 database:
1. Create account at https://www.maxmind.com/
2. Generate API key
3. Download GeoLite2-City.mmdb
4. Place in data/ directory
            """)
            return False
            
        except Exception as e:
            self.logger.error(f"Failed to download GeoLite2 database: {e}")
            return False
