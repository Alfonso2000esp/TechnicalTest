import type { Todo } from "../types/todo";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  emptyMessage: string;
  onToggleCompleted: (todo: Todo) => void;
  onToggleFavorite: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export function TodoList({
  todos,
  emptyMessage,
  onToggleCompleted,
  onToggleFavorite,
  onDelete,
}: TodoListProps) {
  if (todos.length === 0) {
    return <p className="text-sm text-gray-500 italic">{emptyMessage}</p>;
  }

  return (
    <ul className="space-y-2">
      {todos.map((todo) => (
        <TodoItem
          key={todo.id}
          todo={todo}
          onToggleCompleted={onToggleCompleted}
          onToggleFavorite={onToggleFavorite}
          onDelete={onDelete}
        />
      ))}
    </ul>
  );
}
