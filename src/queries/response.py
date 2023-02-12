from typing import List, Optional
import sqlalchemy as sa
from sqlalchemy.orm import Session, Query

from models import Response
from schemas import ResponseCreateSchema


def create_response(db: Session, response_schema: ResponseCreateSchema) -> Response:
    response = Response(**response_schema.dict())
    db.add(response)
    db.commit()
    db.refresh(response)
    return response


def delete_response(db: Session, response_id: int) -> Optional[Response]:
    response = get_response_by_id(db, response_id)
    if response:
        db.delete(response)
        db.commit()
        return response


def get_all_responses(db: Session, limit: int, skip: int) -> List[Response]:
    query = Query(Response).limit(limit).offset(skip)
    return db.execute(query).scalars().all()


def get_all_responses_by_subject_id(db: Session, subject_id: int) -> List[Response]:
    query = Query(Response).filter(Response.subject_id == subject_id)
    responses = db.execute(query).scalars().all()
    return responses


def get_response_by_id(db: Session, response_id: int) -> Optional[Response]:
    query = Query(Response).filter(Response.id == response_id)
    response = db.execute(query).scalars().first()
    return response
