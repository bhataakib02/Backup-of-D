"""
Configuration settings for the AI/ML Cybersecurity Platform
"""

import os
from datetime import timedelta
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class Config:
    """Base configuration class"""
    
    # Flask Configuration
    SECRET_KEY = os.getenv('SECRET_KEY', 'dev-secret-key-change-in-production')
    JWT_SECRET_KEY = os.getenv('JWT_SECRET', 'jwt-secret-change-in-production')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=24)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)
    
    # Database Configuration
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///cybersecurity.db')
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ENGINE_OPTIONS = {
        'pool_pre_ping': True,
        'pool_recycle': 300,
    }
    
    # Redis Configuration
    REDIS_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    
    # File Upload Configuration
    MAX_CONTENT_LENGTH = int(os.getenv('MAX_CONTENT_LENGTH', 16777216))  # 16MB
    UPLOAD_FOLDER = 'uploads'
    MODEL_FOLDER = 'models'
    ALLOWED_EXTENSIONS = {
        'phishing': {'txt', 'eml', 'msg', 'html'},
        'malware': {'exe', 'dll', 'apk', 'pdf', 'doc', 'docx', 'zip', 'rar'},
        'ids': {'pcap', 'pcapng', 'log', 'csv', 'json'}
    }
    
    # API Keys - Threat Intelligence
    VIRUSTOTAL_API_KEY = os.getenv('VIRUSTOTAL_API_KEY')
    ABUSEIPDB_API_KEY = os.getenv('ABUSEIPDB_API_KEY')
    OTX_API_KEY = os.getenv('OTX_API_KEY')
    SHODAN_API_KEY = os.getenv('SHODAN_API_KEY')
    CENSYS_API_ID = os.getenv('CENSYS_API_ID')
    CENSYS_API_SECRET = os.getenv('CENSYS_API_SECRET')
    
    # Email Configuration
    SMTP_SERVER = os.getenv('SMTP_SERVER', 'smtp.gmail.com')
    SMTP_PORT = int(os.getenv('SMTP_PORT', 587))
    SMTP_USERNAME = os.getenv('SMTP_USERNAME')
    SMTP_PASSWORD = os.getenv('SMTP_PASSWORD')
    EMAIL_FROM = os.getenv('EMAIL_FROM')
    
    # Notification Services
    SLACK_WEBHOOK_URL = os.getenv('SLACK_WEBHOOK_URL')
    TELEGRAM_BOT_TOKEN = os.getenv('TELEGRAM_BOT_TOKEN')
    TELEGRAM_CHAT_ID = os.getenv('TELEGRAM_CHAT_ID')
    
    # Cloud Storage Configuration
    AWS_ACCESS_KEY_ID = os.getenv('AWS_ACCESS_KEY_ID')
    AWS_SECRET_ACCESS_KEY = os.getenv('AWS_SECRET_ACCESS_KEY')
    AWS_S3_BUCKET = os.getenv('AWS_S3_BUCKET')
    AWS_REGION = os.getenv('AWS_REGION', 'us-east-1')
    
    # Security Configuration
    CORS_ORIGINS = os.getenv('CORS_ORIGINS', 'http://localhost:3000').split(',')
    RATE_LIMIT_STORAGE_URL = os.getenv('RATE_LIMIT_STORAGE_URL', 'redis://localhost:6379/0')
    
    # ML Model Configuration
    MODEL_UPDATE_INTERVAL = int(os.getenv('MODEL_UPDATE_INTERVAL', 3600))  # 1 hour
    MODEL_RETRAIN_THRESHOLD = int(os.getenv('MODEL_RETRAIN_THRESHOLD', 1000))
    CONFIDENCE_THRESHOLD = float(os.getenv('CONFIDENCE_THRESHOLD', 0.8))
    
    # Sandbox Configuration
    CUCKOO_API_URL = os.getenv('CUCKOO_API_URL', 'http://localhost:8090')
    CUCKOO_API_KEY = os.getenv('CUCKOO_API_KEY')
    SANDBOX_TIMEOUT = int(os.getenv('SANDBOX_TIMEOUT', 300))  # 5 minutes
    
    # Logging Configuration
    LOG_LEVEL = os.getenv('LOG_LEVEL', 'INFO')
    LOG_FILE = os.getenv('LOG_FILE', 'logs/cybersecurity.log')
    LOG_MAX_SIZE = int(os.getenv('LOG_MAX_SIZE', 10485760))  # 10MB
    LOG_BACKUP_COUNT = int(os.getenv('LOG_BACKUP_COUNT', 5))
    
    # Monitoring Configuration
    PROMETHEUS_PORT = int(os.getenv('PROMETHEUS_PORT', 9090))
    GRAFANA_PORT = int(os.getenv('GRAFANA_PORT', 3001))
    ELASTICSEARCH_URL = os.getenv('ELASTICSEARCH_URL', 'http://localhost:9200')
    KIBANA_URL = os.getenv('KIBANA_URL', 'http://localhost:5601')
    
    # Celery Configuration
    CELERY_BROKER_URL = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    CELERY_RESULT_BACKEND = os.getenv('REDIS_URL', 'redis://localhost:6379/0')
    CELERY_ACCEPT_CONTENT = ['json']
    CELERY_TASK_SERIALIZER = 'json'
    CELERY_RESULT_SERIALIZER = 'json'
    CELERY_TIMEZONE = 'UTC'
    
    # Feature Flags
    ENABLE_PHISHING_DETECTION = True
    ENABLE_MALWARE_ANALYSIS = True
    ENABLE_IDS_DETECTION = True
    ENABLE_THREAT_INTEL = True
    ENABLE_FUSION_ENGINE = True
    ENABLE_UEBA = True
    ENABLE_SOAR = True
    ENABLE_XAI = True
    
    # Performance Configuration
    MAX_WORKERS = int(os.getenv('MAX_WORKERS', 4))
    BATCH_SIZE = int(os.getenv('BATCH_SIZE', 100))
    CACHE_TTL = int(os.getenv('CACHE_TTL', 3600))  # 1 hour
    
    # API Rate Limits
    RATE_LIMITS = {
        'default': '1000 per hour, 100 per minute',
        'upload': '10 per minute',
        'analysis': '50 per hour',
        'threat_intel': '200 per hour'
    }

