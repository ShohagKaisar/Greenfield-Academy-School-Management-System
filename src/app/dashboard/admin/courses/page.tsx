"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { FormDialog } from "@/components/dashboard/form-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BookOpen, Plus, MoreHorizontal, Pencil, Trash2, Star, LayoutGrid, List } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/fetcher";

interface Course {
  id: string;
  title: string;
  code: string;
  category: string;
  level: string;
  duration: string;
  fees: number;
  seats: number;
  enrolled: number;
  status: string;
  featured: boolean;
  description: string;
  image?: string;
  [key: string]: unknown;
}

const mockCourses: Course[] = [
  { id: "1", title: "Introduction to Computer Science", code: "CS-101", category: "computer-science", level: "undergraduate", duration: "4 years", fees: 25000, seats: 60, enrolled: 45, status: "active", featured: true, description: "Learn fundamentals of programming, algorithms, and data structures." },
  { id: "2", title: "Business Administration", code: "BA-201", category: "business", level: "undergraduate", duration: "4 years", fees: 20000, seats: 50, enrolled: 38, status: "active", featured: true, description: "Comprehensive business management and leadership program." },
  { id: "3", title: "Mechanical Engineering", code: "ENG-102", category: "engineering", level: "undergraduate", duration: "4 years", fees: 30000, seats: 40, enrolled: 32, status: "active", featured: false, description: "Study of mechanical systems and thermal engineering." },
  { id: "4", title: "Data Science & AI", code: "CS-301", category: "computer-science", level: "postgraduate", duration: "2 years", fees: 35000, seats: 30, enrolled: 28, status: "active", featured: true, description: "Advanced machine learning and artificial intelligence program." },
  { id: "5", title: "Medical Sciences", code: "MED-401", category: "medicine", level: "undergraduate", duration: "5 years", fees: 50000, seats: 35, enrolled: 35, status: "active", featured: false, description: "Comprehensive medical education and clinical training." },
  { id: "6", title: "Digital Arts", code: "ART-301", category: "arts", level: "undergraduate", duration: "3 years", fees: 15000, seats: 40, enrolled: 22, status: "inactive", featured: false, description: "Creative digital art, graphic design, and multimedia." },
];

