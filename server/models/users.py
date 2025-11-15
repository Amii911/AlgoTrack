from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    # Prevent circular serialization
    serialize_rules = ('-user_problems.user',)

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, unique=True)
    user_name = db.Column(db.String, nullable=False)
    picture = db.Column(db.String)  # Profile picture URL
    oauth_provider = db.Column(db.String, nullable=False)  # e.g., 'google', 'github'
    oauth_id = db.Column(db.String, nullable=False, unique=True)  # Provider-specific user ID
    is_admin = db.Column(db.Boolean, default=False)

    # Relationship to UserProblem association object
    user_problems = db.relationship('UserProblem', back_populates='user', cascade='all, delete-orphan')

    @validates("email")
    def validate_email(self, key, email):
        email = email.strip()
        if "@" not in email or "." not in email:
            raise ValueError("Please provide a valid email")
        return email

    def __repr__(self):
        return f"<User id={self.id} email={self.email} provider={self.oauth_provider}>"
