"""Authentication and Authorization utilities for the Flask API"""
from functools import wraps
from flask import session, jsonify
from models.models import User

def login_required(f):
    """Decorator to require authentication for a route"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401
        return f(*args, **kwargs)
    return decorated_function

def get_current_user():
    """Get the currently authenticated user from session"""
    user_id = session.get('user_id')
    if not user_id:
        return None
    return User.query.get(user_id)

def require_user_ownership(user_id_param='user_id'):
    """
    Decorator to ensure the authenticated user owns the resource

    Args:
        user_id_param: The name of the URL parameter containing the user_id
    """
    def decorator(f):
        @wraps(f)
        def decorated_function(*args, **kwargs):
            # Check if user is authenticated
            if 'user_id' not in session:
                return jsonify({'error': 'Authentication required'}), 401

            # Get the user_id from URL parameters
            resource_user_id = kwargs.get(user_id_param)
            session_user_id = session.get('user_id')

            # Check if the authenticated user owns this resource
            if resource_user_id != session_user_id:
                return jsonify({'error': 'Forbidden: You can only access your own resources'}), 403

            return f(*args, **kwargs)
        return decorated_function
    return decorator

def admin_required(f):
    """Decorator to require admin privileges"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if 'user_id' not in session:
            return jsonify({'error': 'Authentication required'}), 401

        user = User.query.get(session['user_id'])
        if not user or not user.is_admin:
            return jsonify({'error': 'Admin privileges required'}), 403

        return f(*args, **kwargs)
    return decorated_function
