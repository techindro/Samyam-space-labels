import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, Cloud, Database, Code2, GitBranch, Layers, Workflow, Terminal, Box, Cpu, Globe } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";

const integrationCategories = [
  {
    title: "Cloud Storage",
    description: "Connect your data wherever it lives",
    integrations: [
      { name: "Amazon S3", description: "Direct bucket access with IAM role-based auth", icon: Cloud, status: "Available" },
      { name: "Google Cloud Storage", description: "GCS bucket integration with service account", icon: Cloud, status: "Available" },
      { name: "Azure Blob Storage", description: "Azure container access with SAS tokens", icon: Cloud, status: "Coming Soon" },
      { name: "MinIO", description: "Self-hosted S3-compatible object storage", icon: Database, status: "Available" },
    ],
  },
  {
    title: "ML & Data Platforms",
    description: "Integrate with your ML pipeline",
    integrations: [
      { name: "Python SDK", description: "pip install samyam — full API access from Python", icon: Terminal, status: "Available" },
      { name: "REST API", description: "RESTful API for programmatic project management", icon: Code2, status: "Available" },
      { name: "Databricks", description: "Lakehouse integration for large-scale datasets", icon: Cpu, status: "Coming Soon" },
      { name: "Hugging Face", description: "Import/export datasets in HF format", icon: Box, status: "Coming Soon" },
    ],
  },
  {
    title: "Export Formats",
    description: "Export annotations in any format your model needs",
    integrations: [
      { name: "COCO JSON", description: "Standard COCO format for object detection & segmentation", icon: Layers, status: "Available" },
      { name: "YOLO", description: "YOLOv5/v8 compatible annotation format", icon: Layers, status: "Available" },
      { name: "Pascal VOC", description: "XML-based VOC format for legacy pipelines", icon: Layers, status: "Available" },
      { name: "GeoJSON", description: "Geospatial annotations for satellite imagery", icon: Globe, status: "Available" },
    ],
  },
  {
    title: "DevOps & Workflow",
    description: "Automate your labeling pipeline",
    integrations: [
      { name: "GitHub Actions", description: "CI/CD triggers on annotation completion", icon: GitBranch, status: "Coming Soon" },
      { name: "Webhooks", description: "Real-time event notifications to your backend", icon: Workflow, status: "Available" },
      { name: "Slack", description: "Team notifications for task assignments & reviews", icon: Workflow, status: "Coming Soon" },
      { name: "Zapier", description: "Connect Samyam to 5,000+ apps via no-code automation", icon: Workflow, status: "Coming Soon" },
    ],
  },
];

const Integrations = () => {
  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      <main className="pt-28 pb-20 relative z-10 overflow-hidden">
        <ParallelWebBg />
        <div className="container mx-auto px-4 max-w-5xl relative z-10">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4 text-foreground">
              Integrations
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Samyam fits seamlessly into your existing ML pipeline. Connect your cloud storage, export in any format, and automate with our APIs.
            </p>
          </motion.div>

          {/* API CTA Banner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="rounded-2xl border border-border/50 bg-card/60 p-6 mb-14 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md"
          >
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-cosmic-purple/10 text-cosmic-purple">
                <Terminal className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-foreground">Samyam Python SDK</h3>
                <p className="text-sm text-muted-foreground">
                  <code className="px-2 py-0.5 rounded bg-muted text-foreground font-mono text-xs border border-border/60">pip install samyam</code> — Get started in minutes
                </p>
              </div>
            </div>
            <Link
              to="/docs"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity shrink-0"
            >
              View Docs <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </motion.div>

          {/* Integration Categories */}
          <div className="space-y-14">
            {integrationCategories.map((category) => (
              <section key={category.title}>
                <div className="mb-5">
                  <h2 className="text-2xl font-bold font-display text-foreground">{category.title}</h2>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {category.integrations.map((integration) => {
                    const IntIcon = integration.icon;
                    return (
                      <div
                        key={integration.name}
                        className="rounded-xl border border-border/50 bg-card/60 p-5 hover:border-cosmic-purple/30 transition-all group backdrop-blur-sm"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-cosmic-purple/10 group-hover:bg-cosmic-purple/20 transition-colors text-cosmic-purple">
                              <IntIcon className="h-5 w-5" />
                            </div>
                            <h3 className="font-semibold text-foreground">{integration.name}</h3>
                          </div>
                          <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border border-border/60 bg-muted/50 text-foreground">
                            {integration.status}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed pl-[52px]">
                          {integration.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </div>

          {/* Request Integration */}
          <section className="mt-16 rounded-2xl border border-border/50 bg-card/60 p-8 text-center backdrop-blur-md">
            <h2 className="text-2xl font-bold font-display mb-3 text-foreground">Need a Custom Integration?</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Don't see the integration you need? Let us know — we build custom connectors for enterprise customers.
            </p>
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity"
            >
              Request Integration <ArrowUpRight className="h-4 w-4" />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Integrations;
