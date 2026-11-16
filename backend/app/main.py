from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.repositories.todoJsonRepository import JsonTodoRepository
from app.repositories.todoRepository import TodoNotFoundError, TodoRepository
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


@app.exception_handler(TodoNotFoundError)
async def todo_not_found_handler(request: Request, exc: TodoNotFoundError) -> JSONResponse:
    return JSONResponse(status_code=404, content={"detail": str(exc)})

app.include_router(todoRouter.router)