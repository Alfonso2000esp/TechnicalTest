from typing import Annotated

from fastapi import APIRouter, Depends, status

from app.dependencies import provide
from app.domain.todo import Todo
from app.domain.todoCreate import TodoCreate
from app.domain.todoUpdate import TodoUpdate
from app.repositories.todoRepository import TodoRepository

router = APIRouter(prefix="/todos", tags=["todos"])

get_todo_repository = provide(TodoRepository)
Repository = Annotated[TodoRepository, Depends(get_todo_repository)]
NOT_FOUND = {404: {"description": "Todo not found"}}


@router.get("", response_model=list[Todo])
def list_todos(repo: Repository):
    """Get all todos."""
    return repo.get_all()


@router.get("/{todo_id}", response_model=Todo, responses=NOT_FOUND)
def get_todo(todo_id: int, repo: Repository):
    """Get a single todo."""
    return repo.get(todo_id)


@router.post("", response_model=Todo, status_code=status.HTTP_201_CREATED)
def create_todo(data: TodoCreate, repo: Repository):
    """Create a todo. The id is assigned by the server."""
    return repo.create(data)


@router.patch("/{todo_id}", response_model=Todo, responses=NOT_FOUND)
def update_todo(todo_id: int, data: TodoUpdate, repo: Repository):
    """Partially update a todo: only the fields sent are changed."""
    return repo.update(todo_id, data)


@router.delete("/{todo_id}", status_code=status.HTTP_204_NO_CONTENT, responses=NOT_FOUND)
def delete_todo(todo_id: int, repo: Repository):
    """Delete a todo."""
    repo.delete(todo_id)