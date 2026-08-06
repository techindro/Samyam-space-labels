import { ArrowLeft, CheckCircle2, Clock, RefreshCw } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import MonochromeGridBg from "@/components/MonochromeGridBg";

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
    <div className="min-h-screen bg-black text-white relative">
      <Navbar />
      <MonochromeGridBg />

      <main className="pt-28 pb-20 relative z-10">
        <div className="container mx-auto px-4 max-w-4xl">
          {/* Header */}
          <div className="mb-12">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-white/60 hover:text-white transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-3 text-white">
              System Status
            </h1>
            <p className="text-lg text-white/70">
              Real-time operational status and uptime performance for Samyam services.
            </p>
          </div>

          {/* Main Status Banner */}
          <div className="rounded-2xl border border-white/20 bg-white/[0.04] p-6 md:p-8 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex items-center gap-4">
              <div className="relative">
                <CheckCircle2 className="h-10 w-10 text-white" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-white"></span>
                </span>
              </div>
              <div>
                <h2 className="text-xl font-bold text-white">All Systems Operational</h2>
                <p className="text-sm text-white/70">99.96% average uptime over the past 90 days</p>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs text-white/80 bg-white/10 px-3 py-1.5 rounded-full border border-white/20">
              <RefreshCw className="h-3.5 w-3.5 animate-spin text-white" /> Live update
            </div>
          </div>

          {/* Services List */}
          <section className="mb-14">
            <h2 className="text-xl font-bold font-display mb-4 text-white">Core Services</h2>
            <div className="rounded-2xl border border-white/10 bg-white/[0.03] overflow-hidden divide-y divide-white/5">
              {services.map((service) => (
                <div key={service.name} className="p-4 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-white/[0.05] transition-colors">
                  <div>
                    <h3 className="font-semibold text-sm text-white">{service.name}</h3>
                    <p className="text-xs text-white/60">{service.category}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="text-xs text-white/60 font-mono">{service.uptime} uptime</span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-white bg-white/10 px-2.5 py-1 rounded-full border border-white/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                      {service.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Incident History */}
          <section>
            <h2 className="text-xl font-bold font-display mb-4 text-white">Past Incidents & Maintenance</h2>
            <div className="space-y-4">
              {incidentHistory.map((incident, i) => (
                <div key={i} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                    <h3 className="font-semibold text-sm text-white">{incident.title}</h3>
                    <span className="text-xs text-white/60 flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5 text-white/60" /> {incident.date}
                    </span>
                  </div>
                  <p className="text-xs text-white/60 leading-relaxed mb-3">{incident.description}</p>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-white/10 px-2.5 py-0.5 rounded border border-white/20">
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
