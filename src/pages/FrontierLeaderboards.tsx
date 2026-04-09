import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Trophy, TrendingUp } from "lucide-react";

const FrontierLeaderboards = () => {
  const { data: entries, isLoading } = useQuery({
    queryKey: ["frontier-leaderboards"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("frontier_leaderboards")
        .select("*")
        .order("rank", { ascending: true });
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
          <div className="max-w-5xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>Research</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4 flex items-center gap-3">
              <Trophy className="h-10 w-10 text-cosmic-purple" /> Frontier Leaderboards
            </h1>
            <p className="text-muted-foreground text-lg mb-12">Benchmarking the world's most capable AI models.</p>

            {isLoading ? (
              <div className="h-96 rounded-xl bg-secondary/50 animate-pulse" />
            ) : (
              <div className="glass-card rounded-xl overflow-hidden">
                <table className="w-full">
                  <thead>
                    <tr className="bg-secondary/50 text-muted-foreground text-sm">
                      <th className="text-left px-6 py-4 font-medium">Rank</th>
                      <th className="text-left px-6 py-4 font-medium">Model</th>
                      <th className="text-left px-6 py-4 font-medium">Provider</th>
                      <th className="text-left px-6 py-4 font-medium">Benchmark</th>
                      <th className="text-right px-6 py-4 font-medium">Score</th>
                    </tr>
                  </thead>
                  <tbody>
                    {entries?.map((entry, i) => (
                      <tr key={entry.id} className={`border-t border-border/30 hover:bg-secondary/30 transition-colors ${i === 0 ? 'bg-cosmic-purple/5' : ''}`}>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${i === 0 ? 'bg-cosmic-purple/10 text-cosmic-purple' : i === 1 ? 'bg-secondary text-muted-foreground' : i === 2 ? 'bg-secondary text-muted-foreground' : 'text-muted-foreground/50'}`}>
                            {entry.rank}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-foreground font-medium">{entry.model_name}</td>
                        <td className="px-6 py-4 text-muted-foreground">{entry.provider}</td>
                        <td className="px-6 py-4 text-muted-foreground text-sm">{entry.benchmark}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="inline-flex items-center gap-1 text-green-600 font-mono font-semibold">
                            <TrendingUp className="h-3 w-3" />{Number(entry.score).toFixed(1)}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {entries?.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">No leaderboard entries yet.</p>
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

export default FrontierLeaderboards;
