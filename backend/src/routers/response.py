from typing import List

from fastapi import APIRouter, Depends

from backend.src.dependencies import get_db, get_current_user
from backend.src.schemas import ResponseSchema
from backend.src.queries import response as response_queries


response_router = APIRouter(prefix='/response', tags=['response'])


@response_router.delete('', response_model=ResponseSchema)
def delete_response(
        response_id: int,
        db=Depends(get_db),
        current_user=Depends(get_current_user),  # noqa
):
    response = response_queries.delete_response(db=db, response_id=response_id)
    return ResponseSchema.from_orm(response)


@response_router.get('', response_model=List[ResponseSchema])
def get_all_responses(
        db=Depends(get_db),
        subject_id: int = None,
        limit: int = 100,
        skip: int = 0,
        current_user=Depends(get_current_user),  # noqa
):
    if subject_id is not None:
        responses = response_queries.get_all_responses_by_subject_id(db=db, subject_id=subject_id)
        return responses
    else:
        responses = response_queries.get_all_responses(db=db, limit=limit, skip=skip)
        return responses

