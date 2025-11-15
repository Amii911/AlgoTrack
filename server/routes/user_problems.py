from flask import request, make_response
from flask_restful import Resource
from models.models import UserProblem, User, Problem
from config import api, db

# Resource for getting all user-problem attempts or adding a new attempt
class UserProblems(Resource):
    def get(self):
        """Get all user-problem attempts"""
        user_problems = [up.to_dict() for up in UserProblem.query.all()]
        return make_response(user_problems, 200)

    def post(self):
        """Create a new user-problem attempt"""
        try:
            request_json = request.get_json()

            # Validate required fields
            required_fields = ['user_id', 'problem_id', 'date_attempted', 'status']
            for field in required_fields:
                if not request_json.get(field):
                    return make_response({'error': f'Missing required field: {field}'}, 400)

            # Check if user and problem exist
            user = User.query.get(request_json['user_id'])
            if not user:
                return make_response({'error': 'User not found'}, 404)

            problem = Problem.query.get(request_json['problem_id'])
            if not problem:
                return make_response({'error': 'Problem not found'}, 404)

            # Check if user-problem combination already exists
            existing = UserProblem.query.filter_by(
                user_id=request_json['user_id'],
                problem_id=request_json['problem_id']
            ).first()

            if existing:
                return make_response({'error': 'User already has an attempt for this problem. Use PATCH to update.'}, 400)

            # Extract fields from the incoming request data
            user_id = request_json.get('user_id')
            problem_id = request_json.get('problem_id')
            date_attempted = request_json.get('date_attempted')
            status = request_json.get('status')
            notes = request_json.get('notes', '')
            num_attempts = request_json.get('num_attempts', 1)

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
            return make_response({'error': str(e)}, 500)

api.add_resource(UserProblems, '/api/user-problems')


# Resource for getting user's problems by user_id
class UserProblemsByUser(Resource):
    def get(self, user_id):
        """Get all problems attempted by a specific user"""
        user = User.query.get(user_id)
        if not user:
            return make_response({'error': 'User not found'}, 404)

        user_problems = [up.to_dict() for up in user.user_problems]
        return make_response(user_problems, 200)

api.add_resource(UserProblemsByUser, '/api/users/<int:user_id>/problems')


# Resource for getting, updating, and deleting a specific user-problem attempt
class UserProblemResource(Resource):
    def get(self, user_id, problem_id):
        """Get a specific user-problem attempt"""
        user_problem = UserProblem.query.filter_by(
            user_id=user_id,
            problem_id=problem_id
        ).first()

        if not user_problem:
            return make_response({'error': 'User-problem attempt not found'}, 404)

        return make_response(user_problem.to_dict(), 200)

    def patch(self, user_id, problem_id):
        """Update a specific user-problem attempt"""
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

            # Update the user-problem with new values from the request
            for key in request_json:
                if key in allowed_fields:
                    setattr(user_problem, key, request_json[key])

            db.session.commit()

            return make_response(user_problem.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 500)

    def delete(self, user_id, problem_id):
        """Delete a specific user-problem attempt"""
        try:
            user_problem = UserProblem.query.filter_by(
                user_id=user_id,
                problem_id=problem_id
            ).first()

            if not user_problem:
                return make_response({'error': 'User-problem attempt not found'}, 404)

            db.session.delete(user_problem)
            db.session.commit()

            return make_response({'message': 'User-problem attempt deleted successfully'}, 204)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 500)

api.add_resource(UserProblemResource, '/api/users/<int:user_id>/problems/<int:problem_id>')
