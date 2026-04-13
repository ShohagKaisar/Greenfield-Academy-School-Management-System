"use client";

import React, { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/auth-context";
import { apiGet } from "@/lib/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { BookOpen, Users, Clock, MapPin, ArrowRight } from "lucide-react";

interface TeacherCourse {
  id: string;
  title: string;
  code?: string;
  enrolled: number;
  seats: number;
  schedule?: string;
  batch?: string;
  room?: string;
  description?: string;
}

interface StudentInCourse {
  id: string;
  name: string;
  studentId: string;
  email: string;
  attendance?: number;
}

const mockCourses: TeacherCourse[] = [
  { id: "1", title: "Mathematics I", code: "MATH101", enrolled: 32, seats: 35, schedule: "Sat, Mon, Wed - 08:00", batch: "2025", room: "201", description: "Calculus, Linear Algebra, and Analytical Geometry" },
  { id: "2", title: "Calculus II", code: "MATH201", enrolled: 28, seats: 30, schedule: "Sat, Tue, Thu - 09:15", batch: "2025", room: "302", description: "Multivariable Calculus, Integration Techniques" },
  { id: "3", title: "Linear Algebra", code: "MATH301", enrolled: 25, seats: 30, schedule: "Sun, Wed, Fri - 10:30", batch: "2024", room: "105", description: "Vector Spaces, Matrices, Eigenvalues" },
  { id: "4", title: "Discrete Mathematics", code: "MATH102", enrolled: 30, seats: 30, schedule: "Mon, Wed, Thu - 01:00", batch: "2025", room: "201", description: "Logic, Sets, Graphs, Combinatorics" },
];

const mockStudents: StudentInCourse[] = [
  { id: "1", name: "Alice Brown", studentId: "STU-2025-001", email: "alice@greenfield.edu", attendance: 92 },
  { id: "2", name: "Bob Wilson", studentId: "STU-2025-002", email: "bob@greenfield.edu", attendance: 85 },
  { id: "3", name: "Carol Davis", studentId: "STU-2025-003", email: "carol@greenfield.edu", attendance: 78 },
  { id: "4", name: "David Lee", studentId: "STU-2025-004", email: "david@greenfield.edu", attendance: 95 },
  { id: "5", name: "Emma Johnson", studentId: "STU-2025-005", email: "emma@greenfield.edu", attendance: 88 },
  { id: "6", name: "Frank Garcia", studentId: "STU-2025-006", email: "frank@greenfield.edu", attendance: 72 },
  { id: "7", name: "Grace Martinez", studentId: "STU-2025-007", email: "grace@greenfield.edu", attendance: 90 },
  { id: "8", name: "Henry Anderson", studentId: "STU-2025-008", email: "henry@greenfield.edu", attendance: 83 },
];

export default function TeacherClasses() {
  useRequireAuth("teacher");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<TeacherCourse[]>([]);
  const [selectedCourse, setSelectedCourse] = useState<TeacherCourse | null>(null);
  const [students, setStudents] = useState<StudentInCourse[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<TeacherCourse[]>("/api/courses");
        if (Array.isArray(data) || (data && typeof data === "object")) {
          setCourses(data);
        } else {
          setCourses(mockCourses);
        }
      } catch {
        setCourses(mockCourses);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleViewStudents = (course: TeacherCourse) => {
    setSelectedCourse(course);
    setStudents(mockStudents);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 sm:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">My Classes</h1>
        <p className="text-sm text-muted-foreground">
          {courses.length} courses assigned
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {courses.map((course) => (
          <Card key={course.id} className="transition-all hover:shadow-md">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <BookOpen className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{course.title}</h3>
                    {course.code && (
                      <Badge variant="outline" className="mt-1 text-xs">
                        {course.code}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 text-sm">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>
                    <strong>{course.enrolled}</strong>/{course.seats} students
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs">{course.schedule}</span>
                </div>
                {course.room && (
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span>{course.room}</span>
                  </div>
                )}
                {course.batch && (
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-xs text-muted-foreground">Batch</span>
                    <span className="font-medium">{course.batch}</span>
                  </div>
                )}
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1 text-xs"
                  onClick={() => handleViewStudents(course)}
                >
                  View Students <ArrowRight className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Student List Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedCourse?.title} - Student List
            </DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-3">
              <div className="flex gap-4 text-sm text-muted-foreground">
                <span>
                  <strong className="text-foreground">{students.length}</strong> students enrolled
                </span>
                {selectedCourse.code && <span>• {selectedCourse.code}</span>}
              </div>
              <div className="max-h-96 overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>ID</TableHead>
                      <TableHead>Attendance</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => (
                      <TableRow key={student.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Avatar className="h-7 w-7">
                              <AvatarFallback className="bg-primary/10 text-[10px] text-primary">
                                {student.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="text-sm font-medium">{student.name}</p>
                              <p className="text-xs text-muted-foreground">{student.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="text-xs text-muted-foreground">
                          {student.studentId}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className={
                              (student.attendance ?? 0) >= 85
                                ? "bg-green-100 text-green-700"
                                : (student.attendance ?? 0) >= 75
                                ? "bg-amber-100 text-amber-700"
                                : "bg-red-100 text-red-700"
                            }
                          >
                            {student.attendance}%
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
