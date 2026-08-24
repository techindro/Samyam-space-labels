import React, { useState, useRef, useEffect, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Columns,
  Layers,
  Calendar,
  Sparkles,
  ArrowLeftRight,
  ZoomIn,
  ZoomOut,
  Maximize2,
  AlertTriangle,
  Flame,
  Droplets,
  Building,
  CheckCircle2
} from "lucide-react";

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

interface SatelliteComparisonPair {
  id: string;
  title: string;
  location: string;
  category: "Flood Disaster" | "Urban Expansion" | "Deforestation" | "Glacial Lake Outburst";
  beforeDate: string;
  afterDate: string;
  beforeUrl: string;
  afterUrl: string;
  changeSummary: string;
  riskLevel: "CRITICAL" | "HIGH" | "MODERATE";
}

const COMPARISON_PAIRS: SatelliteComparisonPair[] = [
  {
    id: "kaziranga-flood",
    title: "Brahmaputra Flood Inundation & Wildlife Corridor",
    location: "Kaziranga Basin, Assam, India",
    category: "Flood Disaster",
    beforeDate: "May 15, 2026 (Pre-Monsoon Baseline)",
    afterDate: "Aug 18, 2026 (Peak Monsoon SAR Pass)",
    beforeUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1280&auto=format&fit=crop",
    afterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1280&auto=format&fit=crop",
    changeSummary: "+42.8 km² submerged wetlands · 18 breach corridors vectorized · 94.2% ML confidence",
    riskLevel: "CRITICAL"
  },
  {
    id: "bengaluru-urban",
    title: "Kempegowda Aerotropolis & STRR Satellite Transit Corridor",
    location: "Bengaluru North, Karnataka, India",
    category: "Urban Expansion",
    beforeDate: "Jan 12, 2025 (Panchromatic Baseline)",
    afterDate: "Aug 14, 2026 (Cartosat-3 Sub-Meter Pass)",
    beforeUrl: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1280&auto=format&fit=crop",
    afterUrl: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1280&auto=format&fit=crop",
    changeSummary: "+164 hectares new impervious asphalt & rooftop infrastructure mapped",
    riskLevel: "MODERATE"
  },
  {
    id: "himalayan-glacial",
    title: "South Lhonak Glacial Lake & Teesta Basin Moraine Seepage",
    location: "Sikkim Eastern Himalayas, India",
    category: "Glacial Lake Outburst",
    beforeDate: "Mar 10, 2026 (Dry Winter Optical Pass)",
    afterDate: "Aug 20, 2026 (EOS-04 C-Band SAR Penetration)",
    beforeUrl: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1280&auto=format&fit=crop",
    afterUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1280&auto=format&fit=crop",
    changeSummary: "+18.7% moraine volume expansion · Active subterranean thermal thaw detected",
    riskLevel: "HIGH"
  },
  {
    id: "sundarbans-mangrove",
    title: "Sundarbans Biosphere Mangrove Canopy Loss & Saline Inundation",
    location: "Sundarbans Delta, West Bengal, India",
    category: "Deforestation",
    beforeDate: "Feb 08, 2026 (Winter Pristine Canopy)",
    afterDate: "Aug 22, 2026 (Sentinel-2 Multi-Spectral CIR)",
    beforeUrl: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1280&auto=format&fit=crop",
    afterUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1280&auto=format&fit=crop",
    changeSummary: "-8.4% mangrove canopy density along tidal mudflats · Salinity stress mapped",
    riskLevel: "HIGH"
  }
];



