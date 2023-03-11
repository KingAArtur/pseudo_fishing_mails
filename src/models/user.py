import sqlalchemy as sa
from datetime import datetime

from database import Base


class User(Base):
    __tablename__: str = 'users'

    id: int = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    username: str = sa.Column(sa.String)
    hashed_password: str = sa.Column(sa.String)
    created_at: datetime = sa.Column(sa.DateTime, default=datetime.utcnow)

