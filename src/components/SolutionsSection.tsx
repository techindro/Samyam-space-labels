import { motion } from "framer-motion";
import { Satellite, Brain, Database } from "lucide-react";

const layers = [
  {
    icon: Satellite,
    title: "Satellite Data Labeling",
    desc: "Annotate satellite imagery, terrain maps, and orbital data with pixel-perfect precision at massive scale.",
    color: "cosmic-teal",
  },
  {
    icon: Brain,
    title: "Foundation Models",
    desc: "Partnering with leading AI models fine-tuned for space applications — remote sensing, object detection, and beyond.",
    color: "cosmic-purple",
  },
  {
    icon: Database,
    title: "Space Data Engine",
    desc: "Integrate proprietary space data pipelines for mission-critical AI with real-time telemetry and imagery feeds.",
    color: "cosmic-teal",
  },
];

const SolutionsSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Full-Stack AI Solutions for{" "}
            <span className="bg-gradient-to-r from-cosmic-purple-glow to-cosmic-teal bg-clip-text text-transparent">
              Space Data
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Three integrated layers powering the most advanced space AI applications on Earth and beyond.
          </p>
        </motion.div>

        <div className="max-w-3xl mx-auto space-y-6">
          {layers.map((layer, i) => (
            <motion.div
              key={layer.title}
              initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-xl p-6 hover:border-cosmic-purple/40 transition-all group cursor-pointer"
            >
              <div className="flex items-start gap-5">
                <div className={`p-3 rounded-lg bg-${layer.color}/10 group-hover:bg-${layer.color}/20 transition-colors`}>
                  <layer.icon className={`h-6 w-6 text-${layer.color}`} />
                </div>
                <div>
                  <h3 className="font-display text-xl font-semibold mb-2">{layer.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{layer.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default SolutionsSection;
