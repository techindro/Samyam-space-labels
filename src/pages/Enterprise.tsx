import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import {
  ShieldCheck,
  Building2,
  Server,
  Lock,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Users,
  Award,
  Globe,
  Cpu,
  FileCheck,
} from "lucide-react";
import PricingRoiCalculator from "@/components/PricingRoiCalculator";
import ParallelWebBg from "@/components/ParallelWebBg";

const enterpriseFeatures = [
  {
    icon: Server,
    title: "Air-Gapped & On-Premises Deployment",
    description:
      "Deploy Samyam AI pipeline on isolated private clouds, AWS GovCloud, or on-premises GPU clusters with strict air-gap compliance.",
  },
  {
    icon: Lock,
    title: "Zero-Trust Security & SOC2 / ITAR",
    description:
      "End-to-end encrypted datasets with RBAC, AES-256 encryption at rest, ITAR data boundaries, and audit logging for defense teams.",
  },
  {
    icon: Cpu,
    title: "Dedicated GPU Compute Nodes",
    description:
      "Guaranteed high-throughput inference with dedicated NVIDIA H100/A100 GPU clusters for zero-queue satellite batch processing.",
  },
  {
    icon: ShieldCheck,
    title: "99.9% Precision & SLA Guarantee",
    description:
      "Multi-reviewer validation, automated COCO/YOLO schema verification, and contractual 99.9% uptime SLAs for mission-critical missions.",
  },
  {
    icon: Users,
    title: "Custom AI Model Fine-Tuning",
    description:
      "Train custom SAM (Segment Anything Model) and YOLO perception models tailored specifically to your satellite & SAR sensor payloads.",
  },
  {
    icon: FileCheck,
    title: "Dedicated Account & Engineering Support",
    description:
      "24/7 priority support from senior AI vision engineers, dedicated solutions architects, and custom dataset ingestion integrations.",
  },
];

const Enterprise = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Enterprise Hero */}
        <section className="relative py-24 md:py-32 overflow-hidden border-b border-border/40 bg-gradient-to-b from-cosmic-purple/10 via-background to-background">
          <ParallelWebBg />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(147,51,234,0.1),transparent_60%)]" />

          <div className="container mx-auto px-4 max-w-6xl relative z-10 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border bg-secondary/60 text-xs font-semibold uppercase tracking-wider mb-6"
            >
              <Building2 className="h-4 w-4 text-foreground" />
              <span>Samyam Enterprise Infrastructure</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="font-display text-4xl sm:text-6xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl mx-auto"
            >
              Mission-Critical AI Data Infrastructure for Space & Defense
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed"
            >
              Scale satellite dataset annotation, SAR radar perception, and custom AI vision pipelines with enterprise-grade security, air-gapped compute, and dedicated SLAs.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white font-bold hover:opacity-90 px-8 py-6 text-base border-0 shadow-lg"
                onClick={() => navigate("/book-demo")}
              >
                Schedule Enterprise Briefing <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-border text-foreground hover:bg-secondary px-8 py-6 text-base"
                onClick={() => navigate("/pricing")}
              >
                Explore Pricing & Plans
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Enterprise Key Pillars */}
        <section className="py-20 bg-background border-b border-border/40">
          <div className="container mx-auto px-4 max-w-6xl">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
                Built for High-Security, High-Volume Organizations
              </h2>
              <p className="text-muted-foreground">
                Engineered specifically for space agencies, defense contractors, geospatial platforms, and Fortune 500 enterprises.
              </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enterpriseFeatures.map((feat, index) => {
                const Icon = feat.icon;
                return (
                  <motion.div
                    key={feat.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.08 }}
                    className="p-6 rounded-2xl border border-border/60 glass-card hover:border-foreground/30 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="p-3 rounded-xl bg-secondary w-fit mb-4 text-foreground">
                        <Icon className="h-6 w-6" />
                      </div>
                      <h3 className="text-lg font-bold mb-2">{feat.title}</h3>
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {feat.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ROI Calculator Section */}
        <PricingRoiCalculator />

        {/* Enterprise CTA Banner */}
        <section className="py-20 border-t border-border/40 bg-gradient-to-b from-background via-secondary/20 to-background text-center">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-4">
              Ready to Accelerate Your Enterprise AI Perception?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-xl mx-auto">
              Get in touch with our enterprise solutions architecture team to discuss custom SLAs, air-gapped deployments, and dedicated GPU clusters.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button
                size="lg"
                className="w-full sm:w-auto bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white font-bold px-8 py-6 border-0 shadow-lg"
                onClick={() => navigate("/book-demo")}
              >
                Contact Enterprise Sales <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="w-full sm:w-auto border-border text-foreground hover:bg-secondary px-8 py-6"
                onClick={() => navigate("/docs")}
              >
                Read Enterprise Security Docs
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Enterprise;
