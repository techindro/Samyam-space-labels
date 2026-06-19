import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import {
  Orbit,
  Mountain,
  AlertTriangle,
  Rocket,
  FlaskConical,
  MessageSquareHeart,
  Workflow,
  ShieldCheck,
  Sparkles,
  BarChart3,
  Database,
  Gauge,
  Scale,
  Briefcase,
  Satellite,
  Radar,
  Target,
  ShieldAlert,
} from "lucide-react";
import ParallelWebBg from "@/components/ParallelWebBg";
import { supabase } from "@/integrations/supabase/client";

type FlagshipKey =
  | "datasets"
  | "evals"
  | "votes"
  | "demos"
  | "geo"
  | "fusion"
  | "sim"
  | "probes";

const flagship: {
  key: FlagshipKey;
  icon: typeof Database;
  title: string;
  desc: string;
  metricLabel: string;
  image: string;
  badge?: string;
}[] = [
  {
    key: "datasets",
    icon: Database,
    title: "Data Engine",
    desc: "Build, version, and curate annotation-ready datasets with reviewer workflows and quality scoring — the backbone of every model we train.",
    metricLabel: "datasets",
  },
  {
    key: "evals",
    icon: Gauge,
    title: "Model Evaluation",
    desc: "Run reproducible benchmarks across foundation and fine-tuned models with full metric history, regression alerts, and audit trails.",
    metricLabel: "evaluation runs",
  },
  {
    key: "votes",
    icon: Scale,
    title: "RLHF & Preferences",
    desc: "Collect pairwise human preferences at scale to align models for mission-critical accuracy, safety, and tone.",
    metricLabel: "preference votes",
  },
  {
    key: "demos",
    icon: Briefcase,
    title: "Enterprise Pipeline",
    desc: "Qualified demo requests flow into a tracked pipeline — interest tagging, status, and admin handoff for the GTM team.",
    metricLabel: "demo requests",
  },
  {
    key: "geo",
    icon: Satellite,
    title: "Geospatial Labeling",
    desc: "Annotate EO, SAR, and IR imagery at sub-pixel precision — bounding boxes, masks, and class labels for orbital and aerial training sets.",
    metricLabel: "imagery sets",
    badge: "Defense",
  },
  {
    key: "fusion",
    icon: Radar,
    title: "Sensor Fusion Datasets",
    desc: "Multi-modal records combining SAR, EO/IR, radar, and telemetry with per-modality quality scoring for robust perception stacks.",
    metricLabel: "fusion sets",
    badge: "Defense",
  },
  {
    key: "sim",
    icon: Target,
    title: "Mission Simulation",
    desc: "Scenario-based evaluation for autonomy and decision models — tracked KPI scores, pass/fail outcomes, and reviewer notes per run.",
    metricLabel: "sim runs",
    badge: "Defense",
  },
  {
    key: "probes",
    icon: ShieldAlert,
    title: "Red-Team Safety Probes",
    desc: "Adversarial prompt library with severity tiers, reviewer signoff, and mitigation status — defense-aligned safety from day one.",
    metricLabel: "safety probes",
    badge: "Defense",
  },
];

const capabilities = [
  { icon: Orbit, title: "Orbital Data Labeling", desc: "Label and annotate satellite and telescope imagery with sub-pixel accuracy for training next-gen space AI.", tag: "Core" },
  { icon: FlaskConical, title: "Benchmark Suite", desc: "Curated space and defense benchmarks with automated quality scoring and regression detection.", tag: "New" },
  { icon: MessageSquareHeart, title: "RLHF Studio", desc: "Reinforce your models with expert human feedback loops — fine-tune responses for mission-critical accuracy.", tag: "New" },
  { icon: Mountain, title: "Terrain Classification", desc: "AI-powered terrain and land-use classification from multispectral satellite data across any geography.", tag: "Core" },
  { icon: AlertTriangle, title: "Anomaly Detection", desc: "Detect anomalies in space sensor data, telemetry streams, and orbital mechanics in real time.", tag: "Core" },
  { icon: Workflow, title: "Data Curation", desc: "Automatically select, deduplicate, and balance training datasets for optimal model performance.", tag: "New" },
  { icon: Sparkles, title: "Prompt Engineering", desc: "Design, test, and optimize prompts for foundation models with built-in evaluation metrics.", tag: "New" },
  { icon: Rocket, title: "Mission Analytics", desc: "AI-driven insights for space missions — from launch windows to trajectory optimization.", tag: "Core" },
  { icon: ShieldCheck, title: "Safety & Alignment", desc: "Red-team your models with adversarial testing, bias detection, and guardrail validation.", tag: "New" },
  { icon: BarChart3, title: "Model Monitoring", desc: "Track model drift, latency, and accuracy in production with real-time dashboards.", tag: "New" },
];

