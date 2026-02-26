from functools import wraps
from flask import jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
try:
    from backend.database.models import User
except ImportError:
    from database.models import User

def roles_required(*roles):
    """Decorator to require one of the given roles."""
    def decorator(fn):
        @wraps(fn)
        @jwt_required()
        def wrapper(*args, **kwargs):
            user_id = get_jwt_identity()
            user = User.query.get(user_id)
            if not user or not user.is_active:
                return jsonify({'error': 'Unauthorized'}), 401
            if user.role not in roles:
                return jsonify({'error': 'Forbidden', 'required_roles': roles}), 403
            return fn(*args, **kwargs)
        return wrapper
    return decorator


def tenant_required(fn):
    """Decorator to require a tenant context via header X-Tenant-ID."""
    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        from flask import request
        tenant_id = request.headers.get('X-Tenant-ID')
        if not tenant_id:
            return jsonify({'error': 'Tenant required', 'missing': 'X-Tenant-ID'}), 400
        # Optionally, validate tenant ownership from user
        user_id = get_jwt_identity()
        user = User.query.get(user_id)
        if not user or not user.is_active:
            return jsonify({'error': 'Unauthorized'}), 401
        # Simple policy: allow if header present. Extend with user-tenant mapping.
        return fn(*args, **kwargs)
    return wrapper


