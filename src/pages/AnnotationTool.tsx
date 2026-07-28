import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAnnotationState, DEFAULT_LABELS, type Annotation, type LabelClass } from "@/components/annotation/useAnnotationState";
import AnnotationCanvas   from "@/components/annotation/AnnotationCanvas";
import AnnotationToolbar  from "@/components/annotation/AnnotationToolbar";
import LabelPanel         from "@/components/annotation/LabelPanel";
import { Button }         from "@/components/ui/button";
import { useToast }       from "@/hooks/use-toast";
import { Save, Download, ArrowLeft, Loader2, AlertCircle, Tag, Image as ImageIcon } from "lucide-react";

// ─── Status badge ────────────────────────────────────────────────────────────

const statusColors: Record<string, string> = {
  pending:     "bg-yellow-500/20 text-yellow-400 border-yellow-500/30",
  in_progress: "bg-blue-500/20   text-blue-400   border-blue-500/30",
  completed:   "bg-green-500/20  text-green-400  border-green-500/30",
  rejected:    "bg-red-500/20    text-red-400    border-red-500/30",
};

// ─── Fallback demo image ──────────────────────────────────────────────────────

const DEMO_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c9/ISS-44_Jeff_Williams_takes_a_nadir-looking_view_of_Earth.jpg/1280px-ISS-44_Jeff_Williams_takes_a_nadir-looking_view_of_Earth.jpg";

// ─── Component ───────────────────────────────────────────────────────────────

