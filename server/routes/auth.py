import os
from config import app, db
from flask import session, jsonify, redirect, url_for, request
from authlib.integrations.flask_client import OAuth
from models.models import User
from sqlalchemy.exc import IntegrityError
import requests
import re

oauth = OAuth(app)

# Set OAuth details from environment variables
GOOGLE_CLIENT_ID = os.environ.get('GOOGLE_CLIENT_ID')
GOOGLE_CLIENT_SECRET = os.environ.get('GOOGLE_CLIENT_SECRET')
CONF_URL = 'https://accounts.google.com/.well-known/openid-configuration'

# Register the OAuth client (Google in this case)
oauth.register(
    name='google',
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url=CONF_URL,
    client_kwargs={'scope': 'openid profile email'}
)

# Password validation helper
def validate_password_strength(password):
    """
    Validate password strength
    Returns: (is_valid, error_message)
    """
    if len(password) < 8:
        return False, 'Password must be at least 8 characters long'

    if len(password) > 128:
        return False, 'Password cannot exceed 128 characters'

    # Check for at least one uppercase letter
    if not re.search(r'[A-Z]', password):
        return False, 'Password must contain at least one uppercase letter'

    # Check for at least one lowercase letter
    if not re.search(r'[a-z]', password):
        return False, 'Password must contain at least one lowercase letter'

    # Check for at least one digit
    if not re.search(r'\d', password):
        return False, 'Password must contain at least one number'

    # Check for at least one special character
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        return False, 'Password must contain at least one special character (!@#$%^&*(),.?":{}|<>)'

    # Check for common weak passwords
    common_passwords = ['Password123!', 'Welcome123!', 'Qwerty123!', 'Admin123!']
    if password in common_passwords:
        return False, 'This password is too common. Please choose a stronger password'

    return True, None

# This route checks if the user is authenticated
@app.route('/api/authorized')
def check_auth():
    if session.get('email'):
        user = User.query.filter_by(email=session.get('email')).first()
        if not user:
            return jsonify({"error": "unauthorized"}), 401
        return jsonify({
            'id': user.id,
            'email': user.email,
            'user_name': user.user_name,
            'picture': user.picture,
            'is_admin': user.is_admin
        }), 200
    else:
        return jsonify({"error": "unauthorized"}), 401

# Redirects user to Google for OAuth login
@app.route('/google/')
def google():
    redirect_uri = url_for('google_auth', _external=True)
    session['nonce'] = os.urandom(16).hex()  # Random nonce for security
    return oauth.google.authorize_redirect(redirect_uri, nonce=session['nonce'])

# Callback route after Google authentication
@app.route('/google/auth')
def google_auth():
    token = oauth.google.authorize_access_token()
    user_info = oauth.google.parse_id_token(token, nonce=session['nonce'])

    # Validate nonce to prevent replay attacks
    if user_info.get('nonce') != session['nonce']:
        return jsonify({'error': 'Invalid nonce'}), 400

    # Get user info from Google
    email = user_info['email']
    picture = user_info.get('picture')
    user_name = user_info.get('name', email.split('@')[0])  # Use name from Google or email prefix as fallback
    oauth_id = user_info['sub']  # Google's unique user ID

    session['email'] = email
    session['picture'] = picture

    # Store the access token for potential revocation
    if token and 'access_token' in token:
        session['access_token'] = token['access_token']

    # Check if the user exists in the database
    db_user = User.query.filter_by(email=email).first()

    if not db_user:
        # If user doesn't exist, create a new one
        db_user = User(
            email=email,
            user_name=user_name,
            picture=picture,
            oauth_provider='google',
            oauth_id=oauth_id
        )
        db.session.add(db_user)
        try:
            db.session.commit()
        except IntegrityError:
            # Race condition: another request created the user
            db.session.rollback()
            # Fetch the user created by the other request
            db_user = User.query.filter_by(email=email).first()
            if not db_user:
                # This should never happen, but handle it gracefully
                return jsonify({'error': 'Failed to create or retrieve user'}), 500

    # Set user session
    session['user_id'] = db_user.id

    # Success message and close the OAuth window (front-end will handle)
    return '''<html>Success!<script type="text/javascript">
                window.onload = function() {
                    window.opener.postMessage({url: window.location.href}, '*');
                    window.close();
                }
              </script></html>'''

# Log out and clear the session
@app.route('/clear')
def clear():
    session.clear()
    return redirect('/')

# Revoke the OAuth token (useful for logout and resetting state)
@app.route('/revoke')
def revoke():
    access_token = session.get('access_token')
    if not access_token:
        return redirect('/clear')

    # Send revoke request to Google OAuth API
    revoke_response = requests.post(
        'https://oauth2.googleapis.com/revoke',
        params={'token': access_token},
        headers={'content-type': 'application/x-www-form-urlencoded'}
    )

    if revoke_response.status_code == 200:
        session.clear()
        return redirect('/')
    else:
        session.clear()
        return jsonify({'error': 'Failed to revoke token, but session cleared'}), 200


# Email/Password Authentication Routes

@app.route('/api/register', methods=['POST'])
def register():
    """Register a new user with email and password"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('email') or not data.get('password') or not data.get('user_name'):
            return jsonify({'error': 'Email, password, and user_name are required'}), 400

        email = data['email'].strip().lower()
        password = data['password']
        user_name = data['user_name'].strip()

        # Validate email format
        email_regex = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        if not re.match(email_regex, email):
            return jsonify({'error': 'Invalid email format'}), 400

        # Validate password strength
        is_valid, error_message = validate_password_strength(password)
        if not is_valid:
            return jsonify({'error': error_message}), 400

        # Check if user already exists
        existing_user = User.query.filter_by(email=email).first()
        if existing_user:
            return jsonify({'error': 'User with this email already exists'}), 400

        # Create new user
        new_user = User(
            email=email,
            user_name=user_name,
            picture=data.get('picture', '')
        )
        new_user.set_password(password)

        db.session.add(new_user)
        try:
            db.session.commit()
        except IntegrityError:
            # Race condition: another request created the user
            db.session.rollback()
            return jsonify({'error': 'User with this email already exists'}), 400

        # Log the user in
        session['user_id'] = new_user.id
        session['email'] = new_user.email

        return jsonify({
            'message': 'User registered successfully',
            'user': {
                'id': new_user.id,
                'email': new_user.email,
                'user_name': new_user.user_name,
                'picture': new_user.picture
            }
        }), 201

    except Exception as e:
        db.session.rollback()
        return jsonify({'error': str(e)}), 500


@app.route('/api/login', methods=['POST'])
def login():
    """Login with email and password"""
    try:
        data = request.get_json()

        # Validate required fields
        if not data.get('email') or not data.get('password'):
            return jsonify({'error': 'Email and password are required'}), 400

        email = data['email'].strip().lower()
        password = data['password']

        # Find user by email
        user = User.query.filter_by(email=email).first()

        # Check if user exists and password is correct
        if not user or not user.check_password(password):
            return jsonify({'error': 'Invalid email or password'}), 401

        # Log the user in
        session['user_id'] = user.id
        session['email'] = user.email
        session['picture'] = user.picture

        return jsonify({
            'message': 'Login successful',
            'user': {
                'id': user.id,
                'email': user.email,
                'user_name': user.user_name,
                'picture': user.picture
            }
        }), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/api/logout', methods=['POST'])
def logout():
    """Logout the current user"""
    session.clear()
    return jsonify({'message': 'Logout successful'}), 200
