import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
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
  },
  {
    tag: "Autonomous Systems",
    title: "Self-Driving Perception Stack",
    desc: "Built a multi-class annotation pipeline (vehicles, pedestrians, drivable area) that powers the Self Driving Car demo, with continuous evaluation loops on edge cases.",
    image: caseDebris,
    stats: "Edge-case evaluation",
  },
  {
    tag: "Healthcare AI",
    title: "Health Signal Detection",
    desc: "Annotated medical imagery and signal data to train the Health Detector demo, with domain-expert review and HIPAA-aware handling baked into the workflow.",
    image: caseLabeled,
    stats: "Expert-in-the-loop",
  },
];

const BuildAICaseStudies = () => {
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
                  Read more <ArrowRight className="h-3 w-3" />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BuildAICaseStudies;
