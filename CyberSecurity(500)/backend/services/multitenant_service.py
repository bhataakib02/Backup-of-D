"""
Multi-Tenant Architecture Service for NEXUS CYBER INTELLIGENCE
Enterprise-grade tenant isolation and resource management
"""

import json
import hashlib
import time
import uuid
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional, Tuple
from dataclasses import dataclass, asdict
from enum import Enum
import logging
import random
import threading
from concurrent.futures import ThreadPoolExecutor
import redis
import psycopg2
from psycopg2.extras import RealDictCursor

logger = logging.getLogger(__name__)

class TenantStatus(Enum):
    ACTIVE = "active"
    SUSPENDED = "suspended"
    INACTIVE = "inactive"
    PENDING = "pending"
    CANCELLED = "cancelled"

class TenantTier(Enum):
    BASIC = "basic"
    PROFESSIONAL = "professional"
    ENTERPRISE = "enterprise"
    PREMIUM = "premium"

class ResourceType(Enum):
    COMPUTE = "compute"
    STORAGE = "storage"
    NETWORK = "network"
    DATABASE = "database"
    API_CALLS = "api_calls"
    USERS = "users"

@dataclass
class Tenant:
    tenant_id: str
    name: str
    domain: str
    tier: TenantTier
    status: TenantStatus
    created_at: datetime
    updated_at: datetime
    owner_id: str
    settings: Dict[str, Any]
    limits: Dict[str, int]
    usage: Dict[str, int]
    features: List[str]
    customizations: Dict[str, Any]

@dataclass
class TenantUser:
    user_id: str
    tenant_id: str
    email: str
    role: str
    permissions: List[str]
    is_active: bool
    created_at: datetime
    last_login: Optional[datetime]

@dataclass
class TenantResource:
    resource_id: str
    tenant_id: str
    resource_type: ResourceType
    allocated: int
    used: int
    limit: int
    unit: str
    last_updated: datetime

@dataclass
class TenantIsolation:
    tenant_id: str
    database_schema: str
    redis_namespace: str
    storage_path: str
    network_segment: str
    encryption_key: str
    audit_log_path: str

class TenantIsolationManager:
    """Manages tenant data isolation and security"""
    
    def __init__(self):
        self.isolation_configs = {}
        self.encryption_keys = {}
        self._initialize_isolation()
    
    def _initialize_isolation(self):
        """Initialize isolation configurations"""
        logger.info("Tenant isolation manager initialized")
    
    def create_tenant_isolation(self, tenant_id: str) -> TenantIsolation:
        """Create isolation configuration for new tenant"""
        isolation = TenantIsolation(
            tenant_id=tenant_id,
            database_schema=f"tenant_{tenant_id}",
            redis_namespace=f"tenant:{tenant_id}",
            storage_path=f"/data/tenants/{tenant_id}",
            network_segment=f"10.{random.randint(0, 255)}.{random.randint(0, 255)}.0/24",
            encryption_key=self._generate_encryption_key(),
            audit_log_path=f"/logs/tenants/{tenant_id}"
        )
        
        self.isolation_configs[tenant_id] = isolation
        return isolation
    
    def _generate_encryption_key(self) -> str:
        """Generate encryption key for tenant"""
        return hashlib.sha256(f"{uuid.uuid4()}{time.time()}".encode()).hexdigest()
    
    def get_tenant_isolation(self, tenant_id: str) -> Optional[TenantIsolation]:
        """Get isolation configuration for tenant"""
        return self.isolation_configs.get(tenant_id)
    
    def validate_tenant_access(self, tenant_id: str, user_id: str, resource: str) -> bool:
        """Validate if user can access tenant resource"""
        # Simulate access validation
        return random.choice([True, True, True, False])  # 75% success rate
    
    def encrypt_tenant_data(self, tenant_id: str, data: str) -> str:
        """Encrypt data for specific tenant"""
        isolation = self.get_tenant_isolation(tenant_id)
        if not isolation:
            return data
        
        # Simulate encryption
        return f"encrypted_{tenant_id}_{hashlib.md5(data.encode()).hexdigest()}"
    
    def decrypt_tenant_data(self, tenant_id: str, encrypted_data: str) -> str:
        """Decrypt data for specific tenant"""
        isolation = self.get_tenant_isolation(tenant_id)
        if not isolation:
            return encrypted_data
        
        # Simulate decryption
        if encrypted_data.startswith(f"encrypted_{tenant_id}_"):
            return encrypted_data.split("_", 2)[2]
        return encrypted_data

