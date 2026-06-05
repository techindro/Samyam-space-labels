import { motion } from "framer-motion";
import { ArrowRight, Play, Road, Car, HeartPulse, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParallelWebBg from "@/components/ParallelWebBg";

const demos = [
  {
    emoji: "🛣️",
    title: "Indian Road Detector",
    description: "AI-powered road detection & segmentation for Indian road infrastructure.",
    url: "https://huggingface.co/spaces/techindro/SamyamLm-Demo",
  },
  {
    emoji: "🚗",
    title: "Self Driving Car",
    description: "Real-time object detection and lane segmentation for autonomous vehicles.",
    url: "https://huggingface.co/spaces/techindro/SamyamLm-SelfDriving",
  },
  {
    emoji: "🏥",
    title: "Health Detector",
    description: "Medical imaging analysis and diagnostic AI for healthcare applications.",
    url: "https://huggingface.co/spaces/techindro/SamyamLm-Health",
  },
  {
    emoji: "📚",
    title: "Education Detector",
    description: "Content analysis and educational material classification using NLP & vision.",
    url: "https://huggingface.co/spaces/techindro/SamyamLm-Education",
  },
];

const LiveDemosSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <ParallelWebBg />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-secondary/50 text-sm text-muted-foreground mb-6">
            <Play className="h-4 w-4 text-cosmic-teal" />
            <span style={{ fontFamily: "'Comfortaa', cursive" }}>try it live</span>
          </div>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Live Demos
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Experience our AI models in action. Open any demo below to test directly in your browser.
          </p>
        </motion.div>

        {/* Demo Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {demos.map((demo, i) => (
            <motion.div
              key={demo.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div className="glass-card h-full rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm p-6 hover:border-cosmic-teal/40 hover:bg-card/60 transition-all duration-300 flex flex-col">
                {/* Title */}
                <h3 className="font-display text-lg font-semibold text-foreground mb-2">
                  {demo.title}
                </h3>

                {/* Description */}
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">
                  {demo.description}
                </p>

                {/* CTA */}
                <Button
                  asChild
                  size="default"
                  className="w-full rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground hover:opacity-90 text-sm font-semibold shadow-lg shadow-cosmic-purple/20"
                >
                  <a href={demo.url} target="_blank" rel="noopener noreferrer">
                    Try Demo <ArrowRight className="w-4 h-4 ml-2" />
                  </a>
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="text-center mt-14"
        >
          <p className="text-muted-foreground/60 text-sm">
            All demos run on Hugging Face Spaces. No installation required.
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveDemosSection;