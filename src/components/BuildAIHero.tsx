import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const BuildAIHero = () => {
  return (
    <section className="relative py-28 bg-foreground overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Top header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <p className="text-primary-foreground/50 text-sm tracking-[0.3em] uppercase mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>
            build ai
          </p>
          <h1 className="font-display text-4xl sm:text-5xl lg:text-7xl font-bold text-primary-foreground mb-5">
            Powering Frontier AI
          </h1>
          <p className="text-primary-foreground/60 text-lg max-w-xl mx-auto">
            Next Generation AI powered by world-class data.
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
            <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 border-b border-primary-foreground/10">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
                <span className="text-primary-foreground/50 text-sm ml-3 font-display">AI Text Generator</span>
              </div>
              <div className="p-6 min-h-[280px]">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-primary-foreground/15 bg-primary-foreground/5"
                >
                  <span className="text-xl">🤖</span>
                  <span className="text-primary-foreground/70 text-sm">Why is hum</span>
                  <motion.span
                    animate={{ opacity: [1, 0] }}
                    transition={{ repeat: Infinity, duration: 0.8 }}
                    className="w-0.5 h-4 bg-primary-foreground/50 inline-block"
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
            <h2 className="font-display text-3xl sm:text-4xl font-bold text-primary-foreground mb-3">
              Generative AI
            </h2>
            <p className="text-primary-foreground/40 text-sm mb-4">
              Powering the next generation of Generative AI
            </p>
            <p className="text-primary-foreground/60 text-base leading-relaxed mb-8">
              Samyam's Generative AI Data Engine powers many of the most advanced LLMs and generative models in the world through world-class RLHF, data generation, model evaluation, safety, and alignment.
            </p>
            <div className="flex gap-4">
              <Button asChild size="lg" className="rounded-full bg-primary-foreground/10 text-primary-foreground border border-primary-foreground/20 hover:bg-primary-foreground/20 text-sm px-6">
                <Link to="/book-demo">Book a Demo <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
              <Button asChild variant="ghost" size="lg" className="text-primary-foreground/70 hover:text-primary-foreground hover:bg-transparent text-sm">
                <Link to="/build-ai">Build AI <ArrowRight className="h-4 w-4 ml-1" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default BuildAIHero;
