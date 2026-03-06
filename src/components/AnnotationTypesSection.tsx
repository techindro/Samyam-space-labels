import { motion } from "framer-motion";

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
            data inputs
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground">
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
              className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/5 p-6 min-h-[200px]"
            >
              <h3 className="font-display text-lg font-semibold text-primary-foreground mb-4">{type.title}</h3>
              <ul className="space-y-2">
                {type.items.map(item => (
                  <li key={item} className="text-primary-foreground/40 text-sm">{item}</li>
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
