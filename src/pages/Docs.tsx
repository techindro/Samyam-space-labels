import { motion } from "framer-motion";
import { Book, Code2, Mic, MessageSquareText, ScanText, ArrowRight, Terminal, Copy, CheckCheck, ExternalLink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";

const apis = [
  {
    icon: Mic,
    name: "Text to Speech",
    model: "Samyam Voice V1",
    description: "Convert text to natural-sounding Indian-accented speech in 12+ languages.",
    href: "/developers/text-to-speech",
    badge: "Live",
    endpoint: "POST /v1/tts/synthesize",
    sampleCode: `fetch("https://api.samyam.ai/v1/tts/synthesize", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY" },
  body: JSON.stringify({
    text: "Namaste, yeh Samyam Voice hai",
    language: "hi-IN",
    voice: "priya"
  })
})`,
  },
  {
    icon: MessageSquareText,
    name: "Speech to Text",
    model: "Samyam Scribe V1",
    description: "Transcribe audio to text with support for Indian languages and dialects.",
    href: "/developers/speech-to-text",
    badge: "Live",
    endpoint: "POST /v1/stt/transcribe",
    sampleCode: `const formData = new FormData();
formData.append("audio", audioFile);
formData.append("language", "hi-IN");

fetch("https://api.samyam.ai/v1/stt/transcribe", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY" },
  body: formData
})`,
  },
  {
    icon: ScanText,
    name: "Document Digitisation",
    model: "Samyam Vision",
    description: "Extract structured text from scanned documents, forms, and satellite imagery reports.",
    href: "/developers/document-digitisation",
    badge: "Live",
    endpoint: "POST /v1/vision/digitise",
    sampleCode: `fetch("https://api.samyam.ai/v1/vision/digitise", {
  method: "POST",
  headers: { "Authorization": "Bearer YOUR_API_KEY" },
  body: JSON.stringify({
    document_url: "https://...",
    output_format: "json"
  })
})`,
  },
];

const quickLinks = [
  { icon: Book, label: "Getting Started Guide", desc: "Set up your API key and make your first call in 5 minutes." },
  { icon: Code2, label: "API Reference", desc: "Complete list of all endpoints, parameters, and response schemas." },
  { icon: Terminal, label: "SDKs & Libraries", desc: "Official SDKs for Python, JavaScript, and Go." },
];

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); }}
      className="p-1.5 rounded hover:bg-white/10 transition-colors text-white/50 hover:text-white"
    >
      {copied ? <CheckCheck className="h-3.5 w-3.5 text-cosmic-teal" /> : <Copy className="h-3.5 w-3.5" />}
    </button>
  );
};

const Docs = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative overflow-hidden">
        <ParallelWebBg />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/5 via-transparent to-transparent pointer-events-none" />

        {/* Hero */}
        <section className="py-24 relative z-10">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-border bg-secondary/50">
                <Book className="h-3.5 w-3.5" />
                <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Documentation</span>
              </div>
              <h1 className="font-display text-5xl font-bold mb-4">
                Samyam{" "}
                <span className="bg-gradient-to-r from-cosmic-purple-glow to-cosmic-teal bg-clip-text text-transparent">
                  Developer Docs
                </span>
              </h1>
              <p className="text-muted-foreground text-lg mb-8">
                Everything you need to integrate Samyam's AI APIs into your applications.
              </p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground border-0">
                  <Terminal className="h-4 w-4 mr-2" /> Quick Start
                </Button>
                <Button variant="outline">
                  <ExternalLink className="h-4 w-4 mr-2" /> API Reference
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Quick Links */}
        <section className="pb-12 relative z-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <div className="grid md:grid-cols-3 gap-4">
              {quickLinks.map((ql, i) => {
                const Icon = ql.icon;
                return (
                  <motion.div
                    key={ql.label}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card rounded-xl p-5 hover:border-foreground/20 transition-colors cursor-pointer group"
                  >
                    <div className="p-2 rounded-lg bg-secondary w-fit mb-3">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="font-medium text-sm mb-1 group-hover:text-cosmic-teal transition-colors">{ql.label}</p>
                    <p className="text-muted-foreground text-xs leading-relaxed">{ql.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* API Cards */}
        <section className="py-16 border-t border-border/30 relative z-10">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mb-10"
            >
              <h2 className="font-display text-2xl font-bold mb-2">Available APIs</h2>
              <p className="text-muted-foreground text-sm">Three core APIs, all production-ready.</p>
            </motion.div>

            <div className="space-y-6">
              {apis.map((api, i) => {
                const Icon = api.icon;
                return (
                  <motion.div
                    key={api.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="glass-card rounded-2xl overflow-hidden"
                  >
                    <div className="p-6 md:p-8 grid md:grid-cols-2 gap-6 items-start">
                      {/* Left */}
                      <div>
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2.5 rounded-xl bg-secondary">
                            <Icon className="h-5 w-5" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="font-display font-semibold">{api.name}</h3>
                              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cosmic-teal/10 text-cosmic-teal font-semibold">
                                {api.badge}
                              </span>
                            </div>
                            <p className="text-xs text-muted-foreground">{api.model}</p>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed mb-4">{api.description}</p>
                        <div className="flex items-center gap-2 bg-secondary/50 rounded-lg px-3 py-2 w-fit">
                          <Terminal className="h-3.5 w-3.5 text-muted-foreground" />
                          <code className="text-xs font-mono text-foreground">{api.endpoint}</code>
                        </div>
                        <Link to={api.href} className="mt-4 inline-flex items-center gap-1 text-sm text-cosmic-teal hover:underline">
                          View full docs <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>

                      {/* Right — code snippet */}
                      <div className="relative rounded-xl bg-[#0d0d0d] border border-white/10 overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                          <div className="flex gap-1.5">
                            <div className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                            <div className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                            <div className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                          </div>
                          <CopyButton code={api.sampleCode} />
                        </div>
                        <pre className="p-4 text-[11px] leading-relaxed text-white/70 overflow-x-auto font-mono">
                          <code>{api.sampleCode}</code>
                        </pre>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Authentication */}
        <section className="py-16 border-t border-border/30 relative z-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-2xl font-bold mb-6">Authentication</h2>
              <div className="glass-card rounded-xl p-6 space-y-4">
                <p className="text-sm text-muted-foreground">
                  All API requests must include your API key in the <code className="bg-secondary px-1.5 py-0.5 rounded text-xs">Authorization</code> header:
                </p>
                <div className="relative rounded-xl bg-[#0d0d0d] border border-white/10 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                    <span className="text-white/40 text-xs">Header</span>
                    <CopyButton code={`Authorization: Bearer YOUR_API_KEY`} />
                  </div>
                  <pre className="p-4 text-[12px] text-white/70 font-mono">
                    <code>Authorization: Bearer YOUR_API_KEY</code>
                  </pre>
                </div>
                <p className="text-xs text-muted-foreground">
                  Get your API key from your{" "}
                  <Link to="/dashboard" className="text-foreground underline underline-offset-4">Dashboard</Link>.
                  Don't have an account?{" "}
                  <Link to="/auth" className="text-foreground underline underline-offset-4">Sign up free →</Link>
                </p>
              </div>
            </motion.div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 border-t border-border/30 relative z-10">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-2xl font-bold mb-3">Need help or a custom integration?</h2>
              <p className="text-muted-foreground text-sm mb-6">Our engineers are ready to help you ship faster.</p>
              <div className="flex gap-3 justify-center flex-wrap">
                <Button asChild className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground border-0">
                  <Link to="/contact">Contact Support</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/pricing">View Pricing</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Docs;
