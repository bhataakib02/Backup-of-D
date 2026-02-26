"""
Database initialization and configuration
"""

from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import logging

# Initialize extensions
db = SQLAlchemy()
migrate = Migrate()

logger = logging.getLogger(__name__)

def init_db(app):
    """Initialize database with Flask app"""
    db.init_app(app)
    migrate.init_app(app, db)
    
    with app.app_context():
        try:
            # Create all tables
            db.create_all()
            logger.info("Database tables created successfully")
            
            # Create default admin user if it doesn't exist
            from models import User
            admin_user = User.query.filter_by(username='admin').first()
            if not admin_user:
                admin_user = User(
                    username='admin',
                    email='admin@cybersecurity.local',
                    role='admin'
                )
                admin_user.set_password('admin123')  # Change in production
                db.session.add(admin_user)
                db.session.commit()
                logger.info("Default admin user created")
            
        except Exception as e:
            logger.error(f"Database initialization failed: {str(e)}")
            raise

def get_db_session():
    """Get database session"""
    return db.session

def close_db_session():
    """Close database session"""
    db.session.close()

def rollback_db_session():
    """Rollback database session"""
    db.session.rollback()



