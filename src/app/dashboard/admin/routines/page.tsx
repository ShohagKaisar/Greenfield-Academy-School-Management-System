"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { FormDialog } from "@/components/dashboard/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Timer, Plus, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";

const days = ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
const timeSlots = ["08:00", "09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"];

interface Routine {
  id: string;
  course: string;
  courseCode: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  teacher: string;
  [key: string]: unknown;
}

const mockRoutines: Routine[] = [
  { id: "1", course: "Data Structures", courseCode: "CS-201", day: "Saturday", startTime: "09:00", endTime: "10:30", room: "Room 101", teacher: "Dr. Sarah Johnson" },
  { id: "2", course: "Calculus II", courseCode: "MATH-102", day: "Saturday", startTime: "11:00", endTime: "12:30", room: "Room 203", teacher: "Prof. David Lee" },
  { id: "3", course: "Physics Lab", courseCode: "PHY-101", day: "Sunday", startTime: "08:00", endTime: "11:00", room: "Lab 1", teacher: "Dr. Lisa Park" },
  { id: "4", course: "English Literature", courseCode: "ENG-201", day: "Sunday", startTime: "13:00", endTime: "14:30", room: "Room 305", teacher: "Prof. Emily Brown" },
  { id: "5", course: "Database Systems", courseCode: "CS-301", day: "Monday", startTime: "09:00", endTime: "10:30", room: "Room 101", teacher: "Dr. Sarah Johnson" },
  { id: "6", course: "Statistics", courseCode: "STAT-101", day: "Monday", startTime: "11:00", endTime: "12:30", room: "Room 203", teacher: "Prof. Michael Chen" },
  { id: "7", course: "Algorithms", courseCode: "CS-202", day: "Tuesday", startTime: "09:00", endTime: "10:30", room: "Room 101", teacher: "Dr. Sarah Johnson" },
  { id: "8", course: "Organic Chemistry", courseCode: "CHEM-201", day: "Tuesday", startTime: "14:00", endTime: "15:30", room: "Lab 2", teacher: "Dr. James Taylor" },
];

const emptyForm = { course: "", courseCode: "", day: "Saturday", startTime: "09:00", endTime: "10:30", room: "", teacher: "" };

const dayColors: Record<string, string> = {
  Saturday: "bg-blue-50 border-blue-200 text-blue-800",
  Sunday: "bg-emerald-50 border-emerald-200 text-emerald-800",
  Monday: "bg-purple-50 border-purple-200 text-purple-800",
  Tuesday: "bg-amber-50 border-amber-200 text-amber-800",
  Wednesday: "bg-rose-50 border-rose-200 text-rose-800",
  Thursday: "bg-cyan-50 border-cyan-200 text-cyan-800",
  Friday: "bg-gray-50 border-gray-200 text-gray-800",
};

