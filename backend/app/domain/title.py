from typing import Annotated

from pydantic import StringConstraints

TITLE_MAX_LENGTH = 200


Title = Annotated[
    str, StringConstraints(strip_whitespace=True, min_length=1, max_length=TITLE_MAX_LENGTH)
]
