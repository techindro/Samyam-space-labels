import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sparkles, Bot, X, ArrowUpRight, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";

export const FloatingAiWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end gap-3">
      {/* Quick AI Preview Popover */}
      {isOpen && (
        <div className="w-[calc(100vw-24px)] max-w-sm sm:w-96 rounded-2xl border border-cosmic-purple/30 bg-background/95 backdrop-blur-xl p-4 sm:p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-5 duration-200">
          <div className="flex items-center justify-between border-b border-border/40 pb-3 mb-3">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-xl bg-gradient-to-tr from-cosmic-purple to-cosmic-teal text-white">
                <Bot className="h-5 w-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold leading-tight">OpenClaw AI Copilot</h4>
                <p className="text-[11px] text-muted-foreground">Groq Llama-3.3 70B Active</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-muted-foreground hover:text-foreground p-1 rounded-lg hover:bg-muted transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <p className="text-xs text-muted-foreground leading-relaxed mb-4">
            Need help labeling satellite data, analyzing bounding boxes, or executing dataset automation? Launch the full OpenClaw AI workspace.
          </p>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white font-medium hover:opacity-95 border-0 shadow-lg shadow-cosmic-purple/20 gap-1.5"
              onClick={() => {
                setIsOpen(false);
                navigate("/openclaw-chat");
              }}
            >
              <Sparkles className="h-4 w-4" />
              Open AI Workspace
              <ArrowUpRight className="h-3.5 w-3.5 ml-auto" />
            </Button>
          </div>
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="group relative flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-white font-semibold text-sm shadow-[0_0_20px_rgba(147,51,234,0.4)] hover:shadow-[0_0_30px_rgba(147,51,234,0.6)] hover:scale-105 transition-all duration-300 active:scale-95"
      >
        <div className="relative flex items-center justify-center">
          <Bot className="h-5 w-5 transition-transform group-hover:rotate-12" />
          <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
          </span>
        </div>
        <span className="tracking-wide">OpenClaw AI</span>
      </button>
    </div>
  );
};
