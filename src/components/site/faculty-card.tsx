'use client';

import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, BookOpen } from 'lucide-react';

interface FacultyCardProps {
  faculty: {
    id: string;
    teacherId: string;
    department?: string;
    designation?: string;
    qualification?: string;
    specialization?: string;
    bio?: string;
    experience?: string;
    user: {
      name: string;
      email: string;
      avatar?: string;
    };
  };
  onSelect?: (faculty: FacultyCardProps['faculty']) => void;
}

export function FacultyCard({ faculty, onSelect }: FacultyCardProps) {
  return (
    <Card
      className="overflow-hidden border-border/50 card-hover shadow-sm group cursor-pointer"
      onClick={() => onSelect?.(faculty)}
    >
      {/* Avatar area */}
      <div className="relative h-48 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-28 h-28 rounded-full overflow-hidden border-4 border-white shadow-lg">
            <Image
              src={faculty.user.avatar || '/professor1.png'}
              alt={faculty.user.name}
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>

      <CardContent className="p-5 text-center">
        <h3 className="font-bold text-foreground text-lg group-hover:text-primary transition-colors">
          {faculty.user.name}
        </h3>
        <p className="text-sm text-primary font-medium mt-1">{faculty.designation}</p>

        <Badge variant="secondary" className="mt-2 text-xs">
          {faculty.department}
        </Badge>

        {faculty.specialization && (
          <p className="mt-3 text-xs text-muted-foreground flex items-center justify-center gap-1">
            <BookOpen className="w-3 h-3" />
            {faculty.specialization}
          </p>
        )}

        {faculty.experience && (
          <p className="mt-1 text-xs text-muted-foreground">
            {faculty.experience} experience
          </p>
        )}

        <p className="mt-1 text-xs text-muted-foreground flex items-center justify-center gap-1">
          <Mail className="w-3 h-3" />
          {faculty.user.email}
        </p>
      </CardContent>
    </Card>
  );
}
