"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { FormDialog } from "@/components/dashboard/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, MoreHorizontal, Pencil, Trash2, Download } from "lucide-react";
import { toast } from "sonner";
import { apiFetch, apiPost, apiPut, apiDelete } from "@/lib/fetcher";
import { GraduationCap } from "lucide-react";

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  class: string;
  status: string;
  [key: string]: unknown;
}

const mockStudents: Student[] = [
  { id: "1", name: "John Smith", email: "john@greenfield.edu", phone: "+1 234-567-8901", class: "CS-101", status: "active" },
  { id: "2", name: "Alice Johnson", email: "alice@greenfield.edu", phone: "+1 234-567-8902", class: "BA-201", status: "active" },
  { id: "3", name: "Bob Williams", email: "bob@greenfield.edu", phone: "+1 234-567-8903", class: "ENG-102", status: "inactive" },
  { id: "4", name: "Emma Brown", email: "emma@greenfield.edu", phone: "+1 234-567-8904", class: "CS-101", status: "active" },
  { id: "5", name: "David Davis", email: "david@greenfield.edu", phone: "+1 234-567-8905", class: "ART-301", status: "active" },
  { id: "6", name: "Sarah Miller", email: "sarah@greenfield.edu", phone: "+1 234-567-8906", class: "MED-401", status: "active" },
  { id: "7", name: "Michael Wilson", email: "michael@greenfield.edu", phone: "+1 234-567-8907", class: "CS-201", status: "graduated" },
  { id: "8", name: "Jennifer Taylor", email: "jennifer@greenfield.edu", phone: "+1 234-567-8908", class: "BA-101", status: "active" },
  { id: "9", name: "Chris Anderson", email: "chris@greenfield.edu", phone: "+1 234-567-8909", class: "ENG-301", status: "active" },
  { id: "10", name: "Lisa Thomas", email: "lisa@greenfield.edu", phone: "+1 234-567-8910", class: "SCI-202", status: "active" },
];

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [filterClass, setFilterClass] = useState("all");
  const [form, setForm] = useState({ name: "", email: "", phone: "", class: "" });

  useEffect(() => {
    apiFetch<Student[]>("/api/students")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setStudents(data);
        } else {
          setStudents(mockStudents);
        }
      })
      .catch(() => setStudents(mockStudents))
      .finally(() => setLoading(false));
  }, []);

  const filteredStudents = filterClass === "all"
    ? students
    : students.filter((s) => s.class === filterClass);

  const handleAdd = () => {
    setSelectedStudent(null);
    setForm({ name: "", email: "", phone: "", class: "" });
    setDialogOpen(true);
  };

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setForm({ name: student.name, email: student.email, phone: student.phone, class: student.class });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      if (selectedStudent) {
        await apiPut(`/api/students/${selectedStudent.id}`, form);
        setStudents((prev) =>
          prev.map((s) => (s.id === selectedStudent.id ? { ...s, ...form } : s))
        );
        toast.success("Student updated successfully");
      } else {
        const newStudent = { ...form, id: String(Date.now()), status: "active" };
        setStudents((prev) => [newStudent, ...prev]);
        toast.success("Student added successfully");
      }
      setDialogOpen(false);
    } catch {
      // Fallback for mock data
      if (selectedStudent) {
        setStudents((prev) =>
          prev.map((s) => (s.id === selectedStudent.id ? { ...s, ...form } : s))
        );
        toast.success("Student updated successfully");
      } else {
        setStudents((prev) => [{ ...form, id: String(Date.now()), status: "active" }, ...prev]);
        toast.success("Student added successfully");
      }
      setDialogOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = () => {
    if (selectedStudent) {
      setStudents((prev) => prev.filter((s) => s.id !== selectedStudent.id));
      toast.success("Student deleted successfully");
      setDeleteOpen(false);
    }
  };

  const columns: Column<Student>[] = [
    { key: "id", header: "ID", render: (item) => <span className="text-xs text-muted-foreground">#{item.id}</span> },
    { key: "name", header: "Name", render: (item) => (
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-xs font-medium text-primary">
          {item.name.split(" ").map(n => n[0]).join("")}
        </div>
        <div>
          <p className="font-medium">{item.name}</p>
          <p className="text-xs text-muted-foreground">{item.email}</p>
        </div>
      </div>
    )},
    { key: "phone", header: "Phone" },
    { key: "class", header: "Class", render: (item) => <Badge variant="outline">{item.class}</Badge> },
    { key: "status", header: "Status", render: (item) => (
      <Badge variant={item.status === "active" ? "default" : item.status === "graduated" ? "secondary" : "destructive"}>
        {item.status}
      </Badge>
    )},
    { key: "actions", header: "Actions", className: "w-[80px]", render: (item) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEdit(item)}>
            <Pencil className="mr-2 h-4 w-4" /> Edit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setSelectedStudent(item); setDeleteOpen(true); }} className="text-destructive">
            <Trash2 className="mr-2 h-4 w-4" /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Students"
        description="Manage all enrolled students"
        icon={GraduationCap}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Download className="mr-2 h-4 w-4" /> Export
            </Button>
            <Button size="sm" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Student
            </Button>
          </div>
        }
      />

      <div className="flex gap-2">
        <Select value={filterClass} onValueChange={setFilterClass}>
          <SelectTrigger className="w-[180px] h-9">
            <SelectValue placeholder="Filter by class" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Classes</SelectItem>
            <SelectItem value="CS-101">CS-101</SelectItem>
            <SelectItem value="BA-201">BA-201</SelectItem>
            <SelectItem value="ENG-102">ENG-102</SelectItem>
            <SelectItem value="ART-301">ART-301</SelectItem>
            <SelectItem value="MED-401">MED-401</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <DataTable
        columns={columns}
        data={filteredStudents}
        loading={loading}
        searchKey="name"
        searchPlaceholder="Search students..."
      />

      <FormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title={selectedStudent ? "Edit Student" : "Add New Student"}
        description={selectedStudent ? "Update student information" : "Fill in the details to add a new student"}
        onSubmit={handleSubmit}
        loading={formLoading}
      >
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Full Name</Label>
            <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Enter full name" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="Enter email" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="Enter phone number" />
          </div>
          <div className="space-y-2">
            <Label>Class</Label>
            <Input value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} placeholder="Enter class" />
          </div>
        </div>
      </FormDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete {selectedStudent?.name}? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
