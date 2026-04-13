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
import { Calendar, Plus, MoreHorizontal, Pencil, Trash2, MapPin, Clock } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/fetcher";

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  endDate: string;
  location: string;
  status: string;
  image?: string;
  [key: string]: unknown;
}

const mockEvents: Event[] = [
  { id: "1", title: "Annual Sports Day", description: "A full-day sports event with various competitions including athletics, team sports, and fun games for all students.", date: "2025-03-15", endDate: "2025-03-15", location: "Main Sports Ground", status: "upcoming" },
  { id: "2", title: "Science Fair 2025", description: "Annual science exhibition showcasing innovative projects and experiments by students.", date: "2025-02-28", endDate: "2025-03-01", location: "Science Building Hall", status: "upcoming" },
  { id: "3", title: "Cultural Festival", description: "A week-long celebration of arts, music, dance, and cultural diversity.", date: "2025-04-10", endDate: "2025-04-16", location: "Auditorium", status: "upcoming" },
  { id: "4", title: "Career Counseling Workshop", description: "Industry professionals guide students on career paths and opportunities.", date: "2025-01-25", endDate: "2025-01-25", location: "Conference Hall A", status: "completed" },
  { id: "5", title: "Alumni Reunion", description: "Annual gathering of alumni to reconnect and share experiences.", date: "2025-05-20", endDate: "2025-05-20", location: "Main Campus", status: "upcoming" },
  { id: "6", title: "International Day", description: "Celebration of cultural diversity with food, performances, and exhibitions from around the world.", date: "2025-02-14", endDate: "2025-02-14", location: "Open Air Theater", status: "completed" },
];

const emptyForm = { title: "", description: "", date: "", endDate: "", location: "", status: "upcoming" };

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    apiFetch<Event[]>("/api/events")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setEvents(data);
        else setEvents(mockEvents);
      })
      .catch(() => setEvents(mockEvents))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => { setSelectedEvent(null); setForm(emptyForm); setDialogOpen(true); };
  const handleEdit = (event: Event) => {
    setSelectedEvent(event);
    setForm({ title: event.title, description: event.description, date: event.date, endDate: event.endDate || "", location: event.location, status: event.status });
    setDialogOpen(true);
  };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      if (selectedEvent) {
        setEvents((prev) => prev.map((e) => (e.id === selectedEvent.id ? { ...e, ...form } : e)));
        toast.success("Event updated successfully");
      } else {
        setEvents((prev) => [{ ...form, id: String(Date.now()) }, ...prev]);
        toast.success("Event created successfully");
      }
      setDialogOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = () => {
    if (selectedEvent) {
      setEvents((prev) => prev.filter((e) => e.id !== selectedEvent.id));
      toast.success("Event deleted successfully");
      setDeleteOpen(false);
    }
  };

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

  return (
    <div className="space-y-6">
      <PageHeader title="Events" description="Manage school events and activities" icon={Calendar} actions={<Button size="sm" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> Add Event</Button>} />

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {events.map((event) => (
          <Card key={event.id} className="group hover:shadow-md transition-shadow overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-primary to-primary/60" />
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={event.status === "upcoming" ? "default" : "secondary"} className="text-xs">{event.status}</Badge>
                  </div>
                  <h3 className="font-semibold mb-2">{event.title}</h3>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 opacity-0 group-hover:opacity-100"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEdit(event)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setSelectedEvent(event); setDeleteOpen(true); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{event.description}</p>
              <div className="space-y-1.5 text-xs text-muted-foreground">
                <div className="flex items-center gap-2"><Calendar className="h-3.5 w-3.5" /> {formatDate(event.date)}{event.endDate && event.endDate !== event.date && ` - ${formatDate(event.endDate)}`}</div>
                <div className="flex items-center gap-2"><MapPin className="h-3.5 w-3.5" /> {event.location}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={selectedEvent ? "Edit Event" : "Create Event"} onSubmit={handleSubmit} loading={formLoading}>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Event title" /></div>
          <div className="space-y-2"><Label>Description</Label><Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} /></div>
            <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Location</Label><Input value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} placeholder="Event location" /></div>
          <div className="space-y-2"><Label>Status</Label>
            <Select value={form.status} onValueChange={(v) => setForm({ ...form, status: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="ongoing">Ongoing</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </FormDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Event</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete &ldquo;{selectedEvent?.title}&rdquo;?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
