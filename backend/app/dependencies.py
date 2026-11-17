from collections.abc import Callable
from typing import TypeVar

from fastapi import Request

T = TypeVar("T")


def provide(interface: type[T]) -> Callable[[Request], T]:
    def dependency(request: Request) -> T:
        return request.app.state.container[interface]

    return dependency
