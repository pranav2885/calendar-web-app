"use client";

import AppHeader from "./AppHeader";
import CalendarToolbar from "./CalendarToolbar";
import CalendarGrid from "./CalendarGrid";
import EventFormModal from "./EventFormModal";
import SmartSchedulerModal from "./SmartSchedulerModal";

export default function ChronoFlowApp() {
  return (
    <div className="flex flex-col h-screen bg-background">
      <AppHeader />
      <CalendarToolbar />
      <main className="flex-grow flex flex-col overflow-hidden">
        <CalendarGrid />
      </main>
      <EventFormModal />
      <SmartSchedulerModal />
    </div>
  );
}
