import { useCallback, useEffect, useState } from "react";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../api/todo";
import type { NewTodo, Todo } from "../types/todo";

/**
 * State and actions for the todo list.
 *
 * The backend is the single source of truth: the list is fetched on mount and
 * again after every change, instead of patching the local state.
 */
export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);

  const reload = useCallback(async () => {
    try {
      setTodos(await getTodos());
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    void reload();
  }, [reload]);

  /** Runs a change against the API and reloads the list. Resolves to false if it failed. */
  const mutate = useCallback(
    async (change: () => Promise<unknown>): Promise<boolean> => {
      try {
        await change();
        await reload();
        return true;
      } catch (error) {
        console.error(error);
        return false;
      }
    },
    [reload]
  );

  const add = (todo: NewTodo) => mutate(() => createTodo(todo));

  const toggleCompleted = (todo: Todo) =>
    mutate(() => updateTodo(todo.id, { completed: !todo.completed }));

  const toggleFavorite = (todo: Todo) =>
    mutate(() => updateTodo(todo.id, { favorite: !todo.favorite }));

  const remove = (id: number) => mutate(() => deleteTodo(id));

  return { todos, reload, add, toggleCompleted, toggleFavorite, remove };
}
