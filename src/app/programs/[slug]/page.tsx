"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Users, BookOpen, CheckCircle, GraduationCap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const programData: Record<string, any> = {
  "computer-science-engineering": {
    title: "Computer Science & Engineering", category: "Science", duration: "4 Years", fees: "৳ 45,000/semester", seats: 60, enrolled: 45,
    description: "Our flagship Computer Science & Engineering program provides a comprehensive education in the theory and practice of computing. Students gain deep knowledge of algorithms, data structures, software engineering, artificial intelligence, machine learning, and system design through a combination of rigorous coursework and hands-on lab sessions.",
    curriculum: ["Data Structures & Algorithms", "Object-Oriented Programming", "Database Management Systems", "Computer Networks", "Operating Systems", "Software Engineering", "Artificial Intelligence & Machine Learning", "Web Technologies & Frameworks", "Cloud Computing & DevOps", "Cybersecurity Fundamentals", "Mobile Application Development", "Capstone Project"],
    requirements: ["Minimum GPA 3.5 in SSC & HSC", "Strong mathematics background", "Pass admission test", "Valid national ID"],
    teacher: { name: "Dr. Ahmed Khan", designation: "Professor & Head", dept: "Computer Science", img: "/professor1.png" },
  },
  "business-administration": {
    title: "Business Administration (BBA)", category: "Commerce", duration: "4 Years", fees: "৳ 35,000/semester", seats: 50, enrolled: 38,
    description: "The BBA program prepares students for leadership roles in business and management. The curriculum covers all fundamental areas of business including management, marketing, finance, human resources, and entrepreneurship, complemented by real-world case studies and internship opportunities.",
    curriculum: ["Principles of Management", "Business Communication", "Financial Accounting", "Marketing Management", "Human Resource Management", "Business Statistics", "Operations Management", "Strategic Management", "Entrepreneurship Development", "International Business", "Business Law & Ethics", "Internship & Thesis"],
    requirements: ["Minimum GPA 3.0 in SSC & HSC", "Commerce background preferred", "Pass admission test", "Valid national ID"],
    teacher: { name: "Prof. Sarah Islam", designation: "Associate Professor", dept: "Business Studies", img: "/professor2.png" },
  },
  "electrical-engineering": {
    title: "Electrical & Electronic Engineering", category: "Science", duration: "4 Years", fees: "৳ 40,000/semester", seats: 50, enrolled: 42,
    description: "The EEE program offers in-depth study of electrical circuits, power systems, electronics, and telecommunications. Students benefit from modern laboratory facilities and hands-on training that prepares them for careers in the rapidly evolving electrical and electronics industry.",
    curriculum: ["Circuit Theory & Analysis", "Electronics Devices & Circuits", "Electromagnetic Fields", "Power Systems Engineering", "Control Systems", "Digital Signal Processing", "Communication Engineering", "Microprocessors & Embedded Systems", "Renewable Energy Systems", "Industrial Training", "Capstone Project"],
    requirements: ["Minimum GPA 3.5 in SSC & HSC", "Science background with Physics & Math", "Pass admission test", "Valid national ID"],
    teacher: { name: "Dr. Mohammad Ali", designation: "Professor", dept: "Electrical Engineering", img: "/professor1.png" },
  },
  "english-literature": {
    title: "English Language & Literature", category: "Arts", duration: "4 Years", fees: "৳ 25,000/semester", seats: 40, enrolled: 30,
    description: "Explore the rich world of English literature from classical masterpieces to contemporary works. This program develops critical thinking, analytical skills, and creative writing abilities while providing a deep understanding of literary traditions, linguistic theory, and cultural contexts.",
    curriculum: ["Introduction to English Literature", "Linguistics & Phonetics", "Shakespeare Studies", "Romantic & Victorian Literature", "American Literature", "Post-Colonial Literature", "Literary Criticism & Theory", "Creative Writing", "English for Specific Purposes", "Research Methodology", "Thesis"],
    requirements: ["Minimum GPA 3.0 in SSC & HSC", "Strong English language skills", "Pass admission test", "Valid national ID"],
    teacher: { name: "Dr. Nadia Rahman", designation: "Professor", dept: "English", img: "/professor2.png" },
  },
};

