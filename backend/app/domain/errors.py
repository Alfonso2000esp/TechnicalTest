class DomainError(Exception):
    """Base class for errors raised by the domain / repositories."""


class TodoNotFoundError(DomainError):
    def __init__(self, todo_id: int):
        super().__init__(f"Todo {todo_id} not found")