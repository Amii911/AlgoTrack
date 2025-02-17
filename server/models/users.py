from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db

# Association table for many-to-many relationship with problems
from models.user_problem import user_problems

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, unique=True)
    user_name = db.Column(db.String, nullable=False)
    picture = db.Column(db.String)  # Profile picture URL
    oauth_provider = db.Column(db.String, nullable=False)  # e.g., 'google', 'github'
    oauth_id = db.Column(db.String, nullable=False, unique=True)  # Provider-specific user ID
    is_admin = db.Column(db.Boolean, default=False)

    # Many-to-Many relationship with problems
    problems = db.relationship('Problem', secondary=user_problems, back_populates='users')

    @validates("email")
    def validate_email(self, key, email):
        email = email.strip()
        if "@" not in email or "." not in email:
            raise ValueError("Please provide a valid email")
        return email

    def __repr__(self):
        return f"<User id={self.id} email={self.email} provider={self.oauth_provider}>"
