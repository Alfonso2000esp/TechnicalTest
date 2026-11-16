import { useState, type FormEvent } from "react";

interface TodoFormProps {
  onAdd: (title: string) => Promise<boolean>;
}

export function TodoForm({ onAdd }: TodoFormProps) {
  const [title, setTitle] = useState("");

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!title.trim()) return;

    if (await onAdd(title)) setTitle("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-1 gap-2">
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Add a new task..."
        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
      >
        Add
      </button>
    </form>
  );
}
