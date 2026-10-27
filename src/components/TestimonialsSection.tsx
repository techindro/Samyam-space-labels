import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Linkedin, Twitter, Instagram } from "lucide-react";
import ParallelWebBg from "@/components/ParallelWebBg";
import shubhamPhoto from "@/assets/shubham.jpeg";

const testimonials = [
  {
    name: "Geospatial AI Researcher",
    title: "Open Source Contributor & Early Tester",
    quote: "Samyam's on-device multimodal VLM architecture drastically speeds up satellite tile labeling. The local edge inference without cloud lock-in is game changing.",
    initials: "GR",
  },
  {
    name: "Autonomous Systems Engineer",
    title: "Community Benchmark Tester",
    quote: "The multimodal fusion of satellite imagery with Hindi VQA solves a huge blind spot. Achieving 59% faster inference on consumer GPUs makes it genuinely practical.",
    initials: "AE",
  },
  {
    name: "Remote Sensing Analyst",
    title: "GIS & Earth Observation Reviewer",
    quote: "High-quality automated spatial annotations with Indic language support. Gives researchers the exact infrastructure needed for rural land and climate mapping.",
    initials: "RS",
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-24 relative overflow-hidden">
      <ParallelWebBg />
      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="font-display text-4xl sm:text-5xl font-bold mb-4">
            Trusted by{" "}
            <span className="bg-gradient-to-r from-cosmic-teal to-cosmic-purple-glow bg-clip-text text-transparent">
              Industry Leaders
            </span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
              className="glass-card rounded-xl p-8 relative"
            >
              <Quote className="h-8 w-8 text-cosmic-purple/30 mb-4" />
              <p className="text-foreground/80 text-sm leading-relaxed mb-6 italic">
                {`"${t.quote}"`}
              </p>
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10 border border-border/50">
                  <AvatarFallback className="bg-gradient-to-br from-cosmic-purple/30 to-cosmic-teal/30 text-foreground text-xs font-semibold">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-semibold">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.title}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Founder Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 max-w-2xl mx-auto text-center"
        >
          <div className="bg-background rounded-2xl p-10 relative overflow-hidden border border-border/50 shadow-sm">
            <div className="relative z-10 flex flex-col items-center gap-4">
              <Avatar className="h-24 w-24 border-2 border-cosmic-teal/40">
                <AvatarImage src={shubhamPhoto} alt="Shubham Patel" className="object-cover" />
                <AvatarFallback className="bg-gradient-to-br from-cosmic-purple/40 to-cosmic-teal/40 text-foreground text-xl font-bold">
                  SP
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold font-display">Shubham Patel</h3>
                <p className="text-sm text-cosmic-teal font-medium">Founder & CEO, Tech Indro</p>
                <div className="flex gap-3 mt-2 justify-center">
                  <a href="https://www.linkedin.com/in/shubham-patel-techindro/" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-cosmic-teal transition-colors">
                    <Linkedin className="h-4 w-4" />
                  </a>
                  <a href="https://x.com/tryShubham" target="_blank" rel="noopener noreferrer" title="Twitter / X" aria-label="Twitter / X" className="p-2 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-cosmic-teal transition-colors">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="https://www.instagram.com/hallucination_101" target="_blank" rel="noopener noreferrer" title="Instagram" aria-label="Instagram" className="p-2 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-cosmic-teal transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href="https://substack.com/@tryshubham" target="_blank" rel="noopener noreferrer" title="Substack" aria-label="Substack" className="p-2 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-cosmic-teal transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M22.539 8.242H1.46V5.406h21.08v2.836zM1.46 10.812V24L12 18.11 22.54 24V10.812H1.46zM22.54 0H1.46v2.836h21.08V0z"/>
                    </svg>
                  </a>
                </div>
              </div>
              <Quote className="h-8 w-8 text-cosmic-purple/30" />
              <p className="text-foreground/80 text-sm leading-relaxed max-w-lg italic">
                "We don't just build AI; we build oxygen. In this 'sustaining' era, data is no longer a commodity to be sold—it is the vital force that turns a silent satellite into a protector of our world. That is why we do what we do."
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
