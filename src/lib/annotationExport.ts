import type { Annotation, LabelClass } from "@/components/annotation/useAnnotationState";

export type ExportFormat = "json" | "coco" | "yolo" | "geojson" | "csv";

export interface ExportCtx {
  annotations: Annotation[];
  labels: LabelClass[];
  imageWidth: number;
  imageHeight: number;
  imageName: string;
  title?: string;
}

const bboxOf = (a: Annotation) => {
  if (a.type === "bbox") return a.bbox;
  const xs = a.points.map(p => p[0]);
  const ys = a.points.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
};

const polyArea = (pts: [number, number][]) => {
  let s = 0;
  for (let i = 0; i < pts.length; i++) {
    const [x1, y1] = pts[i];
    const [x2, y2] = pts[(i + 1) % pts.length];
    s += x1 * y2 - x2 * y1;
  }
  return Math.abs(s) / 2;
};

export function toCoco(ctx: ExportCtx) {
  const cats = ctx.labels.map((l, i) => ({ id: i + 1, name: l.name, supercategory: "object" }));
  const catId = (name: string) => cats.find(c => c.name === name)?.id ?? 1;
  return {
    info: {
      description: ctx.title ?? "samyam annotation export",
      version: "1.0",
      date_created: new Date().toISOString(),
    },
    licenses: [],
    images: [{ id: 1, file_name: ctx.imageName, width: ctx.imageWidth, height: ctx.imageHeight }],
    categories: cats,
    annotations: ctx.annotations.map((a, i) => {
      const b = bboxOf(a);
      return {
        id: i + 1,
        image_id: 1,
        category_id: catId(a.label),
        bbox: [round(b.x), round(b.y), round(b.w), round(b.h)],
        area: a.type === "polygon" ? round(polyArea(a.points)) : round(b.w * b.h),
        iscrowd: 0,
        segmentation: a.type === "polygon" ? [a.points.flatMap(p => [round(p[0]), round(p[1])])] : [],
      };
    }),
  };
}

export function toYolo(ctx: ExportCtx) {
  const idx = (name: string) => Math.max(0, ctx.labels.findIndex(l => l.name === name));
  const lines = ctx.annotations.map(a => {
    const b = bboxOf(a);
    const cx = (b.x + b.w / 2) / ctx.imageWidth;
    const cy = (b.y + b.h / 2) / ctx.imageHeight;
    return `${idx(a.label)} ${f(cx)} ${f(cy)} ${f(b.w / ctx.imageWidth)} ${f(b.h / ctx.imageHeight)}`;
  });
  const names = ctx.labels.map((l, i) => `  ${i}: ${l.name}`).join("\n");
  return {
    labelsTxt: lines.join("\n") + (lines.length ? "\n" : ""),
    dataYaml: `# samyam YOLO export\nnames:\n${names}\nnc: ${ctx.labels.length}\n`,
  };
}

export function toGeoJson(ctx: ExportCtx) {
  // Pixel coords normalised to a simple image CRS (x right, y down flipped to lat-like)
  const toLngLat = (x: number, y: number): [number, number] => [
    +(x / ctx.imageWidth).toFixed(6),
    +(1 - y / ctx.imageHeight).toFixed(6),
  ];
  return {
    type: "FeatureCollection",
    name: ctx.imageName,
    crs: { type: "name", properties: { name: "urn:samyam:image-normalised" } },
    features: ctx.annotations.map((a, i) => {
      const props = { id: a.id, index: i + 1, label: a.label, color: a.color, type: a.type };
      if (a.type === "polygon") {
        const ring = a.points.map(p => toLngLat(p[0], p[1]));
        if (ring.length) ring.push(ring[0]);
        return { type: "Feature", properties: props, geometry: { type: "Polygon", coordinates: [ring] } };
      }
      const b = a.bbox;
      const ring = [
        toLngLat(b.x, b.y), toLngLat(b.x + b.w, b.y),
        toLngLat(b.x + b.w, b.y + b.h), toLngLat(b.x, b.y + b.h), toLngLat(b.x, b.y),
      ];
      return { type: "Feature", properties: props, geometry: { type: "Polygon", coordinates: [ring] } };
    }),
  };
}

export function toCsv(ctx: ExportCtx) {
  const rows = [["index", "id", "label", "type", "x", "y", "width", "height", "points"]];
  ctx.annotations.forEach((a, i) => {
    const b = bboxOf(a);
    rows.push([
      String(i + 1), a.id, a.label, a.type,
      String(round(b.x)), String(round(b.y)), String(round(b.w)), String(round(b.h)),
      a.type === "polygon" ? a.points.map(p => `${round(p[0])} ${round(p[1])}`).join(";") : "",
    ]);
  });
  return rows.map(r => r.map(c => (/[",\n]/.test(c) ? `"${c.replace(/"/g, '""')}"` : c)).join(",")).join("\n");
}

export function downloadFile(name: string, content: string, mime: string) {
  const blob = new Blob([content], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

function round(n: number) { return Math.round(n * 100) / 100; }
function f(n: number) { return Math.min(1, Math.max(0, n)).toFixed(6); }
