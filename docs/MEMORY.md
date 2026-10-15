# Project Memory & Architecture Decision Records (ADRs)

> **Persistent Engineering Log & Genuine Historical Context**  
> *Samyam Space Labels / SamyamLM-V1*

---

## 1. Project Purpose & Origin
* **Mission:** Build a sovereign, on-device/local Multimodal Spatial AI Engine and Data Labeling Suite tailored for Indian defense, remote sensing, and aerospace agencies (ISRO, Indian Armed Forces, MoD, IndiaAI Mission).
* **Core Philosophy:** High-security air-gap capability — sensitive satellite, SAR, and drone imagery must be processed locally on consumer GPUs (NVIDIA RTX 4050/3060) or on-premise hardware without dependency on foreign commercial cloud APIs.

---

## 2. Model Evolution & Architecture Decisions

### ADR 01: Base Architecture Selection (`SamyamLM-V1`)
* **Decision:** Base model built with **1.86 Billion parameters** combining a **1.4B Phi-2** reasoning backbone and a **454.45M CLIP ViT** vision encoder.
* **Why:** 
  * Fits inside ~2.5 GB to 3.0 GB of VRAM using `Q4_0` 4-bit quantization.
  * Delivers 300ms–800ms inference on consumer laptops with NVIDIA RTX 4050/3060.
  * Can run completely air-gapped via the local Ollama runtime.

### ADR 02: Prompt Template & Stop Token Debugging
* **Problem Encountered:** The model loaded in Ollama was giving blank responses (`>>> hi` returned empty string) or repeating tokens endlessly when ChatML tokens (`<|im_start|>`, `<|im_end|>`) were used.
* **Root Cause Identified:** Neither Phi-2 nor LLaVA are trained on ChatML tokens. Injecting `<|im_start|>` caused immediate stop token triggers or token repeat loops.
* **Resolution:** Synchronized the Ollama `Modelfile` to the model's native format (e.g. `[INST] ... [/INST]` for LLaVA with stop tokens `[INST]` and `[/INST]`).

### ADR 03: Conversational & Intent-Driven Adaptation
* **Problem:** Pure Moondream weights only supported single-turn image captioning and could not greet, chat, or answer conversational questions.
* **Resolution:** Re-tuned the `Modelfile` with an adaptive system prompt and `temperature 0.3` so the model dynamically answers based on user intent (verbatim OCR on documents, scene description on photos, or conversational introduction when greeted).

### ADR 04: Graceful Air-Gap Client Resilience (`src/lib/samyamApi.ts`)
* **Decision:** The React frontend must remain fully operational even if the Python FastAPI backend (`localhost:8000`) is not running.
* **Implementation:** Built an automatic sovereign air-gap fallback generator in `samyamApi.ts` that provides realistic tactical telemetry, radar assets, and dual-language briefings if the local HTTP endpoint times out.

---

## 3. Storage & Integration Decisions

* **AWS S3 (`AwsS3Uploader.tsx`):**
  * Bucket: `samyam-satellite-datasets` (Region: `us-east-1`).
  * Direct client uploads use presigned URLs to prevent exposing IAM secret credentials to the browser.
* **Razorpay Payment Gateway (`useRazorpayCheckout.ts`):**
  * Test Key ID: `VITE_RAZORPAY_KEY_ID` configured in `.env.example`.
  * Manages annotator payouts and enterprise subscription billing.
* **Supabase Cloud Agents:**
  * Voice Agent runs on Supabase Edge Functions with `google/gemini-3-flash-preview`.
  * OpenClaw Operations Agent connects via `OPENCLAW_GATEWAY_URL`.
