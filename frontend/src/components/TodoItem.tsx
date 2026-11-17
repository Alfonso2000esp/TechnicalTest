import type { Todo } from "../types/todo";
import { StarIcon } from "./icons/StarIcon";
import { TrashIcon } from "./icons/TrashIcon";

interface TodoItemProps {
  todo: Todo;
  onToggleCompleted: (todo: Todo) => void;
  onToggleFavorite: (todo: Todo) => void;
  onDelete: (id: number) => void;
}

export function TodoItem({ todo, onToggleCompleted, onToggleFavorite, onDelete }: TodoItemProps) {
  return (
    <li className="flex items-center gap-2 bg-gray-50 p-3 rounded-lg border border-gray-200">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggleCompleted(todo)}
        className="cursor-pointer"
      />
      <div className="flex-1 min-w-0">
        <span className={todo.completed ? "line-through text-gray-400" : ""}>{todo.title}</span>
        {todo.description && (
          <p className="text-sm text-gray-500 whitespace-pre-line break-words">
            {todo.description}
          </p>
        )}
      </div>
      <button
        onClick={() => onToggleFavorite(todo)}
        aria-label={`Favorite "${todo.title}"`}
        aria-pressed={todo.favorite}
        title={todo.favorite ? "Remove from favorites" : "Add to favorites"}
        className={`p-2 rounded-lg border transition cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-400 ${
          todo.favorite
            ? "border-yellow-300 text-yellow-500 bg-yellow-50 hover:bg-yellow-100"
            : "border-gray-200 text-gray-400 hover:bg-yellow-50 hover:text-yellow-500 hover:border-yellow-300"
        }`}
      >
        <StarIcon filled={todo.favorite} />
      </button>
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
