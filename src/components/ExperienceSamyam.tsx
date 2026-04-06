import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, Loader2, X, Database, BarChart3, Search } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const agents = [
  {
    title: "Data Annotation",
    description: "Label & annotate datasets for space and defense AI models",
    icon: Database,
  },
  {
    title: "Model Evaluation",
    description: "Benchmark and evaluate AI model performance metrics",
    icon: BarChart3,
  },
  {
    title: "Dataset Query",
    description: "Explore and search curated training datasets",
    icon: Search,
  },
];

type AgentState = "idle" | "listening" | "processing" | "speaking";

const ExperienceSamyam = () => {
  const [activeAgent, setActiveAgent] = useState<number | null>(null);
  const [agentStates, setAgentStates] = useState<AgentState[]>(["idle", "idle", "idle"]);
  const [transcripts, setTranscripts] = useState<string[]>(["", "", ""]);
  const [replies, setReplies] = useState<string[]>(["", "", ""]);
  const recognitionRef = useRef<any>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const { toast } = useToast();

  const updateState = (index: number, state: AgentState) => {
    setAgentStates((prev) => prev.map((s, i) => (i === index ? state : s)));
  };

  const updateTranscript = (index: number, text: string) => {
    setTranscripts((prev) => prev.map((s, i) => (i === index ? text : s)));
  };

  const updateReply = (index: number, text: string) => {
    setReplies((prev) => prev.map((s, i) => (i === index ? text : s)));
  };

  const stopEverything = useCallback((index: number) => {
    if (recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch {}
      recognitionRef.current = null;
    }
    window.speechSynthesis.cancel();
    updateState(index, "idle");
    setActiveAgent(null);
  }, []);

  const processWithAI = async (index: number, message: string, agentType: string) => {
    updateState(index, "processing");
    try {
      const { data, error } = await supabase.functions.invoke("voice-agent", {
        body: { message, agentType },
      });
      if (error) throw error;
      const reply = data?.reply || "Sorry, I couldn't process that.";
      updateReply(index, reply);
      updateState(index, "speaking");
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.rate = 1;
      utterance.pitch = 1;
      utteranceRef.current = utterance;
      utterance.onend = () => { updateState(index, "idle"); setActiveAgent(null); };
      utterance.onerror = () => { updateState(index, "idle"); setActiveAgent(null); };
      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      console.error("AI processing error:", err);
      toast({ variant: "destructive", title: "Processing error", description: err?.message || "Failed to get AI response." });
      updateState(index, "idle");
      setActiveAgent(null);
    }
  };

  const handleSpeak = useCallback(async (index: number) => {
    if (activeAgent === index) { stopEverything(index); return; }
    if (activeAgent !== null) { stopEverything(activeAgent); }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({ variant: "destructive", title: "Not supported", description: "Speech recognition is not supported in this browser. Try Chrome." });
      return;
    }

    setActiveAgent(index);
    updateState(index, "listening");
    updateTranscript(index, "");
    updateReply(index, "");

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;
    recognitionRef.current = recognition;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results).map((r: any) => r[0].transcript).join("");
      updateTranscript(index, transcript);
    };

    recognition.onend = async () => {
      setTranscripts((prev) => {
        const text = prev[index];
        if (text && text.trim()) {
          processWithAI(index, text, agents[index].title);
        } else {
          updateState(index, "idle");
          setActiveAgent(null);
        }
        return prev;
      });
    };

    recognition.onerror = (e: any) => {
      if (e.error !== "aborted") {
        toast({ variant: "destructive", title: "Mic error", description: `Could not access microphone: ${e.error}` });
      }
      updateState(index, "idle");
      setActiveAgent(null);
    };

    try { recognition.start(); } catch {
      updateState(index, "idle");
      setActiveAgent(null);
    }
  }, [activeAgent, stopEverything, toast]);

  const getButtonLabel = (state: AgentState) => {
    switch (state) {
      case "listening": return "Listening...";
      case "processing": return "Thinking...";
      case "speaking": return "Speaking...";
      default: return "Start Speaking";
    }
  };

  const getButtonIcon = (state: AgentState) => {
    switch (state) {
      case "listening": return <MicOff className="h-4 w-4" />;
      case "processing": return <Loader2 className="h-4 w-4 animate-spin" />;
      case "speaking": return <Volume2 className="h-4 w-4 animate-pulse" />;
      default: return <Mic className="h-4 w-4" />;
    }
  };

  return (
    <section className="py-24 px-4 relative">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-border bg-secondary/50">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-foreground opacity-40" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-foreground" />
            </span>
            <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Live Agents</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground mb-3">
            Experience Samyam
          </h2>
          <p className="text-muted-foreground max-w-lg mx-auto text-sm">
            Interact with our AI agents using your voice. Ask questions about annotation, evaluation, or datasets.
          </p>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {agents.map((agent, i) => {
            const state = agentStates[i];
            const isActive = state !== "idle";
            const Icon = agent.icon;

            return (
              <motion.div
                key={agent.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className={`group relative rounded-2xl border transition-all duration-300 overflow-hidden ${
                  isActive
                    ? "border-foreground bg-foreground text-primary-foreground shadow-[0_0_40px_-12px_hsl(var(--foreground)/0.3)]"
                    : "border-border bg-card hover:border-foreground/30 hover:shadow-lg"
                }`}
              >
                {/* Geometric accent */}
                <div className={`absolute top-0 right-0 w-32 h-32 rounded-bl-[80px] transition-colors duration-300 ${
                  isActive ? "bg-primary-foreground/5" : "bg-secondary/60"
                }`} />

                <div className="relative p-8 flex flex-col min-h-[320px]">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 transition-colors duration-300 ${
                    isActive ? "bg-primary-foreground/15" : "bg-secondary"
                  }`}>
                    <Icon className="h-5 w-5" />
                  </div>

                  {/* Title & description */}
                  <h3 className="text-lg font-semibold font-display mb-2">{agent.title}</h3>
                  <p className={`text-sm mb-6 leading-relaxed ${
                    isActive ? "text-primary-foreground/70" : "text-muted-foreground"
                  }`}>
                    {agent.description}
                  </p>

                  {/* Spacer */}
                  <div className="flex-1" />

                  {/* Transcript/Reply */}
                  <AnimatePresence>
                    {(transcripts[i] || replies[i]) && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="mb-4 overflow-hidden"
                      >
                        {transcripts[i] && (
                          <p className={`text-xs italic mb-1.5 ${isActive ? "text-primary-foreground/50" : "text-muted-foreground"}`}>
                            "{transcripts[i]}"
                          </p>
                        )}
                        {replies[i] && (
                          <div className={`text-xs rounded-lg px-3 py-2.5 leading-relaxed ${
                            isActive ? "bg-primary-foreground/10 text-primary-foreground/90" : "bg-secondary text-foreground"
                          }`}>
                            {replies[i]}
                          </div>
                        )}
                        {state === "idle" && (
                          <button
                            onClick={() => { updateTranscript(i, ""); updateReply(i, ""); }}
                            className={`mt-1.5 text-xs flex items-center gap-1 transition-colors ${
                              isActive ? "text-primary-foreground/40 hover:text-primary-foreground/70" : "text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            <X className="h-3 w-3" /> Clear
                          </button>
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Voice button */}
                  <button
                    onClick={() => handleSpeak(i)}
                    className={`w-full flex items-center justify-center gap-2.5 px-5 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                      isActive
                        ? "bg-primary-foreground text-foreground shadow-lg"
                        : "bg-foreground text-primary-foreground hover:opacity-90"
                    }`}
                  >
                    {getButtonIcon(state)}
                    {getButtonLabel(state)}

                    {/* Listening pulse rings */}
                    {state === "listening" && (
                      <>
                        <span className="absolute inset-0 rounded-xl animate-ping border border-foreground/20 pointer-events-none" style={{ animationDuration: "1.5s" }} />
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSamyam;
