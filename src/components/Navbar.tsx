import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Menu, X, ArrowRight, LogOut, User } from "lucide-react";

const navLinks = ["Products", "Space Tech", "Government", "Enterprise", "Resources"];

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast({ title: "Signed out successfully" });
    navigate("/");
  };

  return (
    <>
      {/* Announcement Banner */}
      <div className="w-full bg-gradient-to-r from-cosmic-purple/20 via-cosmic-teal/20 to-cosmic-purple/20 border-b border-border/50 py-2 px-4 text-center text-sm text-muted-foreground">
        <span>Samyam launches satellite data labeling platform</span>
        <a href="#" className="ml-2 text-cosmic-teal hover:text-cosmic-teal-glow inline-flex items-center gap-1 font-medium">
          Learn more <ArrowRight className="h-3 w-3" />
        </a>
      </div>

      {/* Navbar */}
      <nav className="sticky top-0 z-50 w-full glass-card border-b border-border/30">
        <div className="container mx-auto flex items-center justify-between h-16 px-4">
          {/* Logo */}
          <a href="/" className="text-[28px] font-medium tracking-wide text-foreground lowercase" style={{ fontFamily: "'Comfortaa', cursive" }}>
            samyam
          </a>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a key={link} href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                {link}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <a href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1">
                  <User className="h-4 w-4" />
                  {user.user_metadata?.username || user.email}
                </a>
                <Button size="sm" variant="outline" onClick={handleLogout} className="gap-1">
                  <LogOut className="h-3 w-3" /> Sign Out
                </Button>
              </>
            ) : (
              <>
                <a href="/auth" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Log In
                </a>
                <Button size="sm" className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground hover:opacity-90 border-0" onClick={() => navigate("/auth")}>
                  Sign Up <ArrowRight className="h-3 w-3 ml-1" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <button className="md:hidden text-foreground" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div className="md:hidden glass-card border-t border-border/30 px-4 py-6 space-y-4">
            {navLinks.map((link) => (
              <a key={link} href="#" className="block text-sm text-muted-foreground hover:text-foreground">
                {link}
              </a>
            ))}
            <div className="pt-4 border-t border-border/30 space-y-3">
              {user ? (
                <>
                  <span className="block text-sm text-muted-foreground">
                    <User className="h-4 w-4 inline mr-1" />
                    {user.user_metadata?.username || user.email}
                  </span>
                  <Button size="sm" variant="outline" className="w-full gap-1" onClick={handleLogout}>
                    <LogOut className="h-3 w-3" /> Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <a href="/auth" className="block text-sm text-muted-foreground">Log In</a>
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
