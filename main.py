from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from src.routers import (subjects_router, schedule_router, history_router, response_router, trap_router,
                         users_router, auth_router)

app = FastAPI()
app.include_router(auth_router)
app.include_router(users_router)
app.include_router(subjects_router)
app.include_router(schedule_router)
app.include_router(history_router)
app.include_router(response_router)
app.include_router(trap_router)


app.add_middleware(
    CORSMiddleware,
    allow_origins=[str(origin) for origin in ["http://localhost:3000", "http://localhost:8000"]],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get('/')
def hello() -> str:
    return 'Hello!'


if __name__ == '__main__':
    uvicorn.run('main:app', reload=True)
