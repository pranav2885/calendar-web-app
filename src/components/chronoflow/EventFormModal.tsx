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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";
import { CalendarIcon, Palette } from "lucide-react";
import { format, set } from 'date-fns';
import { useCalendar } from "@/contexts/CalendarContext";
import type { CalendarEvent } from "@/lib/types";
import { useEffect, useState } from "react";

const eventFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  start: z.date({ required_error: "Start date is required." }),
  startTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  end: z.date({ required_error: "End date is required." }),
  endTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:MM)"),
  isAllDay: z.boolean().default(false),
  color: z.string().optional(), // Hex color
}).refine(data => data.end >= data.start, {
  message: "End date cannot be before start date.",
  path: ["end"],
}).refine(data => {
  if (data.isAllDay) return true;
  if (format(data.start, 'yyyy-MM-dd') === format(data.end, 'yyyy-MM-dd')) {
    return data.endTime > data.startTime;
  }
  return true;
}, {
  message: "End time must be after start time on the same day.",
  path: ["endTime"],
});

type EventFormValues = z.infer<typeof eventFormSchema>;

const defaultEventColor = "hsl(var(--primary))"; // Default to primary theme color

const colorPalette = [
  "hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))",
  "hsl(var(--chart-4))", "hsl(var(--chart-5))", "hsl(var(--primary))", "hsl(var(--accent))",
];


export default function EventFormModal() {
  const { isEventModalOpen, closeEventModal, editingEvent, addEvent, updateEvent } = useCalendar();

  const form = useForm<EventFormValues>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: {
      title: "",
      description: "",
      start: new Date(),
      startTime: format(new Date(), "HH:mm"),
      end: new Date(),
      endTime: format(set(new Date(), { hours: new Date().getHours() + 1 }), "HH:mm"),
      isAllDay: false,
      color: defaultEventColor,
    },
  });
  
  const [selectedColor, setSelectedColor] = useState<string>(defaultEventColor);

  useEffect(() => {
    if (editingEvent) {
      form.reset({
        title: editingEvent.title,
        description: editingEvent.description || "",
        start: editingEvent.start,
        startTime: format(editingEvent.start, "HH:mm"),
        end: editingEvent.end,
        endTime: format(editingEvent.end, "HH:mm"),
        isAllDay: editingEvent.isAllDay || false,
        color: editingEvent.color || defaultEventColor,
      });
      setSelectedColor(editingEvent.color || defaultEventColor);
    } else {
      const now = new Date();
      const defaultStartTime = format(now, "HH:mm");
      const defaultEndTime = format(set(now, { hours: now.getHours() + 1 }), "HH:mm");
      form.reset({
        title: "",
        description: "",
        start: now,
        startTime: defaultStartTime,
        end: now,
        endTime: defaultEndTime,
        isAllDay: false,
        color: defaultEventColor,
      });
      setSelectedColor(defaultEventColor);
    }
  }, [editingEvent, form, isEventModalOpen]);

  const onSubmit = (data: EventFormValues) => {
    const [startHours, startMinutes] = data.startTime.split(':').map(Number);
    const [endHours, endMinutes] = data.endTime.split(':').map(Number);

    const fullStartDate = set(data.start, { hours: startHours, minutes: startMinutes });
    const fullEndDate = set(data.end, { hours: endHours, minutes: endMinutes });

    const eventData: Omit<CalendarEvent, 'id'> = {
      title: data.title,
      description: data.description,
      start: data.isAllDay ? set(data.start, { hours:0, minutes:0, seconds:0}) : fullStartDate,
      end: data.isAllDay ? set(data.end, { hours:23, minutes:59, seconds:59}) : fullEndDate,
      isAllDay: data.isAllDay,
      color: selectedColor,
    };

    if (editingEvent) {
      updateEvent({ ...eventData, id: editingEvent.id });
    } else {
      addEvent(eventData);
    }
    closeEventModal();
  };

  return (
    <Dialog open={isEventModalOpen} onOpenChange={(open) => !open && closeEventModal()}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{editingEvent ? "Edit Event" : "Create Event"}</DialogTitle>
          <DialogDescription>
            {editingEvent ? "Update the details of your event." : "Fill in the details for your new event."}
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 p-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Team Meeting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="isAllDay"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow-sm">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>All-day event</FormLabel>
                    <FormDescription>
                      This event will span the entire selected day(s).
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="start"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Start Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!form.watch("isAllDay") && <FormField
                control={form.control}
                name="startTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="end"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < form.getValues("start")}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {!form.watch("isAllDay") && <FormField
                control={form.control}
                name="endTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End Time</FormLabel>
                    <FormControl>
                      <Input type="time" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />}
            </div>
            
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description (Optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Add more details about the event..."
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem>
              <FormLabel className="flex items-center gap-2"><Palette className="h-4 w-4"/> Event Color</FormLabel>
              <div className="flex flex-wrap gap-2 pt-2">
                {colorPalette.map((color) => (
                  <Button
                    key={color}
                    type="button"
                    variant="outline"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-full border-2",
                      selectedColor === color && "ring-2 ring-offset-2 ring-ring"
                    )}
                    style={{ backgroundColor: color }}
                    onClick={() => setSelectedColor(color)}
                    aria-label={`Select color ${color}`}
                  />
                ))}
              </div>
            </FormItem>

            <DialogFooter className="pt-4">
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  Cancel
                </Button>
              </DialogClose>
              <Button type="submit" className="bg-primary text-primary-foreground hover:bg-primary/90">
                {editingEvent ? "Save Changes" : "Create Event"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
