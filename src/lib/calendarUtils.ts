import { addDays, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, format, subDays, addMonths, subMonths, set } from 'date-fns';
import type { CalendarEvent } from './types';

export const getDaysInMonthView = (date: Date): Date[][] => {
  const startMonth = startOfMonth(date);
  const endMonth = endOfMonth(date);
  const startDate = startOfWeek(startMonth, { weekStartsOn: 0 }); // Sunday
  const endDate = endOfWeek(endMonth, { weekStartsOn: 0 });

  const days: Date[] = eachDayOfInterval({ start: startDate, end: endDate });
  const weeks: Date[][] = [];
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7));
  }
  return weeks;
};

export const initialEvents: CalendarEvent[] = [
  {
    id: '1',
    title: 'Team Meeting',
    start: set(new Date(), { hours: 10, minutes: 0, seconds: 0, milliseconds: 0 }),
    end: set(new Date(), { hours: 11, minutes: 0, seconds: 0, milliseconds: 0 }),
    description: 'Weekly team sync',
    color: 'hsl(var(--chart-1))',
  },
  {
    id: '2',
    title: 'Lunch with Client',
    start: set(addDays(new Date(), 1), { hours: 12, minutes: 30, seconds: 0, milliseconds: 0 }),
    end: set(addDays(new Date(), 1), { hours: 13, minutes: 30, seconds: 0, milliseconds: 0 }),
    description: 'Discuss project updates',
    color: 'hsl(var(--chart-2))',
  },
  {
    id: '3',
    title: 'Doctor Appointment',
    start: set(subDays(new Date(), 2), { hours: 15, minutes: 0, seconds: 0, milliseconds: 0 }),
    end: set(subDays(new Date(), 2), { hours: 15, minutes: 45, seconds: 0, milliseconds: 0 }),
    color: 'hsl(var(--chart-3))',
    isAllDay: false,
  },
];

// Basic iCal generation (simplified)
export const eventsToICal = (events: CalendarEvent[]): string => {
  let icalContent = `BEGIN:VCALENDAR
VERSION:2.0
PRODID:-//ChronoFlow//NextJS App//EN
CALSCALE:GREGORIAN
`;

  events.forEach(event => {
    const formatDateToICal = (date: Date, isAllDay?: boolean) => {
      if (isAllDay) {
        return format(date, "yyyyMMdd");
      }
      return format(date, "yyyyMMdd'T'HHmmss'Z'"); // Assumes UTC for simplicity
    };

    icalContent += `BEGIN:VEVENT
UID:${event.id}@chronoflow.app
DTSTAMP:${formatDateToICal(new Date())}
DTSTART${event.isAllDay ? ';VALUE=DATE' : ''}:${formatDateToICal(event.start, event.isAllDay)}
DTEND${event.isAllDay ? ';VALUE=DATE' : ''}:${formatDateToICal(event.end, event.isAllDay)}
SUMMARY:${event.title}
${event.description ? `DESCRIPTION:${event.description}` : ''}
END:VEVENT
`;
  });

  icalContent += `END:VCALENDAR`;
  return icalContent;
};

// Placeholder for iCal parsing
export const parseICal = (icalString: string): CalendarEvent[] => {
  // In a real app, use a library like ical.js
  console.warn("iCal parsing is not fully implemented. This is a placeholder.");
  // Dummy parsing for demonstration
  const events: CalendarEvent[] = [];
  if (icalString.includes("SUMMARY:Sample Event")) {
    events.push({
      id: `imported-${Date.now()}`,
      title: "Sample Event from iCal",
      start: new Date(),
      end: addDays(new Date(),1),
      isAllDay: true,
    });
  }
  return events;
};

export { addMonths, subMonths, format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth, set };
