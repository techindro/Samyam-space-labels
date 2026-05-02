import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ParallelWebBg from "@/components/ParallelWebBg";

const BuildAIHero = () => {
  return (
    <section className="relative pt-32 pb-24 px-4 overflow-hidden star-field">
      <ParallelWebBg />
      {/* Gradient overlays — match HeroSection */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/10 via-transparent to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cosmic-purple/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cosmic-teal/5 rounded-full blur-[100px]" />

      <div className="container mx-auto relative z-10">
        {/* Top header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-secondary/50 text-sm text-muted-foreground mb-6">
            <Sparkles className="h-4 w-4 text-cosmic-teal" />
            <span style={{ fontFamily: "'Comfortaa', cursive" }}>build ai</span>
          </div>
          <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
            Powering{" "}
            <span className="bg-gradient-to-r from-cosmic-purple-glow via-cosmic-teal to-cosmic-purple bg-clip-text text-transparent">
              Frontier AI
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mx-auto">
            Next generation AI powered by world-class data.
          </p>
        </motion.div>

        {/* Generative AI section */}
        <div className="grid lg:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
          {/* Left: Mock terminal */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <div className="glass-card rounded-xl overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border/30">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-muted-foreground text-sm ml-3 font-display">AI Text Generator</span>
              </div>
              <div className="p-6 min-h-[280px]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-secondary/50"
                >
                  <span className="text-xl">🤖</span>
                  <span className="text-foreground/80 text-sm">Why is hum</span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-0.5 h-4 bg-foreground/50 inline-block"
                  />
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Right: Text */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, delay: 0.4 }}
          >
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-3" style={{ fontFamily: "'Comfortaa', cursive" }}>
              generative ai
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4 leading-tight">
              Powering the next generation of{" "}
              <span className="bg-gradient-to-r from-cosmic-purple-glow via-cosmic-teal to-cosmic-purple bg-clip-text text-transparent">
                Generative AI
              </span>
            </h2>
            <p className="text-muted-foreground text-base leading-relaxed mb-8">
              Samyam's Generative AI Data Engine powers advanced LLMs and generative models through world-class RLHF, data generation, model evaluation, safety, and alignment.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button asChild size="lg" className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground hover:opacity-90 border-0 text-base px-8">
                <Link to="/book-demo">Book a Demo <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border/50 text-foreground hover:bg-secondary/50 text-base px-8">
                <Link to="/build-ai">Build AI <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BuildAIHero;
