"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarClock } from "lucide-react";

export default function DayView() {
  return (
    <div className="flex-grow p-4 flex items-center justify-center">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <CalendarClock className="h-8 w-8 text-primary" />
            Day View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The day view is currently under development. Please check back later!
          </p>
          <img src="https://placehold.co/600x400.png?text=Day+View+Placeholder" alt="Day View Placeholder" data-ai-hint="daily planner" className="mt-4 rounded-md mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}
