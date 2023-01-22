from fastapi import FastAPI
import uvicorn

from routers import subjects_router

app = FastAPI()
app.include_router(subjects_router)


@app.get('/')
def hello() -> str:
    return 'Hello!'


if __name__ == '__main__':
    uvicorn.run('main:app', reload=True)
