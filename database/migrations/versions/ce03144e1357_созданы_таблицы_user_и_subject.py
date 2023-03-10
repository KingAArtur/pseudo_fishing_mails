"""созданы таблицы User и Subject

Revision ID: ce03144e1357
Revises: 
Create Date: 2023-01-22 17:59:54.503483

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'ce03144e1357'
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('subjects',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('last_name', sa.String(), nullable=True),
    sa.Column('first_name', sa.String(), nullable=True),
    sa.Column('patronymic', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    op.create_table('users',
    sa.Column('id', sa.Integer(), autoincrement=True, nullable=False),
    sa.Column('name', sa.String(), nullable=True),
    sa.Column('email', sa.String(), nullable=True),
    sa.Column('hashed_password', sa.String(), nullable=True),
    sa.Column('created_at', sa.DateTime(), nullable=True),
    sa.PrimaryKeyConstraint('id'),
    sa.UniqueConstraint('email')
    )
    # ### end Alembic commands ###


def downgrade() -> None:
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('users')
    op.drop_table('subjects')
    # ### end Alembic commands ###
