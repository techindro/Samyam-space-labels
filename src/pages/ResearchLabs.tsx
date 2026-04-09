import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { FlaskConical, Users, Microscope } from "lucide-react";

const ResearchLabs = () => {
  const { data: labs, isLoading } = useQuery({
    queryKey: ["research-labs"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_labs")
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
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>Research</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 flex items-center gap-3">
              <FlaskConical className="h-10 w-10 text-cosmic-purple" /> Labs
            </h1>
            <p className="text-muted-foreground text-lg mb-12">Our research labs pushing the boundaries of AI.</p>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-xl bg-secondary/50 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {labs?.map((lab) => (
                  <div key={lab.id} className="glass-card rounded-xl p-8 hover:border-cosmic-purple/40 transition-all">
                    <div className="flex items-center gap-3 mb-4">
                      <Microscope className="h-6 w-6 text-cosmic-purple" />
                      <h3 className="text-xl font-display font-semibold text-foreground">{lab.name}</h3>
                    </div>
                    {lab.description && <p className="text-muted-foreground text-sm mb-4">{lab.description}</p>}
                    <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                      {lab.focus_area && (
                        <span className="px-3 py-1 rounded-full bg-secondary text-muted-foreground">{lab.focus_area}</span>
                      )}
                      {lab.lead_researcher && (
                        <span className="flex items-center gap-1"><Users className="h-3 w-3" />{lab.lead_researcher}</span>
                      )}
                    </div>
                  </div>
                ))}
                {labs?.length === 0 && (
                  <p className="col-span-2 text-center text-muted-foreground py-12">No labs listed yet.</p>
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

export default ResearchLabs;
