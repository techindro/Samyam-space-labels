import { useState } from "react";
import { Linkedin, Twitter, Instagram, Facebook, Youtube, ArrowRight, Check } from "lucide-react";
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
  const { toast } = useToast();

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    setSubscribed(true);
    toast({
      title: "Subscribed Successfully! 🎉",
      description: "Thank you for subscribing to Samyam product updates.",
    });
    setEmail("");
  };

  return (
    <footer className="py-16 bg-card/50 relative overflow-hidden">
      <ParallelWebBg />
      <div className="container mx-auto px-4 relative z-10">
        {/* Top Newsletter Strip */}
        <div className="rounded-2xl border border-border/50 bg-gradient-to-r from-cosmic-purple/10 via-card/50 to-cosmic-teal/10 p-6 md:p-8 mb-12 flex flex-col md:flex-row items-center justify-between gap-6 backdrop-blur-md">
          <div className="max-w-md text-center md:text-left">
            <h3 className="font-bold font-display text-lg text-foreground">Stay ahead with Samyam updates</h3>
            <p className="text-sm text-muted-foreground mt-1">Get monthly insights on space AI, satellite data labeling, and platform updates.</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto items-center gap-2 max-w-md">
            {subscribed ? (
              <div className="flex items-center gap-2 text-emerald-500 text-sm font-semibold px-4 py-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 w-full justify-center">
                <Check className="h-4 w-4" /> You are subscribed!
              </div>
            ) : (
              <>
                <input
                  type="email"
                  placeholder="Enter your work email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="px-4 py-2.5 rounded-xl bg-background/80 border border-border/60 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-foreground transition-colors w-full md:w-64"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 rounded-xl bg-foreground text-background font-semibold text-sm hover:opacity-90 transition-opacity shrink-0 flex items-center gap-1.5"
                >
                  Subscribe <ArrowRight className="h-4 w-4" />
                </button>
              </>
            )}
          </form>
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
