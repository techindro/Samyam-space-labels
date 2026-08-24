import { useRef, useEffect, useCallback, useState } from "react";
import type { Annotation, Tool, LabelClass, BBoxAnnotation, PolygonAnnotation, OBBAnnotation } from "./useAnnotationState";
import { extractMagicWandContour } from "@/lib/magicWand";

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
  // OBB
  isDrawingObb: boolean;
  obbStart: { x: number; y: number } | null;
  obbCurrent: { x: number; y: number } | null;
  isRotatingObb: boolean;
  rotatingId: string | null;
  dragOrigObb: { cx: number; cy: number; w: number; h: number; angle: number } | null;
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
    } else if (ann.type === "obb") {
      const { cx, cy, w, h, angle } = ann.obb;
      const rad = (-angle * Math.PI) / 180;
      const dx = imgX - cx;
      const dy = imgY - cy;
      const lx = dx * Math.cos(rad) - dy * Math.sin(rad);
      const ly = dx * Math.sin(rad) + dy * Math.cos(rad);
      if (Math.abs(lx) <= w / 2 && Math.abs(ly) <= h / 2) return ann.id;
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

function hitRotateHandle(imgX: number, imgY: number, ann: Annotation, scale: number): boolean {
  if (ann.type !== "obb") return false;
  const { cx, cy, h, angle } = ann.obb;
  const rad = (angle * Math.PI) / 180;
  const handleDist = h / 2 + 20 / scale;
  const hx = cx - Math.sin(rad) * handleDist;
  const hy = cy - Math.cos(rad) * handleDist;
  return Math.hypot(imgX - hx, imgY - hy) <= 12 / scale;
}

function drawAnnotation(
  ctx: CanvasRenderingContext2D,
  ann: Annotation,
  isSelected: boolean,
  scale: number,
) {
  ctx.save();
  const strokeWidth = (isSelected ? 2.5 : 1.5) / scale;

  if (ann.type === "bbox") {
    const { x, y, w, h } = ann.bbox;

    // Fill & BBox Stroke
    ctx.fillStyle   = ann.color + (isSelected ? "40" : "25");
    ctx.strokeStyle = isSelected ? "#ffffff" : ann.color;
    ctx.lineWidth   = strokeWidth;

    ctx.fillRect(x, y, w, h);
    ctx.strokeRect(x, y, w, h);

    // Outer glow highlight when selected
    if (isSelected) {
      ctx.save();
      ctx.strokeStyle = ann.color;
      ctx.lineWidth   = 1 / scale;
      ctx.strokeRect(x - 2 / scale, y - 2 / scale, w + 4 / scale, h + 4 / scale);
      ctx.restore();
    }

    // Label Tag Badge (Position: Above bbox, or inside if near top edge)
    const tagH = 20 / scale;
    const fontPx = Math.max(10, Math.round(12 / scale));
    ctx.font = `600 ${fontPx}px Inter, system-ui, sans-serif`;

    const textMetrics = ctx.measureText(ann.label);
    const paddingX = 8 / scale;
    const tagW = textMetrics.width + paddingX * 2;

    const tagY = (y - tagH < 0) ? y : (y - tagH);

    // Draw Tag Background Badge with subtle shadow
    ctx.fillStyle = ann.color;
    ctx.beginPath();
    const radius = 3 / scale;
    ctx.roundRect(x, tagY, tagW, tagH, [radius, radius, 0, 0]);
    ctx.fill();

    // Dark stroke around label tag for crisp contrast
    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 1 / scale;
    ctx.stroke();

    // Draw Label Text
    ctx.fillStyle = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.textAlign = "left";
    ctx.fillText(ann.label, x + paddingX, tagY + tagH / 2);

    // Selection Control Handles (8 points)
    if (isSelected) {
      const hs = 7 / scale;
      const corners: [number, number][] = [
        [x, y], [x + w, y], [x, y + h], [x + w, y + h],
        [x + w / 2, y], [x + w / 2, y + h], [x, y + h / 2], [x + w, y + h / 2],
      ];
      corners.forEach(([cx, cy]) => {
        ctx.fillStyle   = "#ffffff";
        ctx.strokeStyle = ann.color;
        ctx.lineWidth   = 1.5 / scale;
        ctx.fillRect(cx - hs / 2, cy - hs / 2, hs, hs);
        ctx.strokeRect(cx - hs / 2, cy - hs / 2, hs, hs);
      });
    }
  } else if (ann.type === "obb") {
    const { cx, cy, w, h, angle } = ann.obb;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate((angle * Math.PI) / 180);

    // Box Fill & Stroke
    ctx.fillStyle   = ann.color + (isSelected ? "40" : "25");
    ctx.strokeStyle = isSelected ? "#ffffff" : ann.color;
    ctx.lineWidth   = strokeWidth;

    ctx.fillRect(-w / 2, -h / 2, w, h);
    ctx.strokeRect(-w / 2, -h / 2, w, h);

    // Orientation Heading Line & Handle (Satellite/Drone vector)
    ctx.beginPath();
    ctx.moveTo(0, -h / 2);
    ctx.lineTo(0, -h / 2 - 20 / scale);
    ctx.strokeStyle = "#38bdf8";
    ctx.lineWidth = 2 / scale;
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(0, -h / 2 - 20 / scale, 5 / scale, 0, Math.PI * 2);
    ctx.fillStyle = isSelected ? "#38bdf8" : "#ffffff";
    ctx.fill();
    ctx.strokeStyle = "#000000";
    ctx.lineWidth = 1 / scale;
    ctx.stroke();

    // Corner Handles when selected
    if (isSelected) {
      const hs = 7 / scale;
      const obbCorners: [number, number][] = [
        [-w / 2, -h / 2], [w / 2, -h / 2],
        [w / 2, h / 2], [-w / 2, h / 2]
      ];
      obbCorners.forEach(([cxHandle, cyHandle]) => {
        ctx.fillStyle   = "#ffffff";
        ctx.strokeStyle = ann.color;
        ctx.lineWidth   = 1.5 / scale;
        ctx.fillRect(cxHandle - hs / 2, cyHandle - hs / 2, hs, hs);
        ctx.strokeRect(cxHandle - hs / 2, cyHandle - hs / 2, hs, hs);
      });
    }

    // Label Tag Badge
    const tagH = 20 / scale;
    const fontPx = Math.max(10, Math.round(12 / scale));
    ctx.font = `600 ${fontPx}px Inter, system-ui, sans-serif`;

    const labelStr = `${ann.label} (${Math.round(angle)}°)`;
    const textMetrics = ctx.measureText(labelStr);
    const paddingX = 8 / scale;
    const tagW = textMetrics.width + paddingX * 2;

    ctx.fillStyle = ann.color;
    ctx.beginPath();
    ctx.roundRect(-tagW / 2, -h / 2 - tagH - 4 / scale, tagW, tagH, 3 / scale);
    ctx.fill();

    ctx.strokeStyle = "rgba(0, 0, 0, 0.3)";
    ctx.lineWidth = 1 / scale;
    ctx.stroke();

    ctx.fillStyle    = "#ffffff";
    ctx.textBaseline = "middle";
    ctx.textAlign    = "center";
    ctx.fillText(labelStr, 0, -h / 2 - tagH / 2 - 4 / scale);

    ctx.restore();
  } else {
    // Polygon Annotation
    const pts = ann.points;
    if (pts.length < 2) { ctx.restore(); return; }

    ctx.beginPath();
    ctx.moveTo(pts[0][0], pts[0][1]);
    pts.slice(1).forEach(([px, py]) => ctx.lineTo(px, py));
    ctx.closePath();

    ctx.fillStyle   = ann.color + (isSelected ? "40" : "25");
    ctx.strokeStyle = isSelected ? "#ffffff" : ann.color;
    ctx.lineWidth   = strokeWidth;
    ctx.fill();
    ctx.stroke();

    // Centroid Label Badge
    const cx = pts.reduce((s, p) => s + p[0], 0) / pts.length;
    const cy = pts.reduce((s, p) => s + p[1], 0) / pts.length;

    const fontPx = Math.max(10, Math.round(12 / scale));
    ctx.font = `600 ${fontPx}px Inter, system-ui, sans-serif`;

    const textMetrics = ctx.measureText(ann.label);
    const paddingX = 8 / scale;
    const tagW = textMetrics.width + paddingX * 2;
    const tagH = 20 / scale;

    ctx.fillStyle = ann.color;
    ctx.beginPath();
    ctx.roundRect(cx - tagW / 2, cy - tagH / 2, tagW, tagH, 4 / scale);
    ctx.fill();

    ctx.strokeStyle = "rgba(0,0,0,0.3)";
    ctx.lineWidth = 1 / scale;
    ctx.stroke();

    ctx.fillStyle    = "#ffffff";
    ctx.textAlign    = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(ann.label, cx, cy);

    // Crisp Bordered Vertex Handles
    pts.forEach(([px, py]) => {
      ctx.beginPath();
      ctx.arc(px, py, 4.5 / scale, 0, Math.PI * 2);
      ctx.fillStyle = ann.color;
      ctx.fill();
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 1.5 / scale;
      ctx.stroke();
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
    ctx.fillStyle = "#080814";
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

    // In-progress OBB
    if (d.isDrawingObb && d.obbStart && d.obbCurrent) {
      const cx = (d.obbStart.x + d.obbCurrent.x) / 2;
      const cy = (d.obbStart.y + d.obbCurrent.y) / 2;
      const w = Math.abs(d.obbCurrent.x - d.obbStart.x);
      const h = Math.abs(d.obbCurrent.y - d.obbStart.y);
      ctx.save();
      ctx.translate(cx, cy);
      ctx.strokeStyle = labelRef.current.color;
      ctx.fillStyle   = labelRef.current.color + "25";
      ctx.lineWidth   = 1.5 / scale;
      ctx.setLineDash([6 / scale, 3 / scale]);
      ctx.fillRect(-w / 2, -h / 2, w, h);
      ctx.strokeRect(-w / 2, -h / 2, w, h);
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
        // Check if user clicked rotation handle on selected OBB
        if (cur === "select" && selRef.current) {
          const selectedAnn = annRef.current.find(a => a.id === selRef.current);
          if (selectedAnn && selectedAnn.type === "obb" && hitRotateHandle(imgPos.x, imgPos.y, selectedAnn, d.transform.scale)) {
            d.isRotatingObb = true;
            d.rotatingId = selectedAnn.id;
            d.dragOrigObb = { ...selectedAnn.obb };
            return;
          }
        }

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
          if (ann.type === "bbox")         d.dragOrigBBox  = { ...ann.bbox };
          else if (ann.type === "obb")     d.dragOrigObb   = { ...ann.obb };
          else                             d.dragOrigPoly  = ann.points.map(p => [p[0], p[1]] as [number, number]);
        }

      } else if (cur === "bbox") {
        d.isDrawingBBox = true;
        d.bboxStart     = imgPos;
        d.bboxCurrent   = imgPos;

      } else if (cur === "obb") {
        d.isDrawingObb  = true;
        d.obbStart      = imgPos;
        d.obbCurrent    = imgPos;

      } else if (cur === "magic_wand") {
        if (d.image && d.imageLoaded) {
          const pts = extractMagicWandContour(d.image, imgPos.x, imgPos.y);
          if (pts && pts.length >= 3) {
            const ann: PolygonAnnotation = {
              id: crypto.randomUUID(),
              type: "polygon",
              label: labelRef.current.name,
              color: labelRef.current.color,
              points: pts,
            };
            cb.current.onAddAnnotation(ann);
          }
        }

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

      if (d.isDrawingObb) {
        d.obbCurrent = imgPos;
        render();
        return;
      }

      if (d.isRotatingObb && d.rotatingId && d.dragOrigObb) {
        const ann = annRef.current.find(a => a.id === d.rotatingId);
        if (ann && ann.type === "obb") {
          // Angle in degrees from center
          const angleRad = Math.atan2(imgPos.x - d.dragOrigObb.cx, -(imgPos.y - d.dragOrigObb.cy));
          let angleDeg = (angleRad * 180) / Math.PI;
          if (angleDeg < 0) angleDeg += 360;
          cb.current.onUpdateAnnotation(ann.id, {
            obb: { ...d.dragOrigObb, angle: Math.round(angleDeg) },
          });
          render();
        }
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
        } else if (ann.type === "obb" && d.dragOrigObb) {
          cb.current.onUpdateAnnotation(ann.id, {
            obb: { ...d.dragOrigObb, cx: d.dragOrigObb.cx + dx, cy: d.dragOrigObb.cy + dy },
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
        if      (toolRef.current === "select")      canvas.style.cursor = hit ? "move" : "default";
        else if (toolRef.current === "delete")      canvas.style.cursor = hit ? "not-allowed" : "default";
        else if (toolRef.current === "magic_wand")  canvas.style.cursor = "pointer";
        else if (toolRef.current === "bbox" || toolRef.current === "obb" || toolRef.current === "polygon") canvas.style.cursor = "crosshair";
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

      if (d.isRotatingObb) {
        d.isRotatingObb = false;
        d.rotatingId = null;
        d.dragOrigObb = null;
        cb.current.onCommitMove();
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

      if (d.isDrawingObb && d.obbStart && d.obbCurrent) {
        const cx = (d.obbStart.x + d.obbCurrent.x) / 2;
        const cy = (d.obbStart.y + d.obbCurrent.y) / 2;
        const w = Math.abs(d.obbCurrent.x - d.obbStart.x);
        const h = Math.abs(d.obbCurrent.y - d.obbStart.y);
        if (w > 6 && h > 6) {
          const ann: OBBAnnotation = {
            id: crypto.randomUUID(),
            type: "obb",
            label: labelRef.current.name,
            color: labelRef.current.color,
            obb: { cx, cy, w, h, angle: 0 },
          };
          cb.current.onAddAnnotation(ann);
        }
        d.isDrawingObb = false;
        d.obbStart = null;
        d.obbCurrent = null;
        render();
        return;
      }

      if (d.isDragging) {
        d.isDragging    = false;
        d.dragId        = null;
        d.dragStart     = null;
        d.dragOrigBBox  = null;
        d.dragOrigObb   = null;
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
      if (d.polyPoints.length < 3) return;
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

    let touchStartDist = 0;
    let touchStartScale = 1;

    const onTouchStart = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2) {
        touchStartDist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        touchStartScale = d.transform.scale;
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        const dummyMouse = { clientX: t.clientX, clientY: t.clientY, button: 0, preventDefault: () => {} } as MouseEvent;
        onMouseDown(dummyMouse);
      }
    };

    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault();
      if (e.touches.length === 2 && touchStartDist > 0) {
        const dist = Math.hypot(
          e.touches[0].clientX - e.touches[1].clientX,
          e.touches[0].clientY - e.touches[1].clientY
        );
        const factor = dist / touchStartDist;
        const newScale = Math.max(0.05, Math.min(30, touchStartScale * factor));
        const rect = canvas.getBoundingClientRect();
        const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2 - rect.left;
        const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2 - rect.top;
        d.transform = {
          scale: newScale,
          tx: midX - (midX - d.transform.tx) * (newScale / d.transform.scale),
          ty: midY - (midY - d.transform.ty) * (newScale / d.transform.scale),
        };
        render();
      } else if (e.touches.length === 1) {
        const t = e.touches[0];
        const dummyMouse = { clientX: t.clientX, clientY: t.clientY, button: 0, preventDefault: () => {} } as MouseEvent;
        onMouseMove(dummyMouse);
      }
    };

    const onTouchEnd = (e: TouchEvent) => {
      e.preventDefault();
      const dummyMouse = { button: 0, preventDefault: () => {} } as MouseEvent;
      onMouseUp(dummyMouse);
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
      // Fit to screen: F key or 0
      if (e.key === "f" || e.key === "F" || e.key === "0") {
        e.preventDefault();
        const container = containerRef.current;
        const canvas = canvasRef.current;
        const img = d.image;
        if (!container || !canvas || !img) return;
        const imgW = img.naturalWidth || img.width;
        const imgH = img.naturalHeight || img.height;
        if (!imgW || !imgH) return;
        const cw = container.clientWidth || canvas.width;
        const ch = container.clientHeight || canvas.height;
        const s = Math.min(cw / imgW, ch / imgH) * 0.88;
        d.transform = {
          scale: s,
          tx: (cw - imgW * s) / 2,
          ty: (ch - imgH * s) / 2,
        };
        render();
      }

      // Zoom In (+ or =)
      if (e.key === "+" || e.key === "=") {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const midX = canvas.width / 2;
        const midY = canvas.height / 2;
        const newScale = Math.max(0.05, Math.min(30, d.transform.scale * 1.25));
        d.transform = {
          scale: newScale,
          tx: midX - (midX - d.transform.tx) * (newScale / d.transform.scale),
          ty: midY - (midY - d.transform.ty) * (newScale / d.transform.scale),
        };
        render();
      }

      // Zoom Out (- or _)
      if (e.key === "-" || e.key === "_") {
        e.preventDefault();
        const canvas = canvasRef.current;
        if (!canvas) return;
        const midX = canvas.width / 2;
        const midY = canvas.height / 2;
        const newScale = Math.max(0.05, Math.min(30, d.transform.scale * 0.8));
        d.transform = {
          scale: newScale,
          tx: midX - (midX - d.transform.tx) * (newScale / d.transform.scale),
          ty: midY - (midY - d.transform.ty) * (newScale / d.transform.scale),
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
    canvas.addEventListener("touchstart", onTouchStart, { passive: false });
    canvas.addEventListener("touchmove",  onTouchMove, { passive: false });
    canvas.addEventListener("touchend",   onTouchEnd, { passive: false });
    canvas.addEventListener("wheel",     onWheel, { passive: false });
    window.addEventListener("keydown",   onKeyDown);
    window.addEventListener("keyup",     onKeyUp);

    return () => {
      canvas.removeEventListener("mousedown", onMouseDown);
      canvas.removeEventListener("mousemove", onMouseMove);
      canvas.removeEventListener("mouseup",   onMouseUp);
      canvas.removeEventListener("dblclick",  onDblClick);
      canvas.removeEventListener("touchstart", onTouchStart);
      canvas.removeEventListener("touchmove",  onTouchMove);
      canvas.removeEventListener("touchend",   onTouchEnd);
      canvas.removeEventListener("wheel",     onWheel);
      window.removeEventListener("keydown",   onKeyDown);
      window.removeEventListener("keyup",     onKeyUp);
    };
  }, [render]); // stable — all mutable state via refs

  const handleZoom = (factor: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const d = ds.current;
    const midX = canvas.width / 2;
    const midY = canvas.height / 2;
    const newScale = Math.max(0.05, Math.min(30, d.transform.scale * factor));
    d.transform = {
      scale: newScale,
      tx: midX - (midX - d.transform.tx) * (newScale / d.transform.scale),
      ty: midY - (midY - d.transform.ty) * (newScale / d.transform.scale),
    };
    render();
  };

  const handleFit = () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const img = ds.current.image;
    if (!container || !canvas || !img) return;
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    if (!imgW || !imgH) return;
    const cw = container.clientWidth || canvas.width || 800;
    const ch = container.clientHeight || canvas.height || 600;
    const s = Math.min(cw / imgW, ch / imgH) * 0.88;
    ds.current.transform = {
      scale: s,
      tx: (cw - imgW * s) / 2,
      ty: (ch - imgH * s) / 2,
    };
    render();
  };

  const handleReset100 = () => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    const img = ds.current.image;
    if (!container || !canvas || !img) return;
    const imgW = img.naturalWidth || img.width;
    const imgH = img.naturalHeight || img.height;
    if (!imgW || !imgH) return;
    const cw = container.clientWidth || canvas.width || 800;
    const ch = container.clientHeight || canvas.height || 600;
    ds.current.transform = {
      scale: 1,
      tx: (cw - imgW) / 2,
      ty: (ch - imgH) / 2,
    };
    render();
  };

  const handleCompletePoly = () => {
    if (ds.current.polyPoints.length >= 3) {
      const ann: PolygonAnnotation = {
        id: crypto.randomUUID(), type: "polygon",
        label: labelRef.current.name, color: labelRef.current.color,
        points: [...ds.current.polyPoints],
      };
      cbRef.current.onAddAnnotation(ann);
      ds.current.polyPoints = [];
      ds.current.polyMouse = null;
      render();
    }
  };

  const handleCancelDraw = () => {
    ds.current.polyPoints = [];
    ds.current.polyMouse = null;
    ds.current.isDrawingBBox = false;
    ds.current.bboxStart = null;
    ds.current.bboxCurrent = null;
    ds.current.isDrawingObb = false;
    ds.current.obbStart = null;
    ds.current.obbCurrent = null;
    render();
  };

  return (
    <div ref={containerRef} className="relative w-full h-full overflow-hidden bg-[#0d0d1a] touch-none">
      <canvas ref={canvasRef} className="block w-full h-full touch-none" style={{ touchAction: "none" }} />

      {/* Touch & Mobile Controls Overlay */}
      <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/80 backdrop-blur-md p-1.5 rounded-xl border border-white/10 shadow-xl z-10 select-none">
        <button
          onClick={() => handleZoom(1.25)}
          title="Zoom In (+ / =)"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-base transition-colors"
        >
          +
        </button>
        <button
          onClick={() => handleZoom(0.8)}
          title="Zoom Out (- / _)"
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white font-bold text-base transition-colors"
        >
          −
        </button>
        <button
          onClick={handleFit}
          title="Fit to Screen (F / 0)"
          className="px-2.5 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
        >
          Fit
        </button>
        <button
          onClick={handleReset100}
          title="Reset 100% (1:1 / R)"
          className="px-2 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white font-semibold text-xs transition-colors"
        >
          1:1
        </button>


        {ds.current.polyPoints.length >= 3 && (
          <button
            onClick={handleCompletePoly}
            title="Complete Polygon"
            className="px-3 h-8 flex items-center justify-center rounded-lg bg-cosmic-teal text-black font-bold text-xs transition-colors"
          >
            ✓ Done
          </button>
        )}

        {(ds.current.polyPoints.length > 0 || ds.current.isDrawingBBox || ds.current.isDrawingObb) && (
          <button
            onClick={handleCancelDraw}
            title="Cancel (Esc)"
            className="w-8 h-8 flex items-center justify-center rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-400 font-bold text-xs transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Zoom badge */}
      <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-sm text-white/80 text-xs px-2.5 py-1 rounded-md font-mono select-none pointer-events-none border border-white/10">
        {zoomPct}%
      </div>

      {/* Shortcut hint */}
      <div className="absolute bottom-3 left-3 text-white/40 text-[10px] select-none pointer-events-none leading-relaxed hidden sm:block">
        Touch/Pinch: zoom & pan · Scroll: zoom · Space+drag: pan · F: fit · Esc: cancel
      </div>
    </div>
  );
}