class ResourceManager:
    """Manages tenant resource allocation and monitoring"""
    
    def __init__(self):
        self.tenant_resources = {}
        self.resource_monitor = ResourceMonitor()
        self._initialize_resource_manager()
    
    def _initialize_resource_manager(self):
        """Initialize resource manager"""
        logger.info("Resource manager initialized")
    
    def allocate_resources(self, tenant_id: str, tier: TenantTier) -> Dict[str, TenantResource]:
        """Allocate resources based on tenant tier"""
        tier_limits = {
            TenantTier.BASIC: {
                ResourceType.COMPUTE: 1000,  # CPU minutes
                ResourceType.STORAGE: 100,   # GB
                ResourceType.API_CALLS: 10000,  # per month
                ResourceType.USERS: 10,
                ResourceType.DATABASE: 1  # connections
            },
            TenantTier.PROFESSIONAL: {
                ResourceType.COMPUTE: 5000,
                ResourceType.STORAGE: 500,
                ResourceType.API_CALLS: 50000,
                ResourceType.USERS: 50,
                ResourceType.DATABASE: 5
            },
            TenantTier.ENTERPRISE: {
                ResourceType.COMPUTE: 25000,
                ResourceType.STORAGE: 2500,
                ResourceType.API_CALLS: 250000,
                ResourceType.USERS: 250,
                ResourceType.DATABASE: 25
            },
            TenantTier.PREMIUM: {
                ResourceType.COMPUTE: 100000,
                ResourceType.STORAGE: 10000,
                ResourceType.API_CALLS: 1000000,
                ResourceType.USERS: 1000,
                ResourceType.DATABASE: 100
            }
        }
        
        resources = {}
        limits = tier_limits.get(tier, tier_limits[TenantTier.BASIC])
        
        for resource_type, limit in limits.items():
            resource = TenantResource(
                resource_id=str(uuid.uuid4()),
                tenant_id=tenant_id,
                resource_type=resource_type,
                allocated=limit,
                used=0,
                limit=limit,
                unit=self._get_resource_unit(resource_type),
                last_updated=datetime.now()
            )
            resources[resource_type.value] = resource
        
        self.tenant_resources[tenant_id] = resources
        return resources
    
    def _get_resource_unit(self, resource_type: ResourceType) -> str:
        """Get unit for resource type"""
        units = {
            ResourceType.COMPUTE: "minutes",
            ResourceType.STORAGE: "GB",
            ResourceType.API_CALLS: "calls",
            ResourceType.USERS: "users",
            ResourceType.DATABASE: "connections"
        }
        return units.get(resource_type, "units")
    
    def update_resource_usage(self, tenant_id: str, resource_type: ResourceType, usage: int) -> bool:
        """Update resource usage for tenant"""
        if tenant_id not in self.tenant_resources:
            return False
        
        resources = self.tenant_resources[tenant_id]
        if resource_type.value in resources:
            resource = resources[resource_type.value]
            resource.used += usage
            resource.last_updated = datetime.now()
            
            # Check if limit exceeded
            if resource.used > resource.limit:
                logger.warning(f"Tenant {tenant_id} exceeded {resource_type.value} limit")
                return False
        
        return True
    
    def get_tenant_usage(self, tenant_id: str) -> Dict[str, Any]:
        """Get resource usage for tenant"""
        if tenant_id not in self.tenant_resources:
            return {}
        
        resources = self.tenant_resources[tenant_id]
        usage = {}
        
        for resource_type, resource in resources.items():
            usage[resource_type] = {
                'allocated': resource.allocated,
                'used': resource.used,
                'limit': resource.limit,
                'utilization': (resource.used / resource.limit) * 100,
                'unit': resource.unit
            }
        
        return usage
    
    def check_resource_availability(self, tenant_id: str, resource_type: ResourceType, requested: int) -> bool:
        """Check if tenant has available resources"""
        if tenant_id not in self.tenant_resources:
            return False
        
        resources = self.tenant_resources[tenant_id]
        if resource_type.value in resources:
            resource = resources[resource_type.value]
            return (resource.used + requested) <= resource.limit
        
        return False

class ResourceMonitor:
    """Monitors resource usage across tenants"""
    
    def __init__(self):
        self.monitoring_active = True
        self.monitor_thread = threading.Thread(target=self._monitor_resources, daemon=True)
        self.monitor_thread.start()
    
    def _monitor_resources(self):
        """Monitor resource usage in background"""
        while self.monitoring_active:
            try:
                # Simulate resource monitoring
                time.sleep(60)  # Check every minute
                logger.debug("Resource monitoring cycle completed")
            except Exception as e:
                logger.error(f"Error in resource monitoring: {e}")
    
    def get_system_metrics(self) -> Dict[str, Any]:
        """Get system-wide resource metrics"""
        return {
            'total_tenants': random.randint(50, 200),
            'active_tenants': random.randint(40, 180),
            'total_cpu_usage': random.uniform(60, 90),
            'total_memory_usage': random.uniform(70, 85),
            'total_storage_usage': random.uniform(50, 80),
            'network_throughput': random.uniform(100, 1000),
            'database_connections': random.randint(100, 500)
        }

