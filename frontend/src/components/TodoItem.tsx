import type { Todo } from "../types/todo";
import { TrashIcon } from "./icons/TrashIcon";

interface TodoItemProps {
  todo: Todo;
  onToggleCompleted: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggleCompleted, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleCompleted(todo)}
        className="cursor-pointer"
      />
      <span className={`flex-1 ${todo.completed ? "line-through text-gray-400" : ""}`}>
        {todo.title}
      </span>
      <button
        onClick={() => onDelete(todo.id)}
        aria-label={`Delete "${todo.title}"`}
        title="Delete"
        className="p-2 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 hover:text-red-700 hover:border-red-300 focus:outline-none focus:ring-2 focus:ring-red-400 transition cursor-pointer"
      >
        <TrashIcon />
      </button>
    </li>
  );
}
