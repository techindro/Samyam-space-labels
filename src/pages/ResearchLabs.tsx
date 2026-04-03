import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen bg-foreground">
      <Navbar variant="dark" />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-white/50 mb-4">Research</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 flex items-center gap-3">
            <FlaskConical className="h-10 w-10 text-emerald-400" /> Labs
          </h1>
          <p className="text-white/60 text-lg mb-12">Our research labs pushing the boundaries of AI.</p>

          {isLoading ? (
            <div className="grid md:grid-cols-2 gap-6">
              {[1, 2, 3].map((i) => <div key={i} className="h-48 rounded-xl bg-white/5 animate-pulse" />)}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {labs?.map((lab) => (
                <div key={lab.id} className="rounded-xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-colors">
                  <div className="flex items-center gap-3 mb-4">
                    <Microscope className="h-6 w-6 text-emerald-400" />
                    <h3 className="text-xl font-display font-semibold text-white">{lab.name}</h3>
                  </div>
                  {lab.description && <p className="text-white/60 text-sm mb-4">{lab.description}</p>}
                  <div className="flex flex-wrap gap-4 text-xs text-white/40">
                    {lab.focus_area && (
                      <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400">{lab.focus_area}</span>
                    )}
                    {lab.lead_researcher && (
                      <span className="flex items-center gap-1"><Users className="h-3 w-3" />{lab.lead_researcher}</span>
                    )}
                  </div>
                </div>
              ))}
              {labs?.length === 0 && (
                <p className="col-span-2 text-center text-white/40 py-12">No labs listed yet.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResearchLabs;
