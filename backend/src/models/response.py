from datetime import datetime

import sqlalchemy as sa

from database import Base


class Response(Base):
    __tablename__: str = 'responses'

    id = sa.Column(sa.Integer, primary_key=True, autoincrement=True)
    created_at = sa.Column(sa.DateTime, default=datetime.utcnow)
    subject_id = sa.Column(sa.Integer, sa.ForeignKey('subjects.id'))
    letter_id = sa.Column(sa.Integer, sa.ForeignKey('letters_were_sent.id'))
