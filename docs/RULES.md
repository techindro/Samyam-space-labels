# Development Rules & Security Protocols — Samyam Space Labels

> **Engineering Standards, Air-Gap Security & Zero-Fake Data Policy**  
> *Enforced across all frontend (`src/`) and AI backend (`python/`) modules.*

---

## 1. Zero-Fake Policy (Mandatory Codebase Rule)

As established in `INTERNAL_DEVELOPER_GUIDE.md`:
1. **No Mismatched Defense Logos:**
   * Defense and paramilitary agencies (DRDO, Indian Army, Navy, Air Force, BSF, ITBP, MeitY, NIC) must use official sovereign agency badges.
   * Commercial partner logos (`src/data/partnerLogos.ts`) must only be mapped for verified agencies (ISRO, NASA, ESA, SpaceX, Boeing, USGS).
2. **No Fake Disclaimers:**
   * Never insert synthetic disclaimers like *"illustrative emblem"* or *"synthetic preview"*.
3. **Authentic Imagery:**
   * Orbital Earth graphics must use authentic NASA/ISRO photography (`src/assets/hero-orb.jpg`), not synthetic CGI balls.

---

## 2. Air-Gap & Security Protocols

* **Rule 2.1: Local GPU First:**
  * Raw satellite, SAR, and drone imagery must be processed exclusively via the local FastAPI server (`http://localhost:8000`) and local Ollama model (`samyamlm-v1`).
  * Never send defense imagery or user documents to third-party public cloud endpoints.
* **Rule 2.2: Secret Key Isolation:**
  * Private credentials (`AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `RAZORPAY_KEY_SECRET`, `GROQ_API_KEY`) must **only** reside in the backend environment.
  * Only publishable variables prefixed with `VITE_` (`VITE_SUPABASE_URL`, `VITE_RAZORPAY_KEY_ID`, `VITE_FASTAPI_URL`) are allowed in client code.
* **Rule 2.3: Offline Client Resilience:**
  * Every API call in `src/lib/samyamApi.ts` must maintain a local fallback generator so the client never crashes if the local Python server is offline.

---

## 3. Frontend Standards (React 18 + Vite)

* **Design Consistency:**
  * Always use [SamyamLogo](file:///c:/Users/LENOVO/OneDrive/Desktop/Samyam-space-labels/Samyam-space-labels/src/components/SamyamLogo.tsx) component for the brandmark.
  * Use the design tokens defined in `src/index.css` and `tailwind.config.ts`.
* **TypeScript Discipline:**
  * Maintain strict types for all API payloads and mission telemetry (`DetectedAsset`, `TelemetryData`, `IntelBriefing`).
* **Route Registration:**
  * All new pages must be properly registered in `src/App.tsx` with appropriate route boundaries.

---

## 4. Python AI Server Standards (FastAPI + Ollama)

* **Type Safety:** All endpoints in `serve_samyam_lm.py` must use Pydantic response models (`ModelStatusResponse`, `AnalyzeResponse`).
* **Prompt Template Fidelity:**
  * Never mix ChatML stop tokens (`<|im_start|>`) with LLaVA or Phi-2 base models.
  * Adhere strictly to the underlying architecture's native template.
* **CORS Restrictions:**
  * Restrict CORS in `serve_samyam_lm.py` to approved client origins (`http://localhost:8080`, `https://samyam.space`, `*.vercel.app`).
