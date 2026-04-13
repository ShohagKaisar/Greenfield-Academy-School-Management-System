"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Footer } from "@/components/site/footer";
import {
  GraduationCap, BookOpen, Users, Trophy, ChevronRight, Star, ArrowRight,
  Beaker, Library, Monitor, Globe, Calendar, Clock, MapPin, Sparkles
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

const stats = [
  { icon: Users, value: 5000, suffix: "+", label: "Students" },
  { icon: GraduationCap, value: 200, suffix: "+", label: "Faculty" },
  { icon: BookOpen, value: 50, suffix: "+", label: "Programs" },
  { icon: Trophy, value: 95, suffix: "%", label: "Placement Rate" },
];

const features = [
  { icon: GraduationCap, title: "World-Class Faculty", description: "Our distinguished faculty members are leading researchers and industry experts dedicated to student success and academic excellence across all disciplines." },
  { icon: Beaker, title: "Modern Facilities", description: "State-of-the-art laboratories, digital libraries, smart classrooms, and research centers equipped with the latest technology for immersive learning experiences." },
  { icon: BookOpen, title: "Research Excellence", description: "Cutting-edge research programs and partnerships with global institutions, fostering innovation and critical thinking among students and faculty." },
  { icon: Trophy, title: "Career Support", description: "Dedicated career counseling, industry partnerships, internship programs, and placement assistance ensuring students achieve their professional goals." },
];

const programs = [
  { title: "Computer Science & Engineering", category: "Science", duration: "4 Years", fees: "৳ 45,000/sem", slug: "computer-science-engineering", color: "from-blue-500 to-cyan-500" },
  { title: "Business Administration", category: "Commerce", duration: "4 Years", fees: "৳ 35,000/sem", slug: "business-administration", color: "from-emerald-500 to-teal-500" },
  { title: "Electrical Engineering", category: "Science", duration: "4 Years", fees: "৳ 40,000/sem", slug: "electrical-engineering", color: "from-orange-500 to-amber-500" },
  { title: "English Literature", category: "Arts", duration: "4 Years", fees: "৳ 25,000/sem", slug: "english-literature", color: "from-purple-500 to-pink-500" },
  { title: "Medical Laboratory Technology", category: "Science", duration: "3 Years", fees: "৳ 50,000/sem", slug: "medical-lab-technology", color: "from-red-500 to-rose-500" },
  { title: "Multimedia & Creative Design", category: "Vocational", duration: "2 Years", fees: "৳ 30,000/sem", slug: "multimedia-creative-design", color: "from-violet-500 to-indigo-500" },
];

const testimonials = [
  { name: "Sarah Ahmed", role: "Software Engineer, Google", content: "Greenfield Academy gave me the foundation I needed to succeed in the tech industry. The hands-on approach to learning and incredible mentorship from professors made all the difference.", rating: 5 },
  { name: "Rahim Uddin", role: "Entrepreneur & CEO", content: "The Business Administration program equipped me with practical knowledge and leadership skills. The networking opportunities and industry connections were invaluable.", rating: 5 },
  { name: "Fatima Khan", role: "Research Scientist", content: "The research facilities and guidance from experienced faculty helped me publish my first paper during my undergraduate studies. Truly a world-class institution.", rating: 5 },
];

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-50px" },
  transition: { duration: 0.6 }
};

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/hero-campus.png')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/70 to-foreground/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-foreground/50 via-transparent to-transparent" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 w-full">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <Badge className="bg-primary/20 text-primary border-primary/30 mb-6 px-4 py-1.5 text-sm">
                <Sparkles className="w-3.5 h-3.5 mr-1.5" />
                Admissions Open 2025-26
              </Badge>
            </motion.div>

            <motion.h1
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold text-background leading-[1.1] mb-6"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              Shaping{" "}
              <span className="text-primary">Future Leaders</span>
              <br />
              Through Excellence
            </motion.h1>

            <motion.p
              className="text-lg sm:text-xl text-background/70 mb-8 max-w-2xl leading-relaxed"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              Join one of the nation&apos;s premier institutions offering world-class education, cutting-edge research facilities, and a nurturing environment for holistic development.
            </motion.p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 mb-12"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >
              <Link href="/programs">
                <Button size="lg" className="gap-2 shadow-xl shadow-primary/30 text-base px-8 h-12">
                  Explore Programs
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/admission">
                <Button size="lg" variant="outline" className="gap-2 text-base px-8 h-12 border-background/30 text-background hover:bg-background/10 hover:text-background">
                  Apply Now
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </Link>
            </motion.div>

            {/* Stats */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.7 }}
            >
              {stats.map(({ icon: Icon, value, suffix, label }) => (
                <div key={label} className="text-center sm:text-left">
                  <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                    <Icon className="w-5 h-5 text-primary" />
                    <span className="text-3xl sm:text-4xl font-bold text-background">
                      {value}{suffix}
                    </span>
                  </div>
                  <p className="text-sm text-background/50">{label}</p>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          <div className="w-6 h-10 border-2 border-background/30 rounded-full flex justify-center">
            <motion.div className="w-1.5 h-1.5 bg-primary rounded-full mt-2" />
          </div>
        </motion.div>
      </section>

      {/* Programs Preview */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <Badge variant="secondary" className="mb-4">Our Programs</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Explore Our <span className="gradient-text">Programs</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover a wide range of undergraduate and graduate programs designed to prepare you for success in your chosen field.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.map((program, i) => (
              <motion.div
                key={program.slug}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="card-hover overflow-hidden border-border/50 h-full">
                  <div className={`h-3 bg-gradient-to-r ${program.color}`} />
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <Badge variant="secondary">{program.category}</Badge>
                      <span className="text-sm text-muted-foreground">{program.duration}</span>
                    </div>
                    <h3 className="text-xl font-semibold mb-2">{program.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">
                      Comprehensive program combining theoretical knowledge with practical skills and industry exposure.
                    </p>
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

          <motion.div className="text-center mt-12" {...fadeInUp}>
            <Link href="/programs">
              <Button variant="outline" size="lg" className="gap-2">
                View All Programs <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <Badge variant="secondary" className="mb-4">Why Greenfield</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Why Choose <span className="gradient-text">Our Academy</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              We provide a transformative educational experience that goes beyond the classroom to shape well-rounded individuals.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, description }, i) => (
              <motion.div
                key={title}
                {...stagger}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <Card className="card-hover text-center p-6 h-full border-border/50">
                  <CardContent className="p-0">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="w-7 h-7 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/80" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: "url('/hero-campus.png')", backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { value: "60+", label: "Years of Excellence" },
              { value: "15K+", label: "Alumni Worldwide" },
              { value: "100+", label: "Industry Partners" },
              { value: "50+", label: "Research Papers/Year" },
            ].map((stat, i) => (
              <motion.div
                key={stat.label}
                className="text-center"
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.15 }}
              >
                <div className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-2">{stat.value}</div>
                <div className="text-primary-foreground/70 text-sm sm:text-base">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Campus Life / Gallery Preview */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <Badge variant="secondary" className="mb-4">Campus Life</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Experience Our <span className="gradient-text">Vibrant Campus</span>
            </h2>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { src: "/classroom.png", label: "Modern Classrooms", span: "md:col-span-2" },
              { src: "/library.png", label: "Library" },
              { src: "/science-lab.png", label: "Science Labs" },
              { src: "/students-celebrating.png", label: "Student Life", span: "md:col-span-2" },
            ].map((item, i) => (
              <motion.div
                key={item.label}
                className={`relative group rounded-2xl overflow-hidden ${item.span || ""}`}
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <img src={item.src} alt={item.label} className="w-full h-48 md:h-64 object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <p className="text-background font-semibold text-lg">{item.label}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div className="text-center mt-10" {...fadeInUp}>
            <Link href="/gallery">
              <Button variant="outline" size="lg" className="gap-2">
                View Full Gallery <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 lg:py-28 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="text-center mb-16" {...fadeInUp}>
            <Badge variant="secondary" className="mb-4">Testimonials</Badge>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              What Our <span className="gradient-text">Alumni Say</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Hear from our graduates about their transformative experience at Greenfield Academy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...stagger} transition={{ duration: 0.5, delay: i * 0.15 }}>
                <Card className="card-hover p-6 h-full border-border/50">
                  <CardContent className="p-0">
                    <div className="flex gap-1 mb-4">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed mb-6 italic">&ldquo;{t.content}&rdquo;</p>
                    <div className="flex items-center gap-3 pt-4 border-t border-border/50">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center text-primary-foreground font-semibold">
                        {t.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-semibold text-sm">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Events Preview */}
      <section className="py-20 lg:py-28 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-12" {...fadeInUp}>
            <div>
              <Badge variant="secondary" className="mb-4">Latest Events</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">Upcoming Events</h2>
            </div>
            <Link href="/events" className="mt-4 sm:mt-0">
              <Button variant="ghost" className="gap-2">View All Events <ArrowRight className="w-4 h-4" /></Button>
            </Link>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { title: "Annual Science Fair 2025", date: "Apr 15, 2025", location: "Main Auditorium", icon: Beaker, color: "bg-blue-50 text-blue-600" },
              { title: "Career Fair & Job Expo", date: "May 2, 2025", location: "Convention Center", icon: Globe, color: "bg-emerald-50 text-emerald-600" },
              { title: "Cultural Festival - Spring", date: "May 20, 2025", location: "Campus Grounds", icon: Calendar, color: "bg-purple-50 text-purple-600" },
            ].map((event, i) => (
              <motion.div key={event.title} {...stagger} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card className="card-hover overflow-hidden h-full border-border/50">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-xl ${event.color} flex items-center justify-center mb-4`}>
                      <event.icon className="w-6 h-6" />
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>{event.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    </div>
                    <Button variant="link" className="mt-4 px-0 gap-1 text-primary">
                      Learn More <ChevronRight className="w-3 h-3" />
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-primary via-primary/90 to-primary/70" />
        <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeInUp}>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-6">
              Ready to Begin Your Journey?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Take the first step towards a brighter future. Apply now and join our community of scholars, innovators, and leaders.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/admission">
                <Button size="lg" className="bg-primary-foreground text-primary hover:bg-primary-foreground/90 gap-2 shadow-xl text-base px-10 h-12">
                  Apply for Admission
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 gap-2 text-base px-10 h-12">
                  Contact Us
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
}
