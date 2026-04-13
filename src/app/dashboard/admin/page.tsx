"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsCard } from "@/components/dashboard/stats-card";
import { useAuth } from "@/lib/auth-context";
import {
  GraduationCap, Users, BookOpen, ClipboardList, DollarSign, UserCheck,
  TrendingUp, Calendar, ArrowUpRight, Plus, FileText, BarChart3
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from "recharts";
import { apiFetch } from "@/lib/fetcher";

const enrollmentData = [
  { month: "Jan", students: 120 },
  { month: "Feb", students: 145 },
  { month: "Mar", students: 178 },
  { month: "Apr", students: 210 },
  { month: "May", students: 245 },
  { month: "Jun", students: 280 },
  { month: "Jul", students: 310 },
  { month: "Aug", students: 356 },
  { month: "Sep", students: 420 },
  { month: "Oct", students: 450 },
  { month: "Nov", students: 478 },
  { month: "Dec", students: 512 },
];

const admissionData = [
  { name: "Pending", value: 42, color: "#f59e0b" },
  { name: "Approved", value: 285, color: "#10b981" },
  { name: "Rejected", value: 38, color: "#ef4444" },
  { name: "Waitlisted", value: 15, color: "#8b5cf6" },
];

const departmentData = [
  { name: "Computer Science", value: 125, color: "#3b82f6" },
  { name: "Business Admin", value: 98, color: "#10b981" },
  { name: "Engineering", value: 87, color: "#f59e0b" },
  { name: "Arts & Humanities", value: 72, color: "#8b5cf6" },
  { name: "Science", value: 65, color: "#ef4444" },
  { name: "Medicine", value: 45, color: "#06b6d4" },
];

const recentActivity = [
  { id: 1, text: "New student John Smith registered for Computer Science", time: "5 min ago", type: "enrollment" },
  { id: 2, text: "Admission application #ADM-2025-0042 approved", time: "15 min ago", type: "admission" },
  { id: 3, text: "Teacher Dr. Sarah Johnson updated Physics course", time: "1 hour ago", type: "course" },
  { id: 4, text: "Mid-term exam results for Mathematics published", time: "2 hours ago", type: "result" },
  { id: 5, text: "New notice posted: Annual Sports Day Schedule", time: "3 hours ago", type: "notice" },
  { id: 6, text: "Fee payment received from Alice Brown - $2,500", time: "4 hours ago", type: "payment" },
  { id: 7, text: "Attendance marked for Class 10-A - Biology", time: "5 hours ago", type: "attendance" },
];

const barChartData = [
  { name: "Mon", present: 420, absent: 30 },
  { name: "Tue", present: 410, absent: 40 },
  { name: "Wed", present: 430, absent: 20 },
  { name: "Thu", present: 400, absent: 50 },
  { name: "Fri", present: 380, absent: 70 },
  { name: "Sat", present: 350, absent: 100 },
];

export default function AdminDashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 512,
    totalTeachers: 48,
    activeCourses: 35,
    pendingAdmissions: 42,
    totalRevenue: 1250000,
    attendanceRate: 94.5,
  });

  useEffect(() => {
    apiFetch("/api/dashboard/stats")
      .then((data) => {
        if (data) setStats((prev) => ({ ...prev, ...data }));
      })
      .catch(() => {
        // Use mock data on error
      });
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <Card className="bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0">
        <CardContent className="p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold">Welcome back, {user?.name || "Admin"}! 👋</h1>
            <p className="text-primary-foreground/80 mt-1">
              Here&apos;s what&apos;s happening at Greenfield Academy today.
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0">
              <Calendar className="mr-2 h-4 w-4" />
              Academic Calendar
            </Button>
            <Button variant="secondary" size="sm" className="bg-white/20 hover:bg-white/30 text-primary-foreground border-0">
              <Plus className="mr-2 h-4 w-4" />
              Quick Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatsCard
          title="Total Students"
          value={stats.totalStudents.toLocaleString()}
          icon={GraduationCap}
          trend={{ value: 12.5, label: "vs last month", isPositive: true }}
        />
        <StatsCard
          title="Total Teachers"
          value={stats.totalTeachers}
          icon={Users}
          trend={{ value: 4.2, label: "vs last month", isPositive: true }}
        />
        <StatsCard
          title="Active Courses"
          value={stats.activeCourses}
          icon={BookOpen}
          trend={{ value: 8.1, label: "vs last month", isPositive: true }}
        />
        <StatsCard
          title="Pending Admissions"
          value={stats.pendingAdmissions}
          icon={ClipboardList}
          trend={{ value: 5.3, label: "vs last month", isPositive: false }}
        />
        <StatsCard
          title="Total Revenue"
          value={`$${(stats.totalRevenue / 1000).toFixed(0)}K`}
          icon={DollarSign}
          trend={{ value: 15.8, label: "vs last month", isPositive: true }}
        />
        <StatsCard
          title="Attendance Rate"
          value={`${stats.attendanceRate}%`}
          icon={UserCheck}
          trend={{ value: 2.1, label: "vs last month", isPositive: true }}
        />
      </div>

      {/* Charts */}
      <Tabs defaultValue="enrollment" className="space-y-4">
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="enrollment">Enrollment Trends</TabsTrigger>
            <TabsTrigger value="admissions">Admissions</TabsTrigger>
            <TabsTrigger value="departments">Departments</TabsTrigger>
            <TabsTrigger value="attendance">Weekly Attendance</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="enrollment">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Student Enrollment Over Months</CardTitle>
              <CardDescription>Monthly enrollment trend for the current academic year</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={enrollmentData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="month" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="students"
                      stroke="#3b82f6"
                      strokeWidth={3}
                      dot={{ fill: "#3b82f6", strokeWidth: 2, r: 4 }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="admissions">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Admission Status Distribution</CardTitle>
                <CardDescription>Breakdown of all admission applications</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={admissionData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={4}
                        dataKey="value"
                      >
                        {admissionData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Students by Department</CardTitle>
                <CardDescription>Distribution across academic departments</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={departmentData} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis type="number" className="text-xs" />
                      <YAxis type="category" dataKey="name" width={120} className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "hsl(var(--card))",
                          border: "1px solid hsl(var(--border))",
                          borderRadius: "8px",
                          fontSize: "12px",
                        }}
                      />
                      <Bar dataKey="value" radius={[0, 4, 4, 0]}>
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="departments">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Students by Department</CardTitle>
              <CardDescription>Pie chart distribution of enrolled students</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      outerRadius={120}
                      paddingAngle={3}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Weekly Attendance Overview</CardTitle>
              <CardDescription>Present vs absent students this week</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[350px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={barChartData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="name" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "hsl(var(--card))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: "8px",
                        fontSize: "12px",
                      }}
                    />
                    <Legend />
                    <Bar dataKey="present" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="absent" fill="#ef4444" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recent Activity & Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Recent Activity</CardTitle>
            <CardDescription>Latest activities across the system</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-1">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 pb-4 border-b last:border-0 last:pb-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 mt-0.5">
                    {activity.type === "enrollment" && <GraduationCap className="h-4 w-4 text-primary" />}
                    {activity.type === "admission" && <ClipboardList className="h-4 w-4 text-emerald-600" />}
                    {activity.type === "course" && <BookOpen className="h-4 w-4 text-blue-600" />}
                    {activity.type === "result" && <BarChart3 className="h-4 w-4 text-amber-600" />}
                    {activity.type === "notice" && <FileText className="h-4 w-4 text-purple-600" />}
                    {activity.type === "payment" && <DollarSign className="h-4 w-4 text-green-600" />}
                    {activity.type === "attendance" && <UserCheck className="h-4 w-4 text-cyan-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm">{activity.text}</p>
                    <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Quick Actions</CardTitle>
            <CardDescription>Common tasks at your fingertips</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {[
                { label: "Add New Student", icon: GraduationCap, href: "/dashboard/admin/students" },
                { label: "Review Admissions", icon: ClipboardList, href: "/dashboard/admin/admissions" },
                { label: "Create Course", icon: BookOpen, href: "/dashboard/admin/courses" },
                { label: "Post Notice", icon: FileText, href: "/dashboard/admin/notices" },
                { label: "Add Event", icon: Calendar, href: "/dashboard/admin/events" },
                { label: "View Reports", icon: BarChart3, href: "/dashboard/admin/results" },
              ].map((action) => (
                <a
                  key={action.label}
                  href={action.href}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors"
                >
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
                    <action.icon className="h-4 w-4 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{action.label}</span>
                  <ArrowUpRight className="h-4 w-4 ml-auto text-muted-foreground" />
                </a>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
