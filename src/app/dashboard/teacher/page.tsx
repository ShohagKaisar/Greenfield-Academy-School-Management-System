"use client";

import React, { useState, useEffect } from "react";
import { useAuth, useRequireAuth } from "@/lib/auth-context";
import { apiGet } from "@/lib/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  Users,
  FileText,
  Calendar,
  Upload,
  UserCheck,
  Clock,
  ArrowRight,
  GraduationCap,
  BarChart3,
} from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface TeacherStats {
  myClasses: number;
  totalStudents: number;
  pendingAssignments: number;
  todayClasses: number;
}

interface ScheduleItem {
  id: string;
  courseName: string;
  room: string;
  startTime: string;
  endTime: string;
  section?: string;
}

interface RecentSubmission {
  id: string;
  studentName: string;
  courseName: string;
  title: string;
  submittedAt: string;
  status: "pending" | "reviewed";
}

const mockSchedule: ScheduleItem[] = [
  { id: "1", courseName: "Mathematics I", room: "Room 201", startTime: "08:00", endTime: "09:00", section: "A" },
  { id: "2", courseName: "Calculus II", room: "Room 302", startTime: "09:15", endTime: "10:15", section: "B" },
  { id: "3", courseName: "Mathematics I", room: "Room 201", startTime: "10:30", endTime: "11:30", section: "B" },
  { id: "4", courseName: "Linear Algebra", room: "Room 105", startTime: "01:00", endTime: "02:00", section: "A" },
];

const mockSubmissions: RecentSubmission[] = [
  { id: "1", studentName: "Alice Brown", courseName: "Mathematics I", title: "Assignment 3", submittedAt: "2 hours ago", status: "pending" },
  { id: "2", studentName: "Bob Wilson", courseName: "Calculus II", title: "Lab Report 2", submittedAt: "4 hours ago", status: "pending" },
  { id: "3", studentName: "Carol Davis", courseName: "Mathematics I", title: "Assignment 3", submittedAt: "6 hours ago", status: "reviewed" },
  { id: "4", studentName: "David Lee", courseName: "Linear Algebra", title: "Problem Set 5", submittedAt: "Yesterday", status: "reviewed" },
];

const studentPerformanceData = [
  { name: "Math I-A", avg: 78 },
  { name: "Math I-B", avg: 72 },
  { name: "Calc II", avg: 81 },
  { name: "Lin Alg", avg: 85 },
];

export default function TeacherDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<TeacherStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<TeacherStats>("/api/dashboard/stats");
        if (Array.isArray(data) || (data && typeof data === "object")) {
          setStats(data);
        } else {
          setStats({
            myClasses: 4,
            totalStudents: 128,
            pendingAssignments: 12,
            todayClasses: 4,
          });
        }
      } catch {
        setStats({
          myClasses: 4,
          totalStudents: 128,
          pendingAssignments: 12,
          todayClasses: 4,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "T";

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary via-primary/90 to-primary/80 p-6 text-primary-foreground shadow-lg lg:p-8">
        <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10" />
        <div className="absolute -bottom-10 right-20 h-32 w-32 rounded-full bg-white/5" />
        <div className="relative flex items-center gap-4">
          <Avatar className="h-16 w-16 border-2 border-white/30 lg:h-20 lg:w-20">
            <AvatarFallback className="bg-white/20 text-xl font-bold text-white lg:text-2xl">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold lg:text-3xl">
              Welcome back, {user?.name || "Teacher"}! 👨‍🏫
            </h1>
            <p className="mt-1 text-sm text-white/80 lg:text-base">
              Manage your classes, assignments, and student performance.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: "My Classes", value: stats?.myClasses ?? 4, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Total Students", value: stats?.totalStudents ?? 128, icon: Users, color: "text-green-600", bg: "bg-green-50" },
          { label: "Pending Reviews", value: stats?.pendingAssignments ?? 12, icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Today's Classes", value: stats?.todayClasses ?? 4, icon: Calendar, color: "text-purple-600", bg: "bg-purple-50" },
        ].map((stat) => (
          <Card key={stat.label} className="transition-all hover:shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Today's Schedule */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Clock className="h-4 w-4 text-primary" />
              Today&apos;s Classes
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockSchedule.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-lg border p-3 transition-colors hover:bg-muted/50"
              >
                <div className="flex flex-col items-center">
                  <span className="text-xs font-semibold text-primary">{item.startTime}</span>
                  <span className="text-[10px] text-muted-foreground">{item.endTime}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.courseName}</p>
                  <p className="text-xs text-muted-foreground">
                    Section {item.section} • {item.room}
                  </p>
                </div>
              </div>
            ))}
            <Link href="/dashboard/teacher/routine">
              <Button variant="ghost" className="mt-2 w-full gap-1 text-xs text-primary">
                View Full Routine <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Recent Submissions */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <FileText className="h-4 w-4 text-primary" />
              Recent Submissions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="flex items-start gap-3 rounded-lg border p-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{sub.studentName}</p>
                  <p className="text-xs text-muted-foreground">
                    {sub.courseName} - {sub.title}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground/60">
                    {sub.submittedAt}
                  </p>
                </div>
                <Badge
                  variant="secondary"
                  className={
                    sub.status === "pending"
                      ? "bg-amber-100 text-amber-700"
                      : "bg-green-100 text-green-700"
                  }
                >
                  {sub.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Student Performance Chart */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <BarChart3 className="h-4 w-4 text-primary" />
              Average Performance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={studentPerformanceData}>
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
                    dataKey="avg"
                    fill="#2563eb"
                    radius={[4, 4, 0, 0]}
                    barSize={36}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-3">
            <Link href="/dashboard/teacher/assignments">
              <Button variant="outline" className="w-full gap-2 h-auto py-4 flex-col">
                <Upload className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Upload Assignment</span>
                <span className="text-xs text-muted-foreground">Create new assignments</span>
              </Button>
            </Link>
            <Link href="/dashboard/teacher/attendance">
              <Button variant="outline" className="w-full gap-2 h-auto py-4 flex-col">
                <UserCheck className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Mark Attendance</span>
                <span className="text-xs text-muted-foreground">Record today&apos;s attendance</span>
              </Button>
            </Link>
            <Link href="/dashboard/teacher/results">
              <Button variant="outline" className="w-full gap-2 h-auto py-4 flex-col">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-sm font-medium">Post Results</span>
                <span className="text-xs text-muted-foreground">Upload exam results</span>
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
