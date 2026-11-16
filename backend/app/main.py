from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.error_handler import register_exception_handlers
from app.repositories.todoJsonRepository import JsonTodoRepository
from app.repositories.todoRepository import TodoRepository
from app.routers import todoRouter

DATA_FILE = Path(__file__).parent / "todos.json"

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Build the dependencies once at startup and register them by interface."""
    todo_repository = JsonTodoRepository(DATA_FILE)
    todo_repository.load()
    app.state.container = {TodoRepository: todo_repository}
    yield



app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
register_exception_handlers(app)
app.include_router(todoRouter.router)