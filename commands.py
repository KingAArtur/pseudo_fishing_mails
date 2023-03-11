import click

from database import Base, SessionLocal
# необходимо для того, чтобы при удалении/инициализации бд было видно все таблицы
from src.models import *  # noqa
from src.queries import user as user_queries
from src.schemas import UserCreateSchema


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


@cli.command()
def create_default_user():
    session = SessionLocal()
    all_users = user_queries.get_all_users(db=session, limit=1, skip=0)
    if not all_users:
        user_schema = UserCreateSchema(
            username='admin',
            password='password',
            password_repeat='password',
        )
        user_queries.create_user(db=session, user_schema=user_schema)

        print(f'Default user has been created!\nlogin: {user_schema.username}\npassword: {user_schema.password}')
    else:
        print('There are users in database already! Not creating another one.')


if __name__ == '__main__':
    cli()
