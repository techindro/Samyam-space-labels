import { useEffect, useState, useCallback, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAnnotationState, DEFAULT_LABELS, type Annotation } from "@/components/annotation/useAnnotationState";
import AnnotationCanvas   from "@/components/annotation/AnnotationCanvas";
import AnnotationToolbar  from "@/components/annotation/AnnotationToolbar";
import LabelPanel         from "@/components/annotation/LabelPanel";
import { Button }         from "@/components/ui/button";
import { useToast }       from "@/hooks/use-toast";
import { 
  Save, Download, ArrowLeft, Loader2, AlertCircle, Tag, Image as ImageIcon,
  Mic, Video as VideoIcon, FileText, Radar, Play, Pause, Plus, Trash2,
  Sparkles, ThumbsUp, ThumbsDown, Layers, Activity, Sliders, CheckCircle
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

  // Task data
  const [task,       setTask]       = useState<Record<string, any> | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [saving,     setSaving]     = useState(false);
  const [imageUrl,   setImageUrl]   = useState<string>(DEMO_IMAGE);
  const [customUrl,  setCustomUrl]  = useState("");
  const [showUrlBox, setShowUrlBox] = useState(false);

  // Annotation state for Vision
  const state = useAnnotationState();

  // ── Audio Modality State ──
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

  // ── Load task from Supabase ──
  useEffect(() => {
    if (!taskId || taskId === "demo") {
      setLoading(false);
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
        }
      });
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
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); handleSave(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [activeModality, state]);

  // ── Save ──
  const handleSave = useCallback(async () => {
    if (!taskId || taskId === "demo") {
      toast({ title: "✓ Demo Annotations Saved", description: `Saved ${activeModality.toUpperCase()} annotations in memory.` });
      return;
    }
    setSaving(true);
    const { error: err } = await supabase
      .from("annotation_tasks")
      .update({
        result: { annotations: state.annotations, labels: state.labels, modality: activeModality },
        status: "in_progress",
        updated_at: new Date().toISOString(),
      })
      .eq("id", taskId);
    setSaving(false);
    if (err) {
      toast({ title: "Save failed", description: err.message, variant: "destructive" });
    } else {
      toast({ title: "✓ Annotations saved!" });
    }
  }, [taskId, state.annotations, state.labels, activeModality, toast]);

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

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `samyam_${activeModality}_${taskId ?? "demo"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: `Exported ${activeModality.toUpperCase()} JSON` });
  }, [activeModality, state.annotations, state.labels, audioSegments, totalVideoFrames, videoTracks, rlhfPrompt, rlhfRank, nerTokens, selectedBand, opacityOverlay, task, taskId, toast]);

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
    <div className="h-screen flex flex-col bg-[#0d0d1a] overflow-hidden select-none">

      {/* ── Top Bar ── */}
      <header className="shrink-0 flex items-center justify-between gap-3 px-4 h-12 border-b border-white/10 bg-[#0f0f1e]">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="text-white/40 hover:text-white transition-colors shrink-0" title="Back">
            <ArrowLeft size={18} />
          </button>
          <div>
            <p className="text-white font-medium text-sm truncate max-w-[200px]">
              {task?.title ?? "Multimodal Labeling Workspace"}
            </p>
          </div>
          {task?.status && (
            <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide ${statusColors[task.status] ?? ""}`}>
              {task.status.replace("_", " ")}
            </span>
          )}
        </div>

        {/* Modality Switcher Tabs */}
        <div className="flex items-center gap-1 bg-white/5 p-1 rounded-lg border border-white/10">
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
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-all ${
                  active
                    ? "bg-cosmic-purple text-white shadow-sm"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <Icon size={13} />
                <span className="hidden md:inline">{m.label}</span>
              </button>
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          {/* Devanagari Keyboard Toggle */}
          <Button
            size="sm"
            variant="outline"
            onClick={() => setShowHindiKb(v => !v)}
            className={`h-7 px-2.5 text-xs border-white/20 gap-1 transition-colors ${
              showHindiKb ? "bg-cosmic-teal text-black font-bold border-cosmic-teal" : "text-white/80 hover:text-white"
            }`}
          >
            <span>क/A</span>
            <span className="hidden sm:inline">Hindi Keyboard</span>
          </Button>

          {activeModality === "vision" && (
            <button title="Change image URL" onClick={() => setShowUrlBox(v => !v)} className="text-white/40 hover:text-white transition-colors mr-2">
              <ImageIcon size={16} />
            </button>
          )}
          <Button size="sm" variant="outline" onClick={handleExport} className="h-7 px-3 text-xs border-white/20 text-white/70 hover:text-white hover:border-white/40 gap-1.5">
            <Download size={13} /> Export JSON
          </Button>
          <Button size="sm" onClick={handleSave} disabled={saving} className="h-7 px-3 text-xs bg-cosmic-purple hover:bg-cosmic-purple/90 text-white border-0 gap-1.5">
            {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
            Save
          </Button>
        </div>
      </header>

      {/* ── Devanagari (Hindi) On-Screen Keyboard Drawer ── */}
      {showHindiKb && (
        <div className="shrink-0 bg-[#121225] border-b border-cosmic-teal/40 p-3 shadow-xl z-20">
          <div className="flex items-center justify-between mb-2 px-1">
            <span className="text-xs font-semibold text-cosmic-teal flex items-center gap-1.5">
              <span>⌨️</span> Devanagari (देवनागरी/हिन्दी) On-Screen Keyboard Pad
            </span>
            <span className="text-[10px] text-white/50">Click any character to copy to clipboard & insert into annotations</span>
            <button onClick={() => setShowHindiKb(false)} className="text-white/40 hover:text-white text-xs">✕ Close</button>
          </div>
          <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto pr-1">
            {DEVANAGARI_CHARS.map((char, i) => (
              <button
                key={i}
                onClick={() => {
                  navigator.clipboard.writeText(char);
                  toast({ title: `Copied '${char}'` });
                }}
                className="px-2.5 py-1 rounded bg-white/10 hover:bg-cosmic-teal hover:text-black font-mono text-sm text-white transition-colors border border-white/5"
              >
                {char}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ── Image URL Input ── */}
      {showUrlBox && activeModality === "vision" && (
        <div className="shrink-0 flex items-center gap-2 px-4 py-2 bg-[#0f0f1e] border-b border-white/10">
          <input
            autoFocus
            type="url"
            placeholder="Paste image URL here…"
            value={customUrl}
            onChange={e => setCustomUrl(e.target.value)}
            onKeyDown={e => {
              if (e.key === "Enter" && customUrl) { setImageUrl(customUrl); setShowUrlBox(false); setCustomUrl(""); }
              if (e.key === "Escape") setShowUrlBox(false);
            }}
            className="flex-1 text-xs bg-white/5 text-white px-3 py-1.5 rounded-md border border-white/10 outline-none focus:border-cosmic-purple/60 placeholder:text-white/25"
          />
          <Button size="sm" onClick={() => { if (customUrl) { setImageUrl(customUrl); setShowUrlBox(false); setCustomUrl(""); }}} className="h-7 px-3 text-xs bg-cosmic-purple text-white border-0">
            Load
          </Button>
          <button onClick={() => setShowUrlBox(false)} className="text-white/40 hover:text-white text-xs">✕</button>
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
          </>
        )}

        {/* 2. AUDIO & SPEECH MODALITY */}
        {activeModality === "audio" && (
          <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-y-auto">
            {/* Left: Waveform Player & Controls */}
            <div className="flex-1 glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-2">
                    <Mic className="h-5 w-5 text-cosmic-teal" />
                    <h3 className="text-white font-semibold text-lg">Audio Waveform & Segment Annotator</h3>
                  </div>
                  <span className="text-xs font-mono text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                    Sample: Satellite_Downlink_Audio.wav (44.1kHz, Mono)
                  </span>
                </div>

                {/* Simulated Waveform Visualizer */}
                <div className="h-32 bg-black/40 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-around px-4 gap-1 mb-6">
                  {Array.from({ length: 64 }).map((_, i) => {
                    const h = Math.abs(Math.sin(i * 0.4) * 80) + 10;
                    const active = (i / 64) * audioDuration <= audioCurrentTime;
                    return (
                      <div
                        key={i}
                        style={{ height: `${h}%` }}
                        className={`w-1.5 rounded-full transition-colors ${active ? "bg-cosmic-teal" : "bg-white/20"}`}
                      />
                    );
                  })}
                  <div
                    style={{ left: `${(audioCurrentTime / audioDuration) * 100}%` }}
                    className="absolute top-0 bottom-0 w-0.5 bg-red-500 shadow-[0_0_10px_#ef4444]"
                  />
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between bg-white/5 p-4 rounded-xl border border-white/10 mb-6">
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => setIsPlayingAudio(!isPlayingAudio)}
                      className="p-3 rounded-full bg-cosmic-purple text-white hover:opacity-90 transition-opacity"
                    >
                      {isPlayingAudio ? <Pause size={18} /> : <Play size={18} />}
                    </button>
                    <div>
                      <p className="text-xs text-white/50">Timestamp</p>
                      <p className="text-sm font-mono text-white font-semibold">
                        00:{audioCurrentTime.toFixed(1).padStart(4, "0")} / 00:{audioDuration.toFixed(1)}
                      </p>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => {
                      const newSeg = {
                        id: `aud-${Date.now()}`,
                        start: `00:${audioCurrentTime.toFixed(1)}`,
                        end: `00:${(audioCurrentTime + 3).toFixed(1)}`,
                        speaker: "Speaker 1",
                        tag: "Annotated Region",
                        transcript: "New audio transcript segment...",
                      };
                      setAudioSegments([...audioSegments, newSeg]);
                      toast({ title: "Added Audio Segment" });
                    }}
                    className="bg-cosmic-teal hover:bg-cosmic-teal/90 text-black font-semibold text-xs border-0"
                  >
                    <Plus size={14} className="mr-1" /> Add Segment Here
                  </Button>
                </div>
              </div>

              <div className="text-xs text-white/40">
                Tip: Click on waveform bars to scrub time. Add speaker tags and transcripts to export diarization datasets.
              </div>
            </div>

            {/* Right: Audio Segments List */}
            <div className="w-full md:w-96 glass-card rounded-2xl p-6 border border-white/10 flex flex-col">
              <h4 className="text-white font-semibold text-sm mb-4 flex items-center gap-2">
                <Tag size={14} className="text-cosmic-teal" /> Audio Segments ({audioSegments.length})
              </h4>
              <div className="space-y-3 flex-1 overflow-y-auto pr-1">
                {audioSegments.map((seg) => (
                  <div key={seg.id} className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-mono text-cosmic-teal font-semibold">{seg.start} - {seg.end}</span>
                      <span className="px-2 py-0.5 rounded bg-cosmic-purple/20 text-cosmic-purple font-semibold text-[10px] uppercase">
                        {seg.tag}
                      </span>
                    </div>
                    <p className="text-xs text-white font-medium">{seg.speaker}</p>
                    <textarea
                      value={seg.transcript}
                      onChange={(e) => {
                        const val = e.target.value;
                        setAudioSegments(audioSegments.map(s => s.id === seg.id ? { ...s, transcript: val } : s));
                      }}
                      className="w-full text-xs bg-black/40 text-white/80 p-2 rounded border border-white/10 outline-none focus:border-cosmic-teal resize-none h-14"
                    />
                    <button
                      onClick={() => setAudioSegments(audioSegments.filter(s => s.id !== seg.id))}
                      className="text-[10px] text-red-400 hover:underline flex items-center gap-1"
                    >
                      <Trash2 size={10} /> Delete segment
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* 3. VIDEO TRACKING MODALITY */}
        {activeModality === "video" && (
          <div className="flex-1 flex flex-col p-6 gap-6 overflow-y-auto">
            <div className="flex-1 glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                  <VideoIcon className="h-5 w-5 text-cosmic-purple" />
                  <h3 className="text-white font-semibold text-lg">Video & Object Tracking Timeline</h3>
                </div>
                <span className="text-xs font-mono text-white/50 bg-white/5 px-3 py-1 rounded-full border border-white/10">
                  Frame {videoFrame} / {totalVideoFrames} (30 FPS)
                </span>
              </div>

              {/* Video Frame Canvas Simulator */}
              <div className="h-64 bg-black/60 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center mb-6">
                <img src={DEMO_IMAGE} alt="Video Frame" className="w-full h-full object-cover opacity-60" />
                <div className="absolute top-12 left-24 border-2 border-cosmic-teal bg-cosmic-teal/10 rounded px-2 py-1 text-[10px] font-mono text-cosmic-teal">
                  Track #401: Orbital Debris [Frame {videoFrame}]
                </div>
                <div className="absolute bottom-16 right-36 border-2 border-cosmic-purple bg-cosmic-purple/10 rounded px-2 py-1 text-[10px] font-mono text-cosmic-purple">
                  Track #402: Satellite Alpha [Frame {videoFrame}]
                </div>
              </div>

              {/* Timeline Scrubber */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-xs text-white/50 font-mono">
                  <span>Frame 0</span>
                  <span>Frame {videoFrame}</span>
                  <span>Frame {totalVideoFrames}</span>
                </div>
                <input
                  type="range"
                  min={1}
                  max={totalVideoFrames}
                  value={videoFrame}
                  onChange={(e) => setVideoFrame(Number(e.target.value))}
                  className="w-full accent-cosmic-purple cursor-pointer"
                />
              </div>

              {/* Tracks Table */}
              <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                <h4 className="text-xs font-semibold text-white mb-3">Tracked Objects Across Frames</h4>
                <div className="space-y-2 text-xs">
                  {videoTracks.map((vt) => (
                    <div key={vt.id} className="flex items-center justify-between p-2 rounded bg-black/40 border border-white/10">
                      <span className="font-medium text-white">{vt.name}</span>
                      <span className="text-white/50">{vt.class}</span>
                      <span className="font-mono text-cosmic-teal">Frames {vt.startFrame}-{vt.endFrame}</span>
                      <span className="font-mono text-white/40">{vt.bbox}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 4. TEXT & RLHF MODALITY */}
        {activeModality === "text_rlhf" && (
          <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-y-auto">
            {/* Prompt & NER */}
            <div className="flex-1 glass-card rounded-2xl p-6 border border-white/10 space-y-6">
              <div>
                <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-cosmic-teal" /> Prompt & Entity Tagging (NER)
                </h3>
                <p className="text-xs text-white/50 mb-4">Highlight tokens to tag Named Entities or evaluate model alignment.</p>
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 text-sm leading-relaxed text-white">
                  {rlhfPrompt}
                </div>
              </div>

              <div>
                <h4 className="text-xs font-semibold text-white/70 mb-3">Extracted Entities</h4>
                <div className="flex flex-wrap gap-2">
                  {nerTokens.map((tok, i) => (
                    <span key={i} className={`px-2.5 py-1 rounded-md text-xs font-mono border ${tok.color}`}>
                      {tok.text} <span className="text-[10px] opacity-70">[{tok.tag}]</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* RLHF Preference Ranking */}
            <div className="flex-1 glass-card rounded-2xl p-6 border border-white/10 space-y-6 flex flex-col justify-between">
              <div>
                <h3 className="text-white font-semibold text-lg mb-2 flex items-center gap-2">
                  <ThumbsUp className="h-5 w-5 text-cosmic-purple" /> RLHF Model Response Preference
                </h3>
                <p className="text-xs text-white/50 mb-6">Compare Model A vs Model B output and select the better response for alignment training.</p>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  {/* Model A */}
                  <div
                    onClick={() => setRlhfRank("A")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      rlhfRank === "A"
                        ? "bg-cosmic-purple/20 border-cosmic-purple shadow-[0_0_20px_rgba(139,92,246,0.3)]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-cosmic-purple uppercase">Model Response A</span>
                      {rlhfRank === "A" && <CheckCircle size={14} className="text-cosmic-purple" />}
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed mb-4">
                      "Orbital calculation indicates NORAD-49210 will maintain a safe distance of 14.2 km from nearest debris cluster during South Asia pass at 14:22 UTC."
                    </p>
                    <div className="text-[10px] text-white/40 font-mono">Score: {rlhfScoreA}/5 · Helpful & Accurate</div>
                  </div>

                  {/* Model B */}
                  <div
                    onClick={() => setRlhfRank("B")}
                    className={`p-4 rounded-xl border cursor-pointer transition-all ${
                      rlhfRank === "B"
                        ? "bg-cosmic-teal/20 border-cosmic-teal shadow-[0_0_20px_rgba(20,184,166,0.3)]"
                        : "bg-white/5 border-white/10 hover:border-white/20"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-cosmic-teal uppercase">Model Response B</span>
                      {rlhfRank === "B" && <CheckCircle size={14} className="text-cosmic-teal" />}
                    </div>
                    <p className="text-xs text-white/80 leading-relaxed mb-4">
                      "Satellite is fine. No issues detected in orbit."
                    </p>
                    <div className="text-[10px] text-white/40 font-mono">Score: {rlhfScoreB}/5 · Too Brief</div>
                  </div>
                </div>
              </div>

              <div className="text-xs text-white/40 bg-white/5 p-3 rounded-xl border border-white/10">
                Selected Preference: <span className="text-white font-bold">Model {rlhfRank ?? "None"}</span> — Exporting will record this pair for PPO / DPO fine-tuning.
              </div>
            </div>
          </div>
        )}

        {/* 5. SAR RADAR & SENSOR FUSION MODALITY */}
        {activeModality === "sar_radar" && (
          <div className="flex-1 flex flex-col md:flex-row p-6 gap-6 overflow-y-auto">
            <div className="flex-1 glass-card rounded-2xl p-6 border border-white/10 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <Radar className="h-5 w-5 text-cosmic-teal" />
                    <h3 className="text-white font-semibold text-lg">Polarimetric SAR Radar & Multispectral Fusion</h3>
                  </div>
                  <div className="flex items-center gap-2">
                    {["VV", "VH", "RGB", "Thermal"].map((b) => (
                      <button
                        key={b}
                        onClick={() => setSelectedBand(b as any)}
                        className={`px-3 py-1 rounded-md text-xs font-mono font-bold transition-all ${
                          selectedBand === b
                            ? "bg-cosmic-teal text-black"
                            : "bg-white/10 text-white/70 hover:text-white"
                        }`}
                      >
                        {b} Band
                      </button>
                    ))}
                  </div>
                </div>

                {/* Canvas Simulator for SAR */}
                <div className="h-72 bg-black/80 rounded-xl border border-white/10 relative overflow-hidden flex items-center justify-center mb-6">
                  <img src={DEMO_IMAGE} alt="SAR Radar" className="w-full h-full object-cover mix-blend-difference" style={{ opacity: opacityOverlay / 100 }} />
                  <div className="absolute top-4 left-4 bg-black/70 p-3 rounded-lg border border-white/20 text-xs font-mono space-y-1 text-white">
                    <div>Polarization: <span className="text-cosmic-teal">{selectedBand}</span></div>
                    <div>Wavelength: <span className="text-cosmic-purple">5.55 cm (C-band)</span></div>
                    <div>Incidence Angle: <span className="text-yellow-400">38.2°</span></div>
                  </div>
                </div>

                {/* Opacity slider */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs text-white/50">
                    <span>Optical Base Layer</span>
                    <span>SAR Radar Overlay ({opacityOverlay}%)</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={opacityOverlay}
                    onChange={(e) => setOpacityOverlay(Number(e.target.value))}
                    className="w-full accent-cosmic-teal cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
