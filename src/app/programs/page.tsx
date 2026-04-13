"use client";

import { useState } from "react";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { motion } from "framer-motion";
import { Search, ChevronRight, Clock, Users, Star, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const mockPrograms = [
  { slug: "computer-science-engineering", title: "Computer Science & Engineering", category: "Science", duration: "4 Years", fees: "৳ 45,000/sem", seats: 60, description: "Comprehensive program covering algorithms, data structures, software engineering, AI/ML, and system design with hands-on lab sessions and industry projects.", color: "from-blue-500 to-cyan-500", enrolled: 45 },
  { slug: "business-administration", title: "Business Administration (BBA)", category: "Commerce", duration: "4 Years", fees: "৳ 35,000/sem", seats: 50, description: "Rigorous curriculum in management, marketing, finance, and entrepreneurship with case studies, internships, and global business exposure.", color: "from-emerald-500 to-teal-500", enrolled: 38 },
  { slug: "electrical-engineering", title: "Electrical & Electronic Engineering", category: "Science", duration: "4 Years", fees: "৳ 40,000/sem", seats: 50, description: "In-depth study of circuits, power systems, electronics, and telecommunications with practical training in modern laboratories and field visits.", color: "from-orange-500 to-amber-500", enrolled: 42 },
  { slug: "english-literature", title: "English Language & Literature", category: "Arts", duration: "4 Years", fees: "৳ 25,000/sem", seats: 40, description: "Explore classical and contemporary English literature, critical theory, linguistics, and creative writing in a vibrant academic environment.", color: "from-purple-500 to-pink-500", enrolled: 30 },
  { slug: "medical-laboratory-technology", title: "Medical Laboratory Technology", category: "Science", duration: "3 Years", fees: "৳ 50,000/sem", seats: 30, description: "Specialized training in clinical pathology, microbiology, biochemistry, and molecular diagnostics with hospital internship rotations.", color: "from-red-500 to-rose-500", enrolled: 25 },
  { slug: "multimedia-creative-design", title: "Multimedia & Creative Design", category: "Vocational", duration: "2 Years", fees: "৳ 30,000/sem", seats: 35, description: "Master graphic design, web development, video production, and UI/UX design using industry-standard tools and real-world projects.", color: "from-violet-500 to-indigo-500", enrolled: 28 },
];

const categories = ["All", "Science", "Arts", "Commerce", "Vocational", "General"];

export default function ProgramsPage() {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filtered = mockPrograms.filter(p => {
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    const matchCategory = activeCategory === "All" || p.category === activeCategory;
    return matchSearch && matchCategory;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative py-24 lg:py-32 bg-gradient-to-br from-primary via-primary/90 to-primary/70 overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('/classroom.png')", backgroundSize: 'cover' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 mb-4">Academic Programs</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">Our Programs</h1>
              <p className="text-primary-foreground/80 text-lg sm:text-xl max-w-2xl mx-auto">Discover programs designed to prepare you for success in your chosen field.</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search & Filters */}
            <div className="flex flex-col md:flex-row gap-4 mb-10">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input placeholder="Search programs..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-10" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {categories.map((cat) => (
                  <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(cat)} className="gap-1.5">
                    <Filter className="w-3 h-3" />
                    {cat}
                  </Button>
                ))}
              </div>
            </div>

            {/* Programs Grid */}
            {filtered.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground text-lg">No programs found matching your criteria.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((program, i) => (
                  <motion.div key={program.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: i * 0.05 }}>
                    <Card className="card-hover overflow-hidden h-full border-border/50">
                      <div className={`h-2 bg-gradient-to-r ${program.color}`} />
                      <CardContent className="p-6">
                        <div className="flex items-start justify-between mb-3">
                          <Badge variant="secondary">{program.category}</Badge>
                          <span className="text-sm text-muted-foreground flex items-center gap-1"><Clock className="w-3.5 h-3.5" />{program.duration}</span>
                        </div>
                        <h3 className="text-xl font-semibold mb-3">{program.title}</h3>
                        <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{program.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
                          <span className="flex items-center gap-1"><Users className="w-3.5 h-3.5" />{program.enrolled}/{program.seats} seats</span>
                          <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                            <div className="h-full bg-primary rounded-full" style={{ width: `${(program.enrolled / program.seats) * 100}%` }} />
                          </div>
                        </div>
                        <div className="flex items-center justify-between pt-4 border-t border-border/50">
                          <span className="text-lg font-bold text-primary">{program.fees}</span>
                          <div className="flex gap-2">
                            <Link href={`/programs/${program.slug}`}>
                              <Button variant="ghost" size="sm">Details</Button>
                            </Link>
                            <Link href="/admission">
                              <Button size="sm" className="gap-1">Apply <ChevronRight className="w-3 h-3" /></Button>
                            </Link>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
