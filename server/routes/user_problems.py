from flask import request, make_response, session
from flask_restful import Resource
from models.models import UserProblem, User, Problem
from config import api, db
from auth_utils import admin_required, login_required, get_current_user, require_user_ownership
from datetime import datetime

def require_auth_for_method(methods_config):
    """
    Decorator to apply different auth requirements to different HTTP methods
    methods_config: dict mapping method names to decorator functions
    """
    def decorator(resource_class):
        for method_name, auth_decorator in methods_config.items():
            method = getattr(resource_class, method_name, None)
            if method:
                setattr(resource_class, method_name, auth_decorator(method))
        return resource_class
    return decorator

def validate_date_format(date_string):
    """Validate and parse ISO date format"""
    try:
        return datetime.fromisoformat(date_string.replace('Z', '+00:00'))
    except (ValueError, AttributeError):
        return None

# Resource for getting all user-problem attempts or adding a new attempt
@require_auth_for_method({'get': admin_required, 'post': login_required})
class UserProblems(Resource):
    def get(self):
        """Get all user-problem attempts (admin only)"""
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)
        per_page = min(per_page, 100)

        user_problems_query = UserProblem.query.paginate(page=page, per_page=per_page, error_out=False)
        user_problems = [up.to_dict() for up in user_problems_query.items]

        return make_response({
            'user_problems': user_problems,
            'page': page,
            'per_page': per_page,
            'total': user_problems_query.total,
            'pages': user_problems_query.pages
        }, 200)

    def post(self):
        """Create a new user-problem attempt"""
        try:
            request_json = request.get_json()
            current_user = get_current_user()

            if not current_user:
                return make_response({'error': 'Authentication required'}, 401)

            # Validate required fields
            required_fields = ['problem_id', 'date_attempted', 'status']
            for field in required_fields:
                if not request_json.get(field):
                    return make_response({'error': f'Missing required field: {field}'}, 400)

            # Use authenticated user's ID (prevent users from creating attempts for others)
            user_id = current_user.id
            problem_id = request_json.get('problem_id')
            date_attempted = request_json.get('date_attempted')
            status = request_json.get('status')
            notes = request_json.get('notes', '')
            num_attempts = request_json.get('num_attempts', 1)

            # Validate date format
            if not validate_date_format(date_attempted):
                return make_response({'error': 'Invalid date format. Use ISO 8601 format (e.g., 2024-01-15T10:30:00)'}, 400)

            # Validate status
            valid_statuses = ['Completed', 'Attempted', 'Skipped']
            if status not in valid_statuses:
                return make_response({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}, 400)

            # Validate num_attempts is positive
            if not isinstance(num_attempts, int) or num_attempts < 1:
                return make_response({'error': 'num_attempts must be a positive integer'}, 400)

            # Validate notes length (prevent abuse)
            if len(notes) > 10000:
                return make_response({'error': 'Notes cannot exceed 10,000 characters'}, 400)

            # Check if problem exists
            problem = Problem.query.get(problem_id)
            if not problem:
                return make_response({'error': 'Problem not found'}, 404)

            # Check if user-problem combination already exists
            existing = UserProblem.query.filter_by(
                user_id=user_id,
                problem_id=problem_id
            ).first()

            if existing:
                return make_response({'error': 'You already have an attempt for this problem. Use PATCH to update.'}, 400)

            # Create new user-problem attempt
            user_problem = UserProblem(
                user_id=user_id,
                problem_id=problem_id,
                date_attempted=date_attempted,
                status=status,
                notes=notes,
                num_attempts=num_attempts
            )

            # Add to database
            db.session.add(user_problem)
            db.session.commit()

            return make_response(user_problem.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            # Don't expose internal error details
            return make_response({'error': 'Failed to create user-problem attempt'}, 500)

api.add_resource(UserProblems, '/api/user-problems')


# Helper function to check user ownership
def check_user_problem_access(user_id):
    """Check if current user can access the specified user's problems"""
    current_user = get_current_user()
    if not current_user:
        return False, make_response({'error': 'Authentication required'}, 401)

    # Allow if user is admin or accessing their own resource
    if current_user.is_admin or current_user.id == user_id:
        return True, None

    return False, make_response({'error': 'Forbidden: You can only access your own problem attempts'}, 403)

# Resource for getting user's problems by user_id
@require_auth_for_method({'get': login_required})
class UserProblemsByUser(Resource):
    def get(self, user_id):
        """Get all problems attempted by a specific user"""
        allowed, error_response = check_user_problem_access(user_id)
        if not allowed:
            return error_response

        user = User.query.get(user_id)
        if not user:
            return make_response({'error': 'User not found'}, 404)

        user_problems = [up.to_dict() for up in user.user_problems]
        return make_response(user_problems, 200)

api.add_resource(UserProblemsByUser, '/api/users/<int:user_id>/problems')


# Resource for getting, updating, and deleting a specific user-problem attempt
@require_auth_for_method({'get': login_required, 'patch': login_required, 'delete': login_required})
class UserProblemResource(Resource):
    def get(self, user_id, problem_id):
        """Get a specific user-problem attempt"""
        allowed, error_response = check_user_problem_access(user_id)
        if not allowed:
            return error_response

        user_problem = UserProblem.query.filter_by(
            user_id=user_id,
            problem_id=problem_id
        ).first()

        if not user_problem:
            return make_response({'error': 'User-problem attempt not found'}, 404)

        return make_response(user_problem.to_dict(), 200)

    def patch(self, user_id, problem_id):
        """Update a specific user-problem attempt"""
        allowed, error_response = check_user_problem_access(user_id)
        if not allowed:
            return error_response

        try:
            user_problem = UserProblem.query.filter_by(
                user_id=user_id,
                problem_id=problem_id
            ).first()

            if not user_problem:
                return make_response({'error': 'User-problem attempt not found'}, 404)

            request_json = request.get_json()

            # Define allowed fields for update
            allowed_fields = ['date_attempted', 'status', 'notes', 'num_attempts']

            # Validate inputs before updating
            if 'date_attempted' in request_json:
                if not validate_date_format(request_json['date_attempted']):
                    return make_response({'error': 'Invalid date format. Use ISO 8601 format'}, 400)

            if 'status' in request_json:
                valid_statuses = ['Completed', 'Attempted', 'Skipped']
                if request_json['status'] not in valid_statuses:
                    return make_response({'error': f'Invalid status. Must be one of: {", ".join(valid_statuses)}'}, 400)

            if 'num_attempts' in request_json:
                if not isinstance(request_json['num_attempts'], int) or request_json['num_attempts'] < 1:
                    return make_response({'error': 'num_attempts must be a positive integer'}, 400)

            if 'notes' in request_json:
                if len(request_json['notes']) > 10000:
                    return make_response({'error': 'Notes cannot exceed 10,000 characters'}, 400)

            # Update the user-problem with new values from the request
            for key in request_json:
                if key in allowed_fields:
                    setattr(user_problem, key, request_json[key])

            db.session.commit()

            return make_response(user_problem.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            # Don't expose internal error details
            return make_response({'error': 'Failed to update user-problem attempt'}, 500)

    def delete(self, user_id, problem_id):
        """Delete a specific user-problem attempt"""
        allowed, error_response = check_user_problem_access(user_id)
        if not allowed:
            return error_response

        try:
            user_problem = UserProblem.query.filter_by(
                user_id=user_id,
                problem_id=problem_id
            ).first()

            if not user_problem:
                return make_response({'error': 'User-problem attempt not found'}, 404)

            db.session.delete(user_problem)
            db.session.commit()

            return make_response({'message': 'User-problem attempt deleted successfully'}, 200)
        except Exception as e:
            db.session.rollback()
            # Don't expose internal error details
            return make_response({'error': 'Failed to delete user-problem attempt'}, 500)

api.add_resource(UserProblemResource, '/api/users/<int:user_id>/problems/<int:problem_id>')
