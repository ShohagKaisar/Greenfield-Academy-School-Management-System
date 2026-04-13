'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription,
} from '@/components/ui/dialog';
import {
  Mail, GraduationCap, BookOpen, Award, Globe, Phone, Search,
} from 'lucide-react';
import { Header } from '@/components/site/header';
import { Footer } from '@/components/site/footer';

interface FacultyMember {
  id: string;
  name: string;
  designation: string;
  department: string;
  qualification: string;
  bio: string;
  img?: string;
  email?: string;
  phone?: string;
  fullBio?: string;
  research?: string[];
}

const allFaculty: FacultyMember[] = [
  {
    id: '1',
    name: 'Dr. Ahmed Khan',
    designation: 'Professor & Head',
    department: 'Computer Science',
    qualification: 'PhD MIT',
    img: '/professor1.png',
    bio: 'Leading researcher in AI and machine learning with over 15 years of academic excellence and 50+ published papers.',
    fullBio: 'Dr. Ahmed Khan is a leading researcher in artificial intelligence and machine learning with over 15 years of academic and industry experience. He has published more than 50 papers in top-tier journals and conferences. He leads the AI Research Lab at Greenfield Academy and has supervised 25+ graduate students. Before joining academia, he worked at Google Research and Microsoft Research.',
    email: 'ahmed.khan@greenfield.edu',
    phone: '+880 1234-567801',
    research: ['Artificial Intelligence', 'Machine Learning', 'Natural Language Processing'],
  },
  {
    id: '2',
    name: 'Prof. Sarah Islam',
    designation: 'Associate Professor',
    department: 'Business',
    qualification: 'MBA Harvard',
    img: '/professor2.png',
    bio: 'Brings extensive corporate strategy experience from 10 years at top Fortune 500 companies before academia.',
    fullBio: 'Prof. Sarah Islam brings extensive corporate strategy and financial management experience from her 10 years at leading Fortune 500 companies before transitioning to academia. She specializes in strategic management and organizational behavior. Her research on emerging market strategies has been cited in Harvard Business Review and Financial Times.',
    email: 'sarah.islam@greenfield.edu',
    phone: '+880 1234-567802',
    research: ['Strategic Management', 'Financial Analysis', 'Organizational Behavior'],
  },
  {
    id: '3',
    name: 'Dr. Mohammad Ali',
    designation: 'Professor',
    department: 'Engineering',
    qualification: 'PhD BUET',
    img: '/professor1.png',
    bio: 'Expert in renewable energy systems and power electronics with 18 years of teaching and 5 patents.',
    fullBio: 'Dr. Mohammad Ali is an expert in renewable energy systems, power electronics, and control systems with 18 years of distinguished teaching experience. He has supervised 20+ PhD students and holds 5 patents in solar energy technology. He has received the National Science Award twice for his groundbreaking contributions to sustainable energy research.',
    email: 'mohammad.ali@greenfield.edu',
    phone: '+880 1234-567803',
    research: ['Renewable Energy', 'Power Electronics', 'Control Systems'],
  },
  {
    id: '4',
    name: 'Dr. Nadia Rahman',
    designation: 'Professor',
    department: 'Arts',
    qualification: 'PhD Oxford',
    img: '/professor2.png',
    bio: 'Acclaimed literary scholar and author of three books on postcolonial literature and feminist theory.',
    fullBio: 'Dr. Nadia Rahman is an acclaimed literary scholar and author of three critically acclaimed books on postcolonial literature and feminist theory. She received the National Teaching Excellence Award in 2020 and has been a visiting professor at Oxford, Cambridge, and Harvard. Her work on South Asian literature has been translated into 12 languages.',
    email: 'nadia.rahman@greenfield.edu',
    phone: '+880 1234-567804',
    research: ['Postcolonial Literature', 'Feminist Theory', 'Creative Writing'],
  },
  {
    id: '5',
    name: 'Dr. Karim Hossain',
    designation: 'Assistant Professor',
    department: 'Science',
    qualification: 'PhD Dhaka Univ',
    bio: 'Specializes in quantum physics and particle physics with active research at CERN collaborations.',
    fullBio: 'Dr. Karim Hossain specializes in quantum mechanics and particle physics with active research collaborations at CERN. He completed his postdoctoral fellowship at ETH Zurich before joining Greenfield Academy. He has published 30+ papers in leading physics journals and mentors undergraduate research projects in experimental physics.',
    email: 'karim.hossain@greenfield.edu',
    phone: '+880 1234-567805',
    research: ['Quantum Physics', 'Particle Physics', 'Theoretical Mechanics'],
  },
  {
    id: '6',
    name: 'Prof. Farhana Akter',
    designation: 'Associate Professor',
    department: 'Business',
    qualification: 'MBA IBA',
    bio: 'Marketing strategist with 12 years of experience consulting for multinational brands across Asia.',
    fullBio: 'Prof. Farhana Akter is a marketing strategist with 12 years of experience consulting for multinational brands across Asia. She has led branding campaigns for top companies and brings real-world marketing expertise to the classroom. She is a regular speaker at international marketing conferences and serves on the advisory board of several startups.',
    email: 'farhana.akter@greenfield.edu',
    phone: '+880 1234-567806',
    research: ['Digital Marketing', 'Brand Management', 'Consumer Behavior'],
  },
  {
    id: '7',
    name: 'Dr. Tanvir Ahmed',
    designation: 'Assistant Professor',
    department: 'Science',
    qualification: 'PhD JU',
    bio: 'Mathematician focused on applied mathematics, cryptography, and data-driven mathematical modeling.',
    fullBio: 'Dr. Tanvir Ahmed is a mathematician focused on applied mathematics, cryptography, and data-driven mathematical modeling. He completed his PhD at Jahangirnagar University with a dissertation on number theory applications in cybersecurity. He has published 20+ research papers and actively collaborates with the Computer Science department on interdisciplinary research projects.',
    email: 'tanvir.ahmed@greenfield.edu',
    phone: '+880 1234-567807',
    research: ['Applied Mathematics', 'Cryptography', 'Number Theory'],
  },
  {
    id: '8',
    name: 'Prof. Rifat Sultana',
    designation: 'Lecturer',
    department: 'Computer Science',
    qualification: 'MSc Stanford',
    bio: 'Young researcher in human-computer interaction and UX design with industry experience at top tech firms.',
    fullBio: 'Prof. Rifat Sultana is a young and dynamic researcher in human-computer interaction and UX design. She completed her MSc at Stanford University with a focus on accessible computing. Before joining Greenfield, she worked at Apple and Facebook on accessibility features. She is passionate about inclusive design and mentors students in UI/UX research projects.',
    email: 'rifat.sultana@greenfield.edu',
    phone: '+880 1234-567808',
    research: ['Human-Computer Interaction', 'UX Design', 'Accessible Computing'],
  },
];

