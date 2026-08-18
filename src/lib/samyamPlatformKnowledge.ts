/**
 * Samyam LM Workspace - Comprehensive Platform Knowledge Base Engine
 * Serves exact answers to any user question about Samyam features, modalities,
 * AI models, shortcuts, exports, SAR radar, Grounding DINO, SAM, and Active Learning.
 */

export interface KnowledgeTopic {
  keywords: string[];
  title: string;
  answer: string;
}

export const SAMYAM_KNOWLEDGE_TOPICS: KnowledgeTopic[] = [
  {
    keywords: ["what is samyam", "about samyam", "samyam lm", "samyam workspace", "platform overview", "samyam ai"],
    title: "Samyam LM Workspace Overview",
    answer: `**Samyam LM Workspace** is an Enterprise & Defense-grade Multimodal AI Data Engine and Annotation Platform. 
    
Key Highlights:
- **Multimodal Annotation**: Supports 2D Vision, SAR & Radar imagery, Video Tracking, Text & RLHF, and Audio & Speech.
- **AI-Powered Labeling**: Integrated zero-shot models including Grounding DINO (text-prompt detection), SAM (Segment Anything polygon masks), and AI Pre-labeling.
- **Active Learning**: Automated entropy queue sorting to prioritize ambiguous, high-value samples first.
- **Indic Voice & Keyboard**: Hindi/Indic keyboard and speech-to-text annotation commands.
- **Multi-Format Export**: COCO JSON, YOLO TXT, GeoJSON, and CSV exports.`,
  },
  {
    keywords: ["modality", "modalities", "2d vision", "sar", "radar", "audio", "video", "text", "rlhf"],
    title: "Supported Modalities",
    answer: `Samyam supports 5 core data modalities:

1. 🖼️ **2D Vision**: Bounding boxes & polygon segmentation on optical RGB satellite maps, terrain, and aerial imagery.
2. 🛰️ **SAR & Radar**: Synthetic Aperture Radar imagery (VV/VH/HH/HV polarizations) with Sentinel-1 radar fusion & optical overlay blending.
3. 🎙️ **Audio & Speech**: Indic speech transcription (Hindi, English, Tamil, Telugu), speaker diarization, Whisper ASR & VGGish sound event classification.
4. 🎥 **Video Tracking**: Frame-by-frame object tracking, keyframe interpolation, and temporal event tagging.
5. 📝 **Text & RLHF**: Instruction tuning datasets, prompt-response ranking, and entity extraction.`,
  },
  {
    keywords: ["grounding dino", "dino", "text prompt", "prompt", "satellite antenna"],
    title: "Grounding DINO Zero-Shot Detection",
    answer: `**Grounding DINO** is Samyam's zero-shot text-promptable object detection model.

How to use it:
- Type prompt text separated by dots \`.\`, e.g.: \`satellite antenna . solar panel . vehicle . crater\` or \`building . road . ship\`.
- Set confidence threshold slider (default 30%).
- Click **\`[ Grounding DINO ]\`** (or press Enter in prompt box).
- AI automatically scans the image and draws bounding boxes for all detected objects.`,
  },
  {
    keywords: ["sam", "sam mask", "segment anything", "segmentation", "polygon mask"],
    title: "SAM (Segment Anything Model) Masking",
    answer: `**SAM Mask** generates pixel-perfect polygon segmentation masks around terrain, satellite, vehicle, and building objects.

Features:
- Click **\`[ 🎯 SAM Mask ]\`** in the bottom AI toolbar.
- AI extracts exact object contours and converts them into editable Polygon Annotations.`,
  },
  {
    keywords: ["ai prelabel", "prelabel", "pre-label", "autolabel", "prelabeling"],
    title: "AI Pre-labeling Engine",
    answer: `Click **\`[ ✨ AI Pre-label ]\`** in the top navigation bar to run Samyam's pre-trained vision models against your candidate label classes. It instantly generates bounding boxes with confidence scores.`,
  },
  {
    keywords: ["active learning", "uncertainty", "entropy", "queue", "priority queue"],
    title: "Active Learning Priority Queue",
    answer: `Click **\`Active Learning\`** in the bottom right toolbar (or press CPU button) to open the **Active Learning Priority Queue**.

Benefits:
- AI automatically calculates prediction entropy & model uncertainty for unlabeled images.
- Ranks tasks into **High Priority (Rose)**, **Medium Priority (Amber)**, and **Low Priority (Emerald)**.
- Focuses annotator effort on low-confidence, high-value edge cases first to maximize model accuracy with 80% less human labeling effort.`,
  },
  {
    keywords: ["export", "coco", "yolo", "geojson", "csv", "format", "download"],
    title: "Export Formats",
    answer: `Samyam allows instant downloading & exporting of your labeled datasets in 4 standard formats:

1. **COCO JSON**: Standard computer vision dataset schema with categories, bounding boxes, and segmentation polygons.
2. **YOLO TXT**: Normalized coordinate format (\`class_id x_center y_center width height\`).
3. **GeoJSON**: Geospatial GIS format with coordinate reference systems for QGIS & ArcGIS.
4. **CSV**: Tabular dataset metadata format.

Use the **\`Export JSON\`** button or **\`Formats\`** dropdown at the top-right header.`,
  },
  {
    keywords: ["save", "saving", "how to save", "save button"],
    title: "Saving Annotations",
    answer: `To save your annotations:
- Click the prominent emerald green **\`[ Save ]\`** button in the top-right header next to Export.
- All bounding boxes, polygons, and class assignments will be committed and saved to the dataset repository.`,
  },
  {
    keywords: ["shortcut", "shortcuts", "hotkey", "hotkeys", "key", "keys", "keyboard"],
    title: "Keyboard Shortcuts",
    answer: `Essential Samyam Keyboard Shortcuts:

- **\`B\`**: Bounding Box Tool
- **\`P\`**: Polygon Tool
- **\`V\`**: Select / Move Tool
- **\`D\`**: Delete Tool
- **\`F\`** or **\`0\`**: Fit Image to Screen
- **\`+\`** or **\`=\`**: Zoom In
- **\`-\`** or **\`_\`**: Zoom Out
- **\`1\`** or **\`R\`**: Reset Zoom to 100% (1:1)
- **\`Ctrl + Z\`**: Undo
- **\`Ctrl + Y\`**: Redo
- **\`Esc\`**: Cancel drawing / Deselect
- **\`Space + Drag\`**: Pan Canvas`,
  },
  {
    keywords: ["zoom", "fit", "pan", "canvas", "screen"],
    title: "Canvas Zoom & Navigation",
    answer: `Canvas Controls:
- **Fit to Screen**: Click **\`Fit\`** in top-right overlay or press **\`F\`** / **\`0\`**.
- **Zoom In / Out**: Scroll mouse wheel, or press **\`+\`** / **\`-\`**, or use the overlay buttons.
- **1:1 Reset**: Click **\`1:1\`** overlay button or press **\`1\`** / **\`R\`**.
- **Pan Canvas**: Hold **\`Space\`** + Left Click & Drag, or Middle Mouse Click & Drag.`,
  },
  {
    keywords: ["hindi", "indic", "keyboard", "indic voice", "voice", "speech"],
    title: "Indic Voice & Keyboard Assistant",
    answer: `Samyam features native Indic language support:
- Click **\`[ क/A AI Keyboard ]\`** in the top modality bar to open the Indic/Hindi keyboard drawer.
- Supports voice command recognition for labeling, navigating, and dataset searching in Hindi, English, Tamil, and Telugu.`,
  },
  {
    keywords: ["security", "compliance", "soc2", "gdpr", "hipaa", "defense", "airgapped", "classified"],
    title: "Enterprise Security & Compliance",
    answer: `Samyam is certified for mission-critical enterprise and defense deployments:
- **Certifications**: SOC2 Type II, ISO 27001, HIPAA, and GDPR compliant.
- **Deployment**: Supports Air-gapped on-premise deployment, AWS GovCloud, and Azure Secret Cloud for classified space and defense workloads.`,
  },
];

