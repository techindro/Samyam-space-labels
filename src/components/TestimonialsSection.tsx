import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Quote, Linkedin, Twitter, Instagram } from "lucide-react";
import ParallelWebBg from "@/components/ParallelWebBg";
import shubhamPhoto from "@/assets/shubham.jpeg";

const testimonials = [
  {
    name: "Ananya Rao",
    title: "Research Lead, GeoSat Analytics",
    quote: "Samyam's annotation tools helped us label satellite imagery much faster than our in-house setup. The quality was consistently high across batches.",
    initials: "AR",
  },
  {
    name: "Michael Torres",
    title: "ML Engineer, Astrion Defense",
    quote: "We needed domain-specific labeling for radar data and Samyam's team understood the requirements from day one. Solid platform, responsive support.",
    initials: "MT",
  },
  {
    name: "Dr. Kavita Nair",
    title: "Data Science Manager, OrbitView",
    quote: "As a small team working with earth observation data, Samyam gave us the annotation infrastructure we couldn't build ourselves. Great value for startups.",
    initials: "KN",
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
                "{t.quote}"
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
                  <a href="https://x.com/tech_indro" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-cosmic-teal transition-colors">
                    <Twitter className="h-4 w-4" />
                  </a>
                  <a href="https://instagram.com/shubhampatel" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-cosmic-teal transition-colors">
                    <Instagram className="h-4 w-4" />
                  </a>
                  <a href="https://discord.gg/chai" target="_blank" rel="noopener noreferrer" className="p-2 rounded-full bg-background border border-border/50 text-muted-foreground hover:text-cosmic-teal transition-colors">
                    <svg className="h-4 w-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.157-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.947 2.418-2.157 2.418z"/></svg>
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
