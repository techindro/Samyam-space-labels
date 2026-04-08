import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { MessageSquareText, Mic, MicOff, Copy, Code, Zap, Shield, FileText } from "lucide-react";
import { useState, useRef, useCallback } from "react";

const features = [
  { icon: Zap, title: "Real-Time Streaming", description: "Live transcription with word-level timestamps, optimized for mission comms and telemetry narration." },
  { icon: Shield, title: "Secure & On-Premise", description: "ITAR-compliant processing with options for air-gapped, on-premise deployment." },
  { icon: FileText, title: "Domain-Specific Models", description: "Fine-tuned models for aerospace, defense, and scientific terminology with 98%+ accuracy." },
  { icon: Code, title: "Flexible Output", description: "Get plain text, timestamped segments, or structured JSON with speaker diarization." },
];

const codeExample = `import samyam

client = samyam.Client(api_key="your-api-key")

# Transcribe an audio file
result = client.speech_to_text(
    audio="mission_briefing.wav",
    model="samyam-scribe-v1",
    language="en",
    timestamps=True
)

for segment in result.segments:
    print(f"[{segment.start:.1f}s] {segment.text}")`;

const DeveloperSpeechToText = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const recognitionRef = useRef<any>(null);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
      return;
    }

    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) { setTranscript("Speech recognition not supported. Try Chrome."); return; }

    const recognition = new SR();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = true;
    recognitionRef.current = recognition;

    recognition.onresult = (e: any) => {
      const text = Array.from(e.results).map((r: any) => r[0].transcript).join("");
      setTranscript(text);
    };
    recognition.onerror = () => setIsRecording(false);
    recognition.onend = () => setIsRecording(false);

    recognition.start();
    setIsRecording(true);
    setTranscript("");
  }, [isRecording]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar variant="dark" />
      <main>
        {/* Hero */}
        <section className="relative pt-32 pb-20 px-4 bg-foreground text-primary-foreground overflow-hidden">
          <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: "radial-gradient(circle at 1px 1px, currentColor 1px, transparent 0)", backgroundSize: "40px 40px" }} />
          <div className="container mx-auto max-w-6xl relative">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/5">
                <MessageSquareText className="h-3.5 w-3.5" />
                <span className="text-xs font-medium tracking-widest uppercase">Samyam Scribe V1</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 max-w-3xl">
                Speech to Text API
              </h1>
              <p className="text-lg text-primary-foreground/70 max-w-2xl mb-8">
                Transcribe audio into accurate text in real-time. Built for aerospace and defense with domain-specific vocabulary and streaming support.
              </p>
              <div className="flex gap-4">
                <Button size="lg" className="bg-primary-foreground text-foreground hover:bg-primary-foreground/90">
                  Get API Key
                </Button>
                <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                  View Docs
                </Button>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Interactive Demo */}
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-2 text-center">Try It Live</h2>
            <p className="text-muted-foreground text-center mb-10 text-sm">Click the microphone to start real-time transcription.</p>
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl border border-border bg-card p-8 flex flex-col items-center gap-6">
                <button
                  onClick={toggleRecording}
                  className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                    isRecording
                      ? "bg-destructive text-destructive-foreground shadow-[0_0_40px_-8px_hsl(var(--destructive)/0.5)] scale-110"
                      : "bg-foreground text-primary-foreground hover:scale-105"
                  }`}
                >
                  {isRecording ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </button>
                <span className="text-xs text-muted-foreground">
                  {isRecording ? "Listening... click to stop" : "Click to start recording"}
                </span>
                <div className="w-full min-h-[120px] rounded-xl bg-secondary/50 border border-border p-4">
                  {transcript ? (
                    <p className="text-sm text-foreground leading-relaxed">{transcript}</p>
                  ) : (
                    <p className="text-sm text-muted-foreground italic">Transcript will appear here...</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-secondary/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-12 text-center">Why Samyam Scribe</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {features.map((f, i) => (
                <motion.div
                  key={f.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="rounded-2xl border border-border bg-card p-6 flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center shrink-0">
                    <f.icon className="h-5 w-5 text-foreground" />
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
        <section className="py-20 px-4">
          <div className="container mx-auto max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-2 text-center">Quick Start</h2>
            <p className="text-muted-foreground text-center mb-10 text-sm">Transcribe audio in just a few lines.</p>
            <div className="rounded-2xl border border-border bg-foreground text-primary-foreground overflow-hidden">
              <div className="flex items-center justify-between px-5 py-3 border-b border-primary-foreground/10">
                <span className="text-xs font-mono text-primary-foreground/50">python</span>
                <button
                  onClick={() => navigator.clipboard.writeText(codeExample)}
                  className="text-xs text-primary-foreground/40 hover:text-primary-foreground/70 flex items-center gap-1"
                >
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
              <pre className="p-5 text-sm font-mono leading-relaxed overflow-x-auto">
                <code>{codeExample}</code>
              </pre>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default DeveloperSpeechToText;
