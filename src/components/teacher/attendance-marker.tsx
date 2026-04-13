"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Clock, UserCheck } from "lucide-react";
import { cn } from "@/lib/utils";

interface StudentRecord {
  id: string;
  name: string;
  studentId?: string;
  attendance?: "present" | "absent" | "late";
}

interface AttendanceMarkerProps {
  students: StudentRecord[];
  date?: string;
  courseName?: string;
  onSubmit?: (records: { studentId: string; status: "present" | "absent" | "late" }[]) => void;
  attendanceData?: Record<string, "present" | "absent" | "late">;
  onStatusChange?: (studentId: string, status: "present" | "absent" | "late") => void;
  readOnly?: boolean;
}

export function AttendanceMarker({
  students,
  date,
  courseName,
  onSubmit,
  attendanceData = {},
  onStatusChange,
  readOnly = false,
}: AttendanceMarkerProps) {
  const presentCount = Object.values(attendanceData).filter((s) => s === "present").length;
  const absentCount = Object.values(attendanceData).filter((s) => s === "absent").length;
  const lateCount = Object.values(attendanceData).filter((s) => s === "late").length;

  const handleSubmit = () => {
    if (!onSubmit) return;
    const records = students.map((s) => ({
      studentId: s.id,
      status: attendanceData[s.id] ?? s.attendance ?? "present",
    }));
    onSubmit(records);
  };

  const statusButton = (
    studentId: string,
    status: "present" | "absent" | "late",
    currentStatus: string | undefined
  ) => {
    const isActive = currentStatus === status;
    const icon =
      status === "present" ? (
        <CheckCircle className="h-4 w-4" />
      ) : status === "absent" ? (
        <XCircle className="h-4 w-4" />
      ) : (
        <Clock className="h-4 w-4" />
      );

    if (readOnly) {
      return (
        <Badge
          variant="secondary"
          className={cn(
            "gap-1",
            isActive && status === "present" && "bg-green-100 text-green-700",
            isActive && status === "absent" && "bg-red-100 text-red-700",
            isActive && status === "late" && "bg-amber-100 text-amber-700"
          )}
        >
          {icon}
          {status}
        </Badge>
      );
    }

    return (
      <Button
        key={status}
        size="sm"
        variant={isActive ? "default" : "outline"}
        className={cn(
          "gap-1 text-xs capitalize",
          isActive && status === "present" && "bg-green-600 hover:bg-green-700 text-white",
          isActive && status === "absent" && "bg-red-600 hover:bg-red-700 text-white",
          isActive && status === "late" && "bg-amber-500 hover:bg-amber-600 text-white"
        )}
        onClick={() => onStatusChange?.(studentId, status)}
      >
        {icon}
        {status}
      </Button>
    );
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-base">
            <UserCheck className="h-5 w-5 text-primary" />
            Mark Attendance
          </CardTitle>
          {date && (
            <Badge variant="outline" className="text-xs">
              {date}
            </Badge>
          )}
        </div>
        {courseName && (
          <p className="text-sm text-muted-foreground">{courseName}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Summary */}
        <div className="grid grid-cols-3 gap-3 rounded-lg bg-muted/50 p-3">
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
            <span className="text-sm text-muted-foreground">
              Present: <strong className="text-foreground">{presentCount}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
            <span className="text-sm text-muted-foreground">
              Absent: <strong className="text-foreground">{absentCount}</strong>
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-sm text-muted-foreground">
              Late: <strong className="text-foreground">{lateCount}</strong>
            </span>
          </div>
        </div>

        {/* Student List */}
        <div className="max-h-96 space-y-2 overflow-y-auto">
          {students.map((student) => {
            const currentStatus =
              attendanceData[student.id] ?? student.attendance ?? "present";

            return (
              <div
                key={student.id}
                className="flex items-center justify-between rounded-lg border px-3 py-2.5"
              >
                <div>
                  <p className="text-sm font-medium">{student.name}</p>
                  {student.studentId && (
                    <p className="text-xs text-muted-foreground">
                      {student.studentId}
                    </p>
                  )}
                </div>
                <div className="flex gap-1">
                  {(["present", "absent", "late"] as const).map((s) =>
                    statusButton(student.id, s, currentStatus)
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {!readOnly && onSubmit && (
          <div className="flex justify-end pt-2">
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
              Submit Attendance
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
