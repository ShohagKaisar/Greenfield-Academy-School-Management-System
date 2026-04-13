"use client";

import React, { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/auth-context";
import { apiGet, apiPost } from "@/lib/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { StudentMarksForm } from "@/components/teacher/student-marks-form";
import { Award, CheckCircle } from "lucide-react";

interface CourseOption {
  id: string;
  title: string;
}

interface ExamOption {
  id: string;
  name: string;
  type: string;
  totalMarks: number;
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

const mockExams: Record<string, ExamOption[]> = {
  "1": [
    { id: "e1", name: "Mid-Term Exam", type: "midterm", totalMarks: 100 },
    { id: "e2", name: "Quiz 1", type: "quiz", totalMarks: 20 },
    { id: "e3", name: "Quiz 2", type: "quiz", totalMarks: 20 },
  ],
  "2": [
    { id: "e4", name: "Mid-Term Exam", type: "midterm", totalMarks: 100 },
    { id: "e5", name: "Lab Test 1", type: "practical", totalMarks: 50 },
  ],
  "3": [
    { id: "e6", name: "Final Exam", type: "final", totalMarks: 100 },
  ],
  "4": [
    { id: "e7", name: "Mid-Term Exam", type: "midterm", totalMarks: 100 },
  ],
};

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

export default function TeacherResults() {
  useRequireAuth("teacher");
  const [loading, setLoading] = useState(true);
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [marksData, setMarksData] = useState<Record<string, number>>({});
  const [submitted, setSubmitted] = useState(false);

  const exams = selectedCourse ? mockExams[selectedCourse] || [] : [];

  const handleMarksChange = (studentId: string, marks: number) => {
    setMarksData((prev) => ({ ...prev, [studentId]: marks }));
    setSubmitted(false);
  };

  const handleSubmit = (results: { studentId: string; marks: number }[]) => {
    results.forEach((r) => {
      setMarksData((prev) => ({ ...prev, [r.studentId]: r.marks }));
    });
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Upload Results</h1>
        <p className="text-sm text-muted-foreground">
          Enter and submit student exam results
        </p>
      </div>

      {/* Selection */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Course</label>
          <Select value={selectedCourse} onValueChange={(val) => { setSelectedCourse(val); setSelectedExam(""); setMarksData({}); setSubmitted(false); }}>
            <SelectTrigger>
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
          <label className="text-sm font-medium">Select Exam</label>
          <Select value={selectedExam} onValueChange={(val) => { setSelectedExam(val); setMarksData({}); setSubmitted(false); }} disabled={!selectedCourse}>
            <SelectTrigger>
              <SelectValue placeholder="Choose an exam" />
            </SelectTrigger>
            <SelectContent>
              {exams.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name} ({e.totalMarks} marks)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Success Message */}
      {submitted && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="flex items-center gap-3 p-4">
            <CheckCircle className="h-5 w-5 text-green-600" />
            <div>
              <p className="text-sm font-semibold text-green-800">Results submitted successfully!</p>
              <p className="text-xs text-green-600">
                {mockStudents.length} student results have been recorded.
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Marks Form */}
      {selectedCourse && selectedExam ? (
        <StudentMarksForm
          students={mockStudents}
          totalMarks={exams.find((e) => e.id === selectedExam)?.totalMarks || 100}
          examName={exams.find((e) => e.id === selectedExam)?.name}
          courseName={mockCourses.find((c) => c.id === selectedCourse)?.title}
          marksData={marksData}
          onMarksChange={handleMarksChange}
          onSubmit={handleSubmit}
        />
      ) : (
        <Card className="flex flex-col items-center justify-center p-12">
          <Award className="h-16 w-16 text-muted-foreground/20" />
          <h3 className="mt-4 text-lg font-semibold">Select Course & Exam</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Choose a course and exam to enter student results.
          </p>
        </Card>
      )}
    </div>
  );
}
