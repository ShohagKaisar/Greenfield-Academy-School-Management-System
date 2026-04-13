"use client";

import React, { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/auth-context";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AssignmentForm } from "@/components/teacher/assignment-form";
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Users,
  Eye,
  Pencil,
  Trash2,
} from "lucide-react";

interface Assignment {
  id: string;
  title: string;
  description?: string;
  courseName: string;
  courseId: string;
  dueDate?: string;
  totalMarks: number;
  status: "active" | "closed";
  submissions: number;
  createdAt: string;
}

interface CourseOption {
  id: string;
  title: string;
}

const mockCourses: CourseOption[] = [
  { id: "1", title: "Mathematics I" },
  { id: "2", title: "Calculus II" },
  { id: "3", title: "Linear Algebra" },
  { id: "4", title: "Discrete Mathematics" },
];

const mockAssignments: Assignment[] = [
  { id: "1", title: "Assignment 3 - Integration", description: "Solve all integration problems from Chapter 5", courseName: "Mathematics I", courseId: "1", dueDate: "2025-01-25", totalMarks: 100, status: "active", submissions: 22, createdAt: "2025-01-10" },
  { id: "2", title: "Lab Report 2 - Differentiation", description: "Complete the lab experiment and write a report", courseName: "Calculus II", courseId: "2", dueDate: "2025-01-20", totalMarks: 50, status: "active", submissions: 18, createdAt: "2025-01-08" },
  { id: "3", title: "Problem Set 4", description: "Matrix operations and eigenvalues", courseName: "Linear Algebra", courseId: "3", dueDate: "2025-01-15", totalMarks: 80, status: "closed", submissions: 25, createdAt: "2025-01-05" },
  { id: "4", title: "Assignment 2 - Derivatives", description: "Practice problems on differentiation rules", courseName: "Mathematics I", courseId: "1", dueDate: "2025-01-12", totalMarks: 100, status: "closed", submissions: 30, createdAt: "2025-01-02" },
  { id: "5", title: "Quiz 1 Preparation", description: "Prepare notes for upcoming quiz on sets and logic", courseName: "Discrete Mathematics", courseId: "4", dueDate: "2025-01-28", totalMarks: 30, status: "active", submissions: 10, createdAt: "2025-01-14" },
];

const mockSubmissions = [
  { id: "1", studentName: "Alice Brown", submittedAt: "Jan 18, 2025", marks: 85, status: "graded" },
  { id: "2", studentName: "Bob Wilson", submittedAt: "Jan 17, 2025", marks: null, status: "pending" },
  { id: "3", studentName: "Carol Davis", submittedAt: "Jan 19, 2025", marks: 92, status: "graded" },
  { id: "4", studentName: "David Lee", submittedAt: "Jan 18, 2025", marks: null, status: "pending" },
];

export default function TeacherAssignments() {
  useRequireAuth("teacher");
  const [loading, setLoading] = useState(true);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [tab, setTab] = useState("all");
  const [selectedAssignment, setSelectedAssignment] = useState<Assignment | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<Assignment[]>("/api/assignments");
        if (Array.isArray(data) || (data && typeof data === "object")) {
          setAssignments(data);
        } else {
          setAssignments(mockAssignments);
        }
      } catch {
        setAssignments(mockAssignments);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredAssignments = assignments.filter((a) => {
    if (tab === "all") return true;
    if (tab === "active") return a.status === "active";
    if (tab === "closed") return a.status === "closed";
    return true;
  });

  const handleCreate = (data: Record<string, unknown>) => {
    const course = mockCourses.find((c) => c.id === (data as { courseId: string }).courseId);
    const newAssignment: Assignment = {
      id: `a-${Date.now()}`,
      title: (data as { title: string }).title,
      description: (data as { description?: string }).description,
      courseName: course?.title || "Unknown",
      courseId: (data as { courseId: string }).courseId,
      dueDate: (data as { dueDate?: string }).dueDate,
      totalMarks: (data as { totalMarks: number }).totalMarks,
      status: "active",
      submissions: 0,
      createdAt: new Date().toISOString().split("T")[0],
    };
    setAssignments((prev) => [newAssignment, ...prev]);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-96" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Assignments</h1>
          <p className="text-sm text-muted-foreground">
            Create and manage your assignments
          </p>
        </div>
        <AssignmentForm courses={mockCourses} onSubmit={handleCreate} />
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
              <FileText className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Total</p>
              <p className="text-xl font-bold">{assignments.length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-green-50">
              <Clock className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Active</p>
              <p className="text-xl font-bold">{assignments.filter((a) => a.status === "active").length}</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="flex items-center gap-3 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-50">
              <CheckCircle className="h-5 w-5 text-gray-600" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground">Closed</p>
              <p className="text-xl font-bold">{assignments.filter((a) => a.status === "closed").length}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">All ({assignments.length})</TabsTrigger>
          <TabsTrigger value="active">Active ({assignments.filter((a) => a.status === "active").length})</TabsTrigger>
          <TabsTrigger value="closed">Closed ({assignments.filter((a) => a.status === "closed").length})</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Assignment List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Due Date</TableHead>
                  <TableHead>Marks</TableHead>
                  <TableHead>Submissions</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAssignments.map((assignment) => (
                  <TableRow key={assignment.id}>
                    <TableCell>
                      <div>
                        <p className="text-sm font-medium">{assignment.title}</p>
                        {assignment.description && (
                          <p className="text-xs text-muted-foreground line-clamp-1">
                            {assignment.description}
                          </p>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm">{assignment.courseName}</TableCell>
                    <TableCell className="text-sm">
                      {assignment.dueDate ? (
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3 text-muted-foreground" />
                          {assignment.dueDate}
                        </div>
                      ) : (
                        "—"
                      )}
                    </TableCell>
                    <TableCell className="text-sm font-medium">
                      {assignment.totalMarks}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <Users className="h-3.5 w-3.5 text-muted-foreground" />
                        {assignment.submissions}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={
                          assignment.status === "active"
                            ? "bg-green-100 text-green-700"
                            : "bg-gray-100 text-gray-600"
                        }
                      >
                        {assignment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-1">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => setSelectedAssignment(assignment)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredAssignments.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                      No assignments found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Submissions Dialog */}
      <Dialog open={!!selectedAssignment} onOpenChange={() => setSelectedAssignment(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              Submissions - {selectedAssignment?.title}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-3">
            <div className="flex gap-4 text-sm text-muted-foreground">
              <span>
                <strong className="text-foreground">{mockSubmissions.length}</strong> submissions
              </span>
              <span>• {selectedAssignment?.totalMarks} marks</span>
              <span>• Due: {selectedAssignment?.dueDate}</span>
            </div>
            <div className="max-h-72 space-y-2 overflow-y-auto">
              {mockSubmissions.map((sub) => (
                <div key={sub.id} className="flex items-center justify-between rounded-lg border p-3">
                  <div>
                    <p className="text-sm font-medium">{sub.studentName}</p>
                    <p className="text-xs text-muted-foreground">{sub.submittedAt}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {sub.status === "graded" ? (
                      <Badge className="bg-green-100 text-green-700">{sub.marks}/100</Badge>
                    ) : (
                      <Badge className="bg-amber-100 text-amber-700">Pending</Badge>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
