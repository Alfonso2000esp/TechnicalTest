
from pydantic import BaseModel
from app.domain.title import Title


class Todo(BaseModel):
    id: int
    title: Title
    completed: bool = False
    description: str | None = None
    favorite: bool = False
