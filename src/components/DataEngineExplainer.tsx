import { motion } from "framer-motion";

const capabilities = [
  {
    title: "Generation",
    description: "After initial pre-training, create complex prompt-response pairs from scratch.",
  },
  {
    title: "RLHF",
    description: "Apply human preferences to model outputs.",
  },
  {
    title: "Red Teaming",
    description: "Use prompt injection techniques to uncover vulnerabilities.",
  },
];

const workflowSteps = [
  { label: "Pre-Training*", x: 60, y: 140 },
  { label: "SFT", x: 200, y: 120, sub: "Supervised fine-tuning" },
  { label: "RLHF", x: 350, y: 120, sub: "Reinforcement learning from\nhuman feedback" },
  { label: "Deployment*", x: 490, y: 140 },
];

const DataEngineExplainer = () => {
  return (
    <section className="relative py-24 bg-foreground overflow-hidden">
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <p className="text-primary-foreground/40 text-sm tracking-[0.3em] uppercase mb-4">
            what is the data engine
          </p>
          <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-primary-foreground mb-5">
            The One-Stop-Shop For Building AI
          </h2>
          <p className="text-primary-foreground/50 text-base max-w-2xl mx-auto leading-relaxed">
            Data engine is the process of improving machine learning models with high quality, diverse and large datasets powered by experts.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Left: Capability cards */}
          <div className="space-y-4">
            <p className="text-primary-foreground/30 text-xs tracking-[0.3em] uppercase mb-4">
              generative ai data engine
            </p>
            {capabilities.map((cap, i) => (
              <motion.div
                key={cap.title}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6"
              >
                <h3 className="font-display text-xl font-semibold text-primary-foreground mb-2">{cap.title}</h3>
                <p className="text-primary-foreground/40 text-sm leading-relaxed">{cap.description}</p>
              </motion.div>
            ))}
          </div>

          {/* Right: Workflow diagram */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex items-center justify-center"
          >
            <div className="w-full rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-6">
              <svg viewBox="0 0 560 280" className="w-full" fill="none">
                {/* Pre-Training */}
                <rect x="20" y="120" width="90" height="40" rx="4" className="stroke-primary-foreground/30" strokeWidth="1" strokeDasharray="4 2" fill="none" />
                <text x="65" y="144" className="fill-primary-foreground/60 text-[10px]" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">Pre-Training*</text>

                {/* Arrow */}
                <line x1="115" y1="140" x2="155" y2="140" className="stroke-primary-foreground/30" strokeWidth="1" markerEnd="url(#arrowhead)" />

                {/* SFT */}
                <rect x="160" y="100" width="110" height="70" rx="6" className="stroke-primary-foreground/30 fill-primary-foreground/5" strokeWidth="1" />
                <text x="215" y="125" className="fill-primary-foreground/80 text-[12px] font-medium" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">SFT</text>
                <text x="215" y="142" className="fill-primary-foreground/30 text-[7px]" textAnchor="middle" fontFamily="Inter, sans-serif">Supervised fine-tuning</text>
                <text x="215" y="155" className="fill-primary-foreground/30 text-[7px]" textAnchor="middle" fontFamily="Inter, sans-serif">Learn from demonstrated</text>

                {/* Arrow */}
                <line x1="275" y1="135" x2="310" y2="135" className="stroke-primary-foreground/30" strokeWidth="1" />

                {/* RLHF */}
                <rect x="315" y="100" width="110" height="70" rx="6" className="stroke-primary-foreground/30 fill-primary-foreground/5" strokeWidth="1" />
                <text x="370" y="125" className="fill-primary-foreground/80 text-[12px] font-medium" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">RLHF</text>
                <text x="370" y="142" className="fill-primary-foreground/30 text-[7px]" textAnchor="middle" fontFamily="Inter, sans-serif">Reinforcement learning from</text>
                <text x="370" y="155" className="fill-primary-foreground/30 text-[7px]" textAnchor="middle" fontFamily="Inter, sans-serif">human feedback</text>

                {/* Arrow */}
                <line x1="430" y1="135" x2="460" y2="135" className="stroke-primary-foreground/30" strokeWidth="1" />

                {/* Deployment */}
                <rect x="465" y="120" width="80" height="40" rx="4" className="stroke-primary-foreground/30" strokeWidth="1" strokeDasharray="4 2" fill="none" />
                <text x="505" y="144" className="fill-primary-foreground/60 text-[10px]" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">Deployment*</text>

                {/* Red Teaming - top */}
                <rect x="260" y="20" width="110" height="55" rx="6" className="stroke-primary-foreground/30 fill-primary-foreground/5" strokeWidth="1" />
                <text x="315" y="40" className="fill-primary-foreground/80 text-[11px] font-medium" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">Red Teaming</text>
                <text x="315" y="55" className="fill-primary-foreground/30 text-[7px]" textAnchor="middle" fontFamily="Inter, sans-serif">Adversarial probing to</text>
                <text x="315" y="65" className="fill-primary-foreground/30 text-[7px]" textAnchor="middle" fontFamily="Inter, sans-serif">identify and fix limitations</text>
                <line x1="280" y1="75" x2="240" y2="100" className="stroke-primary-foreground/20" strokeWidth="0.5" />
                <line x1="350" y1="75" x2="390" y2="100" className="stroke-primary-foreground/20" strokeWidth="0.5" />

                {/* Model Evaluation - bottom */}
                <rect x="240" y="200" width="120" height="55" rx="6" className="stroke-primary-foreground/30 fill-primary-foreground/5" strokeWidth="1" />
                <text x="300" y="220" className="fill-primary-foreground/80 text-[11px] font-medium" textAnchor="middle" fontFamily="Space Grotesk, sans-serif">Model Evaluation</text>
                <text x="300" y="237" className="fill-primary-foreground/30 text-[7px]" textAnchor="middle" fontFamily="Inter, sans-serif">Evaluate model against</text>
                <text x="300" y="247" className="fill-primary-foreground/30 text-[7px]" textAnchor="middle" fontFamily="Inter, sans-serif">complex and diverse prompts</text>
                <line x1="260" y1="200" x2="230" y2="175" className="stroke-primary-foreground/20" strokeWidth="0.5" />
                <line x1="340" y1="200" x2="380" y2="175" className="stroke-primary-foreground/20" strokeWidth="0.5" />

                {/* User reported issues */}
                <rect x="430" y="210" width="100" height="30" rx="4" className="stroke-primary-foreground/30" strokeWidth="1" strokeDasharray="4 2" fill="none" />
                <text x="480" y="229" className="fill-primary-foreground/40 text-[8px]" textAnchor="middle" fontFamily="Inter, sans-serif">User reported issues</text>
                <line x1="430" y1="225" x2="365" y2="225" className="stroke-primary-foreground/15" strokeWidth="0.5" strokeDasharray="3 3" />

                {/* Footer note */}
                <text x="280" y="275" className="fill-primary-foreground/20 text-[7px]" textAnchor="middle" fontFamily="Inter, sans-serif">*Pre-Training, Post-Training, and Deployment are managed by customers</text>

                <defs>
                  <marker id="arrowhead" markerWidth="6" markerHeight="4" refX="6" refY="2" orient="auto">
                    <polygon points="0 0, 6 2, 0 4" className="fill-primary-foreground/30" />
                  </marker>
                </defs>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default DataEngineExplainer;
