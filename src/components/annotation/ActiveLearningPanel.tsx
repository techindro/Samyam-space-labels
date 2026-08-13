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
    <div className="glass-card rounded-2xl p-6 border border-purple-500/30 bg-purple-500/5 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-border/40 pb-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-purple-400 font-semibold text-xs uppercase tracking-wider">
            <Cpu className="h-4 w-4" /> AI Active Learning Engine
          </div>
          <h3 className="text-xl font-bold font-display text-foreground flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-purple-400" /> Automated Uncertainty Queue Sorting
          </h3>
          <p className="text-muted-foreground text-xs">
            Auto-ranks unlabeled images by AI model prediction entropy. Annotators label ambiguous, high-value samples first.
          </p>
        </div>

        <Button
          onClick={handleAutoSort}
          disabled={isSorting}
          className="bg-purple-600 hover:bg-purple-700 text-white shrink-0 gap-2 font-medium text-xs h-9"
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
        <div className="flex items-center justify-between text-xs text-muted-foreground font-semibold px-2">
          <span>Task Image Name</span>
          <span className="flex gap-6">
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
                  ? "bg-purple-500/10 border-purple-500/30 hover:border-purple-500/60"
                  : "bg-secondary/30 border-border/40 hover:bg-secondary/50"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold text-muted-foreground w-6">#{idx + 1}</span>
                <div>
                  <div className="font-semibold text-sm text-foreground flex items-center gap-2">
                    {item.name}
                    {item.priorityLevel === "High" && (
                      <Badge className="bg-purple-500/20 text-purple-400 border-purple-500/30 text-[10px] py-0 px-1.5 font-bold">
                        Top Value
                      </Badge>
                    )}
                  </div>
                  <span className="text-xs text-muted-foreground">{item.modality}</span>
                </div>
              </div>

              <div className="flex items-center gap-6 text-xs font-mono">
                <span className="text-muted-foreground">
                  {(item.confidenceScore * 100).toFixed(0)}%
                </span>

                <div className="w-20 bg-secondary/60 h-2 rounded-full overflow-hidden shrink-0">
                  <div
                    className={`h-full rounded-full ${
                      item.priorityLevel === "High"
                        ? "bg-purple-400"
                        : item.priorityLevel === "Medium"
                        ? "bg-blue-400"
                        : "bg-emerald-400"
                    }`}
                    style={{ width: `${item.uncertaintyScore * 100}%` }}
                  />
                </div>

                <Badge
                  variant="outline"
                  className={`text-[10px] w-16 justify-center ${
                    item.priorityLevel === "High"
                      ? "bg-purple-500/20 text-purple-400 border-purple-500/40"
                      : item.priorityLevel === "Medium"
                      ? "bg-blue-500/20 text-blue-400 border-blue-500/40"
                      : "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
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
