"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { FormDialog } from "@/components/dashboard/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Users, Plus, MoreHorizontal, Pencil, Trash2, Mail, Phone } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/fetcher";

interface Teacher {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  designation: string;
  qualification: string;
  specialization: string;
  bio: string;
  avatar?: string;
  [key: string]: unknown;
}

const mockTeachers: Teacher[] = [
  { id: "1", name: "Dr. Sarah Johnson", email: "sarah.j@greenfield.edu", phone: "+1 555-0201", department: "Computer Science", designation: "Professor", qualification: "Ph.D. CS", specialization: "AI & Machine Learning", bio: "Expert in artificial intelligence with 15 years of experience." },
  { id: "2", name: "Prof. Michael Chen", email: "michael.c@greenfield.edu", phone: "+1 555-0202", department: "Engineering", designation: "Associate Professor", qualification: "Ph.D. Eng", specialization: "Mechanical Systems", bio: "Specialist in thermal engineering and robotics." },
  { id: "3", name: "Dr. Emily Brown", email: "emily.b@greenfield.edu", phone: "+1 555-0203", department: "Business Admin", designation: "Professor", qualification: "Ph.D. MBA", specialization: "Strategic Management", bio: "Published researcher in business strategy and leadership." },
  { id: "4", name: "Prof. David Wilson", email: "david.w@greenfield.edu", phone: "+1 555-0204", department: "Arts & Humanities", designation: "Assistant Professor", qualification: "M.A. Literature", specialization: "Modern Literature", bio: "Award-winning author and literature scholar." },
  { id: "5", name: "Dr. Lisa Park", email: "lisa.p@greenfield.edu", phone: "+1 555-0205", department: "Science", designation: "Professor", qualification: "Ph.D. Physics", specialization: "Quantum Mechanics", bio: "Researcher in quantum physics and nanotechnology." },
  { id: "6", name: "Prof. James Taylor", email: "james.t@greenfield.edu", phone: "+1 555-0206", department: "Medicine", designation: "Associate Professor", qualification: "MD, Ph.D.", specialization: "Neuroscience", bio: "Expert in neurology with clinical experience." },
];

const emptyForm = { name: "", email: "", phone: "", department: "", designation: "", qualification: "", specialization: "", bio: "", salary: 0 };

export default function TeachersPage() {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    apiFetch<Teacher[]>("/api/teachers")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setTeachers(data);
        else setTeachers(mockTeachers);
      })
      .catch(() => setTeachers(mockTeachers))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => { setSelectedTeacher(null); setForm(emptyForm); setDialogOpen(true); };
  const handleEdit = (teacher: Teacher) => {
    setSelectedTeacher(teacher);
    setForm({ name: teacher.name, email: teacher.email, phone: teacher.phone, department: teacher.department, designation: teacher.designation, qualification: teacher.qualification, specialization: teacher.specialization, bio: teacher.bio, salary: 0 });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      if (selectedTeacher) {
        setTeachers((prev) => prev.map((t) => (t.id === selectedTeacher.id ? { ...t, ...form } : t)));
        toast.success("Teacher updated successfully");
      } else {
        setTeachers((prev) => [{ ...form, id: String(Date.now()) }, ...prev]);
        toast.success("Teacher added successfully");
      }
      setDialogOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = () => {
    if (selectedTeacher) {
      setTeachers((prev) => prev.filter((t) => t.id !== selectedTeacher.id));
      toast.success("Teacher deleted successfully");
      setDeleteOpen(false);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <PageHeader title="Teachers" description="Manage faculty members" icon={Users} />
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}><CardContent className="p-6"><div className="animate-pulse space-y-4"><div className="h-20 w-20 rounded-full bg-muted mx-auto" /><div className="h-4 bg-muted rounded w-3/4 mx-auto" /><div className="h-3 bg-muted rounded w-1/2 mx-auto" /></div></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Teachers"
        description="Manage faculty and staff members"
        icon={Users}
        actions={<Button size="sm" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> Add Teacher</Button>}
      />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {teachers.map((teacher) => (
          <Card key={teacher.id} className="group hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                    {teacher.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                  </div>
                  <div>
                    <h3 className="font-semibold">{teacher.name}</h3>
                    <p className="text-sm text-muted-foreground">{teacher.designation}</p>
                    <Badge variant="outline" className="mt-1 text-xs">{teacher.department}</Badge>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(teacher)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSelectedTeacher(teacher); setDeleteOpen(true); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <div className="mt-4 space-y-2 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" /> <span className="truncate">{teacher.email}</span>
                </div>
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" /> <span>{teacher.phone}</span>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mt-2">{teacher.bio}</p>
              </div>
              <div className="mt-3 pt-3 border-t flex items-center gap-2 text-xs">
                <Badge variant="secondary">{teacher.qualification}</Badge>
                <span className="text-muted-foreground">{teacher.specialization}</span>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={selectedTeacher ? "Edit Teacher" : "Add New Teacher"} size="lg" onSubmit={handleSubmit} loading={formLoading}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2"><Label>Full Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Dr. John Smith" /></div>
          <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></div>
          <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="space-y-2"><Label>Department</Label>
            <Select value={form.department} onValueChange={(v) => setForm({ ...form, department: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Computer Science">Computer Science</SelectItem>
                <SelectItem value="Engineering">Engineering</SelectItem>
                <SelectItem value="Business Admin">Business Admin</SelectItem>
                <SelectItem value="Arts & Humanities">Arts & Humanities</SelectItem>
                <SelectItem value="Science">Science</SelectItem>
                <SelectItem value="Medicine">Medicine</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Designation</Label>
            <Select value={form.designation} onValueChange={(v) => setForm({ ...form, designation: v })}>
              <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Professor">Professor</SelectItem>
                <SelectItem value="Associate Professor">Associate Professor</SelectItem>
                <SelectItem value="Assistant Professor">Assistant Professor</SelectItem>
                <SelectItem value="Lecturer">Lecturer</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Qualification</Label><Input value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} placeholder="Ph.D. CS" /></div>
          <div className="space-y-2"><Label>Specialization</Label><Input value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} /></div>
          <div className="col-span-2 space-y-2"><Label>Bio</Label><Textarea value={form.bio} onChange={(e) => setForm({ ...form, bio: e.target.value })} rows={3} /></div>
        </div>
      </FormDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Teacher</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to remove {selectedTeacher?.name}? This action cannot be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
