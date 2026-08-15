import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Radar, Radio, Shield, Target, Zap, Activity, Eye, Compass, Layers, Lock, Cpu } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SpaceTarget {
  id: string;
  name: string;
  type: "ISRO Satellite" | "Orbital Debris" | "Ground Vehicle" | "SAR Band";
  lat: number;
  lon: number;
  altKm: number;
  speedKms: number;
  confidence: number;
}

export default function SamyamSpaceRadar() {
  const [activeBand, setActiveBand] = useState<"VV" | "VH" | "L-Band" | "Optical">("VV");
  const [isScanning, setIsScanning] = useState(true);
  const [selectedTarget, setSelectedTarget] = useState<SpaceTarget | null>(null);
  const [radarAngle, setRadarAngle] = useState(0);

  const targets: SpaceTarget[] = [
    { id: "SAT-ISRO-R2A", name: "ISRO Resourcesat-2A (LISS-4)", type: "ISRO Satellite", lat: 13.0827, lon: 80.2707, altKm: 817, speedKms: 7.45, confidence: 0.98 },
    { id: "DEBRIS-LEO-482", name: "LEO Debris #482 (Sub-Decimeter)", type: "Orbital Debris", lat: 28.6139, lon: 77.209, altKm: 420, speedKms: 7.82, confidence: 0.94 },
    { id: "SAT-EOS-06", name: "Oceansat-3 (EOS-06)", type: "ISRO Satellite", lat: 19.076, lon: 72.8777, altKm: 738, speedKms: 7.51, confidence: 0.96 },
    { id: "GROUND-AUTO-01", name: "Indic Fleet Convoy (Auto-Rickshaw Grid)", type: "Ground Vehicle", lat: 12.9716, lon: 77.5946, altKm: 0, speedKms: 0.04, confidence: 0.99 },
  ];

  // Rotate radar beam
  useEffect(() => {
    if (!isScanning) return;
    const interval = setInterval(() => {
      setRadarAngle((prev) => (prev + 3) % 360);
    }, 30);
    return () => clearInterval(interval);
  }, [isScanning]);

  return (
    <div className="glass-card rounded-3xl p-6 md:p-8 border border-border/80 shadow-2xl backdrop-blur-2xl relative overflow-hidden bg-background/80">
      {/* Glow Effects */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-cosmic-purple/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-cosmic-teal/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 relative z-10 border-b border-border/40 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[10px] font-bold tracking-wider uppercase flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              LIVE MONOPOLY DEFENSE HUD
            </span>
            <span className="px-2 py-0.5 rounded bg-cosmic-purple/10 text-cosmic-purple text-[10px] font-mono border border-cosmic-purple/20">
              SAR-RADAR-V3
            </span>
          </div>
          <h2 className="text-2xl font-bold font-display tracking-tight text-foreground flex items-center gap-2">
            <Radar className="w-6 h-6 text-cosmic-teal animate-spin-slow" />
            ISRO & Orbital SAR Tactical Radar Visualizer
          </h2>
          <p className="text-xs text-muted-foreground">
            Sub-meter polarimetric synthetic aperture radar telemetry with real-time target locking.
          </p>
        </div>

        {/* Band Selector Buttons */}
        <div className="flex items-center gap-1.5 bg-secondary/50 p-1 rounded-xl border border-border/50">
          {(["VV", "VH", "L-Band", "Optical"] as const).map((band) => (
            <button
              key={band}
              onClick={() => setActiveBand(band)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeBand === band
                  ? "bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white shadow"
                  : "text-muted-foreground hover:text-foreground hover:bg-secondary"
              }`}
            >
              {band}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Layout: Tactical Radar + Target Telemetry Panel */}
      <div className="grid lg:grid-cols-12 gap-6 relative z-10 items-center">
        {/* Left Column: Interactive Radar Canvas/Sweep HUD */}
        <div className="lg:col-span-7 flex flex-col items-center justify-center relative">
          <div className="relative w-72 h-72 sm:w-80 sm:h-80 md:w-96 md:h-96 rounded-full border border-cosmic-teal/30 bg-black/60 shadow-2xl flex items-center justify-center overflow-hidden">
            {/* Radar Concentric Rings */}
            <div className="absolute inset-4 rounded-full border border-cosmic-teal/20 border-dashed" />
            <div className="absolute inset-16 rounded-full border border-cosmic-teal/20" />
            <div className="absolute inset-28 rounded-full border border-cosmic-teal/15" />
            <div className="absolute inset-40 rounded-full border border-cosmic-teal/10" />

            {/* Crosshairs */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-[1px] bg-cosmic-teal/20" />
              <div className="h-full w-[1px] bg-cosmic-teal/20 absolute" />
            </div>

            {/* Rotating Beam Sweep Sweep */}
            {isScanning && (
              <div
                className="absolute w-full h-full rounded-full pointer-events-none origin-center"
                style={{
                  transform: `rotate(${radarAngle}deg)`,
                  background: "conic-gradient(from 0deg, rgba(20, 184, 166, 0.35) 0deg, transparent 60deg, transparent 360deg)",
                }}
              />
            )}

            {/* Radar Target Blips */}
            {targets.map((t, idx) => {
              const angles = [45, 135, 220, 310];
              const distances = [60, 110, 85, 130];
              const angleRad = (angles[idx] * Math.PI) / 180;
              const r = distances[idx];
              const x = r * Math.cos(angleRad);
              const y = r * Math.sin(angleRad);

              const isSelected = selectedTarget?.id === t.id;

              return (
                <motion.button
                  key={t.id}
                  whileHover={{ scale: 1.3 }}
                  onClick={() => setSelectedTarget(t)}
                  style={{ transform: `translate(${x}px, ${y}px)` }}
                  className={`absolute w-4 h-4 rounded-full flex items-center justify-center transition-all ${
                    isSelected
                      ? "bg-cosmic-teal text-black ring-4 ring-cosmic-teal/50 z-20 scale-125"
                      : t.type === "Orbital Debris"
                      ? "bg-amber-400 text-black ring-2 ring-amber-400/40"
                      : "bg-cosmic-purple text-white ring-2 ring-cosmic-purple/40"
                  }`}
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping" />
                </motion.button>
              );
            })}

            {/* Center Satellite Core */}
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal flex items-center justify-center text-white shadow-lg border border-white/40">
              <Compass className="w-3.5 h-3.5 animate-spin-slow" />
            </div>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center gap-3 mt-4 text-xs">
            <Button
              size="sm"
              variant={isScanning ? "default" : "outline"}
              onClick={() => setIsScanning(!isScanning)}
              className="text-xs h-7 gap-1.5"
            >
              <Activity className="w-3.5 h-3.5" />
              {isScanning ? "Scanning Active" : "Resume Radar Sweep"}
            </Button>
            <span className="text-muted-foreground font-mono text-[11px]">
              FREQ: 5.405 GHz | SAR BAND: {activeBand}
            </span>
          </div>
        </div>

        {/* Right Column: Telemetry Data & Target Lock Cards */}
        <div className="lg:col-span-5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
              <Target className="w-4 h-4 text-cosmic-teal" /> Detected Space & Ground Targets
            </h3>
            <span className="text-[11px] font-mono text-cosmic-teal bg-cosmic-teal/10 px-2 py-0.5 rounded border border-cosmic-teal/20">
              4 Target Locks
            </span>
          </div>

          {targets.map((target) => {
            const isSelected = selectedTarget?.id === target.id;
            return (
              <div
                key={target.id}
                onClick={() => setSelectedTarget(target)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? "bg-cosmic-purple/15 border-cosmic-purple text-foreground shadow-lg"
                    : "bg-secondary/40 border-border/50 hover:bg-secondary/70 text-muted-foreground"
                }`}
              >
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        target.type === "Orbital Debris" ? "bg-amber-400" : "bg-cosmic-teal"
                      }`}
                    />
                    <span className="text-xs font-bold font-mono text-foreground">{target.id}</span>
                  </div>
                  <span className="text-[10px] font-mono bg-background/80 px-2 py-0.5 rounded border border-border/40 text-emerald-400">
                    {(target.confidence * 100).toFixed(1)}% Conf
                  </span>
                </div>

                <p className="text-xs font-medium text-foreground mb-2">{target.name}</p>

                <div className="grid grid-cols-3 gap-2 text-[10px] font-mono text-muted-foreground bg-black/40 p-2 rounded-xl">
                  <div>
                    <span className="block text-[9px] opacity-70">LAT/LON</span>
                    <span className="text-foreground">
                      {target.lat.toFixed(2)}°, {target.lon.toFixed(2)}°
                    </span>
                  </div>
                  <div>
                    <span className="block text-[9px] opacity-70">ALTITUDE</span>
                    <span className="text-foreground">{target.altKm} km</span>
                  </div>
                  <div>
                    <span className="block text-[9px] opacity-70">VELOCITY</span>
                    <span className="text-foreground">{target.speedKms} km/s</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
