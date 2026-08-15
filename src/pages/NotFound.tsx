import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Home, ArrowLeft, Compass, BookOpen, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background relative overflow-hidden px-4">
      <ParallelWebBg />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-transparent pointer-events-none" />
      <div className="text-center relative z-10 glass-card rounded-2xl p-8 md:p-12 max-w-lg w-full border border-border/60 shadow-2xl backdrop-blur-xl">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-cosmic-purple/10 text-cosmic-purple mb-6 border border-cosmic-purple/20">
          <Compass className="w-8 h-8 animate-pulse" />
        </div>
        <h1 className="mb-2 text-6xl font-bold font-display tracking-tight bg-gradient-to-r from-white via-white/90 to-white/70 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="mb-3 text-xl font-semibold text-foreground">Orbit Disconnected</h2>
        <p className="mb-8 text-sm text-muted-foreground leading-relaxed">
          The requested coordinate <code className="text-xs bg-secondary/80 px-2 py-0.5 rounded text-cosmic-teal font-mono">{location.pathname}</code> does not exist in Samyam AI space.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-8">
          <Button asChild className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground border-0 gap-2">
            <Link to="/">
              <Home className="w-4 h-4" /> Return to Home
            </Link>
          </Button>
          <Button variant="outline" onClick={() => window.history.back()} className="gap-2">
            <ArrowLeft className="w-4 h-4" /> Go Back
          </Button>
        </div>

        <div className="pt-6 border-t border-border/40 text-xs text-muted-foreground flex justify-center gap-6">
          <Link to="/docs" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <BookOpen className="w-3.5 h-3.5" /> Documentation
          </Link>
          <Link to="/dashboard" className="hover:text-foreground flex items-center gap-1 transition-colors">
            <Layers className="w-3.5 h-3.5" /> Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFound;

