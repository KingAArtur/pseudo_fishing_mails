from datetime import datetime
import sqlalchemy as sa
from sqlalchemy.orm import relationship

from database import Base


class Subject(Base):
    __tablename__: str = 'subjects'

    id = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    email = sa.Column(sa.String, unique=True)
    last_name = sa.Column(sa.String)
    first_name = sa.Column(sa.String)
    patronymic = sa.Column(sa.String)
    created_at = sa.Column(sa.DateTime, default=datetime.utcnow)

    letters_to_send = relationship('LetterToSend', back_populates='subject')
    letters_were_sent = relationship('LetterWasSent', back_populates='subject')
