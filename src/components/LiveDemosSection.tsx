import { motion } from "framer-motion";
import { Play, ArrowRight, Waypoints, Car, HeartPulse, GraduationCap, Tag } from "lucide-react";
import { Link } from "react-router-dom";

const demos = [
  {
    title: "Multimodal Workspace",
    description: "Interactive 2D Vision, Audio, Video Frame Tracking, RLHF & SAR Radar annotator.",
    icon: Tag,
    href: "/annotate/demo",
    isInternal: true,
  },
  {
    title: "Indian Road Detector",
    description: "AI-powered road detection & segmentation for Indian road infrastructure.",
    icon: Waypoints,
    href: "https://huggingface.co/spaces/techindro/SamyamLm-Demo",
    isInternal: false,
  },
  {
    title: "Self Driving Car",
    description: "Real-time object detection and lane segmentation for autonomous vehicles.",
    icon: Car,
    href: "https://huggingface.co/spaces/techindro/SamyamLm-SelfDriving",
    isInternal: false,
  },
  {
    title: "Health Detector",
    description: "Medical imaging analysis and diagnostic AI for healthcare applications.",
    icon: HeartPulse,
    href: "https://huggingface.co/spaces/techindro/SamyamLm-Health",
    isInternal: false,
  },
  {
    title: "Education Detector",
    description: "Content analysis and educational material classification using NLP & vision.",
    icon: GraduationCap,
    href: "https://huggingface.co/spaces/techindro/SamyamLm-Education",
    isInternal: false,
  },
];

const LiveDemosSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 max-w-xl mx-auto"
        >
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-border/80 bg-background text-xs text-muted-foreground mb-4">
            <Play className="h-3 w-3 text-foreground" />
            <span>try it live</span>
          </div>

          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-3 text-foreground tracking-tight">
            Live Demos
          </h2>

          <p className="text-muted-foreground text-sm max-w-md mx-auto leading-relaxed">
            Experience our AI models in action. Open any demo below to test directly in your browser.
          </p>
        </motion.div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 max-w-7xl mx-auto">
          {demos.map((demo, i) => {
            const Icon = demo.icon;
            return (
              <motion.div
                key={demo.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="bg-card rounded-3xl p-6 border border-border/60 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-border transition-all group"
              >
                <div>
                  <div className="p-3 rounded-2xl bg-secondary w-fit mb-5 text-foreground">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="font-display text-base font-bold mb-2 text-foreground leading-snug">
                    {demo.title}
                  </h3>

                  <p className="text-muted-foreground text-xs leading-relaxed mb-6">
                    {demo.description}
                  </p>
                </div>

                {demo.isInternal ? (
                  <Link
                    to={demo.href}
                    className="w-full py-2.5 px-4 rounded-full bg-foreground text-background font-medium text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <span>Try Demo</span>
                    <ArrowRight size={13} />
                  </Link>
                ) : (
                  <a
                    href={demo.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2.5 px-4 rounded-full bg-foreground text-background font-medium text-xs flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                  >
                    <span>Try Demo</span>
                    <ArrowRight size={13} />
                  </a>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-muted-foreground mt-12">
          All demos run on{" "}
          <a
            href="https://huggingface.co/techindro"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 hover:text-foreground transition-colors"
          >
            Hugging Face Spaces
          </a>
          . No installation required.
        </p>

      </div>
    </section>
  );
};

export default LiveDemosSection;