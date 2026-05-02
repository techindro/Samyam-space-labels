import { motion } from "framer-motion";
import { BookOpen, Database, Cpu } from "lucide-react";
import ParallelWebBg from "@/components/ParallelWebBg";

const resources = [
  {
    icon: BookOpen,
    tag: "Blog",
    title: "Why Is ChatGPT So Good?",
  },
  {
    icon: Database,
    tag: "Guide",
    title: "Guide to Data Annotation",
  },
  {
    icon: Cpu,
    tag: "Guide",
    title: "Guide: Computer Vision",
  },
  {
    icon: BookOpen,
    tag: "Guide",
    title: "Guide: Model Training",
  },
];

const ResourcesSection = () => {
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
            resources
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Learn More About The Data Engine
          </h2>
        </motion.div>

        {/* Resource cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {resources.map((resource, i) => (
            <motion.div
              key={resource.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group cursor-pointer"
            >
              {/* Icon card */}
              <div className="glass-card aspect-square rounded-xl flex items-center justify-center mb-4 group-hover:border-cosmic-purple/40 transition-colors">
                <resource.icon className="w-16 h-16 text-cosmic-purple/40 group-hover:text-cosmic-purple transition-colors" strokeWidth={1} />
              </div>
              {/* Label */}
              <p className="text-muted-foreground text-xs mb-1">{resource.tag}</p>
              <h3 className="font-display text-base font-medium text-foreground group-hover:text-cosmic-purple transition-colors">
                {resource.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
