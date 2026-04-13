"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen } from "lucide-react";

interface CourseProgressCardProps {
  title: string;
  teacher?: string;
  progress: number;
  grade?: string;
  schedule?: string;
  onClick?: () => void;
}

export function CourseProgressCard({
  title,
  teacher,
  progress,
  grade,
  schedule,
  onClick,
}: CourseProgressCardProps) {
  return (
    <Card
      className="cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
      onClick={onClick}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <BookOpen className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-sm font-semibold leading-tight">
                {title}
              </CardTitle>
              {teacher && (
                <p className="mt-0.5 text-xs text-muted-foreground">
                  {teacher}
                </p>
              )}
            </div>
          </div>
          {grade && (
            <span className="rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-semibold text-green-700">
              {grade}
            </span>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {schedule && (
          <p className="text-xs text-muted-foreground">
            📅 {schedule}
          </p>
        )}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-semibold text-primary">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardContent>
    </Card>
  );
}
