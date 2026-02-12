import { motion } from "framer-motion";
import { Orbit, Mountain, AlertTriangle, Rocket } from "lucide-react";

const products = [
  {
    icon: Orbit,
    title: "Orbital Data Labeling",
    desc: "Label and annotate satellite and telescope imagery with sub-pixel accuracy for training next-gen space AI.",
  },
  {
    icon: Mountain,
    title: "Terrain Classification",
    desc: "AI-powered terrain and land-use classification from multispectral satellite data across any geography.",
  },
  {
    icon: AlertTriangle,
    title: "Anomaly Detection",
    desc: "Detect anomalies in space sensor data, telemetry streams, and orbital mechanics in real time.",
  },
  {
    icon: Rocket,
    title: "Mission Analytics",
    desc: "AI-driven insights for space missions — from launch windows to trajectory optimization and risk assessment.",
  },
];

const ProductsSection = () => {
  return (
    <section className="py-24 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-teal/3 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Space Tech{" "}
            <span className="bg-gradient-to-r from-cosmic-purple-glow to-cosmic-teal bg-clip-text text-transparent">
              Products
            </span>
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Purpose-built AI tools for every phase of the space data lifecycle.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {products.map((p, i) => (
            <motion.div
              key={p.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 hover:border-cosmic-teal/40 transition-all group cursor-pointer"
            >
              <div className="p-3 rounded-lg bg-cosmic-purple/10 w-fit mb-4 group-hover:bg-cosmic-purple/20 transition-colors">
                <p.icon className="h-6 w-6 text-cosmic-purple-glow" />
              </div>
              <h3 className="font-display text-lg font-semibold mb-2">{p.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ProductsSection;
