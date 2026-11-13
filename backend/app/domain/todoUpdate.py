from pydantic import BaseModel


class TodoUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    completed: bool | None = None
    favorite: bool | None = None