from typing import Optional
from datetime import datetime

from pydantic import BaseModel, EmailStr


class SubjectSchema(BaseModel):
    id: Optional[int] = None
    email: EmailStr
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    patronymic: Optional[str] = None
    created_at: datetime

    class Config:
        orm_mode = True


class SubjectCreateSchema(BaseModel):
    email: EmailStr
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    patronymic: Optional[str] = None


class SubjectUpdateSchema(BaseModel):
    last_name: Optional[str] = None
    first_name: Optional[str] = None
    patronymic: Optional[str] = None
