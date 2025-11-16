from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates
from config import db, bcrypt

class User(db.Model, SerializerMixin):
    __tablename__ = "users"

    # Prevent circular serialization
    serialize_rules = ('-user_problems.user',)

    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String, nullable=False, unique=True)
    user_name = db.Column(db.String, nullable=False)
    picture = db.Column(db.String)  # Profile picture URL
    password_hash = db.Column(db.String)  # For email/password users (hashed)
    oauth_provider = db.Column(db.String)  # e.g., 'google', 'github' (optional for email users)
    oauth_id = db.Column(db.String, unique=True)  # Provider-specific user ID (optional)
    is_admin = db.Column(db.Boolean, default=False)

    # Relationship to UserProblem association object
    user_problems = db.relationship('UserProblem', back_populates='user', cascade='all, delete-orphan')

    @validates("email")
    def validate_email(self, key, email):
        email = email.strip()
        if "@" not in email or "." not in email:
            raise ValueError("Please provide a valid email")
        return email

    def set_password(self, password):
        """Hash and set the user's password"""
        self.password_hash = bcrypt.generate_password_hash(password).decode('utf-8')

    def check_password(self, password):
        """Check if the provided password matches the hash"""
        if not self.password_hash:
            return False
        return bcrypt.check_password_hash(self.password_hash, password)

    def __repr__(self):
        return f"<User id={self.id} email={self.email} provider={self.oauth_provider}>"
