"use client";

import { useId, useEffect, useState, useMemo } from "react";

interface Options {
  width: number;
  height: number;
  radius: number;
}

// Maximum displacement in px, reverse-engineered from the kube.io demo
// (78.53 × scaleRatio 0.7, as used by their searchbox/music player filter)
const SCALE = 78.53 * 0.7;

// Signed Distance Field for a rounded rectangle (pill), centered at origin.
// Negative inside, positive outside, zero on boundary.
const pillSDF = (px: number, py: number, hw: number, hh: number, r: number): number => {
  const dx = Math.abs(px) - (hw - r);
  const dy = Math.abs(py) - (hh - r);
  return (
    Math.sqrt(Math.max(dx, 0) ** 2 + Math.max(dy, 0) ** 2) +
    Math.min(Math.max(dx, dy), 0) -
    r
  );
};

interface Maps {
  displacementUrl: string;
  specularUrl: string;
}

// Both maps are generated at 2x supersampling, matching the demo's 840×112
// PNGs for a 420×56 element. All constants below are in 2x map pixels.
const generateMaps = (width: number, height: number, radius: number): Maps | null => {
  const w = width * 2;
  const h = height * 2;
  const r = radius * 2;

  const dispCanvas = document.createElement("canvas");
  dispCanvas.width = w;
  dispCanvas.height = h;
  const dispCtx = dispCanvas.getContext("2d");

  const specCanvas = document.createElement("canvas");
  specCanvas.width = w;
  specCanvas.height = h;
  const specCtx = specCanvas.getContext("2d");

  if (!dispCtx || !specCtx) return null;

  const disp = new Uint8ClampedArray(w * h * 4);
  const spec = new Uint8ClampedArray(w * h * 4);

  const hw = w / 2;
  const hh = h / 2;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const idx = (y * w + x) * 4;
      const cx = x + 0.5 - hw;
      const cy = y + 0.5 - hh;
      const sdf = pillSDF(cx, cy, hw, hh, r);

      if (sdf >= 0) {
        // Outside the pill: neutral displacement, transparent specular
        disp[idx] = 128;
        disp[idx + 1] = 128;
        disp[idx + 2] = 0;
        disp[idx + 3] = 255;
        continue;
      }

      // Outward normal via SDF gradient (central differences)
      const gx =
        (pillSDF(cx + 1, cy, hw, hh, r) - pillSDF(cx - 1, cy, hw, hh, r)) / 2;
      const gy =
        (pillSDF(cx, cy + 1, hw, hh, r) - pillSDF(cx, cy - 1, hw, hh, r)) / 2;
      const len = Math.hypot(gx, gy) || 1;
      const nx = gx / len;
      const ny = gy / len;

      // Refraction magnitude: exponential falloff from the boundary,
      // fitted on the demo's displacement map (|v| = 105·exp(−d/9.5))
      const d = -sdf;
      const m = 105 * Math.exp(-d / 9.5);

      // Displacement points INWARD (toward center): convex lens refraction
      disp[idx] = Math.round(128 - nx * m); // R → X
      disp[idx + 1] = Math.round(128 - ny * m); // G → Y
      disp[idx + 2] = 0;
      disp[idx + 3] = 255;

      // Specular ring: thin white band just inside the edge, brighter where
      // the surface faces up/down (simulates vertical lighting)
      if (sdf > -2.5 && sdf < -0.5) {
        const alpha = Math.round(64 + 127 * ny * ny);
        spec[idx] = 255;
        spec[idx + 1] = 255;
        spec[idx + 2] = 255;
        spec[idx + 3] = alpha;
      }
    }
  }

  dispCtx.putImageData(new ImageData(disp, w, h), 0, 0);
  specCtx.putImageData(new ImageData(spec, w, h), 0, 0);

  return {
    displacementUrl: dispCanvas.toDataURL("image/png"),
    specularUrl: specCanvas.toDataURL("image/png"),
  };
};

export const useLiquidGlass = ({ width, height, radius }: Options) => {
  const uid = useId().replace(/:/g, "");
  const filterId = `lg-${uid}`;

  // useEffect guarantees SSR and hydration both start with false,
  // avoiding a server/client HTML mismatch.
  const [isSupported, setIsSupported] = useState(false);
  useEffect(() => {
    const el = document.createElement("div");
    el.style.backdropFilter = "url(#test)";
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsSupported(el.style.backdropFilter !== "");
  }, []);

  const maps = useMemo(() => {
    if (!isSupported || width === 0 || height === 0) return null;
    return generateMaps(width, height, radius);
  }, [isSupported, width, height, radius]);

  return {
    filterId,
    displacementUrl: maps?.displacementUrl ?? null,
    specularUrl: maps?.specularUrl ?? null,
    isSupported,
    scale: SCALE,
  };
};
