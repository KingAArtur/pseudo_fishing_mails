from typing import List, Optional

from sqlalchemy.orm import Session, Query

from src.models import User
from src.schemas import UserCreateSchema, UserUpdateSchema
from src.auth_settings import pwd_context


def create_user(db: Session, user_schema: UserCreateSchema) -> User:
    user = User(
        username=user_schema.username,
        hashed_password=pwd_context.hash(user_schema.password)
    )

    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def update_user(db: Session, user_id: int, user_schema: UserUpdateSchema) -> Optional[User]:
    user = get_user_by_id(db=db, user_id=user_id)
    if user:
        user.hashed_password = pwd_context.hash(user_schema.password)

        db.add(user)
        db.commit()
        db.refresh(user)
        return user


def delete_user(db: Session, user_id: int) -> Optional[User]:
    user = get_user_by_id(db=db, user_id=user_id)
    if user:
        db.delete(user)
        db.commit()
        return user


def get_all_users(db: Session, limit: int, skip: int) -> List[User]:
    query = Query(User).limit(limit).offset(skip)
    return db.execute(query).scalars().all()


def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    query = Query(User).filter(User.id == user_id)
    user = db.execute(query).scalars().first()
    return user


def get_user_by_username(db: Session, username: str) -> Optional[User]:
    query = Query(User).filter(User.username == username)
    user = db.execute(query).scalars().first()
    return user
