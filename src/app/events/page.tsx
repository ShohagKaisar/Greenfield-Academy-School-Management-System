'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Calendar, MapPin, Clock, Users, ArrowRight,
  FlaskConical, Briefcase, Music, Cpu, Trophy, GraduationCap, Palette,
} from 'lucide-react';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';
import Link from 'next/link';

type EventCategory = 'academic' | 'cultural' | 'sports' | 'career';

interface EventItem {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  time: string;
  category: EventCategory;
  icon: React.ReactNode;
}

const upcomingEvents: EventItem[] = [
  {
    id: '1',
    title: 'Annual Science Fair 2025',
    description: 'Students present innovative science projects and compete for awards. Featuring experiments across physics, chemistry, biology, and computer science departments.',
    date: 'Apr 15, 2025',
    location: 'Main Auditorium',
    time: '10:00 AM - 4:00 PM',
    category: 'academic',
    icon: <FlaskConical className="w-6 h-6" />,
  },
  {
    id: '2',
    title: 'Career Fair & Job Expo',
    description: 'Meet recruiters from top companies and explore career opportunities. Bring your resume and prepare for on-the-spot interviews with industry leaders.',
    date: 'May 2, 2025',
    location: 'Convention Center',
    time: '9:00 AM - 5:00 PM',
    category: 'career',
    icon: <Briefcase className="w-6 h-6" />,
  },
  {
    id: '3',
    title: 'Cultural Festival - Spring',
    description: 'Music, dance, drama, and food from diverse cultures. A vibrant celebration featuring student performances, art exhibitions, and international cuisine.',
    date: 'May 20, 2025',
    location: 'Campus Grounds',
    time: '3:00 PM - 9:00 PM',
    category: 'cultural',
    icon: <Music className="w-6 h-6" />,
  },
  {
    id: '4',
    title: 'International Conference on AI',
    description: 'Global experts discuss latest AI research and applications. Keynote speakers from MIT, Stanford, and Google DeepMind share cutting-edge insights.',
    date: 'Jun 10, 2025',
    location: 'Seminar Hall',
    time: '9:00 AM - 6:00 PM',
    category: 'academic',
    icon: <Cpu className="w-6 h-6" />,
  },
  {
    id: '5',
    title: 'Sports Week 2025',
    description: 'Inter-department competitions in cricket, football, basketball, and more. A week of thrilling sports action with prizes and recognition for top athletes.',
    date: 'Jul 1, 2025',
    location: 'Sports Complex',
    time: 'All Day',
    category: 'sports',
    icon: <Trophy className="w-6 h-6" />,
  },
  {
    id: '6',
    title: 'Orientation Day - Fall 2025',
    description: 'Welcome new students with campus tour and orientation program. Meet faculty advisors, learn about campus resources, and connect with fellow students.',
    date: 'Aug 15, 2025',
    location: 'Main Hall',
    time: '10:00 AM - 2:00 PM',
    category: 'academic',
    icon: <GraduationCap className="w-6 h-6" />,
  },
];

const pastEvents: EventItem[] = [
  {
    id: '7',
    title: 'Graduation Ceremony 2024',
    description: 'Annual convocation ceremony celebrating the achievements of the graduating class of 2024. Over 800 students received their degrees.',
    date: 'Dec 20, 2024',
    location: 'Main Auditorium',
    time: '10:00 AM - 3:00 PM',
    category: 'academic',
    icon: <GraduationCap className="w-6 h-6" />,
  },
  {
    id: '8',
    title: 'Winter Sports Festival',
    description: 'Annual winter sports competition featuring indoor games, athletics, and team sports. Students competed across 12 different sporting events.',
    date: 'Nov 5, 2024',
    location: 'Sports Complex',
    time: 'All Day',
    category: 'sports',
    icon: <Trophy className="w-6 h-6" />,
  },
  {
    id: '9',
    title: 'Annual Art Exhibition',
    description: 'Showcasing creative works from the Arts department including paintings, sculptures, digital art, and photography by talented students and faculty.',
    date: 'Oct 15, 2024',
    location: 'Art Gallery Hall',
    time: '10:00 AM - 6:00 PM',
    category: 'cultural',
    icon: <Palette className="w-6 h-6" />,
  },
];

