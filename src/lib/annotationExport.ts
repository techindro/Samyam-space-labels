import type { Annotation, LabelClass, OBBAnnotation } from "@/components/annotation/useAnnotationState";

export type ExportFormat = "json" | "coco" | "yolo" | "yolo_obb" | "dota" | "geojson" | "csv";

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
  if (a.type === "obb") {
    // AABB envelope for OBB
    const rad = (a.obb.angle * Math.PI) / 180;
    const cos = Math.abs(Math.cos(rad));
    const sin = Math.abs(Math.sin(rad));
    const boundW = a.obb.w * cos + a.obb.h * sin;
    const boundH = a.obb.w * sin + a.obb.h * cos;
    return {
      x: a.obb.cx - boundW / 2,
      y: a.obb.cy - boundH / 2,
      w: boundW,
      h: boundH,
    };
  }
  const xs = a.points.map(p => p[0]);
  const ys = a.points.map(p => p[1]);
  const x = Math.min(...xs), y = Math.min(...ys);
  return { x, y, w: Math.max(...xs) - x, h: Math.max(...ys) - y };
};

export const getObbCorners = (obb: OBBAnnotation["obb"]): [number, number][] => {
  const rad = (obb.angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const hw = obb.w / 2;
  const hh = obb.h / 2;

  const offsets: [number, number][] = [
    [-hw, -hh],
    [hw, -hh],
    [hw, hh],
    [-hw, hh],
  ];

  return offsets.map(([ox, oy]) => [
    obb.cx + ox * cos - oy * sin,
    obb.cy + ox * sin + oy * cos,
  ]);
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

export function toYoloObb(ctx: ExportCtx) {
  const idx = (name: string) => Math.max(0, ctx.labels.findIndex(l => l.name === name));
  const lines = ctx.annotations.map(a => {
    if (a.type === "obb") {
      const corners = getObbCorners(a.obb);
      const coords = corners.flatMap(([x, y]) => [
        f(x / ctx.imageWidth),
        f(y / ctx.imageHeight)
      ]).join(" ");
      return `${idx(a.label)} ${coords}`;
    }
    const b = bboxOf(a);
    const x1 = f(b.x / ctx.imageWidth), y1 = f(b.y / ctx.imageHeight);
    const x2 = f((b.x + b.w) / ctx.imageWidth), y2 = y1;
    const x3 = x2, y3 = f((b.y + b.h) / ctx.imageHeight);
    const x4 = x1, y4 = y3;
    return `${idx(a.label)} ${x1} ${y1} ${x2} ${y2} ${x3} ${y3} ${x4} ${y4}`;
  });
  const names = ctx.labels.map((l, i) => `  ${i}: ${l.name}`).join("\n");
  return {
    labelsTxt: lines.join("\n") + (lines.length ? "\n" : ""),
    dataYaml: `# samyam YOLO-OBB (Oriented Bounding Box) export\nnames:\n${names}\nnc: ${ctx.labels.length}\n`,
  };
}

export function toDota(ctx: ExportCtx) {
  const lines = [
    `imagesource:samyam_satellite_vlm`,
    `gsd:0.15`,
    ...ctx.annotations.map(a => {
      if (a.type === "obb") {
        const corners = getObbCorners(a.obb);
        const coords = corners.flatMap(([x, y]) => [round(x), round(y)]).join(" ");
        return `${coords} ${a.label.replace(/\s+/g, "_")} 0`;
      }
      const b = bboxOf(a);
      const x1 = round(b.x), y1 = round(b.y);
      const x2 = round(b.x + b.w), y2 = y1;
      const x3 = x2, y3 = round(b.y + b.h);
      const x4 = x1, y4 = y3;
      return `${x1} ${y1} ${x2} ${y2} ${x3} ${y3} ${x4} ${y4} ${a.label.replace(/\s+/g, "_")} 0`;
    })
  ];
  return lines.join("\n") + "\n";
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
      const b = bboxOf(a);
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
