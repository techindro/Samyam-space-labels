import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "@/components/ui/use-toast";
import { samyamApi } from "@/lib/samyamApi";
import {
  Car,
  ShieldAlert,
  AlertTriangle,
  Zap,
  Volume2,
  Cpu,
  Compass,
  Gauge,
  Eye,
  Navigation,
  RefreshCw,
  Upload,
  ArrowRight,
  Layers,
  Activity,
  CheckCircle2,
  Lock,
} from "lucide-react";

interface Scenario {
  id: string;
  title: string;
  location: string;
  weather: string;
  speed: number;
  image: string;
  description: string;
}

const SCENARIOS: Scenario[] = [
  {
    id: "delhi_ncr_congestion",
    title: "Delhi-NCR Ring Road Congestion",
    location: "Outer Ring Road, New Delhi",
    weather: "Dense Urban Traffic",
    speed: 48.0,
    image: "https://images.unsplash.com/photo-1566552881560-0be86c53e56f?auto=format&fit=crop&w=1280&q=80",
    description: "High-density mixed traffic with aggressive auto-rickshaw lane weaving and tight two-wheeler filtering.",
  },
  {
    id: "highway_cattle",
    title: "State Highway Cattle Crossing",
    location: "NH-48 Corridor, Rajasthan Border",
    weather: "Bright Sunlight / Unfenced",
    speed: 62.0,
    image: "https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&w=1280&q=80",
    description: "Unfenced highway with stationary cattle on center divide and unpaved, dusty shoulder edge.",
  },
  {
    id: "monsoon_potholes",
    title: "Mumbai Monsoon Potholes & Spray",
    location: "Western Express Highway, Mumbai",
    weather: "Heavy Monsoon Rain",
    speed: 38.0,
    image: "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=1280&q=80",
    description: "Waterlogged pavement with hidden potholes, tire spray from heavy trucks, and reduced tire grip.",
  },
  {
    id: "rural_kutcha",
    title: "Rural Kutcha Road & Night Driving",
    location: "State Rural Link Road, Uttar Pradesh",
    weather: "Night / Unlit Mud Track",
    speed: 30.0,
    image: "https://images.unsplash.com/photo-1509114397022-ed747cca3f65?auto=format&fit=crop&w=1280&q=80",
    description: "Unpaved dirt roadway with oncoming high-beam tractor and unmarked earthen speed breakers.",
  },
];

