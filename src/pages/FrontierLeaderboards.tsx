import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
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
    <div className="min-h-screen bg-foreground">
      <Navbar variant="dark" />
      <main className="container mx-auto px-4 py-20">
        <div className="max-w-5xl mx-auto">
          <p className="text-sm uppercase tracking-widest text-white/50 mb-4">Research</p>
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4 flex items-center gap-3">
            <Trophy className="h-10 w-10 text-yellow-400" /> Frontier Leaderboards
          </h1>
          <p className="text-white/60 text-lg mb-12">Benchmarking the world's most capable AI models.</p>

          {isLoading ? (
            <div className="h-96 rounded-xl bg-white/5 animate-pulse" />
          ) : (
            <div className="rounded-xl border border-white/10 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-white/5 text-white/60 text-sm">
                    <th className="text-left px-6 py-4 font-medium">Rank</th>
                    <th className="text-left px-6 py-4 font-medium">Model</th>
                    <th className="text-left px-6 py-4 font-medium">Provider</th>
                    <th className="text-left px-6 py-4 font-medium">Benchmark</th>
                    <th className="text-right px-6 py-4 font-medium">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {entries?.map((entry, i) => (
                    <tr key={entry.id} className={`border-t border-white/5 hover:bg-white/5 transition-colors ${i === 0 ? 'bg-yellow-500/5' : ''}`}>
                      <td className="px-6 py-4">
                        <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${i === 0 ? 'bg-yellow-500/20 text-yellow-400' : i === 1 ? 'bg-white/10 text-white/70' : i === 2 ? 'bg-orange-500/10 text-orange-400' : 'text-white/40'}`}>
                          {entry.rank}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-white font-medium">{entry.model_name}</td>
                      <td className="px-6 py-4 text-white/60">{entry.provider}</td>
                      <td className="px-6 py-4 text-white/50 text-sm">{entry.benchmark}</td>
                      <td className="px-6 py-4 text-right">
                        <span className="inline-flex items-center gap-1 text-green-400 font-mono font-semibold">
                          <TrendingUp className="h-3 w-3" />{Number(entry.score).toFixed(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {entries?.length === 0 && (
                <p className="text-center text-white/40 py-12">No leaderboard entries yet.</p>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default FrontierLeaderboards;
