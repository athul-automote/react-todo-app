import { useState } from 'react';
import type { Todo } from '../types/todo';
import { useTodoStore } from '../store/todoStore';
import { getDueDateStatus, formatDueDate, dueDateBadgeClass } from '../utils/dueDate';

interface Props {
  todo: Todo;
}

export default function TodoItem({ todo }: Props) {
  const toggleTodo = useTodoStore((s) => s.toggleTodo);
  const removeTodo = useTodoStore((s) => s.removeTodo);
  const setDueDate = useTodoStore((s) => s.setDueDate);

  const [editingDate, setEditingDate] = useState(false);
  const [dateInput, setDateInput] = useState(todo.dueDate?.split('T')[0] ?? '');

  const status = getDueDateStatus(todo.dueDate);
  const today = new Date().toISOString().split('T')[0];

  const handleDateSave = async () => {
    await setDueDate(todo.id, dateInput || null);
    setEditingDate(false);
  };

  const handleDateKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') handleDateSave();
    if (e.key === 'Escape') setEditingDate(false);
  };

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

      {/* Due date area */}
      {!todo.completed && (
        <div className="flex items-center gap-1 shrink-0">
          {editingDate ? (
            <>
              <input
                type="date"
                value={dateInput}
                min={today}
                onChange={(e) => setDateInput(e.target.value)}
                onKeyDown={handleDateKeyDown}
                onBlur={handleDateSave}
                autoFocus
                className="px-2 py-0.5 text-xs border border-indigo-300 rounded focus:outline-none focus:ring-1 focus:ring-indigo-500"
              />
              {dateInput && (
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    setDateInput('');
                    setDueDate(todo.id, null);
                    setEditingDate(false);
                  }}
                  className="text-xs text-gray-400 hover:text-red-500"
                >
                  ×
                </button>
              )}
            </>
          ) : (
            <>
              {status && (
                <span
                  className={`text-xs px-2 py-0.5 rounded-full font-medium ${dueDateBadgeClass[status]}`}
                >
                  {formatDueDate(todo.dueDate!)}
                </span>
              )}
              {/* Pencil icon — edit due date */}
              <button
                type="button"
                onClick={() => {
                  setDateInput(todo.dueDate?.split('T')[0] ?? '');
                  setEditingDate(true);
                }}
                title="Edit due date"
                className="opacity-0 group-hover:opacity-100 text-gray-300 hover:text-indigo-500 transition-all text-xs"
              >
                ✎
              </button>
            </>
          )}
        </div>
      )}

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
