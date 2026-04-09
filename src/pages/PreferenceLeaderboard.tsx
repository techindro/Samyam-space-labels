import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Users, TrendingUp, TrendingDown } from "lucide-react";

const PreferenceLeaderboard = () => {
  const { data: entries, isLoading } = useQuery({
    queryKey: ["preference-leaderboard"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("preference_leaderboards")
        .select("*")
        .order("elo_score", { ascending: false });
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
              <Users className="h-10 w-10 text-cosmic-purple" /> Preference Leaderboard
            </h1>
            <p className="text-muted-foreground text-lg mb-12">Human preference rankings based on pairwise comparisons.</p>

            {isLoading ? (
              <div className="h-96 rounded-xl bg-secondary/50 animate-pulse" />
            ) : (
              <div className="grid gap-4">
                {entries?.map((entry, i) => (
                  <div key={entry.id} className={`glass-card rounded-xl p-6 hover:border-cosmic-purple/40 transition-all ${i === 0 ? 'border-cosmic-purple/30' : ''}`}>
                    <div className="flex items-center justify-between flex-wrap gap-4">
                      <div className="flex items-center gap-4">
                        <span className={`text-2xl font-bold font-mono ${i === 0 ? 'text-cosmic-purple' : 'text-muted-foreground/50'}`}>#{i + 1}</span>
                        <div>
                          <h3 className="text-lg font-display font-semibold text-foreground">{entry.model_name}</h3>
                          <p className="text-muted-foreground text-sm">{entry.provider}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-8 text-sm">
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs mb-1">ELO</p>
                          <p className="text-foreground font-mono font-bold text-lg">{Number(entry.elo_score).toFixed(0)}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs mb-1">Wins</p>
                          <p className="text-green-600 font-mono flex items-center gap-1"><TrendingUp className="h-3 w-3" />{entry.wins}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs mb-1">Losses</p>
                          <p className="text-red-600 font-mono flex items-center gap-1"><TrendingDown className="h-3 w-3" />{entry.losses}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-muted-foreground text-xs mb-1">Comparisons</p>
                          <p className="text-muted-foreground font-mono">{entry.total_comparisons}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                {entries?.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">No preference data yet.</p>
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

export default PreferenceLeaderboard;
