import { useTodoStore } from '../store/todoStore';
import TodoItem from './TodoItem';
import { getDueDateStatus } from '../utils/dueDate';

export default function TodoList() {
  const todos = useTodoStore((s) => s.todos);
  const loading = useTodoStore((s) => s.loading);
  const error = useTodoStore((s) => s.error);

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return <p className="text-center text-red-500 py-8 text-sm">{error}</p>;
  }

  if (todos.length === 0) {
    return (
      <p className="text-center text-gray-400 py-8 text-sm">
        No tasks yet — add one above!
      </p>
    );
  }

  const done = todos.filter((t) => t.completed).length;
  const overdueCount = todos.filter(
    (t) => !t.completed && getDueDateStatus(t.dueDate) === 'overdue'
  ).length;

  return (
    <div>
      {overdueCount > 0 && (
        <div className="flex items-center gap-2 mb-4 px-4 py-2 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm">
          <span>⚠</span>
          <span>
            {overdueCount} task{overdueCount > 1 ? 's' : ''} overdue
          </span>
        </div>
      )}

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
