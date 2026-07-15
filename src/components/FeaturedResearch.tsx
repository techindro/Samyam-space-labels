import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FileText, ArrowRight, Languages, Satellite, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParallelWebBg from "@/components/ParallelWebBg";

const highlights = [
  { icon: Satellite, label: "Satellite-first inputs" },
  { icon: Languages, label: "Hindi & Indic languages" },
  { icon: Layers, label: "Multimodal by design" },
];

const FeaturedResearch = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <ParallelWebBg />
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/5 via-transparent to-cosmic-teal/5 pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-10">
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>
              Featured Research
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              From satellite pixels to Indian-language AI
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our latest paper introduces SamyamLM — a satellite-based multimodal data labeling platform built for training LLMs, VLMs and autonomous driving models on Indian data.
            </p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="glass-card rounded-2xl p-6 sm:p-10"
          >
            <div className="grid lg:grid-cols-[1.4fr_1fr] gap-8 items-center">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cosmic-purple/10 border border-cosmic-purple/20 text-cosmic-purple-glow text-xs tracking-widest uppercase mb-4">
                  <FileText className="w-3.5 h-3.5" /> New paper · April 2026
                </div>
                <h3 className="font-display text-xl sm:text-2xl font-semibold text-foreground mb-3 leading-snug">
                  SamyamLM: A Satellite-Based Multimodal Data Labeling Platform for Indian Language AI Training
                </h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-6">
                  We show how satellite imagery and geospatial streams can anchor high-quality Hindi and Indic-language datasets — closing a critical gap in global foundation-model training data.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button asChild className="rounded-full bg-foreground text-background hover:bg-foreground/90">
                    <Link to="/research/papers/samyamlm">
                      Read the paper <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                  <Button asChild variant="outline" className="rounded-full">
                    <Link to="/research/papers">All papers</Link>
                  </Button>
                </div>
              </div>
              <div className="grid gap-3">
                {highlights.map((h) => (
                  <div key={h.label} className="flex items-center gap-3 p-4 rounded-xl border border-border/40 bg-background/40">
                    <div className="w-9 h-9 rounded-lg bg-cosmic-teal/10 flex items-center justify-center">
                      <h.icon className="w-4 h-4 text-cosmic-teal-glow" />
                    </div>
                    <span className="text-sm text-foreground/90">{h.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default FeaturedResearch;
