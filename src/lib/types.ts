export type ViewOption = 'month' | 'week' | 'day';

export interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  description?: string;
  color?: string; // Optional: for event-specific coloring
  isAllDay?: boolean;
}

export interface SuggestedTime {
  startTime: string; // ISO format
  endTime: string; // ISO format
  reason: string;
}
