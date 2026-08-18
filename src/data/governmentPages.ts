import {
  Shield,
  Satellite,
  Radar,
  Eye,
  Landmark,
  Building2,
  Cpu,
  ShieldCheck,
  Globe2,
  LucideIcon,
  Crosshair,
  Rocket,
  Radio,
  Lock,
  Compass,
  FileText,
  CheckCircle,
  Brain,
  Database,
  Sparkles,
  FileCheck,
  Share2,
  Users,
  Activity,
  Award,
} from "lucide-react";

import agenticDefenseImg from "@/assets/agentic-defense.jpg";
import agenticEnterpriseImg from "@/assets/agentic-enterprise.jpg";
import caseDebrisImg from "@/assets/case-debris-tracking.jpg";
import caseLabeledImg from "@/assets/case-labeled-images.jpg";
import caseSatelliteImg from "@/assets/case-satellite-monitoring.jpg";
import earthMapImg from "@/assets/earth-map.jpg";
import heroOrbImg from "@/assets/hero-orb.jpg";

import isroLogo from "@/assets/logos/isro.png";
import nasaLogo from "@/assets/logos/nasa.png";
import esaLogo from "@/assets/logos/esa.png";
import spacexLogo from "@/assets/logos/spacex.png";
import boeingLogo from "@/assets/logos/boeing.png";
import lockheedLogo from "@/assets/logos/lockheed.svg";
import northropLogo from "@/assets/logos/northrop.svg";
import blueOriginLogo from "@/assets/logos/blueorigin.svg";
import planetLabsLogo from "@/assets/logos/planetlabs.svg";
import usgsLogo from "@/assets/logos/usgs.png";

export type GovernmentPartner = {
  name: string;
  logo: string;
  icon: LucideIcon;
};

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
  partners: GovernmentPartner[];
  stats: { value: string; label: string }[];
};

