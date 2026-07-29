import { useParams, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, Download, CheckCircle2, Cpu, Database, Play, Sparkles, Layers, Shield } from "lucide-react";
import caseMonitoring from "@/assets/case-satellite-monitoring.jpg";
import caseDebris from "@/assets/case-debris-tracking.jpg";
import caseLabeled from "@/assets/case-labeled-images.jpg";

interface CaseDetail {
  slug: string;
  tag: string;
  title: string;
  subtitle: string;
  image: string;
  stats: string;
  date: string;
  author: string;
  abstract: string;
  problem: string;
  architecture: string;
  codeSnippet: string;
  datasetMetrics: { label: string; value: string }[];
  results: string;
  demoUrl: string;
}

const caseData: Record<string, CaseDetail> = {
  "machine-learning": {
    slug: "machine-learning",
    tag: "Machine Learning & Satellite AI",
    title: "Machine Learning for Satellite Telemetry & Health Monitoring",
    subtitle: "How SamyamLM uses temporal transformer models and PyTorch 2.0 to predict LEO satellite anomalies 48 hours before hardware failure.",
    image: caseMonitoring,
    stats: "94.2% Anomaly Precision",
    date: "June 2026",
    author: "Samyam AI Engineering Team",
    abstract:
      "Low Earth Orbit (LEO) satellite constellations transmit massive streams of high-dimensional telemetry. Manual monitoring often misses pre-failure thermal spikes and power degradation signals. In this case study, we demonstrate an end-to-end Machine Learning pipeline that automates anomaly detection across 1,400+ satellite sensors.",
    problem:
      "Constellation operators face catastrophic risks when reaction reaction wheels fail or batteries overheat in orbit. Traditional threshold alerts trigger hundreds of false alarms, obscuring real critical anomalies until telemetry downlinks fail completely.",
    architecture:
      "Our architecture couples a temporal transformer encoder with a PyTorch zero-shot classification module. Multi-spectral sensor logs (thermal, voltage, attitude control, thruster pressure) are normalized and evaluated in 50ms windows using ISRO Resourcesat-2A telemetry baselines.",
    codeSnippet: `import torch
import torch.nn as nn
from transformers import CLIPModel, CLIPProcessor

class SamyamSatelliteHealthModel(nn.Module):
    def __init__(self, num_sensors=1400, hidden_dim=512):
        super().__init__()
        self.encoder = nn.TransformerEncoder(
            nn.TransformerEncoderLayer(d_model=hidden_dim, nhead=8),
            num_layers=6
        )
        self.classifier = nn.Sequential(
            nn.Linear(hidden_dim, 128),
            nn.ReLU(),
            nn.Linear(128, 2) # [Normal, Anomaly]
        )

    def forward(self, x):
        features = self.encoder(x)
        logits = self.classifier(features.mean(dim=1))
        return torch.softmax(logits, dim=-1)`,
    datasetMetrics: [
      { label: "Sensors Monitored", value: "1,400+" },
      { label: "Anomaly Precision", value: "94.2%" },
      { label: "Inference Latency", value: "< 50 ms" },
      { label: "Early Warning Window", value: "48 Hours" },
    ],
    results:
      "In deployment across LEO test constellations, Samyam Machine Learning engine achieved a 94.2% precision rate with zero false negatives on critical thermal events, reducing operational ground response times by 65%.",
    demoUrl: "/annotate/demo",
  },
  "satellite-health": {
    slug: "satellite-health",
    tag: "Machine Learning & Satellite AI",
    title: "Satellite Health Monitoring with Samyam",
    subtitle: "Automated anomaly detection across LEO satellite constellations using temporal transformer neural networks.",
    image: caseMonitoring,
    stats: "Early-Stage Deployment",
    date: "June 2026",
    author: "Samyam AI Engineering Team",
    abstract:
      "Low Earth Orbit (LEO) satellite constellations transmit massive streams of high-dimensional telemetry. Manual monitoring often misses pre-failure thermal spikes and power degradation signals. In this case study, we demonstrate an end-to-end Machine Learning pipeline that automates anomaly detection across 1,400+ satellite sensors.",
    problem:
      "Constellation operators face catastrophic risks when reaction wheels fail or batteries overheat in orbit. Traditional threshold alerts trigger hundreds of false alarms, obscuring real critical anomalies until telemetry downlinks fail completely.",
    architecture:
      "Our architecture couples a temporal transformer encoder with a PyTorch zero-shot classification module. Multi-spectral sensor logs are normalized and evaluated in 50ms windows using ISRO Resourcesat-2A telemetry baselines.",
    codeSnippet: `import torch
from python.app.model_inference import clip_engine

# Run zero-shot anomaly classification
results = clip_engine.zero_shot_classify(
    image_url="https://images.unsplash.com/photo-1518770660439-4636190af475",
    candidate_labels=["Normal Telemetry", "Thermal Degradation", "Solar Panel Alignment Failure"]
)
print("ML Detection Scores:", results)`,
    datasetMetrics: [
      { label: "Sensors Monitored", value: "1,400+" },
      { label: "Anomaly Precision", value: "94.2%" },
      { label: "Inference Latency", value: "< 50 ms" },
      { label: "Early Warning Window", value: "48 Hours" },
    ],
    results:
      "Samyam Machine Learning engine achieved a 94.2% precision rate with zero false negatives on critical thermal events, reducing operational ground response times by 65%.",
    demoUrl: "/annotate/demo",
  },
  "orbital-debris": {
    slug: "orbital-debris",
    tag: "Defense & Computer Vision",
    title: "Orbital Debris Detection Pipeline",
    subtitle: "Sub-meter polarimetric SAR radar and optical fusion for space situational awareness.",
    image: caseDebris,
    stats: "Custom Annotation Pipeline",
    date: "May 2026",
    author: "Defense AI Division",
    abstract:
      "Tracking sub-decimeter orbital debris moving at 7.8 km/s is essential for satellite protection. This case study details our 100K+ frame SAR radar and optical sensor fusion dataset.",
    problem:
      "Small orbital debris fragments produce faint radar signatures against cosmic background noise, rendering traditional detection pipelines unreliable.",
    architecture:
      "Multi-modal fusion pipeline processing ISRO Resourcesat-2A and SAR radar imagery with YOLOv8 and CLIP ViT-B/32 backbone.",
    codeSnippet: `# Fast API Endpoint call for Debris Detection
curl -X POST "https://samyam-engine.vercel.app/api/v1/prelabel/clip" \\
     -H "Content-Type: application/json" \\
     -d '{"image_url":"https://example.com/sar_radar.tif","candidate_labels":["Debris","Satellite","Clutter"]}'`,
    datasetMetrics: [
      { label: "Labeled Objects", value: "100,000+" },
      { label: "Throughput", value: "510 labels/hr" },
      { label: "False Alarm Rate", value: "< 1.2%" },
      { label: "mAP@0.5", value: "0.89" },
    ],
    results:
      "Achieved sub-second debris detection with a 59% throughput speed improvement over legacy manual radar labeling pipelines.",
    demoUrl: "/annotate/demo",
  },
  "satellite-annotation": {
    slug: "satellite-annotation",
    tag: "Data Infrastructure & GIS",
    title: "Satellite Image Annotation at Scale",
    subtitle: "High-precision Indic multi-spectral polygon segmentation across 275,000+ geographical tiles.",
    image: caseLabeled,
    stats: "100K+ Images Labeled",
    date: "April 2026",
    author: "Geospatial Data Engineering",
    abstract:
      "Delivering high-quality labeled satellite imagery for earth observation research with consistent annotation standards and Devanagari multi-lingual tags.",
    problem:
      "Manual polygon mask creation for complex Indian terrain and monsoon road networks required prohibitive labor costs and long delivery timelines.",
    architecture:
      "Automated pre-labeling with CLIP zero-shot models followed by GIS reviewer consensus verification.",
    codeSnippet: `from samyam import IsroRasterPipeline

pipeline = IsroRasterPipeline()
bands = pipeline.process_multispectral_bands(tiff_bytes=raw_data)
print("Extracted Bands:", bands["bands_extracted"])`,
    datasetMetrics: [
      { label: "Images Labeled", value: "100,000+" },
      { label: "Total Annotations", value: "4.5M+" },
      { label: "Quality Score", value: "99.1%" },
      { label: "Cost Savings", value: "58%" },
    ],
    results:
      "Delivered over 4.5 million high-precision annotated labels across 275,000 satellite and ground driving samples with 99.1% consensus quality.",
    demoUrl: "/annotate/demo",
  },
};

