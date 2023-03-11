from datetime import datetime

import sqlalchemy as sa

from database import Base


class User(Base):
    __tablename__: str = 'users'

    id: int = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    username: str = sa.Column(sa.String, unique=True)
    hashed_password: str = sa.Column(sa.String)
    created_at: datetime = sa.Column(sa.DateTime, default=datetime.utcnow)

