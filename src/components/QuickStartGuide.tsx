import { motion } from "framer-motion";
import { Database, Tag, Brain, BarChart3, Rocket, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const steps = [
  {
    icon: Database,
    title: "1. Upload Your Data",
    description: "Bring your raw satellite imagery, sensor feeds, or mission data. We support GeoTIFF, COCO, YOLO, and 20+ formats out of the box.",
    detail: "Drag & drop or connect your cloud storage (S3, GCS, Azure Blob).",
  },
  {
    icon: Tag,
    title: "2. Annotate & Label",
    description: "Use our AI-assisted annotation tools to label objects, boundaries, and regions of interest with pixel-level precision.",
    detail: "Bounding boxes, polygons, segmentation masks, and 3D point clouds.",
  },
  {
    icon: Brain,
    title: "3. Train Your Model",
    description: "Select from pre-built architectures or bring your own. Fine-tune on your labeled data with one-click training pipelines.",
    detail: "Supports PyTorch, TensorFlow, and ONNX. GPU clusters managed for you.",
  },
  {
    icon: BarChart3,
    title: "4. Evaluate & Iterate",
    description: "Review model metrics, identify failure cases, and send them back for re-labeling — closing the data feedback loop.",
    detail: "mAP, IoU, precision/recall dashboards with slice-level analysis.",
  },
  {
    icon: Rocket,
    title: "5. Deploy & Monitor",
    description: "Push models to edge devices or cloud endpoints. Monitor drift and performance in production with real-time alerts.",
    detail: "One-click deployment to satellites, drones, or ground stations.",
  },
];

const QuickStartGuide = () => {
  return (
    <section className="relative py-24 bg-background overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-secondary/10 via-transparent to-secondary/10 pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-muted-foreground text-sm tracking-widest uppercase mb-3" style={{ fontFamily: "'Comfortaa', cursive" }}>
            quick start
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            From Raw Data to Production in 5 Steps
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Get your AI pipeline running in minutes — no infrastructure headaches, no boilerplate.
          </p>
        </motion.div>

        {/* Steps */}
        <div className="max-w-3xl mx-auto space-y-6">
          {steps.map((step, i) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="group relative flex gap-6 p-6 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm hover:border-border/80 hover:bg-card/60 transition-all duration-300"
            >
              {/* Icon */}
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-secondary/60 flex items-center justify-center group-hover:bg-secondary transition-colors">
                <step.icon className="w-6 h-6 text-foreground/70 group-hover:text-foreground transition-colors" />
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="font-display text-lg font-semibold text-foreground mb-1">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-2">
                  {step.description}
                </p>
                <p className="text-muted-foreground/60 text-xs flex items-center gap-1">
                  <ChevronRight className="w-3 h-3" />
                  {step.detail}
                </p>
              </div>

              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className="absolute left-[2.9rem] top-[4.5rem] w-px h-6 bg-border/30" />
              )}
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-center mt-14"
        >
          <Button asChild size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 text-base px-10">
            <Link to="/book-demo">
              Start Building <Rocket className="w-4 h-4 ml-2" />
            </Link>
          </Button>
          <p className="text-muted-foreground/50 text-xs mt-3">
            No credit card required · Free tier available
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default QuickStartGuide;