export function findSamyamAnswer(userQuery: string): string | null {
  const queryLower = userQuery.toLowerCase().trim();
  if (!queryLower) return null;

  // Search for matching topic
  let bestTopic: KnowledgeTopic | null = null;
  let maxScore = 0;

  for (const topic of SAMYAM_KNOWLEDGE_TOPICS) {
    let score = 0;
    for (const kw of topic.keywords) {
      if (queryLower.includes(kw)) {
        score += kw.length;
      }
    }
    if (score > maxScore) {
      maxScore = score;
      bestTopic = topic;
    }
  }

  if (bestTopic && maxScore > 0) {
    return bestTopic.answer;
  }

  return null;
}

export function generateSamyamComprehensiveReply(userQuery: string): string {
  const matched = findSamyamAnswer(userQuery);
  if (matched) {
    return matched;
  }

  // Fallback comprehensive overview if query is general or un-matched
  return `**Samyam LM Workspace** is a unified Multimodal AI Data Engine for Satellite Imagery, Earth Observation, SAR Radar, Video, Audio, and Text datasets.

**Quick Capabilities Overview**:
- 🖼️ **2D Vision & Polygon Segmentation**: SAM Masks, Grounding DINO (\`satellite antenna . solar panel . vehicle . crater\`), AI Pre-labeling.
- 🛰️ **SAR & Radar Layering**: VV/VH polarizations, C-band SAR fusion, optical blending slider.
- 🎙️ **Indic Speech & Audio**: Whisper ASR, VGGish sound classification, Hindi keyboard (\`क/A\`).
- ⚡ **Active Learning**: Entropy-based priority queue sorting to label low-confidence samples first.
- 📥 **Formats & Export**: COCO JSON, YOLO TXT, GeoJSON, CSV.
- ⌨️ **Shortcuts**: \`B\` (BBox), \`P\` (Polygon), \`F\` (Fit to Screen), \`+\` / \`-\` (Zoom).

Feel free to ask about any specific feature, model, format, or shortcut!`;
}
