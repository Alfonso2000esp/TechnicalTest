from typing import Annotated

from pydantic import BeforeValidator, StringConstraints

DESCRIPTION_MAX_LENGTH = 1000


def blank_to_none(value: object) -> object:
    if isinstance(value, str) and not value.strip():
        return None
    return value


Description = Annotated[
    Annotated[str, StringConstraints(strip_whitespace=True, max_length=DESCRIPTION_MAX_LENGTH)]
    | None,
    BeforeValidator(blank_to_none),
]
