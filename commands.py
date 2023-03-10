import click

from database import Base, SessionLocal
from src.models import *


@click.group()
def cli():
    pass


@cli.command()
def clear_db():
    session = SessionLocal()
    Base.metadata.drop_all(session.connection().engine)
    print('Database is cleared!')


@cli.command()
def init_db():
    session = SessionLocal()
    Base.metadata.create_all(session.connection().engine)
    print('Database is created!')


if __name__ == '__main__':
    cli()
