import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Mounts once inside the Router. After every route change, it finds all
 * <section> elements (and any element marked with [data-reveal]) and applies
 * a fade/slide-up animation as they enter the viewport.
 *
 * Pages don't have to opt in individually — wrapping <section> is enough.
 */
const AutoScrollReveal = () => {
  const location = useLocation();

  useEffect(() => {
    // Respect reduced-motion users.
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const targets = Array.from(
      document.querySelectorAll<HTMLElement>("section, [data-reveal]")
    ).filter((el) => !el.dataset.revealBound);

    if (targets.length === 0) return;

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("reveal-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );

    targets.forEach((el, i) => {
      el.dataset.revealBound = "1";
      el.classList.add("reveal-on-scroll");
      // Light stagger across the first few sections only.
      if (i < 6) el.style.transitionDelay = `${i * 60}ms`;
      io.observe(el);
    });

    // Re-scan shortly after route mount in case sections render async.
    const rescan = window.setTimeout(() => {
      document
        .querySelectorAll<HTMLElement>("section, [data-reveal]")
        .forEach((el) => {
          if (!el.dataset.revealBound) {
            el.dataset.revealBound = "1";
            el.classList.add("reveal-on-scroll");
            io.observe(el);
          }
        });
    }, 400);

    return () => {
      window.clearTimeout(rescan);
      io.disconnect();
    };
  }, [location.pathname]);

  return null;
};

export default AutoScrollReveal;
