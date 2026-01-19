from flask import request, make_response
from flask_restful import Resource
from models.models import Problem  # Import your Problem model
from config import api, db
from auth_utils import admin_required, login_required

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

# Resource for getting all problems or adding a new problem
@require_auth_for_method({'get': login_required, 'post': admin_required})
class Problems(Resource):
    def get(self):
        # Pagination support
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 50, type=int)

        # Limit per_page to prevent abuse
        per_page = min(per_page, 100)

        # Optional filtering by difficulty or category
        difficulty = request.args.get('difficulty')
        category = request.args.get('category')

        query = Problem.query

        if difficulty:
            query = query.filter_by(difficulty=difficulty)
        if category:
            query = query.filter_by(category=category)

        problems_query = query.paginate(page=page, per_page=per_page, error_out=False)
        problems = [problem.to_dict() for problem in problems_query.items]

        return make_response({
            'problems': problems,
            'page': page,
            'per_page': per_page,
            'total': problems_query.total,
            'pages': problems_query.pages
        }, 200)

    def post(self):
        try:
            request_json = request.get_json()

            # Validate required fields for problem catalog
            required_fields = ['problem_name', 'problem_link', 'difficulty', 'category']
            for field in required_fields:
                if not request_json.get(field):
                    return make_response({'error': f'Missing required field: {field}'}, 400)

            # Extract fields from the incoming request data
            problem_name = request_json.get('problem_name')
            problem_link = request_json.get('problem_link')
            difficulty = request_json.get('difficulty')
            category = request_json.get('category')

            # Create new problem instance (catalog entry only)
            problem = Problem(
                problem_name = problem_name,
                problem_link = problem_link,
                difficulty = difficulty,
                category = category
            )

            # Add to database
            db.session.add(problem)
            db.session.commit()

            return make_response(problem.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            # Don't expose internal error details
            return make_response({'error': 'Failed to create problem'}, 500)

api.add_resource(Problems, '/api/problems')


# Resource for getting, deleting, and updating an individual problem
@require_auth_for_method({'get': login_required, 'delete': admin_required, 'patch': admin_required})
class ProblemResource(Resource):
    def get(self, id):
        problem = Problem.query.filter_by(id=id).first()
        if not problem:
            return make_response({'error': 'Problem not found'}, 404)
        return make_response(problem.to_dict(), 200)

    def delete(self, id):
        try:
            problem = Problem.query.get(id)
            if not problem:
                return make_response({'error': 'Problem not found'}, 404)

            db.session.delete(problem)
            db.session.commit()

            return make_response({'message': 'Problem deleted successfully'}, 200)
        except Exception as e:
            db.session.rollback()
            # Don't expose internal error details
            return make_response({'error': 'Failed to delete problem'}, 500)

    def patch(self, id):
        try:
            problem = Problem.query.filter_by(id=id).first()
            if not problem:
                return make_response({'error': 'Problem not found'}, 404)

            request_json = request.get_json()

            # Define allowed fields for update (catalog fields only)
            allowed_fields = ['problem_name', 'problem_link', 'difficulty', 'category']

            # Update the problem with new values from the request
            for key in request_json:
                if key in allowed_fields:
                    setattr(problem, key, request_json[key])

            db.session.commit()

            return make_response(problem.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            # Don't expose internal error details
            return make_response({'error': 'Failed to update problem'}, 500)

api.add_resource(ProblemResource, '/api/problems/<int:id>')
