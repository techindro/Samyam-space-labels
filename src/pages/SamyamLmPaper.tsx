import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Download,
  Calendar,
  Users,
  Tag,
  FileText,
  Globe,
  Layers,
  Cpu,
  ShieldCheck,
  Languages,
  Car,
  Satellite,
  Github,
  ArrowRight,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";

const PDF_URL = "/__l5e/assets-v1/59eb94ea-30fe-4c57-97e9-ef916d404115/Samyalm_Paper.pdf";

const contributions = [
  {
    icon: Satellite,
    title: "Satellite-first data source",
    description:
      "Uses orbital imagery and geospatial streams as primary inputs instead of purely crowd-sourced pipelines.",
  },
  {
    icon: Languages,
    title: "Indian languages as first-class",
    description:
      "Hindi and other Indic languages are treated as native modalities, not afterthoughts bolted onto English pipelines.",
  },
  {
    icon: Layers,
    title: "Multimodal by design",
    description:
      "Aligns imagery, geospatial context and text so LLMs, VLMs and driving stacks can share a single label graph.",
  },
  {
    icon: ShieldCheck,
    title: "Built-in quality assurance",
    description:
      "Layered checks — automated topology, class consistency and expert review — keep annotations training-ready.",
  },
];

const pipeline = [
  {
    step: "01",
    title: "Ingest satellite + geospatial streams",
    detail: "EO, SAR and telemetry ingested across Indian regions to anchor labels in real geography.",
  },
  {
    step: "02",
    title: "Multimodal annotation",
    detail: "Vision, language and geospatial context fused into structured tasks with AI-assisted pre-labels.",
  },
  {
    step: "03",
    title: "Indic language alignment",
    detail: "Hindi and other Indian languages captured alongside imagery for VQA, captions and instructions.",
  },
  {
    step: "04",
    title: "Quality assurance",
    detail: "Automated validators plus reviewer consensus route low-confidence samples back for re-labeling.",
  },
  {
    step: "05",
    title: "Benchmark & export",
    detail: "Training-ready datasets evaluated on Hindi VQA, scene understanding and driving benchmarks.",
  },
];

const applications = [
  { icon: Cpu, label: "LLM training", copy: "Grounded Hindi + English corpora with visual context." },
  { icon: Globe, label: "Vision-language models", copy: "Aligned image-text pairs across Indian geographies." },
  { icon: Car, label: "Autonomous driving", copy: "Scene understanding tuned to Indian road conditions." },
  { icon: Satellite, label: "Geospatial AI", copy: "Scalable annotation for earth observation models." },
];

