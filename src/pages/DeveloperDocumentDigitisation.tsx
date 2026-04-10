import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { ScanText, Upload, Copy, Code, Zap, Shield, Layers } from "lucide-react";
import { useState, useRef } from "react";

const features = [
  { icon: Zap, title: "Intelligent OCR", description: "Beyond basic OCR — understands tables, charts, handwritten notes, and complex document layouts." },
  { icon: Shield, title: "Classified Doc Ready", description: "Process sensitive documents with ITAR-compliant, air-gapped deployment options." },
  { icon: Layers, title: "Multi-Format Support", description: "Handle PDFs, scanned images, satellite imagery metadata, technical diagrams, and more." },
  { icon: Code, title: "Structured Output", description: "Get clean JSON, Markdown, or plain text with layout-aware extraction and field mapping." },
];

const codeExample = `import samyam

client = samyam.Client(api_key="your-api-key")

# Digitise a document
result = client.document_digitise(
    file="satellite_report.pdf",
    model="samyam-vision-v1",
    output_format="markdown",
    extract_tables=True
)

print(result.text)
for table in result.tables:
    print(table.to_dataframe())`;

const DeveloperDocumentDigitisation = () => {
  const [dragActive, setDragActive] = useState(false);
  const [fileName, setFileName] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    setFileName(file.name);
    if (file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => setExtractedText(e.target?.result as string || "");
      reader.readAsText(file);
    } else {
      setExtractedText(`[Preview] Document "${file.name}" (${(file.size / 1024).toFixed(1)} KB) would be processed by Samyam Vision V1.\n\nSupported extraction:\n• Full text with layout preservation\n• Table detection & extraction\n• Handwriting recognition\n• Diagram annotation`);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 overflow-hidden">
          <ParallelWebBg />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-transparent pointer-events-none" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-border bg-secondary/50">
                <ScanText className="h-3.5 w-3.5 text-cosmic-purple" />
                <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground" style={{ fontFamily: "'Comfortaa', cursive" }}>Samyam Vision V1</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 max-w-3xl text-foreground">
                Document Digitisation API
              </h1>
              <p className="text-lg text-muted-foreground max-w-2xl mb-8">
                Transform scanned documents, PDFs, and images into structured, searchable data. Purpose-built for technical and classified document workflows.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground border-0">
                  Get API Key
                </Button>
                <Button size="lg" variant="outline">
                  View Docs
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="relative py-20 px-4 overflow-hidden">
          <ParallelWebBg />
          <div className="container mx-auto max-w-6xl relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-2 text-center">Try It Live</h2>
            <p className="text-muted-foreground text-center mb-10 text-sm">Upload a document to see extraction in action.</p>
            <div className="max-w-3xl mx-auto">
              <div className="glass-card rounded-2xl p-6 space-y-5">
                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={(e) => { e.preventDefault(); setDragActive(false); if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]); }}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                    dragActive ? "border-cosmic-purple bg-cosmic-purple/5" : "border-border hover:border-cosmic-purple/30"
                  }`}
                >
                  <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    {fileName || "Drop a file here or click to upload"}
                  </p>
                  <p className="text-xs text-muted-foreground/60 mt-1">PDF, PNG, JPG, TXT supported</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    className="hidden"
                    accept=".pdf,.png,.jpg,.jpeg,.txt"
                    onChange={(e) => { if (e.target.files?.[0]) handleFile(e.target.files[0]); }}
                  />
                </div>
                {extractedText && (
                  <div className="rounded-xl bg-secondary/50 border border-border p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium text-muted-foreground">Extracted Output</span>
                      <button
                        onClick={() => navigator.clipboard.writeText(extractedText)}
                        className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                      >
                        <Copy className="h-3 w-3" /> Copy
                      </button>
                    </div>
                    <pre className="text-sm text-foreground whitespace-pre-wrap font-mono leading-relaxed">{extractedText}</pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="relative py-20 px-4 overflow-hidden">
          <ParallelWebBg />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-teal/5 to-transparent pointer-events-none" />
          <div className="container mx-auto max-w-6xl relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-12 text-center">Why Samyam Vision</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-2xl p-6 flex gap-4 hover:border-cosmic-purple/40 transition-all"
                >
                  <div className="w-10 h-10 rounded-xl bg-cosmic-purple/10 flex items-center justify-center shrink-0">
                    <f.icon className="h-5 w-5 text-cosmic-purple" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{f.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{f.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Code Example */}
        <section className="relative py-20 px-4 overflow-hidden">
          <ParallelWebBg />
          <div className="container mx-auto max-w-4xl relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-2 text-center">Quick Start</h2>
            <p className="text-muted-foreground text-center mb-10 text-sm">Digitise documents in just a few lines.</p>
            <div className="glass-card rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-border/30">
                <span className="text-xs font-mono text-muted-foreground">python</span>
                <button
                  onClick={() => navigator.clipboard.writeText(codeExample)}
                  className="text-xs text-muted-foreground hover:text-foreground flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
              <pre className="p-5 text-sm font-mono leading-relaxed overflow-x-auto bg-secondary/30">
                <code className="text-foreground">{codeExample}</code>
              </pre>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DeveloperDocumentDigitisation;
