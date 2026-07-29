import { motion } from "framer-motion";
import { Rocket, Users, Globe2, ShieldCheck, Zap, Heart, ArrowRight, Linkedin, Twitter } from "lucide-react";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import shubhamPhoto from "@/assets/shubham.jpeg";

const values = [
  {
    icon: Rocket,
    title: "Mission-First",
    description: "We build for the hardest problems — space, defense, and sovereign AI. No shortcuts.",
  },
  {
    icon: ShieldCheck,
    title: "Data Integrity",
    description: "Every label matters. We enforce quality at every step with reviewer workflows and audit trails.",
  },
  {
    icon: Globe2,
    title: "Made in India",
    description: "Proudly Indian. Building world-class AI infrastructure for ISRO, defense agencies, and beyond.",
  },
  {
    icon: Users,
    title: "Team of Experts",
    description: "Domain specialists in space tech, ML engineering, and data annotation — not generalists.",
  },
  {
    icon: Zap,
    title: "Speed & Scale",
    description: "From 1K to 10M annotations. Our platform scales with your mission without compromising quality.",
  },
  {
    icon: Heart,
    title: "Founder-Led",
    description: "We obsess over every customer interaction. The founders are in every deal, every deployment.",
  },
];

const team = [
  {
    name: "Shubham Patel",
    role: "Founder & CEO",
    bio: "Building AI infrastructure for India's space and defense future. Previously at Tech Indro.",
    photo: shubhamPhoto,
    initials: "SP",
    linkedin: "https://www.linkedin.com/in/shubham-patel-techindro/",
    twitter: "https://x.com/tech_indro",
  },
];

const milestones = [
  { year: "2023", event: "Founded Tech Indro — started building AI tools for Indian space sector" },
  { year: "2024", event: "Launched Samyam annotation platform with BBox & Polygon support" },
  { year: "2025", event: "Released Samyam LM research paper; launched Voice AI agents" },
  { year: "2026", event: "Expanding to defense contractors and sovereign AI programs" },
];

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative overflow-hidden">
        <ParallelWebBg />

        {/* Hero */}
        <section className="py-28 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/5 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 max-w-4xl relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="text-center"
            >
              <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full border border-border bg-secondary/50">
                <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">About Samyam</span>
              </div>
              <h1 className="font-display text-5xl md:text-7xl font-bold leading-[1.1] mb-6">
                We build AI that{" "}
                <span className="bg-gradient-to-r from-cosmic-purple-glow via-cosmic-teal to-cosmic-purple bg-clip-text text-transparent">
                  protects worlds
                </span>
              </h1>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                Samyam is an AI data infrastructure company built for space agencies, defense teams, and enterprises.
                We believe the next frontier of national security is data — and we're building the tools to own it.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Stats */}
        <section className="pb-16 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {[
                { value: "100K+", label: "Images Labeled" },
                { value: "12", label: "Product Modules" },
                { value: "9", label: "Partner Organizations" },
                { value: "2026", label: "Founded" },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="glass-card rounded-xl p-6 text-center"
                >
                  <p className="font-display text-3xl font-bold mb-1">{stat.value}</p>
                  <p className="text-muted-foreground text-sm">{stat.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Values */}
        <section className="py-20 border-t border-border/30 relative z-10">
          <div className="container mx-auto px-4 max-w-5xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl font-bold mb-3">What We Stand For</h2>
            </motion.div>
            <div className="grid md:grid-cols-3 gap-5">
              {values.map((v, i) => {
                const Icon = v.icon;
                return (
                  <motion.div
                    key={v.title}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="glass-card rounded-xl p-6"
                  >
                    <div className="p-2.5 rounded-xl bg-secondary w-fit mb-4">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="font-display font-semibold mb-2">{v.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{v.description}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Timeline */}
        <section className="py-20 border-t border-border/30 relative z-10">
          <div className="container mx-auto px-4 max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl font-bold mb-3">Our Journey</h2>
            </motion.div>
            <div className="relative">
              <div className="absolute left-[7px] top-2 bottom-2 w-px bg-border/50" />
              <div className="space-y-8">
                {milestones.map((m, i) => (
                  <motion.div
                    key={m.year}
                    initial={{ opacity: 0, x: -16 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="flex gap-6 pl-8 relative"
                  >
                    <div className="absolute left-0 top-1.5 h-3.5 w-3.5 rounded-full bg-foreground border-2 border-background" />
                    <div>
                      <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{m.year}</span>
                      <p className="text-sm mt-1 leading-relaxed">{m.event}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Team */}
        <section className="py-20 border-t border-border/30 relative z-10">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl font-bold mb-3">Meet the Founder</h2>
            </motion.div>
            {team.map((member) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="glass-card rounded-2xl p-8 flex flex-col sm:flex-row items-center gap-8 max-w-xl mx-auto"
              >
                <Avatar className="h-28 w-28 border-2 border-cosmic-teal/30 shrink-0">
                  <AvatarImage src={member.photo} alt={member.name} className="object-cover" />
                  <AvatarFallback className="bg-gradient-to-br from-cosmic-purple/40 to-cosmic-teal/40 text-xl font-bold">
                    {member.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-display text-xl font-bold">{member.name}</h3>
                  <p className="text-cosmic-teal text-sm font-medium mb-3">{member.role}</p>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{member.bio}</p>
                  <div className="flex gap-2">
                    <a href={member.linkedin} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-full border border-border/50 text-muted-foreground hover:text-foreground transition-colors">
                      <Linkedin className="h-4 w-4" />
                    </a>
                    <a href={member.twitter} target="_blank" rel="noopener noreferrer"
                      className="p-2 rounded-full border border-border/50 text-muted-foreground hover:text-foreground transition-colors">
                      <Twitter className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="py-20 border-t border-border/30 relative z-10">
          <div className="container mx-auto px-4 text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
              <h2 className="font-display text-3xl font-bold mb-4">Ready to build with us?</h2>
              <p className="text-muted-foreground mb-8">Join the teams building the future of space AI.</p>
              <div className="flex gap-4 justify-center flex-wrap">
                <Button asChild className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground border-0">
                  <Link to="/book-demo">Book a Demo <ArrowRight className="h-4 w-4 ml-2" /></Link>
                </Button>
                <Button asChild variant="outline">
                  <Link to="/research/careers">View Careers</Link>
                </Button>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;
