import { motion } from "framer-motion";
import { Diamond, Camera, TrendingUp, Users } from "lucide-react";
import ParallelWebBg from "@/components/ParallelWebBg";

const pillars = [
  {
    icon: Diamond,
    title: "Quality",
    description: "Samyam provides the core tenet of any dataset with high-quality labels from domain experts.",
  },
  {
    icon: Camera,
    title: "Cost Effective",
    description: "Easily find, categorize, and fix model failures with Samyam's Data Engine. Then, optimize labeling spend with high-value curated data.",
  },
  {
    icon: TrendingUp,
    title: "Scalability",
    description: "Samyam supports any ML project from lower-volume experiments to high-volume production projects. Scale up, or down, as needed.",
  },
  {
    icon: Users,
    title: "Diversity",
    description: "Samyam delivers broad data variety and diversity to maximize model performance across scenarios.",
  },
];

const TrustedBestSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <ParallelWebBg />
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>
            trusted
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">
            The Best In The Business
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">
            The Samyam Data Engine is trusted by the world's leading ML teams to accelerate model development with unmatched operations, experts, and quality.
          </p>
        </motion.div>

        {/* Icon cards row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16 max-w-5xl mx-auto">
          {pillars.map((pillar, i) => (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="text-center"
            >
              <div className="w-12 h-12 rounded-lg border border-border bg-secondary/50 flex items-center justify-center mb-4 mx-auto">
                <pillar.icon className="w-5 h-5 text-cosmic-purple" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground mb-2">{pillar.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Detailed cards */}
        <div className="grid lg:grid-cols-2 gap-6 max-w-5xl mx-auto">
          {pillars.map((pillar, i) => (
            <motion.div
              key={`detail-${pillar.title}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-xl p-8"
            >
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{pillar.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{pillar.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrustedBestSection;
