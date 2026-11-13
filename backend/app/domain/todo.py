from pydantic import BaseModel

class Todo(BaseModel):
    id: int
    title: str
    completed: bool = False
    favorite: bool = False
    completedTogether: bool = False
