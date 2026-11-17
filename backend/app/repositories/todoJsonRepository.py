import json
import os
import tempfile
import threading
from pathlib import Path

from app.domain.errors import TodoNotFoundError
from app.domain.todo import Todo
from app.domain.todoCreate import TodoCreate
from app.domain.todoUpdate import TodoUpdate
from app.repositories.todoRepository import TodoRepository


class JsonTodoRepository(TodoRepository):
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
            self._commit({**self._todos, todo.id: todo})
            return todo

    def update(self, todo_id: int, data: TodoUpdate) -> Todo:
        with self._lock:
            updated = self.get(todo_id).model_copy(update=data.model_dump(exclude_unset=True))
            self._commit({**self._todos, todo_id: updated})
            return updated

    def delete(self, todo_id: int) -> None:
        with self._lock:
            self.get(todo_id)
            self._commit({id_: t for id_, t in self._todos.items() if id_ != todo_id})

    def _commit(self, todos: dict[int, Todo]) -> None:
        self._persist(todos)
        self._todos = todos

    def _persist(self, todos: dict[int, Todo]) -> None:
        fd, tmp_path = tempfile.mkstemp(dir=self._path.parent, prefix=".todos-", suffix=".tmp")
        try:
            with os.fdopen(fd, "w", encoding="utf-8", newline="\n") as f:
                json.dump([t.model_dump() for t in todos.values()], f, indent=2)
                f.write("\n")
                f.flush()
                os.fsync(f.fileno())
            os.replace(tmp_path, self._path)
        except BaseException:
            os.unlink(tmp_path)
            raise
