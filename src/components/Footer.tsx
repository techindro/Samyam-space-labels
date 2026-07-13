import { Linkedin, Instagram, Facebook, Youtube } from "lucide-react";
import ParallelWebBg from "@/components/ParallelWebBg";

const footerLinks = {
  Products: ["Orbital Data Labeling", "Terrain Classification", "Anomaly Detection", "Mission Analytics", "Space Data Engine"],
  Resources: ["Documentation", "API Reference", "Case Studies", "Blog", "Webinars", "Learn"],
  Company: ["About", "Careers", "Press", "Partners", "Contact"],
  Legal: ["Privacy Policy", "Terms of Service", "Security", "Cookie Policy"],
};

const Footer = () => {
  return (
    <footer className="py-16 bg-card/50 relative overflow-hidden">
      <ParallelWebBg />
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <a href="#" className="text-[28px] font-medium tracking-wide text-foreground lowercase" style={{ fontFamily: "'Comfortaa', cursive" }}>
              samyam
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
