"use client";

import { useState, useEffect } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { DataTable, type Column } from "@/components/dashboard/data-table";
import { FormDialog } from "@/components/dashboard/form-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { FileText, Plus, MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { apiFetch } from "@/lib/fetcher";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  category: string;
  tags: string;
  status: string;
  createdAt: string;
  [key: string]: unknown;
}

const mockPosts: BlogPost[] = [
  { id: "1", title: "Top 10 Career Opportunities in Computer Science", slug: "top-careers-cs", excerpt: "Explore the most promising career paths for computer science graduates in 2025.", category: "career", tags: "cs, career, technology", status: "published", createdAt: "2025-01-15" },
  { id: "2", title: "How to Prepare for University Admissions", slug: "prepare-university-admissions", excerpt: "A comprehensive guide for students preparing for university admission applications.", category: "admission", tags: "admission, guide, university", status: "published", createdAt: "2025-01-14" },
  { id: "3", title: "The Importance of STEM Education", slug: "importance-stem-education", excerpt: "Why STEM education is crucial for the future workforce and innovation.", category: "education", tags: "stem, education, innovation", status: "published", createdAt: "2025-01-13" },
  { id: "4", title: "Student Life at Greenfield Academy", slug: "student-life-greenfield", excerpt: "A day in the life of a Greenfield Academy student - academics, activities, and more.", category: "campus", tags: "student, life, campus", status: "draft", createdAt: "2025-01-12" },
  { id: "5", title: "New Research Lab Inauguration", slug: "new-research-lab", excerpt: "State-of-the-art research lab opened for advanced scientific research.", category: "news", tags: "research, lab, science", status: "published", createdAt: "2025-01-11" },
  { id: "6", title: "Scholarship Program 2025", slug: "scholarship-2025", excerpt: "Apply for merit-based and need-based scholarships for the upcoming academic year.", category: "scholarship", tags: "scholarship, financial, aid", status: "draft", createdAt: "2025-01-10" },
];

const emptyForm = { title: "", slug: "", content: "", excerpt: "", category: "news", tags: "", status: "draft" };

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [form, setForm] = useState(emptyForm);

  useEffect(() => {
    apiFetch<BlogPost[]>("/api/blog")
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) setPosts(data);
        else setPosts(mockPosts);
      })
      .catch(() => setPosts(mockPosts))
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = () => { setSelectedPost(null); setForm(emptyForm); setDialogOpen(true); };
  const handleEdit = (post: BlogPost) => {
    setSelectedPost(post);
    setForm({ title: post.title, slug: post.slug, content: "", excerpt: post.excerpt, category: post.category, tags: post.tags, status: post.status });
    setDialogOpen(true);
  };

  const generateSlug = (title: string) => title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

  const handleSubmit = async () => {
    setFormLoading(true);
    try {
      const slug = form.slug || generateSlug(form.title);
      if (selectedPost) {
        setPosts((prev) => prev.map((p) => (p.id === selectedPost.id ? { ...p, ...form, slug } : p)));
        toast.success("Post updated successfully");
      } else {
        setPosts((prev) => [{ ...form, slug, id: String(Date.now()), createdAt: new Date().toISOString().split("T")[0] }, ...prev]);
        toast.success("Post created successfully");
      }
      setDialogOpen(false);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = () => {
    if (selectedPost) {
      setPosts((prev) => prev.filter((p) => p.id !== selectedPost.id));
      toast.success("Post deleted successfully");
      setDeleteOpen(false);
    }
  };

  const columns: Column<BlogPost>[] = [
    { key: "title", header: "Title", render: (item) => (
      <div>
        <p className="font-medium line-clamp-1">{item.title}</p>
        <p className="text-xs text-muted-foreground">/{item.slug}</p>
      </div>
    )},
    { key: "category", header: "Category", render: (item) => <Badge variant="outline" className="capitalize">{item.category}</Badge> },
    { key: "tags", header: "Tags", render: (item) => (
      <div className="flex gap-1 flex-wrap max-w-[200px]">
        {item.tags.split(",").slice(0, 3).map((tag) => (
          <Badge key={tag.trim()} variant="secondary" className="text-xs">{tag.trim()}</Badge>
        ))}
      </div>
    )},
    { key: "status", header: "Status", render: (item) => (
      <Badge variant={item.status === "published" ? "default" : "secondary"}>{item.status}</Badge>
    )},
    { key: "createdAt", header: "Date", render: (item) => new Date(item.createdAt).toLocaleDateString() },
    { key: "actions", header: "", className: "w-[80px]", render: (item) => (
      <DropdownMenu>
        <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8"><MoreHorizontal className="h-4 w-4" /></Button></DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => handleEdit(item)}><Pencil className="mr-2 h-4 w-4" /> Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={() => { setSelectedPost(item); setDeleteOpen(true); }} className="text-destructive"><Trash2 className="mr-2 h-4 w-4" /> Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    )},
  ];

  return (
    <div className="space-y-6">
      <PageHeader title="Blog" description="Manage blog posts and news articles" icon={FileText} actions={<Button size="sm" onClick={handleAdd}><Plus className="mr-2 h-4 w-4" /> New Post</Button>} />
      <DataTable columns={columns} data={posts} loading={loading} searchKey="title" searchPlaceholder="Search posts..." />

      <FormDialog open={dialogOpen} onOpenChange={setDialogOpen} title={selectedPost ? "Edit Post" : "Create Post"} size="lg" onSubmit={handleSubmit} loading={formLoading}>
        <div className="space-y-4">
          <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })} placeholder="Post title" /></div>
          <div className="space-y-2"><Label>Slug</Label><Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} placeholder="post-url-slug" /></div>
          <div className="space-y-2"><Label>Content</Label><Textarea value={form.content} onChange={(e) => setForm({ ...form, content: e.target.value })} rows={6} /></div>
          <div className="space-y-2"><Label>Excerpt</Label><Textarea value={form.excerpt} onChange={(e) => setForm({ ...form, excerpt: e.target.value })} rows={2} /></div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Category</Label>
              <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="news">News</SelectItem>
                  <SelectItem value="education">Education</SelectItem>
                  <SelectItem value="career">Career</SelectItem>
                  <SelectItem value="admission">Admission</SelectItem>
                  <SelectItem value="campus">Campus</SelectItem>
                  <SelectItem value="scholarship">Scholarship</SelectItem>
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
          <div className="space-y-2"><Label>Tags (comma separated)</Label><Input value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} placeholder="education, technology, campus" /></div>
        </div>
      </FormDialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader><AlertDialogTitle>Delete Post</AlertDialogTitle><AlertDialogDescription>Are you sure you want to delete this blog post?</AlertDialogDescription></AlertDialogHeader>
          <AlertDialogFooter><AlertDialogCancel>Cancel</AlertDialogCancel><AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">Delete</AlertDialogAction></AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
