from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.dependencies import provide
from app.domain.errors import TodoNotFoundError
from app.domain.todo import Todo
from app.domain.todoCreate import TodoCreate
from app.domain.todoUpdate import TodoUpdate
from app.error_handler import responses_for
from app.repositories.todoRepository import TodoRepository

router = APIRouter(prefix="/todos", tags=["todos"])

get_todo_repository = provide(TodoRepository)
TodoRepositoryDep = Annotated[TodoRepository, Depends(get_todo_repository)]


@router.get("", response_model=list[Todo])
def list_todos(repo: TodoRepositoryDep):
    """Get all todos."""
    return repo.get_all()


@router.get("/{todo_id}", response_model=Todo, responses=responses_for(TodoNotFoundError))
def get_todo(todo_id: int, repo: TodoRepositoryDep):
    """Get a single todo."""
    return repo.get(todo_id)


@router.post("", response_model=Todo, status_code=status.HTTP_201_CREATED)
def create_todo(data: TodoCreate, repo: TodoRepositoryDep):
    """Create a todo. The id is assigned by the server."""
    return repo.create(data)


@router.patch("/{todo_id}", response_model=Todo, responses=responses_for(TodoNotFoundError))
def update_todo(todo_id: int, data: TodoUpdate, repo: TodoRepositoryDep):
    """Partially update a todo: only the fields sent are changed."""
    return repo.update(todo_id, data)


@router.delete(
    "/{todo_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    responses=responses_for(TodoNotFoundError),
)
def delete_todo(todo_id: int, repo: TodoRepositoryDep):
    """Delete a todo."""
    repo.delete(todo_id)
