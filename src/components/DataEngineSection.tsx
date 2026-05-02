import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import ParallelWebBg from "@/components/ParallelWebBg";

const DataEngineSection = () => {
  return (
    <section className="relative py-24 overflow-hidden">
      <ParallelWebBg />
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: Text */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <p className="text-muted-foreground text-sm tracking-widest uppercase mb-2" style={{ fontFamily: "'Comfortaa', cursive" }}>
              samyam
            </p>
            <h2 className="font-display text-4xl sm:text-5xl lg:text-6xl font-bold text-foreground mb-6">
              Data Engine
            </h2>
            <p className="text-lg text-muted-foreground max-w-md mb-2">
              Collect, curate, and annotate data.
            </p>
            <p className="text-lg text-muted-foreground max-w-md mb-8">
              Train models and evaluate. Repeat.
            </p>
            <Button asChild size="lg" className="rounded-full bg-secondary text-foreground border border-border hover:bg-secondary/80 text-base px-8">
              <Link to="/book-demo">Book a Demo <ArrowRight className="h-4 w-4 ml-2" /></Link>
            </Button>
          </motion.div>

          {/* Right: Data pipeline visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="flex items-center justify-center"
          >
            <div className="relative w-full max-w-lg aspect-[4/3] rounded-2xl border border-border/30 bg-card/30 backdrop-blur-sm p-8 flex items-center justify-center">
              {/* Pipeline visualization */}
              <svg viewBox="0 0 400 250" className="w-full h-full" fill="none">
                {/* Raw Data - scattered dots */}
                {[
                  [40, 80], [55, 110], [30, 130], [60, 150], [45, 170],
                  [70, 95], [50, 140], [35, 160], [65, 125], [25, 105],
                  [75, 140], [42, 95], [58, 165], [38, 145], [68, 115],
                ].map(([cx, cy], i) => (
                  <motion.circle
                    key={i}
                    cx={cx}
                    cy={cy}
                    r={5}
                    className="fill-muted-foreground/40"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.1 * i, duration: 0.4 }}
                  />
                ))}
                <text x="35" y="200" className="fill-muted-foreground text-[11px]" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">Raw Data</text>

                {/* Center grid - Curate */}
                <motion.g
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                >
                  {/* 3D perspective grid */}
                  <rect x="120" y="60" width="130" height="130" rx="4" className="stroke-foreground/30" strokeWidth="1" fill="none" />
                  {/* Horizontal lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={`h${i}`} x1="120" y1={60 + i * 32.5} x2="250" y2={60 + i * 32.5} className="stroke-foreground/15" strokeWidth="0.5" />
                  ))}
                  {/* Vertical lines */}
                  {[0, 1, 2, 3, 4].map(i => (
                    <line key={`v${i}`} x1={120 + i * 32.5} y1="60" x2={120 + i * 32.5} y2="190" className="stroke-foreground/15" strokeWidth="0.5" />
                  ))}
                  <text x="185" y="135" className="fill-foreground/80 text-[14px] font-medium" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">Curate</text>
                </motion.g>

                {/* Top right - Evaluate */}
                <motion.g
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.5 }}
                >
                  <rect x="270" y="40" width="80" height="60" rx="3" className="stroke-foreground/25" strokeWidth="0.5" fill="none" />
                  {[0, 1, 2].map(i => (
                    <line key={`eg${i}`} x1="270" y1={40 + i * 20} x2="350" y2={40 + i * 20} className="stroke-foreground/10" strokeWidth="0.5" />
                  ))}
                  <text x="310" y="35" className="fill-foreground/70 text-[11px]" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">Evaluate</text>
                </motion.g>

                {/* Bottom right - Annotate */}
                <motion.g
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <rect x="275" y="140" width="80" height="60" rx="3" className="stroke-foreground/25" strokeWidth="0.5" fill="none" />
                  {[0, 1, 2].map(i => (
                    <line key={`ag${i}`} x1="275" y1={140 + i * 20} x2="355" y2={140 + i * 20} className="stroke-foreground/10" strokeWidth="0.5" />
                  ))}
                  <text x="315" y="218" className="fill-foreground/70 text-[11px]" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">Annotate</text>
                </motion.g>

                {/* Flow arrows */}
                <motion.path
                  d="M80 125 L115 125"
                  className="stroke-muted-foreground/30"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, duration: 0.5 }}
                />
                <motion.path
                  d="M255 100 L268 75"
                  className="stroke-muted-foreground/30"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.7, duration: 0.4 }}
                />
                <motion.path
                  d="M255 150 L272 165"
                  className="stroke-muted-foreground/30"
                  strokeWidth="1"
                  strokeDasharray="4 3"
                  initial={{ pathLength: 0 }}
                  whileInView={{ pathLength: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                />

                {/* HQ Data output */}
                <motion.g
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <text x="375" y="125" className="fill-cosmic-teal text-[11px] font-medium" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">HQ Data</text>
                  {[0, 1, 2].map(i => (
                    <motion.circle
                      key={`hq${i}`}
                      cx={365 + i * 12}
                      cy={135 + (i % 2 === 0 ? 0 : -5)}
                      r={4}
                      className="fill-cosmic-teal/50 stroke-cosmic-teal/80"
                      strokeWidth="0.5"
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.1 + i * 0.1 }}
                    />
                  ))}
                </motion.g>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DataEngineSection;
