import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, ArrowRight, LogOut, User, ChevronDown, FileText, BookOpen, Trophy, Users, FlaskConical, Briefcase } from "lucide-react";

const navLinks = ["Products", "Space Tech", "Government", "Enterprise"];

const researchLinks = [
  { label: "Research Papers", href: "/research/papers", icon: FileText },
  { label: "Research Blog", href: "/research/blog", icon: BookOpen },
  { label: "Frontier Leaderboards", href: "/research/frontier-leaderboards", icon: Trophy },
  { label: "Preference Leaderboard", href: "/research/preference-leaderboard", icon: Users },
  { label: "Labs", href: "/research/labs", icon: FlaskConical },
  { label: "Research Careers", href: "/research/careers", icon: Briefcase },
];

const Navbar = ({ variant = "light" }: { variant?: "light" | "dark" }) => {
  const isDark = variant === "dark";
  const [mobileOpen, setMobileOpen] = useState(false);
  const [researchOpen, setResearchOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const dropdownRef = useRef<HTMLDivElement>(null);

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
            {navLinks.map((link) => (
              <a key={link} href="#" className={`text-sm transition-colors ${linkClass}`}>
                {link}
              </a>
            ))}

            {/* Research Dropdown */}
            <div ref={dropdownRef} className="relative">
              <button
                onClick={() => setResearchOpen(!researchOpen)}
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
                <a href="/dashboard" className={`text-sm transition-colors flex items-center gap-1 ${linkClass}`}>
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
            {navLinks.map((link) => (
              <a key={link} href="#" className={`block text-sm ${linkClass}`}>{link}</a>
            ))}

            {/* Mobile Research Section */}
            <div className={`pt-2 pb-2`}>
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
