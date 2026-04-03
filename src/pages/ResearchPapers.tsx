import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { FileText, Calendar, Tag, ExternalLink } from "lucide-react";

const ResearchPapers = () => {
  const { data: papers, isLoading } = useQuery({
    queryKey: ["research-papers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_papers")
        .select("*")
        .order("published_date", { ascending: false });
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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Research Papers</h1>
          <p className="text-white/60 text-lg mb-12">Explore our latest publications advancing the frontier of AI and data science.</p>

          {isLoading ? (
            <div className="space-y-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 rounded-xl bg-white/5 animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {papers?.map((paper) => (
                <article key={paper.id} className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h2 className="text-xl font-display font-semibold text-white mb-2">{paper.title}</h2>
                      {paper.abstract && <p className="text-white/60 text-sm mb-4 line-clamp-2">{paper.abstract}</p>}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-white/40">
                        {paper.authors && (
                          <span className="flex items-center gap-1">
                            <FileText className="h-3 w-3" />
                            {paper.authors.join(", ")}
                          </span>
                        )}
                        {paper.published_date && (
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(paper.published_date).toLocaleDateString()}
                          </span>
                        )}
                      </div>
                      {paper.tags && paper.tags.length > 0 && (
                        <div className="flex gap-2 mt-3">
                          {paper.tags.map((tag: string) => (
                            <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 text-white/60 text-xs">
                              <Tag className="h-2.5 w-2.5" />{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                    {paper.pdf_url && (
                      <a href={paper.pdf_url} className="shrink-0 p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white/70 transition-colors">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                </article>
              ))}
              {papers?.length === 0 && (
                <p className="text-center text-white/40 py-12">No research papers published yet.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResearchPapers;
