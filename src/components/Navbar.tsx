import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { useAdminCheck } from "@/hooks/useAdminCheck";
import { Menu, X, ArrowRight, LogOut, User, ChevronDown, FileText, BookOpen, Trophy, Users, FlaskConical, Briefcase, Shield, Mic, MessageSquareText, ScanText, Book, CreditCard, MessagesSquare, Rocket, Landmark, Satellite, Radar, Eye, Cpu, ShieldCheck, Building2, Globe2 } from "lucide-react";

const navLinks = ["Space Tech", "Enterprise"];

import { governmentPages } from "@/data/governmentPages";
import { productPages } from "@/data/productPages";

const governmentLinks = governmentPages.map((p) => ({
  label: p.label,
  subtitle: p.subtitle,
  icon: p.icon,
  href: `/government/${p.slug}`,
}));

const productLinks = productPages.map((p) => ({
  label: p.label,
  subtitle: p.subtitle,
  icon: p.icon,
  badge: p.badge,
  href: `/products/${p.slug}`,
}));

const researchLinks = [
  { label: "Research Papers", href: "/research/papers", icon: FileText },
  { label: "Research Blog", href: "/research/blog", icon: BookOpen },
  { label: "Frontier Leaderboards", href: "/research/frontier-leaderboards", icon: Trophy },
  { label: "Preference Leaderboard", href: "/research/preference-leaderboard", icon: Users },
  { label: "Labs", href: "/research/labs", icon: FlaskConical },
  { label: "Research Careers", href: "/research/careers", icon: Briefcase },
];

const developerApis = [
  { label: "Text to Speech", subtitle: "Samyam Voice V1", icon: Mic, href: "/developers/text-to-speech" },
  { label: "Speech to Text", subtitle: "Samyam Scribe V1", icon: MessageSquareText, href: "/developers/speech-to-text" },
  { label: "Document Digitisation", subtitle: "Samyam Vision", icon: ScanText, href: "/developers/document-digitisation" },
];

const developerResources = [
  { label: "Documentation", icon: Book, href: "#" },
  { label: "API Pricing", icon: CreditCard, href: "#" },
  { label: "Join Community", icon: MessagesSquare, href: "#" },
];

