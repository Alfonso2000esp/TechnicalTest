import os
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.error_handler import register_exception_handlers
from app.repositories.todoJsonRepository import JsonTodoRepository
from app.repositories.todoRepository import TodoRepository
from app.routers import todoRouter

DATA_FILE = Path(os.environ.get("TODOS_DATA_FILE", Path(__file__).parent / "todos.json"))
CORS_ORIGINS = [
    origin.strip()
    for origin in os.environ.get(
        "CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173"
    ).split(",")
    if origin.strip()
]

@asynccontextmanager
async def lifespan(app: FastAPI):
    todo_repository = JsonTodoRepository(DATA_FILE)
    todo_repository.load()
    app.state.container = {TodoRepository: todo_repository}
    yield



app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_methods=["GET", "POST", "PATCH", "DELETE"],
    allow_headers=["Content-Type"],
)
register_exception_handlers(app)
app.include_router(todoRouter.router)