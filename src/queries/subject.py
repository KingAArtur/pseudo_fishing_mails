import sqlalchemy as sa
from sqlalchemy.orm import Session, Query

from models import Subject
from schemas import SubjectCreateSchema


def create_subject(db: Session, subject_schema: SubjectCreateSchema) -> Subject:
    subject = Subject(**subject_schema.dict())
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject


def get_all_subjects(db: Session, limit: int, skip: int):
    query = Query(Subject).limit(limit).offset(skip)
    return db.execute(query).scalars().all()
