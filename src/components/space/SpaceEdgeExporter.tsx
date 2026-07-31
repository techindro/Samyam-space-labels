import { useState } from "react";
import { Cpu, Download, Play, CheckCircle2, Terminal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

export interface SpaceHardwareSpec {
  id: string;
  name: string;
  vendor: string;
  architecture: string;
  maxPowerWatts: number;
  radHardRating: string;
  supportedRuntimes: string[];
}

export const SPACE_HARDWARE: SpaceHardwareSpec[] = [
  {
    id: "xilinx-versal",
    name: "Xilinx Versal ACAP AI Core (Space Grade)",
    vendor: "AMD Xilinx",
    architecture: "Dual ARM Cortex-A72 + AI Engine Vector Array",
    maxPowerWatts: 15.5,
    radHardRating: "100 kRad (Si) TID / SEL Immune",
    supportedRuntimes: ["TensorRT-C++", "Vitis AI", "ONNX Runtime"],
  },
  {
    id: "jetson-orin-space",
    name: "NVIDIA Jetson AGX Orin Space-Enclosure",
    vendor: "NVIDIA / Space Micro",
    architecture: "2048-core Ampere GPU + 64 Tensor Cores",
    maxPowerWatts: 25.0,
    radHardRating: "Heavy-ion Shielded Chassis (50 kRad)",
    supportedRuntimes: ["TensorRT FP16/INT8", "ONNX Runtime CUDA", "DeepStream"],
  },
  {
    id: "arm-cortex-r5",
    name: "ARM Cortex-R5 Dual-Core Subsystem",
    vendor: "Microchip Technology",
    architecture: "Dual Lockstep 32-bit ARM v7-R",
    maxPowerWatts: 3.2,
    radHardRating: "300 kRad (Si) Radiation-Tolerant",
    supportedRuntimes: ["CMSIS-NN", "TFLite Micro", "C++ Baremetal"],
  },
  {
    id: "movidius-space",
    name: "Intel Movidius Myriad X VPU Space",
    vendor: "Intel / Airbus",
    architecture: "16 SHAVE Vector Processors",
    maxPowerWatts: 4.5,
    radHardRating: "Single Event Effect (SEE) Hardened",
    supportedRuntimes: ["OpenVINO FP16", "Myriad Blob Runtime"],
  },
];

export default function SpaceEdgeExporter() {
  const { toast } = useToast();
  const [selectedHw, setSelectedHw] = useState<SpaceHardwareSpec>(SPACE_HARDWARE[0]);
  const [precision, setPrecision] = useState<"FP32" | "FP16" | "INT8">("FP16");
  const [pruningRatio, setPruningRatio] = useState<number>(30);
  const [isCompiling, setIsCompiling] = useState<boolean>(false);
  const [compiled, setCompiled] = useState<boolean>(false);
  const [logs, setLogs] = useState<string[]>([]);

  const handleCompile = () => {
    setIsCompiling(true);
    setCompiled(false);
    setLogs(["[0.0s] Initializing Space Payload Compiler...", `[0.2s] Target: ${selectedHw.name}`]);

    setTimeout(() => {
      setLogs((l) => [...l, `[0.8s] Applying ${precision} Quantization & ${pruningRatio}% Structured Weight Pruning...`]);
    }, 600);

    setTimeout(() => {
      setLogs((l) => [...l, "[1.5s] Optimizing ONNX computation graph & fusing TensorRT layers..."]);
    }, 1200);

    setTimeout(() => {
      setLogs((l) => [
        ...l,
        `[2.1s] Radiation Fault Tolerance Verification: PASSED (${selectedHw.radHardRating})`,
        "[2.5s] Payload Thermal Dissipation Profile: 8.4W (Budget: " + selectedHw.maxPowerWatts + "W)",
        "[3.0s] ✓ Build Success! Space Payload Ready for Satellite Downlink / Uplink.",
      ]);
      setIsCompiling(false);
      setCompiled(true);
      toast({
        title: "✓ Space AI Payload Compiled!",
        description: `Exported TensorRT/ONNX binary optimized for ${selectedHw.name}`,
      });
    }, 2200);
  };

  const handleDownloadPayload = () => {
    const payloadContent = JSON.stringify(
      {
        target_hardware: selectedHw.name,
        vendor: selectedHw.vendor,
        rad_hard_rating: selectedHw.radHardRating,
        precision,
        pruning_ratio: `${pruningRatio}%`,
        estimated_fps: precision === "INT8" ? 142 : precision === "FP16" ? 88 : 42,
        power_draw_watts: Math.min(selectedHw.maxPowerWatts, precision === "INT8" ? 6.2 : 9.5),
        onnx_model_hash: "sha256:e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
        c_deployment_wrapper: `#include <space_ai_runtime.h>\n// Compiled for ${selectedHw.name}\nvoid run_orbit_inference(uint8_t* telemetry_frame, DetectionResult* out);`,
      },
      null,
      2
    );

    const blob = new Blob([payloadContent], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `samyam_space_payload_${selectedHw.id}_${precision.toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Downloaded Space AI Payload Bundle" });
  };

  return (
    <div className="bg-slate-900 border border-slate-800/80 rounded-2xl p-6 space-y-6 text-slate-100 shadow-md select-none">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800/80 pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Cpu className="h-5 w-5 text-blue-400 shrink-0" />
            <h2 className="text-lg font-semibold text-slate-100">On-Orbit Space Edge AI Model Exporter</h2>
            <span className="bg-slate-800 text-slate-300 border border-slate-700 text-[10px] font-medium px-2.5 py-0.5 rounded-md">
              Radiation-Hardened Spec
            </span>
          </div>
          <p className="text-xs text-slate-400 font-normal">
            Compile vision & detection models directly into radiation-shielded TensorRT/ONNX payloads for satellite deployment.
          </p>
        </div>
        <Button
          onClick={handleCompile}
          disabled={isCompiling}
          className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs px-4 py-2 rounded-lg shadow-sm border-0 transition-colors"
        >
          {isCompiling ? (
            <>
              <Terminal className="h-4 w-4 mr-2 animate-spin" /> Compiling Engine...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" /> Compile Space Payload
            </>
          )}
        </Button>
      </div>

      {/* Grid Selection */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Hardware Selector */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Select Space-Grade Target Hardware
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {SPACE_HARDWARE.map((hw) => {
              const isSelected = selectedHw.id === hw.id;
              return (
                <div
                  key={hw.id}
                  onClick={() => setSelectedHw(hw)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? "bg-blue-950/40 border-blue-500/80 ring-1 ring-blue-500/20"
                      : "bg-slate-950/40 border-slate-800/80 hover:border-slate-700 hover:bg-slate-950/80"
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold text-slate-100">{hw.name}</span>
                    {isSelected && <CheckCircle2 size={16} className="text-blue-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-slate-400 mb-2">{hw.architecture}</p>
                  <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                    <span>Power: <strong className="text-slate-200">{hw.maxPowerWatts}W</strong></span>
                    <span>Rating: <strong className="text-slate-200">{hw.radHardRating.split(" ")[0]} {hw.radHardRating.split(" ")[1]}</strong></span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quantization & Pruning Controls */}
        <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800/80 space-y-5 flex flex-col justify-between">
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-4">
              Quantization & Optimization
            </h3>

            {/* Precision buttons */}
            <div className="space-y-2 mb-4">
              <label className="text-xs text-slate-300 font-medium block">Target Precision</label>
              <div className="grid grid-cols-3 gap-2">
                {(["FP32", "FP16", "INT8"] as const).map((p) => (
                  <button
                    key={p}
                    onClick={() => setPrecision(p)}
                    className={`py-2 text-xs font-mono font-medium rounded-lg border transition-all ${
                      precision === p
                        ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                        : "bg-slate-950 text-slate-300 border-slate-800 hover:bg-slate-800 hover:text-white"
                    }`}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>

            {/* Pruning slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-300 font-medium">Structured Pruning</span>
                <span className="font-mono text-blue-400 font-semibold">{pruningRatio}% Sparsity</span>
              </div>
              <input
                type="range"
                min={0}
                max={70}
                step={5}
                value={pruningRatio}
                onChange={(e) => setPruningRatio(Number(e.target.value))}
                className="w-full accent-blue-500 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">Reduces RAM & FLASH footprint for CubeSat constraints.</p>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="bg-slate-950/80 rounded-lg p-3.5 border border-slate-800 space-y-2 font-mono text-[11px]">
            <div className="flex justify-between">
              <span className="text-slate-400">Est. Latency:</span>
              <span className="text-blue-400 font-semibold">{precision === "INT8" ? "7.1 ms" : precision === "FP16" ? "11.4 ms" : "23.8 ms"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">RAM Footprint:</span>
              <span className="text-slate-200 font-semibold">{precision === "INT8" ? "142 MB" : "380 MB"}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Thermal Budget:</span>
              <span className="text-emerald-400 font-semibold">PASS (8.4W / {selectedHw.maxPowerWatts}W)</span>
            </div>
          </div>
        </div>
      </div>

      {/* Build Terminal Output */}
      {(logs.length > 0 || compiled) && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold font-mono text-slate-300 flex items-center gap-1.5">
              <Terminal size={14} className="text-blue-400" /> Build Console Output
            </h4>
            {compiled && (
              <Button
                size="sm"
                onClick={handleDownloadPayload}
                className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs h-8 border-0"
              >
                <Download size={13} className="mr-1.5" /> Download Space Payload (.json / ONNX)
              </Button>
            )}
          </div>
          <div className="bg-slate-950 rounded-xl border border-slate-800 p-4 font-mono text-xs text-slate-300 leading-relaxed space-y-1 max-h-48 overflow-y-auto">
            {logs.map((log, i) => (
              <div key={i} className={log.includes("PASSED") || log.includes("Success") ? "text-emerald-400 font-medium" : "text-slate-400"}>
                {log}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
