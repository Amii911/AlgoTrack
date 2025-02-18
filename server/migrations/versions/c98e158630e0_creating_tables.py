"""creating tables

Revision ID: c98e158630e0
Revises: a0fe7d199c56
Create Date: 2025-02-17 14:35:25.344243

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c98e158630e0'
down_revision = 'a0fe7d199c56'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('problems',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('problem_name', sa.String(), nullable=False),
    sa.Column('problem_link', sa.String(), nullable=False),
    sa.Column('difficulty', sa.String(), nullable=False),
    sa.Column('category', sa.String(), nullable=False),
    sa.Column('date_attempted', sa.String(), nullable=False),
    sa.Column('status', sa.String(), nullable=False),
    sa.Column('notes', sa.Text(), nullable=True),
    sa.Column('num_attempts', sa.Integer(), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_problems'))
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), nullable=False),
    sa.Column('email', sa.String(), nullable=False),
    sa.Column('user_name', sa.String(), nullable=False),
    sa.Column('picture', sa.String(), nullable=True),
    sa.Column('oauth_provider', sa.String(), nullable=False),
    sa.Column('oauth_id', sa.String(), nullable=False),
    sa.Column('is_admin', sa.Boolean(), nullable=True),
    sa.PrimaryKeyConstraint('id', name=op.f('pk_users')),
    sa.UniqueConstraint('email', name=op.f('uq_users_email')),
    sa.UniqueConstraint('oauth_id', name=op.f('uq_users_oauth_id'))
    )
    op.create_table('user_problems',
    sa.Column('user_id', sa.Integer(), nullable=False),
    sa.Column('problem_id', sa.Integer(), nullable=False),
    sa.ForeignKeyConstraint(['problem_id'], ['problems.id'], name=op.f('fk_user_problems_problem_id_problems')),
    sa.ForeignKeyConstraint(['user_id'], ['users.id'], name=op.f('fk_user_problems_user_id_users')),
    sa.PrimaryKeyConstraint('user_id', 'problem_id', name=op.f('pk_user_problems'))
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('user_problems')
    op.drop_table('users')
    op.drop_table('problems')
    # ### end Alembic commands ###
