from typing import List
from fastapi import APIRouter, Depends

from dependencies import get_db
from schemas import SubjectCreateSchema, SubjectSchema
from queries import subject as subject_queries


subjects_router = APIRouter(prefix='/subjects', tags=['subjects'])


@subjects_router.post('', response_model=SubjectSchema)
def create_subject(subject: SubjectCreateSchema, db=Depends(get_db)):
    subject = subject_queries.create_subject(db=db, subject_schema=subject)
    return SubjectSchema.from_orm(subject)


@subjects_router.get('', response_model=List[SubjectSchema])
def get_all_subjects(db=Depends(get_db), limit: int = 100, skip: int = 0):
    subjects = subject_queries.get_all_subjects(db=db, limit=limit, skip=skip)
    return subjects
