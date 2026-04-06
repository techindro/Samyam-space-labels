import { motion, AnimatePresence } from "framer-motion";
import { Mic, MicOff, Volume2, Loader2, X } from "lucide-react";
import { useState, useCallback, useRef } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const agents = [
  {
    title: "Data Annotation",
    gradient: "from-purple-300 via-violet-200 to-indigo-300",
    glowColor: "rgba(167, 139, 250, 0.4)",
    buttonBg: "bg-white/40 text-purple-700 hover:bg-white/60",
    activeBg: "bg-purple-500 text-white",
    ringColor: "ring-purple-400",
  },
  {
    title: "Model Evaluation",
    gradient: "from-orange-300 via-amber-300 to-orange-400",
    glowColor: "rgba(251, 146, 60, 0.4)",
    buttonBg: "bg-white/40 text-orange-700 hover:bg-white/60",
    activeBg: "bg-orange-500 text-white",
    ringColor: "ring-orange-400",
  },
  {
    title: "Dataset Query",
    gradient: "from-lime-300 via-green-300 to-emerald-300",
    glowColor: "rgba(134, 239, 172, 0.4)",
    buttonBg: "bg-white/40 text-green-700 hover:bg-white/60",
    activeBg: "bg-green-500 text-white",
    ringColor: "ring-green-400",
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

  const handleSpeak = useCallback(async (index: number) => {
    // If already active, stop
    if (activeAgent === index) {
      stopEverything(index);
      return;
    }

    // Stop any other active agent
    if (activeAgent !== null) {
      stopEverything(activeAgent);
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast({
        variant: "destructive",
        title: "Not supported",
        description: "Speech recognition is not supported in this browser. Try Chrome.",
      });
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
      const transcript = Array.from(event.results)
        .map((r: any) => r[0].transcript)
        .join("");
      updateTranscript(index, transcript);
    };

    recognition.onend = async () => {
      const finalTranscript = transcripts[index] || "";
      // Get latest transcript from state via a ref trick
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
        console.error("Speech recognition error:", e.error);
        toast({
          variant: "destructive",
          title: "Mic error",
          description: `Could not access microphone: ${e.error}`,
        });
      }
      updateState(index, "idle");
      setActiveAgent(null);
    };

    try {
      recognition.start();
    } catch (err) {
      console.error("Failed to start recognition:", err);
      updateState(index, "idle");
      setActiveAgent(null);
    }
  }, [activeAgent, stopEverything, toast]);

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

      // Speak the reply
      const utterance = new SpeechSynthesisUtterance(reply);
      utterance.rate = 1;
      utterance.pitch = 1;
      utteranceRef.current = utterance;

      utterance.onend = () => {
        updateState(index, "idle");
        setActiveAgent(null);
      };

      utterance.onerror = () => {
        updateState(index, "idle");
        setActiveAgent(null);
      };

      window.speechSynthesis.speak(utterance);
    } catch (err: any) {
      console.error("AI processing error:", err);
      toast({
        variant: "destructive",
        title: "Processing error",
        description: err?.message || "Failed to get AI response.",
      });
      updateState(index, "idle");
      setActiveAgent(null);
    }
  };

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
    <section className="py-20 px-4">
      <div className="container mx-auto max-w-5xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <h2 className="text-2xl md:text-3xl font-bold font-display">
            Experience Samyam
          </h2>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500" />
            </span>
            <span className="text-sm font-medium text-muted-foreground">LIVE</span>
          </div>
        </div>

        {/* Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
          {agents.map((agent, i) => {
            const state = agentStates[i];
            const isActive = state !== "idle";

            return (
              <motion.div
                key={agent.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.5 }}
                className="flex flex-col items-center"
              >
                {/* Mandala shape */}
                <div className="relative w-52 h-52 md:w-56 md:h-56 mb-4">
                  <div
                    className="absolute inset-0 rounded-full blur-2xl opacity-50 transition-opacity"
                    style={{ background: agent.glowColor, opacity: isActive ? 0.8 : 0.5 }}
                  />
                  <svg viewBox="0 0 200 200" className={`w-full h-full drop-shadow-lg transition-transform ${isActive ? 'scale-105' : ''}`} xmlns="http://www.w3.org/2000/svg">
                    <defs>
                      <linearGradient id={`grad-${i}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style={{ stopColor: i === 0 ? '#d8b4fe' : i === 1 ? '#fdba74' : '#86efac' }} />
                        <stop offset="50%" style={{ stopColor: i === 0 ? '#c4b5fd' : i === 1 ? '#fbbf24' : '#6ee7b7' }} />
                        <stop offset="100%" style={{ stopColor: i === 0 ? '#a5b4fc' : i === 1 ? '#f97316' : '#34d399' }} />
                      </linearGradient>
                    </defs>
                    <path
                      d="M100 8 C112 8, 130 30, 140 40 C150 30, 175 20, 185 35 C195 50, 175 65, 170 75 C185 80, 200 95, 195 110 C190 125, 170 125, 160 122 C165 135, 165 160, 150 168 C135 176, 120 160, 115 150 C110 165, 105 190, 90 192 C75 194, 72 170, 75 155 C65 165, 42 175, 30 165 C18 155, 30 135, 38 125 C22 128, 5 120, 5 105 C5 90, 22 82, 32 78 C20 70, 8 50, 18 38 C28 26, 48 35, 58 42 C55 30, 65 8, 80 8 C90 8, 95 15, 100 8 Z"
                      fill={`url(#grad-${i})`}
                      opacity="0.9"
                    />
                  </svg>

                  {/* Button overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <button
                      onClick={() => handleSpeak(i)}
                      className={`flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium backdrop-blur-sm transition-all shadow-md ${
                        isActive
                          ? `${agent.activeBg} ring-2 ${agent.ringColor} ring-offset-2`
                          : agent.buttonBg
                      }`}
                    >
                      {getButtonIcon(state)}
                      {getButtonLabel(state)}
                    </button>
                  </div>
                </div>

                {/* Label */}
                <span className="text-base font-medium text-foreground">{agent.title}</span>

                {/* Transcript/Reply bubble */}
                <AnimatePresence>
                  {(transcripts[i] || replies[i]) && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="mt-3 max-w-[220px] text-center"
                    >
                      {transcripts[i] && (
                        <p className="text-xs text-muted-foreground italic mb-1">
                          "{transcripts[i]}"
                        </p>
                      )}
                      {replies[i] && (
                        <p className="text-xs text-foreground bg-muted/50 rounded-lg px-3 py-2">
                          {replies[i]}
                        </p>
                      )}
                      {state === "idle" && (
                        <button
                          onClick={() => { updateTranscript(i, ""); updateReply(i, ""); }}
                          className="mt-1 text-xs text-muted-foreground hover:text-foreground"
                        >
                          <X className="h-3 w-3 inline" /> Clear
                        </button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceSamyam;
