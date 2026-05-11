import { useTodoStore } from '../store/todoStore';
import TodoItem from './TodoItem';

export default function TodoList() {
  const { todos, loading, error } = useTodoStore((s) => ({
    todos: s.todos,
    loading: s.loading,
    error: s.error,
  }));

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <p className="text-center text-red-500 py-8 text-sm">{error}</p>
    );
  }

  if (todos.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8 text-sm">
        No tasks yet — add one above!
      </p>
    );
  }

  const done = todos.filter((t) => t.completed).length;

  return (
    <div>
      <p className="text-xs text-gray-400 mb-3">
        {done} / {todos.length} completed
      </p>
      <ul className="flex flex-col gap-2">
        {todos.map((todo) => (
          <TodoItem key={todo.id} todo={todo} />
        ))}
      </ul>
    </div>
  );
}
