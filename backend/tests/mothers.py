from typing import Any


class TodoMother:
    @staticmethod
    def pending(id: int = 1, **overrides: Any) -> dict[str, Any]:
        return {
            "id": id,
            "title": f"Todo {id}",
            "description": None,
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
    @staticmethod
    def create(title: str = "New todo", description: str | None = None) -> dict[str, Any]:
        return {"title": title, "description": description, "completed": False}

    @staticmethod
    def toggle(completed: bool = True) -> dict[str, Any]:
        return {"completed": completed}
