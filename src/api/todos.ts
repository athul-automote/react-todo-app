import axios from 'axios';
import type { Todo } from '../types/todo';

const api = axios.create({ baseURL: '' });

export async function fetchTodos(): Promise<Todo[]> {
  const { data } = await api.get<Todo[]>('/api/todos');
  return data;
}

export async function createTodo(title: string, dueDate?: string): Promise<Todo> {
  const { data } = await api.post<Todo>('/api/todos', {
    title,
    ...(dueDate ? { dueDate } : {}),
  });
  return data;
}

export async function updateTodo(
  id: string,
  patch: { completed?: boolean; dueDate?: string | null }
): Promise<Todo> {
  const { data } = await api.patch<Todo>(`/api/todos/${id}`, patch);
  return data;
}

export async function deleteTodo(id: string): Promise<void> {
  await api.delete(`/api/todos/${id}`);
}
