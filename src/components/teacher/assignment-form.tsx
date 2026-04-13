"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Pencil } from "lucide-react";

interface Course {
  id: string;
  title: string;
}

interface AssignmentFormProps {
  courses: Course[];
  initialData?: {
    title: string;
    description?: string;
    courseId: string;
    dueDate?: string;
    totalMarks?: number;
  };
  onSubmit?: (data: {
    title: string;
    description?: string;
    courseId: string;
    dueDate?: string;
    totalMarks?: number;
  }) => void;
  triggerLabel?: string;
}

export function AssignmentForm({
  courses,
  initialData,
  onSubmit,
  triggerLabel = "Create Assignment",
}: AssignmentFormProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(initialData?.title || "");
  const [description, setDescription] = useState(initialData?.description || "");
  const [courseId, setCourseId] = useState(initialData?.courseId || "");
  const [dueDate, setDueDate] = useState(
    initialData?.dueDate
      ? new Date(initialData.dueDate).toISOString().split("T")[0]
      : ""
  );
  const [totalMarks, setTotalMarks] = useState(
    String(initialData?.totalMarks || 100)
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit?.({
      title,
      description: description || undefined,
      courseId,
      dueDate: dueDate || undefined,
      totalMarks: parseFloat(totalMarks) || 100,
    });
    setOpen(false);
    if (!initialData) {
      setTitle("");
      setDescription("");
      setCourseId("");
      setDueDate("");
      setTotalMarks("100");
    }
  };

  const isEditing = !!initialData;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className={isEditing ? "h-8 gap-1.5" : ""}>
          {isEditing ? (
            <Pencil className="h-3.5 w-3.5" />
          ) : (
            <Plus className="mr-2 h-4 w-4" />
          )}
          {isEditing ? "Edit" : triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? "Edit Assignment" : "Create New Assignment"}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Assignment title"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="course">Course</Label>
            <Select value={courseId} onValueChange={setCourseId} required>
              <SelectTrigger id="course">
                <SelectValue placeholder="Select course" />
              </SelectTrigger>
              <SelectContent>
                {courses.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Assignment description (optional)"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="date"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="totalMarks">Total Marks</Label>
              <Input
                id="totalMarks"
                type="number"
                value={totalMarks}
                onChange={(e) => setTotalMarks(e.target.value)}
                min={0}
              />
            </div>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">{isEditing ? "Save Changes" : "Create"}</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
