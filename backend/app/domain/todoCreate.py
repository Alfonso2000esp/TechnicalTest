from pydantic import BaseModel

from app.domain.title import Title


class TodoCreate(BaseModel):
    title: Title
    completed: bool = False
    description: str | None = None
    favorite: bool = False
