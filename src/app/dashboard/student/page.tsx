"use client";

import React, { useState, useEffect } from "react";
import { useAuth, useRequireAuth } from "@/lib/auth-context";
import { apiGet } from "@/lib/fetcher";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  BookOpen,
  Award,
  UserCheck,
  DollarSign,
  FileText,
  Calendar,
  Megaphone,
  Clock,
  TrendingUp,
  ArrowRight,
  GraduationCap,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface DashboardStats {
  enrolledCourses: number;
  gpa: number;
  attendanceRate: number;
  upcomingAssignments: number;
  pendingFees: number;
}

interface ScheduleItem {
  id: string;
  courseName: string;
  room: string;
  teacherName: string;
  startTime: string;
  endTime: string;
}

interface Notice {
  id: string;
  title: string;
  content?: string;
  createdAt: string;
  category: string;
}

const attendanceTrendData = [
  { day: "Sat", rate: 92 },
  { day: "Sun", rate: 88 },
  { day: "Mon", rate: 95 },
  { day: "Tue", rate: 91 },
  { day: "Wed", rate: 87 },
  { day: "Thu", rate: 94 },
  { day: "Fri", rate: 90 },
];

const courseProgressData = [
  { name: "Mathematics", progress: 78 },
  { name: "Physics", progress: 65 },
  { name: "Chemistry", progress: 82 },
  { name: "English", progress: 90 },
  { name: "Biology", progress: 55 },
];

const mockSchedule: ScheduleItem[] = [
  { id: "1", courseName: "Mathematics", room: "Room 201", teacherName: "Dr. Smith", startTime: "08:00", endTime: "09:00" },
  { id: "2", courseName: "Physics", room: "Lab 3", teacherName: "Prof. Johnson", startTime: "09:15", endTime: "10:15" },
  { id: "3", courseName: "English", room: "Room 105", teacherName: "Ms. Davis", startTime: "10:30", endTime: "11:30" },
  { id: "4", courseName: "Chemistry", room: "Lab 1", teacherName: "Dr. Wilson", startTime: "01:00", endTime: "02:00" },
];

const mockNotices: Notice[] = [
  { id: "1", title: "Mid-Term Exam Schedule Released", content: "Check the exam portal for details.", createdAt: "2025-01-15", category: "exam" },
  { id: "2", title: "Library Hours Extended", content: "Library will remain open until 10 PM during exam week.", createdAt: "2025-01-14", category: "general" },
  { id: "3", title: "Sports Day Registration", content: "Register for sports day events by January 20.", createdAt: "2025-01-13", category: "event" },
  { id: "4", title: "Fee Payment Deadline", content: "Last date for fee payment is January 25.", createdAt: "2025-01-12", category: "finance" },
  { id: "5", title: "Holiday Notice", content: "Academy will remain closed on Jan 26.", createdAt: "2025-01-11", category: "general" },
];

