"use client";

import { useCalendar } from '@/contexts/CalendarContext';
import { getDaysInMonthView, format, addDays, startOfWeek, endOfWeek, eachDayOfInterval, startOfMonth, endOfMonth } from '@/lib/calendarUtils';
import { cn } from '@/lib/utils';
import EventItem from './EventItem';
import type { CalendarEvent } from '@/lib/types';
import { isSameDay, isSameMonth } from 'date-fns';

export default function MonthView() {
  const { currentDate, events, openEventModal } = useCalendar();
  const weeks = getDaysInMonthView(currentDate);
  const today = new Date();

  const getEventsForDay = (day: Date): CalendarEvent[] => {
    return events
      .filter(event => isSameDay(event.start, day) || (event.start < day && event.end > day) || (event.isAllDay && isSameDay(event.start, day)))
      .sort((a, b) => a.start.getTime() - b.start.getTime());
  };

  const dayHeaders = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="flex-grow overflow-auto bg-card shadow-lg rounded-lg p-1 sm:p-2 md:p-4">
      <div className="grid grid-cols-7 gap-px border-b border-border">
        {dayHeaders.map(header => (
          <div key={header} className="py-2 text-center font-medium text-sm text-muted-foreground">
            {header}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-7 grid-rows-5 gap-px">
        {weeks.map((week, weekIndex) =>
          week.map((day, dayIndex) => {
            const dayEvents = getEventsForDay(day);
            return (
              <div
                key={`${weekIndex}-${dayIndex}`}
                className={cn(
                  "relative p-2 border border-border min-h-[100px] sm:min-h-[120px] flex flex-col",
                  !isSameMonth(day, currentDate) && "bg-muted/50 text-muted-foreground",
                  isSameDay(day, today) && "bg-accent/20",
                  "hover:bg-secondary/30 transition-colors duration-150 ease-in-out"
                )}
                onClick={() => openEventModal({ title: '', start: day, end: addDays(day,1)})} // Open modal to create event on this day
              >
                <span
                  className={cn(
                    "self-start mb-1 text-xs sm:text-sm font-medium",
                    isSameDay(day, today) && "text-primary font-bold rounded-full bg-primary text-primary-foreground h-6 w-6 flex items-center justify-center"
                  )}
                >
                  {format(day, 'd')}
                </span>
                <div className="flex-grow overflow-y-auto space-y-1 max-h-[80px] sm:max-h-[100px]">
                  {dayEvents.map(event => (
                    <EventItem key={event.id} event={event} />
                  ))}
                  {dayEvents.length === 0 && <div className="text-xs text-muted-foreground/70 h-full flex items-center justify-center">No events</div>}
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
