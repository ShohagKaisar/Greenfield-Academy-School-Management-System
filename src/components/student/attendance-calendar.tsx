"use client";

import React, { useMemo } from "react";
import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late";
}

interface AttendanceCalendarProps {
  records: AttendanceRecord[];
  currentMonth?: Date;
  onMonthChange?: (date: Date) => void;
}

const DAYS = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];

export function AttendanceCalendar({
  records,
  currentMonth = new Date(),
  onMonthChange,
}: AttendanceCalendarProps) {
  const recordMap = useMemo(() => {
    const map: Record<string, "present" | "absent" | "late"> = {};
    records.forEach((r) => {
      map[r.date] = r.status;
    });
    return map;
  }, [records]);

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const adjustedFirstDay = firstDay === 0 ? 6 : firstDay - 1;

  const prevMonth = () => {
    onMonthChange?.(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    onMonthChange?.(new Date(year, month + 1, 1));
  };

  const monthName = currentMonth.toLocaleString("default", {
    month: "long",
    year: "numeric",
  });

  const today = new Date();
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

  const days: (number | null)[] = [];
  for (let i = 0; i < adjustedFirstDay; i++) days.push(null);
  for (let i = 1; i <= daysInMonth; i++) days.push(i);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "present":
        return "bg-green-500 text-white";
      case "absent":
        return "bg-red-500 text-white";
      case "late":
        return "bg-amber-400 text-white";
      default:
        return "text-muted-foreground";
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">{monthName}</h3>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" className="h-8 w-8" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1">
        {DAYS.map((day) => (
          <div
            key={day}
            className="flex h-9 items-center justify-center text-xs font-semibold text-muted-foreground"
          >
            {day}
          </div>
        ))}
        {days.map((day, idx) => {
          if (day === null) {
            return <div key={`empty-${idx}`} className="h-9" />;
          }
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const status = recordMap[dateStr];
          const isToday = dateStr === todayStr;

          return (
            <div
              key={dateStr}
              className={cn(
                "flex h-9 items-center justify-center rounded-md text-xs font-medium transition-colors",
                isToday && !status && "ring-2 ring-primary ring-offset-1",
                status ? getStatusColor(status) : "hover:bg-muted",
                isToday && status && "ring-2 ring-offset-1 ring-gray-400"
              )}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-4 text-xs">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-green-500" />
          <span className="text-muted-foreground">Present</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-red-500" />
          <span className="text-muted-foreground">Absent</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-sm bg-amber-400" />
          <span className="text-muted-foreground">Late</span>
        </div>
      </div>
    </div>
  );
}
