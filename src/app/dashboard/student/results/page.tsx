"use client";

import React, { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/auth-context";
import { apiGet } from "@/lib/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Award, Download, TrendingUp } from "lucide-react";

interface ExamResult {
  id: string;
  courseName: string;
  examType: string;
  marks: number;
  totalMarks: number;
  grade: string;
  gpa: number;
  semester: string;
}

const mockResults: ExamResult[] = [
  { id: "1", courseName: "Mathematics", examType: "Mid-Term", marks: 85, totalMarks: 100, grade: "A", gpa: 3.7, semester: "Fall 2024" },
  { id: "2", courseName: "Physics", examType: "Mid-Term", marks: 78, totalMarks: 100, grade: "B+", gpa: 3.3, semester: "Fall 2024" },
  { id: "3", courseName: "Chemistry", examType: "Mid-Term", marks: 92, totalMarks: 100, grade: "A+", gpa: 4.0, semester: "Fall 2024" },
  { id: "4", courseName: "English", examType: "Mid-Term", marks: 88, totalMarks: 100, grade: "A", gpa: 3.7, semester: "Fall 2024" },
  { id: "5", courseName: "Biology", examType: "Mid-Term", marks: 72, totalMarks: 100, grade: "B", gpa: 3.0, semester: "Fall 2024" },
  { id: "6", courseName: "Mathematics", examType: "Final", marks: 90, totalMarks: 100, grade: "A+", gpa: 4.0, semester: "Fall 2024" },
  { id: "7", courseName: "Physics", examType: "Final", marks: 82, totalMarks: 100, grade: "A-", gpa: 3.7, semester: "Fall 2024" },
  { id: "8", courseName: "Chemistry", examType: "Final", marks: 88, totalMarks: 100, grade: "A", gpa: 3.7, semester: "Fall 2024" },
  { id: "9", courseName: "Mathematics", examType: "Quiz 1", marks: 18, totalMarks: 20, grade: "A", gpa: 3.7, semester: "Spring 2025" },
  { id: "10", courseName: "Physics", examType: "Quiz 1", marks: 15, totalMarks: 20, grade: "B+", gpa: 3.3, semester: "Spring 2025" },
  { id: "11", courseName: "Computer Science", examType: "Mid-Term", marks: 95, totalMarks: 100, grade: "A+", gpa: 4.0, semester: "Spring 2025" },
  { id: "12", courseName: "English", examType: "Final", marks: 91, totalMarks: 100, grade: "A+", gpa: 4.0, semester: "Fall 2024" },
];

export default function StudentResults() {
  useRequireAuth("student");
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState<ExamResult[]>([]);
  const [selectedSemester, setSelectedSemester] = useState("all");
  const [selectedExam, setSelectedExam] = useState("all");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<ExamResult[]>("/api/exams/results");
        if (Array.isArray(data) || (data && typeof data === "object")) {
          setResults(data);
        } else {
          setResults(mockResults);
        }
      } catch {
        setResults(mockResults);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const semesters = [...new Set(results.map((r) => r.semester))];
  const examTypes = [...new Set(results.map((r) => r.examType))];

  const filteredResults = results.filter((r) => {
    if (selectedSemester !== "all" && r.semester !== selectedSemester) return false;
    if (selectedExam !== "all" && r.examType !== selectedExam) return false;
    return true;
  });

  const overallGPA = filteredResults.length > 0
    ? (filteredResults.reduce((sum, r) => sum + r.gpa, 0) / filteredResults.length).toFixed(2)
    : "0.00";

  const chartData = (() => {
    const courseMap: Record<string, { total: number; count: number }> = {};
    filteredResults.forEach((r) => {
      if (!courseMap[r.courseName]) courseMap[r.courseName] = { total: 0, count: 0 };
      const percentage = (r.marks / r.totalMarks) * 100;
      courseMap[r.courseName].total += percentage;
      courseMap[r.courseName].count += 1;
    });
    return Object.entries(courseMap).map(([name, data]) => ({
      name,
      marks: Math.round(data.total / data.count),
    }));
  })();

  const gradeColor = (grade: string) => {
    if (grade.startsWith("A")) return "bg-green-100 text-green-700";
    if (grade.startsWith("B")) return "bg-blue-100 text-blue-700";
    if (grade.startsWith("C")) return "bg-amber-100 text-amber-700";
    return "bg-red-100 text-red-700";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Results & Grades</h1>
          <p className="text-sm text-muted-foreground">
            View your academic performance
          </p>
        </div>
        <Button variant="outline" className="gap-2">
          <Download className="h-4 w-4" />
          Download Transcript
        </Button>
      </div>

      {/* GPA Summary */}
      <div className="grid gap-4 sm:grid-cols-4">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <Award className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Overall GPA</p>
              <p className="text-2xl font-bold">{overallGPA}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-green-50">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Courses Passed</p>
              <p className="text-2xl font-bold">{filteredResults.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50">
              <span className="text-lg font-bold text-blue-600">🏆</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Highest GPA</p>
              <p className="text-2xl font-bold">
                {Math.max(...results.map((r) => r.gpa)).toFixed(1)}
              </p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-50">
              <span className="text-lg font-bold text-purple-600">📊</span>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Semesters</p>
              <p className="text-2xl font-bold">{semesters.length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select value={selectedSemester} onValueChange={setSelectedSemester}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Semester" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Semesters</SelectItem>
            {semesters.map((s) => (
              <SelectItem key={s} value={s}>
                {s}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={selectedExam} onValueChange={setSelectedExam}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Select Exam" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Exams</SelectItem>
            {examTypes.map((e) => (
              <SelectItem key={e} value={e}>
                {e}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Results Table */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Results</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="space-y-3 p-4">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-10" />
                ))}
              </div>
            ) : (
              <div className="max-h-[400px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Course</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Marks</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>GPA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredResults.map((result) => (
                      <TableRow key={result.id}>
                        <TableCell className="font-medium text-sm">
                          {result.courseName}
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {result.examType}
                        </TableCell>
                        <TableCell className="text-sm">
                          {result.marks}/{result.totalMarks}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={gradeColor(result.grade)}
                          >
                            {result.grade}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-sm">
                          {result.gpa.toFixed(1)}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Performance Chart */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Performance Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip
                      contentStyle={{
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                        fontSize: "12px",
                      }}
                    />
                    <Bar
                      dataKey="marks"
                      fill="#2563eb"
                      radius={[4, 4, 0, 0]}
                      barSize={40}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex h-full items-center justify-center text-muted-foreground">
                  No data to display
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