const emptyForm = { title: "", code: "", category: "general", level: "undergraduate", duration: "", fees: 0, seats: 30, status: "active", featured: false, description: "", syllabus: "", requirements: "", image: "" };

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    apiFetch<Course[]>("/api/courses")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setCourses(data);
        else setCourses(mockCourses);
      })
      .catch(() => setCourses(mockCourses))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => {
    setSelectedCourse(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setForm({ title: course.title, code: course.code, category: course.category, level: course.level, duration: course.duration, fees: course.fees, seats: course.seats, status: course.status, featured: course.featured, description: course.description, syllabus: "", requirements: "", image: course.image || "" });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      if (selectedCourse) {
        setCourses((prev) => prev.map((c) => (c.id === selectedCourse.id ? { ...c, ...form } : c)));
        toast.success("Course updated successfully");
      } else {
        setCourses((prev) => [{ ...form, id: String(Date.now()), enrolled: 0 }, ...prev]);
        toast.success("Course created successfully");
      }
      setDialogOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = () => {
    if (selectedCourse) {
      setCourses((prev) => prev.filter((c) => c.id !== selectedCourse.id));
      toast.success("Course deleted successfully");
      setDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Courses"
        description="Manage academic courses and programs"
        icon={BookOpen}
        actions={
          <div className="flex gap-2">
            <div className="flex border rounded-md">
              <Button variant={view === "grid" ? "secondary" : "ghost"} size="icon" className="h-9 w-9 rounded-r-none" onClick={() => setView("grid")}>
                <LayoutGrid className="h-4 w-4" />
              </Button>
              <Button variant={view === "list" ? "secondary" : "ghost"} size="icon" className="h-9 w-9 rounded-l-none" onClick={() => setView("list")}>
                <List className="h-4 w-4" />
              </Button>
            </div>
            <Button size="sm" onClick={handleAdd}>
              <Plus className="mr-2 h-4 w-4" /> Add Course
            </Button>
          </div>
        }
      />

      {view === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {courses.map((course) => (
            <Card key={course.id} className="group hover:shadow-md transition-shadow">
              <div className="relative h-32 bg-gradient-to-br from-primary/10 to-primary/5 rounded-t-lg flex items-center justify-center">
                <BookOpen className="h-12 w-12 text-primary/30" />
                {course.featured && (
                  <div className="absolute top-2 right-2">
                    <Badge className="bg-amber-500 text-white"><Star className="h-3 w-3 mr-1" /> Featured</Badge>
                  </div>
                )}
                <div className="absolute top-2 left-2">
                  <Badge variant={course.status === "active" ? "default" : "secondary"}>{course.status}</Badge>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="absolute bottom-2 right-2 h-8 w-8 opacity-0 group-hover:opacity-100 bg-background/80">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(course)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSelectedCourse(course); setDeleteOpen(true); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-sm line-clamp-1">{course.title}</h3>
                    <p className="text-xs text-muted-foreground">{course.code} · {course.level}</p>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{course.description}</p>
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-primary">${course.fees.toLocaleString()}</span>
                  <span className="text-muted-foreground">{course.enrolled}/{course.seats} seats</span>
                </div>
                <div className="mt-2 h-1.5 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all"
                    style={{ width: `${Math.min((course.enrolled / course.seats) * 100, 100)}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {courses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-4 flex items-center gap-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <BookOpen className="h-6 w-6 text-primary/60" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-sm truncate">{course.title}</h3>
                    {course.featured && <Star className="h-3 w-3 text-amber-500 fill-amber-500" />}
                    <Badge variant={course.status === "active" ? "default" : "secondary"} className="text-xs">{course.status}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">{course.code} · {course.category} · {course.level} · {course.duration}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-semibold text-sm">${course.fees.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{course.enrolled}/{course.seats}</p>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(course)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSelectedCourse(course); setDeleteOpen(true); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={selectedCourse ? "Edit Course" : "Add New Course"} size="lg" onSubmit={handleSubmit} loading={formLoading}>
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2 space-y-2">
            <Label>Title</Label>
            <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Course title" />
          </div>
          <div className="space-y-2">
            <Label>Code</Label>
            <Input value={form.code} onChange={(e) => setForm({ ...form, code: e.target.value })} placeholder="CS-101" />
          </div>
          <div className="space-y-2">
            <Label>Category</Label>
            <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="computer-science">Computer Science</SelectItem>
                <SelectItem value="business">Business</SelectItem>
                <SelectItem value="engineering">Engineering</SelectItem>
                <SelectItem value="arts">Arts</SelectItem>
                <SelectItem value="medicine">Medicine</SelectItem>
                <SelectItem value="science">Science</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Level</Label>
            <Select value={form.level} onValueChange={(v) => setForm({ ...form, level: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="undergraduate">Undergraduate</SelectItem>
                <SelectItem value="postgraduate">Postgraduate</SelectItem>
                <SelectItem value="diploma">Diploma</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Duration</Label>
            <Input value={form.duration} onChange={(e) => setForm({ ...form, duration: e.target.value })} placeholder="4 years" />
          </div>
          <div className="space-y-2">
            <Label>Fees ($)</Label>
            <Input type="number" value={form.fees} onChange={(e) => setForm({ ...form, fees: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>Total Seats</Label>
            <Input type="number" value={form.seats} onChange={(e) => setForm({ ...form, seats: Number(e.target.value) })} />
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="col-span-2 space-y-2">
            <Label>Description</Label>
            <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} />
          </div>
          <div className="space-y-2">
            <Label>Requirements</Label>
            <Textarea value={form.requirements} onChange={(e) => setForm({ ...form, requirements: e.target.value })} rows={2} />
          </div>
          <div className="flex items-center space-x-2 pt-6">
            <Switch checked={form.featured} onCheckedChange={(v) => setForm({ ...form, featured: v })} />
            <Label>Featured Course</Label>
          </div>
        </div>
      </FormDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Course</AlertDialogTitle>
            <AlertDialogDescription>Are you sure you want to delete &ldquo;{selectedCourse?.title}&rdquo;? This action cannot be undone.</AlertDialogDescription>
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
