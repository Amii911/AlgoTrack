from sqlalchemy_serializer import SerializerMixin
from config import db
from sqlalchemy import ForeignKey, Table, Column, Integer, String, ForeignKeyConstraint

#Many to Many relationship between User and Problem
user_problems = db.Table(
    'user_problems',
    db.Column('user_id', db.Integer, db.ForeignKey('users.id'), primary_key=True),
    db.Column('problem_id', db.Integer, db.ForeignKey('problems.id'), primary_key=True)
)