const ProductsSection = () => {
  const [counts, setCounts] = useState<Record<FlagshipKey, number | null>>({
    datasets: null,
    evals: null,
    votes: null,
    demos: null,
    geo: null,
    fusion: null,
    sim: null,
    probes: null,
  });

  useEffect(() => {
    let alive = true;
    (async () => {
      const [datasetsRes, evalsRes, votesRes, geoRes, fusionRes, simRes, probesRes] =
        await Promise.all([
          supabase.from("datasets").select("id", { count: "exact", head: true }),
          supabase.from("evaluation_runs").select("id", { count: "exact", head: true }),
          supabase.from("preference_votes").select("id", { count: "exact", head: true }),
          supabase.from("geospatial_labels").select("id", { count: "exact", head: true }),
          supabase.from("sensor_fusion_datasets").select("id", { count: "exact", head: true }),
          supabase.from("mission_sim_runs").select("id", { count: "exact", head: true }),
          supabase.from("red_team_probes").select("id", { count: "exact", head: true }),
        ]);
      if (!alive) return;
      setCounts({
        datasets: datasetsRes.count ?? 0,
        evals: evalsRes.count ?? 0,
        votes: votesRes.count ?? 0,
        demos: null,
        geo: geoRes.count ?? 0,
        fusion: fusionRes.count ?? 0,
        sim: simRes.count ?? 0,
        probes: probesRes.count ?? 0,
      });
    })();
    return () => {
      alive = false;
    };
  }, []);


  return (
    <section className="py-24 relative overflow-hidden">
      <ParallelWebBg />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-teal/3 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Space Tech{" "}
            <span className="bg-gradient-to-r from-cosmic-purple-glow to-cosmic-teal bg-clip-text text-transparent">
              Products
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Eight flagship products powered by a live backend — data, evaluation, alignment, pipeline, and a defense-tailored stack for space-grade workloads.
          </p>
        </motion.div>

        {/* Flagship products — live counts from backend */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-7xl mx-auto mb-16">
          {flagship.map((p, i) => {
            const count = counts[p.key];
            return (
              <motion.div
                key={p.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 hover:border-cosmic-teal/40 transition-all group relative flex flex-col"
              >
                {p.badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cosmic-purple/20 text-cosmic-purple-glow border border-cosmic-purple/30">
                    {p.badge}
                  </span>
                )}
                <div className="p-3 rounded-lg bg-cosmic-purple/10 w-fit mb-4 group-hover:bg-cosmic-purple/20 transition-colors">
                  <p.icon className="h-6 w-6 text-cosmic-purple-glow" />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2">{p.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-5 flex-1">{p.desc}</p>
                <div className="pt-4 border-t border-border/40 flex items-baseline gap-2">
                  <span className="font-display text-2xl font-bold text-cosmic-teal tabular-nums">
                    {count === null ? "—" : count.toLocaleString()}
                  </span>
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">
                    {p.metricLabel}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>


        {/* Supporting capabilities */}
        <div className="text-center mb-8">
          <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
            Supporting capabilities
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5 max-w-7xl mx-auto">
          {capabilities.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="glass-card rounded-xl p-5 hover:border-cosmic-teal/40 transition-all group cursor-pointer relative"
            >
              {p.tag === "New" && (
                <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-cosmic-teal/20 text-cosmic-teal border border-cosmic-teal/30">
                  New
                </span>
              )}
              <div className="p-3 rounded-lg bg-cosmic-purple/10 w-fit mb-3 group-hover:bg-cosmic-purple/20 transition-colors">
                <p.icon className="h-5 w-5 text-cosmic-purple-glow" />
              </div>
              <h3 className="font-display text-base font-semibold mb-1.5">{p.title}</h3>
              <p className="text-muted-foreground text-xs leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
