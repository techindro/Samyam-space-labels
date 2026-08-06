import { useState } from "react";
import { Linkedin, Twitter, Instagram, Facebook, Youtube, ArrowRight, Check, Mail, Sparkles, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";
import ParallelWebBg from "@/components/ParallelWebBg";
import { useToast } from "@/hooks/use-toast";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Products: [
    { label: "Orbital Data Labeling", href: "/products/geospatial-labeling" },
    { label: "Space Debris Tracking", href: "/products/space-debris-tracking" },
    { label: "Mission Simulation", href: "/products/mission-simulation" },
    { label: "Model Evaluation", href: "/products/model-evaluation" },
    { label: "Space Data Engine", href: "/products/data-engine" },
    { label: "Integrations", href: "/integrations" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/developers/text-to-speech" },
    { label: "Changelog", href: "/changelog" },
    { label: "System Status", href: "/status" },
    { label: "Research Papers", href: "/research/papers" },
    { label: "Blog", href: "/research/blog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Careers", href: "/research/careers" },
    { label: "Press", href: "/about" },
    { label: "Partners", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security & Compliance", href: "/security" },
    { label: "Cookie Policy", href: "/privacy" },
  ],
};

const Footer = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email Address",
        description: "Please enter a valid work email (e.g. name@organization.com).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSubscribed(true);
      toast({
        title: "Welcome to Samyam Dispatch! 🎉",
        description: "You've successfully subscribed to monthly Space AI & Data insights.",
      });
      setEmail("");
    }, 600);
  };

  return (
    <footer className="py-16 bg-card/50 relative overflow-hidden">
      <ParallelWebBg />
      <div className="container mx-auto px-4 relative z-10">
        {/* Ultra-Professional Newsletter Card */}
        <div className="relative rounded-3xl border border-border/80 bg-gradient-to-br from-card/90 via-card/60 to-background/90 p-8 md:p-10 mb-16 shadow-2xl backdrop-blur-xl overflow-hidden group">
          {/* Ambient Glow Gradient Effects */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-cosmic-purple/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cosmic-purple/20 transition-all duration-700" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cosmic-teal/10 rounded-full blur-3xl pointer-events-none group-hover:bg-cosmic-teal/20 transition-all duration-700" />

          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cosmic-purple/10 border border-cosmic-purple/20 text-cosmic-purple text-xs font-semibold tracking-wide uppercase">
                <Sparkles className="h-3.5 w-3.5" /> Samyam Dispatch & Research Insights
              </div>
              <h3 className="text-2xl md:text-3xl font-bold font-display text-foreground tracking-tight">
                Stay ahead in Space AI & Data Intelligence
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed max-w-xl">
                Join 10,000+ AI researchers, satellite engineers, and defense teams receiving our monthly technical breakdown and platform announcements.
              </p>
            </div>

            {/* Right Form */}
            <div className="lg:col-span-5 w-full">
              {subscribed ? (
                <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-in fade-in zoom-in-95 duration-300">
                  <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-500 mb-3">
                    <Check className="h-6 w-6 stroke-[3]" />
                  </div>
                  <h4 className="font-bold text-foreground text-base">You're on the list!</h4>
                  <p className="text-xs text-muted-foreground mt-1">Thank you for joining Samyam Research Dispatch.</p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row items-stretch gap-2.5">
                    <div className="relative flex-1">
                      <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                      <input
                        type="email"
                        placeholder="Enter your work email..."
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 rounded-xl bg-background/90 border border-border/80 text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:border-cosmic-purple focus:ring-2 focus:ring-cosmic-purple/20 transition-all shadow-inner"
                      />
                    </div>
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-3 rounded-xl bg-gradient-to-r from-cosmic-purple via-cosmic-purple to-cosmic-teal text-white font-semibold text-sm hover:opacity-95 active:scale-[0.98] transition-all shadow-lg shadow-cosmic-purple/25 flex items-center justify-center gap-2 shrink-0 disabled:opacity-50"
                    >
                      {loading ? (
                        <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      ) : (
                        <>
                          Subscribe <ArrowRight className="h-4 w-4" />
                        </>
                      )}
                    </button>
                  </div>
                  <div className="flex items-center justify-center lg:justify-start gap-4 text-[11px] text-muted-foreground/80 font-medium pt-1">
                    <span className="flex items-center gap-1">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" /> Zero spam
                    </span>
                    <span>•</span>
                    <span>Unsubscribe anytime</span>
                    <span>•</span>
                    <span>Monthly frequency</span>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="text-[28px] font-medium tracking-wide text-foreground" style={{ fontFamily: "'Comfortaa', cursive" }}>
              Samyam
            </a>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Breakthrough AI for space data labeling, defense, and enterprise.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-display text-sm font-semibold mb-4 text-foreground">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.label}>
                    {link.href === "#" ? (
                      <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                        {link.label}
                      </span>
                    ) : link.href.startsWith("/") ? (
                      <Link to={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </Link>
                    ) : (
                      <a href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom */}
        <div className="border-t border-border/30 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 Samyam. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            {[
              { icon: Linkedin, label: "LinkedIn", href: "https://www.linkedin.com/company/tech-indro" },
              { icon: Twitter, label: "X / Twitter", href: "https://x.com/techindro" },
              { icon: Instagram, label: "Instagram", href: "#" },
              { icon: Facebook, label: "Facebook", href: "#" },
              { icon: Youtube, label: "YouTube", href: "#" },
            ].map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} className="text-muted-foreground hover:text-foreground transition-colors">
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
