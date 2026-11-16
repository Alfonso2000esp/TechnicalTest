from typing import Callable, TypeVar

from fastapi import Request

T = TypeVar("T")


def provide(interface: type[T]) -> Callable[[Request], T]:
    """Build a FastAPI dependency that returns the instance registered for `interface`."""

    def dependency(request: Request) -> T:
        return request.app.state.container[interface]

    return dependency
