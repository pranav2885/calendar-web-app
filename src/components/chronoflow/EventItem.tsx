"use client";

import type { CalendarEvent } from '@/lib/types';
import { useCalendar } from '@/contexts/CalendarContext';
import { format } from 'date-fns';
import { Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface EventItemProps {
  event: CalendarEvent;
}

export default function EventItem({ event }: EventItemProps) {
  const { openEventModal, deleteEvent } = useCalendar();

  const eventStyle = {
    backgroundColor: event.color || 'hsl(var(--primary))', // Default to primary if no color
    color: 'hsl(var(--primary-foreground))', // Assuming primary-foreground is light
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent opening edit modal
    deleteEvent(event.id);
  };

  return (
    <AlertDialog>
      <div
        className="p-2 mb-1 rounded-md text-xs cursor-pointer hover:opacity-80 transition-opacity shadow-sm"
        style={eventStyle}
        onClick={() => openEventModal(event)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && openEventModal(event)}
        title={`${event.title} - ${format(event.start, 'p')} to ${format(event.end, 'p')}`}
      >
        <div className="flex justify-between items-center">
          <span className="font-semibold truncate flex-grow">{event.title}</span>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5 p-0 text-primary-foreground hover:bg-primary-foreground/20"
              onClick={(e) => e.stopPropagation()} // Keep this to ensure trigger works
              aria-label="Delete event"
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </AlertDialogTrigger>
        </div>
        {!event.isAllDay && (
          <p className="truncate">{format(event.start, 'p')} - {format(event.end, 'p')}</p>
        )}
         {event.isAllDay && <p className="truncate">All day</p>}
      </div>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the event "{event.title}".
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
