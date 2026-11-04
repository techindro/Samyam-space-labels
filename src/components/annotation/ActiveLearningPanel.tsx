import { useState, useMemo } from "react";
import { 
  Sparkles, Sliders, AlertTriangle, ArrowUpDown, CheckCircle2, 
  Cpu, HelpCircle, Layers, Filter, Zap, RefreshCw, BarChart3,
  Radar, Satellite, Eye, ArrowRight, ShieldAlert, CheckCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";

export interface TaskUncertaintyItem {
  id: string;
  name: string;
  modality: "SAR Radar" | "Satellite Nadir" | "Spatial Optical" | "Urban UAV Drone" | "Multispectral";
  confidenceScore: number; // 0.0 - 1.0
  uncertaintyScore: number; // 0.0 - 1.0
  priorityLevel: "High" | "Medium" | "Low";
  status: "Unlabeled" | "In Review" | "Auto-Accepted" | "Completed";
  detectedEntities: string;
  notes: string;
  imageUrl?: string;
}

const INITIAL_QUEUE: TaskUncertaintyItem[] = [
  { 
    id: "sat-108", 
    name: "High-Clutter SAR Vessel #108", 
    modality: "SAR Radar", 
    confidenceScore: 0.51, 
    uncertaintyScore: 0.89, 
    priorityLevel: "High", 
    status: "Unlabeled",
    detectedEntities: "3 BBox (Vessel, Wake, Ghost Speckle)",
    notes: "High radar speckle clutter causes low prediction agreement between CNN and Transformer heads."
  },
  { 
    id: "sat-109", 
    name: "Orbital Debris Low-Contrast Nadir Frame", 
    modality: "Satellite Nadir", 
    confidenceScore: 0.58, 
    uncertaintyScore: 0.82, 
    priorityLevel: "High", 
    status: "Unlabeled",
    detectedEntities: "2 Polygon (Debris Fragment)",
    notes: "Sub-pixel faint trail against cosmic background; model uncertainty is in top 5th percentile."
  },
  { 
    id: "sat-110", 
    name: "Complex Urban Building Polygon Boundary", 
    modality: "Urban UAV Drone", 
    confidenceScore: 0.69, 
    uncertaintyScore: 0.64, 
    priorityLevel: "Medium", 
    status: "Unlabeled",
    detectedEntities: "7 Polygon (Roof structures)",
    notes: "Shadow occlusions along high-rise building boundaries."
  },
  { 
    id: "sat-112", 
    name: "Cloud Shadow Occlusion - Agricultural NDVI", 
    modality: "Multispectral", 
    confidenceScore: 0.72, 
    uncertaintyScore: 0.55, 
    priorityLevel: "Medium", 
    status: "Unlabeled",
    detectedEntities: "4 Polygon (Crop Parcels)",
    notes: "Cloud shadow false-positives along boundary of dense vegetation."
  },
  { 
    id: "sat-113", 
    name: "Coastal Harbor Mooring & Pier Structure", 
    modality: "Spatial Optical", 
    confidenceScore: 0.84, 
    uncertaintyScore: 0.32, 
    priorityLevel: "Low", 
    status: "Unlabeled",
    detectedEntities: "5 BBox (Commercial Craft)",
    notes: "Clear maritime conditions; model has solid detection confidence."
  },
  { 
    id: "sat-111", 
    name: "Clear Open Ocean Background Frame #402", 
    modality: "Satellite Nadir", 
    confidenceScore: 0.96, 
    uncertaintyScore: 0.08, 
    priorityLevel: "Low", 
    status: "Unlabeled",
    detectedEntities: "0 Annotations (Negative Sample)",
    notes: "Unambiguous ocean tile; recommended for automated negative mining."
  },
];

interface ActiveLearningPanelProps {
  onSelectTask?: (taskId: string, task?: TaskUncertaintyItem) => void;
}

export const ActiveLearningPanel = ({ onSelectTask }: ActiveLearningPanelProps) => {
  const [queue, setQueue] = useState<TaskUncertaintyItem[]>(INITIAL_QUEUE);
  const [selectedModality, setSelectedModality] = useState<string>("all");
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(80); // in percent
  const [isSorting, setIsSorting] = useState(false);
  const [isRetraining, setIsRetraining] = useState(false);
  const [iteration, setIteration] = useState<number>(3);

  // Auto-sort by uncertainty score (entropy)
  const handleAutoSort = () => {
    setIsSorting(true);
    setTimeout(() => {
      const sorted = [...queue].sort((a, b) => b.uncertaintyScore - a.uncertaintyScore);
      setQueue(sorted);
      setIsSorting(false);
    }, 450);
  };

  // Simulate Retraining Active Learning iteration
  const handleRetrainIteration = () => {
    setIsRetraining(true);
    setTimeout(() => {
      setQueue(prev => prev.map(item => {
        // Active learning reduces uncertainty on reviewed items
        const newUncertainty = Math.max(0.05, +(item.uncertaintyScore * 0.78).toFixed(2));
        const newConf = Math.min(0.99, +(item.confidenceScore + (1 - item.confidenceScore) * 0.25).toFixed(2));
        const priority: "High" | "Medium" | "Low" = 
          newUncertainty > 0.7 ? "High" : newUncertainty > 0.4 ? "Medium" : "Low";
        return {
          ...item,
          uncertaintyScore: newUncertainty,
          confidenceScore: newConf,
          priorityLevel: priority
        };
      }));
      setIteration(i => i + 1);
      setIsRetraining(false);
    }, 700);
  };

  // Filtered Queue
  const filteredQueue = useMemo(() => {
    return queue.filter(item => {
      if (selectedModality === "all") return true;
      if (selectedModality === "high") return item.priorityLevel === "High";
      if (selectedModality === "auto-eligible") return item.confidenceScore * 100 >= confidenceThreshold;
      return item.modality.toLowerCase().includes(selectedModality.toLowerCase());
    });
  }, [queue, selectedModality, confidenceThreshold]);

  // Summary Metrics
  const metrics = useMemo(() => {
    const total = queue.length;
    const high = queue.filter(q => q.priorityLevel === "High").length;
    const autoEligible = queue.filter(q => q.confidenceScore * 100 >= confidenceThreshold).length;
    const avgEntropy = (queue.reduce((acc, q) => acc + q.uncertaintyScore, 0) / total).toFixed(2);
    return { total, high, autoEligible, avgEntropy };
  }, [queue, confidenceThreshold]);

  return (
    <div className="rounded-2xl p-6 border border-[#23263d] bg-[#0c0d18] text-white space-y-6 shadow-2xl">
      
      {/* ── Header ── */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 border-b border-[#23263d] pb-5">
        <div className="space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 text-indigo-400 font-bold text-xs uppercase tracking-wider bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
              <Cpu className="h-3.5 w-3.5" /> Samyam Active Learning Loop v2
            </span>
            <Badge variant="outline" className="text-[10px] bg-white/5 border-slate-700 text-slate-300">
              Cycle #{iteration}
            </Badge>
          </div>
          <h3 className="text-xl font-bold font-display text-white flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-indigo-400" /> Automated Uncertainty Queue Prioritizer
          </h3>
          <p className="text-slate-400 text-xs max-w-2xl leading-relaxed">
            Prioritizes ambiguous frames with high prediction disagreement. By focusing annotators only on high-entropy edge cases, dataset labeling throughput improves by up to <strong>3.8x</strong>.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={handleAutoSort}
            disabled={isSorting}
            variant="outline"
            className="border-slate-700 bg-[#121424] hover:bg-white/10 text-white text-xs h-9 gap-1.5"
          >
            {isSorting ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-indigo-400" />
            ) : (
              <ArrowUpDown className="h-3.5 w-3.5 text-indigo-400" />
            )}
            Auto-Rank by Entropy
          </Button>

          <Button
            onClick={handleRetrainIteration}
            disabled={isRetraining}
            className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white border-0 gap-1.5 font-bold text-xs h-9 shadow-[0_0_15px_rgba(99,102,241,0.4)] transition-all"
          >
            {isRetraining ? (
              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
            ) : (
              <Zap className="h-3.5 w-3.5" />
            )}
            Run Active Loop
          </Button>
        </div>
      </div>

      {/* ── Key Metrics Ribbon ── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <div className="p-3 bg-[#111322] border border-[#232742] rounded-xl space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Total In Queue</div>
          <div className="text-xl font-bold font-mono text-white flex items-baseline gap-1">
            {metrics.total} <span className="text-xs text-slate-500 font-sans font-normal">frames</span>
          </div>
        </div>

        <div className="p-3 bg-[#181120] border border-rose-500/20 rounded-xl space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-rose-300 flex items-center gap-1">
            <AlertTriangle className="h-3 w-3 text-rose-400" /> Top Uncertainty
          </div>
          <div className="text-xl font-bold font-mono text-rose-400 flex items-baseline gap-1">
            {metrics.high} <span className="text-xs text-slate-500 font-sans font-normal">critical</span>
          </div>
        </div>

        <div className="p-3 bg-[#0d1b1c] border border-emerald-500/20 rounded-xl space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 flex items-center gap-1">
            <CheckCheck className="h-3 w-3 text-emerald-400" /> Auto-Accept Eligible
          </div>
          <div className="text-xl font-bold font-mono text-emerald-400 flex items-baseline gap-1">
            {metrics.autoEligible} <span className="text-xs text-slate-500 font-sans font-normal">&ge;{confidenceThreshold}% conf</span>
          </div>
        </div>

        <div className="p-3 bg-[#131225] border border-indigo-500/20 rounded-xl space-y-1">
          <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-300">Mean Entropy</div>
          <div className="text-xl font-bold font-mono text-indigo-400 flex items-baseline gap-1">
            {metrics.avgEntropy} <span className="text-xs text-slate-500 font-sans font-normal">bits</span>
          </div>
        </div>
      </div>

      {/* ── Confidence Threshold & Filter Controls ── */}
      <div className="p-4 bg-[#101222] border border-[#23263d] rounded-xl space-y-4">
        
        {/* Threshold Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <Sliders className="h-3.5 w-3.5 text-indigo-400" />
              Pseudo-label Auto-Accept Confidence Threshold:
            </span>
            <span className="font-mono font-bold text-indigo-400 text-sm">
              {confidenceThreshold}%
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <input
              type="range"
              min={50}
              max={95}
              step={5}
              value={confidenceThreshold}
              onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
              className="w-full accent-indigo-500 bg-slate-800 h-1.5 rounded-lg cursor-pointer"
            />
            <span className="text-[11px] text-slate-400 whitespace-nowrap">
              {metrics.autoEligible} of {metrics.total} samples qualified
            </span>
          </div>
        </div>

        {/* Modality Filter Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-1 border-t border-[#1e2238]">
          <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 mr-2 flex items-center gap-1">
            <Filter className="h-3 w-3" /> Filter:
          </span>
          {[
            { id: "all", label: "All Items" },
            { id: "high", label: "Top Ambiguity" },
            { id: "auto-eligible", label: "Eligible for Auto-Accept" },
            { id: "sar radar", label: "SAR Radar" },
            { id: "satellite nadir", label: "Satellite Nadir" },
            { id: "urban uav", label: "Drone UAV" },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedModality(tab.id)}
              className={`text-xs px-2.5 py-1 rounded-lg transition-colors font-medium ${
                selectedModality === tab.id
                  ? "bg-indigo-600 text-white font-bold shadow-sm"
                  : "bg-[#181a2e] text-slate-400 hover:text-white hover:bg-[#20233d]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Queue Items List ── */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider px-2">
          <span>Task Sample & Uncertainty Context</span>
          <span className="hidden sm:flex items-center gap-8">
            <span className="w-16 text-center">Confidence</span>
            <span className="w-24 text-center">Uncertainty</span>
            <span className="w-20 text-center">Action</span>
          </span>
        </div>

        <div className="space-y-2">
          {filteredQueue.length === 0 && (
            <div className="text-center py-8 text-slate-500 text-xs border border-dashed border-[#1e2238] rounded-xl">
              No tasks match the selected filter criteria.
            </div>
          )}

          {filteredQueue.map((item, idx) => {
            const isAutoEligible = (item.confidenceScore * 100) >= confidenceThreshold;

            return (
              <div
                key={item.id}
                onClick={() => onSelectTask && onSelectTask(item.id, item)}
                className={`p-4 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all cursor-pointer group ${
                  item.priorityLevel === "High"
                    ? "bg-rose-500/5 border-rose-500/30 hover:border-rose-500/60 hover:bg-rose-500/10"
                    : item.priorityLevel === "Medium"
                    ? "bg-amber-500/5 border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/10"
                    : "bg-emerald-500/5 border-emerald-500/30 hover:border-emerald-500/60 hover:bg-emerald-500/10"
                }`}
              >
                {/* Left: Info */}
                <div className="flex items-start gap-3 min-w-0 flex-1">
                  <span className="font-mono text-xs font-bold text-slate-500 mt-0.5 w-6 shrink-0">
                    #{idx + 1}
                  </span>
                  
                  <div className="space-y-1 min-w-0">
                    <div className="font-bold text-sm text-white flex flex-wrap items-center gap-2">
                      <span className="group-hover:text-indigo-300 transition-colors">{item.name}</span>
                      
                      {item.priorityLevel === "High" && (
                        <Badge className="bg-rose-500/20 text-rose-300 border-rose-500/40 text-[10px] py-0 px-2 font-bold">
                          Top Ambiguity
                        </Badge>
                      )}

                      {isAutoEligible && (
                        <Badge className="bg-emerald-500/20 text-emerald-300 border-emerald-500/40 text-[10px] py-0 px-2 font-bold flex items-center gap-1">
                          <CheckCircle2 size={10} /> Auto-Accept Eligible
                        </Badge>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                      <span className="font-medium text-slate-300">{item.modality}</span>
                      <span>&bull;</span>
                      <span className="text-slate-500 font-mono text-[11px]">{item.detectedEntities}</span>
                    </div>

                    <p className="text-[11px] text-slate-400 line-clamp-1 italic">
                      {item.notes}
                    </p>
                  </div>
                </div>

                {/* Right: Scores & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-5 text-xs font-mono shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#1e2238]">
                  {/* Model Confidence */}
                  <div className="text-center w-16">
                    <div className="text-[10px] uppercase font-sans text-slate-500 sm:hidden">Conf.</div>
                    <span className="text-slate-300 font-bold">
                      {(item.confidenceScore * 100).toFixed(0)}%
                    </span>
                  </div>

                  {/* Uncertainty Progress Bar */}
                  <div className="w-24 space-y-1">
                    <div className="flex justify-between text-[10px] text-slate-400 font-sans">
                      <span className="sm:hidden">Entropy</span>
                      <span className="font-bold text-slate-300 font-mono">
                        {(item.uncertaintyScore * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden border border-slate-700">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.priorityLevel === "High"
                            ? "bg-gradient-to-r from-rose-500 to-pink-500"
                            : item.priorityLevel === "Medium"
                            ? "bg-gradient-to-r from-amber-500 to-yellow-400"
                            : "bg-gradient-to-r from-emerald-500 to-teal-400"
                        }`}
                        style={{ width: `${item.uncertaintyScore * 100}%` }}
                      />
                    </div>
                  </div>

                  {/* Priority / Action */}
                  <div className="w-20 flex justify-end">
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-7 px-2.5 text-[11px] font-sans font-bold bg-[#14172a] hover:bg-indigo-600 hover:text-white border-slate-700 group-hover:border-indigo-500 transition-all flex items-center gap-1"
                    >
                      <span>Review</span>
                      <ArrowRight size={11} className="group-hover:translate-x-0.5 transition-transform" />
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ActiveLearningPanel;
