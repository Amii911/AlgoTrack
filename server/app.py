from config import app
from routes.routes import *
from models.models import *

if __name__ == "__main__":
    # Debug mode is configured in config.py based on FLASK_ENV
    # In development: debug=True
    # In production: debug=False
    app.run(port=5555, debug=app.config['DEBUG'])

