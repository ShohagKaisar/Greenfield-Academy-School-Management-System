"use client";

import React, { useState, useEffect } from "react";
import { useRequireAuth } from "@/lib/auth-context";
import { apiGet } from "@/lib/fetcher";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CourseProgressCard } from "@/components/student/course-progress-card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Users,
  Search,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface Course {
  id: string;
  title: string;
  code?: string;
  description?: string;
  teacherName?: string;
  progress: number;
  grade?: string;
  schedule?: string;
  enrolled: number;
  seats: number;
  category: string;
}

const mockCourses: Course[] = [
  { id: "1", title: "Mathematics I", code: "MATH101", teacherName: "Dr. Sarah Smith", progress: 78, grade: "A-", schedule: "Sat, Mon, Wed - 08:00", enrolled: 28, seats: 30, category: "science", description: "Calculus, Linear Algebra, and Analytical Geometry" },
  { id: "2", title: "Physics I", code: "PHYS101", teacherName: "Prof. James Johnson", progress: 65, grade: "B+", schedule: "Sat, Tue, Thu - 09:15", enrolled: 25, seats: 30, category: "science", description: "Mechanics, Thermodynamics, and Waves" },
  { id: "3", title: "Chemistry I", code: "CHEM101", teacherName: "Dr. Emily Wilson", progress: 82, grade: "A", schedule: "Sun, Tue, Thu - 10:30", enrolled: 30, seats: 30, category: "science", description: "Organic and Inorganic Chemistry fundamentals" },
  { id: "4", title: "English Literature", code: "ENG201", teacherName: "Ms. Rachel Davis", progress: 90, grade: "A+", schedule: "Mon, Wed - 01:00", enrolled: 22, seats: 30, category: "arts", description: "Modern English Literature and Critical Analysis" },
  { id: "5", title: "Biology I", code: "BIO101", teacherName: "Dr. Michael Brown", progress: 55, grade: "B", schedule: "Sun, Wed, Fri - 11:45", enrolled: 26, seats: 30, category: "science", description: "Cell Biology, Genetics, and Evolution" },
  { id: "6", title: "Computer Science", code: "CS101", teacherName: "Prof. David Lee", progress: 72, grade: "A-", schedule: "Tue, Thu - 02:00", enrolled: 30, seats: 30, category: "technology", description: "Introduction to Programming and Algorithms" },
];

const categoryColors: Record<string, string> = {
  science: "bg-blue-100 text-blue-700",
  arts: "bg-purple-100 text-purple-700",
  technology: "bg-green-100 text-green-700",
  general: "bg-gray-100 text-gray-700",
};

export default function StudentCourses() {
  useRequireAuth("student");
  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [search, setSearch] = useState("");
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await apiGet<Course[]>("/api/courses");
        if (Array.isArray(data) && data.length > 0) {
          setCourses(
            data.map((c) => ({
              ...c,
              progress: (c as Course).progress ?? Math.floor(Math.random() * 40 + 50),
              teacherName: (c as Course).teacherName ?? "Faculty",
            }))
          );
        } else {
          setCourses(mockCourses);
        }
      } catch {
        setCourses(mockCourses);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((c) =>
    c.title.toLowerCase().includes(search.toLowerCase()) ||
    c.code?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">My Courses</h1>
          <p className="text-sm text-muted-foreground">
            {courses.length} courses enrolled
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/programs">
            <Button variant="outline" className="gap-2">
              <Plus className="h-4 w-4" />
              Browse More
            </Button>
          </Link>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search courses..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Courses Grid */}
      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-40" />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseProgressCard
              key={course.id}
              title={course.title}
              teacher={course.teacherName}
              progress={course.progress}
              grade={course.grade}
              schedule={course.schedule}
              onClick={() => setSelectedCourse(course)}
            />
          ))}
        </div>
      )}

      {filteredCourses.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <BookOpen className="mx-auto h-12 w-12 text-muted-foreground/40" />
          <p className="mt-3 text-lg font-medium">No courses found</p>
          <p className="text-sm text-muted-foreground">
            Try adjusting your search or browse available courses.
          </p>
        </Card>
      )}

      {/* Course Detail Dialog */}
      <Dialog open={!!selectedCourse} onOpenChange={() => setSelectedCourse(null)}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {selectedCourse?.code && (
                <Badge variant="secondary" className="mr-2">
                  {selectedCourse.code}
                </Badge>
              )}
              {selectedCourse?.title}
            </DialogTitle>
          </DialogHeader>
          {selectedCourse && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                {selectedCourse.description}
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Instructor</p>
                  <p className="text-sm font-semibold">{selectedCourse.teacherName}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Schedule</p>
                  <p className="text-sm font-semibold">{selectedCourse.schedule}</p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Enrolled</p>
                  <p className="text-sm font-semibold">
                    {selectedCourse.enrolled} / {selectedCourse.seats} students
                  </p>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-xs text-muted-foreground">Grade</p>
                  <p className="text-sm font-semibold text-primary">
                    {selectedCourse.grade || "In Progress"}
                  </p>
                </div>
              </div>
              <div>
                <p className="mb-2 text-xs text-muted-foreground">Progress</p>
                <div className="h-2.5 overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full rounded-full bg-primary transition-all"
                    style={{ width: `${selectedCourse.progress}%` }}
                  />
                </div>
                <p className="mt-1 text-right text-xs text-muted-foreground">
                  {selectedCourse.progress}% Complete
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
