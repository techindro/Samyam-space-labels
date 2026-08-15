import { useState, useEffect } from "react";
import { Monitor, Download, Check, Laptop } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function InstallAppButton({ className = "" }: { className?: string }) {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstalled, setIsInstalled] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstall);

    if (window.matchMedia("(display-mode: standalone)").matches) {
      setIsInstalled(true);
    }

    return () => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstall);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) {
      toast({
        title: "💻 SamyamLM PC App Setup",
        description: "To install as a PC Desktop app, click the Install icon in your browser address bar or run 'install-samyamlm-pc.bat'.",
      });
      return;
    }

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;

    if (outcome === "accepted") {
      setIsInstalled(true);
      toast({
        title: "Success! 🎉",
        description: "SamyamLM Desktop App installed on your PC.",
      });
    }
    setDeferredPrompt(null);
  };

  if (isInstalled) {
    return (
      <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ${className}`}>
        <Check className="w-3 h-3" /> Installed on PC
      </span>
    );
  }

  return (
    <button
      onClick={handleInstallClick}
      title="Install SamyamLM Desktop App on PC"
      className={`relative inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border border-border/80 bg-secondary/60 hover:bg-secondary text-foreground hover:border-cosmic-purple/40 transition-all duration-200 group ${className}`}
    >
      <span className="w-1.5 h-1.5 rounded-full bg-cosmic-teal animate-pulse" />
      <Laptop className="w-3.5 h-3.5 text-muted-foreground group-hover:text-cosmic-teal transition-colors" />
      <span>Install PC App</span>
    </button>
  );
}