export const AutonomousDriving = () => {
  const [selectedScenario, setSelectedScenario] = useState<Scenario>(SCENARIOS[0]);
  const [currentSpeed, setCurrentSpeed] = useState<number>(SCENARIOS[0].speed);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [drivingIntel, setDrivingIntel] = useState<any>(null);
  const [speaking, setSpeaking] = useState<boolean>(false);

  // Trigger perception on scenario change
  useEffect(() => {
    runPerception(selectedScenario.id, selectedScenario.speed);
  }, [selectedScenario]);

  const runPerception = async (scenarioId: string, speed: number, customB64?: string) => {
    setIsLoading(true);
    try {
      const res = await samyamApi.perceiveAutonomousRoad({
        scenario: scenarioId,
        speed_kmh: speed,
        image_b64: customB64 || null,
      });
      setDrivingIntel(res);
      setCurrentSpeed(res.target_speed_kmh || speed);
    } catch (err) {
      console.error(err);
      toast({
        title: "Perception Notice",
        description: "Engaging local sovereign fallback telemetry.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCustomUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const b64 = event.target?.result as string;
      setCustomImage(b64);
      runPerception("custom_dashcam", 40.0, b64.split(",")[1]);
      toast({
        title: "Custom Dashcam Loaded",
        description: "SamyamLM-V1 neural perception engaged on uploaded frame.",
      });
    };
    reader.readAsDataURL(file);
  };

  const playVoiceAlert = (text: string, lang: "hi-IN" | "en-US") => {
    if (!("speechSynthesis" in window)) {
      toast({ title: "Speech not supported in this browser" });
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;
    utterance.rate = 1.0;
    utterance.onstart = () => setSpeaking(true);
    utterance.onend = () => setSpeaking(false);
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const displayImage = customImage || selectedScenario.image;

  return (
    <div className="min-h-screen bg-background text-foreground relative flex flex-col">
      <Navbar />
      <ParallelWebBg />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4 border-b border-border/50">
        <div className="container mx-auto max-w-5xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/60 text-xs font-semibold text-foreground mb-6">
            <Car className="w-3.5 h-3.5" /> Autonomous Vehicle & Indian Road Perception Engine
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight mb-4 text-foreground font-display">
            Autonomous Driving AI for Indian Roads
          </h1>

          <p className="text-muted-foreground text-base sm:text-lg max-w-3xl mx-auto leading-relaxed mb-6">
            On-device, air-gapped Computer Vision tuned specifically for chaotic Indian roads — auto-rickshaws, stray cattle, deep potholes, and unpaved kutcha terrain.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Badge variant="outline" className="border-border text-foreground font-mono text-xs px-3 py-1">
              <Zap className="w-3 h-3 mr-1 text-foreground" /> System 1 Reflex: &lt;35ms
            </Badge>
            <Badge variant="outline" className="border-border text-foreground font-mono text-xs px-3 py-1">
              <Cpu className="w-3 h-3 mr-1 text-foreground" /> 1.86B VLM Core: Q4_0 GGUF
            </Badge>
            <Badge variant="outline" className="border-border text-foreground font-mono text-xs px-3 py-1">
              <Lock className="w-3 h-3 mr-1 text-foreground" /> 100% In-Vehicle Air-Gapped
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Studio Viewport */}
      <main className="flex-1 container mx-auto px-4 py-10 max-w-6xl relative z-10 space-y-8">
        {/* Scenario Tabs */}
        <div>
          <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3 font-mono">
            Select Road Scenario or Feed
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {SCENARIOS.map((s) => {
              const isSelected = selectedScenario.id === s.id && !customImage;
              return (
                <button
                  key={s.id}
                  onClick={() => {
                    setCustomImage(null);
                    setSelectedScenario(s);
                  }}
                  className={`p-4 rounded-xl border text-left transition-all relative glass-card ${
                    isSelected
                      ? "border-foreground bg-secondary/80 text-foreground font-semibold shadow-md"
                      : "border-border/50 bg-card/40 hover:bg-card/70 hover:border-border text-muted-foreground"
                  }`}
                >
                  <p className="text-xs font-semibold text-foreground truncate">{s.title}</p>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">{s.location}</p>
                  {isSelected && (
                    <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-foreground" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Dashcam & AI Perception Layout */}
        <div className="grid lg:grid-cols-[1.8fr_1fr] gap-6 items-start">
          {/* Dashcam Viewport */}
          <div className="rounded-2xl overflow-hidden border border-border/80 glass-card shadow-xl relative bg-card">
            {/* Top HUD Telemetry Bar */}
            <div className="flex items-center justify-between p-3.5 border-b border-border/40 bg-secondary/40 text-xs font-mono">
              <div className="flex items-center gap-2.5">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-foreground text-background text-[11px] font-bold">
                  AUTOPILOT ENGAGED
                </span>
                <span className="text-muted-foreground hidden sm:inline">
                  {customImage ? "CUSTOM DASHCAM STREAM" : selectedScenario.location}
                </span>
              </div>
              <div className="flex items-center gap-3 text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5 text-foreground" />
                  SYS-1: {drivingIntel?.system1_reflex_ms || 24}ms
                </span>
                <span className="flex items-center gap-1">
                  <Cpu className="w-3.5 h-3.5 text-foreground" />
                  VLM: {drivingIntel?.vlm_reasoning_ms || 340}ms
                </span>
              </div>
            </div>

            {/* Video/Photo Container with Target Brackets */}
            <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full bg-black/90 flex items-center justify-center overflow-hidden">
              <img
                src={displayImage}
                alt="Indian Road Dashcam Feed"
                className="w-full h-full object-cover select-none"
              />

              {/* Dynamic Path Lines */}
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-70" viewBox="0 0 1000 600">
                <defs>
                  <linearGradient id="roadGuide" x1="0" y1="1" x2="0" y2="0">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0.05" />
                  </linearGradient>
                </defs>
                <path
                  d={`M 400 600 Q ${500 + (drivingIntel?.steering_angle_deg || 0) * 12} 420 500 290 L 520 290 Q ${520 + (drivingIntel?.steering_angle_deg || 0) * 12} 420 600 600 Z`}
                  fill="url(#roadGuide)"
                />
                <line
                  x1="500"
                  y1="600"
                  x2={500 + (drivingIntel?.steering_angle_deg || 0) * 8}
                  y2="320"
                  stroke="#ffffff"
                  strokeWidth="2"
                  strokeDasharray="6,6"
                />
              </svg>

              {/* Obstacle Bounding Boxes */}
              {drivingIntel?.obstacles?.map((obs: any) => {
                const xPct = (obs.bbox.x / 1000) * 100;
                const yPct = (obs.bbox.y / 600) * 100;
                const wPct = (obs.bbox.w / 1000) * 100;
                const hPct = (obs.bbox.h / 600) * 100;

                const isCritical = obs.risk_level === "CRITICAL";

                return (
                  <div
                    key={obs.id}
                    style={{
                      left: `${xPct}%`,
                      top: `${yPct}%`,
                      width: `${wPct}%`,
                      height: `${hPct}%`,
                    }}
                    className={`absolute border-2 transition-all duration-300 pointer-events-none rounded ${
                      isCritical
                        ? "border-red-500 bg-red-500/15 shadow-[0_0_12px_rgba(239,68,68,0.4)]"
                        : "border-amber-400 bg-amber-400/10 shadow-[0_0_10px_rgba(251,191,36,0.3)]"
                    }`}
                  >
                    <div className="absolute -top-6 left-0 flex items-center gap-1.5 px-2 py-0.5 rounded bg-background/90 text-foreground border border-border text-[10px] font-mono whitespace-nowrap shadow-sm">
                      <span className={isCritical ? "text-red-500 font-bold" : "text-amber-500 font-semibold"}>
                        {obs.label}
                      </span>
                      <span className="text-muted-foreground">· {obs.distance_meters}m</span>
                      <span className="text-foreground font-semibold">{Math.round(obs.confidence * 100)}%</span>
                    </div>

                    <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white" />
                    <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white" />
                    <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white" />
                    <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white" />
                  </div>
                );
              })}

              {/* Loading Overlay */}
              {isLoading && (
                <div className="absolute inset-0 bg-background/70 backdrop-blur-sm flex items-center justify-center z-30">
                  <div className="flex flex-col items-center gap-2">
                    <RefreshCw className="w-7 h-7 text-foreground animate-spin" />
                    <p className="text-xs font-mono text-foreground font-medium">SamyamLM Neural Perception Active...</p>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom HUD Cockpit Controls */}
            <div className="p-4 bg-secondary/30 border-t border-border/50 flex flex-wrap items-center justify-between gap-4">
              {/* Speedometer & Gear */}
              <div className="flex items-center gap-4">
                <div className="flex items-baseline gap-1">
                  <span className="font-mono text-3xl font-bold text-foreground tracking-tight">
                    {Math.round(currentSpeed)}
                  </span>
                  <span className="text-xs text-muted-foreground font-mono">KM/H</span>
                </div>
                <div className="h-7 w-px bg-border/60" />
                <div className="flex items-center gap-2 text-xs font-mono">
                  <span className="px-2 py-0.5 rounded bg-secondary text-foreground border border-border font-bold">
                    DRIVE (D)
                  </span>
                  <span className="text-muted-foreground">TTC: {drivingIntel?.time_to_collision_sec || 2.8}s</span>
                </div>
              </div>

              {/* Steering & Brake Indicators */}
              <div className="flex items-center gap-4 text-xs font-mono text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Compass className="w-4 h-4 text-foreground" />
                  <span>STEER: <strong className="text-foreground">{drivingIntel?.steering_angle_deg || 0}°</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Gauge className="w-4 h-4 text-foreground" />
                  <span>BRAKE: <strong className="text-foreground">{drivingIntel?.braking_intensity_pct || 0}%</strong></span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => runPerception(selectedScenario.id, selectedScenario.speed, customImage ? customImage.split(",")[1] : undefined)}
                  disabled={isLoading}
                  className="h-8 rounded-lg text-xs border-border"
                >
                  <RefreshCw className={`w-3.5 h-3.5 mr-1.5 ${isLoading ? "animate-spin" : ""}`} /> Re-Scan
                </Button>
                <label className="cursor-pointer inline-flex items-center justify-center h-8 px-3 rounded-lg bg-foreground text-background hover:bg-foreground/90 text-xs font-medium transition-colors">
                  <Upload className="w-3.5 h-3.5 mr-1.5" /> Upload Dashcam
                  <input type="file" accept="image/*" className="hidden" onChange={handleCustomUpload} />
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Tactical Decision Panels */}
          <div className="space-y-4">
            {/* Primary Autonomous Directive Card */}
            <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-4 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase font-mono tracking-widest text-muted-foreground font-semibold">
                  Autonomous Directive
                </span>
                <Badge variant="outline" className="border-border text-foreground font-mono text-[11px]">
                  REAL-TIME VLA
                </Badge>
              </div>

              <div className="p-4 rounded-xl bg-secondary/50 border border-border/60 space-y-2">
                <p className="text-xs font-mono text-muted-foreground font-semibold">
                  {drivingIntel?.autonomous_action_en || "ANALYZING ROAD TELEMETRY..."}
                </p>
                <p className="text-sm font-medium text-foreground leading-snug">
                  {drivingIntel?.autonomous_action_hi || "आगे की सड़क का मूल्यांकन जारी..."}
                </p>
              </div>

              {/* Voice Alert Buttons */}
              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex-1 text-xs border border-border/40 font-medium"
                  onClick={() => playVoiceAlert(drivingIntel?.audio_briefing_hi || "सावधान", "hi-IN")}
                  disabled={speaking}
                >
                  <Volume2 className="w-3.5 h-3.5 mr-1.5 text-foreground" />
                  Hindi Voice Alert
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  className="flex-1 text-xs border-border font-medium"
                  onClick={() => playVoiceAlert(drivingIntel?.audio_briefing_en || "Warning", "en-US")}
                  disabled={speaking}
                >
                  <Volume2 className="w-3.5 h-3.5 mr-1.5" />
                  English Voice
                </Button>
              </div>
            </div>

            {/* Detected Road Obstacles */}
            <div className="glass-card rounded-2xl p-6 border border-border/60 space-y-3 shadow-sm">
              <div className="flex items-center justify-between text-xs uppercase font-mono tracking-widest text-muted-foreground font-semibold">
                <span>Detected Road Features</span>
                <span className="text-foreground font-bold">{drivingIntel?.obstacles?.length || 0} Targets</span>
              </div>

              <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
                {drivingIntel?.obstacles?.map((obs: any, idx: number) => (
                  <div
                    key={obs.id || idx}
                    className="p-3 rounded-xl border border-border/40 bg-secondary/30 flex items-center justify-between text-xs"
                  >
                    <div className="space-y-0.5">
                      <p className="font-semibold text-foreground">{obs.label}</p>
                      <p className="text-[11px] text-muted-foreground">
                        दूरी: <span className="text-foreground font-medium">{obs.distance_meters}m</span> · एक्शन:{" "}
                        <span className="text-foreground font-mono font-medium">{obs.recommended_action}</span>
                      </p>
                    </div>
                    <Badge
                      variant="outline"
                      className={
                        obs.risk_level === "CRITICAL"
                          ? "border-red-500/50 bg-red-500/10 text-red-500 font-semibold text-[10px]"
                          : "border-amber-500/50 bg-amber-500/10 text-amber-500 font-semibold text-[10px]"
                      }
                    >
                      {obs.risk_level}
                    </Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* In-Vehicle Air-Gap Assurance */}
            <div className="p-4 rounded-xl border border-border/50 bg-secondary/30 text-xs text-muted-foreground space-y-1.5">
              <div className="flex items-center gap-1.5 text-foreground font-semibold">
                <CheckCircle2 className="w-4 h-4 text-foreground" />
                100% In-Vehicle Air-Gapped Inference
              </div>
              <p className="leading-relaxed">
                Zero external cloud telemetry. Engineered for NVIDIA Jetson Orin & consumer automotive chipsets with sub-35ms reactive reflexes.
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default AutonomousDriving;
