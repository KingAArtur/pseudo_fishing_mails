from typing import Optional
from datetime import datetime

from pydantic import BaseModel, constr, validator


def check_passwords_match(password_repeat: str, values) -> str:
    if password_repeat is not None:
        if 'password' in values and values['password'] is not None and password_repeat != values['password']:
            raise ValueError("Passwords don't match!")
    return password_repeat


class UserSchema(BaseModel):
    id: Optional[int] = None
    username: str
    hashed_password: str
    created_at: datetime

    class Config:
        orm_mode = True


class UserCreateSchema(BaseModel):
    username: str
    password: constr(min_length=8)
    password_repeat: str

    _check_passwords_match = validator('password_repeat', allow_reuse=True)(check_passwords_match)


class UserUpdateSchema(BaseModel):
    password: constr(min_length=8)
    password_repeat: str

    _check_passwords_match = validator('password_repeat', allow_reuse=True)(check_passwords_match)
