import { motion } from "framer-motion";
import { Cpu, Layers, Database, Globe2, Server, Keyboard, Sparkles, CheckCircle2 } from "lucide-react";

const techStack = [
  {
    layer: "Vision-Language Model",
    technologies: "CLIP (ViT-B/32), Fine-tuned checkpoint",
    description: "Multimodal alignment for zero-shot satellite classification and Indic VQA.",
    icon: Cpu,
    color: "from-purple-500/20 to-transparent",
    badge: "AI Core",
  },
  {
    layer: "Deep Learning",
    technologies: "PyTorch 2.0+, HuggingFace Transformers",
    description: "High-throughput model pre-training, fine-tuning, and PPO/DPO RLHF pipelines.",
    icon: Layers,
    color: "from-teal-500/20 to-transparent",
    badge: "Framework",
  },
  {
    layer: "Geospatial Data",
    technologies: "GDAL, Rasterio, ISRO Resourcesat-2A API",
    description: "Multi-spectral satellite raster ingestion, SAR polarimetric decomposition, and sub-meter GIS tiles.",
    icon: Globe2,
    color: "from-blue-500/20 to-transparent",
    badge: "Geospatial",
  },
  {
    layer: "Backend Engine",
    technologies: "FastAPI, PostgreSQL, Redis, Supabase",
    description: "Asynchronous task queue, vector similarity indexing, and high-performance dataset querying.",
    icon: Server,
    color: "from-emerald-500/20 to-transparent",
    badge: "Backend",
  },
  {
    layer: "Frontend & Indic UI",
    technologies: "React, TypeScript, Devanagari Keyboard",
    description: "Built-in Devanagari on-screen keyboard, interactive canvas, and 5-modality labeling workspace.",
    icon: Keyboard,
    color: "from-orange-500/20 to-transparent",
    badge: "Indic UI",
  },
  {
    layer: "Infrastructure",
    technologies: "AWS S3, EC2, CloudFront, Vercel",
    description: "Distributed edge storage, GPU inference clusters, and global CDN delivery.",
    icon: Database,
    color: "from-cyan-500/20 to-transparent",
    badge: "Cloud Infra",
  },
];

const TechStackSection = () => {
  return (
    <section className="py-20 relative overflow-hidden border-t border-border/30">
      <div className="container mx-auto px-4 relative z-10 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14 max-w-2xl mx-auto"
        >
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-border bg-secondary/50">
            <Sparkles className="h-3.5 w-3.5 text-cosmic-teal" />
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Technology Stack</span>
          </div>
          <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4 text-foreground">
            Architecture &{" "}
            <span className="bg-gradient-to-r from-cosmic-purple-glow via-cosmic-teal to-cosmic-purple bg-clip-text text-transparent">
              Technology Stack
            </span>
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Purpose-built infrastructure for Indian language AI, satellite perception, and mission-critical enterprise workloads.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {techStack.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.layer}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass-card rounded-2xl p-6 border border-border/50 relative overflow-hidden flex flex-col justify-between hover:border-cosmic-teal/40 transition-all group"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-3 rounded-xl bg-secondary text-foreground shrink-0">
                      <Icon className="h-5 w-5" />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-secondary border border-border/50 text-cosmic-teal">
                      {item.badge}
                    </span>
                  </div>

                  <h3 className="font-display text-xs uppercase tracking-wider text-muted-foreground mb-1">{item.layer}</h3>
                  <p className="font-display text-lg font-bold mb-3 text-foreground group-hover:text-cosmic-teal transition-colors">
                    {item.technologies}
                  </p>
                  <p className="text-muted-foreground text-xs leading-relaxed mb-4">
                    {item.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-border/30 flex items-center gap-1.5 text-[11px] text-cosmic-teal font-medium">
                  <CheckCircle2 size={13} /> Production Verified
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TechStackSection;
