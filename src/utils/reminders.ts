import type { Todo } from '../types/todo';

// Max lookahead for scheduling in-session notifications (24 hours)
const MAX_MS = 24 * 60 * 60 * 1000;

const scheduled = new Set<string>();

export async function requestNotificationPermission(): Promise<boolean> {
  if (!('Notification' in window)) return false;
  if (Notification.permission === 'granted') return true;
  if (Notification.permission === 'denied') return false;
  const result = await Notification.requestPermission();
  return result === 'granted';
}

export function scheduleReminders(todos: Todo[]): void {
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const now = Date.now();

  for (const todo of todos) {
    if (todo.completed || !todo.dueDate || scheduled.has(todo.id)) continue;

    const due = new Date(todo.dueDate).getTime();
    const delay = due - now;

    // Only schedule if due within the next 24 hours and not already past
    if (delay > 0 && delay <= MAX_MS) {
      scheduled.add(todo.id);
      setTimeout(() => {
        new Notification('Task due now', {
          body: todo.title,
          icon: '/favicon.svg',
        });
        scheduled.delete(todo.id);
      }, delay);
    }
  }
}

export function cancelReminder(id: string): void {
  scheduled.delete(id);
}
