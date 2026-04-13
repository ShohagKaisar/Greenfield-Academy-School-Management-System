"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { motion } from "framer-motion";
import { Calendar, User, ChevronRight, Share2, Facebook, Twitter, Linkedin, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

const blogData: Record<string, { title: string; category: string; date: string; author: string; content: string[]; color: string }> = {
  "top-10-university-ranking": {
    title: "Greenfield Academy Ranks Among Top 10 National Universities",
    category: "News", date: "Mar 15, 2025", author: "Media Relations",
    color: "from-blue-500 to-cyan-500",
    content: [
      "We are thrilled to announce that Greenfield Academy has been officially ranked among the top 10 national universities in the prestigious 2025 Higher Education Quality Assessment conducted by the National Accreditation Council. This remarkable achievement reflects years of dedicated effort by our faculty, students, and administration in pursuing academic excellence and institutional development.",
      "The assessment evaluated universities across multiple dimensions including teaching quality, research output, student satisfaction, industry linkages, international collaborations, and campus infrastructure. Greenfield Academy scored particularly high in research output and student satisfaction, with our Computer Science and Engineering department receiving special recognition for its innovative curriculum and industry partnerships.",
      "Our Vice-Chancellor, Professor Dr. Ahmed Khan, expressed his gratitude to the entire Greenfield community: 'This ranking is a testament to the hard work and dedication of every member of our institution. It reflects our commitment to providing world-class education and fostering an environment of research and innovation. We will continue to strive for even greater heights in the years to come.'",
      "The ranking is expected to enhance our international visibility and attract talented students and faculty from across the country and beyond. Several new international partnership agreements are already in discussion as a result of this recognition, which will further enrich our academic programs and research opportunities.",
    ],
  },
  "ai-research-center": {
    title: "New AI Research Center Inauguration",
    category: "Research", date: "Feb 28, 2025", author: "Research Division",
    color: "from-purple-500 to-violet-500",
    content: [
      "Greenfield Academy has officially inaugurated its state-of-the-art Artificial Intelligence Research Center (AIRC), marking a significant milestone in our journey towards becoming a leading hub for technology research and innovation. The center, built with an investment of ৳50 million, houses advanced computing infrastructure including GPU clusters, robotics labs, and dedicated spaces for machine learning research.",
      "The AIRC will focus on five key research areas: Natural Language Processing, Computer Vision, Healthcare AI, Autonomous Systems, and AI Ethics. Each research group will be led by internationally recognized researchers and will collaborate with industry partners to ensure that research outcomes translate into real-world applications.",
      "At the inauguration ceremony, the Chief Guest, a renowned AI researcher from MIT, praised the initiative: 'Greenfield Academy's AI Research Center has the potential to become a regional powerhouse for AI research. The facilities are truly world-class, and I am impressed by the vision and commitment of the institution.'",
      "Students and faculty members will have access to the center's resources through a competitive application process. The center also plans to host regular workshops, seminars, and hackathons to foster a culture of innovation and collaboration among the academic community.",
    ],
  },
  "student-startup-award": {
    title: "Student Startup Wins National Innovation Award",
    category: "Achievement", date: "Feb 10, 2025", author: "Student Affairs",
    color: "from-emerald-500 to-teal-500",
    content: [
      "A team of four Greenfield Academy students has won the prestigious National Innovation Award 2025 for their groundbreaking startup 'AgriTech Solutions,' which leverages machine learning and satellite imagery to help farmers optimize crop yields and reduce waste. The team, comprising students from the Computer Science and Business Administration departments, developed the platform as part of their final year project.",
      "The startup has already been piloted in 50 villages across three districts, helping over 500 farmers increase their crop yields by an average of 25% while reducing water usage by 30%. The National Innovation Award jury praised the project for its practical impact and scalability, noting that it addresses a critical challenge in Bangladesh's agricultural sector.",
      "Team leader Fahim Ahmed, a final year CSE student, said: 'We are incredibly grateful for the support and mentorship we received from our professors and the university's entrepreneurship incubator. This award validates our belief that technology can be a powerful force for positive change in society.'",
      "Greenfield Academy's Entrepreneurship Development Cell has been instrumental in nurturing student startups, providing mentorship, funding, and networking opportunities. The university plans to expand the program significantly in the coming year to support even more student-led ventures.",
    ],
  },
  "sports-week-2025": {
    title: "Annual Sports Week 2025: A Grand Celebration",
    category: "Events", date: "Jan 25, 2025", author: "Sports Committee",
    color: "from-orange-500 to-amber-500",
    content: [
      "The Annual Sports Week 2025 at Greenfield Academy concluded with a spectacular closing ceremony, marking the end of a week filled with thrilling competitions, team spirit, and unforgettable moments. Over 2,000 students from all departments participated in more than 30 different sporting events, making it the largest sports gathering in the university's history.",
      "Highlights of the week included the inter-department cricket tournament, which saw the Computer Science department clinch the title in a nail-biting final against Business Administration. The athletics competition featured several record-breaking performances, with first-year student Karim Hossain setting a new university record in the 100-meter sprint. The basketball tournament and swimming championships also drew large crowds and showcased exceptional talent.",
      "The Sports Week also featured several fun events including a tug-of-war competition, relay races, and a friendly match between students and faculty. The closing ceremony included an award distribution for outstanding athletes and teams, followed by a cultural program featuring music and dance performances by students.",
      "The Vice-Chancellor emphasized the importance of sports in holistic education: 'Sports teach us discipline, teamwork, and resilience — qualities that are essential for success in all aspects of life. I congratulate all participants and winners, and I look forward to seeing even greater achievements in the years to come.'",
    ],
  },
};

const relatedPosts = [
  { slug: "ai-research-center", title: "New AI Research Center Inauguration", category: "Research", date: "Feb 28, 2025" },
  { slug: "student-startup-award", title: "Student Startup Wins National Innovation Award", category: "Achievement", date: "Feb 10, 2025" },
  { slug: "sports-week-2025", title: "Annual Sports Week 2025", category: "Events", date: "Jan 25, 2025" },
];

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  const post = blogData[slug] || blogData["top-10-university-ranking"];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className={`relative py-24 lg:py-32 bg-gradient-to-br ${post.color}`}>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Link href="/blog" className="text-white/60 hover:text-white text-sm mb-4 inline-flex items-center gap-1"><ChevronRight className="w-4 h-4 rotate-180" /> Back to Blog</Link>
              <Badge className="bg-white/20 text-white border-white/30 mb-4">{post.category}</Badge>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6">{post.title}</h1>
              <div className="flex items-center justify-center gap-4 text-white/70 text-sm">
                <span className="flex items-center gap-1.5"><Calendar className="w-4 h-4" />{post.date}</span>
                <span className="flex items-center gap-1.5"><User className="w-4 h-4" />{post.author}</span>
              </div>
            </motion.div>
          </div>
        </section>

        <section className="py-12 lg:py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.article initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
              <div className="prose prose-lg max-w-none mb-12">
                {post.content.map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed mb-6 text-base">{paragraph}</p>
                ))}
              </div>

              <Separator className="my-8" />

              <div className="mb-12">
                <h3 className="font-semibold mb-3 flex items-center gap-2"><Share2 className="w-4 h-4" />Share this article</h3>
                <div className="flex gap-3">
                  {[Facebook, Twitter, Linkedin].map((Icon, i) => (
                    <button key={i} className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center hover:bg-primary hover:text-primary-foreground transition-colors">
                      <Icon className="w-4 h-4" />
                    </button>
                  ))}
                </div>
              </div>

              <Separator className="my-8" />

              <div>
                <h3 className="text-xl font-bold mb-6">Related Posts</h3>
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedPosts.map((rp) => (
                    <Link key={rp.slug} href={`/blog/${rp.slug}`}>
                      <Card className="card-hover p-4 h-full border-border/50">
                        <CardContent className="p-0">
                          <Badge variant="secondary" className="mb-2 text-xs">{rp.category}</Badge>
                          <h4 className="text-sm font-semibold leading-snug mb-1">{rp.title}</h4>
                          <p className="text-xs text-muted-foreground">{rp.date}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.article>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
