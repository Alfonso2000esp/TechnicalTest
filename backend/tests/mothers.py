"""Object Mothers: named factories for the test data used across the suite."""

from typing import Any


class TodoMother:
    """Stored todos, as they appear in the JSON file and in API responses."""

    @staticmethod
    def pending(id: int = 1, **overrides: Any) -> dict[str, Any]:
        return {
            "id": id,
            "title": f"Todo {id}",
            "description": "",
            "completed": False,
            "favorite": False,
            **overrides,
        }

    @staticmethod
    def completed(id: int = 1, **overrides: Any) -> dict[str, Any]:
        return TodoMother.pending(id, completed=True, **overrides)

    @staticmethod
    def favorite(id: int = 1, **overrides: Any) -> dict[str, Any]:
        return TodoMother.pending(id, favorite=True, **overrides)


class TodoPayloadMother:
    """
    Request bodies exactly as the frontend sends them (frontend/src/api/todo.ts).

    Keep them in sync with the frontend: if a test fails because of a contract
    change, the frontend is probably broken too.
    """

    @staticmethod
    def create(title: str = "New todo") -> dict[str, Any]:
        return {"title": title, "completed": False}

    @staticmethod
    def toggle(completed: bool = True) -> dict[str, Any]:
        return {"completed": completed}
