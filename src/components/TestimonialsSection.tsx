import { motion } from "framer-motion";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Quote } from "lucide-react";
import ParallelWebBg from "@/components/ParallelWebBg";

const testimonials = [
  {
    name: "Dr. Priya Sharma",
    title: "Chief Data Scientist, ISRO",
    quote: "ChAi transformed how we process satellite imagery. What used to take months now takes days with unprecedented accuracy.",
    initials: "PS",
  },
  {
    name: "Col. James Mitchell",
    title: "Director of AI, US Space Command",
    quote: "The precision and security of ChAi's labeling platform meets our most demanding classification requirements.",
    initials: "JM",
  },
  {
    name: "Elena Kowalski",
    title: "VP Engineering, Orbital Dynamics Corp",
    quote: "ChAi's anomaly detection caught a critical sensor drift that our legacy systems completely missed. Game-changing technology.",
    initials: "EK",
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
          <div className="glass-card rounded-2xl p-10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-cosmic-purple/10 to-cosmic-teal/10 pointer-events-none" />
            <div className="relative z-10 flex flex-col items-center gap-4">
              <Avatar className="h-20 w-20 border-2 border-cosmic-teal/40">
                <AvatarFallback className="bg-gradient-to-br from-cosmic-purple/40 to-cosmic-teal/40 text-foreground text-xl font-bold">
                  SP
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xl font-bold font-display">Shubham Patel</h3>
                <p className="text-sm text-cosmic-teal font-medium">Founder & CEO</p>
              </div>
              <p className="text-foreground/70 text-sm leading-relaxed max-w-lg">
                Visionary leader driving ChAi's mission to revolutionize space data intelligence. With deep expertise in AI and aerospace, Shubham founded ChAi to bridge the gap between cutting-edge machine learning and mission-critical space operations.
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