export const governmentPages: GovernmentPage[] = [
  {
    slug: "indian-defence-mod",
    label: "Indian Defence (MoD)",
    subtitle: "AI for Armed Forces & DRDO programs",
    icon: Shield,
    image: agenticDefenseImg,
    partnerVisual: agenticDefenseImg,
    hero: {
      eyebrow: "Ministry of Defence",
      title: "Mission-ready AI for the Indian Armed Forces",
      description:
        "Samyam partners with the Indian Army, Navy, Air Force and DRDO to operationalise data labeling, model evaluation and decision-support AI across tri-service programs.",
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
      { title: "Training & Simulation", description: "High-fidelity sensor training for wargaming and operator readiness." },
    ],
    partners: [
      { name: "DRDO", logo: "", icon: Shield },
      { name: "Indian Army", logo: "", icon: Crosshair },
      { name: "Indian Navy", logo: "", icon: Compass },
      { name: "Indian Air Force", logo: "", icon: Rocket },
      { name: "HQ IDS", logo: "", icon: Award },
    ],
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
    image: caseSatelliteImg,
    partnerVisual: caseSatelliteImg,
    hero: {
      eyebrow: "ISRO & New Space",
      title: "AI for India's space missions",
      description:
        "From Cartosat and RISAT to Gaganyaan and Chandrayaan, Samyam delivers labeling, anomaly detection and analytics for India's civil space program and the New Space ecosystem.",
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
    partners: [
      { name: "ISRO", logo: isroLogo, icon: Satellite },
      { name: "IN-SPACe", logo: "", icon: Rocket },
      { name: "NSIL", logo: "", icon: Radio },
      { name: "NASA", logo: nasaLogo, icon: Globe2 },
      { name: "ESA", logo: esaLogo, icon: Sparkles },
    ],
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
    image: caseDebrisImg,
    partnerVisual: caseDebrisImg,
    hero: {
      eyebrow: "Intelligence Community",
      title: "GEOINT and ISR analytics at national scale",
      description:
        "Samyam supports India's intelligence community with secure, sovereign AI for geospatial intelligence, signals analysis and pattern-of-life detection.",
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
    partners: [
      { name: "NTRO", logo: "", icon: Radar },
      { name: "R&AW", logo: "", icon: Eye },
      { name: "IB", logo: "", icon: Lock },
      { name: "DIA", logo: "", icon: ShieldCheck },
      { name: "NSCS", logo: "", icon: Landmark },
    ],
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
    image: earthMapImg,
    partnerVisual: earthMapImg,
    hero: {
      eyebrow: "Border & Coastal Security",
      title: "Persistent surveillance for India's frontiers",
      description:
        "Samyam delivers AI for border guarding forces and the Indian Coast Guard — fusing drones, radars, cameras and satellites into a single operating picture.",
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
    partners: [
      { name: "BSF", logo: "", icon: Eye },
      { name: "ITBP", logo: "", icon: Compass },
      { name: "SSB", logo: "", icon: Shield },
      { name: "Indian Coast Guard", logo: "", icon: Globe2 },
      { name: "Assam Rifles", logo: "", icon: Crosshair },
    ],
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
    image: caseLabeledImg,
    partnerVisual: caseLabeledImg,
    hero: {
      eyebrow: "Digital India",
      title: "AI for ministries and citizen services",
      description:
        "Samyam helps central and state ministries deploy responsible AI for citizen services, scheme delivery and public-sector productivity — aligned with Digital India.",
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
    partners: [
      { name: "MeitY", logo: "", icon: Landmark },
      { name: "NIC", logo: "", icon: FileText },
      { name: "Smart Cities", logo: "", icon: Building2 },
      { name: "UIDAI", logo: "", icon: CheckCircle },
    ],
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
    image: agenticEnterpriseImg,
    partnerVisual: agenticEnterpriseImg,
    hero: {
      eyebrow: "Defence PSUs & Strategic Industry",
      title: "AI for India's strategic manufacturers",
      description:
        "Samyam works with defence PSUs, OFB successors and strategic-sector companies to embed AI in design, manufacturing and through-life support.",
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
    partners: [
      { name: "HAL", logo: "", icon: Rocket },
      { name: "BEL", logo: "", icon: Cpu },
      { name: "BDL", logo: "", icon: Crosshair },
      { name: "BEML", logo: "", icon: Building2 },
      { name: "MDL", logo: "", icon: Compass },
    ],
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
    image: heroOrbImg,
    partnerVisual: heroOrbImg,
    hero: {
      eyebrow: "IndiaAI Mission",
      title: "Building blocks for Sovereign AI",
      description:
        "Samyam contributes to the IndiaAI Mission with high-quality Indic datasets, foundational model evaluation and sovereign deployment tooling.",
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
    partners: [
      { name: "IndiaAI", logo: "", icon: Cpu },
      { name: "MeitY", logo: "", icon: Brain },
      { name: "C-DAC", logo: "", icon: Database },
      { name: "IIT Madras", logo: "", icon: Sparkles },
    ],
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
    image: agenticDefenseImg,
    partnerVisual: agenticDefenseImg,
    hero: {
      eyebrow: "T&E and AI Assurance",
      title: "Trust your mission-critical AI",
      description:
        "Samyam provides independent test, evaluation and red-teaming for AI systems used in defence, intelligence and critical public-sector workflows.",
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
    partners: [
      { name: "MoD T&E", logo: "", icon: ShieldCheck },
      { name: "DRDO Labs", logo: "", icon: FileCheck },
      { name: "CERT-In", logo: "", icon: Lock },
      { name: "Standards Bodies", logo: "", icon: Activity },
    ],
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
    image: earthMapImg,
    partnerVisual: earthMapImg,
    hero: {
      eyebrow: "Allied & Coalition",
      title: "AI for allied public-sector programs",
      description:
        "Samyam supports allied governments and coalition partners with interoperable AI that respects sovereignty, export controls and shared mission objectives.",
    },
    capabilities: [
      { title: "Coalition Data Sharing", description: "Federated labeling across partner nations." },
      { title: "Interoperable Models", description: "STANAG-aware data and model formats." },
      { title: "Export-Controlled Workflows", description: "ITAR-aware data handling and access." },
      { title: "Joint Exercises", description: "Cross-platform analytics for combined operations." },
    ],
    useCases: [
      { title: "QUAD & I2U2", description: "Shared maritime and ISR analytics." },
      { title: "Humanitarian Response", description: "Multi-nation disaster mapping." },
      { title: "Capacity Building", description: "Training partner-nation AI teams." },
    ],
    partners: [
      { name: "ISRO Space Program", logo: isroLogo, icon: Globe2 },
      { name: "NASA Earth Science", logo: nasaLogo, icon: Satellite },
      { name: "ESA Earth Observation", logo: esaLogo, icon: Sparkles },
      { name: "USGS Geospatial Surveys", logo: usgsLogo, icon: Compass },
    ],
    stats: [
      { value: "ITAR Aware", label: "Export controls" },
      { value: "Federated", label: "Sovereign-respecting" },
      { value: "Interoperable", label: "Standards-based" },
    ],
  },
];

export const getGovernmentPage = (slug: string) =>
  governmentPages.find((p) => p.slug === slug);