const departments = ['All', 'Computer Science', 'Business', 'Engineering', 'Arts', 'Science'];

const departmentColors: Record<string, string> = {
  'Computer Science': 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400',
  'Business': 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  'Engineering': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'Arts': 'bg-fuchsia-100 text-fuchsia-700 dark:bg-fuchsia-900/30 dark:text-fuchsia-400',
  'Science': 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400',
};

const placeholderGradients = [
  'from-sky-400 to-indigo-500',
  'from-amber-400 to-orange-500',
  'from-emerald-400 to-teal-500',
  'from-fuchsia-400 to-pink-500',
  'from-violet-400 to-purple-500',
  'from-rose-400 to-red-500',
  'from-cyan-400 to-sky-500',
  'from-lime-400 to-green-500',
];

export default function FacultyPage() {
  const [activeDept, setActiveDept] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(null);

  const filteredFaculty = useMemo(() => {
    return allFaculty.filter((f) => {
      const matchesDept = activeDept === 'All' || f.department === activeDept;
      const matchesSearch = searchQuery === '' ||
        f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        f.designation.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesDept && matchesSearch;
    });
  }, [activeDept, searchQuery]);

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
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/5 blur-3xl" />
          </div>
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
            >
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 mb-4">
                <GraduationCap className="w-3.5 h-3.5 mr-1.5" />
                Academic Excellence
              </Badge>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white">
                Our Faculty
              </h1>
              <p className="mt-4 text-lg text-primary-foreground/80 max-w-2xl mx-auto">
                Meet our distinguished faculty members who are leaders in their fields and dedicated to mentoring the next generation.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Faculty Listing */}
        <section className="py-16 lg:py-24 bg-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Search & Filters */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-10 space-y-6"
            >
              {/* Search Bar */}
              <div className="relative max-w-md mx-auto">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, department, or designation..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Department Filter */}
              <div className="flex flex-wrap justify-center gap-2">
                {departments.map((dept) => (
                  <Button
                    key={dept}
                    variant={activeDept === dept ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setActiveDept(dept)}
                    className="rounded-full px-4"
                  >
                    {dept}
                  </Button>
                ))}
              </div>

              {/* Results Count */}
              <p className="text-sm text-muted-foreground text-center">
                Showing <strong className="text-foreground">{filteredFaculty.length}</strong> faculty member{filteredFaculty.length !== 1 ? 's' : ''}
                {activeDept !== 'All' && <span> in <strong className="text-foreground">{activeDept}</strong></span>}
              </p>
            </motion.div>

            {/* Faculty Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredFaculty.map((member, idx) => (
                <motion.div
                  key={member.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.08 }}
                >
                  <Card className="card-hover overflow-hidden border-border/50 h-full flex flex-col">
                    {/* Photo Area */}
                    <div className="relative h-56 bg-gradient-to-br from-primary/5 to-primary/10 overflow-hidden">
                      {member.img ? (
                        <img
                          src={member.img}
                          alt={member.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className={`w-full h-full bg-gradient-to-br ${placeholderGradients[idx % placeholderGradients.length]} flex items-center justify-center`}>
                          <span className="text-4xl font-bold text-white/90">
                            {member.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
                          </span>
                        </div>
                      )}
                      <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-black/60 to-transparent" />
                      <Badge className={`absolute bottom-3 left-3 ${departmentColors[member.department] || 'bg-gray-100 text-gray-700'}`}>
                        {member.department}
                      </Badge>
                    </div>

                    {/* Card Content */}
                    <CardContent className="p-5 flex-1 flex flex-col">
                      <h3 className="font-bold text-lg text-foreground">
                        {member.name}
                      </h3>
                      <p className="text-sm text-primary font-medium mt-0.5">{member.designation}</p>
                      <p className="text-xs text-muted-foreground mt-1">{member.qualification}</p>
                      <p className="text-sm text-muted-foreground mt-3 line-clamp-2 flex-1">{member.bio}</p>
                      <Button
                        variant="outline"
                        size="sm"
                        className="mt-4 w-full gap-2"
                        onClick={() => setSelectedFaculty(member)}
                      >
                        View Profile
                        <Globe className="w-3.5 h-3.5" />
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Empty State */}
            {filteredFaculty.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-20"
              >
                <GraduationCap className="w-16 h-16 text-muted-foreground/40 mx-auto mb-4" />
                <h3 className="text-xl font-bold">No faculty found</h3>
                <p className="text-muted-foreground mt-2">Try adjusting your search or department filter</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => { setActiveDept('All'); setSearchQuery(''); }}
                >
                  Clear Filters
                </Button>
              </motion.div>
            )}
          </div>
        </section>
      </main>

      {/* Faculty Profile Dialog */}
      <Dialog open={!!selectedFaculty} onOpenChange={() => setSelectedFaculty(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedFaculty && (
            <>
              <DialogHeader>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 rounded-full overflow-hidden flex-shrink-0 bg-gradient-to-br from-primary/10 to-primary/5 border-2 border-primary/20">
                    {selectedFaculty.img ? (
                      <img src={selectedFaculty.img} alt={selectedFaculty.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className={`w-full h-full bg-gradient-to-br ${placeholderGradients[parseInt(selectedFaculty.id) % placeholderGradients.length]} flex items-center justify-center`}>
                        <span className="text-2xl font-bold text-white">
                          {selectedFaculty.name.split(' ').filter(Boolean).map(n => n[0]).join('').slice(0, 2)}
                        </span>
                      </div>
                    )}
                  </div>
                  <div>
                    <DialogTitle className="text-xl">{selectedFaculty.name}</DialogTitle>
                    <DialogDescription className="text-primary font-medium mt-1">
                      {selectedFaculty.designation}
                    </DialogDescription>
                    <Badge className={`mt-2 ${departmentColors[selectedFaculty.department] || 'bg-gray-100 text-gray-700'}`}>
                      {selectedFaculty.department}
                    </Badge>
                  </div>
                </div>
              </DialogHeader>

              <div className="space-y-6 mt-2">
                {/* Bio */}
                <div>
                  <h4 className="font-semibold mb-2 flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-primary" /> About
                  </h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedFaculty.fullBio || selectedFaculty.bio}
                  </p>
                </div>

                {/* Qualification & Research */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" /> Qualification
                    </p>
                    <p className="text-sm font-semibold">{selectedFaculty.qualification}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50">
                    <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1.5">
                      <GraduationCap className="w-3.5 h-3.5" /> Department
                    </p>
                    <p className="text-sm font-semibold">{selectedFaculty.department}</p>
                  </div>
                </div>

                {/* Research Interests */}
                {selectedFaculty.research && selectedFaculty.research.length > 0 && (
                  <div>
                    <h4 className="font-semibold mb-2">Research Interests</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedFaculty.research.map((r) => (
                        <Badge key={r} variant="secondary">{r}</Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Contact Info */}
                <div className="pt-4 border-t space-y-3">
                  <h4 className="font-semibold">Contact Information</h4>
                  {selectedFaculty.email && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Mail className="w-4 h-4 text-primary" />
                      </div>
                      <span>{selectedFaculty.email}</span>
                    </div>
                  )}
                  {selectedFaculty.phone && (
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Phone className="w-4 h-4 text-primary" />
                      </div>
                      <span>{selectedFaculty.phone}</span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
}
