import { Shield, Satellite, Radar, Eye, Landmark, Building2, Cpu, ShieldCheck, Globe2, LucideIcon } from "lucide-react";
import modImg from "@/assets/gov/mod.jpg";
import isroImg from "@/assets/gov/isro.jpg";
import intelImg from "@/assets/gov/intel.jpg";
import borderImg from "@/assets/gov/border.jpg";
import governanceImg from "@/assets/gov/governance.jpg";
import psuImg from "@/assets/gov/psu.jpg";
import indiaaiImg from "@/assets/gov/indiaai.jpg";
import tevalImg from "@/assets/gov/teval.jpg";
import globalImg from "@/assets/gov/global.jpg";
import modPartners from "@/assets/gov/partners/mod.jpg";
import isroPartners from "@/assets/gov/partners/isro.jpg";
import intelPartners from "@/assets/gov/partners/intel.jpg";
import borderPartners from "@/assets/gov/partners/border.jpg";
import governancePartners from "@/assets/gov/partners/governance.jpg";
import psuPartners from "@/assets/gov/partners/psu.jpg";
import indiaaiPartners from "@/assets/gov/partners/indiaai.jpg";
import tevalPartners from "@/assets/gov/partners/teval.jpg";
import globalPartners from "@/assets/gov/partners/global.jpg";

export type GovernmentPage = {
  slug: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  image: string;
  partnerVisual: string;
  hero: { eyebrow: string; title: string; description: string };
  capabilities: { title: string; description: string }[];
  useCases: { title: string; description: string }[];
  partners: string[];
  stats: { value: string; label: string }[];
};

