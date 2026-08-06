import { ArrowLeft, Shield, Lock, Eye, Server, FileCheck, Globe, CheckCircle2, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const certifications = [
  { name: "SOC 2 Type II", status: "In Progress", icon: Shield, description: "Annual audit for security, availability, and confidentiality controls." },
  { name: "GDPR Compliant", status: "Active", icon: Globe, description: "Full compliance with EU General Data Protection Regulation." },
  { name: "ITAR Compliant", status: "Active", icon: Lock, description: "International Traffic in Arms Regulations for defense data handling." },
  { name: "ISO 27001", status: "Planned", icon: FileCheck, description: "Information Security Management System certification." },
  { name: "HIPAA Ready", status: "Planned", icon: BadgeCheck, description: "Healthcare data protection for medical imaging annotation." },
];

const securityFeatures = [
  {
    icon: Lock,
    title: "End-to-End Encryption",
    description: "All data encrypted in transit (TLS 1.3) and at rest (AES-256). Zero plaintext storage of sensitive payloads.",
  },
  {
    icon: Server,
    title: "Air-Gapped Deployment",
    description: "On-premise and VPC deployment options for classified and sensitive defense workloads. No data leaves your perimeter.",
  },
  {
    icon: Eye,
    title: "Audit Logging & RBAC",
    description: "Complete audit trail of every annotation, export, and access event. Role-Based Access Control with granular permissions.",
  },
  {
    icon: Shield,
    title: "Vulnerability Management",
    description: "Automated dependency scanning, SAST/DAST testing, and responsible disclosure program. Regular penetration testing.",
  },
  {
    icon: FileCheck,
    title: "Data Residency Controls",
    description: "Choose where your data is stored — US, EU, or India regions. Full compliance with local data sovereignty laws.",
  },
  {
    icon: Globe,
    title: "Privacy by Design",
    description: "Minimal data collection, automatic PII redaction tools, and configurable data retention policies.",
  },
];

const statusMap: Record<string, { color: string; bg: string }> = {
  Active: { color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/30" },
  "In Progress": { color: "text-amber-400", bg: "bg-amber-500/10 border-amber-500/30" },
  Planned: { color: "text-blue-400", bg: "bg-blue-500/10 border-blue-500/30" },
};

const Security = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <main className="pt-24 pb-20">
        <div className="container mx-auto px-4 max-w-5xl">
          {/* Header */}
          <div className="text-center mb-16">
            <Link to="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-6">
              <ArrowLeft className="h-4 w-4" /> Back to Home
            </Link>
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium mb-6 mx-auto">
              <Shield className="h-4 w-4" /> Enterprise-Grade Security
            </div>
            <h1 className="text-4xl md:text-5xl font-bold font-display mb-4">
              Security & Compliance
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Your data is our highest priority. Samyam is built from the ground up with defense-grade security for space agencies, military contractors, and enterprises.
            </p>
          </div>

          {/* Trust Banner */}
          <div className="rounded-2xl border border-emerald-500/20 bg-gradient-to-r from-emerald-500/5 via-transparent to-emerald-500/5 p-6 mb-16 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
            <div className="p-3 rounded-xl bg-emerald-500/10">
              <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            </div>
            <div>
              <h3 className="font-bold text-lg">All Systems Operational</h3>
              <p className="text-sm text-muted-foreground">
                Samyam platform uptime: <span className="text-emerald-400 font-semibold">99.95%</span> over the last 90 days. 
                <Link to="/status" className="text-cosmic-purple hover:underline ml-1">View Status →</Link>
              </p>
            </div>
          </div>

          {/* Compliance Certifications */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-display mb-6">Compliance & Certifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {certifications.map((cert) => {
                const CertIcon = cert.icon;
                const statusStyle = statusMap[cert.status];
                return (
                  <div key={cert.name} className="rounded-xl border border-white/5 bg-card/50 p-5 hover:border-white/10 transition-colors">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <CertIcon className="h-5 w-5 text-cosmic-purple" />
                        <h3 className="font-semibold text-sm">{cert.name}</h3>
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${statusStyle.bg} ${statusStyle.color}`}>
                        {cert.status}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{cert.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Security Features */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold font-display mb-6">Security Architecture</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {securityFeatures.map((feature) => {
                const FeatureIcon = feature.icon;
                return (
                  <div key={feature.title} className="rounded-xl border border-white/5 bg-card/50 p-6 hover:border-cosmic-purple/20 transition-all group">
                    <div className="p-2.5 rounded-lg bg-cosmic-purple/10 w-fit mb-4 group-hover:bg-cosmic-purple/20 transition-colors">
                      <FeatureIcon className="h-5 w-5 text-cosmic-purple" />
                    </div>
                    <h3 className="font-semibold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Responsible Disclosure */}
          <section className="rounded-2xl border border-white/5 bg-card/50 p-8 text-center">
            <h2 className="text-2xl font-bold font-display mb-3">Responsible Disclosure</h2>
            <p className="text-muted-foreground max-w-xl mx-auto mb-6">
              Found a vulnerability? We take security reports seriously. Please report any security issues to our dedicated security team.
            </p>
            <a
              href="mailto:security@samyam.ai"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white font-medium text-sm hover:opacity-90 transition-opacity"
            >
              <Shield className="h-4 w-4" /> Report a Vulnerability
            </a>
          </section>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Security;
