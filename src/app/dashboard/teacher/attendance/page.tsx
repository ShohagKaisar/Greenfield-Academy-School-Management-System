"use client";

import React, { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/auth-context";
import { apiGet, apiPost } from "@/lib/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { AttendanceMarker } from "@/components/teacher/attendance-marker";
import { CheckCircle, UserCheck } from "lucide-react";

interface CourseOption {
  id: string;
  title: string;
}

interface Student {
  id: string;
  name: string;
  studentId: string;
}

const mockCourses: CourseOption[] = [
  { id: "1", title: "Mathematics I" },
  { id: "2", title: "Calculus II" },
  { id: "3", title: "Linear Algebra" },
  { id: "4", title: "Discrete Mathematics" },
];

const mockStudents: Student[] = [
  { id: "s1", name: "Alice Brown", studentId: "STU-2025-001" },
  { id: "s2", name: "Bob Wilson", studentId: "STU-2025-002" },
  { id: "s3", name: "Carol Davis", studentId: "STU-2025-003" },
  { id: "s4", name: "David Lee", studentId: "STU-2025-004" },
  { id: "s5", name: "Emma Johnson", studentId: "STU-2025-005" },
  { id: "s6", name: "Frank Garcia", studentId: "STU-2025-006" },
  { id: "s7", name: "Grace Martinez", studentId: "STU-2025-007" },
  { id: "s8", name: "Henry Anderson", studentId: "STU-2025-008" },
  { id: "s9", name: "Ivy Thomas", studentId: "STU-2025-009" },
  { id: "s10", name: "Jack White", studentId: "STU-2025-010" },
];

export default function TeacherAttendance() {
  useRequireAuth("teacher");
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [attendanceData, setAttendanceData] = useState<
    Record<string, "present" | "absent" | "late">
  >({});
  const [submitted, setSubmitted] = useState(false);

  const courseName =
    mockCourses.find((c) => c.id === selectedCourse)?.title || "";

  const handleStatusChange = (
    studentId: string,
    status: "present" | "absent" | "late"
  ) => {
    setAttendanceData((prev) => ({ ...prev, [studentId]: status }));
    setSubmitted(false);
  };

  const handleSubmit = (
    records: { studentId: string; status: "present" | "absent" | "late" }[]
  ) => {
    const data: Record<string, "present" | "absent" | "late"> = {};
    records.forEach((r) => {
      data[r.studentId] = r.status;
    });
    setAttendanceData(data);
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Mark Attendance</h1>
        <p className="text-sm text-muted-foreground">
          Record daily student attendance
        </p>
      </div>

      {/* Selection */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end">
          <div className="flex-1 space-y-2">
            <Label htmlFor="course-select" className="text-sm font-medium">
              Select Course
            </Label>
            <Select value={selectedCourse} onValueChange={(val) => { setSelectedCourse(val); setAttendanceData({}); setSubmitted(false); }}>
              <SelectTrigger id="course-select">
                <SelectValue placeholder="Choose a course" />
              </SelectTrigger>
              <SelectContent>
                {mockCourses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date-select" className="text-sm font-medium">
              Date
            </Label>
            <Input
              id="date-select"
              type="date"
              value={selectedDate}
              onChange={(e) => {
                setSelectedDate(e.target.value);
                setAttendanceData({});
                setSubmitted(false);
              }}
              className="w-44"
            />
          </div>
        </CardContent>
      </Card>

      {/* Success Message */}
      {submitted && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">
                Attendance submitted successfully!
              </p>
              <p className="text-xs text-green-600">
                {mockStudents.length} students • {selectedDate}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attendance Marker */}
      {selectedCourse ? (
        <AttendanceMarker
          students={mockStudents}
          date={selectedDate}
          courseName={courseName}
          attendanceData={attendanceData}
          onStatusChange={handleStatusChange}
          onSubmit={handleSubmit}
        />
      ) : (
        <Card className="flex flex-col items-center justify-center p-12">
          <UserCheck className="h-16 w-16 text-muted-foreground/20" />
          <h3 className="mt-4 text-lg font-semibold">Select a Course</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a course to mark attendance for today.
          </p>
        </Card>
      )}
    </div>
  );
}
