'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, DollarSign } from 'lucide-react';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    slug: string;
    description?: string;
    category: string;
    duration?: string;
    fees?: number;
    image?: string;
    enrolled?: number;
    seats?: number;
  };
}

export function CourseCard({ course }: CourseCardProps) {
  const categoryColors: Record<string, string> = {
    science: 'bg-blue-100 text-blue-700',
    arts: 'bg-purple-100 text-purple-700',
    commerce: 'bg-amber-100 text-amber-700',
    vocational: 'bg-emerald-100 text-emerald-700',
  };

  return (
    <div className="group bg-card rounded-2xl overflow-hidden border border-border/50 card-hover shadow-sm">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {course.image ? (
          <Image
            src={course.image}
            alt={course.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary/5" />
        )}
        <Badge
          className="absolute top-3 left-3 text-xs font-semibold"
          variant="secondary"
        >
          <span className={categoryColors[course.category] || 'bg-gray-100 text-gray-700'} style={{ padding: '2px 8px', borderRadius: '9999px' }}>
            {course.category}
          </span>
        </Badge>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {course.title}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
          {course.description}
        </p>

        <div className="mt-4 flex items-center gap-4 text-sm text-muted-foreground">
          {course.duration && (
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {course.duration}
            </span>
          )}
          {course.fees && (
            <span className="flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5" />
              ${course.fees.toLocaleString()}/yr
            </span>
          )}
        </div>

        <div className="mt-4 flex gap-2">
          <Button variant="outline" size="sm" className="flex-1" asChild>
            <Link href={`/programs/${course.slug}`}>View Details</Link>
          </Button>
          <Button size="sm" className="flex-1" asChild>
            <Link href="/admission">Apply Now</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
