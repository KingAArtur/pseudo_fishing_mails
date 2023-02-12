from typing import List
from fastapi import APIRouter, Depends

from dependencies import get_db
from schemas import LetterCreateSchema, LetterCreateMultipleSchema, LetterSchema, LetterUpdateSchema
from queries import letter as letter_queries


schedule_router = APIRouter(prefix='/schedule', tags=['schedule'])
history_router = APIRouter(prefix='/history', tags=['history'])


@schedule_router.post('', response_model=List[LetterSchema])
def create_letter(letters_schema: LetterCreateMultipleSchema, db=Depends(get_db)):
    letter_schema = LetterCreateSchema(
        content=letters_schema.content,
        send_at=letters_schema.send_at,
        subject_id=0
    )
    letters = []
    for subject_id in letters_schema.subjects_id:
        letter_schema.subject_id = subject_id
        letter = letter_queries.create_letter(db=db, letter_schema=letter_schema)
        letters.append(letter)

    return letters


@schedule_router.put('', response_model=LetterSchema)
def update_letter(letter_id: int, letter_schema: LetterUpdateSchema, db=Depends(get_db)):
    letter = letter_queries.update_letter(db=db, letter_id=letter_id, letter_schema=letter_schema)
    return LetterSchema.from_orm(letter)


@schedule_router.delete('', response_model=LetterSchema)
def delete_letter(letter_id: int, db=Depends(get_db)):
    letter = letter_queries.delete_letter(db=db, letter_id=letter_id)
    return LetterSchema.from_orm(letter)


@schedule_router.get('', response_model=List[LetterSchema])
def read_letters_to_send(db=Depends(get_db), letter_id: int = None, subject_id: int = None, limit: int = 100, skip: int = 0):
    if letter_id is not None:
        assert subject_id is None
        letter = letter_queries.get_letter_to_send_by_id(db=db, letter_id=letter_id)
        if letter:
            return [letter]
        else:
            return []
    elif subject_id is not None:
        subjects = letter_queries.get_all_letters_to_send_by_subject_id(db=db, subject_id=subject_id)
        return subjects
    else:
        subjects = letter_queries.get_all_letters_to_send(db=db, limit=limit, skip=skip)
        return subjects


@history_router.get('', response_model=List[LetterSchema])
def read_letters_were_sent(db=Depends(get_db), letter_id: int = None, subject_id: int = None, limit: int = 100, skip: int = 0):
    if letter_id is not None:
        assert subject_id is None
        letter = letter_queries.get_letter_was_sent_by_id(db=db, letter_id=letter_id)
        if letter:
            return [letter]
        else:
            return []
    elif subject_id is not None:
        subjects = letter_queries.get_all_letters_were_sent_by_subject_id(db=db, subject_id=subject_id)
        return subjects
    else:
        subjects = letter_queries.get_all_letters_were_sent(db=db, limit=limit, skip=skip)
        return subjects


@history_router.post('', response_model=LetterSchema)
def move_letter_to_was_sent(db=Depends(get_db), letter_id: int = None):
    letter = letter_queries.move_letter_to_was_sent(db=db, letter_id=letter_id)

    if letter is not None:
        return LetterSchema.from_orm(letter)
