from pydantic import BaseModel

from app.domain.description import Description
from app.domain.title import Title


class TodoCreate(BaseModel):
    title: Title
    completed: bool = False
    description: Description = None
    favorite: bool = False
