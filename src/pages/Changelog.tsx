import { motion } from "framer-motion";
import { ArrowLeft, Sparkles, Bug, Zap, Shield, Rocket, Globe, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";

const changelogEntries = [
  {
    version: "v1.4.0",
    date: "August 2, 2026",
    tag: "Latest",
    tagColor: "bg-emerald-500/10 text-emerald-400 border-emerald-500/30",
    changes: [
      { type: "feature", icon: Sparkles, text: "2D Vision modality: Paste Image Link & Upload Image support" },
      { type: "feature", icon: Sparkles, text: "SAR & Radar multi-band annotation workspace (HH/HV/VV/RGB composite)" },
      { type: "improvement", icon: Zap, text: "Annotation toolbar reorganized for faster mobile access" },
      { type: "improvement", icon: Zap, text: "Export JSON now includes confidence scores and SAM mask data" },
      { type: "fix", icon: Bug, text: "Fixed annotation canvas zoom on touchscreen devices" },
    ],
  },
  {
    version: "v1.3.0",
    date: "July 18, 2026",
    tag: "Stable",
    tagColor: "bg-cosmic-purple/10 text-cosmic-purple border-cosmic-purple/30",
    changes: [
      { type: "feature", icon: Sparkles, text: "OpenClaw AI Copilot — Groq Llama-3.3 70B powered chat assistant" },
      { type: "feature", icon: Sparkles, text: "Audio & Speech labeling workspace with waveform annotation" },
      { type: "improvement", icon: Zap, text: "Enterprise SSO integration with Supabase Auth" },
      { type: "fix", icon: Bug, text: "Fixed navbar dropdown alignment on Safari" },
    ],
  },
  {
    version: "v1.2.0",
    date: "July 3, 2026",
    tag: "Stable",
    tagColor: "bg-cosmic-purple/10 text-cosmic-purple border-cosmic-purple/30",
    changes: [
      { type: "feature", icon: Sparkles, text: "ROI Calculator for annotation cost & time savings estimation" },
      { type: "feature", icon: Sparkles, text: "Case studies section with satellite monitoring & debris tracking" },
      { type: "improvement", icon: Zap, text: "3D satellite scene with interactive orbit visualization" },
      { type: "security", icon: Shield, text: "Added Content Security Policy headers" },
      { type: "fix", icon: Bug, text: "Fixed mobile viewport overflow on annotation workspace" },
    ],
  },
  {
    version: "v1.1.0",
    date: "June 15, 2026",
    tag: "Stable",
    tagColor: "bg-cosmic-purple/10 text-cosmic-purple border-cosmic-purple/30",
    changes: [
      { type: "feature", icon: Sparkles, text: "Bounding box & polygon annotation tools for 2D Vision" },
      { type: "feature", icon: Sparkles, text: "Pre-built preset image library for quick testing" },
      { type: "improvement", icon: Zap, text: "Dark mode glassmorphism UI across all pages" },
      { type: "fix", icon: Bug, text: "Fixed label sidebar scroll on small screens" },
    ],
  },
  {
    version: "v1.0.0",
    date: "June 1, 2026",
    tag: "Launch",
    tagColor: "bg-cosmic-teal/10 text-cosmic-teal border-cosmic-teal/30",
    changes: [
      { type: "feature", icon: Rocket, text: "Initial platform launch — Samyam Space Labels" },
      { type: "feature", icon: Sparkles, text: "2D Vision annotation workspace with bounding box tools" },
      { type: "feature", icon: Globe, text: "Space Tech, Enterprise, Pricing, About, Contact pages" },
      { type: "feature", icon: Sparkles, text: "Research papers, blog, leaderboards, and documentation" },
      { type: "security", icon: Shield, text: "Supabase authentication with email/password & OAuth" },
    ],
  },
];

const typeLabels: Record<string, string> = {
  feature: "New",
  improvement: "Improved",
  fix: "Fixed",
  security: "Security",
};

const Changelog = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      <main className="pt-28 pb-20 relative z-10 overflow-hidden">
        <ParallelWebBg />
        <div className="container mx-auto px-4 max-w-3xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-3 text-foreground">
              Changelog
            </h1>
            <p className="text-lg text-muted-foreground">
              All the latest updates, improvements, and fixes to the Samyam platform.
            </p>
          </motion.div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-2 bottom-0 w-px bg-border/60" />

            <div className="space-y-12">
              {changelogEntries.map((entry, index) => (
                <motion.div
                  key={entry.version}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="relative pl-12"
                >
                  {/* Dot */}
                  <div className="absolute left-2.5 top-1.5 w-4 h-4 rounded-full bg-gradient-to-tr from-cosmic-purple to-cosmic-teal border-2 border-background shadow-md" />

                  {/* Version Header */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h2 className="text-xl font-bold font-display text-foreground">{entry.version}</h2>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${entry.tagColor}`}>
                      {entry.tag}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> {entry.date}
                    </span>
                  </div>

                  {/* Changes */}
                  <div className="space-y-2.5">
                    {entry.changes.map((change, i) => (
                      <div
                        key={i}
                        className="flex items-start gap-3 p-3.5 rounded-xl bg-card/60 border border-border/50 hover:border-border transition-colors group backdrop-blur-sm"
                      >
                        <span className="shrink-0 mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border border-border/60 bg-muted/50 text-foreground">
                          {typeLabels[change.type]}
                        </span>
                        <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                          {change.text}
                        </p>
                      </div>
                    ))}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Changelog;
