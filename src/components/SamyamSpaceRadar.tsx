import React, { useState, useEffect, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Radar,
  Radio,
  Shield,
  Target,
  Zap,
  Activity,
  Eye,
  Compass,
  Layers,
  Lock,
  Cpu,
  Volume2,
  VolumeX,
  Crosshair,
  Satellite,
  AlertTriangle,
  RotateCw,
  Maximize2
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface SpaceTarget {
  id: string;
  name: string;
  type: "ISRO Satellite" | "Orbital Debris" | "SAR Telemetry" | "Ground Asset";
  lat: number;
  lon: number;
  altKm: number;
  speedKms: number;
  confidence: number;
  rcsM2: number;
  snrDb: number;
  dopplerKhz: number;
  angle: number;
  distance: number;
  color: string;
}

export default function SamyamSpaceRadar() {
  const [activeBand, setActiveBand] = useState<"VV" | "VH" | "L-Band" | "Optical">("L-Band");
  const [isScanning, setIsScanning] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState<SpaceTarget | null>(null);
  const [radarAngle, setRadarAngle] = useState(0);
  const [audioEnabled, setAudioEnabled] = useState(false);
  const [activeViewMode, setActiveViewMode] = useState<"POLAR" | "DOPPLER" | "ELEVATION">("POLAR");
  const [scanSpeed, setScanSpeed] = useState<number>(2.5);

  const targets: SpaceTarget[] = useMemo(() => [
    {
      id: "SAT-ISRO-R2A",
      name: "ISRO Resourcesat-2A (LISS-4 / AWiFS)",
      type: "ISRO Satellite",
      lat: 13.0827,
      lon: 80.2707,
      altKm: 817,
      speedKms: 7.45,
      confidence: 0.988,
      rcsM2: 12.4,
      snrDb: 34.2,
      dopplerKhz: +4.82,
      angle: 42,
      distance: 125,
      color: "#00f0ff"
    },
    {
      id: "DEBRIS-LEO-482",
      name: "Kosmos-2251 Kinetic Fragment (#482)",
      type: "Orbital Debris",
      lat: 28.6139,
      lon: 77.209,
      altKm: 420,
      speedKms: 7.82,
      confidence: 0.942,
      rcsM2: 0.08,
      snrDb: 18.5,
      dopplerKhz: -12.15,
      angle: 140,
      distance: 85,
      color: "#ff0055"
    },
    {
      id: "SAT-EOS-06",
      name: "Oceansat-3 / EOS-06 (Ku-Band Scatterometer)",
      type: "ISRO Satellite",
      lat: 19.076,
      lon: 72.8777,
      altKm: 738,
      speedKms: 7.51,
      confidence: 0.976,
      rcsM2: 18.2,
      snrDb: 38.6,
      dopplerKhz: +2.18,
      angle: 215,
      distance: 145,
      color: "#00ff88"
    },
    {
      id: "GROUND-AUTO-01",
      name: "Indic Tactical Fleet Grid (Convoy Alpha)",
      type: "Ground Asset",
      lat: 12.9716,
      lon: 77.5946,
      altKm: 0.92,
      speedKms: 0.04,
      confidence: 0.994,
      rcsM2: 4.5,
      snrDb: 42.1,
      dopplerKhz: +0.03,
      angle: 305,
      distance: 60,
      color: "#a855f7"
    },
  ], []);

  // Web Audio Synthesized Radar Ping for authentic military immersion
  const playRadarPing = () => {
    if (!audioEnabled || typeof window === "undefined") return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = "sine";
      osc.frequency.setValueAtTime(1450, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(780, ctx.currentTime + 0.12);
      
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.12);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      osc.stop(ctx.currentTime + 0.13);
    } catch (e) {
      // Audio fallback ignored safely
    }
  };

  // Continuous Radar Sweep Animation Loop
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setRadarAngle((prev) => {
        const next = (prev + scanSpeed) % 360;
        // Ping on crossing cardinal points
        if (Math.floor(next / 90) !== Math.floor(prev / 90)) {
          playRadarPing();
        }
        return next;
      });
    }, 25);
    return () => clearInterval(interval);
  }, [isScanning, scanSpeed, audioEnabled]);

  // Set default selected target on mount
  useEffect(() => {
    if (!selectedTarget && targets.length > 0) {
      setSelectedTarget(targets[0]);
    }
  }, [targets, selectedTarget]);

  // Color scheme by SAR Polarization Band
  const bandStyles = useMemo(() => {
    switch (activeBand) {
      case "VV":
        return {
          glow: "from-cyan-500/20 to-blue-600/20",
          sweepGradient: "conic-gradient(from 0deg, rgba(6, 182, 212, 0.45) 0deg, rgba(6, 182, 212, 0.08) 45deg, transparent 90deg, transparent 360deg)",
          ringColor: "border-cyan-500/30",
          accentColor: "text-cyan-400",
          desc: "Co-Polarized Vertical: Surface Roughness & Maritime Scattering",
          freq: "5.405 GHz (C-Band)"
        };
      case "VH":
        return {
          glow: "from-emerald-500/20 to-teal-600/20",
          sweepGradient: "conic-gradient(from 0deg, rgba(16, 185, 129, 0.45) 0deg, rgba(16, 185, 129, 0.08) 45deg, transparent 90deg, transparent 360deg)",
          ringColor: "border-emerald-500/30",
          accentColor: "text-emerald-400",
          desc: "Cross-Polarized Vertical-Horizontal: Biomass & Canopy Volume",
          freq: "5.405 GHz (C-Band Cross)"
        };
      case "L-Band":
        return {
          glow: "from-amber-500/20 to-orange-600/20",
          sweepGradient: "conic-gradient(from 0deg, rgba(245, 158, 11, 0.45) 0deg, rgba(245, 158, 11, 0.08) 45deg, transparent 90deg, transparent 360deg)",
          ringColor: "border-amber-500/30",
          accentColor: "text-amber-400",
          desc: "Deep Penetration 1.25 GHz: Sub-Surface & Kinetic Tracking",
          freq: "1.257 GHz (NISAR Dual-Pol)"
        };
      case "Optical":
        return {
          glow: "from-purple-500/20 to-pink-600/20",
          sweepGradient: "conic-gradient(from 0deg, rgba(168, 85, 247, 0.45) 0deg, rgba(168, 85, 247, 0.08) 45deg, transparent 90deg, transparent 360deg)",
          ringColor: "border-purple-500/30",
          accentColor: "text-purple-400",
          desc: "Multispectral Panchromatic (0.8m GSD) Optical Overlay",
          freq: "RGB + NIR (450-850nm)"
        };
    }
  }, [activeBand]);

  return (
    <div className="relative rounded-3xl p-5 md:p-8 border border-cyan-500/30 shadow-[0_0_50px_rgba(6,182,212,0.15)] backdrop-blur-2xl bg-[#060a14] text-white overflow-hidden font-sans">
      
      {/* Background CRT Tactical Scanlines */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.03] z-0"
        style={{
          backgroundImage: "repeating-linear-gradient(0deg, #000, #000 2px, #00f0ff 2px, #00f0ff 4px)"
        }}
      />

      {/* Ambient Pulsing Glow Orbs */}
      <div className="absolute -top-32 -left-32 w-80 h-80 bg-cyan-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-32 -right-32 w-80 h-80 bg-purple-500/15 rounded-full blur-3xl pointer-events-none animate-pulse" />

      {/* Top Mission HUD Navigation Bar */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-6 relative z-10 border-b border-cyan-500/20 pb-5">
        <div>
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className="px-2.5 py-1 rounded-md bg-cyan-950/80 text-cyan-400 border border-cyan-500/40 text-[10px] font-mono font-bold tracking-widest uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(6,182,212,0.3)]">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              ISRO-SAR OPERATIONAL HUD
            </span>
            <span className="px-2 py-0.5 rounded bg-purple-950/80 text-purple-300 text-[10px] font-mono border border-purple-500/30">
              POLARIMETRY V3.8
            </span>
            <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-400 text-[10px] font-mono border border-emerald-500/30">
              LIVE TELEMETRY
            </span>
          </div>

          <h2 className="text-xl md:text-2xl font-black font-display tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-teal-200 to-white flex items-center gap-2.5">
            <Radar className="w-6 h-6 text-cyan-400 animate-spin-slow" />
            ISRO & Orbital SAR Tactical Radar Visualizer
          </h2>
          <p className="text-xs text-cyan-200/70 font-mono mt-0.5">
            {bandStyles.desc} • <span className="text-cyan-400">{bandStyles.freq}</span>
          </p>
        </div>

        {/* Right HUD Controls: Audio Beep Toggle, Band Selector, Sweep Speed */}
        <div className="flex flex-wrap items-center gap-2 bg-[#0b1329]/90 p-1.5 rounded-2xl border border-cyan-500/30 shadow-inner">
          
          {/* Audio Telemetry Toggle */}
          <button
            onClick={() => setAudioEnabled(!audioEnabled)}
            className={`p-2 rounded-xl text-xs font-mono transition-all border ${
              audioEnabled
                ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]"
                : "bg-black/40 border-white/10 text-white/40 hover:text-white"
            }`}
            title={audioEnabled ? "Radar Acoustic Beacon: Active" : "Radar Acoustic Beacon: Muted"}
          >
            {audioEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Polarimetric Band Selector */}
          <div className="flex items-center gap-1 bg-black/50 p-1 rounded-xl border border-white/10">
            {(["L-Band", "VV", "VH", "Optical"] as const).map((band) => (
              <button
                key={band}
                onClick={() => setActiveBand(band)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeBand === band
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.5)] border border-cyan-300/40"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                {band}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main 2-Column Tactical HUD Layout */}
      <div className="grid lg:grid-cols-12 gap-8 relative z-10 items-center">
        
        {/* Left Column: Authentic CRT Aerospace Polar Radar Canvas */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          
          {/* Outer Housing Bezel with Cardinal Degree Markings */}
          <div className="relative p-4 rounded-full bg-gradient-to-b from-[#111c38] to-[#040814] border-2 border-cyan-500/40 shadow-[0_0_60px_rgba(6,182,212,0.25)]">
            
            {/* Cardinal Degree Indicators */}
            <div className="absolute top-1 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-cyan-400 tracking-wider">000° N</div>
            <div className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] font-mono font-bold text-cyan-400 tracking-wider">180° S</div>
            <div className="absolute left-1 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-cyan-400 tracking-wider">270° W</div>
            <div className="absolute right-1 top-1/2 -translate-y-1/2 text-[10px] font-mono font-bold text-cyan-400 tracking-wider">090° E</div>

            {/* Radar Scope Face */}
            <div className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-[380px] md:h-[380px] rounded-full bg-[#02050e] border border-cyan-500/50 shadow-inner flex items-center justify-center overflow-hidden">
              
              {/* Polar Range Distance Grid Rings */}
              <div className="absolute inset-6 rounded-full border border-cyan-500/25 border-dashed" />
              <div className="absolute inset-16 rounded-full border border-cyan-500/30" />
              <div className="absolute inset-28 rounded-full border border-cyan-500/20 border-dashed" />
              <div className="absolute inset-40 rounded-full border border-cyan-500/30" />
              <div className="absolute inset-52 rounded-full border border-cyan-500/15" />

              {/* Range Km Labels */}
              <span className="absolute top-8 left-1/2 text-[8px] font-mono text-cyan-400/60 -translate-x-1/2">750 KM</span>
              <span className="absolute top-18 left-1/2 text-[8px] font-mono text-cyan-400/60 -translate-x-1/2">500 KM</span>
              <span className="absolute top-30 left-1/2 text-[8px] font-mono text-cyan-400/60 -translate-x-1/2">250 KM</span>
              <span className="absolute top-42 left-1/2 text-[8px] font-mono text-cyan-400/60 -translate-x-1/2">100 KM</span>

              {/* Reticle Axis Lines & Diagonal Crosshairs */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <div className="w-full h-[1px] bg-cyan-500/30" />
                <div className="h-full w-[1px] bg-cyan-500/30 absolute" />
                <div className="w-full h-[1px] bg-cyan-500/10 rotate-45 absolute" />
                <div className="w-full h-[1px] bg-cyan-500/10 -rotate-45 absolute" />
              </div>

              {/* Rotating Phosphor Beam Sweep */}
              {isScanning && (
                <div
                  className="absolute w-full h-full rounded-full pointer-events-none origin-center"
                  style={{
                    transform: `rotate(${radarAngle}deg)`,
                    background: bandStyles.sweepGradient,
                  }}
                />
              )}

              {/* Azimuth Leading Edge Line */}
              {isScanning && (
                <div
                  className="absolute w-[50%] h-[1.5px] bg-gradient-to-r from-transparent via-cyan-300 to-white origin-left pointer-events-none left-1/2 top-1/2 shadow-[0_0_10px_#00f0ff]"
                  style={{
                    transform: `rotate(${radarAngle - 90}deg)`,
                  }}
                />
              )}

              {/* Target Blips with Military Lock Indicators */}
              {targets.map((t) => {
                const angleRad = (t.angle * Math.PI) / 180;
                const x = t.distance * Math.cos(angleRad);
                const y = t.distance * Math.sin(angleRad);
                const isSelected = selectedTarget?.id === t.id;

                return (
                  <div
                    key={t.id}
                    style={{ transform: `translate(${x}px, ${y}px)` }}
                    className="absolute z-20"
                  >
                    <motion.button
                      whileHover={{ scale: 1.4 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setSelectedTarget(t)}
                      className={`relative flex items-center justify-center transition-all ${
                        isSelected ? "scale-125" : ""
                      }`}
                    >
                      {/* Active Reticle Lock Box if Selected */}
                      {isSelected && (
                        <div className="absolute -inset-3 border border-cyan-400 rounded-sm animate-pulse pointer-events-none">
                          <span className="absolute -top-1 -left-1 w-1.5 h-1.5 bg-cyan-400" />
                          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 bg-cyan-400" />
                          <span className="absolute -bottom-1 -left-1 w-1.5 h-1.5 bg-cyan-400" />
                          <span className="absolute -bottom-1 -right-1 w-1.5 h-1.5 bg-cyan-400" />
                        </div>
                      )}

                      {/* Blip Core */}
                      <span
                        className="w-3.5 h-3.5 rounded-full flex items-center justify-center shadow-lg border border-white/60"
                        style={{
                          backgroundColor: t.color,
                          boxShadow: `0 0 12px ${t.color}`
                        }}
                      >
                        <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                      </span>

                      {/* Target Mini Tag */}
                      <span 
                        className={`absolute left-4 top-1/2 -translate-y-1/2 whitespace-nowrap text-[9px] font-mono px-1.5 py-0.5 rounded backdrop-blur-md border ${
                          isSelected
                            ? "bg-cyan-950/90 text-cyan-300 border-cyan-400 font-bold"
                            : "bg-black/75 text-white/70 border-white/20"
                        }`}
                      >
                        {t.id}
                      </span>
                    </motion.button>
                  </div>
                );
              })}

              {/* Radar Center Sensor Hub */}
              <div className="relative z-30 w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-600 via-teal-400 to-white flex items-center justify-center text-black font-bold shadow-[0_0_20px_#00f0ff] border border-white">
                <Crosshair className="w-4 h-4 text-[#060a14] animate-spin-slow" />
              </div>
            </div>
          </div>

          {/* Bottom Telemetry Bar */}
          <div className="flex flex-wrap items-center justify-center gap-3 mt-4 text-xs font-mono">
            <Button
              size="sm"
              onClick={() => setIsScanning(!isScanning)}
              className={`text-xs h-8 px-3.5 font-mono gap-1.5 border transition-all ${
                isScanning
                  ? "bg-cyan-600 hover:bg-cyan-500 text-black font-bold border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                  : "bg-black/60 text-white border-white/20 hover:bg-white/10"
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              {isScanning ? "SWEEP ACTIVE (2.5°/f)" : "RESUME SWEEP"}
            </Button>

            <div className="flex items-center gap-2 bg-[#0b1329] px-3 py-1.5 rounded-xl border border-cyan-500/20 text-cyan-300 text-[11px]">
              <Radio className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
              <span>AZ: {radarAngle.toFixed(0)}°</span>
              <span className="text-white/30">|</span>
              <span>PRF: 1850 Hz</span>
              <span className="text-white/30">|</span>
              <span>GSD: 0.85m</span>
            </div>
          </div>
        </div>

        {/* Right Column: Live Target Locks & Telemetry Diagnostic HUD */}
        <div className="lg:col-span-5 flex flex-col gap-3.5">
          
          <div className="flex items-center justify-between border-b border-cyan-500/20 pb-2">
            <h3 className="text-xs font-mono font-bold text-cyan-300 uppercase tracking-wider flex items-center gap-2">
              <Target className="w-4 h-4 text-cyan-400" />
              ACQUIRED TARGET VECTORS ({targets.length})
            </h3>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-400 font-bold">
              POLAR LOCK ACTIVE
            </span>
          </div>

          {/* Interactive Target Telemetry Cards */}
          <div className="space-y-2.5 max-h-[420px] overflow-y-auto pr-1">
            {targets.map((target) => {
              const isSelected = selectedTarget?.id === target.id;
              return (
                <div
                  key={target.id}
                  onClick={() => setSelectedTarget(target)}
                  className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                    isSelected
                      ? "bg-gradient-to-r from-[#0e1d3e] to-[#071126] border-cyan-400 shadow-[0_0_20px_rgba(6,182,212,0.25)]"
                      : "bg-[#0a1020]/80 border-cyan-500/20 hover:border-cyan-500/40 hover:bg-[#0c142b]/90 text-white/80"
                  }`}
                >
                  {/* Left Accent Color Strip */}
                  <div
                    className="absolute left-0 top-0 bottom-0 w-1.5"
                    style={{ backgroundColor: target.color }}
                  />

                  <div className="flex items-center justify-between mb-1.5 pl-1.5">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-2.5 h-2.5 rounded-full animate-pulse shadow-md"
                        style={{ backgroundColor: target.color }}
                      />
                      <span className="text-xs font-bold font-mono text-cyan-300 tracking-wide">
                        {target.id}
                      </span>
                    </div>

                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-black/60 border border-cyan-500/30 text-emerald-400 font-bold">
                      {(target.confidence * 100).toFixed(1)}% CONF
                    </span>
                  </div>

                  <p className="text-xs font-semibold text-white/95 mb-2.5 pl-1.5">
                    {target.name}
                  </p>

                  {/* 4-Metric Tactical Grid */}
                  <div className="grid grid-cols-4 gap-1.5 text-[9px] font-mono bg-black/60 p-2 rounded-xl border border-white/5 pl-2">
                    <div>
                      <span className="block text-white/40">ALTITUDE</span>
                      <span className="text-cyan-300 font-bold">{target.altKm} km</span>
                    </div>
                    <div>
                      <span className="block text-white/40">VELOCITY</span>
                      <span className="text-cyan-300 font-bold">{target.speedKms} km/s</span>
                    </div>
                    <div>
                      <span className="block text-white/40">RCS (m²)</span>
                      <span className="text-amber-400 font-bold">{target.rcsM2} m²</span>
                    </div>
                    <div>
                      <span className="block text-white/40">SNR</span>
                      <span className="text-emerald-400 font-bold">+{target.snrDb} dB</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detailed Telemetry Lock Inspector for Currently Selected Target */}
          {selectedTarget && (
            <div className="p-3.5 rounded-2xl bg-gradient-to-b from-[#0e1f3d] to-[#060e20] border border-cyan-400/40 shadow-lg">
              <div className="flex items-center justify-between text-xs font-mono text-cyan-300 mb-2">
                <span className="flex items-center gap-1.5 font-bold">
                  <Crosshair className="w-3.5 h-3.5 text-cyan-400" />
                  REAL-TIME SPECTRAL DOPPLER
                </span>
                <span className="text-[10px] text-amber-300 font-bold">
                  DOPPLER: {selectedTarget.dopplerKhz > 0 ? `+${selectedTarget.dopplerKhz}` : selectedTarget.dopplerKhz} kHz
                </span>
              </div>

              {/* Dynamic Doppler Frequency Waveform Bar */}
              <div className="w-full bg-black/70 h-2.5 rounded-full overflow-hidden border border-cyan-500/30 flex items-center px-0.5">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-cyan-500 via-teal-300 to-emerald-400 animate-pulse transition-all duration-300"
                  style={{
                    width: `${Math.min(100, Math.max(20, (selectedTarget.snrDb / 50) * 100))}%`
                  }}
                />
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-white/50 mt-2">
                <span>COORDINATES: {selectedTarget.lat.toFixed(2)}° N, {selectedTarget.lon.toFixed(2)}° E</span>
                <span className="text-cyan-400 font-bold">CARRIER: L-BAND POLAR</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
