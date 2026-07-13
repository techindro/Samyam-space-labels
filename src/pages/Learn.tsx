import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Satellite,
  Github,
  ArrowRight,
  BookOpen,
  Calendar,
  Database,
  Tag,
  Brain,
  BarChart3,
  Rocket,
  Camera,
  Radar,
  Palette,
  Layers,
  CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";

const multimodalCards = [
  {
    icon: Camera,
    title: "Optical Imagery",
    description: "Sub-pixel annotation across RGB, multispectral and high-resolution EO scenes for land-use, infrastructure and disaster assessment.",
  },
  {
    icon: Radar,
    title: "SAR",
    description: "All-weather, day/night labeling that cuts through clouds and darkness for maritime, flood and change-detection tasks.",
  },
  {
    icon: Palette,
    title: "Hyperspectral",
    description: "Material and spectral signature classification from tens to hundreds of narrow bands for crop health, minerals and anomaly detection.",
  },
  {
    icon: Layers,
    title: "Sensor Fusion",
    description: "Time-aligned, multi-source datasets that combine EO, SAR, IR and telemetry for autonomy and mission simulation.",
  },
];

const steps = [
  {
    icon: Database,
    title: "Ingest",
    description: "Load raw satellite imagery, SAR, hyperspectral cubes, telemetry or fused sensor streams.",
  },
  {
    icon: Tag,
    title: "Label",
    description: "Annotate with bounding boxes, polygons, segmentation masks and point clouds using AI-assisted tooling.",
  },
  {
    icon: Brain,
    title: "Train",
    description: "Fine-tune PyTorch, TensorFlow or ONNX models on your labeled data with managed GPU pipelines.",
  },
  {
    icon: BarChart3,
    title: "Evaluate",
    description: "Measure mAP, IoU and precision/recall, then route failure cases back for re-labeling.",
  },
  {
    icon: Rocket,
    title: "Deploy",
    description: "Push models to edge devices, cloud endpoints or ground stations with drift monitoring.",
  },
];

