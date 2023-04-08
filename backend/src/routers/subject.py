from typing import List

from fastapi import APIRouter, Depends

from backend.src.dependencies import get_db, get_current_user
from backend.src.schemas import SubjectCreateSchema, SubjectSchema, SubjectUpdateSchema
from backend.src.queries import subject as subject_queries


subjects_router = APIRouter(prefix='/subjects', tags=['subjects'])


@subjects_router.post('', response_model=SubjectSchema)
def create_subject(
        subject: SubjectCreateSchema,
        db=Depends(get_db),
        current_user=Depends(get_current_user),  # noqa
):
    subject = subject_queries.create_subject(db=db, subject_schema=subject)
    return SubjectSchema.from_orm(subject)


@subjects_router.put('', response_model=SubjectSchema)
def update_subject(
        subject_id: int,
        subject: SubjectUpdateSchema,
        db=Depends(get_db),
        current_user=Depends(get_current_user),  # noqa
):
    subject = subject_queries.update_subject(db=db, subject_id=subject_id, subject_schema=subject)
    return SubjectSchema.from_orm(subject)


@subjects_router.get('', response_model=List[SubjectSchema])
def read_subjects(
        db=Depends(get_db),
        id: int = None,  # noqa
        email: str = None,
        limit: int = 100,
        skip: int = 0,
        current_user=Depends(get_current_user),  # noqa
):
    if id is not None:
        assert email is None
        subject = subject_queries.get_subject_by_id(db=db, subject_id=id)
        if subject:
            return [subject]
        else:
            return []
    elif email is not None:
        subject = subject_queries.get_subject_by_email(db=db, subject_email=email)
        if subject:
            return [subject]
        else:
            return []
    else:
        subjects = subject_queries.get_all_subjects(db=db, limit=limit, skip=skip)
        return subjects
