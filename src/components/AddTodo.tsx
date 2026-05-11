import { useState, type FormEvent } from 'react';
import { useTodoStore } from '../store/todoStore';

export default function AddTodo() {
  const [title, setTitle] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);
  const addTodo = useTodoStore((s) => s.addTodo);

  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    const trimmed = title.trim();
    if (!trimmed) return;
    await addTodo(trimmed, dueDate || undefined);
    setTitle('');
    setDueDate('');
    setShowDatePicker(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6">
      <div className="flex gap-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task..."
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm"
        />
        {/* Toggle date picker */}
        <button
          type="button"
          onClick={() => setShowDatePicker((v) => !v)}
          title="Set due date"
          className={`px-3 py-2 rounded-lg border text-sm transition-colors ${
            showDatePicker || dueDate
              ? 'bg-indigo-100 border-indigo-300 text-indigo-700'
              : 'border-gray-300 text-gray-400 hover:text-indigo-600 hover:border-indigo-300'
          }`}
        >
          📅
        </button>
        <button
          type="submit"
          disabled={!title.trim()}
          className="px-4 py-2 bg-indigo-600 text-white text-sm font-medium rounded-lg hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          Add
        </button>
      </div>

      {showDatePicker && (
        <div className="mt-2 flex items-center gap-2">
          <input
            type="date"
            value={dueDate}
            min={today}
            onChange={(e) => setDueDate(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 text-gray-700"
          />
          {dueDate && (
            <button
              type="button"
              onClick={() => setDueDate('')}
              className="text-xs text-gray-400 hover:text-red-500 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </form>
  );
}
