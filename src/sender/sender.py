import sched
from datetime import datetime
from sqlalchemy.orm import Session

from models import LetterWasSent
from queries import letter as letter_queries
from queries import subject as subject_queries
from database import SessionLocal

SCHEDULE_INTERVAL = 10
COMPULSORY_MESSAGE = """Это скам! азаза
"""


def send_letter(db: Session, letter: LetterWasSent):
    subject = letter.subject_id
    subject = subject_queries.get_subject_by_id(db=db, subject_id=subject)
    if subject is None:
        return

    txt = COMPULSORY_MESSAGE + letter.content
    replacements = {
        '{first_name}': subject.first_name,
        '{last_name}': subject.last_name,
        '{patronymic}': subject.patronymic,
        '{link}': f'http_link: {letter.id}'
    }
    for mask, value in replacements.items():
        txt = txt.replace(mask, value)

    print(' ', subject.email, txt, ' ', sep='\n')


def work(scheduler):
    print('Scheduler working!')
    db = SessionLocal()

    now = datetime.utcnow()
    letters = letter_queries.get_all_letters_to_send_older_than(db=db, older_than=now)

    for letter in letters:
        letter_was_sent = letter_queries.move_letter_to_was_sent(db=db, letter_id=letter.id)
        send_letter(db=db, letter=letter_was_sent)

    db.close()

    scheduler.enter(SCHEDULE_INTERVAL, 0, work, argument=(scheduler,))


scheduler = sched.scheduler()
scheduler.enter(0, 0, work, argument=(scheduler,))
scheduler.run()
