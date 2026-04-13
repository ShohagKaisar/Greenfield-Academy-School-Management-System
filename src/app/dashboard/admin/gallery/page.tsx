"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { FormDialog } from "@/components/dashboard/form-dialog";
import { EmptyState } from "@/components/dashboard/empty-state";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Image, Plus, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/fetcher";

interface GalleryItem {
  id: string;
  title: string;
  type: string;
  category: string;
  url: string;
  [key: string]: unknown;
}

const mockGallery: GalleryItem[] = [
  { id: "1", title: "Campus Overview", type: "photo", category: "campus", url: "/hero-campus.png" },
  { id: "2", title: "Modern Classroom", type: "photo", category: "infrastructure", url: "/classroom.png" },
  { id: "3", title: "Library Interior", type: "photo", category: "infrastructure", url: "/library.png" },
  { id: "4", title: "Science Lab", type: "photo", category: "infrastructure", url: "/science-lab.png" },
  { id: "5", title: "Students Celebrating", type: "photo", category: "events", url: "/students-celebrating.png" },
  { id: "6", title: "Prof. Sarah Johnson", type: "photo", category: "faculty", url: "/professor1.png" },
];

const emptyForm = { title: "", type: "photo", category: "general", url: "" };

export default function GalleryPage() {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterCategory, setFilterCategory] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    apiFetch<GalleryItem[]>("/api/gallery")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setItems(data);
        else setItems(mockGallery);
      })
      .catch(() => setItems(mockGallery))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filterCategory === "all" ? items : items.filter((i) => i.category === filterCategory);

  const handleAdd = () => { setSelectedItem(null); setForm(emptyForm); setDialogOpen(true); };

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      setItems((prev) => [{ ...form, id: String(Date.now()) }, ...prev]);
      toast.success("Gallery item added successfully");
      setDialogOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = () => {
    if (selectedItem) {
      setItems((prev) => prev.filter((i) => i.id !== selectedItem.id));
      toast.success("Gallery item deleted");
      setDeleteOpen(false);
    }
  };

  const categories = [...new Set(items.map((i) => i.category))];

  return (
    <div className="space-y-6">
      <PageHeader title="Gallery" description="Manage photo and video gallery" icon={Image} actions={<Button size="sm" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> Add Item</Button>} />

      <div className="flex gap-2 flex-wrap">
        <Button variant={filterCategory === "all" ? "default" : "outline"} size="sm" onClick={() => setFilterCategory("all")}>All</Button>
        {categories.map((cat) => (
          <Button key={cat} variant={filterCategory === cat ? "default" : "outline"} size="sm" onClick={() => setFilterCategory(cat)} className="capitalize">{cat}</Button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No gallery items" description="Add items to your gallery" />
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((item) => (
            <div key={item.id} className="group relative aspect-square rounded-lg overflow-hidden border bg-muted">
              <img src={item.url} alt={item.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                <p className="text-white text-sm font-medium truncate">{item.title}</p>
                <p className="text-white/70 text-xs capitalize">{item.category}</p>
              </div>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <Button variant="secondary" size="icon" className="h-7 w-7" onClick={() => { setSelectedItem(item); setPreviewOpen(true); }}><Eye className="h-3.5 w-3.5" /></Button>
                <Button variant="destructive" size="icon" className="h-7 w-7" onClick={() => { setSelectedItem(item); setDeleteOpen(true); }}><Trash2 className="h-3.5 w-3.5" /></Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title="Add Gallery Item" onSubmit={handleSubmit} loading={formLoading}>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} /></div>
          <div className="space-y-2"><Label>Type</Label>
            <Select value={form.type} onValueChange={(v) => setForm({ ...form, type: v })}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="photo">Photo</SelectItem>
                <SelectItem value="video">Video</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Category</Label><Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="campus, events, etc." /></div>
          <div className="space-y-2"><Label>Image URL</Label><Input value={form.url} onChange={(e) => setForm({ ...form, url: e.target.value })} placeholder="/image.png or https://..." /></div>
        </div>
      </FormDialog>

      <FormDialog open={previewOpen} onOpenChange={setPreviewOpen} title={selectedItem?.title || "Preview"}>
        {selectedItem && (
          <div className="space-y-3">
            <img src={selectedItem.url} alt={selectedItem.title} className="w-full rounded-lg" />
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div><span className="text-muted-foreground">Type:</span> <span className="capitalize">{selectedItem.type}</span></div>
              <div><span className="text-muted-foreground">Category:</span> <span className="capitalize">{selectedItem.category}</span></div>
            </div>
          </div>
        )}
      </FormDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Item</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this gallery item?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
