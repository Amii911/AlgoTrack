import os
from config import app, db
from flask import session, jsonify, redirect, url_for
from authlib.integrations.flask_client import OAuth
from models.models import User
import requests

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

# This route checks if the user is authenticated
@app.route('/api/authorized')
def check_auth():
    if session.get('email'):
        user = User.query.filter_by(email=session.get('email')).first()
        return jsonify({
            'id': user.id,
            'email': user.email,
            'picture': user.picture
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
        return 'Invalid nonce', 400

    # Get user info from Google
    email = user_info['email']
    picture = user_info.get('picture')
    user_name = user_info.get('name', email.split('@')[0])  # Use name from Google or email prefix as fallback
    oauth_id = user_info['sub']  # Google's unique user ID

    session['email'] = email
    session['picture'] = picture

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
        db.session.commit()
        session['user_id'] = db_user.id
    else:
        # User already exists, set user session
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
    token = session.get('token')
    if not token:
        return redirect('/clear')

    # Send revoke request to Google OAuth API
    revoke_response = requests.post(
        'https://oauth2.googleapis.com/revoke',
        params={'token': token},
        headers={'content-type': 'application/x-www-form-urlencoded'}
    )

    if revoke_response.status_code == 200:
        session.clear()
        return redirect('/')
    else:
        return 'An error occurred while revoking token', 400
