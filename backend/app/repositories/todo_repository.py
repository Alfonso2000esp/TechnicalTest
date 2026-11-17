from abc import ABC, abstractmethod

from app.domain.todo import Todo
from app.domain.todo_create import TodoCreate
from app.domain.todo_update import TodoUpdate


class TodoRepository(ABC):
    @abstractmethod
    def get_all(self) -> list[Todo]: ...

    @abstractmethod
    def get(self, todo_id: int) -> Todo: ...

    @abstractmethod
    def create(self, data: TodoCreate) -> Todo: ...

    @abstractmethod
    def update(self, todo_id: int, data: TodoUpdate) -> Todo: ...

    @abstractmethod
    def delete(self, todo_id: int) -> None: ...
