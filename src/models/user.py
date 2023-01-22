import sqlalchemy as sa
from datetime import datetime

from database import Base


class User(Base):
    __tablename__: str = 'users'

    id: int = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    name: str = sa.Column(sa.String)
    email: str = sa.Column(sa.String, unique=True)
    hashed_password: str = sa.Column(sa.String)
    created_at: datetime = sa.Column(sa.DateTime, default=datetime.utcnow)

