import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import caseMonitoring from "@/assets/case-satellite-monitoring.jpg";
import caseDebris from "@/assets/case-debris-tracking.jpg";
import caseLabeled from "@/assets/case-labeled-images.jpg";
import ParallelWebBg from "@/components/ParallelWebBg";

const cases = [
  {
    tag: "Monitoring",
    title: "Satellite Health Monitoring with Samyam",
    desc: "Helping an emerging constellation operator build AI-driven health checks across their initial fleet of LEO satellites.",
    image: caseMonitoring,
    stats: "Early-stage deployment",
  },
  {
    tag: "Defense",
    title: "Orbital Debris Detection Pipeline",
    desc: "Building labeled datasets of orbital objects to train detection models for space situational awareness applications.",
    image: caseDebris,
    stats: "Custom annotation pipeline",
  },
  {
    tag: "Data",
    title: "Satellite Image Annotation at Scale",
    desc: "Delivering high-quality labeled satellite imagery for earth observation research with consistent annotation standards.",
    image: caseLabeled,
    stats: "100K+ images labeled",
  },
];

const CaseStudiesSection = () => {
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
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Case Studies &{" "}
            <span className="bg-gradient-to-r from-cosmic-purple-glow to-cosmic-teal bg-clip-text text-transparent">
              Resources
            </span>
          </h2>
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
                <Badge variant="outline" className="mb-3 text-cosmic-teal border-cosmic-teal/30 text-xs">
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

export default CaseStudiesSection;
