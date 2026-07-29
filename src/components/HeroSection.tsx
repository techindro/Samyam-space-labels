import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ParallelWebBg from "@/components/ParallelWebBg";
import SatelliteScene from "@/components/SatelliteScene";

const HeroSection = () => {
  return (
    <section className="relative min-h-[85vh] py-16 sm:py-20 lg:py-24 flex items-center justify-center overflow-hidden star-field">
      <ParallelWebBg />
      {/* Gradient overlays */}
      <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/10 via-transparent to-background pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(800px,90vw)] h-[min(800px,90vw)] bg-cosmic-purple/5 rounded-full blur-[120px]" />
      <div className="absolute top-1/3 right-1/4 w-[min(400px,60vw)] h-[min(400px,60vw)] bg-cosmic-teal/5 rounded-full blur-[100px]" />

      <div className="container mx-auto px-4 sm:px-6 grid lg:grid-cols-2 gap-8 sm:gap-12 items-center relative z-10">
        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center lg:text-left"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-secondary/50 text-sm text-muted-foreground mb-6">
            <Sparkles className="h-4 w-4 text-cosmic-teal" />
            Building AI for space & defense
          </div>
          <h1 className="font-display text-[2.5rem] sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-[1.1] mb-6">
            Breakthrough AI
            <br />
            <span className="bg-gradient-to-r from-cosmic-purple-glow via-cosmic-teal to-cosmic-purple bg-clip-text text-transparent">
              for Space & Beyond
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-xl mb-8 mx-auto lg:mx-0">
            Samyam provides high-quality data labeling, model evaluation, and AI tools 
            designed for space agencies, defense teams, and enterprises working on 
            next-generation applications.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <Button asChild size="lg" className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground hover:opacity-90 border-0 text-base px-8">
              <Link to="/book-demo">Book a Demo <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-border/50 text-foreground hover:bg-secondary/50 text-base px-8">
              <Link to="/build-ai">Build AI <ArrowRight className="h-4 w-4 ml-2" /></Link>
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
          <SatelliteScene />
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
