import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, X, BarChart3, LayoutGrid, TrendingUp, ExternalLink } from "lucide-react";
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
import { Link } from "react-router-dom";
import caseMonitoring from "@/assets/case-satellite-monitoring.jpg";
import caseDebris from "@/assets/case-debris-tracking.jpg";
import caseLabeled from "@/assets/case-labeled-images.jpg";
import ParallelWebBg from "@/components/ParallelWebBg";

const cases = [
  {
    tag: "Machine Learning & Satellite",
    title: "Satellite Health Monitoring with Samyam",
    desc: "Helping an emerging constellation operator build AI-driven health checks across their initial fleet of LEO satellites.",
    image: caseMonitoring,
    stats: "Early-stage deployment",
    href: "/research/labs",
    problem:
      "LEO satellite constellations generate gigabytes of raw telemetry and optical sensor logs every second. Identifying thermal anomalies, solar panel degradation, and thruster misfires manually leads to slow response times and orbital decay risk.",
    approach:
      "We built an automated machine learning anomaly detection pipeline using temporal transformer models fine-tuned on ISRO and NASA open satellite telemetry. The system ingests sensor feeds in real-time to flag statistical deviations.",
    results:
      "The machine learning health monitoring stack achieved 94.2% accuracy in predicting telemetry anomalies up to 48 hours before hardware failure, reducing ground team intervention overhead by 65%.",
    metrics: [
      { label: "Monitored Sensors", value: "1,400+" },
      { label: "Anomaly Precision", value: "94.2%" },
      { label: "Latency", value: "< 50 ms" },
      { label: "Lead Time", value: "48 Hours" },
    ],
  },
  {
    tag: "Defense & Computer Vision",
    title: "Orbital Debris Detection Pipeline",
    desc: "Building labeled datasets of orbital objects to train detection models for space situational awareness applications.",
    image: caseDebris,
    stats: "Custom annotation pipeline",
    href: "/research/papers",
    problem:
      "Small orbital debris fragments moving at 7.8 km/s pose catastrophic collision risks to space assets. Radar and optical tracking data suffer from high noise, sensor clutter, and unpredictable solar illumination.",
    approach:
      "Samyam constructed a 100K+ frame polarimetric SAR radar and optical fusion dataset. Convolutional object detection models (YOLOv8 & CLIP) were fine-tuned to track debris trajectories in Low Earth Orbit.",
    results:
      "Achieved sub-second debris detection with a 59% throughput speed improvement over legacy manual radar labeling pipelines.",
    metrics: [
      { label: "Labeled Objects", value: "100,000+" },
      { label: "Detection Speed", value: "510/hr" },
      { label: "False Alarm Rate", value: "< 1.2%" },
      { label: "mAP@0.5", value: "0.89" },
    ],
  },
  {
    tag: "Data Infrastructure & GIS",
    title: "Satellite Image Annotation at Scale",
    desc: "Delivering high-quality labeled satellite imagery for earth observation research with consistent annotation standards.",
    image: caseLabeled,
    stats: "100K+ images labeled",
    href: "/space-tech",
    problem:
      "Earth observation models require multi-spectral polygon segmentation across varying resolution bands (5m to 30m) covering diverse Indian terrain, monsoon conditions, and urban density.",
    approach:
      "Utilized Samyam's AI Pre-labeling engine to generate 58% of initial polygon masks automatically, followed by domain-expert GIS reviewer verification and Devanagari tag curation.",
    results:
      "Delivered over 4.5 million high-precision annotated labels across 275,000 satellite and ground driving samples with 99.1% consensus quality.",
    metrics: [
      { label: "Images Labeled", value: "100,000+" },
      { label: "Total Annotations", value: "4.5M+" },
      { label: "Quality Score", value: "99.1%" },
      { label: "Cost Savings", value: "58%" },
    ],
  },
];

