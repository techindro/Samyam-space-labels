import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen bg-foreground">
      <Navbar variant="dark" />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-white/50 mb-4">Research</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 flex items-center gap-3">
            <Users className="h-10 w-10 text-purple-400" /> Preference Leaderboard
          </h1>
          <p className="text-white/60 text-lg mb-12">Human preference rankings based on pairwise comparisons.</p>

          {isLoading ? (
            <div className="h-96 rounded-xl bg-white/5 animate-pulse" />
          ) : (
            <div className="grid gap-4">
              {entries?.map((entry, i) => (
                <div key={entry.id} className={`rounded-xl border border-white/10 bg-white/5 p-6 hover:bg-white/10 transition-colors ${i === 0 ? 'border-purple-500/30 bg-purple-500/5' : ''}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <span className={`text-2xl font-bold font-mono ${i === 0 ? 'text-purple-400' : 'text-white/30'}`}>#{i + 1}</span>
                      <div>
                        <h3 className="text-lg font-display font-semibold text-white">{entry.model_name}</h3>
                        <p className="text-white/50 text-sm">{entry.provider}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8 text-sm">
                      <div className="text-center">
                        <p className="text-white/40 text-xs mb-1">ELO</p>
                        <p className="text-white font-mono font-bold text-lg">{Number(entry.elo_score).toFixed(0)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/40 text-xs mb-1">Wins</p>
                        <p className="text-green-400 font-mono flex items-center gap-1"><TrendingUp className="h-3 w-3" />{entry.wins}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/40 text-xs mb-1">Losses</p>
                        <p className="text-red-400 font-mono flex items-center gap-1"><TrendingDown className="h-3 w-3" />{entry.losses}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-white/40 text-xs mb-1">Comparisons</p>
                        <p className="text-white/60 font-mono">{entry.total_comparisons}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              {entries?.length === 0 && (
                <p className="text-center text-white/40 py-12">No preference data yet.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PreferenceLeaderboard;
