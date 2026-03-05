import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ParallelWebBg from "@/components/ParallelWebBg";

const HeroSection = () => {
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden star-field">
      <ParallelWebBg />
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
            Samyam delivers world-class data labeling, model evaluations, and AI solutions 
            purpose-built for space agencies, defense contractors, and enterprises pushing the 
            boundaries of what's possible.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button asChild size="lg" className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground hover:opacity-90 border-0 text-base px-8">
              <Link to="/book-demo">Book a Demo <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
            <Button size="lg" variant="outline" className="border-border/50 text-foreground hover:bg-secondary/50 text-base px-8" onClick={() => document.getElementById('data-engine')?.scrollIntoView({ behavior: 'smooth' })}>
              Build AI <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </motion.div>

        {/* India-Inspired Orb Visual */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="flex items-center justify-center"
        >
          <div className="relative w-80 h-80 sm:w-[420px] sm:h-[420px]">
            {/* Outer glow ring - saffron */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(24,95%,55%)] via-transparent to-[hsl(145,60%,38%)] opacity-20 blur-[40px] animate-pulse-glow" />
            
            {/* Outer orbit rings */}
            <div className="absolute inset-0 rounded-full border border-[hsl(24,90%,55%,0.15)] animate-spin" style={{ animationDuration: '25s' }} />
            <div className="absolute inset-3 rounded-full border border-[hsl(145,60%,38%,0.12)] animate-spin" style={{ animationDuration: '35s', animationDirection: 'reverse' }} />
            <div className="absolute inset-6 rounded-full border border-[hsl(220,70%,35%,0.1)] animate-spin" style={{ animationDuration: '18s' }} />

            {/* Main sphere */}
            <div className="absolute inset-10 rounded-full overflow-hidden border-2 border-foreground/80 shadow-[0_0_60px_10px_hsl(24,90%,55%,0.15),0_0_120px_40px_hsl(145,60%,38%,0.08)]">
              {/* Saffron band (top) */}
              <div className="absolute inset-0 bg-gradient-to-b from-[hsl(24,95%,53%)] via-[hsl(24,90%,58%)] to-transparent" style={{ height: '38%' }} />
              {/* White band (middle) */}
              <div className="absolute top-[33%] inset-x-0 bg-gradient-to-b from-[hsl(0,0%,97%)] via-[hsl(0,0%,95%)] to-[hsl(0,0%,97%)]" style={{ height: '34%' }} />
              {/* Green band (bottom) */}
              <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-[hsl(145,63%,32%)] via-[hsl(145,55%,38%)] to-transparent" style={{ height: '38%' }} />
              
              {/* Chakra wheel center */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 sm:w-20 sm:h-20 rounded-full border-[3px] border-[hsl(220,70%,35%)] flex items-center justify-center">
                <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-[hsl(220,70%,35%,0.6)] relative">
                  {/* Chakra spokes */}
                  {Array.from({ length: 24 }).map((_, i) => (
                    <div
                      key={i}
                      className="absolute top-1/2 left-1/2 w-[1px] bg-[hsl(220,70%,35%,0.5)] origin-bottom"
                      style={{
                        height: '50%',
                        transform: `translate(-50%, -100%) rotate(${i * 15}deg)`,
                      }}
                    />
                  ))}
                  <div className="absolute inset-[30%] rounded-full bg-[hsl(220,70%,35%)]" />
                </div>
              </div>

              {/* Sphere depth & lighting */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/25 via-transparent to-black/20" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-t from-transparent via-transparent to-white/15" />
              <div className="absolute top-[8%] left-[15%] w-[30%] h-[18%] rounded-full bg-white/20 blur-md rotate-[-20deg]" />
            </div>

            {/* Orbiting particles - saffron */}
            <div className="absolute top-1/2 left-1/2 w-3 h-3 -ml-1.5 -mt-1.5 animate-orbit">
              <div className="w-3 h-3 rounded-full bg-[hsl(24,95%,55%)] shadow-[0_0_12px_hsl(24,95%,55%,0.8)]" />
            </div>
            {/* Orbiting particles - green */}
            <div className="absolute top-1/2 left-1/2 w-2.5 h-2.5 -ml-[5px] -mt-[5px] animate-orbit" style={{ animationDelay: '-8s', animationDuration: '16s' }}>
              <div className="w-2.5 h-2.5 rounded-full bg-[hsl(145,60%,38%)] shadow-[0_0_10px_hsl(145,60%,38%,0.8)]" />
            </div>
            {/* Orbiting particles - navy blue */}
            <div className="absolute top-1/2 left-1/2 w-2 h-2 -ml-1 -mt-1 animate-orbit" style={{ animationDelay: '-4s', animationDuration: '22s' }}>
              <div className="w-2 h-2 rounded-full bg-[hsl(220,70%,40%)] shadow-[0_0_8px_hsl(220,70%,40%,0.7)]" />
            </div>

            {/* Sparkle accents */}
            <div className="absolute top-[10%] right-[15%] w-1.5 h-1.5 rounded-full bg-[hsl(24,95%,60%)] animate-pulse" />
            <div className="absolute bottom-[15%] left-[12%] w-1 h-1 rounded-full bg-[hsl(145,60%,45%)] animate-pulse" style={{ animationDelay: '1s' }} />
            <div className="absolute top-[40%] right-[5%] w-1 h-1 rounded-full bg-[hsl(220,70%,50%)] animate-pulse" style={{ animationDelay: '2s' }} />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
