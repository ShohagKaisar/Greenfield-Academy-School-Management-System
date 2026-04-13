"use client";

import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { motion } from "framer-motion";
import { Target, Eye, History, Star, Shield, Lightbulb, Users, Globe, BookOpen, GraduationCap } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const fadeInUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 }
};

const timeline = [
  { year: "1965", title: "Foundation", desc: "Greenfield Academy was established with a vision to provide quality education to students in the region, starting with just 50 students and 5 faculty members." },
  { year: "1980", title: "Expansion", desc: "Added science and commerce programs, constructed new academic buildings, and grew to over 500 students with a dedicated faculty team." },
  { year: "2000", title: "Digital Transformation", desc: "Introduced computer labs, digital library, and e-learning platforms. Launched the first undergraduate engineering programs." },
  { year: "2010", title: "Research Hub", desc: "Established research centers and partnerships with international universities. Started publishing in top-tier academic journals." },
  { year: "2020", title: "Global Recognition", desc: "Achieved international accreditation and ranked among the top educational institutions. Launched online learning programs." },
  { year: "2025", title: "Leading Innovation", desc: "Continuing our legacy with AI-integrated learning, smart campus initiatives, and expanded global partnerships." },
];

const values = [
  { icon: Star, title: "Excellence", desc: "We strive for the highest standards in academics, research, and character development, inspiring excellence in everything we do." },
  { icon: Shield, title: "Integrity", desc: "We uphold honesty, transparency, and ethical conduct in all our academic and administrative practices, fostering trust and respect." },
  { icon: Lightbulb, title: "Innovation", desc: "We encourage creative thinking, embrace new technologies, and foster a culture of continuous improvement and intellectual curiosity." },
  { icon: Users, title: "Community", desc: "We build a supportive and inclusive community where every member feels valued, respected, and empowered to contribute." },
  { icon: Globe, title: "Diversity", desc: "We celebrate diverse perspectives and backgrounds, preparing students to thrive in a connected and multicultural world." },
  { icon: BookOpen, title: "Leadership", desc: "We develop confident, responsible leaders who make positive contributions to society and drive meaningful change in their communities." },
];

const facilities = [
  { img: "/classroom.png", title: "Modern Classrooms", desc: "Smart classrooms equipped with interactive whiteboards, projectors, and modern furniture for an engaging learning experience." },
  { img: "/library.png", title: "Digital Library", desc: "A vast collection of 50,000+ books, journals, and digital resources with dedicated study areas and research cubicles." },
  { img: "/science-lab.png", title: "Advanced Laboratories", desc: "State-of-the-art science, computer, and engineering labs with the latest equipment for hands-on experimentation." },
];

export default function AboutPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="relative py-24 lg:py-32 bg-gradient-to-br from-primary via-primary/90 to-primary/70 overflow-hidden">
          <div className="absolute inset-0 opacity-5" style={{ backgroundImage: "url('/hero-campus.png')", backgroundSize: 'cover' }} />
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 mb-4">About Us</Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4">About Greenfield Academy</h1>
              <p className="text-primary-foreground/80 text-lg sm:text-xl max-w-2xl mx-auto">A legacy of excellence in education spanning six decades, shaping minds and building futures.</p>
            </motion.div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div {...fadeInUp}>
                <Card className="p-8 h-full border-primary/20 card-hover">
                  <CardContent className="p-0">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <Target className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      To provide transformative, accessible, and inclusive education that empowers students with knowledge, critical thinking skills, and ethical values. We are committed to fostering academic excellence, nurturing innovation, and developing responsible global citizens who contribute meaningfully to society and drive positive change in their communities and beyond.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
              <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
                <Card className="p-8 h-full border-primary/20 card-hover">
                  <CardContent className="p-0">
                    <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                      <Eye className="w-7 h-7 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold mb-4">Our Vision</h2>
                    <p className="text-muted-foreground leading-relaxed">
                      To be a globally recognized center of academic excellence and innovation, producing graduates who lead with integrity, creativity, and compassion. We envision a future where Greenfield Academy stands at the forefront of educational innovation, research breakthroughs, and community impact, preparing students to address the challenges and opportunities of the 21st century.
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </section>

        {/* History Timeline */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <Badge variant="secondary" className="mb-4">Our Journey</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">A Legacy of <span className="gradient-text">Excellence</span></h2>
            </motion.div>
            <div className="relative">
              <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-0.5 bg-primary/20 md:-translate-x-px" />
              {timeline.map((item, i) => (
                <motion.div
                  key={item.year}
                  className={`relative flex items-start gap-8 mb-12 ${i % 2 === 0 ? 'md:flex-row' : 'md:flex-row-reverse'}`}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <div className={`flex-1 ${i % 2 === 0 ? 'md:text-right' : 'md:text-left'} hidden md:block`}>
                    <Card className="p-6 card-hover inline-block text-left">
                      <CardContent className="p-0">
                        <h3 className="text-lg font-semibold mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.desc}</p>
                      </CardContent>
                    </Card>
                  </div>
                  <div className="relative z-10 w-8 h-8 rounded-full bg-primary flex items-center justify-center shrink-0 md:absolute md:left-1/2 md:-translate-x-1/2">
                    <History className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <div className="flex-1">
                    <div className="md:hidden">
                      <Card className="p-4 card-hover">
                        <CardContent className="p-0">
                          <span className="text-sm font-bold text-primary">{item.year}</span>
                          <h3 className="text-lg font-semibold mt-1 mb-2">{item.title}</h3>
                          <p className="text-sm text-muted-foreground">{item.desc}</p>
                        </CardContent>
                      </Card>
                    </div>
                    <div className="hidden md:block">
                      <span className="text-2xl font-bold text-primary">{item.year}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Core Values */}
        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <Badge variant="secondary" className="mb-4">Our Values</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">Core <span className="gradient-text">Values</span></h2>
            </motion.div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {values.map(({ icon: Icon, title, desc }, i) => (
                <motion.div key={title} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.08 }}>
                  <Card className="p-6 card-hover h-full border-border/50">
                    <CardContent className="p-0">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2">{title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Campus Facilities */}
        <section className="py-16 lg:py-24 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div className="text-center mb-16" {...fadeInUp}>
              <Badge variant="secondary" className="mb-4">Facilities</Badge>
              <h2 className="text-3xl sm:text-4xl font-bold">Our <span className="gradient-text">Campus</span></h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-6">
              {facilities.map(({ img, title, desc }, i) => (
                <motion.div key={title} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: i * 0.1 }}>
                  <Card className="overflow-hidden card-hover h-full border-border/50">
                    <img src={img} alt={title} className="w-full h-48 object-cover" />
                    <CardContent className="p-6">
                      <h3 className="text-lg font-semibold mb-2">{title}</h3>
                      <p className="text-sm text-muted-foreground">{desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
