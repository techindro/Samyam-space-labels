import { motion } from "framer-motion";
import { ArrowRight, Brain, Bot, Cpu, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import ParallelWebBg from "@/components/ParallelWebBg";

const topics = [
  {
    icon: Brain,
    title: "Generative AI",
    subtitle: "Create. Synthesize. Transform.",
    description:
      "Generative AI models produce new data — images, text, code, and synthetic satellite imagery — by learning patterns from massive datasets. At Samyam, we leverage generative models to augment sparse training data, simulate orbital scenarios, and accelerate mission readiness.",
    useCases: [
      "Synthetic satellite image generation for training",
      "Automated report & briefing generation",
      "Scenario simulation for mission planning",
    ],
    gradient: "from-[hsl(24,95%,55%)] to-[hsl(350,80%,55%)]",
    accentBg: "bg-[hsl(24,95%,55%,0.1)]",
    accentText: "text-[hsl(24,95%,55%)]",
  },
  {
    icon: Bot,
    title: "Agentic AI",
    subtitle: "Autonomous. Adaptive. Decisive.",
    description:
      "Agentic AI systems act independently — planning, reasoning, and executing multi-step tasks without constant human oversight. Samyam deploys agentic workflows for autonomous threat detection, real-time orbital decision-making, and adaptive mission control.",
    useCases: [
      "Autonomous space debris threat response",
      "Multi-step mission planning agents",
      "Self-healing sensor monitoring pipelines",
    ],
    gradient: "from-cosmic-purple to-cosmic-purple-glow",
    accentBg: "bg-cosmic-purple/10",
    accentText: "text-cosmic-purple-glow",
  },
  {
    icon: Network,
    title: "Machine Learning",
    subtitle: "Learn. Predict. Optimize.",
    description:
      "Machine Learning algorithms find patterns in data to make predictions and decisions without explicit programming. Samyam applies ML for satellite telemetry analysis, orbital trajectory prediction, terrain classification, and anomaly detection across massive datasets.",
    useCases: [
      "Orbital trajectory prediction & collision avoidance",
      "Satellite health & telemetry forecasting",
      "Terrain and land-use classification",
    ],
    gradient: "from-cosmic-teal to-[hsl(170,70%,45%)]",
    accentBg: "bg-cosmic-teal/10",
    accentText: "text-cosmic-teal",
  },
  {
    icon: Cpu,
    title: "Deep Learning",
    subtitle: "Perceive. Understand. Reason.",
    description:
      "Deep Learning uses multi-layered neural networks to process complex, high-dimensional data like satellite imagery, radar signals, and sensor streams. Samyam's deep learning pipelines power precision object detection, image segmentation, and spectral analysis at scale.",
    useCases: [
      "Sub-meter object detection in satellite imagery",
      "Spectral & hyperspectral data analysis",
      "Radar signal processing & SAR interpretation",
    ],
    gradient: "from-[hsl(220,70%,50%)] to-cosmic-purple",
    accentBg: "bg-[hsl(220,70%,50%,0.1)]",
    accentText: "text-[hsl(220,70%,50%)]",
  },
];

const LearnAISection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <ParallelWebBg />
      <div className="container mx-auto px-4 relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full border border-border/50 bg-secondary/50 text-sm text-muted-foreground mb-4">
            Learn with Samyam
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            The AI{" "}
            <span className="bg-gradient-to-r from-cosmic-purple-glow to-cosmic-teal bg-clip-text text-transparent">
              Knowledge Hub
            </span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Explore the core pillars of modern AI and discover how Samyam applies each discipline to solve critical space, defense, and enterprise challenges.
          </p>
        </motion.div>

        {/* Topic Cards */}
        <div className="grid md:grid-cols-2 gap-8">
          {topics.map((topic, index) => (
            <motion.div
              key={topic.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1, duration: 0.5 }}
              className="group glass-card rounded-2xl border border-border/30 p-8 hover:border-border/60 transition-all duration-300"
            >
              {/* Icon & Title */}
              <div className="flex items-start gap-4 mb-5">
                <div className={`p-3 rounded-xl ${topic.accentBg}`}>
                  <topic.icon className={`h-6 w-6 ${topic.accentText}`} />
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold text-foreground">
                    {topic.title}
                  </h3>
                  <p className={`text-sm font-medium ${topic.accentText}`}>
                    {topic.subtitle}
                  </p>
                </div>
              </div>

              {/* Description */}
              <p className="text-muted-foreground leading-relaxed mb-6">
                {topic.description}
              </p>

              {/* Use Cases */}
              <div className="mb-6">
                <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">
                  How Samyam applies this
                </p>
                <ul className="space-y-2">
                  {topic.useCases.map((useCase) => (
                    <li
                      key={useCase}
                      className="flex items-start gap-2 text-sm text-foreground/80"
                    >
                      <span className={`mt-1.5 h-1.5 w-1.5 rounded-full bg-gradient-to-r ${topic.gradient} shrink-0`} />
                      {useCase}
                    </li>
                  ))}
                </ul>
              </div>

              {/* CTA */}
              <Button
                variant="ghost"
                className={`group/btn p-0 h-auto ${topic.accentText} hover:bg-transparent`}
              >
                Read case study
                <ArrowRight className="h-4 w-4 ml-1 transition-transform group-hover/btn:translate-x-1" />
              </Button>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LearnAISection;
