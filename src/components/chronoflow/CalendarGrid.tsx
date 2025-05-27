"use client";

import { useCalendar } from '@/contexts/CalendarContext';
import MonthView from './MonthView';
import WeekView from './WeekView';
import DayView from './DayView';

export default function CalendarGrid() {
  const { selectedView } = useCalendar();

  return (
    <div className="flex-grow p-4">
      {selectedView === 'month' && <MonthView />}
      {selectedView === 'week' && <WeekView />}
      {selectedView === 'day' && <DayView />}
    </div>
  );
}
