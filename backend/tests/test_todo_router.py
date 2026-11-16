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
    assert response.json() == TodoMother.pending(3, title="Learn pytest", description=None)


def test_create_todo_without_title_is_rejected(client):
    assert client.post("/todos", json={}).status_code == 422


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
