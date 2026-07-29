import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X, Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const COOKIE_KEY = "samyam_cookie_consent";

type ConsentState = "accepted" | "declined" | null;

const CookieConsent = () => {
  const [visible, setVisible] = useState(false);
  const [showPrefs, setShowPrefs] = useState(false);
  const [analytics, setAnalytics] = useState(true);

  useEffect(() => {
    const stored = localStorage.getItem(COOKIE_KEY);
    if (!stored) {
      // Show after 1.5s delay so it doesn't immediately distract
      const t = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(t);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ consent: "accepted", analytics, ts: Date.now() }));
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(COOKIE_KEY, JSON.stringify({ consent: "declined", analytics: false, ts: Date.now() }));
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 80 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-sm z-[999]"
        >
          <div className="glass-card rounded-2xl p-5 shadow-2xl border border-border/60 backdrop-blur-xl">
            {!showPrefs ? (
              <>
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-2 rounded-xl bg-secondary shrink-0 mt-0.5">
                    <Cookie className="h-4 w-4" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-sm mb-1">We use cookies 🍪</h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      We use essential cookies to make our site work. With your consent, we'd also like to use
                      analytics cookies to understand how you use Samyam.{" "}
                      <Link to="/privacy" className="text-foreground underline underline-offset-2">
                        Privacy Policy
                      </Link>
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={accept}
                    className="flex-1 bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground border-0 text-xs h-8"
                  >
                    <Check className="h-3 w-3 mr-1" /> Accept All
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowPrefs(true)}
                    className="flex-1 text-xs h-8"
                  >
                    Manage
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={decline}
                    className="h-8 w-8 p-0 text-muted-foreground"
                    aria-label="Decline"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-sm">Cookie Preferences</h3>
                  <button onClick={() => setShowPrefs(false)} className="text-muted-foreground hover:text-foreground">
                    <X className="h-4 w-4" />
                  </button>
                </div>

                {/* Essential - always on */}
                <div className="flex items-center justify-between py-2.5 border-b border-border/30">
                  <div>
                    <p className="text-xs font-medium">Essential Cookies</p>
                    <p className="text-xs text-muted-foreground">Authentication, security, session</p>
                  </div>
                  <div className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">Always On</div>
                </div>

                {/* Analytics - toggleable */}
                <div className="flex items-center justify-between py-2.5">
                  <div>
                    <p className="text-xs font-medium">Analytics Cookies</p>
                    <p className="text-xs text-muted-foreground">Help us improve the platform</p>
                  </div>
                  <button
                    onClick={() => setAnalytics((a) => !a)}
                    className={`relative w-9 h-5 rounded-full transition-colors ${
                      analytics ? "bg-foreground" : "bg-border"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-background transition-transform ${
                        analytics ? "translate-x-4" : "translate-x-0"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex gap-2 mt-3 pt-3 border-t border-border/30">
                  <Button
                    size="sm"
                    onClick={accept}
                    className="flex-1 bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground border-0 text-xs h-8"
                  >
                    Save Preferences
                  </Button>
                  <Button size="sm" variant="outline" onClick={decline} className="text-xs h-8">
                    Decline All
                  </Button>
                </div>
              </>
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
