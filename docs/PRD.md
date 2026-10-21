
# Product Requirements Document (PRD) — Samyam Space Labels

> **Product Vision, Target Users & Feature Specifications**  
> *Samyam Space Labels — Breakthrough Spatial Vision AI for India & Global Space/Defense*

---

## 1. Executive Summary

Samyam Space Labels is a sovereign data labeling and spatial AI analysis platform designed for satellite optical imagery, Synthetic Aperture Radar (SAR), hyperspectral sensors, and tactical drone feeds. The platform pairs a React/Vite annotation studio with an on-device 1.86B parameter multimodal AI engine (`SamyamLM-V1`) that operates air-gapped on local NVIDIA RTX hardware.

---

## 2. Target Users & Personas

1. **Defense & Strategic Intelligence Analysts:**
   * Need offline, air-gapped target detection (runways, radars, military assets) and tactical intelligence briefings in both English and Hindi.
2. **Space Agencies & Remote Sensing Engineers (ISRO, IN-SPACe):**
   * Require high-precision geospatial labeling (bounding boxes, polygons, semantic masks) on high-resolution Earth observation data.
3. **Autonomous & Robotics Developers:**
   * Building Indian road perception models and autonomous navigation systems using HuggingFace demonstration pipelines (`techindro`).
4. **Data Annotator Workforce:**
   * Remote annotators labeling geospatial imagery with verified payouts via Razorpay.

---

## 3. Core Feature Requirements (Existing in Codebase)

### Feature 1: Sovereign Mission AI Console (`SovereignMissionConsole.tsx`)
* **Mode Selection:** Toggle between **Satellite Optical** imagery and **Tactical UAV Drone** live stream modes.
* **Telemetry HUD:** Displays live altitude (120m), ground speed (45 km/h), heading, coordinates (Lat/Lon), and sensor latency.
* **Dual-Language Briefings:** Outputs simultaneous tactical briefings in English and Devanagari Hindi.
* **Encrypted Dossier Export:** One-click export of structured mission intelligence JSON dossiers.
* **Edge Package Compilation:** Integrated trigger to export TensorRT/ONNX INT8 deployment bundles for NVIDIA Jetson hardware.

### Feature 2: High-Capacity Annotation Studio (`AnnotationTool.tsx`)
* **Labeling Modes:** Bounding Box, Polygon, Polyline, Keypoint, and Semantic Segmentation.
* **Multi-Sensor Support:** Optical satellite imagery, SAR radar intensity maps, and aerial drone captures.
* **Automated Pre-Labeling:** Integration with `OWL-ViT-Base-Patch32` and Grounding DINO via Python API (`POST /api/v1/prelabel/grounding-dino`).

### Feature 3: On-Device Multimodal AI (`SamyamLM-V1`)
* **Architecture:** 1.86B parameter multimodal model (1.4B Phi-2 + 454.45M CLIP ViT) running on local Ollama runtime.
* **Adaptive Prompting:** Supports document text extraction (OCR), scene descriptions, target queries, and conversational greetings.
* **Hardware Footprint:** VRAM consumption ~2.5 GB – 3.0 GB; runs smoothly on laptop NVIDIA RTX 4050/3060 GPUs.

### Feature 4: Cloud Ingestion & Monetization
* **Dataset Upload (`AwsS3Uploader.tsx`):** Multipart presigned S3 ingestion directly into `samyam-satellite-datasets` bucket.
* **Annotator Earnings & Payments (`IncomePayments.tsx`):** Razorpay checkout integration for dataset transactions and worker disbursements.
* **Audio Voice Agent:** Web voice agent backed by Supabase Edge Functions using `google/gemini-3-flash-preview`.

---

## 4. Operational & Performance Specifications

| Metric | Measured Benchmark in Code |
| :--- | :--- |
| **Model Disk Size** | ~1.7 GB (Q4_0 quantized) |
| **VRAM Consumption** | 2.5 GB – 3.0 GB on RTX 4050 Laptop GPU |
| **Local Inference Latency** | 300ms – 800ms per frame |
| **Context Length** | 2,048 Tokens |
| **FastAPI Backend URL** | `http://localhost:8000` |
| **Frontend Dev URL** | `http://localhost:8080` |
| **Ollama Local Engine** | `http://localhost:11434` |