const nextSteps = [
  {
    icon: Github,
    title: "Explore the engine on GitHub",
    description: "Clone the open-source data engine, run the examples and inspect the labeling pipeline.",
    href: "https://github.com/techindro/SamyamLm-Data-Engine",
    external: true,
    label: "Open GitHub",
  },
  {
    icon: Satellite,
    title: "See the Space Tech stack",
    description: "Dive into orbital telemetry, debris tracking, lunar mapping and mission analytics.",
    href: "/space-tech",
    external: false,
    label: "View Space Tech",
  },
  {
    icon: Calendar,
    title: "Book a demo",
    description: "Talk to our team about your satellite data, labeling volume and model goals.",
    href: "/book-demo",
    external: false,
    label: "Book a demo",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

const Learn = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative min-h-[70vh] flex items-center justify-center py-24 overflow-hidden">
          <ParallelWebBg />
          <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/10 via-transparent to-cosmic-teal/5 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="max-w-3xl mx-auto text-center"
            >
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-cosmic-purple/10 border border-cosmic-purple/20 text-cosmic-purple-glow text-xs tracking-widest uppercase mb-6">
                <BookOpen className="w-3.5 h-3.5" />
                Learn
              </div>
              <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground leading-[1.1] mb-6">
                Satellite Data Labeling, Explained
              </h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed mb-8">
                Samyam turns raw orbital, aerial and sensor data into training-ready datasets for space and defense AI.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Button asChild size="lg" className="rounded-full bg-foreground text-background hover:bg-foreground/90 text-base px-8">
                  <a href="https://github.com/techindro/SamyamLm-Data-Engine" target="_blank" rel="noopener noreferrer">
                    <Github className="w-4 h-4 mr-2" /> View on GitHub
                  </a>
                </Button>
                <Button asChild size="lg" variant="outline" className="rounded-full text-base px-8">
                  <Link to="/space-tech">
                    Explore Space Tech <ArrowRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* What is satellite data labeling */}
        <section className="relative py-24 overflow-hidden border-t border-border/30">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-6xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>
                  What it is
                </p>
                <h2 className="font-display text-3xl sm:text-4xl font-bold text-foreground mb-5">
                  From Pixels to Predictions
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  Satellite data labeling is the process of adding structured annotations to raw orbital and aerial imagery so machine learning models can learn to recognize objects, terrain, changes and anomalies.
                </p>
                <ul className="space-y-3">
                  {[
                    "Label objects, boundaries and regions of interest",
                    "Align annotations to geospatial coordinate systems",
                    "Build training datasets for perception and autonomy models",
                    "Validate quality with expert reviewers and automated checks",
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-muted-foreground">
                      <CheckCircle2 className="w-5 h-5 text-cosmic-teal shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="glass-card rounded-2xl p-6 sm:p-8"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-lg bg-cosmic-purple/10 flex items-center justify-center">
                    <Satellite className="w-5 h-5 text-cosmic-purple-glow" />
                  </div>
                  <h3 className="font-display text-xl font-semibold text-foreground">Why it matters</h3>
                </div>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                  Modern space missions generate terabytes of imagery and sensor data every day. Without accurate labels, models cannot reliably detect ships, track debris, map terrain or monitor crops. High-quality labeling is the foundation of trustworthy space AI.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "EO / Optical", value: "RGB & multispectral" },
                    { label: "SAR", value: "All-weather radar" },
                    { label: "Hyperspectral", value: "Material signatures" },
                    { label: "Sensor Fusion", value: "Multi-source alignment" },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg bg-background/50 p-3 border border-border/30">
                      <p className="text-xs text-muted-foreground uppercase tracking-wider">{stat.label}</p>
                      <p className="text-sm font-medium text-foreground mt-1">{stat.value}</p>
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Multimodal capabilities */}
        <section className="relative py-24 overflow-hidden">
          <ParallelWebBg />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-teal/5 to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>
                Multimodal labeling
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">
                One Platform, Every Sensor
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Samyam handles the full spectrum of satellite and sensor data so your models see the complete picture.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto"
            >
              {multimodalCards.map((card) => (
                <motion.div
                  key={card.title}
                  variants={itemVariants}
                  className="glass-card rounded-xl p-6 hover:bg-card/60 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-cosmic-purple/10 flex items-center justify-center mb-4">
                    <card.icon className="w-5 h-5 text-cosmic-purple-glow" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{card.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{card.description}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Pipeline */}
        <section className="relative py-24 overflow-hidden border-t border-border/30">
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>
                How it works
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">
                From Raw Data to Deployed Model
              </h2>
            </motion.div>

            <div className="max-w-3xl mx-auto space-y-6">
              {steps.map((step, i) => (
                <motion.div
                  key={step.title}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                  className="group relative flex gap-5 p-5 rounded-xl border border-border/40 bg-card/40 backdrop-blur-sm hover:border-border/80 hover:bg-card/60 transition-all"
                >
                  <div className="flex-shrink-0 w-11 h-11 rounded-lg bg-secondary/60 flex items-center justify-center group-hover:bg-secondary transition-colors">
                    <step.icon className="w-5 h-5 text-foreground/70 group-hover:text-foreground transition-colors" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg font-semibold text-foreground mb-1">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.description}</p>
                  </div>
                  {i < steps.length - 1 && (
                    <div className="absolute left-[2.55rem] top-[4.25rem] w-px h-6 bg-border/30" />
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Next steps */}
        <section className="relative py-24 overflow-hidden">
          <ParallelWebBg />
          <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/5 via-transparent to-cosmic-teal/5 pointer-events-none" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="text-center mb-14"
            >
              <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>
                Next steps
              </p>
              <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-5">
                Start Building with Samyam
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Pick the path that fits your team and begin turning satellite data into production-ready AI.
              </p>
            </motion.div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto"
            >
              {nextSteps.map((step) => (
                <motion.div
                  key={step.title}
                  variants={itemVariants}
                  className="glass-card rounded-xl p-6 flex flex-col"
                >
                  <div className="w-10 h-10 rounded-lg bg-cosmic-teal/10 flex items-center justify-center mb-4">
                    <step.icon className="w-5 h-5 text-cosmic-teal-glow" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-1">{step.description}</p>
                  <Button asChild variant="outline" className="w-full rounded-lg">
                    <a href={step.href} target={step.external ? "_blank" : undefined} rel={step.external ? "noopener noreferrer" : undefined}>
                      {step.label} <ArrowRight className="w-4 h-4 ml-2" />
                    </a>
                  </Button>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Learn;
