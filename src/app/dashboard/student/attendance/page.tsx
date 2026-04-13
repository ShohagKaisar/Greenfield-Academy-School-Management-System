"use client";

import React, { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/auth-context";
import { apiGet } from "@/lib/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AttendanceCalendar } from "@/components/student/attendance-calendar";
import { cn } from "@/lib/utils";
import { Calendar, UserCheck, XCircle, Clock, BarChart3 } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface AttendanceRecord {
  date: string;
  status: "present" | "absent" | "late";
}

interface CourseAttendance {
  courseName: string;
  totalClasses: number;
  present: number;
  absent: number;
  late: number;
  percentage: number;
}

const mockAttendanceRecords: AttendanceRecord[] = Array.from({ length: 30 }, (_, i) => {
  const date = new Date(2025, 0, i + 1);
  const dateStr = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  const day = date.getDay();
  if (day === 5) return { date: dateStr, status: "absent" as const };
  const rand = Math.random();
  return {
    date: dateStr,
    status: rand > 0.15 ? "present" as const : rand > 0.05 ? "late" as const : "absent" as const,
  };
});

const mockCourseAttendance: CourseAttendance[] = [
  { courseName: "Mathematics", totalClasses: 45, present: 40, absent: 3, late: 2, percentage: 89 },
  { courseName: "Physics", totalClasses: 40, present: 35, absent: 4, late: 1, percentage: 88 },
  { courseName: "Chemistry", totalClasses: 38, present: 34, absent: 2, late: 2, percentage: 89 },
  { courseName: "English", totalClasses: 30, present: 28, absent: 1, late: 1, percentage: 93 },
  { courseName: "Biology", totalClasses: 35, present: 29, absent: 4, late: 2, percentage: 83 },
  { courseName: "Computer Science", totalClasses: 32, present: 30, absent: 1, late: 1, percentage: 94 },
];

export default function StudentAttendance() {
  useRequireAuth("student");
  const [loading, setLoading] = useState(true);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [courseAttendance, setCourseAttendance] = useState<CourseAttendance[]>([]);
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 0, 1));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<{ records: AttendanceRecord[]; courses: CourseAttendance[] }>("/api/attendance");
        if (Array.isArray(data) || (data && typeof data === "object")) {
          setRecords(data.records);
          setCourseAttendance(data.courses);
        } else {
          setRecords(mockAttendanceRecords);
          setCourseAttendance(mockCourseAttendance);
        }
      } catch {
        setRecords(mockAttendanceRecords);
        setCourseAttendance(mockCourseAttendance);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalClasses = records.length;
  const present = records.filter((r) => r.status === "present").length;
  const absent = records.filter((r) => r.status === "absent").length;
  const late = records.filter((r) => r.status === "late").length;
  const percentage = totalClasses > 0 ? Math.round((present / totalClasses) * 100) : 0;

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-96" />
          <Skeleton className="h-96" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Attendance</h1>
        <p className="text-sm text-muted-foreground">
          Track your attendance records
        </p>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: "Total Classes", value: totalClasses, icon: Calendar, color: "text-gray-600", bg: "bg-gray-50" },
          { label: "Present", value: present, icon: UserCheck, color: "text-green-600", bg: "bg-green-50" },
          { label: "Absent", value: absent, icon: XCircle, color: "text-red-600", bg: "bg-red-50" },
          { label: "Late", value: late, icon: Clock, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Percentage", value: `${percentage}%`, icon: BarChart3, color: "text-primary", bg: "bg-primary/10" },
        ].map((stat) => (
          <Card key={stat.label} className="transition-all hover:shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-lg", stat.bg)}>
                <stat.icon className={cn("h-5 w-5", stat.color)} />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Calendar */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Calendar className="h-4 w-4 text-primary" />
              Attendance Calendar
            </CardTitle>
          </CardHeader>
          <CardContent>
            <AttendanceCalendar
              records={records}
              currentMonth={currentMonth}
              onMonthChange={setCurrentMonth}
            />
          </CardContent>
        </Card>

        {/* Course-wise Breakdown */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Course-wise Attendance
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="max-h-[400px] space-y-4 overflow-y-auto">
              {courseAttendance.map((course) => (
                <div key={course.courseName} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">{course.courseName}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">
                        {course.present}/{course.totalClasses}
                      </span>
                      <Badge
                        variant="secondary"
                        className={
                          course.percentage >= 85
                            ? "bg-green-100 text-green-700"
                            : course.percentage >= 75
                            ? "bg-amber-100 text-amber-700"
                            : "bg-red-100 text-red-700"
                        }
                      >
                        {course.percentage}%
                      </Badge>
                    </div>
                  </div>
                  <Progress value={course.percentage} className="h-2" />
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="text-green-600">Present: {course.present}</span>
                    <span className="text-red-600">Absent: {course.absent}</span>
                    <span className="text-amber-600">Late: {course.late}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
