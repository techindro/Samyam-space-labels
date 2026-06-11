import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, BarChart3, LayoutGrid, TrendingUp } from "lucide-react";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  LineChart,
  Line,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import ParallelWebBg from "@/components/ParallelWebBg";
import caseMonitoring from "@/assets/case-satellite-monitoring.jpg";
import caseDebris from "@/assets/case-debris-tracking.jpg";
import caseLabeled from "@/assets/case-labeled-images.jpg";

const cases = [
  {
    tag: "Computer Vision",
    title: "Training the Indian Road Detector",
    desc: "Curated and labeled thousands of dashcam frames from Indian streets — potholes, signage, lane breaks, mixed traffic — to fine-tune a robust road perception model now live as a demo.",
    image: caseMonitoring,
    stats: "10K+ labeled frames",
    problem:
      "Indian roads present unique perception challenges: unmarked lanes, mixed traffic (two-wheelers, auto-rickshaws, carts), erratic signage, potholes, and highly variable lighting. Off-the-shelf models trained on Western datasets fail to generalise, producing false negatives on critical obstacles.",
    approach:
      "We curated geo-diverse dash-cam footage from six Indian states, then built a multi-class annotation schema covering 14 categories (potholes, speed-breakers, lane markers, vehicle types, pedestrians, stray animals, etc.). Data was augmented with monsoon and night-time synthetic frames before fine-tuning a lightweight CNN architecture.",
    results:
      "The model was deployed as an interactive Hugging Face demo that detects and classifies road objects in real time. It is now the backbone of the Indian Road Detector live demo used by municipal planners and automotive partners for pilot evaluations.",
    metrics: [
      { label: "Annotated Frames", value: "10,200+" },
      { label: "Object Classes", value: "14" },
      { label: "mAP@0.5", value: "0.84" },
      { label: "Inference Speed", value: "~35 FPS" },
    ],
  },
  {
    tag: "Autonomous Systems",
    title: "Self-Driving Perception Stack",
    desc: "Built a multi-class annotation pipeline (vehicles, pedestrians, drivable area) that powers the Self Driving Car demo, with continuous evaluation loops on edge cases.",
    image: caseDebris,
    stats: "Edge-case evaluation",
    problem:
      "Autonomous perception models must handle edge cases: sudden jaywalkers, obscured traffic lights, construction zones, and weather-induced sensor degradation. A static dataset is insufficient — models need continuous re-evaluation as new edge cases surface.",
    approach:
      "We designed a continuous-integration annotation pipeline: every new video clip is auto-segmented, human-reviewed for edge-case flags, and fed into a rolling benchmark suite. Classes include vehicles, pedestrians, cyclists, drivable surface, traffic controls, and temporary obstacles. Active-learning heuristics prioritise low-confidence frames for relabeling.",
    results:
      "The perception stack powers the Self Driving Car live demo, demonstrating real-time detection and path planning in simulated urban environments. The pipeline has cut the time from raw footage to model update from weeks to under 48 hours.",
    metrics: [
      { label: "Pipeline Stages", value: "6" },
      { label: "Edge-Case Tags", value: "23" },
      { label: "Review Cycle", value: "< 48 hrs" },
      { label: "Model Updates", value: "Weekly" },
    ],
  },
  {
    tag: "Healthcare AI",
    title: "Health Signal Detection",
    desc: "Annotated medical imagery and signal data to train the Health Detector demo, with domain-expert review and HIPAA-aware handling baked into the workflow.",
    image: caseLabeled,
    stats: "Expert-in-the-loop",
    problem:
      "Training clinical AI requires high-quality, privacy-safe annotations. Generic crowdsourced labeling introduces dangerous errors in medical contexts, and regulatory frameworks (HIPAA, GDPR) demand strict data-handling protocols.",
    approach:
      "We built an expert-in-the-loop workflow where board-certified specialists review every annotation batch before it enters training. The pipeline uses de-identification pre-processing, encrypted storage, and role-based access. Annotation types cover symptom regions, signal anomalies, and severity gradations.",
    results:
      "The Health Detector demo showcases real-time signal analysis and visual symptom classification. The workflow has passed third-party compliance audits and is being piloted with two diagnostic-device partners for regulatory submission datasets.",
    metrics: [
      { label: "Expert Reviewers", value: "8" },
      { label: "Annotation Types", value: "6" },
      { label: "Compliance Audits", value: "2 passed" },
      { label: "Pilot Partners", value: "2" },
    ],
  },
];

