import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden star-field">
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/10 via-transparent to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cosmic-purple/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cosmic-teal/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 grid lg:grid-cols-2 gap-12 items-center relative z-10">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-secondary/50 text-sm text-muted-foreground mb-6">
            <Sparkles className="h-4 w-4 text-cosmic-teal" />
            Now powering 50+ space missions
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Breakthrough AI
            <br />
            <span className="bg-gradient-to-r from-cosmic-purple-glow via-cosmic-teal to-cosmic-purple bg-clip-text text-transparent">
              for Space & Beyond
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-8 mx-auto lg:mx-0">
            ChAi delivers world-class data labeling, model evaluations, and AI solutions 
            purpose-built for space agencies, defense contractors, and enterprises pushing the 
            boundaries of what's possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button size="lg" className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground hover:opacity-90 border-0 text-base px-8">
              Book a Demo <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
            <Button size="lg" variant="outline" className="border-border/50 text-foreground hover:bg-secondary/50 text-base px-8">
              Explore Platform <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </motion.div>

        {/* Orb Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center justify-center"
        >
          <div className="relative w-72 h-72 sm:w-96 sm:h-96">
            {/* Main orb */}
            <div className="absolute inset-8 rounded-full bg-gradient-to-br from-cosmic-purple via-cosmic-navy-light to-cosmic-teal animate-pulse-glow" />
            <div className="absolute inset-12 rounded-full bg-gradient-to-tr from-cosmic-teal/30 via-transparent to-cosmic-purple/40 backdrop-blur-sm" />
            <div className="absolute inset-16 rounded-full bg-gradient-to-b from-foreground/5 to-transparent" />
            {/* Orbit ring */}
            <div className="absolute inset-0 rounded-full border border-cosmic-purple/20 animate-spin" style={{ animationDuration: '20s' }} />
            <div className="absolute inset-4 rounded-full border border-cosmic-teal/10 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
            {/* Orbiting dots */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 animate-orbit">
              <div className="w-3 h-3 rounded-full bg-cosmic-teal shadow-[0_0_10px_hsl(180_70%_45%)]" />
            </div>
            <div className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 animate-orbit" style={{ animationDelay: '-7s', animationDuration: '15s' }}>
              <div className="w-2 h-2 rounded-full bg-cosmic-purple-glow shadow-[0_0_8px_hsl(270_80%_70%)]" />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
