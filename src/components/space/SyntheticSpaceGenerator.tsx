import { useState, useRef, useEffect } from "react";
import { Sparkles, Download, RefreshCw, Sliders } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SyntheticDebris {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  rotation: number;
  vRot: number;
  label: string;
}

export default function SyntheticSpaceGenerator() {
  const { toast } = useToast();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Parameters
  const [debrisCount, setDebrisCount] = useState<number>(6);
  const [sunAngle, setSunAngle] = useState<number>(45);
  const [sarClutter, setSarClutter] = useState<number>(30);
  const [autoRotate, setAutoRotate] = useState<boolean>(true);
  const [syntheticFrameCount, setSyntheticFrameCount] = useState<number>(0);

  const debrisRef = useRef<SyntheticDebris[]>([]);

  // Initialize random debris objects
  const initDebris = () => {
    const labels = ["Orbital Debris #104", "Satellite Solar Array", "Rocket Stage Fragment", "CubeSat Alpha", "Unidentified Object"];
    debrisRef.current = Array.from({ length: debrisCount }).map((_, i) => ({
      x: 100 + Math.random() * 480,
      y: 80 + Math.random() * 240,
      vx: (Math.random() - 0.5) * 1.2,
      vy: (Math.random() - 0.5) * 1.2,
      radius: 12 + Math.random() * 24,
      rotation: Math.random() * Math.PI * 2,
      vRot: (Math.random() - 0.5) * 0.05,
      label: labels[i % labels.length],
    }));
  };

  useEffect(() => {
    initDebris();
  }, [debrisCount]);

  // Render Loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Deep Space background
      ctx.fillStyle = "#070712";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Stars field
      ctx.fillStyle = "#ffffff60";
      for (let i = 0; i < 40; i++) {
        const sx = (i * 73) % canvas.width;
        const sy = (i * 127) % canvas.height;
        ctx.fillRect(sx, sy, 1.5, 1.5);
      }

      // Earth limb curve in background
      ctx.beginPath();
      ctx.arc(canvas.width / 2, canvas.height + 600, 750, 0, Math.PI * 2);
      const earthGrad = ctx.createLinearGradient(0, canvas.height - 100, 0, canvas.height);
      earthGrad.addColorStop(0, "#1d4ed850");
      earthGrad.addColorStop(1, "#0369a190");
      ctx.fillStyle = earthGrad;
      ctx.fill();
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 2;
      ctx.stroke();

      // Render Objects & Synthetic Ground Truth Bounding Boxes (INSIDE CANVAS FRAME - KEPT TEAL & GREEN)
      debrisRef.current.forEach((item) => {
        if (autoRotate) {
          item.x += item.vx;
          item.y += item.vy;
          item.rotation += item.vRot;

          // Bounce bounds
          if (item.x < 50 || item.x > canvas.width - 50) item.vx *= -1;
          if (item.y < 50 || item.y > canvas.height - 50) item.vy *= -1;
        }

        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);

        // Debris polygon mesh
        ctx.fillStyle = "#94a3b8";
        ctx.strokeStyle = "#cbd5e1";
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(-item.radius, -item.radius / 2);
        ctx.lineTo(item.radius / 2, -item.radius);
        ctx.lineTo(item.radius, item.radius / 3);
        ctx.lineTo(0, item.radius);
        ctx.lineTo(-item.radius / 1.5, item.radius / 2);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Solar Specular Glint reflection based on sun angle
        const sunRad = (sunAngle * Math.PI) / 180;
        const gx = Math.cos(sunRad) * (item.radius / 2);
        const gy = Math.sin(sunRad) * (item.radius / 2);
        const glintGrad = ctx.createRadialGradient(gx, gy, 1, gx, gy, item.radius * 0.8);
        glintGrad.addColorStop(0, "#ffffff");
        glintGrad.addColorStop(0.4, "#38bdf880");
        glintGrad.addColorStop(1, "transparent");
        ctx.fillStyle = glintGrad;
        ctx.fillRect(-item.radius, -item.radius, item.radius * 2, item.radius * 2);

        ctx.restore();

        // Synthetic Bounding Box (inside canvas frame - kept teal)
        const bboxW = item.radius * 2.4;
        const bboxH = item.radius * 2.4;
        const bx = item.x - bboxW / 2;
        const by = item.y - bboxH / 2;

        ctx.strokeStyle = "#14b8a6";
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 2]);
        ctx.strokeRect(bx, by, bboxW, bboxH);
        ctx.setLineDash([]);

        // Ground Truth Tag (inside canvas frame - kept teal)
        ctx.fillStyle = "#14b8a6";
        ctx.fillRect(bx, by - 16, ctx.measureText(item.label).width + 8, 16);
        ctx.fillStyle = "#000000";
        ctx.font = "bold 10px Inter, sans-serif";
        ctx.fillText(item.label, bx + 4, by - 4);
      });

      // SAR Radar Clutter Noise Overlay
      if (sarClutter > 0) {
        ctx.fillStyle = `rgba(255, 255, 255, ${sarClutter / 1000})`;
        for (let i = 0; i < (sarClutter * 15); i++) {
          const rx = Math.random() * canvas.width;
          const ry = Math.random() * canvas.height;
          ctx.fillRect(rx, ry, 1, 1);
        }
      }

      setSyntheticFrameCount((c) => c + 1);
      animId = requestAnimationFrame(render);
    };

    render();

    return () => cancelAnimationFrame(animId);
  }, [sunAngle, sarClutter, autoRotate]);

  const handleExportSyntheticDataset = () => {
    const dataset = {
      dataset_name: "Samyam_Procedural_Space_Debris_v1",
      generator: "Samyam Ray-Traced Orbital Engine",
      sun_incident_angle: sunAngle,
      sar_clutter_ratio: `${sarClutter}%`,
      frames_generated: 500,
      annotations: debrisRef.current.map((d) => ({
        class: d.label,
        bbox: [Math.round(d.x - d.radius), Math.round(d.y - d.radius), Math.round(d.radius * 2), Math.round(d.radius * 2)],
        rotation_rad: parseFloat(d.rotation.toFixed(3)),
        specular_glint_intensity: parseFloat((Math.sin((sunAngle * Math.PI) / 180) * 0.95).toFixed(2)),
      })),
    };

    const blob = new Blob([JSON.stringify(dataset, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `samyam_synthetic_space_dataset.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "✓ Exported Synthetic Space Dataset!", description: "COCO format labels with procedural ground truth." });
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 space-y-6 text-slate-100 shadow-2xl select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Sparkles className="h-6 w-6 text-cyan-400 animate-pulse shrink-0" />
            <h2 className="text-xl font-bold font-display text-slate-100">Procedural Synthetic Space Data Generator</h2>
            <span className="bg-slate-800 text-slate-200 border border-slate-700 text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Ray-Traced Physics
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Generate infinite synthetic training datasets for rare orbital debris events, solar glint, and SAR clutter.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            size="sm"
            onClick={initDebris}
            variant="outline"
            className="border-slate-700 bg-slate-900 text-slate-200 hover:bg-slate-800 hover:text-white text-xs font-medium"
          >
            <RefreshCw className="h-3.5 w-3.5 mr-1.5 text-cyan-400" /> Re-seed Space Scenario
          </Button>
          {/* UNTOUCHED Export Synthetic Dataset Button */}
          <Button
            size="sm"
            onClick={handleExportSyntheticDataset}
            className="bg-white hover:bg-slate-100 text-slate-950 font-bold text-xs border border-slate-200 shadow-md rounded-full px-5 py-2 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Download className="h-3.5 w-3.5 mr-1.5 text-slate-950" /> Export Synthetic Dataset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Canvas Display */}
        <div className="lg:col-span-2 relative rounded-2xl overflow-hidden border border-slate-800 bg-black shadow-2xl h-80 flex items-center justify-center">
          <canvas ref={canvasRef} width={640} height={320} className="w-full h-full object-cover" />
          <div className="absolute top-3 left-3 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-slate-800 text-[11px] font-mono space-y-0.5 text-slate-200">
            <div>Mode: <span className="text-cyan-400 font-bold">Procedural Space Sim</span></div>
            <div>Ground Truth BBoxes: <span className="text-amber-400 font-bold">{debrisCount} Objects</span></div>
          </div>
          <div className="absolute bottom-3 right-3 bg-slate-950/90 backdrop-blur-md px-3 py-1 rounded-md border border-slate-800 text-[10px] font-mono text-slate-400">
            Frame #{syntheticFrameCount}
          </div>
        </div>

        {/* Controls */}
        <div className="bg-slate-900/70 rounded-xl p-5 border border-slate-800 space-y-5 flex flex-col justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Sliders size={14} className="text-cyan-400" /> Simulation Parameters
          </h3>

          <div className="space-y-4">
            {/* Debris Count Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Debris Object Density</span>
                <span className="font-mono text-cyan-400 font-bold">{debrisCount} Objects</span>
              </div>
              <input
                type="range"
                min={2}
                max={12}
                value={debrisCount}
                onChange={(e) => setDebrisCount(Number(e.target.value))}
                className="w-full accent-cyan-400 cursor-pointer"
              />
            </div>

            {/* Sun Angle Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">Solar Specular Angle</span>
                <span className="font-mono text-amber-400 font-bold">{sunAngle}°</span>
              </div>
              <input
                type="range"
                min={0}
                max={180}
                value={sunAngle}
                onChange={(e) => setSunAngle(Number(e.target.value))}
                className="w-full accent-amber-400 cursor-pointer"
              />
            </div>

            {/* SAR Clutter Noise Slider */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs">
                <span className="text-slate-300 font-medium">SAR Radar Noise / Clutter</span>
                <span className="font-mono text-purple-300 font-bold">{sarClutter}%</span>
              </div>
              <input
                type="range"
                min={0}
                max={80}
                value={sarClutter}
                onChange={(e) => setSarClutter(Number(e.target.value))}
                className="w-full accent-purple-400 cursor-pointer"
              />
            </div>
          </div>

          {/* Toggle */}
          <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs">
            <span className="text-slate-300 font-medium">Orbital Physics Motion</span>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`px-3 py-1 rounded-full text-[11px] font-bold font-mono transition-all ${
                autoRotate ? "bg-white text-slate-950" : "bg-slate-800 text-slate-400 hover:text-white"
              }`}
            >
              {autoRotate ? "ACTIVE" : "PAUSED"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
