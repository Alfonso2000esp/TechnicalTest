import json

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.repositories.todoJsonRepository import JsonTodoRepository
from app.routers.todoRouter import get_todo_repository
from tests.mothers import TodoMother

# id 1: completed, not favorite / id 2: pending, favorite
SEED = [
    TodoMother.completed(1),
    TodoMother.favorite(2, description="Routers"),
]


@pytest.fixture
def data_file(tmp_path):
    """A temporary JSON file with known data, so tests never touch app/todos.json."""
    path = tmp_path / "todos.json"
    path.write_text(json.dumps(SEED), encoding="utf-8")
    return path


@pytest.fixture
def repository(data_file):
    repo = JsonTodoRepository(data_file)
    repo.load()
    return repo


@pytest.fixture
def client(repository):
    """
    API client wired to the temporary repository.

    TestClient is not used as a context manager on purpose: that would run the
    lifespan, which loads the real app/todos.json.
    """
    app.dependency_overrides[get_todo_repository] = lambda: repository
    yield TestClient(app)
    app.dependency_overrides.clear()
