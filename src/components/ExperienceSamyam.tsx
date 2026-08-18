import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Database, BarChart3, Search, Mic, ArrowRight, Bot, X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { generateSamyamComprehensiveReply } from "@/lib/samyamPlatformKnowledge";

export default function ExperienceSamyam() {
  const [activeVoiceAgent, setActiveVoiceAgent] = useState<{ title: string; query: string; answer: string } | null>(null);
  const [isListening, setIsListening] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleStartSpeaking = (cardTitle: string, defaultQuery: string) => {
    const answer = generateSamyamComprehensiveReply(defaultQuery);
    setActiveVoiceAgent({ title: cardTitle, query: defaultQuery, answer });
    setIsListening(true);
    toast({
      title: `🎙️ Voice AI Agent Active: ${cardTitle}`,
      description: "Asking Samyam AI Platform Knowledge Base…",
    });
  };

  return (
    <section className="py-20 px-4 relative overflow-hidden bg-background">
      <div className="max-w-6xl mx-auto text-center relative z-10">
        {/* Live Agents Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-secondary/80 border border-border/60 text-foreground text-xs font-semibold uppercase tracking-wider mb-5 shadow-sm">
          <span className="w-2 h-2 rounded-full bg-[#0a0b14] animate-pulse" />
          <span>LIVE AGENTS</span>
        </div>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-5xl font-bold font-display text-foreground tracking-tight mb-4">
          Experience Samyam
        </h2>

        {/* Subtitle */}
        <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base mb-12 leading-relaxed">
          Interact with our AI agents using your voice. Ask questions about annotation, evaluation, or datasets.
        </p>

        {/* 3 Live Voice AI Agent Cards */}
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto text-left">
          {/* Card 1: Data Annotation */}
          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-secondary/70 flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
                <Database className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-xl text-foreground">Data Annotation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Label & annotate datasets for space and defense AI models
              </p>

              <div>
                <Link
                  to="/annotate/demo"
                  className="inline-flex items-center text-xs font-bold text-foreground hover:underline gap-1 transition-all"
                >
                  Open Annotation Tool <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <Button
              onClick={() => handleStartSpeaking("Data Annotation", "How do I annotate satellite imagery, use Grounding DINO, SAM masks, and export COCO in Samyam?")}
              className="w-full py-5 rounded-xl font-bold text-xs gap-2 transition-all shadow-md bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Mic className="w-4 h-4" />
              <span>Start Speaking</span>
            </Button>
          </div>

          {/* Card 2: Model Evaluation */}
          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-secondary/70 flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
                <BarChart3 className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-xl text-foreground">Model Evaluation</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Benchmark and evaluate AI model performance metrics
              </p>

              <div>
                <Link
                  to="/openclaw-chat"
                  className="inline-flex items-center text-xs font-bold text-foreground hover:underline gap-1 transition-all"
                >
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <Button
              onClick={() => handleStartSpeaking("Model Evaluation", "How does Active Learning queue sorting and IoU model evaluation work in Samyam?")}
              className="w-full py-5 rounded-xl font-bold text-xs gap-2 transition-all shadow-md bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Mic className="w-4 h-4" />
              <span>Start Speaking</span>
            </Button>
          </div>

          {/* Card 3: Dataset Query */}
          <div className="p-6 rounded-2xl bg-card border border-border/60 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col justify-between group">
            <div className="space-y-4 mb-8">
              <div className="w-12 h-12 rounded-xl bg-secondary/70 flex items-center justify-center text-foreground group-hover:scale-105 transition-transform">
                <Search className="w-6 h-6" />
              </div>

              <h3 className="font-bold text-xl text-foreground">Dataset Query</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Explore and search curated training datasets
              </p>

              <div>
                <Link
                  to="/openclaw-chat"
                  className="inline-flex items-center text-xs font-bold text-foreground hover:underline gap-1 transition-all"
                >
                  Explore <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <Button
              onClick={() => handleStartSpeaking("Dataset Query", "What datasets, formats, and SAR polarizations are supported in Samyam?")}
              className="w-full py-5 rounded-xl font-bold text-xs gap-2 transition-all shadow-md bg-slate-950 hover:bg-slate-900 text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-200"
            >
              <Mic className="w-4 h-4" />
              <span>Start Speaking</span>
            </Button>
          </div>
        </div>

        {/* Voice AI Agent Platform Knowledge Answer Modal */}
        {activeVoiceAgent && (
          <div className="mt-8 p-6 rounded-2xl bg-[#0c0d18] border border-[#252942] text-left max-w-4xl mx-auto shadow-2xl relative animate-in fade-in slide-in-from-bottom-4">
            <button
              onClick={() => setActiveVoiceAgent(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-white/10"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-2 mb-3 text-indigo-400 font-bold text-xs uppercase tracking-wider">
              <Bot className="w-4 h-4" /> Voice AI Agent — Platform Knowledge Response
            </div>
            <h4 className="text-base font-bold text-white mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-400" /> {activeVoiceAgent.title}
            </h4>
            <div className="text-xs text-slate-300 space-y-2 leading-relaxed bg-[#131526] p-4 rounded-xl border border-[#23263d]">
              <div className="whitespace-pre-line">{activeVoiceAgent.answer}</div>
            </div>
            <div className="mt-4 flex items-center justify-end gap-3">
              <Button
                size="sm"
                onClick={() => navigate("/openclaw-chat")}
                className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold gap-1 rounded-xl"
              >
                <span>Ask Follow-up Question in OpenClaw Chat</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
