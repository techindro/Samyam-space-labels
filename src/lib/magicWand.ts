// Smart Magic Wand & Auto-Contour Segmentation Tool for Satellite/Multimodal Vision

export function extractMagicWandContour(
  image: HTMLImageElement,
  startX: number,
  startY: number,
  tolerance: number = 32,
  maxPoints: number = 36
): [number, number][] | null {
  const w = image.naturalWidth || image.width;
  const h = image.naturalHeight || image.height;
  if (startX < 0 || startX >= w || startY < 0 || startY >= h) return null;

  // Offscreen canvas
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) return null;

  ctx.drawImage(image, 0, 0, w, h);

  // Focus on a bounding neighborhood of 250x250 around click to keep performance sub-50ms
  const radius = 140;
  const minX = Math.max(0, Math.floor(startX - radius));
  const minY = Math.max(0, Math.floor(startY - radius));
  const roiW = Math.min(w - minX, radius * 2);
  const roiH = Math.min(h - minY, radius * 2);

  const imgData = ctx.getImageData(minX, minY, roiW, roiH);
  const data = imgData.data;

  const localStartX = Math.floor(startX - minX);
  const localStartY = Math.floor(startY - minY);
  const startIdx = (localStartY * roiW + localStartX) * 4;

  const targetR = data[startIdx];
  const targetG = data[startIdx + 1];
  const targetB = data[startIdx + 2];

  const mask = new Uint8Array(roiW * roiH);
  const queue: [number, number][] = [[localStartX, localStartY]];
  mask[localStartY * roiW + localStartX] = 1;

  const tolSq = tolerance * tolerance * 3;

  let filledCount = 0;
  const maxPixels = 18000;

  while (queue.length > 0 && filledCount < maxPixels) {
    const [cx, cy] = queue.pop()!;
    filledCount++;

    const neighbors = [
      [cx + 1, cy],
      [cx - 1, cy],
      [cx, cy + 1],
      [cx, cy - 1],
    ];

    for (const [nx, ny] of neighbors) {
      if (nx >= 0 && nx < roiW && ny >= 0 && ny < roiH) {
        const mIdx = ny * roiW + nx;
        if (mask[mIdx] === 0) {
          const pIdx = mIdx * 4;
          const dr = data[pIdx] - targetR;
          const dg = data[pIdx + 1] - targetG;
          const db = data[pIdx + 2] - targetB;
          const distSq = dr * dr + dg * dg + db * db;

          if (distSq <= tolSq) {
            mask[mIdx] = 1;
            queue.push([nx, ny]);
          }
        }
      }
    }
  }

  if (filledCount < 8) {
    // If area is too small, create a smart localized polygon circle
    const r = 24;
    const pts: [number, number][] = [];
    for (let a = 0; a < Math.PI * 2; a += Math.PI / 6) {
      pts.push([
        Math.round(startX + Math.cos(a) * r),
        Math.round(startY + Math.sin(a) * r),
      ]);
    }
    return pts;
  }

  // Extract boundary contour points
  const boundaryPoints: [number, number][] = [];
  for (let y = 1; y < roiH - 1; y += 2) {
    for (let x = 1; x < roiW - 1; x += 2) {
      const idx = y * roiW + x;
      if (mask[idx] === 1) {
        // Check if on boundary
        if (
          mask[idx - 1] === 0 ||
          mask[idx + 1] === 0 ||
          mask[(y - 1) * roiW + x] === 0 ||
          mask[(y + 1) * roiW + x] === 0
        ) {
          boundaryPoints.push([minX + x, minY + y]);
        }
      }
    }
  }

  if (boundaryPoints.length < 3) return null;

  // Order boundary points radially around centroid
  const cX = boundaryPoints.reduce((s, p) => s + p[0], 0) / boundaryPoints.length;
  const cY = boundaryPoints.reduce((s, p) => s + p[1], 0) / boundaryPoints.length;

  boundaryPoints.sort((a, b) => {
    return Math.atan2(a[1] - cY, a[0] - cX) - Math.atan2(b[1] - cY, b[0] - cX);
  });

  // Downsample to smooth polygon
  const step = Math.max(1, Math.floor(boundaryPoints.length / maxPoints));
  const finalPolygon: [number, number][] = [];
  for (let i = 0; i < boundaryPoints.length; i += step) {
    finalPolygon.push(boundaryPoints[i]);
  }

  return finalPolygon.length >= 3 ? finalPolygon : null;
}