const categoryConfig: Record<EventCategory, { label: string; color: string; bgColor: string; borderColor: string }> = {
  academic: { label: 'Academic', color: 'text-sky-700 dark:text-sky-400', bgColor: 'bg-sky-100 dark:bg-sky-900/30', borderColor: 'border-sky-200 dark:border-sky-800' },
  cultural: { label: 'Cultural', color: 'text-fuchsia-700 dark:text-fuchsia-400', bgColor: 'bg-fuchsia-100 dark:bg-fuchsia-900/30', borderColor: 'border-fuchsia-200 dark:border-fuchsia-800' },
  sports: { label: 'Sports', color: 'text-emerald-700 dark:text-emerald-400', bgColor: 'bg-emerald-100 dark:bg-emerald-900/30', borderColor: 'border-emerald-200 dark:border-emerald-800' },
  career: { label: 'Career', color: 'text-amber-700 dark:text-amber-400', bgColor: 'bg-amber-100 dark:bg-amber-900/30', borderColor: 'border-amber-200 dark:border-amber-800' },
};

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  const currentEvents = activeTab === 'upcoming' ? upcomingEvents : pastEvents;

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative py-24 md:py-32">
          <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-10 right-10 w-72 h-72 rounded-full bg-white/20 blur-3xl" />
            <div className="absolute bottom-10 left-10 w-96 h-96 rounded-full bg-white/10 blur-3xl" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-white/5 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 mb-4">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Campus Life
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                Events & Activities
              </h1>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Stay updated with our latest events, workshops, seminars, and cultural celebrations.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Events Content */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex justify-center mb-10"
            >
              <div className="inline-flex p-1 bg-muted rounded-xl">
                <Button
                  variant={activeTab === 'upcoming' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('upcoming')}
                  className="rounded-lg gap-2 px-6"
                >
                  <Calendar className="w-4 h-4" />
                  Upcoming Events
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {upcomingEvents.length}
                  </Badge>
                </Button>
                <Button
                  variant={activeTab === 'past' ? 'default' : 'ghost'}
                  onClick={() => setActiveTab('past')}
                  className="rounded-lg gap-2 px-6"
                >
                  <Clock className="w-4 h-4" />
                  Past Events
                  <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs">
                    {pastEvents.length}
                  </Badge>
                </Button>
              </div>
            </motion.div>

            {/* Event Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentEvents.map((event, idx) => {
                const cat = categoryConfig[event.category];
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: idx * 0.08 }}
                  >
                    <Card className={`card-hover overflow-hidden h-full flex flex-col ${activeTab === 'past' ? 'opacity-80 hover:opacity-100' : ''}`}>
                      {/* Icon Area */}
                      <div className={`relative p-6 ${cat.bgColor} border-b ${cat.borderColor}`}>
                        <div className="flex items-start justify-between">
                          <div className={`w-12 h-12 rounded-xl ${cat.bgColor} flex items-center justify-center ${cat.color}`}>
                            {event.icon}
                          </div>
                          <Badge className={`${cat.bgColor} ${cat.color} text-xs font-medium`}>
                            {cat.label}
                          </Badge>
                        </div>
                        <h3 className="text-lg font-bold text-foreground mt-4">
                          {event.title}
                        </h3>
                        {activeTab === 'past' && (
                          <Badge variant="outline" className="mt-2 text-xs border-border">
                            Completed
                          </Badge>
                        )}
                      </div>

                      {/* Content */}
                      <CardContent className="p-5 flex-1 flex flex-col">
                        <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                          {event.description}
                        </p>

                        <div className="mt-5 space-y-2.5">
                          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Calendar className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span>{event.date}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <MapPin className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span>{event.location}</span>
                          </div>
                          <div className="flex items-center gap-2.5 text-sm text-muted-foreground">
                            <div className="w-7 h-7 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                              <Clock className="w-3.5 h-3.5 text-primary" />
                            </div>
                            <span>{event.time}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                );
              })}
            </div>

            {/* Empty State */}
            {currentEvents.length === 0 && (
              <div className="text-center py-20">
                <Calendar className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-xl font-bold">No events found</h3>
                <p className="text-muted-foreground mt-2">Check back soon for updates.</p>
              </div>
            )}
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-2xl sm:text-3xl font-bold mb-4">
                Want to Organize an <span className="gradient-text">Event?</span>
              </h2>
              <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
                Contact us to propose an event, workshop, or seminar. We support student-led initiatives and collaborations.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" className="gap-2" asChild>
                  <Link href="/contact">
                    Contact Event Coordinator
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
