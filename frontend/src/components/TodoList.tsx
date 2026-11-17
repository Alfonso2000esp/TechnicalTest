import type { Todo } from "../types/todo";
import { TodoItem } from "./TodoItem";

interface TodoListProps {
  todos: Todo[];
  onToggleCompleted: (todo: Todo) => void;
  onToggleFavorite: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export function TodoList({ todos, onToggleCompleted, onToggleFavorite, onDelete }: TodoListProps) {
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
