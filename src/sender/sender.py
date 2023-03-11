import sched
import os

import smtplib
import ssl
from email.message import EmailMessage

from datetime import datetime
from sqlalchemy.orm import Session

from models import LetterWasSent, LetterToSend
from queries import letter as letter_queries
from queries import subject as subject_queries
from schemas import LetterCreateSchema
from database import SessionLocal


GMAIL_LOGIN = os.environ.get('GMAIL_LOGIN')
GMAIL_PASSWORD = os.environ.get('GMAIL_PASSWORD')
if GMAIL_LOGIN is None or GMAIL_PASSWORD is None:
    raise ValueError('You must specify gmail login and password in GMAIL_LOGIN and GMAIL_PASSWORD variables!')

APP_LINK = os.environ.get('APP_LINK')
if APP_LINK is None:
    raise ValueError('You must specify link to your app in APP_LINK variable!')

SCHEDULE_INTERVAL = 10  # seconds
MUST_HAVE_MESSAGE_HEADING = """I am testing automatic sending emails.
If you see this then i just mistyped email address, dont worry.
"""


def send_letter(db: Session, server: smtplib.SMTP_SSL, letter: LetterToSend):
    subject = subject_queries.get_subject_by_id(db=db, subject_id=letter.subject_id)
    if subject is None:
        return

    txt = MUST_HAVE_MESSAGE_HEADING + letter.content
    replacements = {
        '{first_name}': subject.first_name,
        '{last_name}': subject.last_name,
        '{patronymic}': subject.patronymic,
    }
    for mask, value in replacements.items():
        txt = txt.replace(mask, value)

    letter_was_sent_schema = LetterCreateSchema(
        subject_id=subject.id,
        content=txt,
        send_at=letter.send_at,
    )
    letter_was_sent = letter_queries.create_letter_was_sent(db, letter_was_sent_schema)
    letter_queries.delete_letter(db, letter.id)

    txt = txt.replace('{link}', f'{APP_LINK}/trap?letter_id={letter_was_sent.id}')

    msg = EmailMessage()
    msg.set_content(txt)
    msg['Subject'] = f'Testing sending emails!'
    msg['From'] = GMAIL_LOGIN
    msg['To'] = subject.email

    server.send_message(msg)

    print(' ', subject.email, txt, ' ', sep='\n')


def work(scheduler):
    print('Scheduler working!')
    db = SessionLocal()

    now = datetime.utcnow()
    letters = letter_queries.get_all_letters_to_send_older_than(db=db, older_than=now)

    port = 465  # For SSL
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", port, context=context) as server:
        server.login(GMAIL_LOGIN, GMAIL_PASSWORD)

        for letter in letters:
            send_letter(db=db, server=server, letter=letter)

    db.close()

    scheduler.enter(SCHEDULE_INTERVAL, 0, work, argument=(scheduler,))


mail_scheduler = sched.scheduler()
mail_scheduler.enter(0, 0, work, argument=(mail_scheduler,))
mail_scheduler.run()
