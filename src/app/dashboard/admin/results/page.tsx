"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Download, Upload } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/fetcher";

interface Course { id: string; title: string; code: string; [key: string]: unknown; }
interface Exam { id: string; name: string; courseId: string; totalMarks: number; [key: string]: unknown; }

const mockCourses: Course[] = [
  { id: "1", title: "Introduction to Computer Science", code: "CS-101" },
  { id: "2", title: "Business Administration", code: "BA-201" },
  { id: "3", title: "Mechanical Engineering", code: "ENG-102" },
  { id: "4", title: "Data Science & AI", code: "CS-301" },
];

const mockExams: Record<string, Exam[]> = {
  "1": [
    { id: "e1", name: "Mid-Term Exam", courseId: "1", totalMarks: 100 },
    { id: "e2", name: "Final Exam", courseId: "1", totalMarks: 100 },
    { id: "e3", name: "Quiz 1", courseId: "1", totalMarks: 30 },
  ],
  "2": [
    { id: "e4", name: "Mid-Term Exam", courseId: "2", totalMarks: 100 },
    { id: "e5", name: "Final Exam", courseId: "2", totalMarks: 100 },
  ],
  "3": [
    { id: "e6", name: "Mid-Term Exam", courseId: "3", totalMarks: 100 },
  ],
  "4": [
    { id: "e7", name: "Assignment 1", courseId: "4", totalMarks: 50 },
    { id: "e8", name: "Mid-Term", courseId: "4", totalMarks: 100 },
  ],
};

interface StudentResult {
  id: string;
  name: string;
  studentId: string;
  marks: number;
  grade: string;
}

const mockStudentResults: StudentResult[] = [
  { id: "s1", name: "John Smith", studentId: "STU-2025-001", marks: 85, grade: "A" },
  { id: "s2", name: "Alice Johnson", studentId: "STU-2025-002", marks: 92, grade: "A+" },
  { id: "s3", name: "Bob Williams", studentId: "STU-2025-003", marks: 73, grade: "B" },
  { id: "s4", name: "Emma Brown", studentId: "STU-2025-004", marks: 68, grade: "B-" },
  { id: "s5", name: "David Davis", studentId: "STU-2025-005", marks: 95, grade: "A+" },
  { id: "s6", name: "Sarah Miller", studentId: "STU-2025-006", marks: 78, grade: "B+" },
  { id: "s7", name: "Michael Wilson", studentId: "STU-2025-007", marks: 88, grade: "A" },
  { id: "s8", name: "Jennifer Taylor", studentId: "STU-2025-008", marks: 55, grade: "C" },
];

function getGrade(marks: number, total: number): string {
  const pct = (marks / total) * 100;
  if (pct >= 90) return "A+";
  if (pct >= 85) return "A";
  if (pct >= 80) return "A-";
  if (pct >= 75) return "B+";
  if (pct >= 70) return "B";
  if (pct >= 65) return "B-";
  if (pct >= 60) return "C+";
  if (pct >= 55) return "C";
  return "F";
}

export default function ResultsPage() {
  const [selectedCourse, setSelectedCourse] = useState("");
  const [selectedExam, setSelectedExam] = useState("");
  const [markInputs, setMarkInputs] = useState<Record<string, string>>({});

  const exams = selectedCourse ? (mockExams[selectedCourse] || []) : [];
  const currentExam = selectedExam ? exams.find((e) => e.id === selectedExam) : null;
  const totalMarks = currentExam?.totalMarks || 100;

  const results = (() => {
    if (!selectedCourse || !selectedExam) return [];
    return mockStudentResults.map((s) => ({
      ...s,
      marks: markInputs[s.id] ? Number(markInputs[s.id]) : 0,
      grade: markInputs[s.id] ? getGrade(Number(markInputs[s.id]), totalMarks) : "",
    }));
  })();

  const handleMarksChange = (studentId: string, value: string) => {
    setMarkInputs((prev) => ({ ...prev, [studentId]: value }));
  };

  const handleSave = () => {
    toast.success("Results saved successfully!");
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Results"
        description="Manage examination results"
        icon={BarChart3}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm"><Upload className="mr-2 h-4 w-4" /> Import</Button>
            <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" /> Export</Button>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Enter Results</CardTitle>
          <CardDescription>Select a course and exam to enter student marks</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={selectedCourse} onValueChange={(v) => { setSelectedCourse(v); setSelectedExam(""); }}>
                <SelectTrigger><SelectValue placeholder="Select course" /></SelectTrigger>
                <SelectContent>
                  {mockCourses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>{c.code} - {c.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Exam</Label>
              <Select value={selectedExam} onValueChange={setSelectedExam} disabled={!selectedCourse}>
                <SelectTrigger><SelectValue placeholder="Select exam" /></SelectTrigger>
                <SelectContent>
                  {exams.map((e) => (
                    <SelectItem key={e.id} value={e.id}>{e.name} ({e.totalMarks} marks)</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Total Marks</Label>
              <Input value={totalMarks} disabled />
            </div>
          </div>
        </CardContent>
      </Card>

      {results.length > 0 && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="text-lg">Student Results</CardTitle>
              <CardDescription>Enter marks for each student</CardDescription>
            </div>
            <Button size="sm" onClick={handleSave}>Save Results</Button>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student ID</TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead className="w-[150px]">Marks</TableHead>
                    <TableHead className="w-[80px]">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {results.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-mono text-xs">{result.studentId}</TableCell>
                      <TableCell className="font-medium">{result.name}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          max={totalMarks}
                          value={markInputs[result.id] || ""}
                          onChange={(e) => handleMarksChange(result.id, e.target.value)}
                          className="h-8 w-24"
                        />
                      </TableCell>
                      <TableCell>
                        <Badge variant={result.grade.startsWith("A") ? "default" : result.grade.startsWith("F") ? "destructive" : "secondary"}>
                          {result.grade}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