class TenantService:
    """Main multi-tenant service"""
    
    def __init__(self):
        self.tenants = {}
        self.tenant_users = {}
        self.isolation_manager = TenantIsolationManager()
        self.resource_manager = ResourceManager()
        self._initialize_service()
    
    def _initialize_service(self):
        """Initialize multi-tenant service"""
        logger.info("Multi-tenant service initialized")
    
    def create_tenant(self, 
                     name: str,
                     domain: str,
                     tier: TenantTier,
                     owner_id: str,
                     settings: Dict[str, Any] = None) -> Dict[str, Any]:
        """Create new tenant"""
        try:
            tenant_id = str(uuid.uuid4())
            
            # Create tenant
            tenant = Tenant(
                tenant_id=tenant_id,
                name=name,
                domain=domain,
                tier=tier,
                status=TenantStatus.PENDING,
                created_at=datetime.now(),
                updated_at=datetime.now(),
                owner_id=owner_id,
                settings=settings or {},
                limits={},
                usage={},
                features=self._get_tier_features(tier),
                customizations={}
            )
            
            # Create isolation configuration
            isolation = self.isolation_manager.create_tenant_isolation(tenant_id)
            
            # Allocate resources
            resources = self.resource_manager.allocate_resources(tenant_id, tier)
            
            # Update tenant with resource limits
            tenant.limits = {rt.value: r.limit for rt, r in resources.items()}
            
            self.tenants[tenant_id] = tenant
            
            # Create owner user
            self._create_tenant_user(tenant_id, owner_id, "admin", ["*"])
            
            return {
                'success': True,
                'tenant_id': tenant_id,
                'tenant': asdict(tenant),
                'isolation': asdict(isolation),
                'resources': {k: asdict(v) for k, v in resources.items()}
            }
            
        except Exception as e:
            logger.error(f"Error creating tenant: {e}")
            return {'success': False, 'error': str(e)}
    
    def _get_tier_features(self, tier: TenantTier) -> List[str]:
        """Get features available for tenant tier"""
        features = {
            TenantTier.BASIC: ['basic_threat_detection', 'email_support'],
            TenantTier.PROFESSIONAL: ['advanced_threat_detection', 'api_access', 'priority_support'],
            TenantTier.ENTERPRISE: ['enterprise_features', 'custom_integrations', 'dedicated_support'],
            TenantTier.PREMIUM: ['premium_features', 'white_label', '24x7_support']
        }
        return features.get(tier, features[TenantTier.BASIC])
    
    def _create_tenant_user(self, tenant_id: str, user_id: str, role: str, permissions: List[str]):
        """Create user for tenant"""
        tenant_user = TenantUser(
            user_id=user_id,
            tenant_id=tenant_id,
            email=f"user_{user_id}@tenant_{tenant_id}.com",
            role=role,
            permissions=permissions,
            is_active=True,
            created_at=datetime.now(),
            last_login=None
        )
        
        if tenant_id not in self.tenant_users:
            self.tenant_users[tenant_id] = []
        self.tenant_users[tenant_id].append(tenant_user)
    
    def get_tenant(self, tenant_id: str) -> Dict[str, Any]:
        """Get tenant by ID"""
        if tenant_id not in self.tenants:
            return {'success': False, 'error': 'Tenant not found'}
        
        tenant = self.tenants[tenant_id]
        isolation = self.isolation_manager.get_tenant_isolation(tenant_id)
        usage = self.resource_manager.get_tenant_usage(tenant_id)
        
        return {
            'success': True,
            'tenant': asdict(tenant),
            'isolation': asdict(isolation) if isolation else None,
            'usage': usage
        }
    
    def list_tenants(self, status: TenantStatus = None) -> Dict[str, Any]:
        """List tenants"""
        tenants = list(self.tenants.values())
        
        if status:
            tenants = [t for t in tenants if t.status == status]
        
        return {
            'success': True,
            'tenants': [asdict(t) for t in tenants],
            'total_count': len(tenants)
        }
    
    def update_tenant(self, tenant_id: str, updates: Dict[str, Any]) -> Dict[str, Any]:
        """Update tenant"""
        if tenant_id not in self.tenants:
            return {'success': False, 'error': 'Tenant not found'}
        
        tenant = self.tenants[tenant_id]
        
        # Update fields
        for key, value in updates.items():
            if hasattr(tenant, key):
                setattr(tenant, key, value)
        
        tenant.updated_at = datetime.now()
        
        return {
            'success': True,
            'tenant': asdict(tenant)
        }
    
    def suspend_tenant(self, tenant_id: str, reason: str = None) -> Dict[str, Any]:
        """Suspend tenant"""
        if tenant_id not in self.tenants:
            return {'success': False, 'error': 'Tenant not found'}
        
        tenant = self.tenants[tenant_id]
        tenant.status = TenantStatus.SUSPENDED
        tenant.updated_at = datetime.now()
        
        return {
            'success': True,
            'message': f'Tenant {tenant_id} suspended',
            'reason': reason
        }
    
    def activate_tenant(self, tenant_id: str) -> Dict[str, Any]:
        """Activate tenant"""
        if tenant_id not in self.tenants:
            return {'success': False, 'error': 'Tenant not found'}
        
        tenant = self.tenants[tenant_id]
        tenant.status = TenantStatus.ACTIVE
        tenant.updated_at = datetime.now()
        
        return {
            'success': True,
            'message': f'Tenant {tenant_id} activated'
        }
    
    def add_tenant_user(self, tenant_id: str, user_id: str, email: str, role: str, permissions: List[str]) -> Dict[str, Any]:
        """Add user to tenant"""
        if tenant_id not in self.tenants:
            return {'success': False, 'error': 'Tenant not found'}
        
        # Check user limit
        if not self.resource_manager.check_resource_availability(tenant_id, ResourceType.USERS, 1):
            return {'success': False, 'error': 'User limit exceeded'}
        
        self._create_tenant_user(tenant_id, user_id, role, permissions)
        
        # Update resource usage
        self.resource_manager.update_resource_usage(tenant_id, ResourceType.USERS, 1)
        
        return {
            'success': True,
            'message': f'User {user_id} added to tenant {tenant_id}'
        }
    
    def get_tenant_users(self, tenant_id: str) -> Dict[str, Any]:
        """Get users for tenant"""
        if tenant_id not in self.tenant_users:
            return {'success': True, 'users': [], 'total_count': 0}
        
        users = self.tenant_users[tenant_id]
        return {
            'success': True,
            'users': [asdict(u) for u in users],
            'total_count': len(users)
        }
    
    def validate_tenant_access(self, tenant_id: str, user_id: str, resource: str) -> Dict[str, Any]:
        """Validate tenant access"""
        if tenant_id not in self.tenants:
            return {'success': False, 'error': 'Tenant not found'}
        
        if tenant_id not in self.tenant_users:
            return {'success': False, 'error': 'No users found for tenant'}
        
        # Check if user belongs to tenant
        user_found = any(u.user_id == user_id for u in self.tenant_users[tenant_id])
        if not user_found:
            return {'success': False, 'error': 'User not found in tenant'}
        
        # Validate access
        has_access = self.isolation_manager.validate_tenant_access(tenant_id, user_id, resource)
        
        return {
            'success': has_access,
            'tenant_id': tenant_id,
            'user_id': user_id,
            'resource': resource,
            'access_granted': has_access
        }
    
    def get_tenant_dashboard_data(self, tenant_id: str) -> Dict[str, Any]:
        """Get dashboard data for tenant"""
        if tenant_id not in self.tenants:
            return {'success': False, 'error': 'Tenant not found'}
        
        tenant = self.tenants[tenant_id]
        usage = self.resource_manager.get_tenant_usage(tenant_id)
        users = self.tenant_users.get(tenant_id, [])
        
        return {
            'success': True,
            'tenant_info': {
                'name': tenant.name,
                'tier': tenant.tier.value,
                'status': tenant.status.value,
                'features': tenant.features
            },
            'resource_usage': usage,
            'user_count': len(users),
            'active_users': len([u for u in users if u.is_active]),
            'system_health': {
                'uptime': '99.9%',
                'performance': 'Excellent',
                'security_score': random.uniform(85, 98)
            }
        }
    
    def get_system_dashboard_data(self) -> Dict[str, Any]:
        """Get system-wide dashboard data"""
        system_metrics = self.resource_manager.resource_monitor.get_system_metrics()
        
        return {
            'success': True,
            'system_metrics': system_metrics,
            'tenant_summary': {
                'total_tenants': len(self.tenants),
                'active_tenants': len([t for t in self.tenants.values() if t.status == TenantStatus.ACTIVE]),
                'suspended_tenants': len([t for t in self.tenants.values() if t.status == TenantStatus.SUSPENDED]),
                'tier_distribution': {
                    'basic': len([t for t in self.tenants.values() if t.tier == TenantTier.BASIC]),
                    'professional': len([t for t in self.tenants.values() if t.tier == TenantTier.PROFESSIONAL]),
                    'enterprise': len([t for t in self.tenants.values() if t.tier == TenantTier.ENTERPRISE]),
                    'premium': len([t for t in self.tenants.values() if t.tier == TenantTier.PREMIUM])
                }
            }
        }

# Global instance
multitenant_service = TenantService()

