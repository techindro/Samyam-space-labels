import { useEffect } from "react";
import { useLocation, matchPath } from "react-router-dom";

interface AutoScrollRevealProps {
  /**
   * Route patterns (react-router style) where the global reveal should be
   * disabled entirely — e.g. ["/auth", "/reset-password"].
   */
  excludeRoutes?: string[];
  /**
   * Extra CSS selectors whose elements should NEVER be revealed, in addition
   * to the built-in opt-outs below.
   */
  excludeSelectors?: string[];
}

/**
 * Global scroll-reveal. Mounted once inside the Router.
 *
 * Opt-out mechanisms (any one is enough to keep an element static):
 *  - Attribute on the element itself: `data-reveal="off"` or `data-no-reveal`
 *  - Ancestor with `data-reveal="off"` / `data-no-reveal`
 *  - Class on the element or an ancestor: `.no-reveal`
 *  - Route listed in `excludeRoutes`
 *  - Selector listed in `excludeSelectors`
 *  - Built-in: <header>, <nav>, [role="banner"], [role="navigation"],
 *    and anything inside them (so navbars/hero banners stay static).
 */
const BUILTIN_EXCLUDE_ANCESTORS = [
  "header",
  "nav",
  '[role="banner"]',
  '[role="navigation"]',
  "[data-reveal='off']",
  "[data-no-reveal]",
  ".no-reveal",
];

const isExcluded = (
  el: HTMLElement,
  extraSelectors: string[]
): boolean => {
  // Direct opt-out on the element itself.
  if (
    el.dataset.reveal === "off" ||
    el.hasAttribute("data-no-reveal") ||
    el.classList.contains("no-reveal")
  ) {
    return true;
  }
  const selectors = [...BUILTIN_EXCLUDE_ANCESTORS, ...extraSelectors];
  return selectors.some((sel) => {
    try {
      return el.closest(sel) !== null;
    } catch {
      return false;
    }
  });
};

const AutoScrollReveal = ({
  excludeRoutes = [],
  excludeSelectors = [],
}: AutoScrollRevealProps) => {
  const location = useLocation();

  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }

    const routeExcluded = excludeRoutes.some((pattern) =>
      matchPath({ path: pattern, end: false }, location.pathname)
    );
    if (routeExcluded) return;

    const collect = () =>
      Array.from(
        document.querySelectorAll<HTMLElement>("section, [data-reveal='on'], [data-reveal-target]")
      ).filter(
        (el) =>
          !el.dataset.revealBound &&
          // Honour opt-outs.
          (el.dataset.reveal === "on" ||
            el.hasAttribute("data-reveal-target") ||
            !isExcluded(el, excludeSelectors))
      );

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

    const bind = (targets: HTMLElement[]) => {
      targets.forEach((el, i) => {
        el.dataset.revealBound = "1";
        el.classList.add("reveal-on-scroll");
        if (i < 6) el.style.transitionDelay = `${i * 60}ms`;
        io.observe(el);
      });
    };

    bind(collect());

    const rescan = window.setTimeout(() => bind(collect()), 400);

    return () => {
      window.clearTimeout(rescan);
      io.disconnect();
    };
  }, [location.pathname, excludeRoutes, excludeSelectors]);

  return null;
};

export default AutoScrollReveal;
