from typing import List, Optional
import sqlalchemy as sa
from sqlalchemy.orm import Session, Query

from models import LetterToSend, LetterWasSent
from schemas import LetterCreateSchema, LetterUpdateSchema


def create_letter(db: Session, letter_schema: LetterCreateSchema) -> LetterToSend:
    letter = LetterToSend(**letter_schema.dict())
    db.add(letter)
    db.commit()
    db.refresh(letter)
    return letter


def move_letter_to_was_sent(db: Session, letter_id: int) -> LetterWasSent:
    letter = get_letter_to_send_by_id(db, letter_id)
    if letter:
        db.delete(letter)
        letter_was_sent = LetterWasSent(
            subject_id=letter.subject_id,
            content=letter.content,
            send_at=letter.send_at
        )
        db.add(letter_was_sent)
        db.commit()
        db.refresh(letter_was_sent)
        return letter_was_sent


def update_letter(db: Session, letter_id: int, letter_schema: LetterUpdateSchema) -> Optional[LetterToSend]:
    letter = get_letter_to_send_by_id(db, letter_id)
    if letter:
        if letter_schema.content is not None:
            letter.content = letter_schema.content
        if letter_schema.send_at is not None:
            letter.send_at = letter_schema.send_at

        db.add(letter)
        db.commit()
        db.refresh(letter)
        return letter


def delete_letter(db: Session, letter_id: int) -> Optional[LetterToSend]:
    letter = get_letter_to_send_by_id(db, letter_id)
    if letter:
        db.delete(letter)
        db.commit()
        return letter


def get_all_letters_to_send(db: Session, limit: int, skip: int) -> List[LetterToSend]:
    query = Query(LetterToSend).limit(limit).offset(skip)
    return db.execute(query).scalars().all()


def get_all_letters_were_sent(db: Session, limit: int, skip: int) -> List[LetterWasSent]:
    query = Query(LetterWasSent).limit(limit).offset(skip)
    return db.execute(query).scalars().all()


def get_all_letters_to_send_by_subject_id(db: Session, subject_id: int) -> List[LetterToSend]:
    query = Query(LetterToSend).filter(LetterToSend.subject_id == subject_id)
    letters = db.execute(query).scalars().all()
    return letters


def get_all_letters_were_sent_by_subject_id(db: Session, subject_id: int) -> List[LetterWasSent]:
    query = Query(LetterWasSent).filter(LetterWasSent.subject_id == subject_id)
    letters = db.execute(query).scalars().all()
    return letters


def get_letter_to_send_by_id(db: Session, letter_id: int) -> Optional[LetterToSend]:
    query = Query(LetterToSend).filter(LetterToSend.id == letter_id)
    letter = db.execute(query).scalars().first()
    return letter


def get_letter_was_sent_by_id(db: Session, letter_id: int) -> Optional[LetterWasSent]:
    query = Query(LetterWasSent).filter(LetterWasSent.id == letter_id)
    letter = db.execute(query).scalars().first()
    return letter
