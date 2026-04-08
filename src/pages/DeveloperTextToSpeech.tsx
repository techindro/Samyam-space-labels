import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Mic, Play, Copy, Code, Zap, Globe, Volume2 } from "lucide-react";
import { useState, useRef } from "react";

const voices = [
  { id: "meera", name: "Meera", lang: "English", gender: "Female" },
  { id: "arjun", name: "Arjun", lang: "English", gender: "Male" },
  { id: "priya", name: "Priya", lang: "Hindi", gender: "Female" },
  { id: "ravi", name: "Ravi", lang: "Hindi", gender: "Male" },
];

const features = [
  { icon: Zap, title: "Ultra-Low Latency", description: "Sub-200ms response times optimized for real-time applications in mission-critical environments." },
  { icon: Globe, title: "Multi-Language Support", description: "Natural speech synthesis across multiple languages with native-quality pronunciation." },
  { icon: Volume2, title: "Custom Voice Cloning", description: "Create custom voice profiles for branded experiences and specialized use cases." },
  { icon: Code, title: "Simple Integration", description: "RESTful API with SDKs for Python, JavaScript, and Go. Get started in minutes." },
];

const codeExample = `import samyam

client = samyam.Client(api_key="your-api-key")

response = client.text_to_speech(
    text="Satellite telemetry nominal. All systems operational.",
    voice="meera",
    model="samyam-voice-v1",
    output_format="wav"
)

# Save the audio
with open("output.wav", "wb") as f:
    f.write(response.audio)`;

const DeveloperTextToSpeech = () => {
  const [inputText, setInputText] = useState("Satellite telemetry is nominal. All systems are operational.");
  const [selectedVoice, setSelectedVoice] = useState("meera");
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    if (!inputText.trim()) return;
    setIsPlaying(true);
    const utterance = new SpeechSynthesisUtterance(inputText);
    utterance.rate = 1;
    utterance.onend = () => setIsPlaying(false);
    utterance.onerror = () => setIsPlaying(false);
    window.speechSynthesis.speak(utterance);
  };

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
                <Mic className="h-3.5 w-3.5" />
                <span className="text-xs font-medium tracking-widest uppercase">Samyam Voice V1</span>
              </div>
              <h1 className="text-4xl md:text-6xl font-bold font-display mb-6 max-w-3xl">
                Text to Speech API
              </h1>
              <p className="text-lg text-primary-foreground/70 max-w-2xl mb-8">
                Convert text into natural, human-like speech. Built for space, defense, and enterprise applications with ultra-low latency and custom voice support.
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
            <p className="text-muted-foreground text-center mb-10 text-sm">Type text below and hear it spoken aloud.</p>
            <div className="max-w-3xl mx-auto">
              <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  rows={3}
                  className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground border border-border focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
                  placeholder="Enter text to synthesize..."
                />
                <div className="flex flex-wrap items-center gap-3">
                  <span className="text-xs text-muted-foreground font-medium">Voice:</span>
                  {voices.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setSelectedVoice(v.id)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                        selectedVoice === v.id
                          ? "bg-foreground text-primary-foreground"
                          : "bg-secondary text-muted-foreground hover:text-foreground"
                      }`}
                    >
                      {v.name} ({v.lang})
                    </button>
                  ))}
                </div>
                <Button
                  onClick={handlePlay}
                  disabled={isPlaying || !inputText.trim()}
                  className="w-full bg-foreground text-primary-foreground hover:opacity-90"
                >
                  {isPlaying ? (
                    <><Volume2 className="h-4 w-4 animate-pulse mr-2" /> Speaking...</>
                  ) : (
                    <><Play className="h-4 w-4 mr-2" /> Play Audio</>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-20 px-4 bg-secondary/30">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-12 text-center">Why Samyam Voice</h2>
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
            <p className="text-muted-foreground text-center mb-10 text-sm">Get started with just a few lines of code.</p>
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

export default DeveloperTextToSpeech;
