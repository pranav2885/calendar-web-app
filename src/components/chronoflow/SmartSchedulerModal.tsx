"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CalendarIcon, BrainCircuit, Loader2, Clock } from "lucide-react";
import { format, set } from 'date-fns';
import { useCalendar } from "@/contexts/CalendarContext";
import type { CalendarEvent, SuggestedTime } from "@/lib/types";
import { eventsToICal } from "@/lib/calendarUtils";
import { suggestOptimalEventTimes, type SuggestOptimalEventTimesInput } from "@/ai/flows/suggest-optimal-event-times";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";

const schedulerFormSchema = z.object({
  eventTitle: z.string().min(1, "Event title is required"),
  duration: z.coerce.number().min(5, "Duration must be at least 5 minutes"),
  dateRangeStart: z.date({ required_error: "Start date of range is required." }),
  dateRangeEnd: z.date({ required_error: "End date of range is required." }),
}).refine(data => data.dateRangeEnd >= data.dateRangeStart, {
  message: "End date of range cannot be before start date.",
  path: ["dateRangeEnd"],
});

type SchedulerFormValues = z.infer<typeof schedulerFormSchema>;

export default function SmartSchedulerModal() {
  const { 
    isSchedulerModalOpen, 
    closeSchedulerModal, 
    events, 
    addEvent, 
    suggestedTimes, 
    setSuggestedTimes,
    isLoadingAISuggestions,
    setIsLoadingAISuggestions,
  } = useCalendar();
  const { toast } = useToast();

  const form = useForm<SchedulerFormValues>({
    resolver: zodResolver(schedulerFormSchema),
    defaultValues: {
      eventTitle: "",
      duration: 30,
      dateRangeStart: new Date(),
      dateRangeEnd: set(new Date(), { date: new Date().getDate() + 7 }),
    },
  });

  useEffect(() => {
    if (!isSchedulerModalOpen) {
      form.reset(); // Reset form when modal closes
      setSuggestedTimes([]); // Clear previous suggestions
    }
  }, [isSchedulerModalOpen, form, setSuggestedTimes]);

  const onSubmit = async (data: SchedulerFormValues) => {
    setIsLoadingAISuggestions(true);
    setSuggestedTimes([]);
    try {
      const userScheduleICal = eventsToICal(events);
      const input: SuggestOptimalEventTimesInput = {
        schedule: userScheduleICal,
        duration: data.duration,
        eventTitle: data.eventTitle,
        dateRangeStart: data.dateRangeStart.toISOString(),
        dateRangeEnd: data.dateRangeEnd.toISOString(),
      };
      
      const result = await suggestOptimalEventTimes(input);
      if (result.suggestedTimes && result.suggestedTimes.length > 0) {
        setSuggestedTimes(result.suggestedTimes);
        toast({ title: "Suggestions Ready", description: `Found ${result.suggestedTimes.length} optimal time slots.` });
      } else {
        toast({ title: "No Suggestions", description: "Could not find any optimal time slots based on the criteria.", variant: "destructive" });
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error);
      toast({ title: "Error", description: "Failed to fetch suggestions. Please try again.", variant: "destructive" });
    } finally {
      setIsLoadingAISuggestions(false);
    }
  };

  const handleCreateEventFromSuggestion = (suggestion: SuggestedTime, title: string) => {
    const newEvent: Omit<CalendarEvent, 'id'> = {
      title: title,
      start: new Date(suggestion.startTime),
      end: new Date(suggestion.endTime),
      description: `Scheduled via Smart Scheduler. Reason: ${suggestion.reason}`,
    };
    addEvent(newEvent);
    closeSchedulerModal();
    toast({ title: "Event Scheduled!", description: `"${title}" has been added to your calendar.`});
  };

  return (
    <Dialog open={isSchedulerModalOpen} onOpenChange={(open) => !open && closeSchedulerModal()}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2"><BrainCircuit className="h-6 w-6 text-primary" /> Smart Scheduler</DialogTitle>
          <DialogDescription>
            Let AI find the best time for your event based on your current schedule.
          </DialogDescription>
        </DialogHeader>
        <div className="flex-grow overflow-y-auto pr-2">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="eventTitle"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Event Title</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Project Brainstorm" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="duration"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Duration (minutes)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g., 60" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="dateRangeStart"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Search From Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="dateRangeEnd"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Search Until Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn("w-full pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                            >
                              {field.value ? format(field.value, "PPP") : <span>Pick a date</span>}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < form.getValues("dateRangeStart")}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full bg-accent text-accent-foreground hover:bg-accent/90" disabled={isLoadingAISuggestions}>
                {isLoadingAISuggestions ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Finding Times...</>
                ) : (
                  "Find Optimal Times"
                )}
              </Button>
            </form>
          </Form>

          {suggestedTimes.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-semibold mb-2">Suggested Times:</h3>
              <ScrollArea className="h-[200px] rounded-md border p-2">
                <div className="space-y-3">
                {suggestedTimes.map((suggestion, index) => (
                  <Card key={index} className="shadow-sm">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="font-medium text-sm">
                            {format(new Date(suggestion.startTime), 'EEE, MMM d, HH:mm')} - {format(new Date(suggestion.endTime), 'HH:mm')}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">{suggestion.reason}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => handleCreateEventFromSuggestion(suggestion, form.getValues("eventTitle") || "New Event")}>
                          Schedule
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                </div>
              </ScrollArea>
            </div>
          )}
           {isLoadingAISuggestions && suggestedTimes.length === 0 && (
             <div className="mt-6 text-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-2" />
                <p className="text-muted-foreground">Searching for optimal times...</p>
             </div>
           )}
        </div>
        <DialogFooter className="pt-4 mt-auto">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
