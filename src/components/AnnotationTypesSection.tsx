import { motion } from "framer-motion";
import ParallelWebBg from "@/components/ParallelWebBg";

const types = [
  {
    title: "Samyam Text",
    items: ["Document Processing", "Natural Language Processing", "Transcription", "Content & Language"],
  },
  {
    title: "Samyam Image",
    items: ["Electro Optical", "Infrared", "Transcription"],
  },
  {
    title: "Samyam Video",
    items: ["Full Motion Video", "Natural Language Processing"],
  },
  {
    title: "Samyam 3D Sensor Fusion",
    items: ["LiDAR"],
  },
];

const AnnotationTypesSection = () => {
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
            data inputs
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground">
            Supported Annotation Types
          </h2>
        </motion.div>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {types.map((type, i) => (
            <motion.div
              key={type.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card rounded-xl p-6 min-h-[200px]"
            >
              <h3 className="font-display text-lg font-semibold text-foreground mb-4">{type.title}</h3>
              <ul className="space-y-2">
                {type.items.map(item => (
                  <li key={item} className="text-muted-foreground text-sm">{item}</li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AnnotationTypesSection;
