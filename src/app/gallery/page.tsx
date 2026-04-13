"use client";

import { useState } from "react";
import { Header } from "@/components/site/header";
import { Footer } from "@/components/site/footer";
import { motion } from "framer-motion";
import { X, Camera, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const categories = ["All", "Campus", "Events", "Sports", "Academic", "Cultural"];

const galleryItems = [
  { id: 1, title: "Main Campus Building", category: "Campus", src: "/hero-campus.png", span: "md:col-span-2 md:row-span-2" },
  { id: 2, title: "Modern Classrooms", category: "Academic", src: "/classroom.png", span: "" },
  { id: 3, title: "University Library", category: "Academic", src: "/library.png", span: "md:row-span-2" },
  { id: 4, title: "Science Laboratory", category: "Academic", src: "/science-lab.png", span: "" },
  { id: 5, title: "Students Celebration", category: "Events", src: "/students-celebrating.png", span: "md:col-span-2" },
  { id: 6, title: "Sports Complex", category: "Sports", src: null, color: "from-emerald-400 to-teal-600" },
  { id: 7, title: "Annual Cultural Program", category: "Cultural", src: null, color: "from-purple-400 to-pink-600" },
  { id: 8, title: "Graduation Ceremony", category: "Events", src: null, color: "from-blue-400 to-indigo-600", span: "md:col-span-2" },
  { id: 9, title: "Cricket Tournament", category: "Sports", src: null, color: "from-orange-400 to-red-600" },
  { id: 10, title: "Science Fair Projects", category: "Academic", src: null, color: "from-cyan-400 to-blue-600" },
  { id: 11, title: "Campus Garden", category: "Campus", src: null, color: "from-green-400 to-emerald-600" },
  { id: 12, title: "Art Exhibition", category: "Cultural", src: null, color: "from-rose-400 to-pink-600", span: "md:row-span-2" },
  { id: 13, title: "Computer Lab", category: "Academic", src: null, color: "from-violet-400 to-purple-600" },
  { id: 14, title: "Basketball Court", category: "Sports", src: null, color: "from-amber-400 to-orange-600" },
  { id: 15, title: "Campus View", category: "Campus", src: null, color: "from-sky-400 to-blue-600", span: "md:col-span-2" },
  { id: 16, title: "Music Concert", category: "Cultural", src: null, color: "from-fuchsia-400 to-purple-600" },
];

export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedItem, setSelectedItem] = useState<typeof galleryItems[0] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const filtered = galleryItems.filter(item => activeCategory === "All" || item.category === activeCategory);

  const openLightbox = (item: typeof galleryItems[0]) => {
    setSelectedItem(item);
    setSelectedIndex(filtered.indexOf(item));
  };

  const navigate = (dir: number) => {
    const newIdx = selectedIndex + dir;
    if (newIdx >= 0 && newIdx < filtered.length) {
      setSelectedIndex(newIdx);
      setSelectedItem(filtered[newIdx]);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <section className="relative py-24 lg:py-32 bg-gradient-to-br from-primary via-primary/90 to-primary/70">
          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
              <Badge className="bg-primary-foreground/20 text-primary-foreground border-primary-foreground/30 mb-4">Gallery</Badge>
              <h1 className="text-4xl sm:text-5xl font-bold text-primary-foreground mb-4">Photo Gallery</h1>
              <p className="text-primary-foreground/80 text-lg max-w-2xl mx-auto">Explore life at Greenfield Academy through our lens</p>
            </motion.div>
          </div>
        </section>

        <section className="py-16 lg:py-24">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-2 flex-wrap justify-center mb-10">
              {categories.map((cat) => (
                <Button key={cat} variant={activeCategory === cat ? "default" : "outline"} size="sm" onClick={() => setActiveCategory(cat)}>
                  {cat}
                </Button>
              ))}
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-[180px] md:auto-rows-[200px]">
              {filtered.map((item, i) => (
                <motion.div
                  key={item.id}
                  className={`relative group rounded-xl overflow-hidden cursor-pointer ${item.span || ""}`}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: i * 0.03 }}
                  onClick={() => openLightbox(item)}
                >
                  {item.src ? (
                    <img src={item.src} alt={item.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                  ) : (
                    <div className={`w-full h-full bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                      <Camera className="w-12 h-12 text-white/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-3 left-3 right-3">
                      <p className="text-white font-medium text-sm">{item.title}</p>
                      <Badge variant="secondary" className="text-[10px] mt-1 bg-white/20 text-white border-0">{item.category}</Badge>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Dialog open={!!selectedItem} onOpenChange={() => setSelectedItem(null)}>
        <DialogContent className="max-w-4xl p-0 overflow-hidden bg-black/95 border-white/10">
          <div className="relative">
            {selectedItem?.src ? (
              <img src={selectedItem.src} alt={selectedItem.title} className="w-full max-h-[70vh] object-contain" />
            ) : selectedItem?.color ? (
              <div className={`w-full h-[70vh] bg-gradient-to-br ${selectedItem.color} flex items-center justify-center`}>
                <Camera className="w-24 h-24 text-white/30" />
              </div>
            ) : null}
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
              <h3 className="text-white text-xl font-semibold">{selectedItem?.title}</h3>
              <p className="text-white/60 text-sm">{selectedItem?.category}</p>
            </div>
            <button onClick={() => setSelectedItem(null)} className="absolute top-4 right-4 w-8 h-8 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
              <X className="w-4 h-4" />
            </button>
            <button onClick={() => navigate(-1)} className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => navigate(1)} className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/50 flex items-center justify-center text-white hover:bg-black/70 transition-colors">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </DialogContent>
      </Dialog>
      <Footer />
    </div>
  );
}
