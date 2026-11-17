import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import { useTodos } from "./hooks/useTodos";

function App() {
  const { todos, reload, add, toggleCompleted, toggleFavorite, remove } = useTodos();

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">ToDo List</h1>

        <div className="flex items-start gap-2 mb-8">
          <TodoForm onAdd={add} />
          <button
            onClick={reload}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Load Tasks
          </button>
        </div>

        <TodoList
          todos={todos}
          onToggleCompleted={toggleCompleted}
          onToggleFavorite={toggleFavorite}
          onDelete={remove}
        />
      </div>
    </div>
  );
}

export default App;
