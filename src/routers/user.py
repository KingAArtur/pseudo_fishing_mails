from typing import List

from fastapi import APIRouter, Depends, HTTPException, status

from src.dependencies import get_db, get_current_user
from src.schemas import UserCreateSchema, UserSchema, UserUpdateSchema
from src.queries import user as user_queries
from src.models import User


users_router = APIRouter(prefix='/users', tags=['users'])


@users_router.post('', response_model=UserSchema)
def create_user(user: UserCreateSchema, db=Depends(get_db)):
    user = user_queries.create_user(db=db, user_schema=user)
    return UserSchema.from_orm(user)


@users_router.put('', response_model=UserSchema)
def update_user(user_id: int, user: UserUpdateSchema, db=Depends(get_db)):
    user = user_queries.update_user(db=db, user_id=user_id, user_schema=user)
    return UserSchema.from_orm(user)


@users_router.get('', response_model=List[UserSchema])
def read_users(db=Depends(get_db), id: int = None, limit: int = 100, skip: int = 0):
    if id is not None:
        user = user_queries.get_user_by_id(db=db, user_id=id)
        return [user]
    else:
        users = user_queries.get_all_users(db=db, limit=limit, skip=skip)
        return users


@users_router.get("/me", response_model=UserSchema)
async def read_users_me(current_user: User = Depends(get_current_user)):
    return current_user
