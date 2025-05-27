"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarOff } from "lucide-react";

export default function WeekView() {
  return (
    <div className="flex-grow p-4 flex items-center justify-center">
      <Card className="w-full max-w-md text-center shadow-xl">
        <CardHeader>
          <CardTitle className="flex items-center justify-center gap-2">
            <CalendarOff className="h-8 w-8 text-primary" />
            Week View
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            The week view is currently under development. Please check back later!
          </p>
           <img src="https://placehold.co/600x400.png?text=Week+View+Placeholder" alt="Week View Placeholder" data-ai-hint="calendar schedule" className="mt-4 rounded-md mx-auto" />
        </CardContent>
      </Card>
    </div>
  );
}
