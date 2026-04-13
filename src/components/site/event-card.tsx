'use client';

import { Calendar, MapPin } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Image from 'next/image';

interface EventCardProps {
  event: {
    id: string;
    title: string;
    description?: string;
    date: string;
    endDate?: string;
    location?: string;
    image?: string;
    status?: string;
  };
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const month = eventDate.toLocaleString('en-US', { month: 'short' });
  const day = eventDate.getDate();
  const isUpcoming = event.status === 'upcoming';

  return (
    <Card className="overflow-hidden border-border/50 card-hover shadow-sm group">
      <div className="flex flex-col sm:flex-row h-full">
        {/* Date Badge */}
        <div className={`flex-shrink-0 flex items-center justify-center sm:w-24 p-4 ${
          isUpcoming ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          <div className="text-center">
            <div className="text-3xl font-bold">{day}</div>
            <div className="text-sm font-medium uppercase">{month}</div>
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full sm:w-40 h-32 sm:h-auto flex-shrink-0 overflow-hidden">
          {event.image ? (
            <Image
              src={event.image}
              alt={event.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/10 to-primary/5" />
          )}
        </div>

        {/* Content */}
        <CardContent className="p-4 flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
              isUpcoming ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
            }`}>
              {isUpcoming ? 'Upcoming' : 'Past'}
            </span>
          </div>
          <h3 className="font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
            {event.title}
          </h3>
          {event.description && (
            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
              {event.description}
            </p>
          )}
          <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {eventDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
            </span>
            {event.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {event.location}
              </span>
            )}
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
