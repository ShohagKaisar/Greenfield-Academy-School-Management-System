"use client";

import React from "react";
import { useRequireAuth } from "@/lib/auth-context";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  FileText,
  Download,
  GraduationCap,
  DollarSign,
  CreditCard,
  BookOpen,
  Award,
  User,
} from "lucide-react";

interface DocumentItem {
  id: string;
  title: string;
  description: string;
  category: string;
  icon: React.ElementType;
  size?: string;
  date?: string;
}

const documents: DocumentItem[] = [
  { id: "1", title: "Admit Card", description: "Spring 2025 Mid-Term Exam Admit Card", category: "Exam", icon: FileText, date: "Jan 2025" },
  { id: "2", title: "Fee Receipt", description: "Spring 2025 Tuition Fee Receipt", category: "Finance", icon: DollarSign, date: "Jan 2025" },
  { id: "3", title: "ID Card", description: "Student Identity Card - 2025", category: "Identity", icon: User, date: "Jan 2025" },
  { id: "4", title: "Transcript", description: "Academic Transcript - Fall 2024", category: "Academic", icon: Award, date: "Dec 2024" },
  { id: "5", title: "Certificate - Quiz 1", description: "Mathematics Quiz 1 Performance Certificate", category: "Academic", icon: GraduationCap, date: "Jan 2025" },
  { id: "6", title: "Course Materials - Physics", description: "Lecture notes and reference materials", category: "Academic", icon: BookOpen, date: "Jan 2025" },
  { id: "7", title: "Course Materials - Chemistry", description: "Lab manuals and experiment guides", category: "Academic", icon: BookOpen, date: "Jan 2025" },
  { id: "8", title: "Payment History", description: "Complete payment history statement", category: "Finance", icon: CreditCard, date: "Jan 2025" },
];

const categoryColors: Record<string, string> = {
  Exam: "bg-red-100 text-red-700",
  Finance: "bg-green-100 text-green-700",
  Identity: "bg-blue-100 text-blue-700",
  Academic: "bg-purple-100 text-purple-700",
};

export default function StudentDownloads() {
  useRequireAuth("student");

  const categories = [...new Set(documents.map((d) => d.category))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Downloads</h1>
        <p className="text-sm text-muted-foreground">
          Download your academic documents and resources
        </p>
      </div>

      {categories.map((category) => (
        <div key={category} className="space-y-3">
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-semibold">{category}</h2>
            <Badge variant="secondary" className={categoryColors[category] || ""}>
              {documents.filter((d) => d.category === category).length} documents
            </Badge>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {documents
              .filter((d) => d.category === category)
              .map((doc) => (
                <Card
                  key={doc.id}
                  className="flex items-start gap-3 p-4 transition-all hover:shadow-md"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                    <doc.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold">{doc.title}</p>
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">
                      {doc.description}
                    </p>
                    {doc.date && (
                      <p className="mt-1 text-xs text-muted-foreground/60">
                        {doc.date}
                      </p>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="mt-2 gap-1 text-xs text-primary"
                    >
                      <Download className="h-3 w-3" />
                      Download
                    </Button>
                  </div>
                </Card>
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
