"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface Student {
  id: string;
  name: string;
  studentId?: string;
  marks?: number;
}

interface StudentMarksFormProps {
  students: Student[];
  totalMarks?: number;
  examName?: string;
  courseName?: string;
  onSubmit?: (results: { studentId: string; marks: number }[]) => void;
  onMarksChange?: (studentId: string, marks: number) => void;
  marksData?: Record<string, number>;
  readOnly?: boolean;
}

function calculateGrade(marks: number, total: number): string {
  const percentage = (marks / total) * 100;
  if (percentage >= 90) return "A+";
  if (percentage >= 85) return "A";
  if (percentage >= 80) return "B+";
  if (percentage >= 75) return "B";
  if (percentage >= 70) return "C+";
  if (percentage >= 65) return "C";
  if (percentage >= 60) return "D";
  return "F";
}

function getGradeColor(grade: string): string {
  if (grade.startsWith("A")) return "bg-green-100 text-green-700";
  if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
  if (grade.startsWith("C")) return "bg-amber-100 text-amber-700";
  return "bg-red-100 text-red-700";
}

export function StudentMarksForm({
  students,
  totalMarks = 100,
  examName,
  courseName,
  onSubmit,
  onMarksChange,
  marksData,
  readOnly = false,
}: StudentMarksFormProps) {
  const handleChange = (studentId: string, value: string) => {
    const marks = Math.min(Math.max(0, parseFloat(value) || 0), totalMarks);
    onMarksChange?.(studentId, marks);
  };

  const handleSubmit = () => {
    if (!onSubmit) return;
    const results = students.map((s) => ({
      studentId: s.id,
      marks: marksData?.[s.id] ?? s.marks ?? 0,
    }));
    onSubmit(results);
  };

  return (
    <Card>
      <CardContent className="space-y-4 p-4">
        {(examName || courseName) && (
          <div className="flex items-center gap-3 rounded-lg bg-muted/50 p-3">
            {courseName && (
              <div>
                <p className="text-xs text-muted-foreground">Course</p>
                <p className="text-sm font-semibold">{courseName}</p>
              </div>
            )}
            {examName && (
              <div>
                <p className="text-xs text-muted-foreground">Exam</p>
                <p className="text-sm font-semibold">{examName}</p>
              </div>
            )}
            <div className="ml-auto">
              <p className="text-xs text-muted-foreground">Total Marks</p>
              <p className="text-sm font-semibold">{totalMarks}</p>
            </div>
          </div>
        )}

        <div className="space-y-1.5">
          <div className="grid grid-cols-[1fr,100px,80px] gap-3 rounded-lg bg-muted/30 px-3 py-2 text-xs font-semibold text-muted-foreground">
            <span>Student</span>
            <span className="text-center">Marks</span>
            <span className="text-center">Grade</span>
          </div>
          <div className="max-h-96 space-y-1.5 overflow-y-auto">
            {students.map((student) => {
              const marks = marksData?.[student.id] ?? student.marks ?? 0;
              const grade = calculateGrade(marks, totalMarks);

              return (
                <div
                  key={student.id}
                  className="grid grid-cols-[1fr,100px,80px] items-center gap-3 rounded-lg border px-3 py-2.5"
                >
                  <div>
                    <p className="text-sm font-medium">{student.name}</p>
                    {student.studentId && (
                      <p className="text-xs text-muted-foreground">
                        {student.studentId}
                      </p>
                    )}
                  </div>
                  {readOnly ? (
                    <p className="text-center text-sm font-semibold">{marks}</p>
                  ) : (
                    <Input
                      type="number"
                      min={0}
                      max={totalMarks}
                      value={marks || ""}
                      onChange={(e) => handleChange(student.id, e.target.value)}
                      placeholder="0"
                      className="h-8 text-center text-sm"
                    />
                  )}
                  <div className="flex justify-center">
                    <Badge variant="secondary" className={getGradeColor(grade)}>
                      {grade}
                    </Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {!readOnly && onSubmit && (
          <div className="flex justify-end gap-2 pt-2">
            <Button onClick={handleSubmit} className="bg-primary text-primary-foreground">
              Submit Results
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
