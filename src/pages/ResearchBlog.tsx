import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Calendar, User, ArrowRight, BookOpen, Clock, FileText } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface BlogPost {
  id: string;
  title: string;
  excerpt?: string | null;
  content?: string | null;
  author?: string | null;
  published_at?: string | null;
  cover_image_url?: string | null;
  read_time?: string;
  paper_url?: string;
}

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: "fb-1",
    title: "Samyam-LM: Pre-training Foundation Models for High-Resolution Earth Observation & Multispectral Data",
    excerpt: "Exploring how masked autoencoders and multi-modal alignment allow zero-shot classification across 14 spectral bands in real-time.",
    author: "Dr. Kavita Nair",
    published_at: "2026-06-15T00:00:00Z",
    cover_image_url: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=70",
    read_time: "5 min read",
    paper_url: "/research/papers/samyamlm",
    content: `High-resolution Earth observation data contains vast spatial and spectral complexity that conventional vision models fail to capture. In this technical deep dive, we present the architecture behind Samyam-LM—a specialized foundation model pre-trained on multi-spectral satellite telemetry, radar backscatter, and spatial vectors.

By combining masked spatial autoencoders with contrastive text-spectral alignment, Samyam-LM achieves state-of-the-art zero-shot detection across 14 distinct spectral bands. This enables automated flood inundation analysis, crop phenology estimation, and urban infrastructure assessment without manual re-annotation.`,
  },
  {
    id: "fb-2",
    title: "Real-time Orbital Debris Tracking using Low-Latency Edge Perception on CubeSats",
    excerpt: "How onboard micro-neural networks process optical telemetry to predict collision risks in Low Earth Orbit within 50 milliseconds.",
    author: "Shubham Patel",
    published_at: "2026-05-20T00:00:00Z",
    cover_image_url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=70",
    read_time: "4 min read",
    content: `In dense Low Earth Orbit (LEO) megaconstellations, ground-based tracking alone cannot prevent catastrophic hypervelocity collisions. By embedding quantized edge computer vision models into satellite payload hardware, onboard cameras can detect and characterize centimeter-scale debris tracks in real time.

This article details how our micro-neural network calculates Kepler SGP4 vector drift and computes localized conjunction warnings in under 50 milliseconds, allowing autonomous avoidance maneuvers without round-trip ground station delays.`,
  },
  {
    id: "fb-3",
    title: "Sovereign AI for Defense: Structuring Unstructured Synthetic Aperture Radar (SAR) Telemetry",
    excerpt: "A technical breakdown of annotation standards for polarimetric SAR data in all-weather tactical intelligence operations.",
    author: "Michael Torres",
    published_at: "2026-04-10T00:00:00Z",
    cover_image_url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?auto=format&fit=crop&w=1200&q=70",
    read_time: "6 min read",
    content: `Unlike optical sensors, Synthetic Aperture Radar (SAR) pierces heavy monsoon clouds, fog, and nighttime conditions. However, polarimetric SAR backscatter (HH, HV, VH, VV) generates speckle noise and geometric distortions that confuse traditional object detectors.

Here, we outline Samyam's specialized sovereign annotation methodology for defense and tactical intelligence. We detail decomposition techniques like Pauli and Freeman-Durden decomposition to convert raw radar returns into structured, high-confidence training sets for sovereign security applications.`,
  },
];

const ResearchBlog = () => {
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);

  const { data: rawPosts, isLoading } = useQuery({
    queryKey: ["research-blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_blog_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data as BlogPost[];
    },
  });

  const posts = (rawPosts && rawPosts.length > 0) ? rawPosts : FALLBACK_POSTS;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative py-20 overflow-hidden">
        <ParallelWebBg />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>Research</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 flex items-center gap-3">
              <BookOpen className="h-10 w-10 text-cosmic-purple" /> Research Blog
            </h1>
            <p className="text-muted-foreground text-lg mb-12">Insights and deep dives from our research team.</p>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-xl bg-secondary/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    onClick={() => setSelectedPost(post)}
                    className="group glass-card rounded-xl overflow-hidden hover:border-cosmic-purple/40 transition-all cursor-pointer flex flex-col justify-between"
                  >
                    <div>
                      {post.cover_image_url && (
                        <div className="h-44 bg-secondary/30 overflow-hidden">
                          <img
                            src={post.cover_image_url}
                            alt={post.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        </div>
                      )}
                      <div className="p-6">
                        <h2 className="text-lg font-display font-semibold text-foreground mb-2 group-hover:text-cosmic-teal transition-colors">
                          {post.title}
                        </h2>
                        {post.excerpt && (
                          <p className="text-muted-foreground text-sm mb-4 line-clamp-2 leading-relaxed">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="px-6 pb-6 pt-0 flex items-center justify-between text-xs text-muted-foreground border-t border-border/20 mt-2">
                      <div className="flex items-center gap-3">
                        {post.author && (
                          <span className="flex items-center gap-1">
                            <User className="h-3 w-3" />
                            {post.author}
                          </span>
                        )}
                        {post.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(post.published_at).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      <span className="inline-flex items-center gap-1 text-cosmic-teal font-medium group-hover:translate-x-0.5 transition-transform">
                        Read <ArrowRight className="h-3 w-3 ml-0.5" />
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Article Detail Reading Dialog */}
      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
        {selectedPost && (
          <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto bg-background/95 backdrop-blur-xl border border-cosmic-purple/30">
            <DialogHeader>
              <div className="flex items-center gap-3 text-xs text-muted-foreground mb-2">
                {selectedPost.author && (
                  <span className="flex items-center gap-1">
                    <User className="h-3.5 w-3.5" />
                    {selectedPost.author}
                  </span>
                )}
                {selectedPost.published_at && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(selectedPost.published_at).toLocaleDateString()}
                  </span>
                )}
                {selectedPost.read_time && (
                  <span className="flex items-center gap-1">
                    <Clock className="h-3.5 w-3.5" />
                    {selectedPost.read_time}
                  </span>
                )}
              </div>
              <DialogTitle className="text-2xl font-display font-bold leading-snug">
                {selectedPost.title}
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground pt-1">
                {selectedPost.excerpt}
              </DialogDescription>
            </DialogHeader>

            {selectedPost.cover_image_url && (
              <div className="rounded-xl overflow-hidden my-3 max-h-60 border border-border/40">
                <img
                  src={selectedPost.cover_image_url}
                  alt={selectedPost.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            <div className="space-y-4 text-sm text-foreground/90 leading-relaxed py-2 whitespace-pre-line">
              {selectedPost.content || selectedPost.excerpt}
            </div>

            <div className="flex items-center justify-between border-t border-border/40 pt-4 mt-4">
              {selectedPost.paper_url ? (
                <Button asChild className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white">
                  <Link to={selectedPost.paper_url}>
                    <FileText className="h-4 w-4 mr-2" />
                    Read Full Research Paper
                  </Link>
                </Button>
              ) : (
                <div />
              )}
              <Button variant="outline" onClick={() => setSelectedPost(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        )}
      </Dialog>

      <Footer />
    </div>
  );
};

export default ResearchBlog;