export default function CaseStudyDetail() {
  const { slug } = useParams<{ slug: string }>();
  
  // Default to machine-learning case study if slug missing or generic
  const study = caseData[slug ?? "machine-learning"] || caseData["machine-learning"];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between">
      <div>
        <Navbar />

        <main className="py-16 relative overflow-hidden">
          <ParallelWebBg />
          
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            {/* Back Button */}
            <Link
              to="/build-ai"
              className="inline-flex items-center gap-2 text-xs font-medium text-muted-foreground hover:text-foreground mb-8 transition-colors"
            >
              <ArrowLeft size={14} /> Back to Case Studies & Demos
            </Link>

            {/* Header */}
            <div className="mb-10">
              <Badge variant="outline" className="mb-4 text-cosmic-teal border-cosmic-teal/40 text-xs px-3 py-1">
                {study.tag}
              </Badge>
              <h1 className="font-display text-3xl sm:text-5xl font-bold mb-4 tracking-tight leading-tight">
                {study.title}
              </h1>
              <p className="text-muted-foreground text-base sm:text-lg leading-relaxed mb-6">
                {study.subtitle}
              </p>
              
              <div className="flex flex-wrap items-center gap-6 text-xs text-muted-foreground border-y border-border/40 py-4">
                <div>Published: <span className="text-foreground font-medium">{study.date}</span></div>
                <div>Author: <span className="text-foreground font-medium">{study.author}</span></div>
                <div>Status: <span className="text-cosmic-teal font-medium">{study.stats}</span></div>
              </div>
            </div>

            {/* Hero Banner Image */}
            <div className="rounded-2xl overflow-hidden mb-12 border border-border/60 shadow-xl relative h-72 sm:h-96">
              <img src={study.image} alt={study.title} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-14">
              {study.datasetMetrics.map((m) => (
                <div key={m.label} className="glass-card p-5 rounded-2xl border border-border/50 text-center">
                  <div className="font-display text-2xl font-bold text-foreground mb-1">{m.value}</div>
                  <div className="text-[11px] text-muted-foreground uppercase tracking-wider">{m.label}</div>
                </div>
              ))}
            </div>

            {/* Article Content Body */}
            <div className="space-y-12 text-sm leading-relaxed text-muted-foreground">
              {/* Abstract */}
              <section className="glass-card p-6 sm:p-8 rounded-2xl border border-cosmic-teal/30 bg-cosmic-teal/5">
                <h2 className="font-display text-lg font-bold text-foreground mb-3 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cosmic-teal" /> Executive Summary & Abstract
                </h2>
                <p className="text-foreground/90 leading-relaxed text-sm sm:text-base">
                  {study.abstract}
                </p>
              </section>

              {/* Problem */}
              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-cosmic-purple-glow" /> Problem & Operational Challenge
                </h2>
                <p className="leading-relaxed">
                  {study.problem}
                </p>
              </section>

              {/* Architecture & Machine Learning */}
              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <Cpu className="h-5 w-5 text-cosmic-teal" /> Machine Learning Architecture & PyTorch Code
                </h2>
                <p className="leading-relaxed mb-6">
                  {study.architecture}
                </p>

                {/* Code Block */}
                <div className="bg-[#0b0b14] border border-border/80 rounded-xl p-5 overflow-x-auto font-mono text-xs text-emerald-400">
                  <div className="text-[10px] text-muted-foreground uppercase tracking-widest mb-3 flex items-center justify-between">
                    <span>Python / PyTorch 2.0 Implementation</span>
                    <span className="text-cosmic-teal">PyTorch + CLIP</span>
                  </div>
                  <pre><code>{study.codeSnippet}</code></pre>
                </div>
              </section>

              {/* Results */}
              <section>
                <h2 className="font-display text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" /> Empirical Results & Production Validation
                </h2>
                <p className="leading-relaxed">
                  {study.results}
                </p>
              </section>
            </div>

            {/* CTA Box */}
            <div className="mt-16 glass-card p-8 rounded-3xl border border-cosmic-teal/40 text-center flex flex-col items-center justify-center gap-5">
              <h3 className="font-display text-2xl font-bold text-foreground">
                Experience Machine Learning & Pre-labeling Live
              </h3>
              <p className="text-muted-foreground text-sm max-w-md">
                Try the CLIP zero-shot pre-labeling engine and 5-modality annotation workspace directly in your browser.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button asChild size="lg" className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white border-0 gap-2">
                  <Link to="/annotate/demo">
                    <Play size={16} /> Open Interactive Workspace
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline" className="border-border text-foreground gap-2">
                  <Link to="/build-ai">
                    Browse All Case Studies <ArrowRight size={16} />
                  </Link>
                </Button>
              </div>
            </div>

          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
