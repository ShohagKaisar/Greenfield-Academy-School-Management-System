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
import { StatsCard } from "@/components/dashboard/stats-card";
import { UserCheck, Clock, AlertTriangle, CheckCircle } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { toast } from "sonner";

const attendanceStats = {
  present: 420,
  absent: 52,
  late: 28,
  total: 500,
};

const courseAttendance = [
  { name: "CS-101", present: 92, absent: 8 },
  { name: "BA-201", present: 88, absent: 12 },
  { name: "ENG-102", present: 95, absent: 5 },
  { name: "MED-401", present: 85, absent: 15 },
  { name: "ART-301", present: 78, absent: 22 },
];

const mockRecords = [
  { id: "1", student: "John Smith", studentId: "STU-001", course: "CS-101", status: "present" },
  { id: "2", student: "Alice Johnson", studentId: "STU-002", course: "CS-101", status: "present" },
  { id: "3", student: "Bob Williams", studentId: "STU-003", course: "CS-101", status: "absent" },
  { id: "4", student: "Emma Brown", studentId: "STU-004", course: "BA-201", status: "late" },
  { id: "5", student: "David Davis", studentId: "STU-005", course: "BA-201", status: "present" },
  { id: "6", student: "Sarah Miller", studentId: "STU-006", course: "ENG-102", status: "present" },
  { id: "7", student: "Michael Wilson", studentId: "STU-007", course: "ENG-102", status: "absent" },
  { id: "8", student: "Jennifer Taylor", studentId: "STU-008", course: "MED-401", status: "present" },
  { id: "9", student: "Chris Anderson", studentId: "STU-009", course: "ART-301", status: "present" },
  { id: "10", student: "Lisa Thomas", studentId: "STU-010", course: "ART-301", status: "late" },
];

export default function AttendancePage() {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split("T")[0]);
  const [selectedCourse, setSelectedCourse] = useState("all");
  const [records, setRecords] = useState(mockRecords);

  const filtered = selectedCourse === "all"
    ? records
    : records.filter((r) => r.course === selectedCourse);

  const statusBadge = (status: string) => {
    switch (status) {
      case "present": return <Badge className="bg-emerald-100 text-emerald-700 border-emerald-200">Present</Badge>;
      case "absent": return <Badge className="bg-red-100 text-red-700 border-red-200">Absent</Badge>;
      case "late": return <Badge className="bg-amber-100 text-amber-700 border-amber-200">Late</Badge>;
      default: return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Attendance" description="Monitor student attendance records" icon={UserCheck} />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Students" value={attendanceStats.total} icon={UserCheck} />
        <StatsCard title="Present" value={attendanceStats.present} icon={CheckCircle} iconColor="text-emerald-600" />
        <StatsCard title="Absent" value={attendanceStats.absent} icon={AlertTriangle} iconColor="text-red-600" />
        <StatsCard title="Late" value={attendanceStats.late} icon={Clock} iconColor="text-amber-600" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Course-wise Attendance</CardTitle>
          <CardDescription>Attendance percentage by course today</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={courseAttendance}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis dataKey="name" className="text-xs" />
                <YAxis className="text-xs" domain={[0, 100]} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px", fontSize: "12px" }} />
                <Legend />
                <Bar dataKey="present" fill="#10b981" name="Present %" radius={[4, 4, 0, 0]} />
                <Bar dataKey="absent" fill="#ef4444" name="Absent %" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Attendance Records</CardTitle>
          <CardDescription>Detailed attendance for the selected date</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <div className="space-y-2">
              <Label>Date</Label>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-44" />
            </div>
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-44"><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  <SelectItem value="CS-101">CS-101</SelectItem>
                  <SelectItem value="BA-201">BA-201</SelectItem>
                  <SelectItem value="ENG-102">ENG-102</SelectItem>
                  <SelectItem value="MED-401">MED-401</SelectItem>
                  <SelectItem value="ART-301">ART-301</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((record) => (
                  <TableRow key={record.id}>
                    <TableCell className="font-mono text-xs">{record.studentId}</TableCell>
                    <TableCell className="font-medium">{record.student}</TableCell>
                    <TableCell><Badge variant="outline">{record.course}</Badge></TableCell>
                    <TableCell>{statusBadge(record.status)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
