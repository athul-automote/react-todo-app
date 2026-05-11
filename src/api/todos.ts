import axios from 'axios';
import type { Todo } from '../types/todo';

const api = axios.create({
  baseURL: 'https://jsonplaceholder.typicode.com',
});

export async function fetchTodos(): Promise<Todo[]> {
  const { data } = await api.get<Todo[]>('/todos', { params: { _limit: 20 } });
  return data;
}

export async function createTodo(title: string): Promise<Todo> {
  const { data } = await api.post<Todo>('/todos', {
    title,
    completed: false,
    userId: 1,
  });
  return data;
}

export async function deleteTodo(id: number): Promise<void> {
  await api.delete(`/todos/${id}`);
}

export async function toggleTodo(id: number, completed: boolean): Promise<Todo> {
  const { data } = await api.patch<Todo>(`/todos/${id}`, { completed });
  return data;
}
