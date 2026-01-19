from flask import request, make_response, session
from flask_restful import Resource
from models.models import User  # Import your User model
from config import api, db
from auth_utils import admin_required, login_required, get_current_user
from functools import wraps

def require_auth_for_method(methods_config):
    """
    Decorator to apply different auth requirements to different HTTP methods
    methods_config: dict mapping method names to decorator functions
    """
    def decorator(resource_class):
        original_methods = {}
        for method_name, auth_decorator in methods_config.items():
            method = getattr(resource_class, method_name, None)
            if method:
                original_methods[method_name] = method
                setattr(resource_class, method_name, auth_decorator(method))
        return resource_class
    return decorator

# Resource for getting all users or adding a new user
@require_auth_for_method({'get': admin_required, 'post': admin_required})
class Users(Resource):
    def get(self):
        # Pagination support
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)

        # Limit per_page to prevent abuse
        per_page = min(per_page, 100)

        users_query = User.query.paginate(page=page, per_page=per_page, error_out=False)
        users = [user.to_dict() for user in users_query.items]

        return make_response({
            'users': users,
            'page': page,
            'per_page': per_page,
            'total': users_query.total,
            'pages': users_query.pages
        }, 200)

    def post(self):
        try:
            request_json = request.get_json()

            # Validate required fields
            required_fields = ['email', 'user_name', 'oauth_provider', 'oauth_id']
            for field in required_fields:
                if not request_json.get(field):
                    return make_response({'error': f'Missing required field: {field}'}, 400)

            # Extract fields from the incoming request data
            email = request_json.get('email')
            user_name = request_json.get('user_name')
            picture = request_json.get('picture', '')
            oauth_provider = request_json.get('oauth_provider')
            oauth_id = request_json.get('oauth_id')
            is_admin = request_json.get('is_admin', False)  # Default to False if not provided

            # Check if user already exists
            existing_user = User.query.filter_by(email=email).first()
            if existing_user:
                return make_response({'error': 'User with this email already exists'}, 400)

            # Create a new user instance
            user = User(
                email=email,
                user_name=user_name,
                picture=picture,
                oauth_provider=oauth_provider,
                oauth_id=oauth_id,
                is_admin=is_admin
            )

            # Add the user to the database
            db.session.add(user)
            db.session.commit()

            return make_response(user.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            # Don't expose internal error details
            return make_response({'error': 'Failed to create user'}, 500)

api.add_resource(Users, '/api/users')


# Helper function to check ownership or admin
def check_user_access(user_id):
    """Check if current user can access the specified user resource"""
    current_user = get_current_user()
    if not current_user:
        return False, make_response({'error': 'Authentication required'}, 401)

    # Allow if user is admin or accessing their own resource
    if current_user.is_admin or current_user.id == user_id:
        return True, None

    return False, make_response({'error': 'Forbidden: You can only access your own resources'}, 403)

# Resource for getting, deleting, and updating an individual user
@require_auth_for_method({'get': login_required, 'delete': login_required, 'patch': login_required})
class UserResource(Resource):
    def get(self, id):
        allowed, error_response = check_user_access(id)
        if not allowed:
            return error_response

        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({'error': 'User not found'}, 404)
        return make_response(user.to_dict(), 200)

    def delete(self, id):
        allowed, error_response = check_user_access(id)
        if not allowed:
            return error_response

        try:
            user = User.query.get(id)
            if not user:
                return make_response({'error': 'User not found'}, 404)

            db.session.delete(user)
            db.session.commit()

            return make_response({'message': 'User deleted successfully'}, 200)
        except Exception as e:
            db.session.rollback()
            # Don't expose internal error details
            return make_response({'error': 'Failed to delete user'}, 500)

    def patch(self, id):
        allowed, error_response = check_user_access(id)
        if not allowed:
            return error_response

        try:
            user = User.query.filter_by(id=id).first()
            if not user:
                return make_response({'error': 'User not found'}, 404)

            request_json = request.get_json()
            current_user = get_current_user()

            # Define allowed fields for update (non-admin users cannot change is_admin)
            if current_user.is_admin:
                allowed_fields = ['email', 'user_name', 'picture', 'is_admin']
            else:
                allowed_fields = ['user_name', 'picture']

            # Update the user with new values from the request
            for key in request_json:
                if key in allowed_fields:
                    setattr(user, key, request_json[key])

            db.session.commit()

            return make_response(user.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            # Don't expose internal error details
            return make_response({'error': 'Failed to update user'}, 500)

api.add_resource(UserResource, '/api/users/<int:id>')