export default function ProgramDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const program = programData[slug] || programData["computer-science-engineering"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative py-24 lg:py-32 bg-gradient-to-br from-primary via-primary/90 to-primary/70 overflow-hidden">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <Link href="/programs" className="text-primary-foreground/60 hover:text-primary-foreground text-sm mb-4 inline-flex items-center gap-1"><ChevronRight className="w-4 h-4 rotate-180" /> Back to Programs</Link>
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 mb-4">{program.category}</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">{program.title}</h1>
              <div className="flex flex-wrap gap-4 text-primary-foreground/80">
                <span className="flex items-center gap-1.5"><Clock className="w-4 h-4" />{program.duration}</span>
                <span className="flex items-center gap-1.5"><Users className="w-4 h-4" />{program.enrolled}/{program.seats} Seats</span>
                <span className="flex items-center gap-1.5"><BookOpen className="w-4 h-4" />{program.fees}</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Tabs defaultValue="overview">
                  <TabsList className="mb-8">
                    <TabsTrigger value="overview">Overview</TabsTrigger>
                    <TabsTrigger value="curriculum">Curriculum</TabsTrigger>
                    <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  </TabsList>
                  <TabsContent value="overview">
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                      <h2 className="text-2xl font-bold mb-4">Program Overview</h2>
                      <p className="text-muted-foreground leading-relaxed mb-6">{program.description}</p>
                      <h3 className="text-lg font-semibold mb-3">Program Highlights</h3>
                      <ul className="space-y-2">
                        {["Industry-aligned curriculum with regular updates", "Hands-on laboratory and project work", "Experienced faculty with industry background", "Internship and placement assistance", "Research opportunities from semester 3", "International exchange programs"].map((h, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground"><CheckCircle className="w-4 h-4 text-primary mt-0.5 shrink-0" />{h}</li>
                        ))}
                      </ul>
                    </motion.div>
                  </TabsContent>
                  <TabsContent value="curriculum">
                    <h2 className="text-2xl font-bold mb-4">Curriculum</h2>
                    <div className="grid sm:grid-cols-2 gap-3">
                      {program.curriculum.map((item, i) => (
                        <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-muted/50">
                          <span className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">{i + 1}</span>
                          <span className="text-sm">{item}</span>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                  <TabsContent value="requirements">
                    <h2 className="text-2xl font-bold mb-4">Admission Requirements</h2>
                    <Card><CardContent className="p-6">
                      <ul className="space-y-3">
                        {program.requirements.map((r, i) => (
                          <li key={i} className="flex items-center gap-2"><CheckCircle className="w-5 h-5 text-primary shrink-0" /><span>{r}</span></li>
                        ))}
                      </ul>
                    </CardContent></Card>
                  </TabsContent>
                </Tabs>
              </div>

              <div className="space-y-6">
                <Card className="p-6 border-primary/20">
                  <CardContent className="p-0">
                    <h3 className="font-semibold mb-4">Program Instructor</h3>
                    <div className="flex items-center gap-3 mb-3">
                      <img src={program.teacher.img} alt={program.teacher.name} className="w-14 h-14 rounded-xl object-cover" />
                      <div>
                        <p className="font-semibold">{program.teacher.name}</p>
                        <p className="text-sm text-muted-foreground">{program.teacher.designation}</p>
                        <p className="text-xs text-primary">{program.teacher.dept}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card className="p-6 bg-gradient-to-br from-primary to-primary/90 text-primary-foreground">
                  <CardContent className="p-0 text-center">
                    <GraduationCap className="w-10 h-10 mx-auto mb-3 opacity-80" />
                    <h3 className="text-xl font-bold mb-2">Ready to Apply?</h3>
                    <p className="text-primary-foreground/80 text-sm mb-4">Start your journey at Greenfield Academy today.</p>
                    <Link href="/admission"><Button className="w-full gap-2 bg-primary-foreground text-primary hover:bg-primary-foreground/90"><ArrowRight className="w-4 h-4" />Apply Now</Button></Link>
                  </CardContent>
                </Card>
                <Card className="p-6"><CardContent className="p-0">
                  <h3 className="font-semibold mb-3">Quick Facts</h3>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Duration</span><span className="font-medium">{program.duration}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Tuition</span><span className="font-medium">{program.fees}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Available Seats</span><span className="font-medium">{program.seats - program.enrolled} remaining</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Category</span><Badge variant="secondary">{program.category}</Badge></div>
                  </div>
                </CardContent></Card>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