export const governmentPages: GovernmentPage[] = [
  {
    slug: "indian-defence-mod",
    label: "Indian Defence (MoD)",
    subtitle: "AI for Armed Forces & DRDO programs",
    icon: Shield,
    image: modImg,
    hero: {
      eyebrow: "Ministry of Defence",
      title: "Mission-ready AI for the Indian Armed Forces",
      description:
        "samyam partners with the Indian Army, Navy, Air Force and DRDO to operationalise data labeling, model evaluation and decision-support AI across tri-service programs.",
    },
    capabilities: [
      { title: "Tri-Service Data Labeling", description: "Annotate EO/IR, SAR, acoustic and signal data for combat platforms." },
      { title: "Model Evaluation & Red Teaming", description: "Stress-test mission AI against adversarial and edge-case scenarios." },
      { title: "Doctrine-Aware Copilots", description: "Secure LLM assistants trained on Indian defence doctrine and SOPs." },
      { title: "Edge Deployment Support", description: "Compress and ship models for ruggedised, disconnected operations." },
    ],
    useCases: [
      { title: "Target Recognition", description: "Multi-sensor object detection across land, sea and air theatres." },
      { title: "Logistics Optimisation", description: "AI-driven supply chain and readiness forecasting for formations." },
      { title: "Training & Simulation", description: "Synthetic data generation for wargaming and operator training." },
    ],
    partners: ["Indian Army", "Indian Navy", "Indian Air Force", "DRDO", "HQ IDS"],
    stats: [
      { value: "ITAR Aware", label: "Export-controlled workflows" },
      { value: "Air-gapped", label: "On-prem deployments" },
      { value: "24/7", label: "Mission support" },
    ],
  },
  {
    slug: "isro-space",
    label: "ISRO & Space",
    subtitle: "Satellite intelligence & mission analytics",
    icon: Satellite,
    image: isroImg,
    hero: {
      eyebrow: "ISRO & New Space",
      title: "AI for India's space missions",
      description:
        "From Cartosat and RISAT to Gaganyaan and Chandrayaan, samyam delivers labeling, anomaly detection and analytics for India's civil space program and the New Space ecosystem.",
    },
    capabilities: [
      { title: "Satellite Imagery Labeling", description: "Pixel-perfect annotation of optical, SAR and hyperspectral data." },
      { title: "Telemetry Anomaly Detection", description: "Detect spacecraft anomalies in real-time downlink streams." },
      { title: "Mission Planning Copilots", description: "AI assistants for orbital planning and ground-station ops." },
      { title: "Earth Observation Pipelines", description: "Automated change detection and land-use classification." },
    ],
    useCases: [
      { title: "Disaster Response", description: "Rapid mapping for floods, cyclones and earthquakes." },
      { title: "Crop & Forest Monitoring", description: "National-scale vegetation and yield analytics." },
      { title: "Launch Vehicle Telemetry", description: "Anomaly detection for PSLV, GSLV and SSLV missions." },
    ],
    partners: ["ISRO", "IN-SPACe", "NSIL", "Antrix", "Indian New Space Startups"],
    stats: [
      { value: "10M+", label: "Satellite tiles labeled" },
      { value: "Sub-meter", label: "Annotation precision" },
      { value: "Multi-sensor", label: "EO / SAR / Hyperspectral" },
    ],
  },
  {
    slug: "intelligence-security",
    label: "Intelligence & Security",
    subtitle: "ISR, GEOINT and threat detection",
    icon: Radar,
    image: intelImg,
    hero: {
      eyebrow: "Intelligence Community",
      title: "GEOINT and ISR analytics at national scale",
      description:
        "samyam supports India's intelligence community with secure, sovereign AI for geospatial intelligence, signals analysis and pattern-of-life detection.",
    },
    capabilities: [
      { title: "GEOINT Labeling", description: "Object, activity and facility annotation across global imagery." },
      { title: "Pattern-of-Life Models", description: "Detect anomalous behaviour across long-horizon sensor data." },
      { title: "Multi-INT Fusion", description: "Combine SIGINT, GEOINT and OSINT into unified analytics." },
      { title: "Sovereign LLMs", description: "On-prem language models for classified workflows." },
    ],
    useCases: [
      { title: "Facility Monitoring", description: "Track construction and activity at sites of interest." },
      { title: "Maritime Dark Targets", description: "Detect AIS-off vessels via SAR and EO fusion." },
      { title: "Threat Intelligence", description: "OSINT triage and entity resolution at scale." },
    ],
    partners: ["NTRO", "R&AW", "IB", "DIA", "NSCS"],
    stats: [
      { value: "Sovereign", label: "India-hosted infra" },
      { value: "Air-gapped", label: "Classified deployments" },
      { value: "Multi-INT", label: "Fusion ready" },
    ],
  },
  {
    slug: "border-maritime",
    label: "Border & Maritime",
    subtitle: "Surveillance for BSF, ITBP & Coast Guard",
    icon: Eye,
    image: borderImg,
    hero: {
      eyebrow: "Border & Coastal Security",
      title: "Persistent surveillance for India's frontiers",
      description:
        "samyam delivers AI for border guarding forces and the Indian Coast Guard — fusing drones, radars, cameras and satellites into a single operating picture.",
    },
    capabilities: [
      { title: "Drone & UAV Analytics", description: "Real-time detection on tactical and MALE UAV feeds." },
      { title: "Radar & EO Fusion", description: "Cross-sensor tracking along LoC, LAC and EEZ." },
      { title: "Vessel Classification", description: "Automated AIS + SAR vessel identification." },
      { title: "Intrusion Detection", description: "Edge AI on smart fencing and CCTV grids." },
    ],
    useCases: [
      { title: "LoC / LAC Surveillance", description: "24/7 monitoring across high-altitude terrain." },
      { title: "Coastal EEZ Patrols", description: "Detect illegal fishing, smuggling and dark vessels." },
      { title: "Smart Border Fencing", description: "AI alerts for intrusion and tunneling activity." },
    ],
    partners: ["BSF", "ITBP", "SSB", "Indian Coast Guard", "Assam Rifles"],
    stats: [
      { value: "15K km", label: "Border coverage potential" },
      { value: "Edge-ready", label: "Disconnected ops" },
      { value: "Multi-sensor", label: "Drone / Radar / EO" },
    ],
  },
  {
    slug: "smart-governance",
    label: "Smart Governance",
    subtitle: "AI for ministries & public services",
    icon: Landmark,
    image: governanceImg,
    hero: {
      eyebrow: "Digital India",
      title: "AI for ministries and citizen services",
      description:
        "samyam helps central and state ministries deploy responsible AI for citizen services, scheme delivery and public-sector productivity — aligned with Digital India.",
    },
    capabilities: [
      { title: "Document Digitisation", description: "OCR and structured extraction for legacy government records." },
      { title: "Multilingual Citizen Bots", description: "Voice and chat agents in 22 Indian languages." },
      { title: "Scheme Targeting", description: "AI-driven beneficiary identification and fraud detection." },
      { title: "Policy Analytics", description: "Evidence-based dashboards for ministries." },
    ],
    useCases: [
      { title: "Tax & Revenue", description: "Anomaly detection in GST and direct tax filings." },
      { title: "Health & Welfare", description: "Outreach for Ayushman Bharat and PMJAY." },
      { title: "Urban Governance", description: "Smart City analytics for traffic, waste and safety." },
    ],
    partners: ["MeitY", "NIC", "Smart Cities Mission", "State Governments", "UIDAI"],
    stats: [
      { value: "22", label: "Indian languages supported" },
      { value: "DPDP", label: "Compliant by design" },
      { value: "MeitY", label: "Empanelled cloud ready" },
    ],
  },
  {
    slug: "psu-strategic",
    label: "PSU & Strategic Sector",
    subtitle: "AI for HAL, BEL, ISRO partners",
    icon: Building2,
    image: psuImg,
    hero: {
      eyebrow: "Defence PSUs & Strategic Industry",
      title: "AI for India's strategic manufacturers",
      description:
        "samyam works with defence PSUs, OFB successors and strategic-sector companies to embed AI in design, manufacturing and through-life support.",
    },
    capabilities: [
      { title: "Manufacturing QC", description: "Computer vision for defects on platforms and components." },
      { title: "Predictive Maintenance", description: "Forecast component failure across fleets and lines." },
      { title: "Engineering Copilots", description: "LLM assistants for CAD, requirements and compliance." },
      { title: "Supply-Chain Risk", description: "Detect single-point dependencies and disruptions." },
    ],
    useCases: [
      { title: "Aerospace MRO", description: "Visual inspection for HAL and partner overhauls." },
      { title: "Electronics Production", description: "Yield optimisation across BEL & BDL lines." },
      { title: "Shipyard Operations", description: "Schedule and quality analytics for naval builds." },
    ],
    partners: ["HAL", "BEL", "BDL", "BEML", "MDL", "GRSE", "MIDHANI"],
    stats: [
      { value: "Make in India", label: "Indigenisation aligned" },
      { value: "ISO", label: "Quality processes" },
      { value: "On-prem", label: "Factory deployments" },
    ],
  },
  {
    slug: "indiaai-mission",
    label: "IndiaAI Mission Aligned",
    subtitle: "Sovereign AI infrastructure & datasets",
    icon: Cpu,
    image: indiaaiImg,
    hero: {
      eyebrow: "IndiaAI Mission",
      title: "Building blocks for Sovereign AI",
      description:
        "samyam contributes to the IndiaAI Mission with high-quality Indic datasets, foundational model evaluation and sovereign deployment tooling.",
    },
    capabilities: [
      { title: "Indic Dataset Curation", description: "Multilingual, multimodal datasets across 22 languages." },
      { title: "Foundation Model Evaluation", description: "Benchmark Indic LLMs on safety, bias and capability." },
      { title: "Sovereign Inference Stack", description: "Deploy open models on India-located GPU clusters." },
      { title: "Responsible AI Tooling", description: "Bias, toxicity and provenance auditing." },
    ],
    useCases: [
      { title: "Indic LLM Training", description: "Pre-training and instruction data for Indian languages." },
      { title: "Evaluation Benchmarks", description: "Public leaderboards for Indic model capability." },
      { title: "Compute Marketplace", description: "Dataset and eval support for IndiaAI compute users." },
    ],
    partners: ["IndiaAI", "MeitY", "C-DAC", "Indian Academia", "Open-Source Community"],
    stats: [
      { value: "22", label: "Indic languages" },
      { value: "Open", label: "Datasets & evals" },
      { value: "Sovereign", label: "India-hosted" },
    ],
  },
  {
    slug: "test-eval-assurance",
    label: "Test, Eval & Assurance",
    subtitle: "Red-team & evaluate mission-critical AI",
    icon: ShieldCheck,
    image: tevalImg,
    hero: {
      eyebrow: "T&E and AI Assurance",
      title: "Trust your mission-critical AI",
      description:
        "samyam provides independent test, evaluation and red-teaming for AI systems used in defence, intelligence and critical public-sector workflows.",
    },
    capabilities: [
      { title: "Adversarial Red Teaming", description: "Probe models for jailbreaks, prompt injection and misuse." },
      { title: "Robustness Testing", description: "Stress-test under noise, drift and adversarial inputs." },
      { title: "Bias & Safety Audits", description: "Quantitative audits aligned to Indian context." },
      { title: "Operational Eval", description: "Field-realistic evaluation harnesses." },
    ],
    useCases: [
      { title: "LLM Assurance", description: "Pre-deployment audits for ministry copilots." },
      { title: "Vision System V&V", description: "Evaluate ISR and surveillance models." },
      { title: "Autonomy Safety Cases", description: "Evidence packages for autonomous platforms." },
    ],
    partners: ["MoD T&E Establishments", "DRDO Labs", "CERT-In", "Standards Bodies"],
    stats: [
      { value: "Independent", label: "Third-party assurance" },
      { value: "Repeatable", label: "Versioned evals" },
      { value: "Standards", label: "Aligned methodology" },
    ],
  },
  {
    slug: "global-public-sector",
    label: "Global Public Sector",
    subtitle: "Allied programs & coalition partners",
    icon: Globe2,
    image: globalImg,
    hero: {
      eyebrow: "Allied & Coalition",
      title: "AI for allied public-sector programs",
      description:
        "samyam supports allied governments and coalition partners with interoperable AI that respects sovereignty, export controls and shared mission objectives.",
    },
    capabilities: [
      { title: "Coalition Data Sharing", description: "Federated labeling across partner nations." },
      { title: "Interoperable Models", description: "STANAG-aware data and model formats." },
      { title: "Export-Controlled Workflows", description: "ITAR-aware data handling and access." },
      { title: "Joint Exercises", description: "Synthetic data and eval for combined ops." },
    ],
    useCases: [
      { title: "QUAD & I2U2", description: "Shared maritime and ISR analytics." },
      { title: "Humanitarian Response", description: "Multi-nation disaster mapping." },
      { title: "Capacity Building", description: "Training partner-nation AI teams." },
    ],
    partners: ["Allied MoDs", "Coalition Space Agencies", "Friendly Foreign Governments"],
    stats: [
      { value: "ITAR Aware", label: "Export controls" },
      { value: "Federated", label: "Sovereign-respecting" },
      { value: "Interoperable", label: "Standards-based" },
    ],
  },
];

export const getGovernmentPage = (slug: string) =>
  governmentPages.find((p) => p.slug === slug);
