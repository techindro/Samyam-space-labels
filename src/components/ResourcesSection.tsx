import { motion } from "framer-motion";
import { BookOpen, Database, Cpu } from "lucide-react";

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
    <section className="relative py-24 bg-foreground overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary-foreground/40 text-sm tracking-[0.3em] uppercase mb-4">
            resources
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground">
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
              <div className="aspect-square rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 flex items-center justify-center mb-4 group-hover:border-primary-foreground/25 transition-colors">
                <resource.icon className="w-16 h-16 text-primary-foreground/20 group-hover:text-primary-foreground/40 transition-colors" strokeWidth={1} />
              </div>
              {/* Label */}
              <p className="text-primary-foreground/30 text-xs mb-1">{resource.tag}</p>
              <h3 className="font-display text-base font-medium text-primary-foreground group-hover:text-primary-foreground/80 transition-colors">
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
