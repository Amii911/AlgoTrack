from sqlalchemy_serializer import SerializerMixin
from config import db

# Association Object for many-to-many relationship with additional user-specific data
class UserProblem(db.Model, SerializerMixin):
    __tablename__ = 'user_problems'

    # Prevent circular serialization
    serialize_rules = ('-user.user_problems', '-problem.user_problems')

    # Composite primary key
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), primary_key=True)
    problem_id = db.Column(db.Integer, db.ForeignKey('problems.id'), primary_key=True)

    # User-specific fields for each problem attempt
    date_attempted = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False)  # Completed, Attempted, Skipped
    notes = db.Column(db.Text)
    num_attempts = db.Column(db.Integer, default=1)

    # Relationships to User and Problem
    user = db.relationship('User', back_populates='user_problems')
    problem = db.relationship('Problem', back_populates='user_problems')

    def __repr__(self):
        return f"<UserProblem user_id={self.user_id} problem_id={self.problem_id} status={self.status}>"
