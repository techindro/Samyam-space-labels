# Samyam Platform — Internal Developer & Architecture Guide 🛰️
> **Internal Reference Document** (Confidential / For Developer & Owner Only)  
> *Last Updated: August 2026*

---

## 📌 1. Overview & System Summary

Yeh document aapke project (**Samyam Space Labels / SamyamLM**) ke poore code structure, modifications, AI backend, aur frontend flow ko detail me explain karta hai taaki aap asani se samajh sakein ki kaha kya code likha gaya hai aur woh kaise kaam karta hai.

---

## 🤖 2. Model & AI Backend (`SamyamLM-V1`)

### A. Model Specifications
* **Model Name**: `SamyamLM-V1` (registered in local Ollama as `samyamlm-v1`)
* **Total Parameters**: **1.86 Billion**
  * Language Model: `1.4B Phi-2` Backbone
  * Vision Encoder: `454.45M CLIP ViT` Multimodal Projector
* **Context Window**: **2,048 Tokens**
* **Quantization**: `Q4_0` (VRAM Footprint: ~2.5 GB to 3.0 GB on your RTX 4050 GPU)
* **Inference Speed**: ~280ms – 800ms per image on local CUDA

### B. Core Backend Files
1. **`python/samyam_lm_multimodal/Modelfile`**:
   - Ollama configuration file.
   - Model persona ko *SamyamLM-V1 Multimodal Sovereign Vision Model* ke roop me set karta hai.
2. **`python/samyam_lm_multimodal/serve_samyam_lm.py`**:
   - **FastAPI** server running at `http://localhost:8000`.
   - **Core Endpoints**:
     - `GET /health` & `GET /`: Health check and GPU model status.
     - `POST /api/v1/government/mission-intel`: Real image bytes (Base64) ko decode karke local Ollama GPU pipeline me bhejta hai, image ke elements ko detect karta hai aur English + Hindi tactical briefing generate karta hai.
     - `POST /api/v1/spatial-detect`: Text-promptable bounding box detection on GPU.
     - `POST /api/v1/prelabel/grounding-dino`: Real-time auto-labeling pipeline for imagery.

---

## 🎨 3. Frontend Architecture (`src/`)

### A. Sovereign Mission AI Console
* **File**: `src/components/SovereignMissionConsole.tsx`
* **Features**:
  1. **Real Image File Upload**: User apne computer se koi bhi PNG/JPG/TIFF satellite/aerial photo load kar sakta hai.
  2. **Custom Target Query**: Bunkers, runways, radars, ya vehicles detect karne ke live prompts.
  3. **Custom GPS Coordinates**: Real Lat/Lon inputs.
  4. **Dual Language Intel Briefings**: English aur Devanagari Hindi me live AI output.
  5. **Encrypted Dossier Export**: JSON mission intelligence report download karne ka feature.

### B. Government & Defense Sovereign Hub
* **Files**:
  - `src/pages/GovernmentHub.tsx`: Main government programs showcase page with live AI Console.
  - `src/pages/GovernmentPage.tsx`: Specific program detail pages (`indian-defence-mod`, `isro-space`, `border-maritime`, `indiaai-mission`, etc.).
  - `src/data/governmentPages.ts`: Saare government programs ka verified metadata, capabilities aur official agency badges.

### C. Client API Bridge
* **File**: `src/lib/samyamApi.ts`
* **Function**: Frontend ko local FastAPI AI server (`http://localhost:8000`) se connect karta hai (`runGovernmentMissionIntel`, `runSamyamLmMultimodal`, `runClipPrelabel`).

---

## 🛡️ 4. Data Cleaning & Zero Fake Policy

Aapke nirdesh anusaar poore project me yeh safai ki gayi hai:

1. **No Mismatched/Fake Logos**:
   - DRDO, Indian Army, Navy, Air Force, BSF, ITBP, MeitY, NIC par pehle lage videshi logos hata kar unhe **Official Sovereign Agency Badges** me convert kiya gaya.
   - Genuine logos sirf official sansthaon (**ISRO**, **NASA**, **ESA**, **USGS**) ke liye hi mapped hain.
2. **No Fake Disclaimers**:
   - *"Illustrative emblem"* aur *"0.8m Synthetic"* jaise fake disclaimers poori tarah remove kar diye gaye hain.
3. **Real Earth Satellite Imagery**:
   - 3D Metallic render orb (`src/assets/hero-orb.jpg`) ko authentic **NASA/ISRO Satellite Earth from Orbit** photo se replace kiya gaya hai.
4. **Universal Sans-Serif Typography**:
   - `src/index.css` aur `tailwind.config.ts` me poore system ko standard **Sans-serif (`Inter`, `system-ui`)** me lock kiya gaya hai taaki har page par clean look mile.

---

## 🚀 5. How to Run Locally

### 1. Ollama Model Start (Local GPU)
```bash
ollama run samyamlm-v1
```

### 2. FastAPI AI Server Start
```bash
python python/samyam_lm_multimodal/serve_samyam_lm.py
```
*(Runs at `http://localhost:8000` | API Docs: `http://localhost:8000/docs`)*

### 3. Frontend Dev Server Start
```bash
npm run dev
```
*(Runs at `http://localhost:8080`)*

### 4. Production Build Test
```bash
npm run build
```

---

*Note: Yeh file sirf developer ke aantarik upayog ke liye hai aur kisi bhi public frontend route par exposed nahi hai.*
