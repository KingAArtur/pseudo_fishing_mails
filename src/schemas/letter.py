from pydantic import BaseModel
from typing import Optional
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