export default function AnnotationTool() {
  const { taskId } = useParams<{ taskId: string }>();
  const navigate   = useNavigate();
  const { toast }  = useToast();

  // Task data
  const [task,       setTask]       = useState<Record<string, any> | null>(null);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string | null>(null);
  const [saving,     setSaving]     = useState(false);
  const [imageUrl,   setImageUrl]   = useState<string>(DEMO_IMAGE);
  const [customUrl,  setCustomUrl]  = useState("");
  const [showUrlBox, setShowUrlBox] = useState(false);

  // Annotation state
  const state = useAnnotationState();

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

        // Image URL from payload
        const payload = data.payload as Record<string, any>;
        if (payload?.imageUrl) setImageUrl(payload.imageUrl);

        // Restore saved annotations
        const result = data.result as Record<string, any> | null;
        if (result?.annotations) {
          state.setAnnotations(result.annotations as Annotation[]);
        }
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [taskId]);

  // ── Keyboard shortcuts ──

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key === "v" || e.key === "V") state.setTool("select");
      if (e.key === "b" || e.key === "B") state.setTool("bbox");
      if (e.key === "p" || e.key === "P") state.setTool("polygon");
      if (e.key === "d" || e.key === "D") state.setTool("delete");
      if ((e.ctrlKey || e.metaKey) && e.key === "z") { e.preventDefault(); state.undo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "y") { e.preventDefault(); state.redo(); }
      if ((e.ctrlKey || e.metaKey) && e.key === "s") { e.preventDefault(); handleSave(); }
      if ((e.key === "Delete" || e.key === "Backspace") && state.selectedId) {
        if (!(e.target instanceof HTMLInputElement)) state.deleteSelected();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state.selectedId, state.undo, state.redo, state.deleteSelected]);

  // ── Save ──

  const handleSave = useCallback(async () => {
    if (!taskId || taskId === "demo") {
      toast({ title: "Demo mode — save not persisted" });
      return;
    }
    setSaving(true);
    const { error: err } = await supabase
      .from("annotation_tasks")
      .update({
        result: { annotations: state.annotations, labels: state.labels },
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
  }, [taskId, state.annotations, state.labels, toast]);

  // ── Export COCO JSON ──

  const handleExport = useCallback(() => {
    const coco = {
      info: {
        description: task?.title ?? "Samyam Annotation",
        date_created: new Date().toISOString(),
        version: "1.0",
      },
      images: [{ id: 1, file_name: imageUrl.split("/").pop() ?? "image", url: imageUrl }],
      categories: state.labels.map((l, i) => ({ id: i + 1, name: l.name, color: l.color })),
      annotations: state.annotations.map((ann, i) => {
        const catId = state.labels.findIndex(l => l.name === ann.label) + 1;
        if (ann.type === "bbox") {
          return {
            id: i + 1, image_id: 1, category_id: catId,
            bbox: [ann.bbox.x, ann.bbox.y, ann.bbox.w, ann.bbox.h],
            area: ann.bbox.w * ann.bbox.h,
            type: "bbox",
          };
        } else {
          const flat = ann.points.flat();
          const xs   = ann.points.map(p => p[0]);
          const ys   = ann.points.map(p => p[1]);
          return {
            id: i + 1, image_id: 1, category_id: catId,
            segmentation: [flat],
            bbox: [Math.min(...xs), Math.min(...ys), Math.max(...xs) - Math.min(...xs), Math.max(...ys) - Math.min(...ys)],
            area: 0,
            type: "polygon",
          };
        }
      }),
    };

    const blob = new Blob([JSON.stringify(coco, null, 2)], { type: "application/json" });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement("a");
    a.href     = url;
    a.download = `annotations_${taskId ?? "demo"}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast({ title: "Exported COCO JSON" });
  }, [state.annotations, state.labels, imageUrl, task, taskId, toast]);

  // ── Delete wrapper (select tool → delete) ──

  const handleSelectForDelete = useCallback((id: string | null) => {
    state.setSelectedId(id);
    if (id && state.tool === "delete") {
      state.deleteAnnotation(id);
    }
  }, [state]);

  // ─── Loading / Error states ───────────────────────────────────────────────

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

  // ─── Main UI ─────────────────────────────────────────────────────────────

  return (
    <div className="h-screen flex flex-col bg-[#0d0d1a] overflow-hidden">

      {/* ── Top Bar ── */}
      <header className="shrink-0 flex items-center gap-3 px-4 h-12 border-b border-white/10 bg-[#0f0f1e]">
        <button
          onClick={() => navigate(-1)}
          className="text-white/40 hover:text-white transition-colors shrink-0"
          title="Back"
        >
          <ArrowLeft size={18} />
        </button>

        {/* Title */}
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">
            {task?.title ?? (taskId === "demo" ? "Demo — Satellite Image" : "Annotation Tool")}
          </p>
        </div>

        {/* Status badge */}
        {task?.status && (
          <span className={`shrink-0 text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide ${statusColors[task.status] ?? ""}`}>
            {task.status.replace("_", " ")}
          </span>
        )}

        {/* Annotation count */}
        <span className="shrink-0 text-white/40 text-xs flex items-center gap-1">
          <Tag size={12} />
          {state.annotations.length}
        </span>

        {/* Image URL button */}
        <button
          title="Change image URL"
          onClick={() => setShowUrlBox(v => !v)}
          className="shrink-0 text-white/40 hover:text-white transition-colors"
        >
          <ImageIcon size={16} />
        </button>

        {/* Divider */}
        <div className="h-5 w-px bg-white/10 shrink-0" />

        {/* Export */}
        <Button
          size="sm"
          variant="outline"
          onClick={handleExport}
          className="h-7 px-3 text-xs border-white/20 text-white/70 hover:text-white hover:border-white/40 gap-1.5"
        >
          <Download size={13} /> Export
        </Button>

        {/* Save */}
        <Button
          size="sm"
          onClick={handleSave}
          disabled={saving}
          className="h-7 px-3 text-xs bg-cosmic-purple hover:bg-cosmic-purple/90 text-white border-0 gap-1.5"
        >
          {saving ? <Loader2 size={13} className="animate-spin" /> : <Save size={13} />}
          Save
        </Button>
      </header>

      {/* ── Image URL Input (dropdown) ── */}
      {showUrlBox && (
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
          <Button
            size="sm"
            onClick={() => { if (customUrl) { setImageUrl(customUrl); setShowUrlBox(false); setCustomUrl(""); }}}
            className="h-7 px-3 text-xs bg-cosmic-purple text-white border-0"
          >
            Load
          </Button>
          <button onClick={() => setShowUrlBox(false)} className="text-white/40 hover:text-white text-xs">✕</button>
        </div>
      )}

      {/* ── Workspace ── */}
      <div className="flex-1 flex min-h-0">
        {/* Left toolbar */}
        <AnnotationToolbar
          tool={state.tool}
          onSetTool={state.setTool}
          onUndo={state.undo}
          onRedo={state.redo}
          canUndo={state.canUndo}
          canRedo={state.canRedo}
        />

        {/* Canvas */}
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

        {/* Right panel */}
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
    </div>
  );
}
