from flask import request, make_response
from flask_restful import Resource
from models.models import Problem  # Import your Problem model
from config import api, db

# Resource for getting all problems or adding a new problem
class Problems(Resource):
    def get(self):
        problems = [problem.to_dict() for problem in Problem.query.all()]
        return make_response(problems, 200)

    def post(self):
        try:
            request_json = request.get_json()

            # Validate required fields
            required_fields = ['problem_name', 'problem_link', 'difficulty', 'category', 'date_attempted', 'status']
            for field in required_fields:
                if not request_json.get(field):
                    return make_response({'error': f'Missing required field: {field}'}, 400)

            # Extract fields from the incoming request data
            problem_name = request_json.get('problem_name')
            problem_link = request_json.get('problem_link')
            difficulty = request_json.get('difficulty')
            category = request_json.get('category')
            date_attempted = request_json.get('date_attempted')
            status = request_json.get('status')
            notes = request_json.get('notes')
            num_attempts = request_json.get('num_attempts', 1)

            # Create new problem instance
            problem = Problem(
                problem_name = problem_name,
                problem_link = problem_link,
                difficulty = difficulty,
                category = category,
                date_attempted = date_attempted,
                status = status,
                notes = notes,
                num_attempts = num_attempts
            )

            # Add to database
            db.session.add(problem)
            db.session.commit()

            return make_response(problem.to_dict(), 201)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 500)

api.add_resource(Problems, '/api/problems')


# Resource for getting, deleting, and updating an individual problem
class ProblemResource(Resource):
    def get(self, id):
        problem = Problem.query.filter_by(id=id).first()
        if not problem:
            return make_response({'message': 'Problem not found'}, 404)
        return make_response(problem.to_dict(), 200)
    
    def delete(self, id):
        try:
            problem = Problem.query.get(id)
            if not problem:
                return make_response({'message': 'Problem not found'}, 404)

            db.session.delete(problem)
            db.session.commit()

            return make_response({'message': 'Problem deleted successfully'}, 204)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 500)
    
    def patch(self, id):
        try:
            problem = Problem.query.filter_by(id=id).first()
            if not problem:
                return make_response({'message': 'Problem not found'}, 404)

            request_json = request.get_json()

            # Define allowed fields for update
            allowed_fields = ['problem_name', 'problem_link', 'difficulty', 'category', 'date_attempted', 'status', 'notes', 'num_attempts']

            # Update the problem with new values from the request
            for key in request_json:
                if key in allowed_fields:
                    setattr(problem, key, request_json[key])

            db.session.add(problem)
            db.session.commit()

            return make_response(problem.to_dict(), 200)
        except Exception as e:
            db.session.rollback()
            return make_response({'error': str(e)}, 500)

api.add_resource(ProblemResource, '/api/problems/<int:id>')
