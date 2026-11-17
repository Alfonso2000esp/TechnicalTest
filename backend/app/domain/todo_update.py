from typing import Self

from pydantic import BaseModel, model_validator

from app.domain.title import Title

NON_NULLABLE_FIELDS = ("title", "completed", "favorite")


class TodoUpdate(BaseModel):
    title: Title | None = None
    description: str | None = None
    completed: bool | None = None
    favorite: bool | None = None

    @model_validator(mode="after")
    def reject_null_for_non_nullable_fields(self) -> Self:
        null_fields = [
            field
            for field in NON_NULLABLE_FIELDS
            if field in self.model_fields_set and getattr(self, field) is None
        ]
        if null_fields:
            raise ValueError(f"Fields cannot be null: {', '.join(null_fields)}")
        return self
