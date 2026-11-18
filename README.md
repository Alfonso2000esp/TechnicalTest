# Todo App

A todo list manager: FastAPI backend + React (Vite, TypeScript, Tailwind) frontend.
Tasks can be created with an optional description, completed, marked as favorite and deleted;
favorites are shown in their own section. Data is persisted in a JSON file.
All tasks in `INSTRUCTIONS.md` are implemented.

## Run

### With Docker

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

## Design decisions

- **Repository pattern:** endpoints depend on a `TodoRepository` interface, injected by type through FastAPI `Depends`. `JsonTodoRepository` is loaded once in the `lifespan`, kept in memory and written to disk on every change, so swapping it for a database does not touch the routers, and tests replace it with `dependency_overrides`.
- **Domain errors mapped in one place:** errors inherit `DomainError` and know nothing about HTTP; a single exception handler maps them to status codes.
- **Atomic persistence:** the JSON is written to a temp file and swapped with `os.replace`; memory is updated only after a successful write.
- **Backend as the source of truth:** the frontend refetches the list after every change instead of patching local state. Favorites are a filtered view, so they also appear in "All tasks".
- **Containers:** nginx serves the frontend and proxies `/api` to the backend, so the browser talks to a single origin (no CORS). Non-root images, multi-stage frontend build.
- **Tests:** pytest for the repository and the API, Vitest + Testing Library for components and the app; test data comes from Object Mothers and never touches the real data file.

## Known limitations

- Single process only: state lives in memory and in one file, so the backend cannot scale horizontally (`replicas: 1` in Kubernetes). A database would be the next step.
- The whole JSON file is rewritten on every change: fine at this size, not for large data sets.
- Ids are `max(id) + 1`, so the newest id is reused after deleting it; a persisted sequence would fix it.
- Title and description cannot be edited after creation.
