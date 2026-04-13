"use client";

import React, { useState, useEffect, useRef } from "react";
import { useRequireAuth } from "@/lib/auth-context";
import { apiGet } from "@/lib/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Printer, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

interface RoutineItem {
  id: string;
  courseId: string;
  courseName: string;
  teacherName: string;
  room: string;
  day: string;
  startTime: string;
  endTime: string;
}

const DAYS = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const TIME_SLOTS = [
  "08:00 - 09:00",
  "09:15 - 10:15",
  "10:30 - 11:30",
  "11:45 - 12:45",
  "01:00 - 02:00",
  "02:15 - 03:15",
  "03:30 - 04:30",
];

const departmentColors = [
  "bg-blue-100 border-blue-300 text-blue-800",
  "bg-green-100 border-green-300 text-green-800",
  "bg-purple-100 border-purple-300 text-purple-800",
  "bg-amber-100 border-amber-300 text-amber-800",
  "bg-pink-100 border-pink-300 text-pink-800",
  "bg-cyan-100 border-cyan-300 text-cyan-800",
  "bg-orange-100 border-orange-300 text-orange-800",
];

const mockRoutine: RoutineItem[] = [
  { id: "1", courseId: "1", courseName: "Mathematics", teacherName: "Dr. Smith", room: "201", day: "Saturday", startTime: "08:00", endTime: "09:00" },
  { id: "2", courseId: "2", courseName: "Physics", teacherName: "Prof. Johnson", room: "Lab 3", day: "Saturday", startTime: "09:15", endTime: "10:15" },
  { id: "3", courseId: "4", courseName: "English", teacherName: "Ms. Davis", room: "105", day: "Saturday", startTime: "10:30", endTime: "11:30" },
  { id: "4", courseId: "1", courseName: "Mathematics", teacherName: "Dr. Smith", room: "201", day: "Sunday", startTime: "08:00", endTime: "09:00" },
  { id: "5", courseId: "5", courseName: "Biology", teacherName: "Dr. Brown", room: "Lab 2", day: "Sunday", startTime: "09:15", endTime: "10:15" },
  { id: "6", courseId: "3", courseName: "Chemistry", teacherName: "Dr. Wilson", room: "Lab 1", day: "Sunday", startTime: "01:00", endTime: "02:00" },
  { id: "7", courseId: "6", courseName: "Computer Science", teacherName: "Prof. Lee", room: "401", day: "Monday", startTime: "08:00", endTime: "09:00" },
  { id: "8", courseId: "2", courseName: "Physics", teacherName: "Prof. Johnson", room: "Lab 3", day: "Monday", startTime: "09:15", endTime: "10:15" },
  { id: "9", courseId: "1", courseName: "Mathematics", teacherName: "Dr. Smith", room: "201", day: "Monday", startTime: "10:30", endTime: "11:30" },
  { id: "10", courseId: "4", courseName: "English", teacherName: "Ms. Davis", room: "105", day: "Tuesday", startTime: "08:00", endTime: "09:00" },
  { id: "11", courseId: "5", courseName: "Biology", teacherName: "Dr. Brown", room: "Lab 2", day: "Tuesday", startTime: "01:00", endTime: "02:00" },
  { id: "12", courseId: "3", courseName: "Chemistry", teacherName: "Dr. Wilson", room: "Lab 1", day: "Tuesday", startTime: "02:15", endTime: "03:15" },
  { id: "13", courseId: "6", courseName: "Computer Science", teacherName: "Prof. Lee", room: "401", day: "Wednesday", startTime: "08:00", endTime: "09:00" },
  { id: "14", courseId: "1", courseName: "Mathematics", teacherName: "Dr. Smith", room: "201", day: "Wednesday", startTime: "09:15", endTime: "10:15" },
  { id: "15", courseId: "2", courseName: "Physics", teacherName: "Prof. Johnson", room: "Lab 3", day: "Thursday", startTime: "08:00", endTime: "09:00" },
  { id: "16", courseId: "3", courseName: "Chemistry", teacherName: "Dr. Wilson", room: "Lab 1", day: "Thursday", startTime: "10:30", endTime: "11:30" },
  { id: "17", courseId: "5", courseName: "Biology", teacherName: "Dr. Brown", room: "Lab 2", day: "Friday", startTime: "08:00", endTime: "09:00" },
];

