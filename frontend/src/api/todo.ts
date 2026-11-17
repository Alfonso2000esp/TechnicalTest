import type { NewTodo, Todo, TodoUpdate } from "../types/todo";

const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8000";
const BASE_URL = `${API_URL}/todos`;

export const getTodos = async (): Promise<Todo[]> => {
  const res = await fetch(BASE_URL);
  if (!res.ok) throw new Error("Error fetching todos");
  return res.json();
};

export const createTodo = async (todo: NewTodo): Promise<Todo> => {
  const res = await fetch(BASE_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ ...todo, completed: false }),
  });
  if (!res.ok) throw new Error("Error creating todo");
  return res.json();
};

export const updateTodo = async (
  id: number,
  changes: TodoUpdate
): Promise<Todo> => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(changes),
  });
  if (!res.ok) throw new Error(`Error updating todo ${id}`);
  return res.json();
};

export const deleteTodo = async (id: number): Promise<void> => {
  const res = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
  if (!res.ok) throw new Error(`Error deleting todo ${id}`);
};