class DevelopmentConfig(Config):
    """Development configuration"""
    DEBUG = True
    TESTING = False
    FLASK_DEBUG = True
    
    # Use SQLite for development
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL', 'sqlite:///cybersecurity_dev.db')
    
    # Relaxed rate limits for development
    RATE_LIMITS = {
        'default': '10000 per hour, 1000 per minute',
        'upload': '100 per minute',
        'analysis': '500 per hour',
        'threat_intel': '2000 per hour'
    }

class ProductionConfig(Config):
    """Production configuration"""
    DEBUG = False
    TESTING = False
    FLASK_DEBUG = False
    
    # Use PostgreSQL for production
    SQLALCHEMY_DATABASE_URI = os.getenv('DATABASE_URL')
    
    # Stricter rate limits for production
    RATE_LIMITS = {
        'default': '1000 per hour, 100 per minute',
        'upload': '10 per minute',
        'analysis': '50 per hour',
        'threat_intel': '200 per hour'
    }
    
    # Security headers
    SECURE_SSL_REDIRECT = True
    SECURE_HSTS_SECONDS = 31536000
    SECURE_HSTS_INCLUDE_SUBDOMAINS = True
    SECURE_HSTS_PRELOAD = True
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    SESSION_COOKIE_SECURE = True
    SESSION_COOKIE_HTTPONLY = True
    SESSION_COOKIE_SAMESITE = 'Lax'

class TestingConfig(Config):
    """Testing configuration"""
    TESTING = True
    DEBUG = True
    
    # Use in-memory SQLite for testing
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'
    
    # Disable rate limiting for tests
    RATE_LIMITS = {
        'default': '10000 per hour',
        'upload': '1000 per minute',
        'analysis': '10000 per hour',
        'threat_intel': '10000 per hour'
    }
    
    # Mock external services
    VIRUSTOTAL_API_KEY = 'test_key'
    ABUSEIPDB_API_KEY = 'test_key'
    OTX_API_KEY = 'test_key'

# Configuration mapping
config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'testing': TestingConfig,
    'default': DevelopmentConfig
}

def get_config():
    """Get configuration based on environment"""
    env = os.getenv('FLASK_ENV', 'development')
    return config.get(env, config['default'])



