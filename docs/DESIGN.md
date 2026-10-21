
# Design System & UI/UX Standards — Samyam Space Labels

> **Design Tokens, Typography & Component Styling Specifications**  
> *Derived directly from `src/index.css`, `tailwind.config.ts`, and component implementations.*

---

## 1. Brand Guidelines & Emblem Specifications

### The Samyam Brandmark
* **Emblem File:** `src/assets/samyam-logo.jpg` / `public/samyam-logo.jpg`
* **Visual Style:** High-contrast monochrome stylized circular 'S' vortex emblem.
* **Component Implementation (`src/components/SamyamLogo.tsx`):**
  * `size="sm"`: `h-8 w-8` (Text: `text-lg md:text-xl`)
  * `size="md"`: `h-9 w-9 md:h-11 md:w-11` (Text: `text-xl sm:text-2xl md:text-[26px]`)
  * `size="lg"`: `h-12 w-12 md:h-14 md:w-14` (Text: `text-2xl sm:text-3xl md:text-4xl`)
  * Typography: Single word *"Samyam"* in geometric sans-serif (`Plus Jakarta Sans`, `Space Grotesk`, sans-serif) with hover scale transition (`group-hover:scale-105 duration-300`).

---

## 2. Typography Rules

As defined in `src/index.css`:
```css
@import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
```
* **Headings & Display:** `Space Grotesk`, `Plus Jakarta Sans` (weights: 500, 600, 700).
* **Body & Interface:** `Inter`, `system-ui`, sans-serif.
* **Telemetry HUD & Coordinate Overlays:** `monospace` (JetBrains Mono / Roboto Mono).

---

## 3. Real Design Tokens (`src/index.css` & `tailwind.config.ts`)

| Token Variable | Type | Usage |
| :--- | :--- | :--- |
| `--background` | HSL | Canvas background |
| `--foreground` | HSL | Primary text |
| `--card` / `--card-foreground` | HSL | Mission cards & telemetry containers |
| `--primary` / `--primary-foreground` | HSL | Primary action buttons |
| `--secondary` / `--secondary-foreground`| HSL | Secondary controls |
| `--muted` / `--muted-foreground` | HSL | Subtle labels, timestamps, metadata |
| `--border` / `--input` | HSL | Cockpit dividing lines & input borders |
| `--radius` | `0.75rem` | Standard border radius for all cards and dialogs |
| `--cosmic-purple` / `--cosmic-teal` | HSL Custom | Space theme telemetry accents |
| `--cosmic-navy` / `--cosmic-navy-light` | HSL Custom | Deep space dark backdrop |

---

## 4. Zero Fake Policy in UI (Enforced in Codebase)

1. **Official Agency Badges:**
   * Defense and government programs in `src/pages/GovernmentHub.tsx` and `src/data/governmentPages.ts` use official agency badges rather than arbitrary foreign stock logos.
   * Commercial partner logos (`src/data/partnerLogos.ts`) are mapped strictly for verified partners (ISRO, NASA, ESA, SpaceX, Boeing, USGS).
2. **Authentic Orbital Imagery:**
   * Hero banner (`src/assets/hero-orb.jpg`) uses verified NASA/ISRO orbital Earth photography, avoiding synthetic CGI renders.
3. **Tactical Console Design (`SovereignMissionConsole.tsx`):**
   * Mode switching between **Satellite Optical** and **Tactical UAV Drone**.
   * Bounding box overlay HUD with pixel coordinates `[ymin, xmin, ymax, xmax]`, threat meters, and confidence scores.
