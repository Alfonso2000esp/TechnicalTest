import pytest

from app.domain.description import DESCRIPTION_MAX_LENGTH
from app.domain.title import TITLE_MAX_LENGTH
from tests.conftest import SEED
from tests.mothers import TodoMother, TodoPayloadMother


def test_list_todos(client):
    response = client.get("/todos")

    assert response.status_code == 200
    assert response.json() == SEED


def test_get_todo(client):
    response = client.get("/todos/2")

    assert response.status_code == 200
    assert response.json() == SEED[1]


def test_create_todo_as_the_frontend_does(client):
    response = client.post("/todos", json=TodoPayloadMother.create("Learn pytest"))

    assert response.status_code == 201
    assert response.json() == TodoMother.pending(3, title="Learn pytest")


@pytest.mark.parametrize(
    "body",
    [
        {},
        {"title": None},
        {"title": ""},
        {"title": "   "},
        {"title": "x" * (TITLE_MAX_LENGTH + 1)},
    ],
    ids=["missing", "null", "empty", "blank", "too-long"],
)
def test_create_todo_with_invalid_title_is_rejected(client, body):
    assert client.post("/todos", json=body).status_code == 422
    assert len(client.get("/todos").json()) == len(SEED)


def test_create_todo_trims_the_title(client):
    response = client.post("/todos", json=TodoPayloadMother.create("  Learn pytest  "))

    assert response.status_code == 201
    assert response.json()["title"] == "Learn pytest"


@pytest.mark.parametrize(
    "body",
    [
        {"title": None},
        {"title": ""},
        {"title": "   "},
        {"completed": None},
        {"favorite": None},
    ],
    ids=["null-title", "empty-title", "blank-title", "null-completed", "null-favorite"],
)
def test_patch_with_invalid_value_is_rejected_and_nothing_changes(client, body):
    assert client.patch("/todos/2", json=body).status_code == 422
    assert client.get("/todos/2").json() == SEED[1]


def test_patch_can_clear_the_description(client):
    response = client.patch("/todos/2", json={"description": None})

    assert response.status_code == 200
    assert response.json()["description"] is None


def test_toggle_completed_as_the_frontend_does(client):
    response = client.patch("/todos/2", json=TodoPayloadMother.toggle())

    assert response.status_code == 200
    assert response.json()["completed"] is True
    assert client.get("/todos/2").json()["completed"] is True


def test_patch_keeps_fields_not_sent(client):
    client.patch("/todos/2", json={"favorite": False})

    assert client.get("/todos/2").json() == {**SEED[1], "favorite": False}


def test_delete_todo(client):
    assert client.delete("/todos/1").status_code == 204
    assert [t["id"] for t in client.get("/todos").json()] == [2]


def test_missing_todo_returns_404_on_every_endpoint(client):
    for response in (
        client.get("/todos/99"),
        client.patch("/todos/99", json=TodoPayloadMother.toggle()),
        client.delete("/todos/99"),
    ):
        assert response.status_code == 404
        assert response.json() == {"detail": "Todo 99 not found"}


@pytest.mark.parametrize(
    ("description", "stored"),
    [
        ("", None),
        ("   ", None),
        ("  Semi-skimmed  ", "Semi-skimmed"),
        ("x" * DESCRIPTION_MAX_LENGTH, "x" * DESCRIPTION_MAX_LENGTH),
    ],
    ids=["empty", "blank", "padded", "max-length"],
)
def test_create_normalizes_the_description(client, description, stored):
    response = client.post("/todos", json=TodoPayloadMother.create(description=description))

    assert response.status_code == 201
    assert response.json()["description"] == stored


def test_create_with_too_long_description_is_rejected(client):
    body = TodoPayloadMother.create(description="x" * (DESCRIPTION_MAX_LENGTH + 1))

    assert client.post("/todos", json=body).status_code == 422


def test_patch_with_blank_description_clears_it(client):
    response = client.patch("/todos/2", json={"description": "   "})

    assert response.status_code == 200
    assert response.json()["description"] is None
