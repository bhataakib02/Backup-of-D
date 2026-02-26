"""
User models for authentication and authorization
"""

from sqlalchemy import Column, String, Boolean, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from datetime import datetime
from typing import Optional
import uuid

from app.core.database import BaseModel


class User(BaseModel):
    """User authentication and authorization"""
    
    __tablename__ = "users"
    
    username = Column(String(50), unique=True, nullable=False, index=True)
    email = Column(String(100), unique=True, nullable=False, index=True)
    full_name = Column(String(100), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), nullable=False, default="analyst")
    is_active = Column(Boolean, default=True, nullable=False)
    last_login = Column(DateTime, nullable=True)
    
    # Optional profile fields
    job_title = Column(String(100), nullable=True)
    department = Column(String(100), nullable=True)
    phone_number = Column(String(20), nullable=True)
    timezone = Column(String(50), default="UTC")
    language = Column(String(10), default="en")
    
    # Security settings
    two_factor_enabled = Column(Boolean, default=False)
    password_reset_token = Column(String(255), nullable=True)
    password_reset_expires = Column(DateTime, nullable=True)
    
    # Activity tracking
    last_ip_address = Column(String(45), nullable=True)  # IPv6 compatible
    user_agent = Column(Text, nullable=True)
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', email='{self.email}')>"
    
    def is_admin(self) -> bool:
        """Check if user has admin role"""
        return self.role == "admin"
    
    def is_analyst(self) -> bool:
        """Check if user has analyst role"""
        return self.role in ["admin", "analyst"]
    
    def can_access_feature(self, feature: str) -> bool:
        """Check if user can access specific feature"""
        role_permissions = {
            "admin": ["phishing", "malware", "ids", "fusion", "dashboard", "admin"],
            "analyst": ["phishing", "malware", "ids", "fusion", "dashboard"],
            "viewer": ["dashboard", "phishing", "malware"]
        }
        return feature in role_permissions.get(self.role, [])
