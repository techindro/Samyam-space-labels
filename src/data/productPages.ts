import {
  Database,
  Gauge,
  Scale,
  Briefcase,
  Satellite,
  Radar,
  Target,
  ShieldAlert,
  type LucideIcon,
} from "lucide-react";

export type ProductColumn = {
  key: string;
  label: string;
  format?: "number" | "score" | "array" | "badge" | "boolean";
};

export type ProductPage = {
  slug: string;
  label: string;
  subtitle: string;
  icon: LucideIcon;
  badge?: string;
  table:
    | "datasets"
    | "evaluation_runs"
    | "preference_votes"
    | "demo_requests"
    | "geospatial_labels"
    | "sensor_fusion_datasets"
    | "mission_sim_runs"
    | "red_team_probes";
  metricLabel: string;
  image: string;
  hero: { eyebrow: string; title: string; description: string };
  primaryColumn: string;
  columns: ProductColumn[];
  orderBy: string;
};

export const productPages: ProductPage[] = [
  {
    slug: "data-engine",
    label: "Data Engine",
    subtitle: "Annotation-ready datasets with reviewer workflows",
    icon: Database,
    table: "datasets",
    metricLabel: "datasets",
    image:
      "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1600&q=70",
    hero: {
      eyebrow: "Product · Data Engine",
      title: "Build, version, and curate mission datasets",
      description:
        "The backbone of every samyam model — version-controlled datasets with reviewer workflows, quality scoring, and audit-grade history.",
    },
    primaryColumn: "name",
    orderBy: "created_at",
    columns: [
      { key: "domain", label: "Domain" },
      { key: "item_count", label: "Items", format: "number" },
      { key: "status", label: "Status", format: "badge" },
    ],
  },
  {
    slug: "model-evaluation",
    label: "Model Evaluation",
    subtitle: "Reproducible benchmarks with regression alerts",
    icon: Gauge,
    table: "evaluation_runs",
    metricLabel: "evaluation runs",
    image:
      "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1600&q=70",
    hero: {
      eyebrow: "Product · Model Evaluation",
      title: "Benchmark foundation and fine-tuned models",
      description:
        "Reproducible evaluation runs across providers with full metric history, regression alerts, and exportable audit trails.",
    },
    primaryColumn: "model_name",
    orderBy: "created_at",
    columns: [
      { key: "provider", label: "Provider" },
      { key: "benchmark", label: "Benchmark" },
      { key: "score", label: "Score", format: "score" },
      { key: "status", label: "Status", format: "badge" },
    ],
  },
  {
    slug: "rlhf-preferences",
    label: "RLHF & Preferences",
    subtitle: "Pairwise human preferences at scale",
    icon: Scale,
    table: "preference_votes",
    metricLabel: "preference votes",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=1600&q=70",
    hero: {
      eyebrow: "Product · RLHF & Preferences",
      title: "Align models with expert pairwise judgment",
      description:
        "Collect pairwise human preferences at scale to align models for mission-critical accuracy, safety, and tone.",
    },
    primaryColumn: "prompt",
    orderBy: "created_at",
    columns: [
      { key: "model_a", label: "Model A" },
      { key: "model_b", label: "Model B" },
      { key: "winner", label: "Winner", format: "badge" },
    ],
  },
  {
    slug: "enterprise-pipeline",
    label: "Enterprise Pipeline",
    subtitle: "Qualified demo requests, tagged and tracked",
    icon: Briefcase,
    table: "demo_requests",
    metricLabel: "demo requests",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=70",
    hero: {
      eyebrow: "Product · Enterprise Pipeline",
      title: "From inbound interest to admin handoff",
      description:
        "Qualified demo requests flow into a tracked pipeline — interest tagging, status, and admin handoff for the GTM team.",
    },
    primaryColumn: "company",
    orderBy: "created_at",
    columns: [
      { key: "interest", label: "Interest" },
      { key: "status", label: "Status", format: "badge" },
    ],
  },
  {
    slug: "geospatial-labeling",
    label: "Geospatial Labeling",
    subtitle: "EO / SAR / IR imagery at sub-pixel precision",
    icon: Satellite,
    badge: "Defense",
    table: "geospatial_labels",
    metricLabel: "imagery sets",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1600&q=70",
    hero: {
      eyebrow: "Product · Geospatial Labeling",
      title: "Annotate orbital and aerial imagery",
      description:
        "Bounding boxes, masks, and class labels across EO, SAR, and IR sensors — for orbital and aerial training sets.",
    },
    primaryColumn: "name",
    orderBy: "created_at",
    columns: [
      { key: "sensor_type", label: "Sensor", format: "badge" },
      { key: "region", label: "Region" },
      { key: "image_count", label: "Images", format: "number" },
      { key: "label_count", label: "Labels", format: "number" },
    ],
  },
  {
    slug: "sensor-fusion",
    label: "Sensor Fusion Datasets",
    subtitle: "Multi-modal records with per-modality quality scoring",
    icon: Radar,
    badge: "Defense",
    table: "sensor_fusion_datasets",
    metricLabel: "fusion sets",
    image:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&w=1600&q=70",
    hero: {
      eyebrow: "Product · Sensor Fusion",
      title: "Multi-modal datasets for perception stacks",
      description:
        "SAR, EO/IR, radar, and telemetry combined into time-aligned records with per-modality quality scoring.",
    },
    primaryColumn: "name",
    orderBy: "created_at",
    columns: [
      { key: "modalities", label: "Modalities", format: "array" },
      { key: "record_count", label: "Records", format: "number" },
      { key: "quality_score", label: "Quality", format: "score" },
    ],
  },
  {
    slug: "mission-simulation",
    label: "Mission Simulation",
    subtitle: "Scenario-based evaluation with KPI tracking",
    icon: Target,
    badge: "Defense",
    table: "mission_sim_runs",
    metricLabel: "sim runs",
    image:
      "https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1600&q=70",
    hero: {
      eyebrow: "Product · Mission Simulation",
      title: "Scenario-based evaluation for autonomy",
      description:
        "Track KPI scores, pass/fail outcomes, and reviewer notes across mission scenarios for decision and autonomy models.",
    },
    primaryColumn: "scenario",
    orderBy: "created_at",
    columns: [
      { key: "model_name", label: "Model" },
      { key: "kpi_score", label: "KPI", format: "score" },
      { key: "outcome", label: "Outcome", format: "badge" },
      { key: "status", label: "Status", format: "badge" },
    ],
  },
  {
    slug: "red-team-probes",
    label: "Red-Team Safety Probes",
    subtitle: "Adversarial prompts with reviewer signoff",
    icon: ShieldAlert,
    badge: "Defense",
    table: "red_team_probes",
    metricLabel: "safety probes",
    image:
      "https://images.unsplash.com/photo-1614728263952-84ea256f9679?auto=format&fit=crop&w=1600&q=70",
    hero: {
      eyebrow: "Product · Red-Team Safety",
      title: "Adversarial probes, scored and signed off",
      description:
        "An adversarial prompt library with severity tiers, reviewer signoff, and mitigation status — defense-aligned safety from day one.",
    },
    primaryColumn: "prompt",
    orderBy: "created_at",
    columns: [
      { key: "category", label: "Category", format: "badge" },
      { key: "severity", label: "Severity", format: "badge" },
      { key: "reviewer_signoff", label: "Signoff", format: "boolean" },
      { key: "status", label: "Status", format: "badge" },
    ],
  },
];

export const getProductBySlug = (slug?: string) =>
  productPages.find((p) => p.slug === slug);
