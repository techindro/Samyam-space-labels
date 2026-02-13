import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import caseMonitoring from "@/assets/case-satellite-monitoring.jpg";
import caseDebris from "@/assets/case-debris-tracking.jpg";
import caseLabeled from "@/assets/case-labeled-images.jpg";

const cases = [
  {
    tag: "Monitoring",
    title: "ChAi Powers Satellite Constellation Monitoring",
    desc: "How a leading constellation operator achieved 99.7% uptime with AI-driven monitoring across 1,400+ LEO satellites.",
    image: caseMonitoring,
    stats: "1,400+ satellites monitored",
  },
  {
    tag: "Defense",
    title: "AI-Driven Debris Tracking with ChAi",
    desc: "Tracking 30,000+ orbital objects in real time to protect critical space assets and prevent catastrophic collisions.",
    image: caseDebris,
    stats: "30,000+ objects tracked",
  },
  {
    tag: "Scale",
    title: "How ChAi Labeled 10M Satellite Images",
    desc: "Delivering labeled satellite data at scale for the world's largest earth observation program with 99.4% annotation accuracy.",
    image: caseLabeled,
    stats: "10M+ images labeled",
  },
];

const CaseStudiesSection = () => {
  return (
    <section className="py-24 relative">
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
