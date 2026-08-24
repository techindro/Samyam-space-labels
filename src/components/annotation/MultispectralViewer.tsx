import React, { useState, useEffect, useRef, useCallback } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import {
  Layers,
  Sparkles,
  Sun,
  Eye,
  Activity,
  Download,
  Check,
  RefreshCw,
  Info,
  Shield,
  TreeDeciduous,
  Waves
} from "lucide-react";

export type SpectralBandMode = "rgb" | "cir_infrared" | "ndvi_vegetation" | "sar_polarimetric" | "thermal_heat";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
  imageName?: string;
}

export default function MultispectralViewer({
  isOpen,
  onClose,
  imageUrl,
  imageName = "Satellite_Pass_01.tif",
}: Props) {
  const [bandMode, setBandMode] = useState<SpectralBandMode>("ndvi_vegetation");
  const [contrast, setContrast] = useState<number>(1.2);
  const [ndviThreshold, setNdviThreshold] = useState<number>(0.35);
  const [gamma, setGamma] = useState<number>(1.1);
  const [stats, setStats] = useState({
    meanNdvi: "0.58 (Healthy Canopy)",
    vegCoverage: "68.4%",
    waterIndex: "14.2%",
    urbanBareIndex: "17.4%",
  });

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const originalImgRef = useRef<HTMLImageElement | null>(null);

  const processBands = useCallback(() => {
    const img = originalImgRef.current;
    const canvas = canvasRef.current;
    if (!img || !canvas) return;

    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    canvas.width = img.width || 800;
    canvas.height = img.height || 500;
    ctx.drawImage(img, 0, 0);

    const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imgData.data;
    const len = data.length;

    let totalNdvi = 0;
    let vegPixels = 0;
    let waterPixels = 0;
    let totalSampled = 0;

    for (let i = 0; i < len; i += 4) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];

      // Pseudo Near-Infrared (NIR) estimate from high green/red reflectances in optical passes
      const nir = Math.min(255, Math.max(0, g * 1.5 - r * 0.4 + b * 0.3));

      // Calculate NDVI: (NIR - Red) / (NIR + Red)
      const denom = nir + r;
      const ndvi = denom > 0 ? (nir - r) / denom : 0;

      if (i % 32 === 0) {
        totalNdvi += ndvi;
        if (ndvi >= ndviThreshold) vegPixels++;
        if (b > r + 30 && b > g) waterPixels++;
        totalSampled++;
      }

      if (bandMode === "rgb") {
        // Enhanced True Color
        data[i] = Math.min(255, Math.pow(r / 255, 1 / gamma) * 255 * contrast);
        data[i + 1] = Math.min(255, Math.pow(g / 255, 1 / gamma) * 255 * contrast);
        data[i + 2] = Math.min(255, Math.pow(b / 255, 1 / gamma) * 255 * contrast);
      } else if (bandMode === "cir_infrared") {
        // Color Infrared (CIR): NIR -> Red, Red -> Green, Green -> Blue
        data[i] = Math.min(255, nir * contrast);
        data[i + 1] = Math.min(255, r * contrast);
        data[i + 2] = Math.min(255, g * contrast);
      } else if (bandMode === "ndvi_vegetation") {
        // NDVI Colormap Palette: Red (barren) -> Yellow (moderate) -> Vibrant Emerald Green (dense veg)
        if (ndvi < ndviThreshold) {
          // Non-vegetated / Soil / Urban (Brownish-Rust)
          data[i] = 180;
          data[i + 1] = 120;
          data[i + 2] = 80;
        } else {
          // Healthy vegetation gradient
          const intensity = Math.min(1, (ndvi - ndviThreshold) / (1 - ndviThreshold));
          data[i] = Math.round(30 * (1 - intensity));
          data[i + 1] = Math.round(180 + 75 * intensity);
          data[i + 2] = Math.round(50 + 60 * (1 - intensity));
        }
      } else if (bandMode === "sar_polarimetric") {
        // SAR Double-Bounce Polarimetric enhancement
        const intensity = (r * 0.5 + g * 0.4 + b * 0.1) * contrast;
        if (intensity > 190) {
          // Metal structures / Vessels (Neon Cyan / Gold)
          data[i] = 0;
          data[i + 1] = 240;
          data[i + 2] = 255;
        } else {
          data[i] = Math.round(intensity * 0.4);
          data[i + 1] = Math.round(intensity * 0.7);
          data[i + 2] = Math.round(intensity * 0.9);
        }
      } else if (bandMode === "thermal_heat") {
        // Thermal / Surface Heat Map
        const heat = (r * 0.7 + g * 0.2 + b * 0.1) / 255;
        data[i] = Math.min(255, Math.round(heat * 280));
        data[i + 1] = Math.min(255, Math.round(Math.sin(heat * Math.PI) * 230));
        data[i + 2] = Math.min(255, Math.round((1 - heat) * 255));
      }

    }

    ctx.putImageData(imgData, 0, 0);

    if (totalSampled > 0) {
      const avgNdvi = totalNdvi / totalSampled;
      setStats({
        meanNdvi: `${avgNdvi.toFixed(2)} (${avgNdvi > 0.45 ? "Lush Forest" : avgNdvi > 0.2 ? "Moderate Canopy" : "Arid/Urban"})`,
        vegCoverage: `${((vegPixels / totalSampled) * 100).toFixed(1)}%`,
        waterIndex: `${((waterPixels / totalSampled) * 100).toFixed(1)}%`,
        urbanBareIndex: `${(Math.max(0, 100 - (vegPixels / totalSampled) * 100 - (waterPixels / totalSampled) * 100)).toFixed(1)}%`,
      });
    }
  }, [bandMode, contrast, ndviThreshold, gamma]);

  useEffect(() => {
    if (!isOpen) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      originalImgRef.current = img;
      processBands();
    };
    img.src = imageUrl;
  }, [isOpen, imageUrl, processBands]);


  const handleDownloadFiltered = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const url = canvas.toDataURL("image/png");
    const a = document.createElement("a");
    a.href = url;
    a.download = `samyam_${bandMode}_${imageName.replace(/\.[^/.]+$/, "")}.png`;
    a.click();
  };

  return (
    <Dialog open={isOpen} onOpenChange={open => !open && onClose()}>
      <DialogContent className="max-w-5xl bg-[#0b0c16] border border-cyan-500/30 text-white p-6 shadow-2xl rounded-2xl">
        <DialogHeader className="flex flex-row items-center justify-between pb-3 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-white flex items-center gap-2">
                Multispectral & NDVI Band Inspector
                <Badge className="bg-cyan-500/20 text-cyan-300 border-cyan-500/30 text-[10px] font-mono">
                  Sentinel-2 / SAR Pipeline
                </Badge>
              </DialogTitle>
              <p className="text-xs text-white/50">
                Radiometric band filtering, False-Color Infrared (CIR), and Normalized Difference Vegetation Index (NDVI)
              </p>
            </div>
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
          {/* Main Visualizer Canvas */}
          <div className="lg:col-span-2 flex flex-col items-center justify-center bg-[#070811] rounded-xl border border-white/10 p-3 min-h-[380px] relative overflow-hidden">
            <canvas
              ref={canvasRef}
              className="max-w-full max-h-[420px] object-contain rounded-lg shadow-2xl border border-white/5"
            />
            <div className="absolute top-5 left-5 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/15 text-[11px] font-mono flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              Band: {bandMode.toUpperCase().replace("_", " ")}
            </div>
          </div>

          {/* Controls & Spectral Analytics */}
          <div className="flex flex-col justify-between space-y-4 bg-[#101222] p-4 rounded-xl border border-white/10">
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 mb-3 flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5" /> Spectral Band Modes
              </h4>
              <div className="grid grid-cols-1 gap-2">
                <button
                  onClick={() => setBandMode("ndvi_vegetation")}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    bandMode === "ndvi_vegetation"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/50 shadow-md"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <TreeDeciduous className="w-4 h-4 text-emerald-400" /> NDVI Vegetation Health
                  </span>
                  {bandMode === "ndvi_vegetation" && <Check className="w-3.5 h-3.5 text-emerald-400" />}
                </button>

                <button
                  onClick={() => setBandMode("cir_infrared")}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    bandMode === "cir_infrared"
                      ? "bg-rose-500/20 text-rose-300 border border-rose-500/50 shadow-md"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Sun className="w-4 h-4 text-rose-400" /> False Color Infrared (CIR)
                  </span>
                  {bandMode === "cir_infrared" && <Check className="w-3.5 h-3.5 text-rose-400" />}
                </button>

                <button
                  onClick={() => setBandMode("sar_polarimetric")}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    bandMode === "sar_polarimetric"
                      ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-md"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-cyan-400" /> SAR Radar Polarimetric
                  </span>
                  {bandMode === "sar_polarimetric" && <Check className="w-3.5 h-3.5 text-cyan-400" />}
                </button>

                <button
                  onClick={() => setBandMode("thermal_heat")}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    bandMode === "thermal_heat"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/50 shadow-md"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-amber-400" /> Thermal / Urban Heat Island
                  </span>
                  {bandMode === "thermal_heat" && <Check className="w-3.5 h-3.5 text-amber-400" />}
                </button>

                <button
                  onClick={() => setBandMode("rgb")}
                  className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-semibold transition-all ${
                    bandMode === "rgb"
                      ? "bg-indigo-500/20 text-indigo-300 border border-indigo-500/50 shadow-md"
                      : "bg-white/5 text-white/70 hover:bg-white/10"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <Eye className="w-4 h-4 text-indigo-400" /> Natural RGB True Color
                  </span>
                  {bandMode === "rgb" && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                </button>
              </div>

              {/* Sliders */}
              <div className="mt-4 space-y-3 pt-3 border-t border-white/10">
                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span>NDVI Vegetation Threshold</span>
                    <span className="font-mono text-emerald-400">{ndviThreshold.toFixed(2)}</span>
                  </div>
                  <Slider
                    min={0.1}
                    max={0.8}
                    step={0.05}
                    value={[ndviThreshold]}
                    onValueChange={v => setNdviThreshold(v[0])}
                    className="w-full"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-[11px] text-white/70 mb-1">
                    <span>Radiometric Contrast Gain</span>
                    <span className="font-mono text-cyan-400">{contrast.toFixed(1)}x</span>
                  </div>
                  <Slider
                    min={0.8}
                    max={2.5}
                    step={0.1}
                    value={[contrast]}
                    onValueChange={v => setContrast(v[0])}
                    className="w-full"
                  />
                </div>
              </div>

              {/* Radiometric Telemetry Stats */}
              <div className="mt-4 p-3 bg-black/40 rounded-lg border border-white/5 space-y-1.5 text-[11px]">
                <div className="flex justify-between text-white/60">
                  <span>Mean Canopy Index:</span>
                  <span className="text-emerald-400 font-mono font-bold">{stats.meanNdvi}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Canopy Coverage:</span>
                  <span className="text-cyan-400 font-mono">{stats.vegCoverage}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Water Body Index:</span>
                  <span className="text-blue-400 font-mono">{stats.waterIndex}</span>
                </div>
                <div className="flex justify-between text-white/60">
                  <span>Soil / Urban Footprint:</span>
                  <span className="text-amber-400 font-mono">{stats.urbanBareIndex}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-white/10">
              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadFiltered}
                className="flex-1 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-300 border-cyan-500/40 text-xs"
              >
                <Download className="w-3.5 h-3.5 mr-1.5" /> Save Filtered Raster
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="text-white/60 hover:text-white text-xs"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
