<div align="center">

# 🌍 SamyamLM

## Satellite-Based Multimodal Data Labeling for Indian Language AI

**Scale AI for India — 59% faster, 100% native Hindi support**

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Made in India](https://img.shields.io/badge/Made_in-India-orange.svg)](https://www.makeinindia.com)
[![Python 3.9+](https://img.shields.io/badge/Python-3.9+-blue.svg)](https://www.python.org)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-red.svg)](https://pytorch.org)
[![Live Demo](https://img.shields.io/badge/Demo-Live-brightgreen)](https://samyam-space-labels.vercel.app/annotate/demo)
[![HuggingFace](https://img.shields.io/badge/HuggingFace-techindro-yellow)](https://huggingface.co/techindro)
[![Website](https://img.shields.io/badge/Website-Live-blue)](https://samyam-space-labels.vercel.app)

</div>

---

## 🌐 Platform Overview

> *"Building AI for space & defense — Breakthrough AI for Space & Beyond"*

Samyam provides high-quality data labeling, model evaluation, and AI tools designed for space agencies, defense teams, and enterprises working on next-generation applications.

---

## 🚀 Live Demos

Experience our AI models in action. All demos run live or on Hugging Face Spaces — no installation required.

| Demo | Description | Link |
|------|-------------|------|
| 🏷️ Multimodal Labeling Workspace | Interactive 2D Vision, Audio, Video, RLHF & SAR Radar Annotator | [Open Annotation Workspace](https://samyam-space-labels.vercel.app/annotate) |
| 🛣️ Indian Road Detector | AI-powered road detection & segmentation for Indian road infrastructure | [Try Now](https://huggingface.co/spaces/techindro/SamyamLm-Demo) |
| 🚗 Self Driving Car | Real-time object detection and lane segmentation for autonomous vehicles | [Try Now](https://huggingface.co/spaces/techindro/SamyamLm-SelfDriving) |
| 🏥 Health Detector | Medical imaging analysis and diagnostic AI for healthcare applications | [Try Now](https://huggingface.co/spaces/techindro/SamyamLm-Health) |
| 📚 Education Detector | Content analysis and educational material classification using NLP & vision | [Try Now](https://huggingface.co/spaces/techindro/SamyamLm-Education) |

🌐 Website: [samyam-space-labels.vercel.app](https://samyam-space-labels.vercel.app)

---

## ⚡ 1-Line Terminal Quickstart (Laptop / PC)

Single terminal commands to clone, configure, install dependencies, and launch SamyamLM on your laptop instantly:

### 🪟 Windows (PowerShell)
```powershell
iwr -useb https://raw.githubusercontent.com/samyam-ai/SamyamLM/main/scripts/quickstart.ps1 | iex
```

### 🍏 macOS / 🐧 Linux / 💻 Git Bash
```bash
curl -fsSL https://raw.githubusercontent.com/samyam-ai/SamyamLM/main/scripts/quickstart.sh | bash
```

### 🛠️ Interactive SamyamLM CLI (Existing Local Clone)
```bash
# Diagnostic check on system tools & environment
npm run doctor

# Quickstart launcher & dev server
npm run samyamlm
# OR via npx
npx samyamlm
```

---

## 📖 What is SamyamLM?

SamyamLM is a **breakthrough AI platform for space, defense, and enterprise** — purpose-built for Indian languages and Indian geography. It helps create training data for AI models using satellite images, road cameras, and Hindi text.

### The Name

- **Samyam** (संयम) = Discipline and control in Sanskrit
- **LM** = Language Model

So SamyamLM means disciplined, high-quality data labeling for AI systems in India.

### What Problem Does It Solve?

Most AI labeling companies like Scale AI, Labelbox, and Appen were built for Western countries. They don't work well for India because:

1. They don't support Hindi or other Indian scripts
2. They don't understand Indian road conditions (auto-rickshaws, cattle, potholes)
3. They can't process satellite images of Indian geography
4. They fail in Indian weather (monsoon, dust, night driving)

**The result:** AI models that work perfectly in San Francisco but fail in Mumbai, Delhi, and Chennai.

### How Does SamyamLM Work?

The platform has six parts that work together:

| Part | What It Does |
|------|---------------|
| 🛰️ Satellite Imagery | Takes pictures from ISRO satellites (5m to 30m resolution) |
| 📷 Ground Cameras | Records video from cameras on Indian roads |
| 📝 Hindi Text | Reads and understands Hindi language inputs |
| 🤖 AI Pre-labeling | Does 58% of the work automatically using AI models |
| 👨‍💻 Human Review | Lets people check and fix labels using Hindi keyboard |
| ✅ Quality Check | Runs 3 tests to ensure labels are correct |

---

## 📊 Key Results at a Glance

| Metric | SamyamLM | Industry Average | Improvement |
|--------|----------|------------------|-------------|
| Annotation Throughput | 510 labels/hour | 320 labels/hour | **+59%** |
| Hindi VQA Accuracy | 67.4% | 51.8% | **+15.6%** |
| India-Specific Object Detection | 58.3% mAP | 38.6% mAP | **+19.7%** |
| Cost per Label | $0.12 | $0.29 | **-58%** |

---

## 🎯 The Problem

**Global AI training data ignores 1.4 billion Indian voices.**

Existing platforms like Scale AI, Labelbox, and Appen were built for Western markets:

| Limitation | Consequence |
|------------|-------------|
| No Indic script support | Cannot annotate in Hindi, Tamil, Telugu, Bengali |
| No Indian semantic understanding | Models fail on cultural context |
| No satellite geospatial integration | Disaster response AI is blind |
| No Indian road objects | Self-driving cars miss auto-rickshaws and cattle |

---

## 🚀 The Solution

SamyamLM is the first data labeling platform purpose-built for India's linguistic and geographic diversity.

### Comparison with Existing Platforms

| Feature | Scale AI | Labelbox | Appen | SamyamLM |
|---------|----------|----------|-------|----------|
| Hindi Language Support | ❌ | ❌ | Partial | ✅ Native |
| Devanagari Script UI | ❌ | ❌ | ❌ | ✅ Yes |
| Satellite Imagery Input | ❌ | ❌ | ❌ | ✅ Yes |
| India-Specific Objects | ❌ | ❌ | ❌ | ✅ 47 classes |
| Indian Road Conditions | ❌ | ❌ | ❌ | ✅ Yes |
| Adverse Weather (Monsoon) | ❌ | ❌ | ❌ | ✅ Yes |
| Cost per Label | $0.29 | $0.27 | $0.25 | $0.12 |

---

### 🔄 Human-in-the-Loop (HITL) & Active Learning

SamyamLM doesn't just use static AI models. It employs a continuous learning pipeline to get smarter with every annotation:

- **Model-Assisted Labeling (MAL):** Our Active Learning pipeline continuously retrains the model in the background as humans correct its mistakes, making the pre-labeling smarter over time.
- **Similarity Search / Hard Example Mining:** Leverage vector embeddings to find edge cases. Users can query, *"Find me all images in my dataset that look similar to this one where the model failed,"* accelerating the curation of difficult datasets.

---

### 🎨 Advanced Annotation Capabilities

SamyamLM supports complex data formats required for cutting-edge AI:
- **3D Point Cloud / LiDAR Labeling:** Critical for autonomous vehicle datasets, support for drawing cuboids directly on LiDAR point clouds.
- **Polygon & Keypoint Interpolation:** For video annotation, draw a polygon on frame 1 and frame 10, and the platform automatically interpolates the shape for frames 2-9.
- **NER (Named Entity Recognition):** Advanced text annotation tools for highlighting and linking specific entities in Hindi text.

### 👥 Workforce & Project Management

Managing large-scale annotation teams requires robust tooling:
- **Role-Based Access Control (RBAC):** Distinct permissions for Annotators, Reviewers, Project Managers, and Admins to ensure data integrity.
- **Annotator Analytics:** Track the performance of individual labelers, monitoring metrics like average time per label, accuracy, and rejection rates.
- **Task Assignment & Queues:** Automatically distribute batches of data to available annotators and manage complex task states (Pending, In Progress, Review, Completed).

### ✅ Advanced Quality Assurance (QA) Workflows

In high-stakes environments like defense and self-driving, robust QA is essential:
- **Consensus Scoring:** Automatically assign the same data to multiple annotators. If their labels (IoU) match, it's approved; if they disagree, it's flagged for a senior reviewer.
- **Gold Standard (Honeypot) Tasks:** Randomly insert pre-labeled "perfect" examples into an annotator's queue to constantly measure and maintain their accuracy score.

### 🗂️ Ontology & Taxonomy Management

- **Hierarchical Classes:** Go beyond flat lists with strict ontologies (e.g., `Vehicle -> Four-Wheeler -> Commercial -> Truck`).
- **Dynamic Attributes:** Conditional UI menus (e.g., selecting "Traffic Light" automatically prompts for `State: [Red, Yellow, Green]`).

### 📊 Data Diagnostics & Debugging

- **Class Imbalance Dashboard:** Visual graphs showing if your dataset is biased (e.g., lacking enough examples of auto-rickshaws or night driving).
- **Model Error Analysis:** Dedicated views to see exactly where the AI pre-labeling model was most confused, guiding data collection strategies.

### 🏢 Enterprise Integrations & Data Management

- **Cloud Storage Integrations:** Connect your AWS S3, Google Cloud Storage (GCS), or Azure Blob buckets directly without manually uploading files.
- **Webhooks & API-First Design:** Programmatically trigger labeling jobs via API when new data hits your servers, and receive webhooks upon approval.
- **Dataset Versioning:** Save "Version 1.0" of a dataset, make corrections, and branch off "Version 1.1" without losing history.

### 🔒 Security & Compliance (Defense & Govt)

Built for classified and sensitive workloads:
- **Data Anonymization Pipeline:** Automatically blur faces and license plates in ground camera footage *before* human annotators see it (GDPR/privacy compliant).
- **Air-Gapped / On-Premise Deployment:** We provide a dedicated `docker-compose.onprem.yml` that replaces cloud dependencies with local PostgreSQL and MinIO. Deploy entirely on your own isolated servers. 

**To run the air-gapped on-premise version:**
```bash
docker-compose -f docker-compose.onprem.yml up --build
```

---

## 🛰️ Space Tech & Defense

SamyamLM extends beyond roads and language — it is built to power **next-generation space and defense AI**.

### Breakthrough AI for Space & Beyond

Samyam provides high-quality data labeling, model evaluation, and AI tools designed for:
- Space agencies (ISRO and allied partners)
- Defense teams and armed forces
- Enterprises working on next-generation applications

### Generative AI Data Engine

Samyam's Generative AI Data Engine powers advanced LLMs and generative models through world-class:

| Capability | Description |
|------------|-------------|
| **Generation** | After initial pre-training, create complex prompt-response pairs from scratch |
| **RLHF** | Apply human preferences to model outputs for alignment |
| **Red Teaming** | Use prompt injection techniques to uncover model vulnerabilities |
| **Model Evaluation** | Evaluate model against complex and diverse prompts |
| **SFT** | Supervised fine-tuning — learn from demonstrated behavior |

The full pipeline: `Pre-Training → SFT → RLHF → Deployment`, with Red Teaming and Model Evaluation running in parallel.

### Samyam Data Engine

> *Collect, curate, and annotate data. Train models and evaluate. Repeat.*

The Data Engine follows a continuous loop:

```
Raw Data → Curate → Evaluate / Annotate → HQ Data
```

This loop ensures consistently high-quality labeled data for every training cycle.

---

## 🏛️ Government & Defense Programs

SamyamLM supports government agencies and defense organizations across India and allied nations.

### AI for Allied Public-Sector Programs

Samyam supports allied governments and coalition partners with **interoperable AI** that respects:
- Sovereignty and data security
- Export controls (ITAR Aware)
- Shared mission objectives

### Indian Government Programs

| Program | Focus |
|---------|-------|
| 🛡️ **Indian Defence (MoD)** | AI for Armed Forces & DRDO programs |
| 🛰️ **ISRO & Space** | Satellite intelligence & mission analytics |
| 🔍 **Intelligence & Security** | ISR, GEOINT and threat detection |
| 🌊 **Border & Maritime** | Surveillance for BSF, ITBP & Coast Guard |

---

## 🧠 AI Knowledge Hub

Samyam is building **"The AI Knowledge Hub"** — exploring core pillars of modern AI and how Samyam applies each discipline to solve critical space, defense, and enterprise challenges.

### Core AI Disciplines

**Generative AI** — *Create. Synthesize. Transform.*
> Generative AI models produce new data — images, text, code, and synthetic satellite imagery — by learning patterns from massive datasets. Samyam leverages generative models to augment sparse training data, simulate orbital scenarios, and accelerate mission readiness.
- Synthetic satellite image generation for training
- Automated report & briefing generation
- Scenario simulation for mission planning

**Agentic AI** — *Autonomous. Adaptive. Decisive.*
> Agentic AI systems act independently — planning, reasoning, and executing multi-step tasks without constant human oversight. Samyam deploys agentic workflows for autonomous threat detection, real-time orbital decision-making, and adaptive mission control.
- Autonomous space debris threat response
- Multi-step mission planning agents
- Self-healing sensor monitoring pipelines

---

## 📊 Benchmark Results

### Hindi Visual Question Answering (IndicVQA Benchmark)

| Model | Accuracy |
|-------|----------|
| SamyamLM-VL (ours) | **67.4%** |
| MuRIL-VL | 51.8% |
| Flamingo-9B | 34.1% |
| CLIP (zero-shot) | 28.7% |

**SamyamLM improvement: +15.6% over best baseline**

### Indian Road Object Detection (mAP@0.5)

| Model | mAP |
|-------|-----|
| SamyamLM fine-tuned (ours) | **58.3%** |
| Scale AI fine-tuned | 38.6% |
| YOLOv8 (COCO) | 31.2% |

**SamyamLM improvement: +19.7% over Scale AI on India-specific classes**

### Annotation Throughput (labels per hour)

| Platform | Labels/Hour |
|----------|-------------|
| SamyamLM (ours) | **510** |
| Scale AI | 320 |
| Labelbox | 280 |
| Appen | 260 |

**SamyamLM advantage: 59% faster than Scale AI**

---

## 🛰️ India-Specific Object Classes (47)

SamyamLM detects objects that other platforms completely miss:

| Category | Examples |
|----------|----------|
| **Vehicles** | Auto-rickshaw (ऑटो-रिक्शा), Cycle-rickshaw (साइकिल-रिक्शा), Tractor (ट्रैक्टर), Tempo (टेंपो), Bullock cart (बैलगाड़ी) |
| **Animals** | Cattle (मवेशी), Stray dog (आवारा कुत्ता), Buffalo (भैंस), Camel (ऊंट), Elephant (हाथी) |
| **Road Conditions** | Kutcha road (कच्ची सड़क), Pothole (गड्ढा), Speed breaker (स्पीड ब्रेकर), Missing signage (गायब साइनेज) |
| **Adverse Weather** | Monsoon rain (मानसून बारिश), Dust haze (धूल भरी आंधी), Night driving (रात में ड्राइविंग), Dense fog (घना कोहरा) |

---

## 📁 Dataset v1.0 Statistics

| Split | Modality | Samples | Annotated Labels |
|-------|----------|---------|------------------|
| Train | Satellite | 120,000 | 1,840,000 |
| Val | Satellite | 15,000 | 230,000 |
| Train | Ground Driving | 80,000 | 2,100,000 |
| Val | Ground Driving | 10,000 | 260,000 |
| Train | Hindi VQA | 45,000 | 90,000 |
| Val | Hindi VQA | 5,000 | 10,000 |
| **Total** | **All** | **275,000** | **4,530,000** |

---

## 🏗️ Technology Stack

| Layer | Technologies |
|-------|--------------|
| Vision-Language Model | CLIP (ViT-B/32), Fine-tuned checkpoint |
| Deep Learning | PyTorch 2.0+, HuggingFace Transformers |
| Geospatial | GDAL, Rasterio, ISRO Resourcesat-2A API |
| Backend | Supabase, PostgreSQL, Edge Functions |
| Frontend | React, TypeScript, Tailwind CSS, Vite |
| Infrastructure | Vercel, AWS S3 |

---

## 🔮 What's Next?

- Support for all 22 Indian languages
- Real-time satellite data processing
- Enterprise API suite for developer integration
- Expansion to emerging global regions
- Deeper integration with ISRO mission analytics
- Expansion of Agentic AI workflows for defense applications

---

## 📜 License

MIT — Free to use, modify, and distribute.

---

## 🤝 Contributing

PRs welcome! Let's Build the future of Bharat 🇮🇳
