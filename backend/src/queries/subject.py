from typing import List, Optional

from sqlalchemy.orm import Session, Query

from backend.src.models import Subject
from backend.src.schemas import SubjectCreateSchema, SubjectUpdateSchema


def create_subject(db: Session, subject_schema: SubjectCreateSchema) -> Subject:
    subject = Subject(**subject_schema.dict())
    db.add(subject)
    db.commit()
    db.refresh(subject)
    return subject


def update_subject(db: Session, subject_id: int, subject_schema: SubjectUpdateSchema) -> Optional[Subject]:
    subject = get_subject_by_id(db, subject_id)
    if subject:
        if subject_schema.first_name is not None:
            subject.first_name = subject_schema.first_name
        if subject_schema.last_name is not None:
            subject.last_name = subject_schema.last_name
        if subject_schema.patronymic is not None:
            subject.patronymic = subject_schema.patronymic

        db.add(subject)
        db.commit()
        db.refresh(subject)
        return subject


def get_all_subjects(db: Session, limit: int, skip: int) -> List[Subject]:
    query = Query(Subject).limit(limit).offset(skip)
    return db.execute(query).scalars().all()


def get_subject_by_id(db: Session, subject_id: int) -> Optional[Subject]:
    query = Query(Subject).filter(Subject.id == subject_id)
    subject = db.execute(query).scalars().first()
    return subject


def get_subject_by_email(db: Session, subject_email: str) -> Optional[Subject]:
    query = Query(Subject).filter(Subject.email == subject_email)
    subject = db.execute(query).scalars().first()
    return subject
