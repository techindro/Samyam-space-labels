import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Calendar, User, ArrowRight } from "lucide-react";

const ResearchBlog = () => {
  const { data: posts, isLoading } = useQuery({
    queryKey: ["research-blog"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_blog_posts")
        .select("*")
        .order("published_at", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative py-20 overflow-hidden">
        <ParallelWebBg />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>Research</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Research Blog</h1>
            <p className="text-muted-foreground text-lg mb-12">Insights and deep dives from our research team.</p>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-64 rounded-xl bg-secondary/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {posts?.map((post) => (
                  <article key={post.id} className="group glass-card rounded-xl overflow-hidden hover:border-cosmic-purple/40 transition-all">
                    {post.cover_image_url && (
                      <div className="h-40 bg-secondary/30 overflow-hidden">
                        <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="p-6">
                      <h2 className="text-lg font-display font-semibold text-foreground mb-2">{post.title}</h2>
                      {post.excerpt && <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{post.excerpt}</p>}
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          {post.author && (
                            <span className="flex items-center gap-1"><User className="h-3 w-3" />{post.author}</span>
                          )}
                          {post.published_at && (
                            <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{new Date(post.published_at).toLocaleDateString()}</span>
                          )}
                        </div>
                        <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </article>
                ))}
                {posts?.length === 0 && (
                  <p className="col-span-2 text-center text-muted-foreground py-12">No blog posts published yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResearchBlog;