const SamyamLmPaper = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative py-20 sm:py-28 overflow-hidden">
          <ParallelWebBg />
          <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/10 via-transparent to-cosmic-teal/5 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-4xl mx-auto"
            >
              <Link
                to="/research/papers"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6"
              >
                <ArrowLeft className="w-4 h-4" /> Back to Research Papers
              </Link>

              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-purple/10 border border-cosmic-purple/20 text-cosmic-purple-glow text-xs tracking-widest uppercase mb-5">
                <FileText className="w-3.5 h-3.5" /> Research Paper
              </div>

              <h1 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground leading-[1.15] mb-6">
                SamyamLM: A Satellite-Based Multimodal Data Labeling Platform for Indian Language AI Training
              </h1>

              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-8">
                <span className="inline-flex items-center gap-2"><Users className="w-4 h-4" /> Shubham Patel</span>
                <span className="inline-flex items-center gap-2"><Calendar className="w-4 h-4" /> April 3, 2026</span>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <Button asChild size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                  <a href={PDF_URL} target="_blank" rel="noopener noreferrer">
                    <Download className="w-4 h-4 mr-2" /> Download PDF
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full">
                  <a href="https://github.com/techindro/SamyamLm-Data-Engine" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" /> Data Engine on GitHub
                  </a>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Abstract */}
        <section className="relative py-16 border-t border-border/30">
          <div className="container mx-auto px-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto"
            >
              <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>
                Abstract
              </p>
              <div className="glass-card rounded-2xl p-6 sm:p-8">
                <p className="text-foreground/90 leading-relaxed">
                  We introduce SamyamLM, a novel multimodal data labeling platform designed to facilitate high-quality training data generation for large language models (LLMs), vision-language models, and autonomous driving systems. Unlike existing platforms that rely on conventional crowd-sourcing pipelines, SamyamLM leverages satellite imagery and geospatial data streams as primary inputs, enabling scalable and cost-effective annotation of real-world scenarios across diverse Indian linguistic and geographic contexts. The platform supports Hindi and other Indian languages as first-class modalities, addressing a critical gap in the AI training ecosystem where Indic language data remains severely underrepresented. Benchmarks demonstrate that models trained on SamyamLM-curated datasets achieve competitive performance on Hindi visual question answering (VQA), satellite scene understanding, and autonomous driving tasks.
                </p>
              </div>

              <div className="flex flex-wrap gap-2 mt-6">
                {["multimodal learning", "data labeling", "satellite imagery", "Hindi NLP", "Indian language AI", "autonomous driving", "foundation models", "geospatial AI"].map((t) => (
                  <span key={t} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-secondary text-muted-foreground text-xs">
                    <Tag className="w-3 h-3" /> {t}
                  </span>
                ))}
              </div>
            </motion.div>
          </div>
        </section>

        {/* Key contributions */}
        <section className="relative py-20 border-t border-border/30 overflow-hidden">
          <ParallelWebBg />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>
                  Key contributions
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">What SamyamLM changes</h2>
              </div>
              <div className="grid sm:grid-cols-2 gap-6">
                {contributions.map((c, i) => (
                  <motion.div
                    key={c.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                    className="glass-card rounded-xl p-6"
                  >
                    <div className="w-10 h-10 rounded-lg bg-cosmic-purple/10 flex items-center justify-center mb-4">
                      <c.icon className="w-5 h-5 text-cosmic-purple-glow" />
                    </div>
                    <h3 className="font-display text-lg font-semibold text-foreground mb-2">{c.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{c.description}</p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Pipeline */}
        <section className="relative py-20 border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>
                  Methodology
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">The SamyamLM pipeline</h2>
              </div>
              <div className="space-y-4">
                {pipeline.map((p, i) => (
                  <motion.div
                    key={p.step}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.08 }}
                    className="flex gap-5 p-5 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm hover:border-border/80 hover:bg-card/60 transition-all"
                  >
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/60 flex items-center justify-center font-display text-sm font-semibold text-foreground/80">
                      {p.step}
                    </div>
                    <div>
                      <h3 className="font-display text-lg font-semibold text-foreground mb-1">{p.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">{p.detail}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Applications */}
        <section className="relative py-20 border-t border-border/30 overflow-hidden">
          <ParallelWebBg />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-teal/5 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>
                  Applications
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground">Where the datasets are used</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {applications.map((a) => (
                  <div key={a.label} className="glass-card rounded-xl p-6">
                    <div className="w-10 h-10 rounded-lg bg-cosmic-teal/10 flex items-center justify-center mb-4">
                      <a.icon className="w-5 h-5 text-cosmic-teal-glow" />
                    </div>
                    <h3 className="font-display text-base font-semibold text-foreground mb-2">{a.label}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{a.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Citation + CTA */}
        <section className="relative py-20 border-t border-border/30">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto">
              <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>
                Cite this paper
              </p>
              <pre className="glass-card rounded-xl p-5 text-xs sm:text-sm text-foreground/80 overflow-x-auto whitespace-pre-wrap">
{`@article{patel2026samyamlm,
  title   = {SamyamLM: A Satellite-Based Multimodal Data Labeling Platform for Indian Language AI Training},
  author  = {Patel, Shubham},
  year    = {2026},
  month   = {April},
  note    = {samyam}
}`}
              </pre>

              <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-2xl glass-card">
                <div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-1">Want to build on SamyamLM?</h3>
                  <p className="text-muted-foreground text-sm">Explore the platform, read the code, or talk to our team.</p>
                </div>
                <div className="flex gap-3">
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/learn">Learn more <ArrowRight className="w-4 h-4 ml-2" /></Link>
                  </Button>
                  <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                    <Link to="/book-demo">Book a demo</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default SamyamLmPaper;
