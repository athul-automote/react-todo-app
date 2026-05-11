import type { Todo } from '../types/todo';
import { useTodoStore } from '../store/todoStore';

interface Props {
  todo: Todo;
}

export default function TodoItem({ todo }: Props) {
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const removeTodo = useTodoStore((s) => s.removeTodo);

  return (
    <li className="flex items-center gap-3 px-4 py-3 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow group">
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => toggleTodo(todo.id)}
        className="w-4 h-4 accent-indigo-600 cursor-pointer shrink-0"
      />
      <span
        className={`flex-1 text-sm ${
          todo.completed ? 'line-through text-gray-400' : 'text-gray-800'
        }`}
      >
        {todo.title}
      </span>
      <button
        onClick={() => removeTodo(todo.id)}
        aria-label="Delete task"
        className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-red-500 transition-all text-lg leading-none"
      >
        ×
      </button>
    </li>
  );
}
