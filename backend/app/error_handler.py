from typing import Any

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse

from app.domain.errors import DomainError, TodoNotFoundError

ERROR_RESPONSES: dict[type[DomainError], tuple[int, str]] = {
    TodoNotFoundError: (404, "Todo not found"),
}


def _status_for(exc: DomainError) -> int:
    for cls in type(exc).__mro__:
        if cls in ERROR_RESPONSES:
            return ERROR_RESPONSES[cls][0]
    return 500


def responses_for(*errors: type[DomainError]) -> dict[int | str, dict[str, Any]]:
    """OpenAPI `responses` for the errors an endpoint can raise."""
    return {ERROR_RESPONSES[e][0]: {"description": ERROR_RESPONSES[e][1]} for e in errors}


def register_exception_handlers(app: FastAPI) -> None:
    @app.exception_handler(DomainError)
    async def domain_error_handler(request: Request, exc: DomainError) -> JSONResponse:
        return JSONResponse(status_code=_status_for(exc), content={"detail": str(exc)})