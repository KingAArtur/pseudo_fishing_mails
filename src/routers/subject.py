from typing import List
from fastapi import APIRouter, Depends

from dependencies import get_db
from schemas import SubjectCreateSchema, SubjectSchema, SubjectUpdateSchema
from queries import subject as subject_queries


subjects_router = APIRouter(prefix='/subjects', tags=['subjects'])


@subjects_router.post('', response_model=SubjectSchema)
def create_subject(subject: SubjectCreateSchema, db=Depends(get_db)):
    subject = subject_queries.create_subject(db=db, subject_schema=subject)
    return SubjectSchema.from_orm(subject)


@subjects_router.put('', response_model=SubjectSchema)
def update_subject(subject_id: int, subject: SubjectUpdateSchema, db=Depends(get_db)):
    subject = subject_queries.update_subject(db=db, subject_id=subject_id, subject_schema=subject)
    return SubjectSchema.from_orm(subject)


@subjects_router.get('', response_model=List[SubjectSchema])
def read_subjects(db=Depends(get_db), sid: int = None, email: str = None, limit: int = 100, skip: int = 0):
    if sid is not None:
        assert email is None
        subject = subject_queries.get_subject_by_id(db=db, subject_id=sid)
        return [subject]
    elif email is not None:
        subject = subject_queries.get_subject_by_email(db=db, subject_email=email)
        return [subject]
    else:
        subjects = subject_queries.get_all_subjects(db=db, limit=limit, skip=skip)
        return subjects
