from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime


class LetterSchema(BaseModel):
    id: Optional[int] = None
    subject_id: int
    content: str
    created_at: datetime
    send_at: datetime

    class Config:
        orm_mode = True


class LetterCreateSchema(BaseModel):
    subject_id: int
    content: str
    send_at: datetime


class LetterCreateMultipleSchema(BaseModel):
    subjects_id: List[int]
    content: str = 'Привет, {last_name} {first_name} {patronymic}! Перейди по ссылке: {link}.'
    send_at: datetime


class LetterUpdateSchema(BaseModel):
    content: Optional[str] = None
    send_at: Optional[datetime] = None
