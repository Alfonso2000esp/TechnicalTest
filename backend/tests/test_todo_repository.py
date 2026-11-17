import pytest

from app.domain.errors import TodoNotFoundError
from app.domain.todo_create import TodoCreate
from app.domain.todo_update import TodoUpdate
from app.repositories.todo_json_repository import JsonTodoRepository
from tests.conftest import SEED
from tests.mothers import TodoMother, TodoPayloadMother


def test_load_reads_all_todos(repository):
    assert [t.model_dump() for t in repository.get_all()] == SEED


def test_get_returns_todo(repository):
    assert repository.get(2).model_dump() == SEED[1]


def test_get_missing_raises(repository):
    with pytest.raises(TodoNotFoundError):
        repository.get(99)


def test_create_assigns_next_id(repository):
    todo = repository.create(TodoCreate(**TodoPayloadMother.create("New")))

    assert todo.id == 3
    assert todo.title == "New"
    assert todo.completed is False


def test_update_changes_only_sent_fields(repository):
    updated = repository.update(2, TodoUpdate(**TodoPayloadMother.toggle()))

    assert updated.model_dump() == {**SEED[1], "completed": True}


def test_update_missing_raises(repository):
    with pytest.raises(TodoNotFoundError):
        repository.update(99, TodoUpdate(**TodoPayloadMother.toggle()))


def test_delete_removes_todo(repository):
    repository.delete(1)

    assert [t.id for t in repository.get_all()] == [2]


def test_delete_missing_raises(repository):
    with pytest.raises(TodoNotFoundError):
        repository.delete(99)


def test_writes_are_persisted_to_file(repository, data_file):
    repository.create(TodoCreate(**TodoPayloadMother.create("Persisted")))
    repository.update(1, TodoUpdate(favorite=True))
    repository.delete(2)

    reloaded = JsonTodoRepository(data_file)
    reloaded.load()

    assert [t.model_dump() for t in reloaded.get_all()] == [
        {**SEED[0], "favorite": True},
        TodoMother.pending(3, title="Persisted", description=None),
    ]


def test_failed_write_leaves_file_and_memory_unchanged(repository, data_file, monkeypatch):
    original_file = data_file.read_text(encoding="utf-8")

    def crash(*args, **kwargs):
        raise OSError("disk full")

    monkeypatch.setattr("app.repositories.todo_json_repository.os.replace", crash)

    with pytest.raises(OSError):
        repository.create(TodoCreate(**TodoPayloadMother.create("Lost")))

    assert data_file.read_text(encoding="utf-8") == original_file
    assert [t.model_dump() for t in repository.get_all()] == SEED


def test_writes_leave_no_temporary_files(repository, data_file):
    repository.create(TodoCreate(**TodoPayloadMother.create("New")))
    repository.update(1, TodoUpdate(favorite=True))
    repository.delete(2)

    assert [p.name for p in data_file.parent.iterdir()] == [data_file.name]
