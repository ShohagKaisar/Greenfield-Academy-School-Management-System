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
import { Bell, Plus, MoreHorizontal, Pencil, Trash2, Clock } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/fetcher";

interface Notice {
  id: string;
  title: string;
  content: string;
  category: string;
  priority: string;
  target: string;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockNotices: Notice[] = [
  { id: "1", title: "Annual Sports Day Announcement", content: "Annual Sports Day will be held on March 15, 2025. All students are encouraged to participate.", category: "event", priority: "high", target: "all", status: "published", createdAt: "2025-01-15" },
  { id: "2", title: "Mid-Semester Examination Schedule", content: "Mid-semester examinations will commence from February 20, 2025. Download the schedule from the portal.", category: "academic", priority: "high", target: "students", status: "published", createdAt: "2025-01-14" },
  { id: "3", title: "Library Hours Update", content: "The library will remain open until 10 PM during examination period starting February 15.", category: "general", priority: "normal", target: "all", status: "published", createdAt: "2025-01-13" },
  { id: "4", title: "New Course Registration Open", content: "Registration for Data Science & AI postgraduate program is now open for the 2025-26 academic year.", category: "academic", priority: "normal", target: "students", status: "published", createdAt: "2025-01-12" },
  { id: "5", title: "Staff Meeting Notice", content: "A mandatory staff meeting is scheduled for January 20, 2025 at 3 PM in the conference hall.", category: "meeting", priority: "high", target: "teachers", status: "draft", createdAt: "2025-01-11" },
  { id: "6", title: "Campus Maintenance Alert", content: "Building B will undergo maintenance this weekend. All classes are relocated to Building A.", category: "general", priority: "urgent", target: "all", status: "published", createdAt: "2025-01-10" },
];

const emptyForm = { title: "", content: "", category: "general", priority: "normal", target: "all", status: "published" };

const priorityColors: Record<string, string> = {
  urgent: "destructive",
  high: "default",
  normal: "secondary",
  low: "outline",
};

export default function NoticesPage() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedNotice, setSelectedNotice] = useState<Notice | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    apiFetch<Notice[]>("/api/notices")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setNotices(data);
        else setNotices(mockNotices);
      })
      .catch(() => setNotices(mockNotices))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => { setSelectedNotice(null); setForm(emptyForm); setDialogOpen(true); };
  const handleEdit = (notice: Notice) => {
    setSelectedNotice(notice);
    setForm({ title: notice.title, content: notice.content, category: notice.category, priority: notice.priority, target: notice.target, status: notice.status });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      if (selectedNotice) {
        setNotices((prev) => prev.map((n) => (n.id === selectedNotice.id ? { ...n, ...form } : n)));
        toast.success("Notice updated successfully");
      } else {
        setNotices((prev) => [{ ...form, id: String(Date.now()), createdAt: new Date().toISOString().split("T")[0] }, ...prev]);
        toast.success("Notice created successfully");
      }
      setDialogOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = () => {
    if (selectedNotice) {
      setNotices((prev) => prev.filter((n) => n.id !== selectedNotice.id));
      toast.success("Notice deleted successfully");
      setDeleteOpen(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Notices" description="Create and manage school notices" icon={Bell} actions={<Button size="sm" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> New Notice</Button>} />

      <div className="space-y-3">
        {notices.map((notice) => (
          <Card key={notice.id} className="hover:shadow-sm transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h3 className="font-semibold text-sm">{notice.title}</h3>
                    <Badge variant={priorityColors[notice.priority] as any} className="text-xs">{notice.priority}</Badge>
                    <Badge variant="outline" className="text-xs">{notice.category}</Badge>
                    <Badge variant={notice.status === "published" ? "default" : "secondary"} className="text-xs">{notice.status}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{notice.content}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {new Date(notice.createdAt).toLocaleDateString()}</span>
                    <span>Target: <Badge variant="outline" className="text-xs ml-1">{notice.target}</Badge></span>
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(notice)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSelectedNotice(notice); setDeleteOpen(true); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={selectedNotice ? "Edit Notice" : "Create Notice"} onSubmit={handleSubmit} loading={formLoading}>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Notice title" /></div>
          <div className="space-y-2"><Label>Content</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={4} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="academic">Academic</SelectItem>
                  <SelectItem value="event">Event</SelectItem>
                  <SelectItem value="meeting">Meeting</SelectItem>
                  <SelectItem value="exam">Exam</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Priority</Label>
              <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="normal">Normal</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Target Audience</Label>
              <Select value={form.target} onValueChange={(v) => setForm({ ...form, target: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="students">Students</SelectItem>
                  <SelectItem value="teachers">Teachers</SelectItem>
                  <SelectItem value="parents">Parents</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2"><Label>Status</Label>
              <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="published">Published</SelectItem>
                  <SelectItem value="draft">Draft</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </FormDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Notice</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this notice?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
