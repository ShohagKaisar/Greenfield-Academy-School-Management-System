'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, ArrowRight } from 'lucide-react';

interface BlogCardProps {
  post: {
    id: string;
    title: string;
    slug: string;
    excerpt?: string;
    image?: string;
    category?: string;
    createdAt: string;
  };
}

export function BlogCard({ post }: BlogCardProps) {
  const date = new Date(post.createdAt);

  return (
    <Card className="overflow-hidden border-border/50 card-hover shadow-sm group">
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {post.image ? (
          <Image
            src={post.image}
            alt={post.title}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5" />
        )}
        {post.category && (
          <Badge className="absolute top-3 left-3 bg-primary text-primary-foreground text-xs">
            {post.category}
          </Badge>
        )}
      </div>

      <CardContent className="p-5">
        <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
          <Calendar className="w-3 h-3" />
          {date.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>

        <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
          {post.title}
        </h3>

        {post.excerpt && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
            {post.excerpt}
          </p>
        )}

        <Link
          href={`/blog/${post.slug}`}
          className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline group/link"
        >
          Read More
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/link:translate-x-1" />
        </Link>
      </CardContent>
    </Card>
  );
}
