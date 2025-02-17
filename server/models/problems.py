from sqlalchemy_serializer import SerializerMixin
from config import db

# Association table for many-to-many relationship with users
from models.user_problem import user_problems

class Problem(db.Model, SerializerMixin):
    __tablename__ = "problems"

    id = db.Column(db.Integer, primary_key=True)
    problem_name = db.Column(db.String, nullable=False)
    difficulty = db.Column(db.String, nullable=False)  # Easy, Medium, Hard
    category = db.Column(db.String, nullable=False)  # Algorithms, Graphs, etc.
    date_attempted = db.Column(db.String, nullable=False)
    status = db.Column(db.String, nullable=False)  # Completed, Attempted, Skipped
    notes = db.Column(db.Text)
    num_attempts = db.Column(db.Integer, default=1)

    # Many-to-Many relationship with users
    users = db.relationship('User', secondary=user_problems, back_populates='problems')

    def __repr__(self):
        return f"<Problem id={self.id} name={self.problem_name} difficulty={self.difficulty}>"