export default function RoutinesPage() {
  const [routines, setRoutines] = useState<Routine[]>(mockRoutines);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [view, setView] = useState<"grid" | "list">("grid");

  const handleAdd = () => { setSelectedRoutine(null); setForm(emptyForm); setDialogOpen(true); };
  const handleEdit = (routine: Routine) => {
    setSelectedRoutine(routine);
    setForm({ course: routine.course, courseCode: routine.courseCode, day: routine.day, startTime: routine.startTime, endTime: routine.endTime, room: routine.room, teacher: routine.teacher });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      if (selectedRoutine) {
        setRoutines((prev) => prev.map((r) => (r.id === selectedRoutine.id ? { ...r, ...form } : r)));
        toast.success("Routine updated successfully");
      } else {
        setRoutines((prev) => [...prev, { ...form, id: String(Date.now()) }]);
        toast.success("Routine added successfully");
      }
      setDialogOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = () => {
    if (selectedRoutine) {
      setRoutines((prev) => prev.filter((r) => r.id !== selectedRoutine.id));
      toast.success("Routine deleted");
      setDeleteOpen(false);
    }
  };

  const getRoutineForSlot = (day: string, slot: string) => {
    return routines.find((r) => r.day === day && r.startTime === slot);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Routines"
        description="Manage class schedules and timetables"
        icon={Timer}
        actions={<Button size="sm" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> Add Routine</Button>}
      />

      {view === "grid" ? (
        <Card>
          <CardContent className="p-0 overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Header */}
              <div className="grid grid-cols-8 border-b">
                <div className="p-3 text-sm font-medium text-muted-foreground border-r">Time</div>
                {days.map((day) => (
                  <div key={day} className="p-3 text-sm font-medium text-center border-r last:border-r-0">{day}</div>
                ))}
              </div>
              {/* Body */}
              {timeSlots.map((slot) => (
                <div key={slot} className="grid grid-cols-8 border-b last:border-b-0">
                  <div className="p-2 text-xs font-medium text-muted-foreground flex items-center justify-center border-r bg-muted/50 min-h-[70px]">
                    {slot}
                  </div>
                  {days.map((day) => {
                    const routine = getRoutineForSlot(day, slot);
                    return (
                      <div key={`${day}-${slot}`} className="p-1 border-r last:border-r-0 min-h-[70px]">
                        {routine ? (
                          <div className={`${dayColors[routine.day]} border rounded-md p-1.5 h-full text-xs relative group`}>
                            <p className="font-semibold truncate">{routine.courseCode}</p>
                            <p className="truncate opacity-80">{routine.course}</p>
                            <p className="opacity-60 mt-0.5">{routine.room}</p>
                            <div className="absolute top-1 right-1 opacity-0 group-hover:opacity-100">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="h-5 w-5"><MoreHorizontal className="h-3 w-3" /></Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => handleEdit(routine)}><Pencil className="mr-2 h-3 w-3" /> Edit</DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => { setSelectedRoutine(routine); setDeleteOpen(true); }} className="text-destructive"><Trash2 className="mr-2 h-3 w-3" /> Delete</DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ) : null}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          {routines.map((routine) => (
            <Card key={routine.id} className="hover:shadow-sm transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className={`${dayColors[routine.day]} border rounded-lg px-3 py-2 text-xs font-medium min-w-[100px] text-center`}>
                  {routine.day}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-sm">{routine.course}</p>
                    <Badge variant="outline" className="text-xs">{routine.courseCode}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">{routine.teacher} · {routine.room}</p>
                </div>
                <div className="text-sm text-muted-foreground">{routine.startTime} - {routine.endTime}</div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(routine)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSelectedRoutine(routine); setDeleteOpen(true); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={selectedRoutine ? "Edit Routine" : "Add Routine"} onSubmit={handleSubmit} loading={formLoading}>
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Course Name</Label><Input value={form.course} onChange={(e) => setForm({ ...form, course: e.target.value })} /></div>
            <div className="space-y-2"><Label>Course Code</Label><Input value={form.courseCode} onChange={(e) => setForm({ ...form, courseCode: e.target.value })} placeholder="CS-101" /></div>
          </div>
          <div className="space-y-2"><Label>Day</Label>
            <Select value={form.day} onValueChange={(v) => setForm({ ...form, day: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>{days.map((d) => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Start Time</Label><Input type="time" value={form.startTime} onChange={(e) => setForm({ ...form, startTime: e.target.value })} /></div>
            <div className="space-y-2"><Label>End Time</Label><Input type="time" value={form.endTime} onChange={(e) => setForm({ ...form, endTime: e.target.value })} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Room</Label><Input value={form.room} onChange={(e) => setForm({ ...form, room: e.target.value })} /></div>
            <div className="space-y-2"><Label>Teacher</Label><Input value={form.teacher} onChange={(e) => setForm({ ...form, teacher: e.target.value })} /></div>
          </div>
        </div>
      </FormDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Routine</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this class routine?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
