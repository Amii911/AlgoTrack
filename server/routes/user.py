from flask import request, make_response
from flask_restful import Resource
from models.models import User  # Import your User model
from config import api, db

# Resource for getting all users or adding a new user
class Users(Resource):
    def get(self):
        users = [user.to_dict() for user in User.query.all()]
        return make_response(users, 200)

    def post(self):
        request_json = request.get_json()

        # Extract fields from the incoming request data
        email = request_json.get('email')
        user_name = request_json.get('user_name')
        picture = request_json.get('picture', '')
        oauth_provider = request_json.get('oauth_provider')
        oauth_id = request_json.get('oauth_id')
        is_admin = request_json.get('is_admin', False)  # Default to False if not provided

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

api.add_resource(Users, '/api/users')


# Resource for getting, deleting, and updating an individual user
class UserResource(Resource):
    def get(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({'message': 'User not found'}, 404)
        return make_response(user.to_dict(), 200)
    
    def delete(self, id):
        user = User.query.get(id)
        if not user:
            return make_response({'message': 'User not found'}, 404)

        db.session.delete(user)
        db.session.commit()

        return make_response({'message': 'User deleted successfully'}, 204)
    
    def patch(self, id):
        user = User.query.filter_by(id=id).first()
        if not user:
            return make_response({'message': 'User not found'}, 404)

        request_json = request.get_json()

        # Update the user with new values from the request
        for key in request_json:
            setattr(user, key, request_json[key])
        
        db.session.add(user)
        db.session.commit()

        return make_response(user.to_dict(), 200)

api.add_resource(UserResource, '/api/users/<int:id>')
