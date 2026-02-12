import { motion } from "framer-motion";
import { Shield, BarChart3 } from "lucide-react";

const cards = [
  {
    icon: Shield,
    title: "Space & Defense",
    desc: "AI agents for mission planning, orbital analysis, threat detection, and space domain awareness. Built for classified and unclassified environments.",
    gradient: "from-cosmic-purple/20 to-cosmic-navy-light",
  },
  {
    icon: BarChart3,
    title: "Enterprise",
    desc: "AI agents for commercial satellite analytics, earth observation insights, crop monitoring, and infrastructure assessment at global scale.",
    gradient: "from-cosmic-teal/20 to-cosmic-navy-light",
  },
];

const AgenticSection = () => {
  return (
    <section className="py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Agentic AI{" "}
            <span className="bg-gradient-to-r from-cosmic-teal to-cosmic-purple-glow bg-clip-text text-transparent">
              Solutions
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Autonomous AI agents that transform how organizations interact with space data.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {cards.map((card, i) => (
            <motion.div
              key={card.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className={`glass-card rounded-2xl overflow-hidden group hover:border-cosmic-purple/40 transition-all`}
            >
              <div className={`h-48 bg-gradient-to-br ${card.gradient} flex items-center justify-center relative`}>
                <div className="absolute inset-0 star-field opacity-30" />
                <card.icon className="h-16 w-16 text-foreground/30 group-hover:text-foreground/50 transition-colors" />
              </div>
              <div className="p-8">
                <h3 className="font-display text-2xl font-semibold mb-3">{card.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{card.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgenticSection;