// Interactive chart data per case (index-aligned with `cases`)
const caseCharts: Array<{
  bar: { title: string; unit: string; data: Array<{ name: string; value: number }> };
  line: { title: string; unit: string; data: Array<{ name: string; value: number }> };
}> = [
  {
    bar: {
      title: "Class distribution (frames)",
      unit: "frames",
      data: [
        { name: "Potholes", value: 1820 },
        { name: "Lanes", value: 2450 },
        { name: "Signs", value: 1390 },
        { name: "Vehicles", value: 2980 },
        { name: "Pedestrians", value: 1100 },
        { name: "Animals", value: 460 },
      ],
    },
    line: {
      title: "mAP@0.5 over training epochs",
      unit: "mAP",
      data: [
        { name: "E1", value: 0.42 },
        { name: "E5", value: 0.58 },
        { name: "E10", value: 0.69 },
        { name: "E15", value: 0.77 },
        { name: "E20", value: 0.82 },
        { name: "E25", value: 0.84 },
      ],
    },
  },
  {
    bar: {
      title: "Edge-case tags by category",
      unit: "tags",
      data: [
        { name: "Weather", value: 6 },
        { name: "Occlusion", value: 5 },
        { name: "Lighting", value: 4 },
        { name: "Construction", value: 3 },
        { name: "Signals", value: 3 },
        { name: "Other", value: 2 },
      ],
    },
    line: {
      title: "Review cycle time (hours)",
      unit: "hrs",
      data: [
        { name: "Wk1", value: 168 },
        { name: "Wk4", value: 110 },
        { name: "Wk8", value: 72 },
        { name: "Wk12", value: 56 },
        { name: "Wk16", value: 48 },
        { name: "Wk20", value: 42 },
      ],
    },
  },
  {
    bar: {
      title: "Annotation types reviewed",
      unit: "batches",
      data: [
        { name: "Symptom", value: 38 },
        { name: "Anomaly", value: 27 },
        { name: "Severity", value: 22 },
        { name: "Region", value: 31 },
        { name: "Signal", value: 19 },
        { name: "Other", value: 8 },
      ],
    },
    line: {
      title: "Reviewer agreement (%)",
      unit: "%",
      data: [
        { name: "M1", value: 71 },
        { name: "M2", value: 78 },
        { name: "M3", value: 84 },
        { name: "M4", value: 88 },
        { name: "M5", value: 91 },
        { name: "M6", value: 94 },
      ],
    },
  },
];

const BuildAICaseStudies = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const activeCase = openIndex !== null ? cases[openIndex] : null;

  return (
    <section className="py-24 relative overflow-hidden">
      <ParallelWebBg />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/3 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <p
            className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: "'Comfortaa', cursive" }}
          >
            case studies
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            From The{" "}
            <span className="bg-gradient-to-r from-cosmic-purple-glow to-cosmic-teal bg-clip-text text-transparent">
              AI Knowledge Hub
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Real builds powering our live demos — how curated data, evaluations, and tight model loops ship usable AI.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:border-cosmic-teal/40 transition-all"
              onClick={() => setOpenIndex(i)}
            >
              <div className="h-44 relative overflow-hidden">
                <img
                  src={c.image}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                <span className="absolute bottom-3 left-4 text-xs font-semibold text-cosmic-teal bg-background/70 px-2 py-1 rounded">
                  {c.stats}
                </span>
              </div>
              <div className="p-6">
                <Badge
                  variant="outline"
                  className="mb-3 text-cosmic-teal border-cosmic-teal/30 text-xs"
                >
                  {c.tag}
                </Badge>
                <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-cosmic-teal transition-colors">
                  {c.title}
                </h3>
                <p className="text-muted-foreground text-sm mb-4">{c.desc}</p>
                <span className="text-cosmic-teal text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read case study <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {activeCase && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/70 backdrop-blur-sm"
              onClick={() => setOpenIndex(null)}
            />

            {/* Content */}
            <motion.div
              className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Header image */}
              <div className="relative h-56 sm:h-64">
                <img
                  src={activeCase.image}
                  alt={activeCase.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <button
                  onClick={() => setOpenIndex(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/40 hover:bg-black/60 text-white transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <Badge
                    variant="outline"
                    className="mb-2 text-cosmic-teal border-cosmic-teal/30 text-xs"
                  >
                    {activeCase.tag}
                  </Badge>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white drop-shadow">
                    {activeCase.title}
                  </h3>
                </div>
              </div>

              {/* Body */}
              <div className="p-6 sm:p-8 space-y-8">
                {/* Problem */}
                <div>
                  <h4 className="text-sm font-semibold tracking-widest uppercase text-cosmic-teal mb-3">
                    Problem
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {activeCase.problem}
                  </p>
                </div>

                {/* Approach */}
                <div>
                  <h4 className="text-sm font-semibold tracking-widest uppercase text-cosmic-teal mb-3">
                    Approach
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {activeCase.approach}
                  </p>
                </div>

                {/* Results */}
                <div>
                  <h4 className="text-sm font-semibold tracking-widest uppercase text-cosmic-teal mb-3">
                    Results
                  </h4>
                  <p className="text-muted-foreground leading-relaxed">
                    {activeCase.results}
                  </p>
                </div>

                {/* Metrics */}
                <div>
                  <h4 className="text-sm font-semibold tracking-widest uppercase text-cosmic-teal mb-4">
                    Key Metrics
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                    {activeCase.metrics.map((m) => (
                      <div
                        key={m.label}
                        className="bg-muted/50 rounded-xl p-4 text-center border border-border hover:border-cosmic-teal/30 transition-colors"
                      >
                        <div className="font-display text-xl sm:text-2xl font-bold text-foreground mb-1">
                          {m.value}
                        </div>
                        <div className="text-xs text-muted-foreground uppercase tracking-wide">
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="p-6 sm:p-8 pt-0 flex justify-end">
                <button
                  onClick={() => setOpenIndex(null)}
                  className="px-6 py-2.5 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white text-sm font-semibold hover:opacity-90 transition-opacity"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default BuildAICaseStudies;
