# Todo App

A todo list manager: FastAPI backend + React (Vite, TypeScript, Tailwind) frontend.
Tasks can be created with an optional description, completed, marked as favorite and deleted;
favorites are shown in their own section. Data is persisted in a JSON file.

## Run

### With Docker (recommended)

```bash
docker compose up --build
```

- App: http://localhost:8080
- API docs: http://localhost:8000/docs

Data lives in the `todos-data` volume and survives restarts; `docker compose down -v` resets it.

### Without Docker

Requires Python 3.12+ and Node 20+.

```bash
cd backend
python -m venv .venv
source .venv/bin/activate          # Windows: .venv\Scripts\activate
pip install -r requirements-dev.txt

cd ../frontend
npm ci
npm run dev                        # frontend + backend; the venv must be active
```

- App: http://localhost:5173 (tasks load automatically, "Load Tasks" refreshes on demand)
- API docs: http://localhost:8000/docs

| Variable | Default | Used by |
|---|---|---|
| `VITE_API_URL` | `http://localhost:8000` | frontend (build time) |
| `CORS_ORIGINS` | `http://localhost:5173,http://127.0.0.1:5173` | backend |
| `TODOS_DATA_FILE` | `backend/app/todos.json` | backend |

## Test

```bash
cd backend     && pytest && ruff check . && ruff format --check .
cd ../frontend && npm test && npm run lint && npm run build
```

GitHub Actions runs the same checks on every push and pull request, and builds the Docker images.

## API

| Method | Path | Description |
|---|---|---|
| `GET` | `/todos` | List todos |
| `GET` | `/todos/{id}` | Get a todo (404 if missing) |
| `POST` | `/todos` | Create a todo (`title` required, `description` optional) → 201 |
| `PATCH` | `/todos/{id}` | Partial update: only the fields sent change → 200 / 404 / 422 |
| `DELETE` | `/todos/{id}` | Delete a todo → 204 / 404 |

## What was done

1. **Completion status** persisted through `PATCH /todos/{id}`.
2. **Delete** endpoint and a delete button on each task.
3. **Auto-load:** the list is fetched on page load and again after every create, delete or update.
4. **Descriptions and favorites:** optional description on creation, star toggle, and a "Favorites" section above "All tasks".

Also: validation (non-blank title, no `null` for required fields in `PATCH`), visible loading and error states,
restricted CORS, atomic file writes, Docker setup and CI.

## Design decisions

- **Repository pattern:** endpoints depend on a `TodoRepository` interface; `JsonTodoRepository` is loaded once in the FastAPI `lifespan`, kept in memory and written to disk on every change. Swapping it for a database does not touch the routers.
- **Dependency injection by interface:** a generic `provide(Interface)` dependency resolves implementations registered at startup; tests replace them with `dependency_overrides`.
- **Domain errors mapped in one place:** errors inherit `DomainError` and a single exception handler maps them to HTTP status codes; endpoints declare their errors for the OpenAPI docs.
- **Atomic persistence:** the JSON is written to a temp file and swapped with `os.replace`; memory is updated only after a successful write.
- **Backend as the source of truth:** the frontend refetches the list after every change instead of patching local state. State and API calls live in a `useTodos` hook; components are presentational.
- **Containers:** nginx serves the frontend and proxies `/api` to the backend, so the browser talks to a single origin (no CORS in containers). Non-root images, multi-stage frontend build.
- **Tests:** pytest (repository + API, isolated from the real data file, Object Mother for test data) and Vitest + Testing Library (components, API client, app integration).

## Known limitations

- Single process only: state is in memory and in one file, so the backend cannot be scaled horizontally (in Kubernetes it would need `replicas: 1`). A database would be the next step.
- The whole JSON file is rewritten on every change; fine for this size, not for large data sets.
- A todo's title and description cannot be edited after creation.
