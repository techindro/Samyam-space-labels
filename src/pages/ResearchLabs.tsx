import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { FlaskConical, Users, Microscope } from "lucide-react";

const FALLBACK_LABS = [
  {
    id: "fl-1",
    name: "Orbital Vision & Multispectral Lab",
    focus_area: "Satellite Perception & SAR Analysis",
    lead_researcher: "Dr. Kavita Nair",
    description: "Specialized in sub-meter object detection, terrain classification, and polarimetric SAR image decomposition for defense and climate monitoring.",
  },
  {
    id: "fl-2",
    name: "Edge Perception & Autonomous Spacecraft Lab",
    focus_area: "Onboard Micro-Inference",
    lead_researcher: "Shubham Patel",
    description: "Developing ultra-lightweight neural architectures for real-time optical and sensor telemetry processing on solar-powered CubeSat hardware.",
  },
  {
    id: "fl-3",
    name: "Sovereign Intelligence & Security Lab",
    focus_area: "Audit-Grade Data Pipelines",
    lead_researcher: "Ananya Rao",
    description: "Pioneering privacy-preserving synthetic data generation, automated RLHF feedback loops, and ITAR-compliant dataset curation for national space assets.",
  },
];

const ResearchLabs = () => {
  const { data: rawLabs, isLoading } = useQuery({
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

  const labs = (rawLabs && rawLabs.length > 0) ? rawLabs : FALLBACK_LABS;

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
              <FlaskConical className="h-10 w-10 text-cosmic-purple" /> Research Labs
            </h1>
            <p className="text-muted-foreground text-lg mb-12">Our specialized research units pushing the boundaries of space AI.</p>

            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-xl bg-secondary/50 animate-pulse" />)}
              </div>
            ) : (
              <div className="grid md:grid-cols-2 gap-6">
                {labs.map((lab) => (
                  <div key={lab.id} className="glass-card rounded-xl p-8 hover:border-cosmic-purple/40 transition-all flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2.5 rounded-xl bg-secondary">
                          <Microscope className="h-5 w-5 text-cosmic-purple" />
                        </div>
                        <h3 className="text-xl font-display font-semibold text-foreground">{lab.name}</h3>
                      </div>
                      {lab.description && <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{lab.description}</p>}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs pt-4 border-t border-border/30">
                      {lab.focus_area && (
                        <span className="px-3 py-1 rounded-full bg-secondary font-medium text-foreground/80">{lab.focus_area}</span>
                      )}
                      {lab.lead_researcher && (
                        <span className="flex items-center gap-1.5 text-muted-foreground font-medium ml-auto"><Users className="h-3.5 w-3.5" />{lab.lead_researcher}</span>
                      )}
                    </div>
                  </div>
                ))}
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
