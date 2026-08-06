import { ArrowLeft, Sparkles, Bug, Zap, Shield, Rocket, Globe, Tag, Calendar } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const changelogEntries = [
  {
    version: "v1.4.0",
    date: "August 2, 2026",
    tag: "Latest",
    tagColor: "from-emerald-500 to-teal-400",
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
    tagColor: "from-blue-500 to-indigo-400",
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
    tagColor: "from-blue-500 to-indigo-400",
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
    tagColor: "from-blue-500 to-indigo-400",
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
    tagColor: "from-cosmic-purple to-cosmic-teal",
    changes: [
      { type: "feature", icon: Rocket, text: "Initial platform launch — Samyam Space Labels" },
      { type: "feature", icon: Sparkles, text: "2D Vision annotation workspace with bounding box tools" },
      { type: "feature", icon: Globe, text: "Space Tech, Enterprise, Pricing, About, Contact pages" },
      { type: "feature", icon: Sparkles, text: "Research papers, blog, leaderboards, and documentation" },
      { type: "security", icon: Shield, text: "Supabase authentication with email/password & OAuth" },
    ],
  },
];

const typeColors: Record<string, string> = {
  feature: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
  improvement: "text-blue-400 bg-blue-500/10 border-blue-500/20",
  fix: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  security: "text-purple-400 bg-purple-500/10 border-purple-500/20",
};

const typeLabels: Record<string, string> = {
  feature: "New",
  improvement: "Improved",
  fix: "Fixed",
  security: "Security",
};

const Changelog = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-3xl">
          {/* Header */}
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">
              Changelog
            </h1>
            <p className="text-lg text-muted-foreground">
              All the latest updates, improvements, and fixes to the Samyam platform.
            </p>
          </div>

          {/* Timeline */}
          <div className="relative">
            {/* Vertical Line */}
            <div className="absolute left-[19px] top-2 bottom-0 w-px bg-gradient-to-b from-cosmic-purple/60 via-cosmic-teal/30 to-transparent" />

            <div className="space-y-12">
              {changelogEntries.map((entry) => (
                <div key={entry.version} className="relative pl-12">
                  {/* Dot */}
                  <div className="absolute left-2.5 top-1.5 w-4 h-4 rounded-full bg-gradient-to-br from-cosmic-purple to-cosmic-teal border-2 border-background shadow-lg shadow-cosmic-purple/30" />

                  {/* Version Header */}
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <h2 className="text-xl font-bold font-display">{entry.version}</h2>
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full text-white bg-gradient-to-r ${entry.tagColor}`}>
                      {entry.tag}
                    </span>
                    <span className="flex items-center gap-1.5 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" /> {entry.date}
                    </span>
                  </div>

                  {/* Changes */}
                  <div className="space-y-2.5">
                    {entry.changes.map((change, i) => {
                      const ChangeIcon = change.icon;
                      return (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 rounded-xl bg-card/50 border border-white/5 hover:border-white/10 transition-colors group"
                        >
                          <span className={`shrink-0 mt-0.5 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border ${typeColors[change.type]}`}>
                            {typeLabels[change.type]}
                          </span>
                          <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors leading-relaxed">
                            {change.text}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>
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
