"use client";

import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { motion } from "framer-motion";
import { BookOpen, Calendar, ArrowRight, Tag, Mail, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

const blogPosts = [
  { slug: "top-10-university-ranking", title: "Greenfield Academy Ranks Among Top 10 National Universities", category: "News", date: "Mar 15, 2025", excerpt: "We are proud to announce that Greenfield Academy has been ranked among the top 10 national universities in the latest higher education assessment, recognizing our commitment to academic excellence, research output, and student satisfaction.", color: "from-blue-500 to-cyan-500" },
  { slug: "ai-research-center", title: "New AI Research Center Inauguration", category: "Research", date: "Feb 28, 2025", excerpt: "The newly established Artificial Intelligence Research Center at Greenfield Academy marks a significant milestone in our journey towards becoming a hub for cutting-edge technology research and innovation in the region.", color: "from-purple-500 to-violet-500" },
  { slug: "student-startup-award", title: "Student Startup Wins National Innovation Award", category: "Achievement", date: "Feb 10, 2025", excerpt: "A team of Greenfield Academy students has won the prestigious National Innovation Award for their groundbreaking startup that leverages machine learning to improve agricultural productivity in rural communities.", color: "from-emerald-500 to-teal-500" },
  { slug: "sports-week-2025", title: "Annual Sports Week 2025: A Grand Celebration", category: "Events", date: "Jan 25, 2025", excerpt: "The Annual Sports Week 2025 brought together students, faculty, and staff for a week of thrilling competitions, team spirit, and memorable moments that showcased the vibrant athletic culture at Greenfield Academy.", color: "from-orange-500 to-amber-500" },
];

const categories = [
  { name: "News", count: 5 },
  { name: "Research", count: 3 },
  { name: "Events", count: 4 },
  { name: "Achievement", count: 2 },
  { name: "Campus Life", count: 6 },
];

export default function BlogPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative py-24 lg:py-32 bg-gradient-to-br from-primary via-primary/90 to-primary/70">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 mb-4">News & Blog</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">Latest Updates</h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">Stay updated with the latest news, research, and events from Greenfield Academy</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                {blogPosts.map((post, i) => (
                  <motion.div key={post.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.1 }}>
                    <Card className="card-hover overflow-hidden border-border/50">
                      <div className="md:flex">
                        <div className={`md:w-64 h-48 md:h-auto bg-gradient-to-br ${post.color} flex items-center justify-center shrink-0`}>
                          <BookOpen className="w-16 h-16 text-white/30" />
                        </div>
                        <CardContent className="p-6">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge variant="secondary">{post.category}</Badge>
                            <span className="text-xs text-muted-foreground flex items-center gap-1"><Calendar className="w-3 h-3" />{post.date}</span>
                          </div>
                          <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">{post.title}</h3>
                          <p className="text-muted-foreground text-sm leading-relaxed mb-4">{post.excerpt}</p>
                          <Link href={`/blog/${post.slug}`} className="text-primary text-sm font-medium inline-flex items-center gap-1 hover:gap-2 transition-all">
                            Read More <ArrowRight className="w-4 h-4" />
                          </Link>
                        </CardContent>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="space-y-6">
                <Card className="p-6 border-border/50">
                  <CardContent className="p-0">
                    <h3 className="font-semibold mb-4 flex items-center gap-2"><Tag className="w-4 h-4 text-primary" />Categories</h3>
                    <div className="space-y-2">
                      {categories.map((cat) => (
                        <button key={cat.name} className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm text-left">
                          <span>{cat.name}</span>
                          <Badge variant="secondary" className="text-xs">{cat.count}</Badge>
                        </button>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 border-border/50">
                  <CardContent className="p-0">
                    <h3 className="font-semibold mb-4">Recent Posts</h3>
                    <div className="space-y-3">
                      {blogPosts.slice(0, 3).map((post) => (
                        <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                          <p className="text-sm font-medium group-hover:text-primary transition-colors leading-snug">{post.title}</p>
                          <p className="text-xs text-muted-foreground mt-1">{post.date}</p>
                        </Link>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground border-primary/20">
                  <CardContent className="p-0">
                    <h3 className="font-semibold mb-2">Newsletter</h3>
                    <p className="text-primary-foreground/70 text-sm mb-4">Get the latest updates delivered to your inbox.</p>
                    <Input placeholder="Your email" className="bg-white/10 border-white/20 text-primary-foreground placeholder:text-primary-foreground/40 mb-3" />
                    <Button className="w-full bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2">
                      <Mail className="w-4 h-4" />Subscribe
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