export default function StudentDashboard() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await apiGet<DashboardStats>("/api/dashboard/stats");
        if (data && typeof data === 'object' && 'enrolledCourses' in data) {
          setStats(data);
        } else {
          setStats({
            enrolledCourses: 5,
            gpa: 3.65,
            attendanceRate: 91,
            upcomingAssignments: 3,
            pendingFees: 1500,
          });
        }
      } catch {
        setStats({
          enrolledCourses: 5,
          gpa: 3.65,
          attendanceRate: 91,
          upcomingAssignments: 3,
          pendingFees: 1500,
        });
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const initials = user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "S";

  const quickLinks = [
    { href: "/dashboard/student/routine", label: "View Routine", icon: Calendar },
    { href: "/dashboard/student/results", label: "Check Results", icon: Award },
    { href: "/dashboard/student/fees", label: "Pay Fees", icon: DollarSign },
    { href: "/dashboard/student/downloads", label: "Documents", icon: FileText },
  ];

  const upcomingEvents = [
    { title: "Mid-Term Exams", date: "Jan 20 - Jan 30" },
    { title: "Science Fair", date: "Feb 5" },
    { title: "Parent-Teacher Meeting", date: "Feb 10" },
    { title: "Annual Sports Day", date: "Feb 20" },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-32 w-full" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-28" />
          ))}
        </div>
        <Skeleton className="h-80" />
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
              Welcome back, {user?.name || "Student"}! 👋
            </h1>
            <p className="mt-1 text-sm text-white/80 lg:text-base">
              Here&apos;s what&apos;s happening in your academic journey today.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {[
          { label: "Enrolled Courses", value: stats?.enrolledCourses ?? 5, icon: BookOpen, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "GPA / CGPA", value: stats?.gpa ?? 3.65, icon: Award, color: "text-green-600", bg: "bg-green-50", suffix: "/4.0" },
          { label: "Attendance Rate", value: `${stats?.attendanceRate ?? 91}%`, icon: UserCheck, color: "text-purple-600", bg: "bg-purple-50" },
          { label: "Assignments Due", value: stats?.upcomingAssignments ?? 3, icon: FileText, color: "text-amber-600", bg: "bg-amber-50" },
          { label: "Pending Fees", value: `$${stats?.pendingFees ?? 1500}`, icon: DollarSign, color: "text-red-600", bg: "bg-red-50" },
        ].map((stat) => (
          <Card key={stat.label} className="transition-all hover:shadow-md">
            <CardContent className="flex items-center gap-3 p-4">
              <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${stat.bg}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="min-w-0">
                <p className="truncate text-xs text-muted-foreground">{stat.label}</p>
                <p className="text-lg font-bold">
                  {stat.value}
                  {stat.suffix && (
                    <span className="text-sm font-normal text-muted-foreground">{stat.suffix}</span>
                  )}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
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
                  <span className="text-xs font-semibold text-primary">
                    {item.startTime}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {item.endTime}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{item.courseName}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.teacherName} • {item.room}
                  </p>
                </div>
              </div>
            ))}
            <Link href="/dashboard/student/routine">
              <Button variant="ghost" className="mt-2 w-full gap-1 text-xs text-primary">
                View Full Routine <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        {/* Attendance Trend */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <TrendingUp className="h-4 w-4 text-primary" />
              Attendance Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-56">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={attendanceTrendData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="day" tick={{ fontSize: 12 }} />
                  <YAxis domain={[80, 100]} tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "8px",
                      border: "1px solid #e5e7eb",
                      fontSize: "12px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="rate"
                    stroke="#2563eb"
                    strokeWidth={2.5}
                    dot={{ fill: "#2563eb", strokeWidth: 0, r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Notices & Events */}
        <Card className="lg:col-span-1">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Megaphone className="h-4 w-4 text-primary" />
              Notices & Events
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockNotices.slice(0, 4).map((notice) => (
              <div
                key={notice.id}
                className="flex items-start gap-2 rounded-lg border p-2.5"
              >
                <div className="mt-0.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium leading-tight">{notice.title}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {notice.createdAt}
                  </p>
                </div>
              </div>
            ))}
            <div className="mt-2 space-y-2 border-t pt-3">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Upcoming Events</p>
              {upcomingEvents.slice(0, 2).map((event) => (
                <div key={event.title} className="flex items-center gap-2">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  <span className="text-xs font-medium">{event.title}</span>
                  <span className="ml-auto text-xs text-muted-foreground">{event.date}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Progress */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-base">
              <GraduationCap className="h-4 w-4 text-primary" />
              Course Progress
            </CardTitle>
            <Link href="/dashboard/student/courses">
              <Button variant="ghost" className="gap-1 text-xs text-primary">
                View All <ArrowRight className="h-3 w-3" />
              </Button>
            </Link>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {courseProgressData.map((course) => (
              <div key={course.name} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{course.name}</span>
                  <span className="text-xs text-muted-foreground">{course.progress}%</span>
                </div>
                <Progress value={course.progress} className="h-2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {quickLinks.map((link) => (
          <Link key={link.href} href={link.href}>
            <Card className="flex items-center gap-3 p-4 transition-all hover:-translate-y-0.5 hover:shadow-md">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                <link.icon className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-semibold">{link.label}</p>
              </div>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
