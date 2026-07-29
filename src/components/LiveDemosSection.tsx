import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Play, ExternalLink, Tag, ShieldCheck, HeartPulse, GraduationCap, Car } from "lucide-react";
import { Link } from "react-router-dom";

const demos = [
  {
    title: "Multimodal Labeling Workspace",
    tagline: "Live Interactive Demo",
    description: "Interactive 2D Vision, Audio Diarization, Video Frame Tracking, RLHF Preference & SAR Radar annotator.",
    icon: Tag,
    badge: "5 Modalities",
    color: "from-cosmic-purple/30 to-cosmic-teal/20",
    border: "border-cosmic-purple/40",
    href: "/annotate/demo",
    isInternal: true,
  },
  {
    title: "Indian Road Detector",
    tagline: "Hugging Face Space",
    description: "AI-powered road detection & pothole segmentation tailored for Indian road conditions and weather.",
    icon: ShieldCheck,
    badge: "Live Model",
    color: "from-orange-500/20 to-transparent",
    border: "border-orange-500/30",
    href: "https://huggingface.co/spaces/techindro/SamyamLm-Demo",
    isInternal: false,
  },
  {
    title: "Self Driving Car Vision",
    tagline: "Hugging Face Space",
    description: "Real-time 47-class object detection (auto-rickshaws, cattle, tempos) and lane tracking for autonomous driving.",
    icon: Car,
    badge: "47 Classes",
    color: "from-blue-500/20 to-transparent",
    border: "border-blue-500/30",
    href: "https://huggingface.co/spaces/techindro/SamyamLm-SelfDriving",
    isInternal: false,
  },
  {
    title: "Health Detector",
    tagline: "Hugging Face Space",
    description: "Medical imaging analysis and diagnostic computer vision models for public healthcare initiatives.",
    icon: HeartPulse,
    badge: "Medical AI",
    color: "from-red-500/20 to-transparent",
    border: "border-red-500/30",
    href: "https://huggingface.co/spaces/techindro/SamyamLm-Health",
    isInternal: false,
  },
  {
    title: "Education Detector",
    tagline: "Hugging Face Space",
    description: "Devanagari script NLP analysis, textbook digitisation, and educational material classification.",
    icon: GraduationCap,
    badge: "Indic NLP",
    color: "from-green-500/20 to-transparent",
    border: "border-green-500/30",
    href: "https://huggingface.co/spaces/techindro/SamyamLm-Education",
    isInternal: false,
  },
];

const LiveDemosSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-border bg-secondary/50">
            <Sparkles className="h-3.5 w-3.5 text-cosmic-teal" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Interactive AI Demos</span>
          </div>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Experience{" "}
            <span className="bg-gradient-to-r from-cosmic-purple-glow via-cosmic-teal to-cosmic-purple bg-clip-text text-transparent">
              Samyam Models
            </span>{" "}
            Live
          </h2>
          <p className="text-muted-foreground text-base">
            Test our AI perception models and multimodal labeling tools live in your browser — zero setup required.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {demos.map((demo, i) => {
            const Icon = demo.icon;
            return (
              <motion.div
                key={demo.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className={`glass-card rounded-2xl p-6 border ${demo.border} flex flex-col justify-between group hover:shadow-[0_0_30px_rgba(139,92,246,0.15)] transition-all`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-secondary shrink-0">
                      <Icon className="h-5 w-5 text-foreground" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-secondary border border-border/50 text-muted-foreground">
                      {demo.badge}
                    </span>
                  </div>

                  <p className="text-[11px] font-semibold uppercase tracking-wider text-cosmic-teal mb-1">{demo.tagline}</p>
                  <h3 className="font-display text-xl font-bold mb-2 group-hover:text-cosmic-teal transition-colors">{demo.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-6">{demo.description}</p>
                </div>

                {demo.isInternal ? (
                  <Link
                    to={demo.href}
                    className="inline-flex items-center justify-between w-full p-3 rounded-xl bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground font-semibold text-xs border-0 hover:opacity-90 transition-opacity"
                  >
                    <span>Launch Interactive Demo</span>
                    <Play className="h-3.5 w-3.5 fill-current" />
                  </Link>
                ) : (
                  <a
                    href={demo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-between w-full p-3 rounded-xl bg-secondary/80 hover:bg-secondary text-foreground font-semibold text-xs border border-border/50 transition-colors"
                  >
                    <span>Open Hugging Face Space</span>
                    <ExternalLink className="h-3.5 w-3.5 text-muted-foreground" />
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default LiveDemosSection;