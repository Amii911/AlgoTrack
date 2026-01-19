from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from sqlalchemy import MetaData
from flask_migrate import Migrate
from flask_bcrypt import Bcrypt
from flask_restful import Api
from flask_cors import CORS
from dotenv import load_dotenv
from pathlib import Path
import os

# Load environment variables from project root .env file
# This ensures .env is found whether running from server/ or project root
env_path = Path(__file__).resolve().parent.parent / '.env'
load_dotenv(dotenv_path=env_path)

# Validate required environment variables
required_env_vars = ['FLASK_SECRET_KEY', 'DATABASE_URI']
for var in required_env_vars:
    if not os.getenv(var):
        raise ValueError(f"Required environment variable '{var}' is not set. Please check your .env file.")

# Get environment configuration
ENV = os.getenv('FLASK_ENV', 'development')
IS_PRODUCTION = ENV == 'production'

# SQLAlchemy naming convention for migrations
naming_convention = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}

metadata = MetaData(naming_convention=naming_convention)

# Initialize Flask app
app = Flask(__name__)

# Basic configuration
app.secret_key = os.getenv("FLASK_SECRET_KEY")
app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv("DATABASE_URI")
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

# Request size limits (prevent DoS attacks)
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16 MB max request size

# Session security configuration
app.config["SESSION_COOKIE_SECURE"] = IS_PRODUCTION  # Only send cookie over HTTPS in production
app.config["SESSION_COOKIE_HTTPONLY"] = True  # Prevent JavaScript access to session cookie
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"  # CSRF protection
app.config["PERMANENT_SESSION_LIFETIME"] = 3600  # Session expires after 1 hour

# Environment-based debug mode - default to production (safe)
app.config["DEBUG"] = ENV == 'development'  # Only enable debug in development

# Initialize extensions
db = SQLAlchemy(app=app, metadata=metadata)

migrate = Migrate(app=app, db=db)

bcrypt = Bcrypt(app=app)

api = Api(app=app)

# CORS configuration - restrict to specific origins
allowed_origins_str = os.getenv('ALLOWED_ORIGINS', 'http://localhost:3000,http://localhost:5173')
allowed_origins = [origin.strip() for origin in allowed_origins_str.split(',') if origin.strip()]

# Validate that origins are valid URLs
valid_origins = []
for origin in allowed_origins:
    # Basic URL validation
    if origin.startswith('http://') or origin.startswith('https://'):
        valid_origins.append(origin)
    else:
        print(f"Warning: Invalid CORS origin '{origin}' ignored. Must start with http:// or https://")

if not valid_origins:
    print("Warning: No valid CORS origins configured. Using default localhost origins.")
    valid_origins = ['http://localhost:3000', 'http://localhost:5173']

CORS(app,
     origins=valid_origins,
     supports_credentials=True,
     methods=['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
     allow_headers=['Content-Type', 'Authorization']
)
