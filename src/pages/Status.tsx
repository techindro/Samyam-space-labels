import { ArrowLeft, CheckCircle2, AlertTriangle, XCircle, Clock, Server, Database, Shield, Globe, Cpu, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const services = [
  { name: "Annotation Canvas Engine", category: "Core Platform", status: "Operational", uptime: "99.98%" },
  { name: "SAM Auto-Segmentation API", category: "AI Services", status: "Operational", uptime: "99.95%" },
  { name: "Groq Llama-3.3 Copilot (OpenClaw)", category: "AI Services", status: "Operational", uptime: "99.90%" },
  { name: "Multimodal Processing Pipeline", category: "Data Pipeline", status: "Operational", uptime: "99.99%" },
  { name: "Cloud Storage Integration (S3/GCS)", category: "Storage", status: "Operational", uptime: "100.0%" },
  { name: "Authentication & RBAC (Supabase)", category: "Core Platform", status: "Operational", uptime: "99.99%" },
  { name: "Developer APIs (TTS / STT / Vision)", category: "Developer Tools", status: "Operational", uptime: "99.95%" },
  { name: "VPC & Air-Gapped Cluster Manager", category: "Enterprise Infrastructure", status: "Operational", uptime: "99.99%" },
];

const incidentHistory = [
  {
    date: "August 1, 2026",
    title: "Scheduled Maintenance — SAM Model Weights Update",
    status: "Completed",
    description: "Successfully updated zero-shot segmentation model weights. Zero downtime reported.",
  },
  {
    date: "July 22, 2026",
    title: "Minor Latency Spike in Audio Spectrogram Generator",
    status: "Resolved",
    description: "Identified memory pressure on audio processing nodes. Auto-scaled cluster size to restore sub-50ms latency.",
  },
  {
    date: "July 10, 2026",
    title: "API Rate Limiting Infrastructure Upgrade",
    status: "Completed",
    description: "Upgraded Redis cache layer for developer API endpoints. Increased throughput capacity by 4x.",
  },
];

const Status = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-3">
              System Status
            </h1>
            <p className="text-lg text-muted-foreground">
              Real-time operational status and uptime performance for Samyam services.
            </p>
          </div>

          {/* Main Status Banner */}
          <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 md:p-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="relative">
                <CheckCircle2 className="h-10 w-10 text-emerald-400" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">All Systems Operational</h2>
                <p className="text-sm text-emerald-300/80">99.96% average uptime over the past 90 days</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-muted-foreground bg-black/30 px-3 py-1.5 rounded-full border border-white/10">
              <RefreshCw className="h-3.5 w-3.5 animate-spin" /> Live update
            </div>
          </div>

          {/* Services List */}
          <section className="mb-14">
            <h2 className="text-xl font-bold font-display mb-4">Core Services</h2>
            <div className="rounded-2xl border border-white/10 bg-card/50 overflow-hidden divide-y divide-white/5">
              {services.map((service) => (
                <div key={service.name} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.02] transition-colors">
                  <div>
                    <h3 className="font-semibold text-sm">{service.name}</h3>
                    <p className="text-xs text-muted-foreground">{service.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground font-mono">{service.uptime} uptime</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Incident History */}
          <section>
            <h2 className="text-xl font-bold font-display mb-4">Past Incidents & Maintenance</h2>
            <div className="space-y-4">
              {incidentHistory.map((incident, i) => (
                <div key={i} className="rounded-xl border border-white/5 bg-card/50 p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm">{incident.title}</h3>
                    <span className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" /> {incident.date}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed mb-3">{incident.description}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {incident.status}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Status;
