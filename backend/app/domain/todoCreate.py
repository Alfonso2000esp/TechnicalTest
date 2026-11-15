from pydantic import BaseModel

class TodoCreate(BaseModel):
    title: str
    completed: bool = False
    description: str | None = None
    favorite: bool = False