const Navbar = ({ variant = "light" }: { variant?: "light" | "dark" }) => {
  const isDark = variant === "dark";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const [developersOpen, setDevelopersOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [governmentOpen, setGovernmentOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const govDropdownRef = useRef<HTMLDivElement>(null);
  const productsDropdownRef = useRef<HTMLDivElement>(null);
  const { isAdmin } = useAdminCheck();
  const navigate = useNavigate();
  const { toast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const devDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setResearchOpen(false);
      }
      if (devDropdownRef.current && !devDropdownRef.current.contains(e.target as Node)) {
        setDevelopersOpen(false);
      }
      if (govDropdownRef.current && !govDropdownRef.current.contains(e.target as Node)) {
        setGovernmentOpen(false);
      }
      if (productsDropdownRef.current && !productsDropdownRef.current.contains(e.target as Node)) {
        setProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
    navigate("/");
  };

  const linkClass = isDark ? "text-white/70 hover:text-white" : "text-muted-foreground hover:text-foreground";

  return (
    <>
      {/* Announcement Banner */}
      <div className={`w-full border-b py-2 px-4 text-center text-sm ${isDark ? 'bg-white/5 border-white/10 text-white/70' : 'bg-gradient-to-r from-cosmic-purple/20 via-cosmic-teal/20 to-cosmic-purple/20 border-border/50 text-muted-foreground'}`}>
        <span>Samyam launches satellite data labeling platform</span>
        <a href="#" className={`ml-2 inline-flex items-center gap-1 font-medium ${isDark ? 'text-white hover:text-white/80' : 'text-cosmic-teal hover:text-cosmic-teal-glow'}`}>
          Learn more <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      {/* Navbar */}
      <nav className={`sticky top-0 z-50 w-full border-b ${isDark ? 'bg-black/80 backdrop-blur-xl border-white/10' : 'glass-card border-border/30'}`}>
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <a href="/" className={`text-[28px] font-medium tracking-wide lowercase ${isDark ? 'text-white' : 'text-foreground'}`} style={{ fontFamily: "'Comfortaa', cursive" }}>
            samyam
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {/* Products Dropdown */}
            <div ref={productsDropdownRef} className="relative">
              <button
                onClick={() => { setProductsOpen(!productsOpen); setGovernmentOpen(false); setDevelopersOpen(false); setResearchOpen(false); }}
                className={`text-sm transition-colors flex items-center gap-1 ${linkClass}`}
              >
                Products
                <ChevronDown className={`h-3 w-3 transition-transform ${productsOpen ? 'rotate-180' : ''}`} />
              </button>

              {productsOpen && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[640px] rounded-xl border p-5 shadow-2xl ${isDark ? 'bg-[hsl(0,0%,8%)] border-white/10' : 'bg-background border-border shadow-lg'}`}>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <p className={`text-xs uppercase tracking-widest font-medium ${isDark ? 'text-white/40' : 'text-muted-foreground'}`}>Products — Live backend</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isDark ? 'border-white/15 text-white/60' : 'border-border text-muted-foreground'}`}>8 modules</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {productLinks.map(({ label, subtitle, icon: Icon, href, badge }) => (
                      <a
                        key={href}
                        href={href}
                        onClick={(e) => { e.preventDefault(); setProductsOpen(false); navigate(href); }}
                        className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                      >
                        <div className={`p-1.5 rounded-lg mt-0.5 ${isDark ? 'bg-white/5' : 'bg-muted'}`}>
                          <Icon className="h-4 w-4 shrink-0" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium leading-tight">{label}</span>
                            {badge && (
                              <span className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 rounded ${isDark ? 'bg-cosmic-purple/20 text-cosmic-purple-glow' : 'bg-cosmic-purple/10 text-cosmic-purple-glow'}`}>{badge}</span>
                            )}
                          </div>
                          <span className={`text-xs ${isDark ? 'text-white/40' : 'text-muted-foreground/70'}`}>{subtitle}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <a key={link} href="#" className={`text-sm transition-colors ${linkClass}`}>
                {link}
              </a>
            ))}


            {/* Government Dropdown */}
            <div ref={govDropdownRef} className="relative">
              <button
                onClick={() => { setGovernmentOpen(!governmentOpen); setDevelopersOpen(false); setResearchOpen(false); }}
                className={`text-sm transition-colors flex items-center gap-1 ${linkClass}`}
              >
                Government
                <ChevronDown className={`h-3 w-3 transition-transform ${governmentOpen ? 'rotate-180' : ''}`} />
              </button>

              {governmentOpen && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[640px] rounded-xl border p-5 shadow-2xl ${isDark ? 'bg-[hsl(0,0%,8%)] border-white/10' : 'bg-background border-border shadow-lg'}`}>
                  <div className="flex items-center justify-between mb-3 px-1">
                    <p className={`text-xs uppercase tracking-widest font-medium ${isDark ? 'text-white/40' : 'text-muted-foreground'}`}>Government — India & Allies</p>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full border ${isDark ? 'border-white/15 text-white/60' : 'border-border text-muted-foreground'}`}>ITAR Aware</span>
                  </div>
                  <div className="grid grid-cols-2 gap-1">
                    {governmentLinks.map(({ label, subtitle, icon: Icon, href }) => (
                      <a
                        key={label}
                        href={href}
                        onClick={(e) => { e.preventDefault(); setGovernmentOpen(false); navigate(href); }}
                        className={`flex items-start gap-3 px-3 py-2.5 rounded-lg transition-colors ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                      >
                        <div className={`p-1.5 rounded-lg mt-0.5 ${isDark ? 'bg-white/5' : 'bg-muted'}`}>
                          <Icon className="h-4 w-4 shrink-0" />
                        </div>
                        <div>
                          <span className="text-sm font-medium block leading-tight">{label}</span>
                          <span className={`text-xs ${isDark ? 'text-white/40' : 'text-muted-foreground/70'}`}>{subtitle}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                  <div className={`mt-4 pt-3 border-t flex items-center justify-between px-1 ${isDark ? 'border-white/10' : 'border-border'}`}>
                    <span className={`text-xs ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>Mission-ready AI for sovereign defence & space programs</span>
                    <a href="/book-demo" onClick={(e) => { e.preventDefault(); setGovernmentOpen(false); navigate("/book-demo"); }} className={`text-xs font-medium inline-flex items-center gap-1 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-primary hover:text-primary/80'}`}>
                      Book briefing <ArrowRight className="h-3 w-3" />
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Developers Dropdown */}
            <div ref={devDropdownRef} className="relative">
              <button
                onClick={() => { setDevelopersOpen(!developersOpen); setResearchOpen(false); }}
                className={`text-sm transition-colors flex items-center gap-1 ${linkClass}`}
              >
                Developers
                <ChevronDown className={`h-3 w-3 transition-transform ${developersOpen ? 'rotate-180' : ''}`} />
              </button>

              {developersOpen && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-[580px] rounded-xl border p-5 shadow-2xl ${isDark ? 'bg-[hsl(0,0%,8%)] border-white/10' : 'bg-background border-border shadow-lg'}`}>
                  <div className="grid grid-cols-3 gap-6">
                    {/* APIs */}
                    <div>
                      <p className={`text-xs uppercase tracking-widest mb-3 font-medium ${isDark ? 'text-white/40' : 'text-muted-foreground'}`}>APIs</p>
                      <div className="space-y-1">
                        {developerApis.map(({ label, subtitle, icon: Icon, href }) => (
                          <a
                            key={label}
                            href={href}
                            onClick={(e) => { e.preventDefault(); setDevelopersOpen(false); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                          >
                            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-muted'}`}>
                              <Icon className="h-4 w-4 shrink-0" />
                            </div>
                            <div>
                              <span className="text-sm font-medium block">{label}</span>
                              <span className={`text-xs ${isDark ? 'text-white/40' : 'text-muted-foreground/70'}`}>{subtitle}</span>
                            </div>
                          </a>
                        ))}
                      </div>
                      <a href="#" className={`text-xs font-medium mt-3 block px-3 ${isDark ? 'text-blue-400 hover:text-blue-300' : 'text-primary hover:text-primary/80'}`}>
                        View all models
                      </a>
                    </div>

                    {/* Resources */}
                    <div>
                      <p className={`text-xs uppercase tracking-widest mb-3 font-medium ${isDark ? 'text-white/40' : 'text-muted-foreground'}`}>Resources</p>
                      <div className="space-y-1">
                        {developerResources.map(({ label, icon: Icon, href }) => (
                          <a
                            key={label}
                            href={href}
                            onClick={(e) => { e.preventDefault(); setDevelopersOpen(false); }}
                            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                          >
                            <div className={`p-1.5 rounded-lg ${isDark ? 'bg-white/5' : 'bg-muted'}`}>
                              <Icon className="h-4 w-4 shrink-0" />
                            </div>
                            <span className="text-sm">{label}</span>
                          </a>
                        ))}
                      </div>
                    </div>

                    {/* Startup Program Card */}
                    <div>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); setDevelopersOpen(false); }}
                        className="block rounded-xl overflow-hidden group"
                      >
                        <div className="bg-gradient-to-br from-indigo-400/80 via-purple-400/60 to-blue-400/80 p-6 rounded-xl h-full flex flex-col items-center justify-center text-center min-h-[140px]">
                          <Rocket className="h-6 w-6 text-white mb-2" />
                          <span className="text-white text-lg font-bold leading-tight">Startup<br />Program</span>
                        </div>
                        <div className={`flex items-center justify-between pt-2 text-xs ${isDark ? 'text-white/50' : 'text-muted-foreground'}`}>
                          <span>Samyam Startup Program</span>
                          <ArrowRight className="h-3 w-3" />
                        </div>
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Research Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => { setResearchOpen(!researchOpen); setDevelopersOpen(false); }}
                className={`text-sm transition-colors flex items-center gap-1 ${linkClass}`}
              >
                Research
                <ChevronDown className={`h-3 w-3 transition-transform ${researchOpen ? 'rotate-180' : ''}`} />
              </button>

              {researchOpen && (
                <div className={`absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 rounded-xl border p-3 shadow-2xl ${isDark ? 'bg-[hsl(0,0%,8%)] border-white/10' : 'bg-background border-border shadow-lg'}`}>
                  <p className={`text-xs uppercase tracking-widest px-3 py-2 font-medium ${isDark ? 'text-white/40' : 'text-muted-foreground'}`}>Research</p>
                  <div className="grid grid-cols-2 gap-1">
                    {researchLinks.map(({ label, href, icon: Icon }) => (
                      <a
                        key={href}
                        href={href}
                        onClick={(e) => { e.preventDefault(); setResearchOpen(false); navigate(href); }}
                        className={`flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm transition-colors ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                      >
                        <Icon className="h-4 w-4 shrink-0" />
                        <span className="text-xs">{label}</span>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <a href="#" className={`text-sm transition-colors ${linkClass}`}>Resources</a>
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                {isAdmin && (
                  <a href="/admin" onClick={(e) => { e.preventDefault(); navigate("/admin"); }} className={`text-sm transition-colors flex items-center gap-1 ${linkClass}`}>
                    <Shield className="h-4 w-4" /> Admin
                  </a>
                )}
                <a href="/dashboard" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); }} className={`text-sm transition-colors flex items-center gap-1 ${linkClass}`}>
                  <User className="h-4 w-4" />
                  {user.user_metadata?.username || user.email}
                </a>
                <Button size="sm" variant="outline" onClick={handleLogout} className={`gap-1 ${isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}`}>
                  <LogOut className="h-3 w-3" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <a href="/auth" className={`text-sm transition-colors ${linkClass}`}>Log In</a>
                <Button size="sm" className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground hover:opacity-90 border-0" onClick={() => navigate("/auth")}>
                  Sign Up <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className={`md:hidden ${isDark ? 'text-white' : 'text-foreground'}`} onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className={`md:hidden border-t px-4 py-6 space-y-4 ${isDark ? 'bg-black/90 backdrop-blur-xl border-white/10' : 'glass-card border-border/30'}`}>
            {/* Mobile Products Section */}
            <div className="pt-2 pb-2">
              <p className={`text-xs uppercase tracking-widest mb-2 font-medium ${isDark ? 'text-white/40' : 'text-muted-foreground'}`}>Products</p>
              <div className="space-y-1">
                {productLinks.map(({ label, subtitle, icon: Icon, href, badge }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => { e.preventDefault(); setMobileOpen(false); navigate(href); }}
                    className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-colors ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="block font-medium">{label}</span>
                        {badge && <span className="text-[9px] uppercase tracking-wider px-1 py-0.5 rounded bg-cosmic-purple/15 text-cosmic-purple-glow">{badge}</span>}
                      </div>
                      <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-muted-foreground/60'}`}>{subtitle}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {navLinks.map((link) => (
              <a key={link} href="#" className={`block text-sm ${linkClass}`}>{link}</a>
            ))}


            {/* Mobile Developers Section */}
            <div className="pt-2 pb-2">
              <p className={`text-xs uppercase tracking-widest mb-2 font-medium ${isDark ? 'text-white/40' : 'text-muted-foreground'}`}>Developers</p>
              <div className="space-y-1">
                {developerApis.map(({ label, subtitle, icon: Icon }) => (
                  <a key={label} href="#" onClick={(e) => { e.preventDefault(); setMobileOpen(false); }}
                    className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-colors ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    <div>
                      <span className="block font-medium">{label}</span>
                      <span className={`text-[10px] ${isDark ? 'text-white/30' : 'text-muted-foreground/60'}`}>{subtitle}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Government Section */}
            <div className="pt-2 pb-2">
              <p className={`text-xs uppercase tracking-widest mb-2 font-medium ${isDark ? 'text-white/40' : 'text-muted-foreground'}`}>Government — India & Allies</p>
              <div className="grid grid-cols-1 gap-1">
                {governmentLinks.map(({ label, subtitle, icon: Icon, href }) => (
                  <a key={label} href={href} onClick={(e) => { e.preventDefault(); setMobileOpen(false); navigate(href); }}
                    className={`flex items-start gap-2 px-2 py-2 rounded-lg transition-colors ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                    <div>
                      <span className="block text-xs font-medium leading-tight">{label}</span>
                      <span className={`text-[10px] ${isDark ? 'text-white/40' : 'text-muted-foreground/70'}`}>{subtitle}</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Mobile Research Section */}
            <div className="pt-2 pb-2">
              <p className={`text-xs uppercase tracking-widest mb-2 font-medium ${isDark ? 'text-white/40' : 'text-muted-foreground'}`}>Research</p>
              <div className="grid grid-cols-2 gap-1">
                {researchLinks.map(({ label, href, icon: Icon }) => (
                  <a
                    key={href}
                    href={href}
                    onClick={(e) => { e.preventDefault(); setMobileOpen(false); navigate(href); }}
                    className={`flex items-center gap-2 px-2 py-2 rounded-lg text-xs transition-colors ${isDark ? 'text-white/70 hover:text-white hover:bg-white/10' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`}
                  >
                    <Icon className="h-3.5 w-3.5 shrink-0" />
                    {label}
                  </a>
                ))}
              </div>
            </div>

            <a href="#" className={`block text-sm ${linkClass}`}>Resources</a>

            <div className={`pt-4 border-t space-y-3 ${isDark ? 'border-white/10' : 'border-border/30'}`}>
              {user ? (
                <>
                  <span className={`block text-sm ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>
                    <User className="h-4 w-4 inline mr-1" />
                    {user.user_metadata?.username || user.email}
                  </span>
                  <Button size="sm" variant="outline" className={`w-full gap-1 ${isDark ? 'border-white/20 text-white hover:bg-white/10' : ''}`} onClick={handleLogout}>
                    <LogOut className="h-3 w-3" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <a href="/auth" className={`block text-sm ${isDark ? 'text-white/70' : 'text-muted-foreground'}`}>Log In</a>
                  <Button size="sm" className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground border-0" onClick={() => navigate("/auth")}>
                    Sign Up <ArrowRight className="h-3 w-3 ml-1" />
                  </Button>
                </>
              )}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navbar;
