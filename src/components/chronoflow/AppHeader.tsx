"use client";

import { CalendarDays } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function AppHeader() {
  return (
    <header className="bg-card border-b border-border px-4 py-3 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CalendarDays className="h-8 w-8 text-primary" />
          <h1 className="text-2xl font-bold text-primary">ChronoFlow</h1>
        </div>
        <div>
          {/* Placeholder for user menu or settings */}
          <Avatar>
            <AvatarImage src="https://placehold.co/40x40.png" alt="User Avatar" data-ai-hint="user avatar" />
            <AvatarFallback>CF</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
}
