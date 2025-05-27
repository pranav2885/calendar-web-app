"use client";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCalendar } from "@/contexts/CalendarContext";
import { VIEW_OPTIONS } from "@/lib/constants";
import type { ViewOption } from "@/lib/types";
import { format, addMonths, subMonths } from '@/lib/calendarUtils';
import { ChevronLeft, ChevronRight, Plus, BrainCircuit, Upload, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function CalendarToolbar() {
  const {
    currentDate,
    setCurrentDate,
    selectedView,
    setSelectedView,
    openEventModal,
    openSchedulerModal,
  } = useCalendar();
  const { toast } = useToast();

  const handlePrev = () => {
    if (selectedView === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else if (selectedView === 'week') {
      // setCurrentDate(subWeeks(currentDate, 1)); // Requires subWeeks from date-fns
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 7)));
    } else {
      // setCurrentDate(subDays(currentDate, 1));
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() - 1)));
    }
  };

  const handleNext = () => {
    if (selectedView === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else if (selectedView === 'week') {
      // setCurrentDate(addWeeks(currentDate, 1)); // Requires addWeeks from date-fns
      setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 7)));
    } else {
      // setCurrentDate(addDays(currentDate, 1));
       setCurrentDate(new Date(currentDate.setDate(currentDate.getDate() + 1)));
    }
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleImport = () => {
    // Placeholder for import functionality
    toast({ title: "Import Calendar", description: "iCal import feature coming soon!" });
  };

  const handleExport = () => {
    // Placeholder for export functionality
    toast({ title: "Export Calendar", description: "iCal export feature coming soon!" });
  };


  return (
    <div className="p-4 flex flex-wrap items-center justify-between gap-4 bg-card border-b border-border">
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={handleToday}>Today</Button>
        <Button variant="ghost" size="icon" onClick={handlePrev} aria-label="Previous period">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="icon" onClick={handleNext} aria-label="Next period">
          <ChevronRight className="h-5 w-5" />
        </Button>
        <h2 className="text-xl font-semibold text-foreground ml-2">
          {format(currentDate, selectedView === 'month' ? 'MMMM yyyy' : 'MMMM d, yyyy')}
        </h2>
      </div>
      <div className="flex items-center gap-2 flex-wrap">
        <Button variant="outline" onClick={handleImport}><Upload className="mr-2 h-4 w-4" /> Import</Button>
        <Button variant="outline" onClick={handleExport}><Download className="mr-2 h-4 w-4" /> Export</Button>
        <Button variant="outline" onClick={openSchedulerModal} className="bg-accent text-accent-foreground hover:bg-accent/90">
          <BrainCircuit className="mr-2 h-4 w-4" /> Smart Scheduler
        </Button>
        <Select
          value={selectedView}
          onValueChange={(value) => setSelectedView(value as ViewOption)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select view" />
          </SelectTrigger>
          <SelectContent>
            {VIEW_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button onClick={() => openEventModal()} className="bg-primary text-primary-foreground hover:bg-primary/90">
          <Plus className="mr-2 h-4 w-4" /> Create Event
        </Button>
      </div>
    </div>
  );
}
