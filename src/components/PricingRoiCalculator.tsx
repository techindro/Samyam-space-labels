import { useState } from "react";
import { motion } from "framer-motion";
import { Calculator, Clock, IndianRupee, Zap, ShieldCheck, Sparkles, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

type DataType = "satellite" | "sar" | "audio" | "document";

interface DataTypeOption {
  id: DataType;
  label: string;
  unit: string;
  manualCostPerUnit: number; // in INR
  samyamCostPerUnit: number; // in INR
  manualMinsPerUnit: number;
  samyamSecsPerUnit: number;
  iconName: string;
}

const dataTypeOptions: DataTypeOption[] = [
  {
    id: "satellite",
    label: "Satellite & Aerial BBox/Polygon",
    unit: "images",
    manualCostPerUnit: 25,
    samyamCostPerUnit: 4.5,
    manualMinsPerUnit: 6,
    samyamSecsPerUnit: 1.2,
    iconName: "🛰️",
  },
  {
    id: "sar",
    label: "SAR Radar & Multispectral Bands",
    unit: "frames",
    manualCostPerUnit: 35,
    samyamCostPerUnit: 6.0,
    manualMinsPerUnit: 10,
    samyamSecsPerUnit: 1.8,
    iconName: "📡",
  },
  {
    id: "audio",
    label: "Indic Voice AI & Speech-to-Text",
    unit: "audio mins",
    manualCostPerUnit: 18,
    samyamCostPerUnit: 1.8,
    manualMinsPerUnit: 4,
    samyamSecsPerUnit: 0.5,
    iconName: "🎙️",
  },
  {
    id: "document",
    label: "Defense & Spec Document OCR",
    unit: "pages",
    manualCostPerUnit: 15,
    samyamCostPerUnit: 3.0,
    manualMinsPerUnit: 5,
    samyamSecsPerUnit: 0.8,
    iconName: "📄",
  },
];

export default function PricingRoiCalculator() {
  const [selectedType, setSelectedType] = useState<DataType>("satellite");
  const [volume, setVolume] = useState<number>(100000); // Default 100,000 items

  const activeOption = dataTypeOptions.find((d) => d.id === selectedType)!;

  // Cost Calculations
  const manualTotalCost = Math.round(volume * activeOption.manualCostPerUnit);
  const samyamTotalCost = Math.round(volume * activeOption.samyamCostPerUnit);
  const savingsINR = manualTotalCost - samyamTotalCost;
  const savingsPercentage = Math.round(((manualTotalCost - samyamTotalCost) / manualTotalCost) * 100);

  // Time Calculations (in hours)
  const manualTotalHours = Math.round((volume * activeOption.manualMinsPerUnit) / 60);
  const manualDays = (manualTotalHours / 8).toFixed(1); // 8-hour workdays

  const samyamTotalHours = ((volume * activeOption.samyamSecsPerUnit) / 3600).toFixed(1);

  const formatLakhsCrores = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    }
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} Lakhs`;
    }
    return `₹${amount.toLocaleString("en-IN")}`;
  };

  const formatVolumeDisplay = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)} Million`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toLocaleString();
  };

  return (
    <section className="py-20 relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-5xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 mb-3 px-3.5 py-1 rounded-full border border-cosmic-purple/30 bg-cosmic-purple/10 text-cosmic-purple-glow text-xs font-semibold uppercase tracking-wider">
            <Calculator size={13} />
            <span>Interactive ROI & Savings Estimator</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
            Calculate Your{" "}
            <span className="bg-gradient-to-r from-cosmic-teal via-cosmic-purple-glow to-cosmic-teal bg-clip-text text-transparent">
              Cost & Time Savings
            </span>
          </h2>
          <p className="text-muted-foreground text-sm max-w-xl mx-auto">
            See how much time and money Samyam's satellite data labeling platform saves compared to manual in-house labeling.
          </p>
        </motion.div>

        {/* Main Calculator Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-card rounded-2xl p-6 md:p-10 border border-border/60 shadow-2xl relative overflow-hidden"
        >
          <div className="grid lg:grid-cols-12 gap-8 items-stretch">
            {/* Left Controls Column */}
            <div className="lg:col-span-6 space-y-6 flex flex-col justify-between">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3 block">
                  1. Select Data Type & Domain
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {dataTypeOptions.map((opt) => {
                    const isSelected = opt.id === selectedType;
                    return (
                      <button
                        key={opt.id}
                        onClick={() => setSelectedType(opt.id)}
                        className={`p-3 rounded-xl text-left border transition-all flex items-start gap-2.5 ${
                          isSelected
                            ? "bg-gradient-to-r from-cosmic-purple/20 to-cosmic-teal/20 border-cosmic-teal/60 text-foreground font-semibold shadow-md"
                            : "bg-secondary/40 border-border/40 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                        }`}
                      >
                        <span className="text-xl">{opt.iconName}</span>
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-semibold leading-tight truncate">{opt.label}</div>
                          <div className="text-[10px] text-muted-foreground/80 mt-0.5">Per {opt.unit}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    2. Select Volume ({activeOption.unit})
                  </label>
                  <span className="text-base font-bold font-display text-cosmic-teal">
                    {formatVolumeDisplay(volume)} {activeOption.unit}
                  </span>
                </div>

                <input
                  type="range"
                  min={10000}
                  max={2000000}
                  step={10000}
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  className="w-full h-2.5 bg-secondary rounded-lg appearance-none cursor-pointer accent-cosmic-teal"
                />

                <div className="flex justify-between text-[11px] text-muted-foreground mt-2 font-mono">
                  <span>10K</span>
                  <span>250K</span>
                  <span>500K</span>
                  <span>1M</span>
                  <span>2M+</span>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-secondary/30 border border-border/40 text-xs space-y-1.5 text-muted-foreground">
                <div className="flex items-center gap-2 text-foreground font-semibold">
                  <ShieldCheck size={14} className="text-cosmic-teal" />
                  <span>Quality & SLA Guarantee</span>
                </div>
                <p>
                  Includes multi-reviewer validation, COCO/YOLO schema verification, and 99.4% precision SLAs.
                </p>
              </div>
            </div>

            {/* Right Output ROI Cards Column */}
            <div className="lg:col-span-6 bg-gradient-to-b from-secondary/50 via-background to-secondary/30 rounded-xl p-6 border border-border/50 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between border-b border-border/50 pb-4 mb-5">
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Estimated ROI Summary
                  </span>
                  <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-bold border border-emerald-500/20">
                    ⚡ {savingsPercentage}% Cost Reduction
                  </span>
                </div>

                {/* Comparison Grid */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Manual Cost Card */}
                  <div className="p-4 rounded-xl bg-background/80 border border-border/50 space-y-1">
                    <span className="text-[11px] font-semibold text-muted-foreground block">Traditional In-House</span>
                    <div className="text-xl font-bold font-display text-rose-400">
                      {formatLakhsCrores(manualTotalCost)}
                    </div>
                    <div className="text-[11px] text-muted-foreground flex items-center gap-1">
                      <Clock size={11} /> {manualDays} workdays ({manualTotalHours} hrs)
                    </div>
                  </div>

                  {/* Samyam Cost Card */}
                  <div className="p-4 rounded-xl bg-gradient-to-br from-cosmic-purple/20 to-cosmic-teal/20 border border-cosmic-teal/40 space-y-1">
                    <span className="text-[11px] font-bold text-cosmic-teal block">With Samyam Engine</span>
                    <div className="text-xl font-bold font-display text-emerald-400">
                      {formatLakhsCrores(samyamTotalCost)}
                    </div>
                    <div className="text-[11px] text-cosmic-teal/90 flex items-center gap-1 font-semibold">
                      <Zap size={11} /> Just {samyamTotalHours} hours
                    </div>
                  </div>
                </div>

                {/* Big Savings Highlight */}
                <div className="p-5 rounded-xl bg-gradient-to-r from-emerald-500/10 via-cosmic-teal/10 to-cosmic-purple/10 border border-emerald-500/30 text-center space-y-1 mb-6 shadow-inner">
                  <span className="text-xs font-semibold uppercase tracking-wider text-emerald-400 block">
                    Total Net Savings
                  </span>
                  <div className="text-3xl font-extrabold font-display bg-gradient-to-r from-emerald-400 via-teal-300 to-emerald-200 bg-clip-text text-transparent">
                    {formatLakhsCrores(savingsINR)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Accelerates your model deployment time by{" "}
                    <span className="text-foreground font-bold">{Math.round((manualTotalHours - Number(samyamTotalHours)) / 24)} days</span>!
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Link to="/book-demo">
                  <Button className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white hover:opacity-90 font-bold">
                    <Sparkles size={15} className="mr-2" /> Start Annotating & Saving Now <ArrowRight size={15} className="ml-2" />
                  </Button>
                </Link>
                <div className="text-center text-[11px] text-muted-foreground">
                  Custom SLAs and dedicated GPU nodes available for ISRO, DRDO & ITAR workloads.
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
