import { Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
import { Link } from "react-router-dom";
import ParallelWebBg from "@/components/ParallelWebBg";

const footerLinks: Record<string, { label: string; href: string }[]> = {
  Products: [
    { label: "Orbital Data Labeling", href: "/products/geospatial-labeling" },
    { label: "Space Debris Tracking", href: "/products/space-debris-tracking" },
    { label: "Mission Simulation", href: "/products/mission-simulation" },
    { label: "Model Evaluation", href: "/products/model-evaluation" },
    { label: "Space Data Engine", href: "/products/data-engine" },
  ],
  Resources: [
    { label: "Documentation", href: "/docs" },
    { label: "API Reference", href: "/developers/text-to-speech" },
    { label: "Research Papers", href: "/research/papers" },
    { label: "Blog", href: "/research/blog" },
    { label: "Frontier Leaderboards", href: "/research/frontier-leaderboards" },
    { label: "Learn", href: "/learn" },
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
    { label: "Security", href: "/privacy" },
    { label: "Cookie Policy", href: "/privacy" },
  ],
};

const Footer = () => {
  return (
    <footer className="py-16 bg-card/50 relative overflow-hidden">
      <ParallelWebBg />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="/" className="text-[28px] font-medium tracking-wide text-foreground" style={{ fontFamily: "'Comfortaa', cursive" }}>
              Samyuam
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
              { icon: Instagram, label: "Instagram", href: "#" },
              { icon: Facebook, label: "Facebook", href: "#" },
              { icon: Youtube, label: "YouTube", href: "#" },
            ].map(({ icon: Icon, label, href }) => (
              <a key={label} href={href} aria-label={label} className="text-muted-foreground hover:text-foreground transition-colors">
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
