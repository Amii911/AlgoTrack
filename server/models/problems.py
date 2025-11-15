from sqlalchemy_serializer import SerializerMixin
from config import db

class Problem(db.Model, SerializerMixin):
    __tablename__ = "problems"

    # Prevent circular serialization
    serialize_rules = ('-user_problems.problem',)

    id = db.Column(db.Integer, primary_key=True)
    problem_name = db.Column(db.String, nullable=False)
    problem_link = db.Column(db.String, nullable=False)  # Problem URL
    difficulty = db.Column(db.String, nullable=False)  # Easy, Medium, Hard
    category = db.Column(db.String, nullable=False)  # Algorithms, Graphs, etc.

    # Relationship to UserProblem association object
    user_problems = db.relationship('UserProblem', back_populates='problem', cascade='all, delete-orphan')

    def __repr__(self):
        return f"<Problem id={self.id} name={self.problem_name} difficulty={self.difficulty} link={self.problem_link}>"
