import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAnnotationState, DEFAULT_LABELS, type Annotation } from "@/components/annotation/useAnnotationState";
import { samyamApi } from "@/lib/samyamApi";
import AnnotationCanvas   from "@/components/annotation/AnnotationCanvas";
import AnnotationToolbar  from "@/components/annotation/AnnotationToolbar";
import LabelPanel         from "@/components/annotation/LabelPanel";
import { Button }         from "@/components/ui/button";
import { useToast }       from "@/hooks/use-toast";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
import ActiveLearningPanel from "@/components/annotation/ActiveLearningPanel";
import {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { toCoco, toYolo, toGeoJson, toCsv, downloadFile } from "@/lib/annotationExport";
import IndicVoiceAnnotator from "@/components/IndicVoiceAnnotator";
import MonopolyExportSuite from "@/components/MonopolyExportSuite";
import { 
  Save, Download, ArrowLeft, Loader2, AlertCircle, Tag, Image as ImageIcon,
  Mic, Video as VideoIcon, FileText, Radar, Play, Pause, Plus, Trash2,
  Sparkles, ThumbsUp, ThumbsDown, Layers, Activity, Sliders, CheckCircle,
  Target, Keyboard, X, Globe, Car, Building2, Radio, CheckCircle2, Cpu,
  Upload, PlusCircle, Music, Film, Satellite, Moon
} from "lucide-react";

// ─── Status badge ────────────────────────────────────────────────────────────
const statusColors: Record<string, string> = {
  pending:     "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  in_progress: "bg-blue-500/20   text-blue-400   border-blue-500/30",
  completed:   "bg-green-500/20  text-green-400  border-green-500/30",
  rejected:    "bg-red-500/20    text-red-400    border-red-500/30",
};

// ─── Fallback demo images & sample audio ─────────────────────────────────────
const DEMO_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/ISS-44_Jeff_Williams_takes_a_nadir-looking_view_of_Earth.jpg/1280px-ISS-44_Jeff_Williams_takes_a_nadir-looking_view_of_Earth.jpg";
const DEMO_AUDIO = "https://actions.google.com/sounds/v1/ambiences/rain_heavy.ogg";

export const PRELOADED_DATASETS = [
  {
    id: "sat-iss",
    name: "Sentinel-2 / NASA Earth Observation",
    category: "Satellite BBox & Runway Mapping",
    icon: Satellite,
    url: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/ISS-44_Jeff_Williams_takes_a_nadir-looking_view_of_Earth.jpg/1280px-ISS-44_Jeff_Williams_takes_a_nadir-looking_view_of_Earth.jpg",
    modality: "vision",
    annotations: [
      { id: "geo-runway-1", type: "bbox", label: "Runway / Landing Strip", color: "#3b82f6", bbox: [120, 80, 420, 180] },
      { id: "geo-facility-2", type: "polygon", label: "Terminal Complex", color: "#a855f7", points: [[280, 140], [460, 110], [530, 210], [350, 250]] },
      { id: "geo-aircraft-3", type: "bbox", label: "Commercial Aircraft", color: "#10b981", bbox: [320, 190, 65, 55] },
    ],
  },
  {
    id: "indian-infra",
    name: "Indian Smart Cities Drone Survey",
    category: "High-Res Aerial Infrastructure",
    icon: Car,
    url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1280&auto=format&fit=crop",
    modality: "vision",
    annotations: [
      { id: "infra-corridor-1", type: "bbox", label: "Transit Corridor", color: "#22c55e", bbox: [160, 220, 280, 160] },
      { id: "infra-structure-2", type: "bbox", label: "Commercial Enclave", color: "#f97316", bbox: [410, 310, 180, 150] },
      { id: "infra-utility-3", type: "polygon", label: "Public Utility Zone", color: "#6366f1", points: [[80, 320], [180, 300], [210, 420], [100, 430]] },
    ],
  },
  {
    id: "lunar-terrain",
    name: "Chandrayaan / LRO Lunar Crater Topography",
    category: "Deep Space Planetary Science",
    icon: Moon,
    url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1280&auto=format&fit=crop",
    modality: "vision",
    annotations: [
      { id: "lunar-crater-1", type: "polygon", label: "Primary Impact Crater", color: "#ec4899", points: [[190, 170], [350, 140], [430, 260], [270, 310]] },
      { id: "lunar-rim-2", type: "bbox", label: "Ejecta Ridge", color: "#06b6d4", bbox: [120, 110, 380, 260] },
    ],
  },
  {
    id: "sat-solar",
    name: "Orbital Spacecraft Photovoltaic Array",
    category: "Orbital Telemetry & Defense",
    icon: Globe,
    url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1280&auto=format&fit=crop",
    modality: "vision",
    annotations: [
      { id: "sat-bus-1", type: "bbox", label: "Spacecraft Main Bus", color: "#6366f1", bbox: [210, 130, 270, 190] },
      { id: "sat-wing-2", type: "polygon", label: "Solar Photovoltaic Wing", color: "#10b981", points: [[470, 110], [630, 80], [690, 210], [530, 240]] },
    ],
  },
  {
    id: "drone-topo",
    name: "High-Altitude UAV Urban Orthomosaic",
    category: "Precision Geospatial Mapping",
    icon: Building2,
    url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1280&auto=format&fit=crop",
    modality: "vision",
    annotations: [
      { id: "ortho-grid-1", type: "bbox", label: "Structural Grid Alpha", color: "#a855f7", bbox: [180, 160, 240, 210] },
      { id: "ortho-canopy-2", type: "polygon", label: "Vegetation Buffer", color: "#84cc16", points: [[440, 180], [560, 140], [610, 260], [470, 290]] },
    ],
  },
  {
    id: "sar-sentinel",
    name: "Copernicus Sentinel-1 SAR Maritime Scan",
    category: "SAR Multi-Polarization Radar",
    icon: Radio,
    url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1280&auto=format&fit=crop",
    modality: "sar_radar",
    annotations: [
      { id: "sar-vessel-1", type: "bbox", label: "Maritime Cargo Vessel", color: "#ef4444", bbox: [240, 180, 195, 135] },
      { id: "sar-dock-2", type: "bbox", label: "Harbor Gantry Infrastructure", color: "#eab308", bbox: [490, 290, 240, 160] },
    ],
  },
];

const DEVANAGARI_CHARS = [
  "क", "ख", "ग", "घ", "ङ", "च", "छ", "ज", "झ", "ञ",
  "ट", "ठ", "ड", "ढ", "ण", "त", "थ", "द", "ध", "न",
  "प", "फ", "ब", "भ", "म", "य", "र", "ल", "व", "श",
  "ष", "स", "ह", "अ", "आ", "इ", "ई", "उ", "ऊ", "ऋ",
  "ए", "ऐ", "ओ", "औ", "ं", "ः", "ँ", "्", "ा", "ि",
  "ी", "ु", "ू", "े", "ै", "ो", "ौ", "ऑटो-रिक्शा", "गड्ढा", "मवेशी"
];

export type Modality = "vision" | "audio" | "video" | "text_rlhf" | "sar_radar";

export default function AnnotationTool() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate   = useNavigate();
  const { toast }  = useToast();

  const [activeModality, setActiveModality] = useState<Modality>("vision");
  const [showHindiKb, setShowHindiKb] = useState(false);
  const [showMobileLabels, setShowMobileLabels] = useState(false);
  const [showActiveLearningModal, setShowActiveLearningModal] = useState(false);

  // Task data
  const [task,       setTask]       = useState<Record<string, any> | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [saving,     setSaving]     = useState(false);
  const [lastSaved,  setLastSaved]  = useState<Date | null>(null);
  const [dirty,      setDirty]      = useState(false);

  const [imageUrl,   setImageUrl]   = useState<string>(DEMO_IMAGE);
  const [customUrl,  setCustomUrl]  = useState("");
  const [showUrlBox, setShowUrlBox] = useState(false);
  const [selectedDatasetId, setSelectedDatasetId] = useState<string>("sat-iss");
  const imageInputRef = useRef<HTMLInputElement | null>(null);

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setImageUrl(localUrl);
      toast({ title: "Loaded Image File", description: file.name });
    }
  };

  // Annotation state for Vision
  const state = useAnnotationState();

  const handleSelectPresetDataset = (dsId: string) => {
    const ds = PRELOADED_DATASETS.find(d => d.id === dsId);
    if (!ds) return;
    setSelectedDatasetId(ds.id);
    setImageUrl(ds.url);
    if (ds.modality === "sar_radar") {
      setActiveModality("sar_radar");
    } else {
      setActiveModality("vision");
    }
    // Pre-populate annotations
    state.setAnnotations(ds.annotations as any);
    toast({
      title: `Loaded Pre-loaded Dataset`,
      description: `${ds.name} (${ds.category})`,
    });
  };

  const [runningAi, setRunningAi] = useState(false);

  // Natural size of the currently loaded image (needed to map normalized AI boxes → pixels)
  const [imageDims, setImageDims] = useState<{ w: number; h: number }>({ w: 1280, h: 720 });
  useEffect(() => {
    if (!imageUrl) return;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => setImageDims({ w: img.naturalWidth || 1280, h: img.naturalHeight || 720 });
    img.src = imageUrl;
  }, [imageUrl]);

  const handleAiPrelabel = useCallback(async () => {
    if (/^blob:|^data:/.test(imageUrl)) {
      toast({
        title: "Public image required",
        description: "AI pre-labeling needs a hosted image URL. Load a dataset or paste an image URL.",
        variant: "destructive",
      });
      return;
    }
    setRunningAi(true);
    toast({ title: "Running AI pre-labeling…", description: "Vision model inference in progress" });
    const candidateLabels = state.labels.map(l => l.name);
    try {
      const results = await samyamApi.runClipPrelabel(imageUrl, candidateLabels, imageDims.w, imageDims.h);

      results.forEach((r) => {
        const targetLabel = state.labels.find(l => l.name.toLowerCase() === r.label.toLowerCase()) || state.activeLabel;
        state.addAnnotation({
          id: `ai-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: "bbox",
          label: `${targetLabel.name} (${Math.round(r.confidence * 100)}%)`,
          color: targetLabel.color,
          bbox: r.bbox,
        });
      });

      toast({
        title: "AI pre-labeling complete",
        description: results.length
          ? `Generated ${results.length} bounding box${results.length === 1 ? "" : "es"}.`
          : "No confident detections found in this image.",
      });
    } catch (e) {
      toast({
        title: "Pre-labeling failed",
        description: e instanceof Error ? e.message : "Inference error",
        variant: "destructive",
      });
    } finally {
      setRunningAi(false);
    }
  }, [imageUrl, imageDims, state, toast]);

  const [runningSam, setRunningSam] = useState(false);
  const handleSamSegment = useCallback(async () => {
    if (/^blob:|^data:/.test(imageUrl)) {
      toast({
        title: "Public image required",
        description: "Segmentation needs a hosted image URL.",
        variant: "destructive",
      });
      return;
    }
    setRunningSam(true);
    toast({ title: "Running segmentation…", description: "Generating object outline polygon" });
    try {
      const result = await samyamApi.runSamSegment(
        imageUrl,
        imageDims.w / 2,
        imageDims.h / 2,
        imageDims.w,
        imageDims.h,
        state.labels.map(l => l.name),
      );

      state.addAnnotation({
        id: `sam-${Date.now()}`,
        type: "polygon",
        label: result.label || state.activeLabel.name,
        color: state.activeLabel.color,
        points: result.polygon.map(pt => [pt[0], pt[1]] as [number, number]),
      });

      toast({
        title: "Segmentation complete",
        description: `Mask for ${result.label} (confidence: ${Math.round(result.confidence * 100)}%)`,
      });
    } catch (e) {
      toast({
        title: "Segmentation failed",
        description: e instanceof Error ? e.message : "Inference error",
        variant: "destructive",
      });
    } finally {
      setRunningSam(false);
    }
  }, [imageUrl, imageDims, state, toast]);

  // ── Grounding DINO Zero-Shot Text Prompting State & Handler ──
  const [groundingDinoPrompt, setGroundingDinoPrompt] = useState("satellite antenna  .  solar panel  .  vehicle  .  crater");
  const [groundingDinoThreshold, setGroundingDinoThreshold] = useState(0.3);
  const [runningGroundingDino, setRunningGroundingDino] = useState(false);

  const handleGroundingDinoPrelabel = useCallback(async () => {
    if (!groundingDinoPrompt.trim()) {
      toast({ title: "Please enter a text prompt for Grounding DINO", variant: "destructive" });
      return;
    }
    setRunningGroundingDino(true);
    toast({
      title: "Running Grounding DINO zero-shot detection…",
      description: `Searching for: "${groundingDinoPrompt}"`
    });

    try {
      const results = await samyamApi.runGroundingDino(imageUrl, groundingDinoPrompt, groundingDinoThreshold);
      results.forEach((r) => {
        const matchingLabel = state.labels.find(l => l.name.toLowerCase() === r.label.toLowerCase());
        const color = matchingLabel ? matchingLabel.color : "#3b82f6";
        state.addAnnotation({
          id: `gdino-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
          type: "bbox",
          label: `${r.label} (${Math.round(r.confidence * 100)}%)`,
          color: color,
          bbox: r.bbox,
        });
      });

      toast({
        title: "Grounding DINO complete",
        description: results.length
          ? `Generated ${results.length} bounding box${results.length === 1 ? "" : "es"} for text prompt.`
          : "No objects found matching text prompt.",
      });
    } catch (e) {
      toast({
        title: "Grounding DINO failed",
        description: e instanceof Error ? e.message : "Inference error",
        variant: "destructive",
      });
    } finally {
      setRunningGroundingDino(false);
    }
  }, [imageUrl, groundingDinoPrompt, groundingDinoThreshold, state, toast]);

  // ── Audio Modality State ──
  const [audioUrl, setAudioUrl] = useState(DEMO_AUDIO);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioCurrentTime, setAudioCurrentTime] = useState(0);
  const [audioDuration, setAudioDuration] = useState(15.4);
  const [audioSegments, setAudioSegments] = useState([
    { id: "aud-1", start: "00:01.2", end: "00:04.5", speaker: "Speaker 1 (Ground Control)", tag: "Clear Command", transcript: "Samyam-1, prepare telemetry downlink on frequency 1420 MHz." },
    { id: "aud-2", start: "00:05.1", end: "00:09.8", speaker: "Speaker 2 (CubeSat Telemetry)", tag: "Telemetry Data", transcript: "Acknowledge Ground Control. Solar panel orientation at 98.4 degrees." },
  ]);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // ── Video Modality State ──
  const [videoFrame, setVideoFrame] = useState(14);
  const [totalVideoFrames, setTotalVideoFrames] = useState(120);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoTracks, setVideoTracks] = useState([
    { id: "vt-1", name: "Debris Track #401", class: "Orbital Debris", startFrame: 1, endFrame: 84, bbox: "[240, 180, 45, 45]" },
    { id: "vt-2", name: "LEO Satellite Alpha", class: "Satellite", startFrame: 10, endFrame: 120, bbox: "[510, 320, 110, 80]" },
  ]);

  // ── Audio Upload & File handling ──
  const [customAudioInputUrl, setCustomAudioInputUrl] = useState("");
  const [newAudioTranscript, setNewAudioTranscript] = useState("");
  const [newAudioSpeaker, setNewAudioSpeaker] = useState("Speaker 1");
  const [showAddSegmentBox, setShowAddSegmentBox] = useState(false);
  const audioInputRef = useRef<HTMLInputElement | null>(null);

  // ── Audio AI: Whisper Transcription & VGGish Event Detection State & Handlers ──
  const [runningWhisper, setRunningWhisper] = useState(false);
  const [runningVggish, setRunningVggish] = useState(false);
  const [vggishEvents, setVggishEvents] = useState<import("@/lib/samyamApi").VggishEventResult[]>([]);

  const handleWhisperAutoTranscribe = useCallback(async () => {
    setRunningWhisper(true);
    toast({ title: "Running Whisper ASR Engine…", description: "Auto-transcribing speech audio with timestamps" });
    try {
      const resp = await samyamApi.runWhisperTranscription(audioUrl);
      if (resp.segments && resp.segments.length > 0) {
        const newSegments = resp.segments.map(seg => ({
          id: seg.id,
          start: seg.start,
          end: seg.end,
          speaker: seg.speaker,
          tag: "Whisper ASR",
          transcript: seg.transcript
        }));
        setAudioSegments(newSegments);
        toast({
          title: "✓ Whisper Speech Transcription Complete!",
          description: `Extracted ${resp.segments.length} timestamped speech segments.`
        });
      }
    } catch (e) {
      toast({ title: "Whisper transcription failed", description: "Inference error", variant: "destructive" });
    } finally {
      setRunningWhisper(false);
    }
  }, [audioUrl, toast]);

  const handleVggishAudioEvents = useCallback(async () => {
    setRunningVggish(true);
    toast({ title: "Running VGGish Acoustic Event Detection…", description: "Scanning sound events across audio timeline" });
    try {
      const resp = await samyamApi.runVggishEventDetection(audioUrl);
      if (resp.events && resp.events.length > 0) {
        setVggishEvents(resp.events);
        toast({
          title: "✓ VGGish Acoustic Event Detection Complete!",
          description: `Identified ${resp.events.length} sound events across audio track.`
        });
      }
    } catch (e) {
      toast({ title: "VGGish detection failed", description: "Inference error", variant: "destructive" });
    } finally {
      setRunningVggish(false);
    }
  }, [audioUrl, toast]);

  const handleAudioFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setAudioUrl(localUrl);
      toast({ title: "Loaded Audio File", description: file.name });
    }
  };

  const handleAddAudioSegment = () => {
    if (!newAudioTranscript) return;
    const newSeg = {
      id: `aud-${Date.now()}`,
      start: `00:${Math.floor(audioCurrentTime).toString().padStart(2, '0')}.0`,
      end: `00:${Math.floor(audioCurrentTime + 3).toString().padStart(2, '0')}.0`,
      speaker: newAudioSpeaker,
      tag: "User Annotation",
      transcript: newAudioTranscript,
    };
    setAudioSegments(prev => [...prev, newSeg]);
    setNewAudioTranscript("");
    setShowAddSegmentBox(false);
    toast({ title: "Added Audio Segment Annotation" });
  };

  // ── Video Upload & File handling ──
  const [videoUrl, setVideoUrl] = useState<string>("https://www.w3schools.com/html/mov_bbb.mp4");
  const [customVideoInputUrl, setCustomVideoInputUrl] = useState("");
  const [newTrackName, setNewTrackName] = useState("");
  const [newTrackClass, setNewTrackClass] = useState("Satellite");
  const [showAddTrackBox, setShowAddTrackBox] = useState(false);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  const handleVideoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const localUrl = URL.createObjectURL(file);
      setVideoUrl(localUrl);
      toast({ title: "Loaded Video File", description: file.name });
    }
  };

  const handleAddVideoTrack = () => {
    if (!newTrackName) return;
    const newTrack = {
      id: `vt-${Date.now()}`,
      name: newTrackName,
      class: newTrackClass,
      startFrame: videoFrame,
      endFrame: Math.min(videoFrame + 50, totalVideoFrames),
      bbox: `[${Math.floor(Math.random()*300+100)}, ${Math.floor(Math.random()*200+100)}, 60, 60]`,
    };
    setVideoTracks(prev => [...prev, newTrack]);
    setNewTrackName("");
    setShowAddTrackBox(false);
    toast({ title: "Added Video Object Track" });
  };

  // ── Text / RLHF Modality State ──
  const [rlhfPrompt, setRlhfPrompt] = useState("Analyze potential collision hazards for Satellite NORAD-49210 over South Asia given polar orbital telemetry.");
  const [rlhfRank, setRlhfRank] = useState<"A" | "B" | null>("A");
  const [rlhfScoreA, setRlhfScoreA] = useState(5);
  const [rlhfScoreB, setRlhfScoreB] = useState(3);
  const [nerTokens, setNerTokens] = useState([
    { text: "NORAD-49210", tag: "SATELLITE_ID", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
    { text: "South Asia", tag: "GEO_LOCATION", color: "bg-green-500/20 text-green-300 border-green-500/40" },
    { text: "polar orbital", tag: "ORBIT_TYPE", color: "bg-purple-500/20 text-purple-300 border-purple-500/40" },
  ]);

  // ── SAR Radar Modality State ──
  const [selectedBand, setSelectedBand] = useState<"VV" | "VH" | "RGB" | "Thermal">("VV");
  const [opacityOverlay, setOpacityOverlay] = useState(75);
  const [sarImageUrl, setSarImageUrl] = useState(DEMO_IMAGE);
  const [customSarInputUrl, setCustomSarInputUrl] = useState("");

  // ── Local (demo) persistence key ──
  const demoStorageKey = "samyam.annotations.demo";

  // ── Load task from Supabase (or restore demo work from localStorage) ──
  useEffect(() => {
    if (!taskId || taskId === "demo") {
      setLoading(false);
      try {
        const raw = localStorage.getItem(demoStorageKey);
        if (raw) {
          const saved = JSON.parse(raw) as {
            annotations?: Annotation[];
            modality?: Modality;
            imageUrl?: string;
            savedAt?: string;
          };
          if (saved.annotations?.length) {
            state.setAnnotations(saved.annotations);
            if (saved.modality) setActiveModality(saved.modality);
            if (saved.imageUrl) setImageUrl(saved.imageUrl);
            if (saved.savedAt) setLastSaved(new Date(saved.savedAt));
            toast({
              title: "Restored previous work",
              description: `${saved.annotations.length} annotation${saved.annotations.length === 1 ? "" : "s"} loaded from this browser.`,
            });
          }
        }
      } catch {
        /* ignore malformed local data */
      }
      return;
    }

    supabase
      .from("annotation_tasks")
      .select("*")
      .eq("id", taskId)
      .single()
      .then(({ data, error: err }) => {
        setLoading(false);
        if (err || !data) {
          setError(err?.message ?? "Task not found");
          return;
        }
        setTask(data);

        const payload = data.payload as Record<string, any>;
        if (payload?.imageUrl) setImageUrl(payload.imageUrl);

        const result = data.result as Record<string, any> | null;
        if (result?.annotations) {
          state.setAnnotations(result.annotations as Annotation[]);
          if (data.updated_at) setLastSaved(new Date(data.updated_at));
        }
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);


  // ── Keyboard shortcuts ──
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (activeModality === "vision") {
        if (e.key === "v" || e.key === "V") state.setTool("select");
        if (e.key === "b" || e.key === "B") state.setTool("bbox");
        if (e.key === "p" || e.key === "P") state.setTool("polygon");
        if (e.key === "d" || e.key === "D") state.setTool("delete");
        if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); state.undo(); }
        if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); state.redo(); }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeModality, state]);

  // ── Save (DB for real tasks, localStorage for demo) ──
  const persist = useCallback(async (silent = false) => {
    const payload = {
      annotations: state.annotations,
      labels: state.labels,
      modality: activeModality,
      imageUrl,
      savedAt: new Date().toISOString(),
    };

    if (!taskId || taskId === "demo") {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session?.user) {
          if (!silent) {
            toast({ title: "Saving to database...", description: "Creating a new annotation task." });
          }
          setSaving(true);
          const { data: newTask, error } = await supabase
            .from("annotation_tasks")
            .insert({
              created_by: session.user.id,
              title: task?.title || "Demo Annotation Save",
              label_schema: { classes: state.labels.map(l => l.name) } as any,
              payload: { imageUrl, modality: activeModality } as any,
              result: payload as any,
              status: "in_progress",
            })
            .select("id")
            .single();
          
          setSaving(false);
          
          if (error) {
            if (!silent) toast({ title: "Failed to save to DB", description: error.message, variant: "destructive" });
          } else if (newTask) {
            setLastSaved(new Date());
            setDirty(false);
            if (!silent) toast({ title: "✓ Annotations saved to database!", description: "Task created successfully." });
            navigate(`/annotate/${newTask.id}`, { replace: true });
            return;
          }
        }

        // Fallback to local storage if not logged in
        localStorage.setItem(demoStorageKey, JSON.stringify(payload));
        setLastSaved(new Date());
        setDirty(false);
        if (!silent) {
          toast({
            title: session?.user ? "Saved locally" : "Saved locally (Not logged in)",
            description: session?.user ? "Failed to save to DB, falling back to local storage." : "Please log in to save annotations to the database.",
          });
        }
      } catch {
        if (!silent) toast({ title: "Save failed", description: "Browser storage unavailable.", variant: "destructive" });
      }
      return;
    }

    setSaving(true);
    const { error: err } = await supabase
      .from("annotation_tasks")
      .update({
        result: payload as any,
        status: "in_progress",
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId);
    setSaving(false);
    if (err) {
      if (!silent) toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } else {
      setLastSaved(new Date());
      setDirty(false);
      if (!silent) toast({ title: "✓ Annotations saved!" });
    }
  }, [taskId, state.annotations, state.labels, activeModality, imageUrl, toast, navigate, task?.title]);

  const handleSave = useCallback(() => persist(false), [persist]);

  // Mark dirty whenever annotations/labels change
  useEffect(() => {
    setDirty(true);
  }, [state.annotations, state.labels]);

  // Debounced autosave
  useEffect(() => {
    if (!dirty) return;
    const t = setTimeout(() => { void persist(true); }, 1500);
    return () => clearTimeout(t);
  }, [dirty, persist]);

  // Warn before leaving with unsaved changes
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (dirty) { e.preventDefault(); e.returnValue = ""; }
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [dirty]);


  // ── Export ──
  const handleExport = useCallback(() => {
    let exportData: any = {};
    if (activeModality === "vision") {
      exportData = {
        info: { description: task?.title ?? "Samyam Vision Annotation", modality: "vision", date: new Date().toISOString() },
        categories: state.labels,
        annotations: state.annotations,
      };
    } else if (activeModality === "audio") {
      exportData = { modality: "audio", segments: audioSegments };
    } else if (activeModality === "video") {
      exportData = { modality: "video", totalFrames: totalVideoFrames, tracks: videoTracks };
    } else if (activeModality === "text_rlhf") {
      exportData = { modality: "text_rlhf", prompt: rlhfPrompt, preferredResponse: rlhfRank, entities: nerTokens };
    } else if (activeModality === "sar_radar") {
      exportData = { modality: "sar_radar", band: selectedBand, overlayOpacity: opacityOverlay };
    }

    downloadFile(
      `samyam_${activeModality}_${taskId ?? "demo"}.json`,
      JSON.stringify(exportData, null, 2),
      "application/json",
    );
    toast({ title: `Exported ${activeModality.toUpperCase()} JSON` });
  }, [activeModality, state.annotations, state.labels, audioSegments, totalVideoFrames, videoTracks, rlhfPrompt, rlhfRank, nerTokens, selectedBand, opacityOverlay, task, taskId, toast]);

  // ── Dataset exports (COCO / YOLO / GeoJSON / CSV) ──
  const exportCtx = useCallback(() => ({
    annotations: state.annotations,
    labels: state.labels,
    imageWidth: imageDims.w,
    imageHeight: imageDims.h,
    imageName: (imageUrl.split("/").pop() || "image.jpg").split("?")[0],
    title: task?.title ?? "samyam annotation export",
  }), [state.annotations, state.labels, imageDims, imageUrl, task]);

  const handleDatasetExport = useCallback((fmt: "coco" | "yolo" | "geojson" | "csv") => {
    if (activeModality !== "vision") {
      toast({ title: "Vision only", description: "COCO / YOLO / GeoJSON exports need image annotations.", variant: "destructive" });
      return;
    }
    if (!state.annotations.length) {
      toast({ title: "Nothing to export", description: "Draw or generate some annotations first.", variant: "destructive" });
      return;
    }
    const ctx = exportCtx();
    const base = `samyam_${taskId ?? "demo"}`;
    if (fmt === "coco") {
      downloadFile(`${base}_coco.json`, JSON.stringify(toCoco(ctx), null, 2), "application/json");
    } else if (fmt === "yolo") {
      const { labelsTxt, dataYaml } = toYolo(ctx);
      downloadFile(`${base}_yolo.txt`, labelsTxt, "text/plain");
      setTimeout(() => downloadFile(`${base}_data.yaml`, dataYaml, "text/yaml"), 250);
    } else if (fmt === "geojson") {
      downloadFile(`${base}.geojson`, JSON.stringify(toGeoJson(ctx), null, 2), "application/geo+json");
    } else {
      downloadFile(`${base}_labels.csv`, toCsv(ctx), "text/csv");
    }
    toast({ title: `Exported ${fmt.toUpperCase()}`, description: `${ctx.annotations.length} annotation${ctx.annotations.length === 1 ? "" : "s"}.` });
  }, [activeModality, state.annotations, exportCtx, taskId, toast]);

  const handleSelectForDelete = useCallback((id: string | null) => {
    state.setSelectedId(id);
    if (id && state.tool === "delete") {
      state.deleteAnnotation(id);
    }
  }, [state]);

  if (loading) return (
    <div className="min-h-screen bg-[#0d0d1a] flex items-center justify-center">
      <Loader2 className="animate-spin text-cosmic-purple h-8 w-8" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-[#0d0d1a] flex flex-col items-center justify-center gap-4 text-white">
      <AlertCircle className="h-10 w-10 text-red-400" />
      <p className="text-red-400 font-medium">{error}</p>
      <Button variant="outline" onClick={() => navigate(-1)} className="text-white border-white/20">
        <ArrowLeft className="h-4 w-4 mr-2" /> Go back
      </Button>
    </div>
  );

  return (
    <div className="dark h-screen flex flex-col bg-[#060712] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#111536]/40 via-[#060712] to-[#030408] text-white overflow-hidden select-none">

      {/* ── Main Navigation Header ── */}
      <header className="shrink-0 flex items-center justify-between gap-4 px-5 py-2.5 min-h-14 border-b border-[#1e2238]/80 bg-[#0c0d18] z-20 shadow-md">
        {/* Left: Back Arrow + Title + Modality Switcher Tabs (Spacious & Clean) */}
        <div className="flex items-center gap-4 shrink-0">
          <button onClick={() => navigate(-1)} className="text-slate-400 hover:text-white transition-colors shrink-0 p-1.5 rounded-lg hover:bg-white/10" title="Back">
            <ArrowLeft size={18} />
          </button>
          
          <div className="flex items-center gap-2.5 shrink-0">
            <p className="text-white font-bold text-sm tracking-tight font-display truncate max-w-[200px] sm:max-w-[240px]">
              {task?.title ?? "Samyam LM Workspace"}
            </p>
            {task?.status && (
              <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-wider ${statusColors[task.status] ?? ""}`}>
                {task.status.replace("_", " ")}
              </span>
            )}
          </div>

          {/* Modality Switcher Tabs (Shifted left with clean spacing to give Export/Save room) */}
          <div className="flex items-center gap-1.5 bg-[#06070d] p-1.5 rounded-xl border border-[#23263d] shadow-inner overflow-x-auto no-scrollbar shrink-0 ml-4 pl-3 border-l border-[#252942]">

            {[
              { id: "vision", label: "2D Vision", icon: ImageIcon },
              { id: "audio", label: "Audio & Speech", icon: Mic },
              { id: "video", label: "Video Tracking", icon: VideoIcon },
              { id: "text_rlhf", label: "Text & RLHF", icon: FileText },
              { id: "sar_radar", label: "SAR & Radar", icon: Radar },
            ].map((m) => {
              const Icon = m.icon;
              const active = activeModality === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => {
                    setActiveModality(m.id as Modality);
                    toast({ title: `Switched to ${m.label} Modality` });
                  }}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 shrink-0 ${
                    active
                      ? "bg-white text-slate-950 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                      : "text-slate-400 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon size={14} />
                  <span>{m.label}</span>
                </button>
              );
            })}

            {/* Separator Divider */}
            <div className="h-4 w-px bg-[#23263d] mx-2 shrink-0" />

            {/* AI Keyboard Button */}
            <button
              onClick={() => setShowHindiKb((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 shrink-0 ${
                showHindiKb
                  ? "bg-white text-slate-950 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/10"
              }`}
              title="Toggle Indic / Hindi AI Keyboard"
            >
              <span className="font-semibold text-xs">क/A</span>
              <span>AI Keyboard</span>
            </button>

            {/* AI Pre-label Button (With clear spacing ml-2.5) */}
            <button
              onClick={handleAiPrelabel}
              disabled={runningAi}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-150 shrink-0 ml-2.5 ${
                runningAi
                  ? "bg-slate-200 text-slate-700 cursor-wait opacity-80"
                  : "bg-white text-slate-950 hover:bg-slate-100 shadow-[0_0_12px_rgba(255,255,255,0.4)]"
              }`}
              title="Run AI Pre-trained Labeling Models"
            >
              {runningAi ? <Loader2 size={14} className="animate-spin text-slate-950" /> : <Sparkles size={14} className="text-indigo-600" />}
              <span>AI Pre-label</span>
            </button>
          </div>
        </div>

        {/* Right Side Header Actions: Export JSON, Formats & SAVE Button */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Export JSON Button */}
          <Button
            size="sm"
            onClick={() => handleDatasetExport("coco")}
            className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-500 text-white border-0 gap-1.5 font-bold shadow-sm shrink-0"
            title="Download COCO JSON format dataset"
          >
            <Download size={14} />
            <span>Export JSON</span>
          </Button>

          {/* Formats Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button size="sm" className="h-8 px-2.5 text-xs bg-[#1e2238] border border-[#343956] text-slate-200 hover:bg-[#282d4a] gap-1 font-medium shrink-0">
                <Sliders size={13} />
                <span className="hidden sm:inline">Formats</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-60 bg-[#12142a] border-[#343956] text-slate-200 shadow-2xl p-2 z-50">
              <DropdownMenuLabel className="text-[10px] uppercase tracking-widest text-white/40 font-mono px-2 py-1">
                Dataset Formats
              </DropdownMenuLabel>
              <DropdownMenuItem onClick={() => handleDatasetExport("coco")} className="text-xs font-semibold p-2 focus:bg-white/10 focus:text-white cursor-pointer rounded-lg flex items-center justify-between">
                <span>COCO JSON 1.0</span>
                <span className="text-[10px] font-mono opacity-50">.json</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDatasetExport("yolo")} className="text-xs font-semibold p-2 focus:bg-white/10 focus:text-white cursor-pointer rounded-lg flex items-center justify-between">
                <span>YOLOv8 PyTorch</span>
                <span className="text-[10px] font-mono opacity-50">.txt</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDatasetExport("geojson")} className="text-xs font-semibold p-2 focus:bg-white/10 focus:text-white cursor-pointer rounded-lg flex items-center justify-between">
                <span>ISRO GeoJSON</span>
                <span className="text-[10px] font-mono opacity-50">.geojson</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDatasetExport("csv")} className="text-xs font-semibold p-2 focus:bg-white/10 focus:text-white cursor-pointer rounded-lg flex items-center justify-between">
                <span>CSV Table</span>
                <span className="text-[10px] font-mono opacity-50">.csv</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#343956] my-1" />
              <DropdownMenuItem onClick={handleExport} className="text-xs font-semibold p-2 focus:bg-white/10 focus:text-white cursor-pointer rounded-lg flex items-center justify-between">
                <span>Raw Session JSON</span>
                <span className="text-[10px] font-mono opacity-50">.json</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Prominent Save Button */}
          <Button
            size="sm"
            onClick={handleSave}
            disabled={saving}
            className="h-8 px-3.5 text-xs bg-emerald-500 hover:bg-emerald-400 text-slate-950 border-0 gap-1.5 font-bold shadow-[0_0_12px_rgba(16,185,129,0.3)] shrink-0"
            title="Save changes to dataset"
          >
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            <span>Save</span>
          </Button>
        </div>
      </header>

      {/* ── Sub-Header: AI Tools & Prompt Bar ── */}
      <div className="shrink-0 bg-[#0c0d18] border-b border-[#1e2238] px-4 py-2 flex flex-wrap items-center justify-between gap-3 z-10">
        {/* Left: Grounding DINO Prompt & SAM Mask Controls (Vision/Video) */}
        {(activeModality === "vision" || activeModality === "video") ? (
          <div className="flex items-center gap-2.5 flex-1 min-w-[320px]">
            {/* Input Container */}
            <div className="flex-1 flex items-center gap-2.5 bg-[#131526] hover:bg-[#171a30] focus-within:bg-[#171a30] px-3.5 py-1.5 rounded-xl border border-[#2b304f] focus-within:border-indigo-500/80 transition-all shadow-inner">
              <span className="flex items-center gap-1.5 text-[11px] font-bold text-indigo-400 uppercase tracking-wider shrink-0 bg-indigo-500/10 px-2 py-0.5 rounded-md border border-indigo-500/20">
                <Target size={13} className="text-indigo-400" />
                <span>AI Prompt</span>
              </span>
              <input
                type="text"
                value={groundingDinoPrompt}
                onChange={(e) => setGroundingDinoPrompt(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") handleGroundingDinoPrelabel(); }}
                placeholder="Grounding DINO prompt (e.g. satellite antenna . solar panel . vehicle . crater)"
                className="flex-1 bg-transparent text-xs sm:text-sm font-semibold tracking-wide text-white outline-none placeholder:text-slate-500 font-sans"
              />
              <div className="flex items-center gap-2 shrink-0 pl-3 border-l border-[#252942]">
                <span className="text-[11px] text-slate-400 font-medium">Conf:</span>
                <input
                  type="range"
                  min="0.1"
                  max="0.8"
                  step="0.05"
                  value={groundingDinoThreshold}
                  onChange={(e) => setGroundingDinoThreshold(parseFloat(e.target.value))}
                  className="w-16 h-1 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-500"
                />
                <span className="text-xs font-mono text-indigo-300 font-bold min-w-[32px] text-right">
                  {Math.round(groundingDinoThreshold * 100)}%
                </span>
              </div>
            </div>

            <Button
              size="sm"
              onClick={handleGroundingDinoPrelabel}
              disabled={runningGroundingDino}
              className="h-8 px-3 text-xs bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-1.5 rounded-xl shrink-0 shadow-sm"
            >
              {runningGroundingDino ? <Loader2 size={13} className="animate-spin" /> : <Sparkles size={13} />}
              <span>Grounding DINO</span>
            </Button>

            <Button
              size="sm"
              onClick={handleSamSegment}
              disabled={runningSam}
              className="h-7 px-2.5 text-xs bg-emerald-600 hover:bg-emerald-500 text-white font-semibold gap-1 rounded-lg shrink-0"
            >
              {runningSam ? <Loader2 size={12} className="animate-spin" /> : <Target size={12} />}
              <span>SAM Mask</span>
            </Button>
          </div>
        ) : <div />}

        {/* Right: Auxiliary Tools (Active Learning, Hindi Keyboard) */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            size="sm"
            onClick={() => setShowHindiKb(v => !v)}
            className={`h-7 px-2.5 text-xs gap-1 transition-colors border shrink-0 ${
              showHindiKb ? "bg-white text-slate-950 font-bold border-white shadow-sm" : "bg-[#1e2238] border-[#343956] text-slate-200 hover:bg-[#282d4a]"
            }`}
          >
            <span>क/A</span>
            <span className="hidden xl:inline">Hindi Keyboard</span>
          </Button>


          <Button
            size="sm"
            onClick={() => setShowActiveLearningModal(true)}
            className="h-7 px-2.5 text-xs bg-purple-600/30 hover:bg-purple-600/50 text-purple-200 border border-purple-500/40 gap-1 font-semibold shrink-0"
          >
            <Cpu size={12} />
            <span className="hidden sm:inline">Active Learning</span>
          </Button>

          {/* Hidden File Inputs */}
          <input type="file" ref={imageInputRef} accept="image/*" className="hidden" onChange={handleImageFileUpload} />
          <input type="file" ref={audioInputRef} accept="audio/*" className="hidden" onChange={handleAudioFileUpload} />
          <input type="file" ref={videoInputRef} accept="video/*" className="hidden" onChange={handleVideoFileUpload} />

          {activeModality === "audio" && (
            <Button
              size="sm"
              onClick={() => audioInputRef.current?.click()}
              className="h-7 px-2.5 text-xs bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold gap-1 shrink-0"
            >
              <Upload size={12} />
              <span>Upload Audio</span>
            </Button>
          )}

          {activeModality === "video" && (
            <Button
              size="sm"
              onClick={() => videoInputRef.current?.click()}
              className="h-7 px-2.5 text-xs bg-white/10 hover:bg-white/20 border border-white/30 text-white font-semibold gap-1 shrink-0"
            >
              <Upload size={12} />
              <span>Upload Video</span>
            </Button>
          )}
        </div>
      </div>

      {/* ── Devanagari (Hindi) On-Screen Keyboard Drawer ── */}
      {showHindiKb && (
        <div className="shrink-0 bg-[#121225] border-b border-white/20 p-3 shadow-xl z-20">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Keyboard size={14} className="text-indigo-400" /> Devanagari (देवनागरी/हिन्दी) On-Screen Keyboard Pad
            </span>
            <span className="text-[10px] text-white/50 hidden sm:inline">Click any character to copy to clipboard & insert into annotations</span>
            <button onClick={() => setShowHindiKb(false)} className="text-white/40 hover:text-white text-xs flex items-center gap-1">
              <X size={12} /> Close
            </button>
          </div>
          <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
            {DEVANAGARI_CHARS.map((char, i) => (
              <button
                key={i}
                onClick={() => {
                  navigator.clipboard.writeText(char);
                  toast({ title: `Copied '${char}'` });
                }}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-white hover:text-black font-mono text-sm text-white transition-colors border border-white/10"
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Image URL & Preset Picker ── */}
      {showUrlBox && activeModality === "vision" && (
        <div className="shrink-0 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 px-4 py-2.5 bg-[#0f0f1e] border-b border-indigo-500/30 z-10 shadow-lg animate-in slide-in-from-top-2 duration-200">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 sm:py-0 no-scrollbar">
            <span className="text-[11px] font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap flex items-center gap-1">
              <Globe size={13} className="text-indigo-400" /> Presets:
            </span>
            {[
              { label: "Earth Satellite", icon: Globe, url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200" },
              { label: "Indian Traffic", icon: Car, url: "https://images.unsplash.com/photo-1570125909232-eb263c188f7e?q=80&w=1200" },
              { label: "Urban Topo Map", icon: Building2, url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200" },
              { label: "Drone Aerial", icon: Radio, url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1200" },
              { label: "JWST Deep Space", icon: Sparkles, url: "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?q=80&w=1200" }
            ].map((p, idx) => {
              const PresetIcon = p.icon;
              return (
                <button
                  key={idx}
                  onClick={() => { setImageUrl(p.url); setShowUrlBox(false); toast({ title: `Loaded ${p.label}` }); }}
                  className="text-[11px] px-2.5 py-1 rounded bg-white/10 hover:bg-white hover:text-black text-white whitespace-nowrap transition-colors border border-white/10 font-medium flex items-center gap-1"
                >
                  <PresetIcon size={12} />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>
          <div className="flex flex-1 items-center gap-2">
            <input
              autoFocus
              type="url"
              placeholder="Paste image link/URL here (e.g. https://example.com/image.jpg)…"
              value={customUrl}
              onChange={e => setCustomUrl(e.target.value)}
              onKeyDown={e => {
                if (e.key === "Enter" && customUrl) { setImageUrl(customUrl); setShowUrlBox(false); setCustomUrl(""); toast({ title: "Loaded Custom Image Link" }); }
                if (e.key === "Escape") setShowUrlBox(false);
              }}
              className="flex-1 text-xs bg-white/10 text-white px-3 py-1.5 rounded-lg border border-indigo-400/40 outline-none focus:border-indigo-400 focus:ring-1 focus:ring-indigo-400 placeholder:text-white/40 font-mono"
            />
            <Button
              size="sm"
              type="button"
              variant="outline"
              onClick={async () => {
                try {
                  const text = await navigator.clipboard.readText();
                  if (text && text.startsWith("http")) {
                    setCustomUrl(text);
                    setImageUrl(text);
                    setShowUrlBox(false);
                    toast({ title: "Pasted & Loaded Image Link" });
                  } else {
                    toast({ title: "Clipboard doesn't contain a valid HTTP URL", variant: "destructive" });
                  }
                } catch {
                  toast({ title: "Clipboard access denied", variant: "destructive" });
                }
              }}
              className="h-7 px-2.5 text-xs bg-white/10 text-white hover:bg-white/20 border-white/20 font-medium whitespace-nowrap"
            >
              Paste Link
            </Button>
            <Button size="sm" onClick={() => { if (customUrl) { setImageUrl(customUrl); setShowUrlBox(false); setCustomUrl(""); toast({ title: "Loaded Image Link" }); }}} className="h-7 px-3 text-xs bg-white text-black hover:bg-slate-200 border-0 font-bold whitespace-nowrap">
              Load Link
            </Button>
            <button onClick={() => setShowUrlBox(false)} className="text-white/40 hover:text-white text-xs px-1">✕</button>
          </div>
        </div>
      )}

      {/* ── Modality Viewports ── */}
      <div className="flex-1 flex min-h-0 relative">

        {/* 1. VISION MODALITY */}
        {activeModality === "vision" && (
          <>
            <AnnotationToolbar
              tool={state.tool}
              onSetTool={state.setTool}
              onUndo={state.undo}
              onRedo={state.redo}
              canUndo={state.canUndo}
              canRedo={state.canRedo}
              onUploadImage={() => imageInputRef.current?.click()}
              onToggleUrlBox={() => setShowUrlBox(v => !v)}
            />
            <div className="flex-1 min-w-0">
              <AnnotationCanvas
                imageUrl={imageUrl}
                annotations={state.annotations}
                tool={state.tool}
                activeLabel={state.activeLabel}
                selectedId={state.selectedId}
                onAddAnnotation={state.addAnnotation}
                onSelect={handleSelectForDelete}
                onUpdateAnnotation={state.updateAnnotation}
                onCommitMove={state.commitAnnotationMove}
              />
            </div>
            {/* Desktop Label Panel */}
            <div className="hidden md:flex shrink-0">
              <LabelPanel
                labels={state.labels}
                activeLabel={state.activeLabel}
                annotations={state.annotations}
                selectedId={state.selectedId}
                onSelectLabel={state.setActiveLabel}
                onAddLabel={state.addLabel}
                onSelectAnnotation={state.setSelectedId}
                onDeleteAnnotation={state.deleteAnnotation}
              />
            </div>

            {/* Mobile Drawer Label Panel */}
            {showMobileLabels && (
              <div className="md:hidden fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-end">
                <div className="w-80 max-w-[85vw] h-full bg-[#0c0c1b] border-l border-white/20 flex flex-col p-3 shadow-2xl relative animate-in slide-in-from-right duration-200">
                  <div className="flex items-center justify-between pb-3 border-b border-white/10 mb-2">
                    <span className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
                      <Tag size={14} className="text-indigo-400" /> Labels & Annotations
                    </span>
                    <button onClick={() => setShowMobileLabels(false)} className="text-white/60 hover:text-white text-xs p-1">
                      <X size={16} />
                    </button>
                  </div>
                  <div className="flex-1 overflow-y-auto">
                    <LabelPanel
                      labels={state.labels}
                      activeLabel={state.activeLabel}
                      annotations={state.annotations}
                      selectedId={state.selectedId}
                      onSelectLabel={(l) => { state.setActiveLabel(l); setShowMobileLabels(false); }}
                      onAddLabel={state.addLabel}
                      onSelectAnnotation={state.setSelectedId}
                      onDeleteAnnotation={state.deleteAnnotation}
                    />
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* 2. AUDIO & SPEECH MODALITY */}
        {activeModality === "audio" && (
          <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-y-auto bg-[#0a0b14]">
            {/* Left: Waveform Player & Controls */}
            <div className="flex-1 bg-[#131524] rounded-2xl p-6 border border-[#272b44] shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <Mic className="h-5 w-5 text-white" />
                    <h3 className="text-white font-bold text-lg font-display tracking-tight">Audio Waveform & Segment Annotator</h3>
                  </div>
                  <span className="text-xs font-mono text-white bg-white/10 px-3.5 py-1 rounded-full border border-white/30 font-semibold">
                    Sample: Satellite_Downlink_Audio.wav (44.1kHz, Mono)
                  </span>
                </div>

                {/* Real Internet Audio Stream Presets & URL Bar */}
                <div className="mb-4 bg-[#0b0c16] p-3 rounded-xl border border-[#23263d] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
                      <Music size={12} className="text-purple-400" /> Audio Stream Presets:
                    </span>
                    {[
                      { label: "Apollo Telemetry", icon: Mic, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
                      { label: "Satellite Radio Sweep", icon: Radio, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
                      { label: "Ground Control Command", icon: Activity, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
                      { label: "Ambient Acoustic Stream", icon: Sliders, url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3" }
                    ].map((preset, idx) => {
                      const PresetIcon = preset.icon;
                      return (
                        <button
                          key={idx}
                          onClick={() => {
                            setAudioUrl(preset.url);
                            setIsPlayingAudio(false);
                            toast({ title: `Loaded Audio Stream: ${preset.label}` });
                          }}
                          className={`text-[11px] px-2.5 py-1 rounded transition-colors border font-medium flex items-center gap-1.5 whitespace-nowrap ${
                            audioUrl === preset.url
                              ? "bg-white text-black font-bold border-white"
                              : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                          }`}
                        >
                          <PresetIcon size={12} />
                          <span>{preset.label}</span>
                        </button>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <input
                      type="url"
                      placeholder="Or paste custom MP3/WAV audio URL from internet…"
                      value={customAudioInputUrl}
                      onChange={e => setCustomAudioInputUrl(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && customAudioInputUrl) {
                          setAudioUrl(customAudioInputUrl);
                          setIsPlayingAudio(false);
                          toast({ title: "Loaded Custom Audio URL" });
                          setCustomAudioInputUrl("");
                        }
                      }}
                      className="flex-1 text-xs bg-white/5 text-white px-3 py-1.5 rounded-md border border-white/10 outline-none focus:border-white placeholder:text-white/30"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (customAudioInputUrl) {
                          setAudioUrl(customAudioInputUrl);
                          setIsPlayingAudio(false);
                          toast({ title: "Loaded Custom Audio URL" });
                          setCustomAudioInputUrl("");
                        }
                      }}
                      className="h-7 px-3 text-xs bg-white text-black hover:bg-slate-200 border-0 font-bold"
                    >
                      Load Audio
                    </Button>
                  </div>
                </div>

                {/* Hidden HTML5 Audio Element for playback */}
                <audio
                  ref={audioRef}
                  src={audioUrl}
                  onTimeUpdate={() => setAudioCurrentTime(audioRef.current?.currentTime || 0)}
                  onLoadedMetadata={() => setAudioDuration(audioRef.current?.duration || 15.4)}
                  onEnded={() => setIsPlayingAudio(false)}
                />

                {/* Simulated Waveform Visualizer */}
                <div className="h-36 bg-[#07080f] rounded-xl border border-[#23263d] relative overflow-hidden flex items-center justify-around px-4 gap-1 mb-6 shadow-inner">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const h = Math.abs(Math.sin(i * 0.4) * 80) + 12;
                    const active = (i / 64) * audioDuration <= audioCurrentTime;
                    return (
                      <div
                        key={i}
                        onClick={() => {
                          const targetTime = (i / 64) * audioDuration;
                          setAudioCurrentTime(targetTime);
                          if (audioRef.current) audioRef.current.currentTime = targetTime;
                        }}
                        style={{ height: `${h}%` }}
                        className={`w-1.5 rounded-full cursor-pointer transition-all duration-150 ${
                          active
                            ? "bg-white shadow-[0_0_14px_rgba(255,255,255,0.85)]"
                            : "bg-[#25293d] hover:bg-[#3b415e]"
                        }`}
                      />
                    );
                  })}
                  <div
                    style={{ left: `${(audioCurrentTime / audioDuration) * 100}%` }}
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-[0_0_12px_#ef4444]"
                  />
                </div>

                {/* Controls & Audio AI Action Bar */}
                <div className="flex flex-wrap items-center justify-between bg-[#0c0d18] p-4 rounded-xl border border-[#1e2238] gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => {
                        if (isPlayingAudio) {
                          audioRef.current?.pause();
                          setIsPlayingAudio(false);
                        } else {
                          audioRef.current?.play();
                          setIsPlayingAudio(true);
                        }
                      }}
                      className="p-3 rounded-full bg-white text-slate-950 hover:bg-slate-200 transition-all"
                    >
                      {isPlayingAudio ? <Pause size={18} /> : <Play size={18} className="ml-0.5" />}
                    </button>
                    <div>
                      <p className="text-[11px] text-slate-400 font-medium">Scrubber</p>
                      <p className="text-sm font-mono text-white font-bold tracking-wider">
                        00:{audioCurrentTime.toFixed(1).padStart(4, "0")} <span className="text-slate-600">/</span> 00:{audioDuration.toFixed(1)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap">
                    {/* Whisper ASR Button */}
                    <Button
                      size="sm"
                      onClick={handleWhisperAutoTranscribe}
                      disabled={runningWhisper}
                      className="bg-purple-600 hover:bg-purple-500 text-white font-semibold text-xs gap-1.5 px-3 py-1.5 rounded-lg"
                    >
                      {runningWhisper ? <Loader2 size={13} className="animate-spin" /> : <Mic size={13} />}
                      <span>Whisper Transcribe</span>
                    </Button>

                    {/* VGGish Event Detection Button */}
                    <Button
                      size="sm"
                      onClick={handleVggishAudioEvents}
                      disabled={runningVggish}
                      className="bg-teal-600 hover:bg-teal-500 text-white font-semibold text-xs gap-1.5 px-3 py-1.5 rounded-lg"
                    >
                      {runningVggish ? <Loader2 size={13} className="animate-spin" /> : <Radio size={13} />}
                      <span>VGGish Events</span>
                    </Button>

                    <Button
                      size="sm"
                      onClick={() => setShowAddSegmentBox(v => !v)}
                      className="bg-white/10 hover:bg-white/20 text-white font-medium text-xs border border-white/10 px-3 py-1.5 rounded-lg"
                    >
                      <Plus size={13} className="mr-1" /> Add Segment
                    </Button>
                  </div>
                </div>

                {/* VGGish Detected Sound Events Timeline Display */}
                {vggishEvents.length > 0 && (
                  <div className="mb-6 p-3.5 bg-[#0c0d18] border border-teal-500/20 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-teal-300 flex items-center gap-1.5 font-mono">
                        <Activity size={13} /> VGGish Sound Events ({vggishEvents.length})
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {vggishEvents.map((evt) => (
                        <div key={evt.id} className="px-3 py-1.5 rounded-lg bg-[#141629] border border-[#232742] flex items-center gap-2 text-xs">
                          <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: evt.color || "#3b82f6" }} />
                          <span className="font-semibold text-white">{evt.event}</span>
                          <span className="text-[10px] text-slate-400 font-mono">({evt.start_time} - {evt.end_time})</span>
                          <span className="text-[10px] text-teal-300 font-mono font-bold">{Math.round(evt.confidence * 100)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Custom Segment Input Drawer */}
                {showAddSegmentBox && (
                  <div className="mb-6 p-4 bg-[#07080f] border border-white/20 rounded-xl space-y-3">
                    <p className="text-xs font-bold text-white flex items-center gap-1.5"><PlusCircle size={14} /> Add Custom Audio Segment Transcript</p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Speaker name (e.g. Ground Control / Pilot)"
                        value={newAudioSpeaker}
                        onChange={e => setNewAudioSpeaker(e.target.value)}
                        className="text-xs bg-white/10 text-white px-3 py-1.5 rounded border border-white/20 outline-none w-1/3"
                      />
                      <input
                        type="text"
                        placeholder="Type audio transcript / speech text here…"
                        value={newAudioTranscript}
                        onChange={e => setNewAudioTranscript(e.target.value)}
                        onKeyDown={e => { if (e.key === "Enter") handleAddAudioSegment(); }}
                        className="text-xs bg-white/10 text-white px-3 py-1.5 rounded border border-white/20 outline-none flex-1"
                      />
                      <Button size="sm" onClick={handleAddAudioSegment} className="bg-white text-black font-bold text-xs">Add</Button>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-xs text-slate-400 bg-[#0b0c16] p-3.5 rounded-xl border border-[#23263d] flex items-center gap-2">
                <span className="text-white font-bold">💡 Tip:</span> Click on waveform bars to scrub time. Add speaker tags and transcripts to export diarization datasets.
              </div>
            </div>

            {/* Right: Audio Segments List */}
            <div className="w-full md:w-96 bg-[#131524] rounded-2xl p-6 border border-[#272b44] shadow-2xl flex flex-col">
              <h4 className="text-white font-bold text-sm mb-4 flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Tag size={15} className="text-white" /> Audio Segments
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white text-xs font-mono font-bold border border-white/30">
                  {audioSegments.length}
                </span>
              </h4>
              <div className="space-y-3.5 flex-1 overflow-y-auto pr-1">
                {audioSegments.map((seg) => (
                  <div key={seg.id} className="p-4 rounded-xl bg-[#0c0d18] border border-[#22253b] hover:border-[#343956] transition-all space-y-2.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-white font-bold bg-white/10 px-2.5 py-0.5 rounded border border-white/30">{seg.start} - {seg.end}</span>
                      <span className="px-2.5 py-0.5 rounded bg-white/15 text-white font-bold text-[10px] uppercase border border-white/30">
                        {seg.tag}
                      </span>
                    </div>
                    <p className="text-xs text-slate-200 font-semibold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-white" /> {seg.speaker}
                    </p>
                    <textarea
                      value={seg.transcript}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAudioSegments(audioSegments.map(s => s.id === seg.id ? { ...s, transcript: val } : s));
                      }}
                      className="w-full text-xs bg-[#05060b] text-slate-100 p-3 rounded-lg border border-[#2b304a] outline-none focus:border-white focus:ring-1 focus:ring-white resize-none h-16 transition-all font-sans"
                    />
                    <button
                      onClick={() => setAudioSegments(audioSegments.filter(s => s.id !== seg.id))}
                      className="text-[11px] text-red-400 hover:text-red-300 transition-colors flex items-center gap-1 font-semibold"
                    >
                      <Trash2 size={12} /> Delete segment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. VIDEO TRACKING MODALITY */}
        {activeModality === "video" && (
          <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto bg-[#0a0b14]">
            <div className="flex-1 bg-[#131524] rounded-2xl p-6 border border-[#272b44] shadow-2xl flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <VideoIcon className="h-5 w-5 text-white" />
                  <h3 className="text-white font-bold text-lg font-display">Video & Object Tracking Timeline</h3>
                </div>
                <span className="text-xs font-mono text-white bg-white/15 px-3.5 py-1 rounded-full border border-white/30 font-bold">
                  Frame {videoFrame} / {totalVideoFrames} (30 FPS)
                </span>
              </div>

              {/* Real Internet Video Stream Presets & URL Bar */}
              <div className="mb-4 bg-[#0b0c16] p-3 rounded-xl border border-[#23263d] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto">
                  <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
                    <Globe size={12} className="text-blue-400" /> Internet Video Presets:
                  </span>
                  {[
                    { label: "ISS Earth Orbit", icon: Globe, url: "https://www.w3schools.com/html/mov_bbb.mp4" },
                    { label: "Indian Traffic", icon: Car, url: "https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4" },
                    { label: "Drone Highway", icon: Radio, url: "https://vjs.zencdn.net/v/oceans.mp4" },
                    { label: "Space Launch", icon: Film, url: "https://www.w3schools.com/html/movie.mp4" }
                  ].map((preset, idx) => {
                    const PresetIcon = preset.icon;
                    return (
                      <button
                        key={idx}
                        onClick={() => {
                          setVideoUrl(preset.url);
                          toast({ title: `Loaded Internet Video: ${preset.label}` });
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded transition-colors border font-medium flex items-center gap-1.5 whitespace-nowrap ${
                          videoUrl === preset.url
                            ? "bg-white text-black font-bold border-white"
                            : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                        }`}
                      >
                        <PresetIcon size={12} />
                        <span>{preset.label}</span>
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-2 flex-1 max-w-md">
                  <input
                    type="url"
                    placeholder="Or paste custom MP4 video URL from internet…"
                    value={customVideoInputUrl}
                    onChange={e => setCustomVideoInputUrl(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === "Enter" && customVideoInputUrl) {
                        setVideoUrl(customVideoInputUrl);
                        toast({ title: "Loaded Custom Internet Video URL" });
                        setCustomVideoInputUrl("");
                      }
                    }}
                    className="flex-1 text-xs bg-white/5 text-white px-3 py-1.5 rounded-md border border-white/10 outline-none focus:border-white placeholder:text-white/30"
                  />
                  <Button
                    size="sm"
                    onClick={() => {
                      if (customVideoInputUrl) {
                        setVideoUrl(customVideoInputUrl);
                        toast({ title: "Loaded Custom Internet Video URL" });
                        setCustomVideoInputUrl("");
                      }
                    }}
                    className="h-7 px-3 text-xs bg-white text-black hover:bg-slate-200 border-0 font-bold"
                  >
                    Load URL
                  </Button>
                </div>
              </div>

              {/* Video Frame Canvas / HTML5 Video Player */}
              <div className="h-72 bg-[#06070d] rounded-xl border border-[#23263d] relative overflow-hidden flex items-center justify-center mb-6 shadow-inner">
                {videoUrl ? (
                  <video src={videoUrl} controls autoPlay loop muted className="w-full h-full object-contain bg-black rounded-xl" />
                ) : (
                  <>
                    <img src={DEMO_IMAGE} alt="Video Frame" className="w-full h-full object-cover opacity-75" />
                    <div className="absolute top-12 left-24 border-2 border-white bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-mono font-bold text-white shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                      Track #401: Orbital Debris [Frame {videoFrame}]
                    </div>
                    <div className="absolute bottom-16 right-36 border-2 border-white bg-white/20 backdrop-blur-sm rounded-lg px-3 py-1 text-xs font-mono font-bold text-white shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                      Track #402: Satellite Alpha [Frame {videoFrame}]
                    </div>
                  </>
                )}
              </div>

              {/* Timeline Scrubber */}
              <div className="space-y-2 mb-6 bg-[#0b0c16] p-4 rounded-xl border border-[#23263d]">
                <div className="flex justify-between text-xs text-slate-300 font-mono font-semibold">
                  <span>Frame 0</span>
                  <span className="text-white font-bold">Frame {videoFrame}</span>
                  <span>Frame {totalVideoFrames}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={totalVideoFrames}
                  value={videoFrame}
                  onChange={(e) => setVideoFrame(Number(e.target.value))}
                  className="w-full accent-white cursor-pointer h-2 bg-[#25293d] rounded-lg"
                />
              </div>

              {/* Add Object Track Form Drawer */}
              {showAddTrackBox && (
                <div className="mb-6 p-4 bg-[#07080f] border border-white/20 rounded-xl space-y-3">
                  <p className="text-xs font-bold text-white flex items-center gap-1.5"><PlusCircle size={14} /> Add Custom Video Object Tracking Track</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Track Object Name (e.g. Auto-rickshaw #12 / Drone Alpha)"
                      value={newTrackName}
                      onChange={e => setNewTrackName(e.target.value)}
                      className="text-xs bg-white/10 text-white px-3 py-1.5 rounded border border-white/20 outline-none flex-1"
                    />
                    <select
                      value={newTrackClass}
                      onChange={e => setNewTrackClass(e.target.value)}
                      className="text-xs bg-[#1a1d30] text-white px-3 py-1.5 rounded border border-white/20 outline-none"
                    >
                      <option value="Satellite">Satellite</option>
                      <option value="Orbital Debris">Orbital Debris</option>
                      <option value="Vehicle">Vehicle</option>
                      <option value="Drone">Drone</option>
                    </select>
                    <Button size="sm" onClick={handleAddVideoTrack} className="bg-white text-black font-bold text-xs">Add Track</Button>
                  </div>
                </div>
              )}

              {/* Tracks Table Header */}
              <div className="bg-[#0b0c16] rounded-xl border border-[#23263d] p-4">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                    <Tag size={13} className="text-white" /> Tracked Objects Across Frames
                  </h4>
                  <Button size="sm" onClick={() => setShowAddTrackBox(v => !v)} className="h-6 px-2.5 text-[11px] bg-white text-black font-bold border-0">
                    <Plus size={12} className="mr-1" /> Add New Track
                  </Button>
                </div>
                <div className="space-y-2.5 text-xs">
                  {videoTracks.map((vt) => (
                    <div key={vt.id} className="flex items-center justify-between p-3 rounded-lg bg-[#06070d] border border-[#23263d] hover:border-[#383e5c] transition-all">
                      <span className="font-bold text-white">{vt.name}</span>
                      <span className="text-slate-300 bg-[#1e2238] px-2.5 py-0.5 rounded text-[11px] font-medium">{vt.class}</span>
                      <span className="font-mono text-white font-bold">Frames {vt.startFrame}-{vt.endFrame}</span>
                      <span className="font-mono text-slate-400">{vt.bbox}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. TEXT & RLHF MODALITY */}
        {activeModality === "text_rlhf" && (
          <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-y-auto bg-[#0a0b14]">
            {/* Prompt & NER */}
            <div className="flex-1 bg-[#131524] rounded-2xl p-6 border border-[#272b44] shadow-2xl space-y-6">
              <div>
                <h3 className="text-white font-bold text-lg font-display mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-white" /> Prompt & Entity Tagging (NER)
                </h3>
                <p className="text-xs text-slate-400 mb-4">Select sample domain prompts or type custom prompts to evaluate model alignment & named entities.</p>

                {/* Prompt Presets Bar */}
                <div className="mb-4 flex flex-wrap gap-1.5">
                  <span className="text-[11px] font-semibold text-slate-400 self-center mr-1">Presets:</span>
                  {[
                    {
                      label: "NORAD Orbital Hazard",
                      prompt: "Analyze potential collision hazards for Satellite NORAD-49210 over South Asia given polar orbital telemetry.",
                      tokens: [
                        { text: "NORAD-49210", tag: "SATELLITE_ID", color: "bg-blue-500/20 text-blue-300 border-blue-500/40" },
                        { text: "South Asia", tag: "GEO_LOCATION", color: "bg-green-500/20 text-green-300 border-green-500/40" },
                        { text: "polar orbital", tag: "ORBIT_TYPE", color: "bg-purple-500/20 text-purple-300 border-purple-500/40" }
                      ]
                    },
                    {
                      label: "ISRO Hindi VQA",
                      prompt: "सैमयम-1 उपग्रह की कक्षा और सौर पैनल स्थिति रिपोर्ट का हिंदी में विश्लेषण करें।",
                      tokens: [
                        { text: "सैमयम-1", tag: "SATELLITE_NAME", color: "bg-orange-500/20 text-orange-300 border-orange-500/40" },
                        { text: "सौर पैनल स्थिति", tag: "TELEMETRY_ITEM", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/40" }
                      ]
                    },
                    {
                      label: "NHAI Traffic Bottleneck",
                      prompt: "Identify high-density vehicle bottlenecks on Bengaluru Outer Ring Road during monsoon peak hours.",
                      tokens: [
                        { text: "Bengaluru Outer Ring Road", tag: "LOCATION", color: "bg-green-500/20 text-green-300 border-green-500/40" },
                        { text: "high-density vehicle", tag: "TRAFFIC_CLASS", color: "bg-red-500/20 text-red-300 border-red-500/40" }
                      ]
                    }
                  ].map((p, idx) => (
                    <button
                      key={idx}
                      onClick={() => {
                        setRlhfPrompt(p.prompt);
                        setNerTokens(p.tokens);
                        toast({ title: `Loaded Prompt: ${p.label}` });
                      }}
                      className="text-[11px] px-2.5 py-1 rounded bg-white/10 hover:bg-white hover:text-black text-white font-medium border border-white/20 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>

                <textarea
                  value={rlhfPrompt}
                  onChange={e => setRlhfPrompt(e.target.value)}
                  className="w-full p-4 rounded-xl bg-[#06070d] border border-[#23263d] text-sm leading-relaxed text-slate-100 font-medium shadow-inner outline-none focus:border-white resize-none h-28"
                  placeholder="Type or paste custom prompt here…"
                />
              </div>

              <div>
                <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3">Extracted Entities</h4>
                <div className="flex flex-wrap gap-2.5">
                  {nerTokens.map((tok, i) => (
                    <span key={i} className={`px-3 py-1.5 rounded-lg text-xs font-mono border font-semibold shadow-sm ${tok.color}`}>
                      {tok.text} <span className="text-[10px] opacity-80 font-normal">[{tok.tag}]</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RLHF Preference Ranking */}
            <div className="flex-1 bg-[#131524] rounded-2xl p-6 border border-[#272b44] shadow-2xl space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-bold text-lg font-display mb-2 flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-white" /> RLHF Model Response Preference
                </h3>
                <p className="text-xs text-slate-400 mb-6">Compare Model A vs Model B output and select the better response for alignment training.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Model A */}
                  <div
                    onClick={() => setRlhfRank("A")}
                    className={`p-5 rounded-xl border cursor-pointer transition-all ${
                      rlhfRank === "A"
                        ? "bg-white/15 border-white shadow-[0_0_25px_rgba(255,255,255,0.35)] scale-[1.02]"
                        : "bg-[#06070d] border-[#23263d] hover:border-[#3b4160] text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Model Response A</span>
                      {rlhfRank === "A" && <CheckCircle size={16} className="text-white" />}
                    </div>
                    <p className="text-xs text-slate-100 leading-relaxed mb-4 font-medium">
                      "Orbital calculation indicates NORAD-49210 will maintain a safe distance of 14.2 km from nearest debris cluster during South Asia pass at 14:22 UTC."
                    </p>
                    <div className="text-[11px] text-slate-400 font-mono font-semibold">Score: {rlhfScoreA}/5 · Helpful & Accurate</div>
                  </div>

                  {/* Model B */}
                  <div
                    onClick={() => setRlhfRank("B")}
                    className={`p-5 rounded-xl border cursor-pointer transition-all ${
                      rlhfRank === "B"
                        ? "bg-white/20 border-white shadow-[0_0_25px_rgba(255,255,255,0.35)] scale-[1.02]"
                        : "bg-[#06070d] border-[#23263d] hover:border-[#3b4160] text-white"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-white uppercase tracking-wider">Model Response B</span>
                      {rlhfRank === "B" && <CheckCircle size={16} className="text-white" />}
                    </div>
                    <p className="text-xs text-slate-100 leading-relaxed mb-4 font-medium">
                      "Satellite is fine. No issues detected in orbit."
                    </p>
                    <div className="text-[11px] text-slate-400 font-mono font-semibold">Score: {rlhfScoreB}/5 · Too Brief</div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-slate-300 bg-[#0b0c16] p-4 rounded-xl border border-[#23263d] font-mono">
                Selected Preference: <span className="text-white font-bold text-sm">Model {rlhfRank ?? "None"}</span> — Exporting will record this pair for PPO / DPO fine-tuning.
              </div>
            </div>
          </div>
        )}

        {/* 5. SAR RADAR & SENSOR FUSION MODALITY */}
        {activeModality === "sar_radar" && (
          <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-y-auto bg-[#0a0b14]">
            <div className="flex-1 bg-[#131524] rounded-2xl p-6 border border-[#272b44] shadow-2xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2.5">
                    <Radar className="h-5 w-5 text-white" />
                    <h3 className="text-white font-bold text-lg font-display">Polarimetric SAR Radar & Multispectral Fusion</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {["VV", "VH", "RGB", "Thermal"].map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBand(b as any)}
                        className={`px-3.5 py-1.5 rounded-lg text-xs font-mono font-bold transition-all ${
                          selectedBand === b
                            ? "bg-white text-slate-950 shadow-[0_0_12px_rgba(255,255,255,0.6)]"
                            : "bg-[#1e2238] text-slate-300 hover:text-white hover:bg-[#282d4a]"
                        }`}
                      >
                        {b} Band
                      </button>
                    ))}
                  </div>
                </div>

                {/* Internet SAR Radar Presets & URL Loader Bar */}
                <div className="mb-4 bg-[#0b0c16] p-3 rounded-xl border border-[#23263d] flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                  <div className="flex items-center gap-1.5 overflow-x-auto">
                    <span className="text-[11px] font-semibold text-slate-400 whitespace-nowrap flex items-center gap-1">
                      <Radar size={12} className="text-cyan-400" /> SAR Satellite Presets:
                    </span>
                    {[
                      { label: "Sentinel-1 VV SAR", band: "VV", url: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1200" },
                      { label: "Sentinel-1 VH Cross", band: "VH", url: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?q=80&w=1200" },
                      { label: "ISRO Thermal IR", band: "Thermal", url: "https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?q=80&w=1200" },
                      { label: "Bhuvan Crop Index", band: "RGB", url: "https://images.unsplash.com/photo-1506703719100-a0f3a48c0f86?q=80&w=1200" }
                    ].map((preset, idx) => (
                      <button
                        key={idx}
                        onClick={() => {
                          setSarImageUrl(preset.url);
                          setSelectedBand(preset.band as any);
                          toast({ title: `Loaded SAR Radar Preset: ${preset.label}` });
                        }}
                        className={`text-[11px] px-2.5 py-1 rounded transition-colors border font-medium flex items-center gap-1.5 whitespace-nowrap ${
                          sarImageUrl === preset.url
                            ? "bg-white text-black font-bold border-white"
                            : "bg-white/10 hover:bg-white/20 text-white border-white/20"
                        }`}
                      >
                        <Radar size={12} />
                        <span>{preset.label}</span>
                      </button>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 flex-1 max-w-md">
                    <input
                      type="url"
                      placeholder="Or paste custom SAR satellite image URL…"
                      value={customSarInputUrl}
                      onChange={e => setCustomSarInputUrl(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === "Enter" && customSarInputUrl) {
                          setSarImageUrl(customSarInputUrl);
                          toast({ title: "Loaded Custom SAR Image URL" });
                          setCustomSarInputUrl("");
                        }
                      }}
                      className="flex-1 text-xs bg-white/5 text-white px-3 py-1.5 rounded-md border border-white/10 outline-none focus:border-white placeholder:text-white/30"
                    />
                    <Button
                      size="sm"
                      onClick={() => {
                        if (customSarInputUrl) {
                          setSarImageUrl(customSarInputUrl);
                          toast({ title: "Loaded Custom SAR Image URL" });
                          setCustomSarInputUrl("");
                        }
                      }}
                      className="h-7 px-3 text-xs bg-white text-black hover:bg-slate-200 border-0 font-bold"
                    >
                      Load SAR
                    </Button>
                  </div>
                </div>

                {/* Canvas Simulator for SAR */}
                <div className="h-80 bg-[#06070d] rounded-xl border border-[#23263d] relative overflow-hidden flex items-center justify-center mb-6 shadow-inner">
                  <img src={sarImageUrl} alt="SAR Radar" className="w-full h-full object-cover mix-blend-difference" style={{ opacity: opacityOverlay / 100 }} />
                  <div className="absolute top-4 left-4 bg-[#0a0b14]/90 backdrop-blur-md p-4 rounded-xl border border-[#282c44] text-xs font-mono space-y-1.5 text-slate-100 shadow-xl">
                    <div>Polarization: <span className="text-white font-bold">{selectedBand}</span></div>
                    <div>Wavelength: <span className="text-white font-bold">5.55 cm (C-band)</span></div>
                    <div>Incidence Angle: <span className="text-white font-bold">38.2°</span></div>
                  </div>
                </div>

                {/* Opacity slider */}
                <div className="space-y-2 bg-[#0b0c16] p-4 rounded-xl border border-[#23263d]">
                  <div className="flex justify-between text-xs text-slate-300 font-semibold">
                    <span>Optical Base Layer</span>
                    <span className="text-white font-bold">SAR Radar Overlay ({opacityOverlay}%)</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={opacityOverlay}
                    onChange={(e) => setOpacityOverlay(Number(e.target.value))}
                    className="w-full accent-white cursor-pointer h-2 bg-[#25293d] rounded-lg"
                  />
                </div>

                {/* Monopoly Suite: Indic Voice & Instant Multi-Format Export */}
                <div className="mt-8 space-y-6">
                  <IndicVoiceAnnotator />
                  <MonopolyExportSuite />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Active Learning Queue Dialog Modal */}
        <Dialog open={showActiveLearningModal} onOpenChange={setShowActiveLearningModal}>
          <DialogContent className="max-w-3xl bg-[#0c0d18] border-[#25283d] text-white p-6 rounded-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold font-display text-white flex items-center gap-2">
                <Cpu className="h-5 w-5 text-white" /> Active Learning Priority Queue
              </DialogTitle>
            </DialogHeader>
            <ActiveLearningPanel
              onSelectTask={(taskId) => {
                setShowActiveLearningModal(false);
                toast({ title: `Loaded Task ${taskId}`, description: "Prioritized by AI model uncertainty" });
              }}
            />
          </DialogContent>
        </Dialog>

      </div>
    </div>
  );
}
