"use client";

import type { ReactNode } from 'react';
import React, { createContext, useContext, useState, useCallback } from 'react';
import type { CalendarEvent, ViewOption, SuggestedTime } from '@/lib/types';
import { initialEvents } from '@/lib/calendarUtils';
import { useToast } from "@/hooks/use-toast";

interface CalendarContextType {
  currentDate: Date;
  setCurrentDate: (date: Date) => void;
  selectedView: ViewOption;
  setSelectedView: (view: ViewOption) => void;
  events: CalendarEvent[];
  addEvent: (event: Omit<CalendarEvent, 'id'>) => void;
  updateEvent: (event: CalendarEvent) => void;
  deleteEvent: (eventId: string) => void;
  isEventModalOpen: boolean;
  openEventModal: (event?: CalendarEvent) => void;
  closeEventModal: () => void;
  editingEvent: CalendarEvent | null;
  isSchedulerModalOpen: boolean;
  openSchedulerModal: () => void;
  closeSchedulerModal: () => void;
  suggestedTimes: SuggestedTime[];
  setSuggestedTimes: (times: SuggestedTime[]) => void;
  isLoadingAISuggestions: boolean;
  setIsLoadingAISuggestions: (loading: boolean) => void;
}

const CalendarContext = createContext<CalendarContextType | undefined>(undefined);

export const CalendarProvider = ({ children }: { children: ReactNode }) => {
  const [currentDate, setCurrentDateState] = useState(new Date());
  const [selectedView, setSelectedViewState] = useState<ViewOption>('month');
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<CalendarEvent | null>(null);
  const [isSchedulerModalOpen, setIsSchedulerModalOpen] = useState(false);
  const [suggestedTimes, setSuggestedTimes] = useState<SuggestedTime[]>([]);
  const [isLoadingAISuggestions, setIsLoadingAISuggestions] = useState(false);
  const { toast } = useToast();

  const setCurrentDate = useCallback((date: Date) => setCurrentDateState(date), []);
  const setSelectedView = useCallback((view: ViewOption) => setSelectedViewState(view), []);

  const addEvent = useCallback((eventData: Omit<CalendarEvent, 'id'>) => {
    setEvents(prevEvents => [...prevEvents, { ...eventData, id: Date.now().toString() }]);
    toast({ title: "Event Created", description: `"${eventData.title}" has been added.` });
  }, [toast]);

  const updateEvent = useCallback((updatedEvent: CalendarEvent) => {
    setEvents(prevEvents =>
      prevEvents.map(event => (event.id === updatedEvent.id ? updatedEvent : event))
    );
    toast({ title: "Event Updated", description: `"${updatedEvent.title}" has been updated.` });
  }, [toast]);

  const deleteEvent = useCallback((eventId: string) => {
    const eventToDelete = events.find(e => e.id === eventId);
    setEvents(prevEvents => prevEvents.filter(event => event.id !== eventId));
    if (eventToDelete) {
       toast({ title: "Event Deleted", description: `"${eventToDelete.title}" has been deleted.`, variant: "destructive" });
    }
  }, [events, toast]);

  const openEventModal = useCallback((event?: CalendarEvent) => {
    setEditingEvent(event || null);
    setIsEventModalOpen(true);
  }, []);

  const closeEventModal = useCallback(() => {
    setIsEventModalOpen(false);
    setEditingEvent(null);
  }, []);

  const openSchedulerModal = useCallback(() => setIsSchedulerModalOpen(true), []);
  const closeSchedulerModal = useCallback(() => {
    setIsSchedulerModalOpen(false);
    setSuggestedTimes([]); // Clear suggestions when closing
  }, []);

  return (
    <CalendarContext.Provider
      value={{
        currentDate,
        setCurrentDate,
        selectedView,
        setSelectedView,
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        isEventModalOpen,
        openEventModal,
        closeEventModal,
        editingEvent,
        isSchedulerModalOpen,
        openSchedulerModal,
        closeSchedulerModal,
        suggestedTimes,
        setSuggestedTimes,
        isLoadingAISuggestions,
        setIsLoadingAISuggestions,
      }}
    >
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = (): CalendarContextType => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error('useCalendar must be used within a CalendarProvider');
  }
  return context;
};
