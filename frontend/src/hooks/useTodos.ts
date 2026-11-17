import { useCallback, useEffect, useState } from "react";
import { createTodo, deleteTodo, getTodos, updateTodo } from "../api/todo";
import type { NewTodo, Todo } from "../types/todo";

export const ERROR_MESSAGES = {
  load: "Could not load the tasks. Is the backend running?",
  create: "Could not create the task. Please try again.",
  update: "Could not update the task. Please try again.",
  delete: "Could not delete the task. Please try again.",
} as const;

export function useTodos() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fail = useCallback((message: string, cause: unknown) => {
    console.error(cause);
    setError(message);
  }, []);

  const reload = useCallback(async () => {
    try {
      setTodos(await getTodos());
      setError(null);
    } catch (cause) {
      fail(ERROR_MESSAGES.load, cause);
    } finally {
      setLoading(false);
    }
  }, [fail]);

  useEffect(() => {
    void reload();
  }, [reload]);

  const mutate = useCallback(
    async (change: () => Promise<unknown>, failureMessage: string): Promise<boolean> => {
      try {
        await change();
      } catch (cause) {
        fail(failureMessage, cause);
        return false;
      }
      await reload();
      return true;
    },
    [fail, reload]
  );

  const add = (todo: NewTodo) => mutate(() => createTodo(todo), ERROR_MESSAGES.create);

  const toggleCompleted = (todo: Todo) =>
    mutate(() => updateTodo(todo.id, { completed: !todo.completed }), ERROR_MESSAGES.update);

  const toggleFavorite = (todo: Todo) =>
    mutate(() => updateTodo(todo.id, { favorite: !todo.favorite }), ERROR_MESSAGES.update);

  const remove = (id: number) => mutate(() => deleteTodo(id), ERROR_MESSAGES.delete);

  const dismissError = () => setError(null);

  return {
    todos,
    loading,
    error,
    dismissError,
    reload,
    add,
    toggleCompleted,
    toggleFavorite,
    remove,
  };
}
