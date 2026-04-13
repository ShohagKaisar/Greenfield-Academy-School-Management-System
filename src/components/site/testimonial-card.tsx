'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Star } from 'lucide-react';
import Image from 'next/image';

interface TestimonialCardProps {
  testimonial: {
    id: string;
    name: string;
    role?: string;
    content: string;
    rating?: number;
    avatar?: string;
  };
}

export function TestimonialCard({ testimonial }: TestimonialCardProps) {
  return (
    <Card className="border-0 shadow-md bg-card h-full">
      <CardContent className="p-6">
        {/* Stars */}
        <div className="flex gap-1 mb-4">
          {Array.from({ length: testimonial.rating || 5 }).map((_, i) => (
            <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
          ))}
        </div>

        {/* Content */}
        <p className="text-muted-foreground leading-relaxed italic">
          &ldquo;{testimonial.content}&rdquo;
        </p>

        {/* Author */}
        <div className="mt-6 flex items-center gap-3">
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-primary/10 flex-shrink-0">
            {testimonial.avatar ? (
              <Image
                src={testimonial.avatar}
                alt={testimonial.name}
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-primary font-bold text-sm">
                {testimonial.name.charAt(0)}
              </div>
            )}
          </div>
          <div>
            <p className="font-semibold text-foreground text-sm">{testimonial.name}</p>
            {testimonial.role && (
              <p className="text-xs text-muted-foreground">{testimonial.role}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
