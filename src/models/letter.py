from datetime import datetime
import sqlalchemy as sa
from sqlalchemy.orm import relationship

from database import Base


class LetterToSend(Base):
    __tablename__: str = 'letters_to_send'

    id = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    content = sa.Column(sa.String)
    created_at = sa.Column(sa.DateTime, default=datetime.utcnow)
    send_at = sa.Column(sa.DateTime)
    subject_id = sa.Column(sa.Integer, sa.ForeignKey('subjects.id'))

    subject = relationship('Subject', back_populates='letters_to_send')


class LetterWasSent(Base):
    __tablename__: str = 'letters_were_sent'

    id = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    content = sa.Column(sa.String)
    created_at = sa.Column(sa.DateTime, default=datetime.utcnow)
    send_at = sa.Column(sa.DateTime)
    subject_id = sa.Column(sa.Integer, sa.ForeignKey('subjects.id'))

    subject = relationship('Subject', back_populates='letters_were_sent')