export default function TemporalSplitView({ isOpen, onClose }: Props) {
  const [activePair, setActivePair] = useState<SatelliteComparisonPair>(COMPARISON_PAIRS[0]);
  const [sliderPos, setSliderPos] = useState<number>(50); // 0 to 100%
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handlePointerMove = useCallback((e: MouseEvent | TouchEvent) => {
    if (!isDragging || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const clientX = "touches" in e ? e.touches[0].clientX : e.clientX;
    const x = clientX - rect.left;
    const pct = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(pct);
  }, [isDragging]);

  const handlePointerUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", handlePointerMove);
      window.addEventListener("mouseup", handlePointerUp);
      window.addEventListener("touchmove", handlePointerMove);
      window.addEventListener("touchend", handlePointerUp);
    }
    return () => {
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);
    };
  }, [isDragging, handlePointerMove, handlePointerUp]);

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-6xl bg-[#0a0b14] border border-indigo-500/30 text-white p-6 shadow-2xl rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              <Columns className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                Temporal Change Detection & Split-Swipe Studio
                <Badge className="bg-indigo-500/20 text-indigo-300 border-indigo-500/30 text-[10px] font-mono">
                  Dual-Epoch Bi-Temporal AI
                </Badge>
              </DialogTitle>
              <p className="text-xs text-white/50">
                Compare before vs after satellite imagery passes with synchronized coordinate lock & automated change telemetry
              </p>
            </div>
          </div>
        </DialogHeader>

        {/* Dataset Pair Selector Pills */}
        <div className="flex flex-wrap gap-2 pt-3">
          {COMPARISON_PAIRS.map(pair => {
            const isSelected = activePair.id === pair.id;
            return (
              <button
                key={pair.id}
                onClick={() => setActivePair(pair)}
                className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 border transition-all ${
                  isSelected
                    ? "bg-indigo-600/30 border-indigo-500 text-white shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                    : "bg-white/5 border-white/10 text-white/70 hover:bg-white/10"
                }`}
              >
                {pair.category === "Flood Disaster" && <Droplets className="w-3.5 h-3.5 text-blue-400" />}
                {pair.category === "Urban Expansion" && <Building className="w-3.5 h-3.5 text-amber-400" />}
                {pair.category === "Glacial Lake Outburst" && <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />}
                <span>{pair.title}</span>
              </button>
            );
          })}
        </div>

        {/* Main Swipe Viewport */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 pt-3">
          <div className="lg:col-span-3 flex flex-col">
            <div
              ref={containerRef}
              className="relative w-full h-[450px] rounded-xl overflow-hidden border border-white/15 bg-black select-none cursor-ew-resize shadow-2xl"
              onMouseDown={() => setIsDragging(true)}
              onTouchStart={() => setIsDragging(true)}
            >
              {/* After Image (Background) */}
              <img
                src={activePair.afterUrl}
                alt="After Satellite Pass"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
              />

              {/* Before Image (Clipped Overlay) */}
              <div
                className="absolute inset-0 overflow-hidden pointer-events-none"
                style={{ clipPath: `inset(0 ${100 - sliderPos}% 0 0)` }}
              >
                <img
                  src={activePair.beforeUrl}
                  alt="Before Satellite Pass"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              </div>

              {/* Divider Handle Bar */}
              <div
                className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_12px_rgba(255,255,255,0.8)] z-10 flex items-center justify-center pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center shadow-2xl border-2 border-indigo-600 font-bold text-xs">
                  <ArrowLeftRight className="w-4 h-4 text-indigo-700" />
                </div>
              </div>

              {/* Date Badges Floating */}
              <div className="absolute top-4 left-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-xs font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span>BEFORE: {activePair.beforeDate}</span>
              </div>

              <div className="absolute top-4 right-4 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-xs font-mono flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-cyan-400" />
                <span>AFTER: {activePair.afterDate}</span>
              </div>

              {/* Bottom Instruction */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-md px-4 py-1.5 rounded-full border border-white/20 text-[11px] font-sans text-white/80 pointer-events-none">
                ↔ Drag slider left/right to reveal spatial changes
              </div>
            </div>
          </div>

          {/* Change Analytics Card */}
          <div className="flex flex-col justify-between bg-[#111322] p-5 rounded-xl border border-white/10 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-bold uppercase tracking-widest text-indigo-400">
                  Site Telemetry
                </span>
                <Badge
                  className={
                    activePair.riskLevel === "CRITICAL"
                      ? "bg-red-500/20 text-red-300 border-red-500/40"
                      : activePair.riskLevel === "HIGH"
                      ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                      : "bg-blue-500/20 text-blue-300 border-blue-500/40"
                  }
                >
                  {activePair.riskLevel}
                </Badge>
              </div>

              <h3 className="font-bold text-white text-sm mb-1">{activePair.title}</h3>
              <p className="text-xs text-white/60 mb-4">{activePair.location}</p>

              <div className="p-3 bg-black/40 rounded-lg border border-white/5 space-y-2 text-xs">
                <div className="text-white/50 text-[10px] uppercase font-bold">AI Change Matrix</div>
                <div className="text-cyan-300 font-semibold leading-relaxed">
                  {activePair.changeSummary}
                </div>
              </div>

              <div className="mt-4 space-y-2 text-xs text-white/70">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Sub-pixel affine registration locked</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Orthorectification standard: WGS-84</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Dual-Pass IoU change mask generated</span>
                </div>
              </div>
            </div>

            <Button
              onClick={onClose}
              className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs"
            >
              Close Temporal Studio
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
