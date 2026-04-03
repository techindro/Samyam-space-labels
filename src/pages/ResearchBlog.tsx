import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen bg-foreground">
      <Navbar variant="dark" />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-white/50 mb-4">Research</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Research Blog</h1>
          <p className="text-white/60 text-lg mb-12">Insights and deep dives from our research team.</p>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {posts?.map((post) => (
                <article key={post.id} className="group rounded-xl border border-white/10 bg-white/5 overflow-hidden hover:bg-white/10 transition-colors">
                  {post.cover_image_url && (
                    <div className="h-40 bg-white/5 overflow-hidden">
                      <img src={post.cover_image_url} alt={post.title} className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="p-6">
                    <h2 className="text-lg font-display font-semibold text-white mb-2 group-hover:text-white/90">{post.title}</h2>
                    {post.excerpt && <p className="text-white/50 text-sm mb-4 line-clamp-2">{post.excerpt}</p>}
                    <div className="flex items-center justify-between text-xs text-white/40">
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
                <p className="col-span-2 text-center text-white/40 py-12">No blog posts published yet.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResearchBlog;
