from typing import Optional
from datetime import datetime

from pydantic import BaseModel


class ResponseSchema(BaseModel):
    id: Optional[int] = None
    created_at: datetime
    subject_id: int
    letter_id: int

    class Config:
        orm_mode = True


class ResponseCreateSchema(BaseModel):
    subject_id: int
    letter_id: int
