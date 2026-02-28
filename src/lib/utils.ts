import { Timestamp } from 'firebase/firestore';
import { format, isAfter, isBefore, isToday, isTomorrow, isYesterday } from 'date-fns';

export function generatePairingCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

export function formatDueDate(timestamp: Timestamp | null): string {
  if (!timestamp) return '';
  const date = timestamp.toDate();
  if (isToday(date)) return 'Today';
  if (isTomorrow(date)) return 'Tomorrow';
  if (isYesterday(date)) return 'Yesterday';
  return format(date, 'MMM d');
}

export function isDueDatePast(timestamp: Timestamp | null): boolean {
  if (!timestamp) return false;
  const now = new Date();
  now.setHours(23, 59, 59, 999);
  return isAfter(timestamp.toDate(), now) === false && !isToday(timestamp.toDate());
}

export function isDueDateSoon(timestamp: Timestamp | null): boolean {
  if (!timestamp) return false;
  return isToday(timestamp.toDate()) || isTomorrow(timestamp.toDate());
}