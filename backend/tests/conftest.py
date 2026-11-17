import json

import pytest
from fastapi.testclient import TestClient

from app.main import app
from app.repositories.todoJsonRepository import JsonTodoRepository
from app.routers.todoRouter import get_todo_repository
from tests.mothers import TodoMother

SEED = [
    TodoMother.completed(1),
    TodoMother.favorite(2, description="Routers"),
]


@pytest.fixture
def data_file(tmp_path):
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
    app.dependency_overrides[get_todo_repository] = lambda: repository
    yield TestClient(app)
    app.dependency_overrides.clear()
