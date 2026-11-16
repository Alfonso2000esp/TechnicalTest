import threading
import json
from pathlib import Path

from app.domain.errors import TodoNotFoundError
from app.domain.todo import Todo
from app.domain.todoCreate import TodoCreate
from app.domain.todoUpdate import TodoUpdate
from app.repositories.todoRepository import TodoRepository


class JsonTodoRepository(TodoRepository):
    """In-memory store loaded once at startup, persisted to JSON on every write."""

    def __init__(self, path: Path):
        self._path = path
        self._lock = threading.Lock()
        self._todos: dict[int, Todo] = {}

    def load(self) -> None:
        with open(self._path, encoding="utf-8") as f:
            self._todos = {t["id"]: Todo(**t) for t in json.load(f)}

    def get_all(self) -> list[Todo]:
        return list(self._todos.values())

    def get(self, todo_id: int) -> Todo:
        try:
            return self._todos[todo_id]
        except KeyError:
            raise TodoNotFoundError(todo_id)

    def create(self, data: TodoCreate) -> Todo:
        with self._lock:
            todo = Todo(id=max(self._todos, default=0) + 1, **data.model_dump())
            self._todos[todo.id] = todo
            self._persist()
            return todo

    def update(self, todo_id: int, data: TodoUpdate) -> Todo:
        with self._lock:
            updated = self.get(todo_id).model_copy(update=data.model_dump(exclude_unset=True))
            self._todos[todo_id] = updated
            self._persist()
            return updated

    def delete(self, todo_id: int) -> None:
        with self._lock:
            self.get(todo_id)
            del self._todos[todo_id]
            self._persist()

    def _persist(self) -> None:
        with open(self._path, "w", encoding="utf-8") as f:
            json.dump([t.model_dump() for t in self._todos.values()], f, indent=2)
