import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Briefcase, MapPin, Clock, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

const ResearchCareers = () => {
  const { data: careers, isLoading } = useQuery({
    queryKey: ["research-careers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_careers")
        .select("*")
        .order("created_at", { ascending: false });
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
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 flex items-center gap-3">
            <Briefcase className="h-10 w-10 text-blue-400" /> Research Careers
          </h1>
          <p className="text-white/60 text-lg mb-12">Join our team and shape the future of AI.</p>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-xl bg-white/5 animate-pulse" />)}
            </div>
          ) : (
            <div className="space-y-4">
              {careers?.map((career) => (
                <div key={career.id} className="rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-display font-semibold text-white mb-2">{career.title}</h3>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-white/40 mb-3">
                        {career.department && <span className="px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400">{career.department}</span>}
                        {career.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{career.location}</span>}
                        {career.type && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{career.type}</span>}
                      </div>
                      {career.description && <p className="text-white/50 text-sm mb-3">{career.description}</p>}
                      {career.requirements && career.requirements.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {career.requirements.map((req: string, i: number) => (
                            <span key={i} className="text-xs px-2 py-0.5 rounded bg-white/5 text-white/40">{req}</span>
                          ))}
                        </div>
                      )}
                    </div>
                    {career.apply_url && (
                      <Button size="sm" variant="outline" asChild className="border-white/20 text-white hover:bg-white/10 shrink-0">
                        <a href={career.apply_url}>
                          Apply <ExternalLink className="h-3 w-3 ml-1" />
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {careers?.length === 0 && (
                <p className="text-center text-white/40 py-12">No open positions at the moment.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResearchCareers;