export default function StudentRoutine() {
  useRequireAuth("student");
  const [loading, setLoading] = useState(true);
  const [routine, setRoutine] = useState<RoutineItem[]>([]);
  const printRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<RoutineItem[]>("/api/routines");
        if (Array.isArray(data) || (data && typeof data === "object")) {
          setRoutine(data);
        } else {
          setRoutine(mockRoutine);
        }
      } catch {
        setRoutine(mockRoutine);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const todayIndex = new Date().getDay() - 1;

  const getRoutineForSlot = (day: string, timeSlot: string) => {
    const [start] = timeSlot.split(" - ");
    return routine.find(
      (r) => r.day === day && r.startTime === start
    );
  };

  const getColor = (courseName: string) => {
    let hash = 0;
    for (let i = 0; i < courseName.length; i++) {
      hash = courseName.charCodeAt(i) + ((hash << 5) - hash);
    }
    return departmentColors[Math.abs(hash) % departmentColors.length];
  };

  const handlePrint = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow || !printRef.current) return;
    printWindow.document.write(`
      <html><head><title>Class Routine</title>
      <style>
        body { font-family: Arial, sans-serif; padding: 20px; }
        table { width: 100%; border-collapse: collapse; font-size: 12px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: center; }
        th { background: #2563eb; color: white; }
        .break { background: #f1f5f9; }
      </style></head><body>
      <h2 style="text-align:center; margin-bottom: 20px;">Greenfield Academy - Class Routine</h2>
      ${printRef.current.innerHTML}
      </body></html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-[600px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Class Routine</h1>
          <p className="text-sm text-muted-foreground">
            Your weekly class schedule
          </p>
        </div>
        <Button variant="outline" className="gap-2" onClick={handlePrint}>
          <Printer className="h-4 w-4" />
          Print Routine
        </Button>
      </div>

      <Card>
        <CardContent className="p-2">
          <div ref={printRef}>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-xs">
                <thead>
                  <tr>
                    <th className="border bg-primary px-2 py-2.5 text-left text-xs font-semibold text-primary-foreground">
                      Time
                    </th>
                    {DAYS.map((day, idx) => (
                      <th
                        key={day}
                        className={cn(
                          "border px-2 py-2.5 text-center text-xs font-semibold",
                          idx === todayIndex
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted/80 text-muted-foreground"
                        )}
                      >
                        {day.slice(0, 3)}
                        {idx === todayIndex && (
                          <span className="ml-1 text-[10px]">(Today)</span>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {TIME_SLOTS.map((slot, slotIdx) => (
                    <tr key={slot}>
                      <td className="border bg-muted/30 px-2 py-2 text-center font-medium text-muted-foreground">
                        {slot}
                      </td>
                      {DAYS.map((day, dayIdx) => {
                        const item = getRoutineForSlot(day, slot);
                        return (
                          <td
                            key={`${day}-${slot}`}
                            className={cn(
                              "border p-1",
                              dayIdx === todayIndex && "bg-primary/5"
                            )}
                          >
                            {item ? (
                              <div
                                className={cn(
                                  "rounded-md border p-2 text-center",
                                  getColor(item.courseName)
                                )}
                              >
                                <p className="font-semibold text-[11px] leading-tight">
                                  {item.courseName}
                                </p>
                                <p className="mt-0.5 text-[10px] opacity-70">
                                  {item.room}
                                </p>
                                <p className="text-[10px] opacity-60">
                                  {item.teacherName}
                                </p>
                              </div>
                            ) : (
                              <div className="p-2 text-center text-muted-foreground/30">
                                —
                              </div>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
