export type DueDateStatus = 'overdue' | 'today' | 'tomorrow' | 'upcoming' | null;

function toMidnight(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

export function getDueDateStatus(dueDate?: string): DueDateStatus {
  if (!dueDate) return null;

  const due = toMidnight(new Date(dueDate));
  const today = toMidnight(new Date());
  const diffDays = Math.round((due.getTime() - today.getTime()) / 86_400_000);

  if (diffDays < 0) return 'overdue';
  if (diffDays === 0) return 'today';
  if (diffDays === 1) return 'tomorrow';
  return 'upcoming';
}

export function formatDueDate(dueDate: string): string {
  const status = getDueDateStatus(dueDate);
  if (status === 'today') return 'Today';
  if (status === 'tomorrow') return 'Tomorrow';

  return new Date(dueDate).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

export const dueDateBadgeClass: Record<NonNullable<DueDateStatus>, string> = {
  overdue: 'bg-red-100 text-red-700',
  today: 'bg-amber-100 text-amber-700',
  tomorrow: 'bg-yellow-100 text-yellow-700',
  upcoming: 'bg-gray-100 text-gray-500',
};
