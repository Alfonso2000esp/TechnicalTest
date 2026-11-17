import { useState, type FormEvent } from "react";
import type { NewTodo } from "../types/todo";

const TITLE_MAX_LENGTH = 200;

const nullIfBlank = (value: string) => value.trim() || null;

interface TodoFormProps {
  onAdd: (todo: NewTodo) => Promise<boolean>;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isTitleBlank = title.trim() === "";

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (isTitleBlank) return;

    const created = await onAdd({
      title: title.trim(),
      description: nullIfBlank(description),
    });

    if (created) {
      setTitle("");
      setDescription("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 flex-col gap-2">
      <div className="flex gap-2">
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          aria-label="Title"
          required
          maxLength={TITLE_MAX_LENGTH}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={isTitleBlank}
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition cursor-pointer disabled:bg-blue-300 disabled:cursor-not-allowed"
        >
          Add
        </button>
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description (optional)"
        aria-label="Description"
        rows={2}
        className="px-4 py-2 border border-gray-300 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </form>
  );
}
