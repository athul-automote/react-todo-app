import { useEffect } from 'react';
import { useTodoStore } from '../store/todoStore';
import AddTodo from '../components/AddTodo';
import TodoList from '../components/TodoList';

export default function Home() {
  const loadTodos = useTodoStore((s) => s.loadTodos);

  useEffect(() => {
    loadTodos();
  }, [loadTodos]);

  return (
    <main className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-1">My Tasks</h1>
      <p className="text-sm text-gray-500 mb-6">Loaded from JSONPlaceholder API</p>
      <AddTodo />
      <TodoList />
    </main>
  );
}
