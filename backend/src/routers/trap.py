from fastapi import APIRouter, Depends

from backend.src.dependencies import get_db
from backend.src.schemas import ResponseCreateSchema
from backend.src.queries import letter as letter_queries, response as response_queries


trap_router = APIRouter(prefix='/trap', tags=['trap'])


@trap_router.get('', response_model=None)
def create_response(db=Depends(get_db), letter_id: int = None):
    if letter_id is not None:
        letter = letter_queries.get_letter_was_sent_by_id(db=db, letter_id=letter_id)
        if letter:
            response_schema = ResponseCreateSchema(
                subject_id=letter.subject_id,
                letter_id=letter.id
            )
            response_queries.create_response(db=db, response_schema=response_schema)
    else:
        pass
