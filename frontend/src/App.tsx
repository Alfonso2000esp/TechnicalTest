import { ErrorAlert } from "./components/ErrorAlert";
import { TodoForm } from "./components/TodoForm";
import { TodoList } from "./components/TodoList";
import { TodoSection } from "./components/TodoSection";
import { useTodos } from "./hooks/useTodos";

function App() {
  const {
    todos,
    loading,
    error,
    dismissError,
    reload,
    add,
    toggleCompleted,
    toggleFavorite,
    remove,
  } = useTodos();

  const favorites = todos.filter((todo) => todo.favorite);

  const actions = {
    onToggleCompleted: toggleCompleted,
    onToggleFavorite: toggleFavorite,
    onDelete: remove,
  };

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

        {error && <ErrorAlert message={error} onDismiss={dismissError} />}

        {loading ? (
          <p role="status" className="text-sm text-gray-500">
            Loading tasks…
          </p>
        ) : (
          <>
            <TodoSection title="Favorites">
              <TodoList todos={favorites} emptyMessage="No favorite tasks yet" {...actions} />
            </TodoSection>

            <TodoSection title="All tasks">
              <TodoList todos={todos} emptyMessage="No tasks yet" {...actions} />
            </TodoSection>
          </>
        )}
      </div>
    </div>
  );
}

export default App;
