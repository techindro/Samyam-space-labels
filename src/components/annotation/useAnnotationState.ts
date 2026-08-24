import { useState, useCallback, useRef } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

export type Tool = "select" | "bbox" | "polygon" | "obb" | "magic_wand" | "delete";

export interface LabelClass {
  id: string;
  name: string;
  color: string;
}

export interface BBoxAnnotation {
  id: string;
  type: "bbox";
  label: string;
  color: string;
  bbox: { x: number; y: number; w: number; h: number };
}

export interface PolygonAnnotation {
  id: string;
  type: "polygon";
  label: string;
  color: string;
  points: [number, number][];
}

export interface OBBAnnotation {
  id: string;
  type: "obb";
  label: string;
  color: string;
  obb: {
    cx: number;
    cy: number;
    w: number;
    h: number;
    angle: number; // degrees
  };
}

export type Annotation = BBoxAnnotation | PolygonAnnotation | OBBAnnotation;

// ─── Defaults ────────────────────────────────────────────────────────────────

export const PRESET_COLORS = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#3b82f6", "#8b5cf6", "#ec4899", "#06b6d4",
];

export const DEFAULT_LABELS: LabelClass[] = [
  { id: "label-1", name: "Object",     color: "#ef4444" },
  { id: "label-2", name: "Region",     color: "#22c55e" },
  { id: "label-3", name: "Background", color: "#3b82f6" },
];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useAnnotationState(
  initialAnnotations: Annotation[] = [],
  initialLabels: LabelClass[] = DEFAULT_LABELS,
) {
  const [annotations, setAnnotationsRaw] = useState<Annotation[]>(initialAnnotations);
  const [history,     setHistory]         = useState<Annotation[][]>([initialAnnotations]);
  const [historyIdx,  setHistoryIdx]      = useState(0);

  const [tool,        setTool]        = useState<Tool>("bbox");
  const [labels,      setLabels]      = useState<LabelClass[]>(initialLabels.length ? initialLabels : DEFAULT_LABELS);
  const [activeLabel, setActiveLabel] = useState<LabelClass>(
    initialLabels.length ? initialLabels[0] : DEFAULT_LABELS[0],
  );
  const [selectedId,  setSelectedId]  = useState<string | null>(null);

  // historyIdx ref for use inside callbacks (avoids stale closure)
  const historyIdxRef = useRef(historyIdx);
  historyIdxRef.current = historyIdx;

  const pushHistory = useCallback((next: Annotation[]) => {
    setHistory(h => {
      const trimmed = h.slice(0, historyIdxRef.current + 1);
      return [...trimmed, next];
    });
    setHistoryIdx(i => i + 1);
    setAnnotationsRaw(next);
  }, []);

  const addAnnotation = useCallback((ann: Annotation) => {
    setAnnotationsRaw(prev => {
      const next = [...prev, ann];
      pushHistory(next);
      return next;
    });
    setSelectedId(ann.id);
  }, [pushHistory]);

  const deleteAnnotation = useCallback((id: string) => {
    setAnnotationsRaw(prev => {
      const next = prev.filter(a => a.id !== id);
      pushHistory(next);
      return next;
    });
    setSelectedId(null);
  }, [pushHistory]);

  const deleteSelected = useCallback(() => {
    setSelectedId(id => {
      if (id) {
        setAnnotationsRaw(prev => {
          const next = prev.filter(a => a.id !== id);
          pushHistory(next);
          return next;
        });
      }
      return null;
    });
  }, [pushHistory]);

  // Called during drag — no history push (perf)
  const updateAnnotation = useCallback((id: string, patch: Partial<Annotation>) => {
    setAnnotationsRaw(prev =>
      prev.map(a => (a.id === id ? ({ ...a, ...patch } as Annotation) : a)),
    );
  }, []);

  // Called on mouseup after drag — push to history
  const commitAnnotationMove = useCallback(() => {
    setAnnotationsRaw(prev => {
      pushHistory([...prev]);
      return prev;
    });
  }, [pushHistory]);

  const undo = useCallback(() => {
    setHistoryIdx(i => {
      if (i <= 0) return i;
      const ni = i - 1;
      setHistory(h => {
        setAnnotationsRaw(h[ni]);
        return h;
      });
      setSelectedId(null);
      return ni;
    });
  }, []);

  const redo = useCallback(() => {
    setHistoryIdx(i => {
      setHistory(h => {
        if (i >= h.length - 1) return h;
        const ni = i + 1;
        setAnnotationsRaw(h[ni]);
        setHistoryIdx(ni);
        return h;
      });
      return i;
    });
  }, []);

  const addLabel = useCallback((name: string, color: string) => {
    const newLabel: LabelClass = { id: crypto.randomUUID(), name, color };
    setLabels(l => [...l, newLabel]);
    setActiveLabel(newLabel);
  }, []);

  return {
    annotations,
    setAnnotations: pushHistory,
    tool, setTool,
    labels,
    activeLabel, setActiveLabel,
    selectedId, setSelectedId,
    addAnnotation,
    deleteAnnotation,
    deleteSelected,
    updateAnnotation,
    commitAnnotationMove,
    undo, redo,
    addLabel,
    canUndo: historyIdx > 0,
    canRedo: historyIdx < history.length - 1,
  };
}