const caseCharts = [
  {
    bar: {
      title: "Telemetry Sensors Monitored by Type",
      unit: "sensors",
      data: [
        { name: "Thermal", value: 420 },
        { name: "Solar Power", value: 380 },
        { name: "Thruster", value: 210 },
        { name: "Gyroscope", value: 190 },
        { name: "Downlink", value: 200 },
      ],
    },
    line: {
      title: "Anomaly Prediction Accuracy (%)",
      unit: "%",
      data: [
        { name: "Wk1", value: 72 },
        { name: "Wk2", value: 81 },
        { name: "Wk3", value: 87 },
        { name: "Wk4", value: 91 },
        { name: "Wk5", value: 94.2 },
      ],
    },
  },
  {
    bar: {
      title: "Debris Size Distribution (cm)",
      unit: "objects",
      data: [
        { name: "< 5cm", value: 3400 },
        { name: "5-10cm", value: 2800 },
        { name: "10-50cm", value: 1900 },
        { name: "> 50cm", value: 950 },
      ],
    },
    line: {
      title: "Debris Tracking Throughput (labels/hr)",
      unit: "labels",
      data: [
        { name: "Baseline", value: 320 },
        { name: "Samyam-V1", value: 410 },
        { name: "Samyam-V2", value: 480 },
        { name: "Samyam-V3", value: 510 },
      ],
    },
  },
  {
    bar: {
      title: "Geospatial Polygon Annotation Split",
      unit: "samples",
      data: [
        { name: "Satellite", value: 120000 },
        { name: "Driving", value: 80000 },
        { name: "VQA Text", value: 45000 },
        { name: "Radar SAR", value: 30000 },
      ],
    },
    line: {
      title: "Annotation Consensus Quality (%)",
      unit: "%",
      data: [
        { name: "Batch 1", value: 91.2 },
        { name: "Batch 2", value: 94.8 },
        { name: "Batch 3", value: 97.5 },
        { name: "Batch 4", value: 99.1 },
      ],
    },
  },
];

type MetricView = "cards" | "bar" | "line";

const CaseStudiesSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [metricView, setMetricView] = useState<MetricView>("cards");
  const [activeMetric, setActiveMetric] = useState<number>(0);

  useEffect(() => {
    if (openIndex !== null) {
      setMetricView("cards");
      setActiveMetric(0);
    }
  }, [openIndex]);

  const activeCase = openIndex !== null ? cases[openIndex] : null;
  const activeChart = openIndex !== null ? caseCharts[openIndex] : null;

  return (
    <section className="py-24 relative overflow-hidden">
      <ParallelWebBg />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/3 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <p
            className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4"
            style={{ fontFamily: "'Comfortaa', cursive" }}
          >
            featured case studies
          </p>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Case Studies &{" "}
            <span className="bg-gradient-to-r from-cosmic-purple-glow to-cosmic-teal bg-clip-text text-transparent">
              Resources
            </span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Click on any case study below to open detailed machine learning reports, performance metrics, and interactive charts.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {cases.map((c, i) => (
            <motion.div
              key={c.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              onClick={() => setOpenIndex(i)}
              className="glass-card rounded-xl overflow-hidden group cursor-pointer hover:border-cosmic-teal/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="h-44 relative overflow-hidden">
                  <img
                    src={c.image}
                    alt={c.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-card via-card/30 to-transparent" />
                  <span className="absolute bottom-3 left-4 text-xs font-semibold text-cosmic-teal bg-background/70 px-2 py-1 rounded border border-border/50">
                    {c.stats}
                  </span>
                </div>
                <div className="p-6">
                  <Badge variant="outline" className="mb-3 text-cosmic-teal border-cosmic-teal/30 text-xs">
                    {c.tag}
                  </Badge>
                  <h3 className="font-display text-lg font-semibold mb-2 group-hover:text-cosmic-teal transition-colors">
                    {c.title}
                  </h3>
                  <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{c.desc}</p>
                </div>
              </div>
              <div className="p-6 pt-0">
                <span className="text-cosmic-teal text-sm font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
                  Read case study & metrics <ArrowRight className="h-3.5 w-3.5" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Interactive Case Study Modal Popup */}
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
              className="absolute inset-0 bg-black/75 backdrop-blur-md"
              onClick={() => setOpenIndex(null)}
            />

            {/* Content Container */}
            <motion.div
              className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl"
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
            >
              {/* Image Header */}
              <div className="relative h-56 sm:h-64">
                <img
                  src={activeCase.image}
                  alt={activeCase.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
                <button
                  onClick={() => setOpenIndex(null)}
                  className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors border border-white/20"
                >
                  <X className="h-4 w-4" />
                </button>
                <div className="absolute bottom-4 left-6 right-6">
                  <Badge
                    variant="outline"
                    className="mb-2 text-cosmic-teal border-cosmic-teal/40 text-xs bg-black/40"
                  >
                    {activeCase.tag}
                  </Badge>
                  <h3 className="font-display text-2xl sm:text-3xl font-bold text-white drop-shadow">
                    {activeCase.title}
                  </h3>
                </div>
              </div>

              {/* Modal Body */}
              <div className="p-6 sm:p-8 space-y-8">
                <div>
                  <h4 className="text-xs font-semibold tracking-widest uppercase text-cosmic-teal mb-2">
                    Problem Statement
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {activeCase.problem}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold tracking-widest uppercase text-cosmic-teal mb-2">
                    AI & Machine Learning Approach
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {activeCase.approach}
                  </p>
                </div>

                <div>
                  <h4 className="text-xs font-semibold tracking-widest uppercase text-cosmic-teal mb-2">
                    Key Results & Impact
                  </h4>
                  <p className="text-muted-foreground leading-relaxed text-sm">
                    {activeCase.results}
                  </p>
                </div>

                {/* Metrics & Interactive Charts */}
                <div>
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <h4 className="text-xs font-semibold tracking-widest uppercase text-cosmic-teal">
                      Performance Metrics & Analytics
                    </h4>
                    <div className="inline-flex items-center gap-1 p-1 rounded-full border border-border bg-muted/40">
                      {([
                        { id: "cards" as const, label: "Metrics", Icon: LayoutGrid },
                        { id: "bar" as const, label: "Distribution", Icon: BarChart3 },
                        { id: "line" as const, label: "Accuracy Trend", Icon: TrendingUp },
                      ]).map(({ id, label, Icon }) => (
                        <button
                          key={id}
                          onClick={() => setMetricView(id)}
                          className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            metricView === id
                              ? "bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white shadow"
                              : "text-muted-foreground hover:text-foreground"
                          }`}
                        >
                          <Icon className="h-3 w-3" />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {metricView === "cards" && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {activeCase.metrics.map((m, idx) => (
                        <button
                          key={m.label}
                          onClick={() => setActiveMetric(idx)}
                          className={`bg-secondary/40 rounded-xl p-4 text-center border transition-all ${
                            activeMetric === idx
                              ? "border-cosmic-teal shadow-[0_0_15px_rgba(20,184,166,0.2)]"
                              : "border-border/50 hover:border-cosmic-teal/30"
                          }`}
                        >
                          <div className="font-display text-xl font-bold text-foreground mb-1">
                            {m.value}
                          </div>
                          <div className="text-[10px] text-muted-foreground uppercase tracking-wider">
                            {m.label}
                          </div>
                        </button>
                      ))}
                    </div>
                  )}

                  {metricView !== "cards" && activeChart && (
                    <motion.div
                      key={metricView}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-secondary/30 rounded-xl border border-border/50 p-4"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <p className="text-xs font-medium text-foreground">
                          {metricView === "bar" ? activeChart.bar.title : activeChart.line.title}
                        </p>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-mono">
                          {metricView === "bar" ? activeChart.bar.unit : activeChart.line.unit}
                        </span>
                      </div>
                      <div className="h-52 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          {metricView === "bar" ? (
                            <BarChart data={activeChart.bar.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                              <defs>
                                <linearGradient id="barGradCase" x1="0" y1="0" x2="0" y2="1">
                                  <stop offset="0%" stopColor="hsl(var(--cosmic-teal))" stopOpacity={0.95} />
                                  <stop offset="100%" stopColor="hsl(var(--cosmic-purple))" stopOpacity={0.75} />
                                </linearGradient>
                              </defs>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                              <Tooltip
                                cursor={{ fill: "hsl(var(--muted) / 0.4)" }}
                                contentStyle={{
                                  background: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: 8,
                                  fontSize: 12,
                                }}
                              />
                              <Bar dataKey="value" fill="url(#barGradCase)" radius={[6, 6, 0, 0]} />
                            </BarChart>
                          ) : (
                            <LineChart data={activeChart.line.data} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                              <YAxis tick={{ fontSize: 10, fill: "hsl(var(--muted-foreground))" }} axisLine={false} tickLine={false} />
                              <Tooltip
                                contentStyle={{
                                  background: "hsl(var(--card))",
                                  border: "1px solid hsl(var(--border))",
                                  borderRadius: 8,
                                  fontSize: 12,
                                }}
                              />
                              <Line
                                type="monotone"
                                dataKey="value"
                                stroke="hsl(var(--cosmic-teal))"
                                strokeWidth={2.5}
                                dot={{ r: 4, fill: "hsl(var(--cosmic-purple))", strokeWidth: 0 }}
                                activeDot={{ r: 6 }}
                              />
                            </LineChart>
                          )}
                        </ResponsiveContainer>
                      </div>
                    </motion.div>
                  )}
                </div>
              </div>

              {/* Modal Actions Footer */}
              <div className="p-6 sm:p-8 pt-0 flex items-center justify-between border-t border-border/30 mt-4">
                <Link
                  to={activeCase.href}
                  className="text-xs text-cosmic-teal font-medium hover:underline flex items-center gap-1"
                >
                  Explore Full Research Resource <ExternalLink size={12} />
                </Link>
                <button
                  onClick={() => setOpenIndex(null)}
                  className="px-6 py-2 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white text-xs font-semibold hover:opacity-90 transition-opacity"
                >
                  Close Case Study
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default CaseStudiesSection;
