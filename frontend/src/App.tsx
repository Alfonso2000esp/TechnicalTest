// src/App.tsx
import { useCallback, useEffect, useState } from "react";
import type { Todo } from "./types/todo";
import { getTodos, createTodo, updateTodo, deleteTodo } from "./api/todo";

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState("");

  const loadTodos = useCallback(() => {
    getTodos()
      .then(setTodos)
      .catch((error) => console.error(error));
  }, []);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  const addTodo = () => {
    if (!title.trim()) return;

    createTodo(title)
      .then(() => {
        setTitle("");
        loadTodos();
      })
      .catch((error) => console.error(error));
  };

  const toggleTodo = (id: number) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    updateTodo(id, { completed: !todo.completed })
      .then(loadTodos)
      .catch((error) => console.error(error));
  };

  const removeTodo = (id: number) => {
    deleteTodo(id)
      .then(loadTodos)
      .catch((error) => console.error(error));
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">ToDo List</h1>

        <div className="flex gap-2 mb-8">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Add a new task..."
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={addTodo}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Add
          </button>
          <button
            onClick={loadTodos}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Load Tasks
          </button>
        </div>

        <ul className="space-y-2">
          {todos.map((todo) => (
            <li
              key={todo.id}
              className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200"
            >
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodo(todo.id)}
                className="cursor-pointer"
              />
              <span className={`flex-1 ${todo.completed ? "line-through text-gray-400" : ""}`}>
                {todo.title}
              </span>
              <button
                onClick={() => removeTodo(todo.id)}
                aria-label={`Delete "${todo.title}"`}
                title="Delete"
                className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition cursor-pointer"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-4 h-4"
                  aria-hidden="true"
                >
                  <path d="M3 6h18" />
                  <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                  <path d="M10 11v6" />
                  <path d="M14 11v6" />
                </svg>
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
