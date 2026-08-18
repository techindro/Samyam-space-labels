import { useState } from "react";
import { Sparkles, Sliders, AlertTriangle, ArrowUpDown, CheckCircle2, Cpu, HelpCircle, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface TaskUncertaintyItem {
  id: string;
  name: string;
  modality: string;
  confidenceScore: number;
  uncertaintyScore: number;
  priorityLevel: "High" | "Medium" | "Low";
  status: "Unlabeled" | "In Review" | "Completed";
}

const DEMO_QUEUE: TaskUncertaintyItem[] = [
  { id: "sat-108", name: "High-Clutter SAR Vessel #108", modality: "SAR Radar", confidenceScore: 0.51, uncertaintyScore: 0.89, priorityLevel: "High", status: "Unlabeled" },
  { id: "sat-109", name: "Orbital Debris Low-Contrast Frame", modality: "Satellite Nadir", confidenceScore: 0.58, uncertaintyScore: 0.82, priorityLevel: "High", status: "Unlabeled" },
  { id: "sat-110", name: "Building Polygon Boundary", modality: "Spatial Optical", confidenceScore: 0.76, uncertaintyScore: 0.44, priorityLevel: "Medium", status: "Unlabeled" },
  { id: "sat-111", name: "Clear Ocean Background Frame", modality: "Satellite Optical", confidenceScore: 0.96, uncertaintyScore: 0.08, priorityLevel: "Low", status: "Unlabeled" },
];

interface ActiveLearningPanelProps {
  onSelectTask?: (taskId: string) => void;
}

export const ActiveLearningPanel = ({ onSelectTask }: ActiveLearningPanelProps) => {
  const [queue, setQueue] = useState<TaskUncertaintyItem[]>(DEMO_QUEUE);
  const [isSorted, setIsSorted] = useState(false);
  const [isSorting, setIsSorting] = useState(false);

  const handleAutoSort = () => {
    setIsSorting(true);
    setTimeout(() => {
      const sorted = [...queue].sort((a, b) => b.uncertaintyScore - a.uncertaintyScore);
      setQueue(sorted);
      setIsSorted(true);
      setIsSorting(false);
    }, 600);
  };

  return (
    <div className="rounded-2xl p-6 border border-[#23263d] bg-[#0c0d18] text-white space-y-6 shadow-2xl">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#23263d] pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-indigo-400 font-bold text-xs uppercase tracking-wider">
            <Cpu className="h-4 w-4 text-indigo-400" /> AI Active Learning Engine
          </div>
          <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" /> Automated Uncertainty Queue Sorting
          </h3>
          <p className="text-slate-400 text-xs">
            Auto-ranks unlabeled images by AI model prediction entropy. Annotators label ambiguous, high-value samples first.
          </p>
        </div>

        <Button
          onClick={handleAutoSort}
          disabled={isSorting}
          className="bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 shrink-0 gap-2 font-bold text-xs h-9 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all"
        >
          {isSorting ? (
            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <ArrowUpDown className="h-4 w-4" />
          )}
          {isSorted ? "Re-Sort Queue by Entropy" : "Auto-Sort Queue by Model Uncertainty"}
        </Button>
      </div>

      {/* Queue Items */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider px-2">
          <span>Task Image Name</span>
          <span className="flex gap-8">
            <span>Model Conf.</span>
            <span>Uncertainty Score</span>
            <span>Priority</span>
          </span>
        </div>

        <div className="space-y-2">
          {queue.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => onSelectTask && onSelectTask(item.id)}
              className={`p-3.5 rounded-xl border flex items-center justify-between transition-all cursor-pointer ${
                item.priorityLevel === "High"
                  ? "bg-rose-500/10 border-rose-500/30 hover:border-rose-500/60 shadow-sm"
                  : item.priorityLevel === "Medium"
                  ? "bg-amber-500/10 border-amber-500/30 hover:border-amber-500/60 shadow-sm"
                  : "bg-emerald-500/10 border-emerald-500/30 hover:border-emerald-500/60 shadow-sm"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-slate-400 w-6">#{idx + 1}</span>
                <div>
                  <div className="font-bold text-sm text-white flex items-center gap-2">
                    {item.name}
                    {item.priorityLevel === "High" && (
                      <Badge className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 text-pink-300 border-pink-500/40 text-[10px] py-0 px-2 font-bold">
                        Top Value
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-slate-400">{item.modality}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono">
                <span className="text-slate-300 font-bold">
                  {(item.confidenceScore * 100).toFixed(0)}%
                </span>

                <div className="w-20 bg-slate-800 h-2 rounded-full overflow-hidden shrink-0 border border-slate-700">
                  <div
                    className={`h-full rounded-full ${
                      item.priorityLevel === "High"
                        ? "bg-gradient-to-r from-rose-500 to-pink-500"
                        : item.priorityLevel === "Medium"
                        ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                        : "bg-gradient-to-r from-emerald-500 to-teal-400"
                    }`}
                    style={{ width: `${item.uncertaintyScore * 100}%` }}
                  />
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] w-16 justify-center font-bold ${
                    item.priorityLevel === "High"
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/40"
                      : item.priorityLevel === "Medium"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                  }`}
                >
                  {item.priorityLevel}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActiveLearningPanel;
