import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
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
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative py-20 overflow-hidden">
        <ParallelWebBg />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-teal/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>Research</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 flex items-center gap-3">
              <Briefcase className="h-10 w-10 text-cosmic-purple" /> Research Careers
            </h1>
            <p className="text-muted-foreground text-lg mb-12">Join our team and shape the future of AI.</p>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => <div key={i} className="h-32 rounded-xl bg-secondary/50 animate-pulse" />)}
              </div>
            ) : (
              <div className="space-y-4">
                {careers?.map((career) => (
                  <div key={career.id} className="glass-card rounded-xl p-6 hover:border-cosmic-teal/40 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-display font-semibold text-foreground mb-2">{career.title}</h3>
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-3">
                          {career.department && <span className="px-2 py-0.5 rounded-full bg-secondary text-muted-foreground">{career.department}</span>}
                          {career.location && <span className="flex items-center gap-1"><MapPin className="h-3 w-3" />{career.location}</span>}
                          {career.type && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{career.type}</span>}
                        </div>
                        {career.description && <p className="text-muted-foreground text-sm mb-3">{career.description}</p>}
                        {career.requirements && career.requirements.length > 0 && (
                          <div className="flex flex-wrap gap-2">
                            {career.requirements.map((req: string, i: number) => (
                              <span key={i} className="text-xs px-2 py-0.5 rounded bg-secondary text-muted-foreground">{req}</span>
                            ))}
                          </div>
                        )}
                      </div>
                      {career.apply_url && (
                        <Button size="sm" variant="outline" asChild className="shrink-0">
                          <a href={career.apply_url}>
                            Apply <ExternalLink className="h-3 w-3 ml-1" />
                          </a>
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
                {careers?.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">No open positions at the moment.</p>
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

export default ResearchCareers;
