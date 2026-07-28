import { useRef, useEffect, useCallback, useState } from "react";
import type { Annotation, Tool, LabelClass, BBoxAnnotation, PolygonAnnotation } from "./useAnnotationState";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Transform { scale: number; tx: number; ty: number; }

interface DrawState {
  transform: Transform;
  image: HTMLImageElement | null;
  imageLoaded: boolean;
  // BBox
  isDrawingBBox: boolean;
  bboxStart: { x: number; y: number } | null;
  bboxCurrent: { x: number; y: number } | null;
  // Polygon
  polyPoints: [number, number][];
  polyMouse: [number, number] | null;
  // Pan
  isPanning: boolean;
  spaceDown: boolean;
  panStart: { x: number; y: number } | null;
  panOrigin: Transform | null;
  // Drag annotation
  isDragging: boolean;
  dragId: string | null;
  dragStart: { x: number; y: number } | null;
  dragOrigBBox: { x: number; y: number; w: number; h: number } | null;
  dragOrigPoly: [number, number][] | null;
}

interface Props {
  imageUrl: string;
  annotations: Annotation[];
  tool: Tool;
  activeLabel: LabelClass;
  selectedId: string | null;
  onAddAnnotation: (ann: Annotation) => void;
  onSelect: (id: string | null) => void;
  onUpdateAnnotation: (id: string, patch: Partial<Annotation>) => void;
  onCommitMove: () => void;
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function hitTest(imgX: number, imgY: number, anns: Annotation[]): string | null {
  for (let i = anns.length - 1; i >= 0; i--) {
    const ann = anns[i];
    if (ann.type === "bbox") {
      const { x, y, w, h } = ann.bbox;
      if (imgX >= x && imgX <= x + w && imgY >= y && imgY <= y + h) return ann.id;
    } else {
      const pts = ann.points;
      let inside = false;
      for (let j = 0, k = pts.length - 1; j < pts.length; k = j++) {
        const [xi, yi] = pts[j], [xj, yj] = pts[k];
        if ((yi > imgY) !== (yj > imgY) && imgX < ((xj - xi) * (imgY - yi)) / (yj - yi) + xi)
          inside = !inside;
      }
      if (inside) return ann.id;
    }
  }
  return null;
}

function drawAnnotation(
  ctx: CanvasRenderingContext2D,
  ann: Annotation,
  isSelected: boolean,
  scale: number,
) {
  ctx.save();
  if (ann.type === "bbox") {
    const { x, y, w, h } = ann.bbox;
    ctx.fillStyle   = ann.color + "30";
    ctx.strokeStyle = isSelected ? "#ffffff" : ann.color;
    ctx.lineWidth   = (isSelected ? 2.5 : 1.5) / scale;
    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    // Label tag
    const tagH = 18 / scale;
    ctx.font = `bold ${11 / scale}px Inter, sans-serif`;
    const textW = ctx.measureText(ann.label).width + 8 / scale;
    ctx.fillStyle = ann.color;
    ctx.fillRect(x, y - tagH, textW, tagH);
    ctx.fillStyle = "#fff";
    ctx.textBaseline = "middle";
    ctx.fillText(ann.label, x + 4 / scale, y - tagH / 2);

    // Selection handles
    if (isSelected) {
      const hs = 6 / scale;
      const corners: [number, number][] = [
        [x, y], [x + w, y], [x, y + h], [x + w, y + h],
        [x + w / 2, y], [x + w / 2, y + h], [x, y + h / 2], [x + w, y + h / 2],
      ];
      corners.forEach(([cx, cy]) => {
        ctx.fillStyle   = "#ffffff";
        ctx.strokeStyle = ann.color;
        ctx.lineWidth   = 1 / scale;
        ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
        ctx.strokeRect(cx - hs / 2, cy - hs / 2, hs, hs);
      });
    }
  } else {
    const pts = ann.points;
    if (pts.length < 2) { ctx.restore(); return; }

    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(([px, py]) => ctx.lineTo(px, py));
    ctx.closePath();
    ctx.fillStyle   = ann.color + "30";
    ctx.strokeStyle = isSelected ? "#ffffff" : ann.color;
    ctx.lineWidth   = (isSelected ? 2.5 : 1.5) / scale;
    ctx.fill();
    ctx.stroke();

    // Centroid label
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;
    ctx.font = `bold ${11 / scale}px Inter, sans-serif`;
    const textW = ctx.measureText(ann.label).width + 8 / scale;
    const tagH  = 18 / scale;
    ctx.fillStyle = ann.color;
    ctx.fillRect(cx - textW / 2, cy - tagH / 2, textW, tagH);
    ctx.fillStyle    = "#fff";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(ann.label, cx, cy);

    // Vertex dots
    pts.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 4 / scale, 0, Math.PI * 2);
      ctx.fillStyle = isSelected ? "#fff" : ann.color;
      ctx.fill();
    });
  }
  ctx.restore();
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AnnotationCanvas({
  imageUrl, annotations, tool, activeLabel,
  selectedId, onAddAnnotation, onSelect, onUpdateAnnotation, onCommitMove,
}: Props) {
  const canvasRef    = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoomPct, setZoomPct] = useState(100);

  // Stable refs for event-handler closures
  const annRef    = useRef(annotations);
  const toolRef   = useRef(tool);
  const labelRef  = useRef(activeLabel);
  const selRef    = useRef(selectedId);
  const cbRef     = useRef({ onAddAnnotation, onSelect, onUpdateAnnotation, onCommitMove });

  useEffect(() => { annRef.current   = annotations;      }, [annotations]);
  useEffect(() => { toolRef.current  = tool;             }, [tool]);
  useEffect(() => { labelRef.current = activeLabel;      }, [activeLabel]);
  useEffect(() => { selRef.current   = selectedId;       }, [selectedId]);
  useEffect(() => { cbRef.current    = { onAddAnnotation, onSelect, onUpdateAnnotation, onCommitMove }; },
    [onAddAnnotation, onSelect, onUpdateAnnotation, onCommitMove]);

  const ds = useRef<DrawState>({
    transform: { scale: 1, tx: 0, ty: 0 },
    image: null, imageLoaded: false,
    isDrawingBBox: false, bboxStart: null, bboxCurrent: null,
    polyPoints: [], polyMouse: null,
    isPanning: false, spaceDown: false, panStart: null, panOrigin: null,
    isDragging: false, dragId: null, dragStart: null, dragOrigBBox: null, dragOrigPoly: null,
  });

  // ── Coordinate helpers ──

  const getPos = (e: MouseEvent) => {
    const r = canvasRef.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };
  const toImg = (cx: number, cy: number) => {
    const { scale, tx, ty } = ds.current.transform;
    return { x: (cx - tx) / scale, y: (cy - ty) / scale };
  };
  const toCanvas = (ix: number, iy: number) => {
    const { scale, tx, ty } = ds.current.transform;
    return { x: ix * scale + tx, y: iy * scale + ty };
  };

  // ── Render ──

  const render = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx  = canvas.getContext("2d")!;
    const { scale, tx, ty } = ds.current.transform;
    const d    = ds.current;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#0d0d1a";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Checkerboard background (indicates image area)
    ctx.save();
    ctx.setTransform(scale, 0, 0, scale, tx, ty);

    if (d.image && d.imageLoaded) {
      ctx.drawImage(d.image, 0, 0);
    } else {
      ctx.fillStyle = "#1a1a2e";
      ctx.fillRect(0, 0, 800, 500);
      ctx.fillStyle = "#444";
      ctx.font = "18px Inter, sans-serif";
      ctx.textAlign = "center";
      ctx.fillText("Loading image…", 400, 250);
    }

    // Completed annotations
    annRef.current.forEach(ann =>
      drawAnnotation(ctx, ann, ann.id === selRef.current, scale),
    );

    // In-progress BBox
    if (d.isDrawingBBox && d.bboxStart && d.bboxCurrent) {
      const x = Math.min(d.bboxStart.x, d.bboxCurrent.x);
      const y = Math.min(d.bboxStart.y, d.bboxCurrent.y);
      const w = Math.abs(d.bboxCurrent.x - d.bboxStart.x);
      const h = Math.abs(d.bboxCurrent.y - d.bboxStart.y);
      ctx.save();
      ctx.strokeStyle = labelRef.current.color;
      ctx.fillStyle   = labelRef.current.color + "20";
      ctx.lineWidth   = 1.5 / scale;
      ctx.setLineDash([6 / scale, 3 / scale]);
      ctx.fillRect(x, y, w, h);
      ctx.strokeRect(x, y, w, h);
      ctx.restore();
    }

    // In-progress Polygon
    if (d.polyPoints.length > 0) {
      ctx.save();
      ctx.strokeStyle = labelRef.current.color;
      ctx.lineWidth   = 1.5 / scale;

      ctx.beginPath();
      ctx.moveTo(d.polyPoints[0][0], d.polyPoints[0][1]);
      d.polyPoints.slice(1).forEach(([px, py]) => ctx.lineTo(px, py));
      if (d.polyMouse) ctx.lineTo(d.polyMouse[0], d.polyMouse[1]);
      ctx.stroke();

      d.polyPoints.forEach(([px, py]) => {
        ctx.fillStyle = labelRef.current.color;
        ctx.beginPath();
        ctx.arc(px, py, 4 / scale, 0, Math.PI * 2);
        ctx.fill();
      });

      // Highlight first point (close indicator) after 3 points
      if (d.polyPoints.length >= 3) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth   = 2 / scale;
        ctx.beginPath();
        ctx.arc(d.polyPoints[0][0], d.polyPoints[0][1], 8 / scale, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();
    }

    ctx.restore(); // pop setTransform

    setZoomPct(Math.round(scale * 100));
  }, []);

  // ── Load image ──

  useEffect(() => {
    const d   = ds.current;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      d.image       = img;
      d.imageLoaded = true;
      const canvas  = canvasRef.current;
      if (canvas) {
        const s = Math.min(canvas.width / img.width, canvas.height / img.height, 1) * 0.85;
        d.transform = {
          scale: s,
          tx: (canvas.width  - img.width  * s) / 2,
          ty: (canvas.height - img.height * s) / 2,
        };
      }
      render();
    };
    img.onerror = () => { d.imageLoaded = false; render(); };
    img.src = imageUrl;
  }, [imageUrl, render]);

  // Re-render on annotation / selection changes
  useEffect(() => { render(); }, [annotations, selectedId, render]);

  // ── Resize observer ──

  useEffect(() => {
    const container = containerRef.current;
    const canvas    = canvasRef.current;
    if (!container || !canvas) return;
    const obs = new ResizeObserver(() => {
      canvas.width  = container.clientWidth;
      canvas.height = container.clientHeight;
      render();
    });
    obs.observe(container);
    canvas.width  = container.clientWidth;
    canvas.height = container.clientHeight;
    return () => obs.disconnect();
  }, [render]);

  // ── Mouse & Keyboard events ──

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const d  = ds.current;
    const cb = cbRef;

    const onMouseDown = (e: MouseEvent) => {
      const pos    = getPos(e);
      const imgPos = toImg(pos.x, pos.y);

      // Pan: middle-click or space+left-click
      if (e.button === 1 || (e.button === 0 && d.spaceDown)) {
        d.isPanning  = true;
        d.panStart   = pos;
        d.panOrigin  = { ...d.transform };
        canvas.style.cursor = "grabbing";
        e.preventDefault();
        return;
      }
      if (e.button !== 0) return;

      const cur = toolRef.current;

      if (cur === "select" || cur === "delete") {
        const hit = hitTest(imgPos.x, imgPos.y, annRef.current);
        cb.current.onSelect(hit);

        if (hit && cur === "delete") {
          // delete handled by onSelect + parent's deleteSelected
          return;
        }
        if (hit && cur === "select") {
          const ann = annRef.current.find(a => a.id === hit)!;
          d.isDragging   = true;
          d.dragId       = hit;
          d.dragStart    = imgPos;
          if (ann.type === "bbox")    d.dragOrigBBox  = { ...ann.bbox };
          else                        d.dragOrigPoly  = ann.points.map(p => [p[0], p[1]] as [number, number]);
        }

      } else if (cur === "bbox") {
        d.isDrawingBBox = true;
        d.bboxStart     = imgPos;
        d.bboxCurrent   = imgPos;

      } else if (cur === "polygon") {
        // Check proximity to first point (close polygon)
        if (d.polyPoints.length >= 3) {
          const first   = toCanvas(d.polyPoints[0][0], d.polyPoints[0][1]);
          const dist    = Math.hypot(pos.x - first.x, pos.y - first.y);
          if (dist < 14) {
            finishPolygon(d);
            return;
          }
        }
        d.polyPoints.push([imgPos.x, imgPos.y]);
        render();
      }
    };

    const onMouseMove = (e: MouseEvent) => {
      const pos    = getPos(e);
      const imgPos = toImg(pos.x, pos.y);

      if (d.isPanning && d.panStart && d.panOrigin) {
        d.transform = {
          ...d.panOrigin,
          tx: d.panOrigin.tx + pos.x - d.panStart.x,
          ty: d.panOrigin.ty + pos.y - d.panStart.y,
        };
        render();
        return;
      }

      if (d.isDrawingBBox) {
        d.bboxCurrent = imgPos;
        render();
        return;
      }

      if (d.isDragging && d.dragId && d.dragStart) {
        const dx  = imgPos.x - d.dragStart.x;
        const dy  = imgPos.y - d.dragStart.y;
        const ann = annRef.current.find(a => a.id === d.dragId);
        if (!ann) return;
        if (ann.type === "bbox" && d.dragOrigBBox) {
          cb.current.onUpdateAnnotation(ann.id, {
            bbox: { ...d.dragOrigBBox, x: d.dragOrigBBox.x + dx, y: d.dragOrigBBox.y + dy },
          });
        } else if (ann.type === "polygon" && d.dragOrigPoly) {
          cb.current.onUpdateAnnotation(ann.id, {
            points: d.dragOrigPoly.map(([px, py]) => [px + dx, py + dy] as [number, number]),
          });
        }
        render();
        return;
      }

      if (toolRef.current === "polygon" && d.polyPoints.length > 0) {
        d.polyMouse = [imgPos.x, imgPos.y];
        render();
      }

      // Cursor feedback
      if (!d.spaceDown) {
        const hit = hitTest(imgPos.x, imgPos.y, annRef.current);
        if      (toolRef.current === "select")  canvas.style.cursor = hit ? "move" : "default";
        else if (toolRef.current === "delete")  canvas.style.cursor = hit ? "not-allowed" : "default";
        else if (toolRef.current === "bbox" || toolRef.current === "polygon") canvas.style.cursor = "crosshair";
      }
    };

    const onMouseUp = (_e: MouseEvent) => {
      if (d.isPanning) {
        d.isPanning = false;
        d.panStart  = null;
        d.panOrigin = null;
        canvas.style.cursor = d.spaceDown ? "grab" : "default";
        return;
      }

      if (d.isDrawingBBox && d.bboxStart && d.bboxCurrent) {
        const x = Math.min(d.bboxStart.x, d.bboxCurrent.x);
        const y = Math.min(d.bboxStart.y, d.bboxCurrent.y);
        const w = Math.abs(d.bboxCurrent.x - d.bboxStart.x);
        const h = Math.abs(d.bboxCurrent.y - d.bboxStart.y);
        if (w > 4 && h > 4) {
          const ann: BBoxAnnotation = {
            id: crypto.randomUUID(), type: "bbox",
            label: labelRef.current.name, color: labelRef.current.color,
            bbox: { x, y, w, h },
          };
          cb.current.onAddAnnotation(ann);
        }
        d.isDrawingBBox = false;
        d.bboxStart     = null;
        d.bboxCurrent   = null;
        render();
        return;
      }

      if (d.isDragging) {
        d.isDragging    = false;
        d.dragId        = null;
        d.dragStart     = null;
        d.dragOrigBBox  = null;
        d.dragOrigPoly  = null;
        cb.current.onCommitMove();
        return;
      }
    };

    const onDblClick = (_e: MouseEvent) => {
      if (toolRef.current === "polygon" && d.polyPoints.length >= 3) {
        finishPolygon(d);
      }
    };

    const finishPolygon = (d: DrawState) => {
      const ann: PolygonAnnotation = {
        id: crypto.randomUUID(), type: "polygon",
        label: labelRef.current.name, color: labelRef.current.color,
        points: [...d.polyPoints],
      };
      cb.current.onAddAnnotation(ann);
      d.polyPoints = [];
      d.polyMouse  = null;
      render();
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const pos       = getPos(e);
      const factor    = e.deltaY < 0 ? 1.1 : 0.9;
      const newScale  = Math.max(0.05, Math.min(30, d.transform.scale * factor));
      d.transform = {
        scale: newScale,
        tx: pos.x - (pos.x - d.transform.tx) * (newScale / d.transform.scale),
        ty: pos.y - (pos.y - d.transform.ty) * (newScale / d.transform.scale),
      };
      render();
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.code === "Space") {
        d.spaceDown = true;
        canvas.style.cursor = "grab";
        e.preventDefault();
      }
      if (e.key === "Escape") {
        d.polyPoints    = [];
        d.polyMouse     = null;
        d.isDrawingBBox = false;
        d.bboxStart     = null;
        d.bboxCurrent   = null;
        render();
      }
      // Fit to screen: F key
      if (e.key === "f" || e.key === "F") {
        const img = d.image;
        if (!img || !canvasRef.current) return;
        const s = Math.min(canvasRef.current.width / img.width, canvasRef.current.height / img.height) * 0.85;
        d.transform = {
          scale: s,
          tx: (canvasRef.current.width  - img.width  * s) / 2,
          ty: (canvasRef.current.height - img.height * s) / 2,
        };
        render();
      }
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.code === "Space") {
        d.spaceDown = false;
        canvas.style.cursor = "default";
      }
    };

    canvas.addEventListener("mousedown", onMouseDown);
    canvas.addEventListener("mousemove", onMouseMove);
    canvas.addEventListener("mouseup",   onMouseUp);
    canvas.addEventListener("dblclick",  onDblClick);
    canvas.addEventListener("wheel",     onWheel, { passive: false });
    window.addEventListener("keydown",   onKeyDown);
    window.addEventListener("keyup",     onKeyUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup",   onMouseUp);
      canvas.removeEventListener("dblclick",  onDblClick);
      canvas.removeEventListener("wheel",     onWheel);
      window.removeEventListener("keydown",   onKeyDown);
      window.removeEventListener("keyup",     onKeyUp);
    };
  }, [render]); // stable — all mutable state via refs

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#0d0d1a]">
      <canvas ref={canvasRef} className="block" />

      {/* Zoom badge */}
      <div className="absolute bottom-3 right-3 bg-black/70 text-white/80 text-xs px-2.5 py-1 rounded-md font-mono select-none pointer-events-none">
        {zoomPct}%
      </div>

      {/* Shortcut hint */}
      <div className="absolute bottom-3 left-3 text-white/30 text-[10px] select-none pointer-events-none leading-relaxed">
        Scroll: zoom · Space+drag: pan · F: fit · Esc: cancel · Dbl-click: close poly
      </div>
    </div>
  );
}
