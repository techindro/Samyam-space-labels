import { motion } from "framer-motion";
import { Shield, BarChart3 } from "lucide-react";
import agenticDefense from "@/assets/agentic-defense.jpg";
import agenticEnterprise from "@/assets/agentic-enterprise.jpg";
import ParallelWebBg from "@/components/ParallelWebBg";

const cards = [
  {
    icon: Shield,
    title: "Space & Defense",
    desc: "AI agents for mission planning, orbital analysis, threat detection, and space domain awareness. Built for classified and unclassified environments.",
    image: agenticDefense,
    stats: ["50+ missions supported", "24/7 real-time monitoring", "ITAR & FedRAMP compliant"],
  },
  {
    icon: BarChart3,
    title: "Enterprise",
    desc: "AI agents for commercial satellite analytics, earth observation insights, crop monitoring, and infrastructure assessment at global scale.",
    image: agenticEnterprise,
    stats: ["200TB+ data processed/month", "40+ enterprise clients", "Sub-meter resolution"],
  },
];

const AgenticSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <ParallelWebBg />
      <div className="container mx-auto px-4 relative z-10">
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
              className="glass-card rounded-2xl overflow-hidden group hover:border-cosmic-purple/40 transition-all"
            >
              <div className="h-52 relative overflow-hidden">
                <img
                  src={card.image}
                  alt={card.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              </div>
              <div className="p-8">
                <div className="flex items-center gap-3 mb-3">
                  <card.icon className="h-6 w-6 text-cosmic-teal" />
                  <h3 className="font-display text-2xl font-semibold">{card.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed mb-4">{card.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {card.stats.map((stat) => (
                    <span
                      key={stat}
                      className="text-xs px-3 py-1 rounded-full border border-border/50 bg-secondary/30 text-muted-foreground"
                    >
                      {stat}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AgenticSection;
