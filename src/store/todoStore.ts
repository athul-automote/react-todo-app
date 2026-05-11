import { create } from 'zustand';
import type { Todo } from '../types/todo';
import * as api from '../api/todos';

interface TodoState {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  loadTodos: () => Promise<void>;
  addTodo: (title: string) => Promise<void>;
  removeTodo: (id: number) => Promise<void>;
  toggleTodo: (id: number) => Promise<void>;
}

export const useTodoStore = create<TodoState>((set, get) => ({
  todos: [],
  loading: false,
  error: null,

  loadTodos: async () => {
    set({ loading: true, error: null });
    try {
      const todos = await api.fetchTodos();
      set({ todos, loading: false });
    } catch {
      set({ error: 'Failed to load todos.', loading: false });
    }
  },

  addTodo: async (title: string) => {
    try {
      const newTodo = await api.createTodo(title);
      // JSONPlaceholder always returns id 201; prepend with a unique local id
      const localTodo: Todo = { ...newTodo, id: Date.now() };
      set({ todos: [localTodo, ...get().todos] });
    } catch {
      set({ error: 'Failed to add todo.' });
    }
  },

  removeTodo: async (id: number) => {
    try {
      await api.deleteTodo(id);
      set({ todos: get().todos.filter((t) => t.id !== id) });
    } catch {
      set({ error: 'Failed to delete todo.' });
    }
  },

  toggleTodo: async (id: number) => {
    const todo = get().todos.find((t) => t.id === id);
    if (!todo) return;
    try {
      await api.toggleTodo(id, !todo.completed);
      set({
        todos: get().todos.map((t) =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ),
      });
    } catch {
      set({ error: 'Failed to update todo.' });
    }
  },
}));
