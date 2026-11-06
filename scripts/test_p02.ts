import { execSync } from 'child_process';
import fs from 'fs';

function rgbToHsv(r: number, g: number, b: number): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h = 0, s = 0, v = max;
  const d = max - min;
  s = max === 0 ? 0 : d / max;
  if (max === min) h = 0;
  else {
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h, s, v];
}

function hsvToRgb(h: number, s: number, v: number): [number, number, number] {
  let r = 0, g = 0, b = 0;
  const i = Math.floor(h * 6);
  const f = h * 6 - i;
  const p = v * (1 - s);
  const q = v * (1 - f * s);
  const t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v; g = t; b = p; break;
    case 1: r = q; g = v; b = p; break;
    case 2: r = p; g = v; b = t; break;
    case 3: r = p; g = q; b = v; break;
    case 4: r = t; g = p; b = v; break;
    case 5: r = v; g = p; b = q; break;
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

const inJpg = 'public/images/airpods_pro_white_case_1793219800813.jpg';
const outSilver = 'public/images/editions/p02_space_silver.jpg';
const outSlate = 'public/images/editions/p02_stealth_slate.jpg';

const dim = execSync(`identify -format "%w %h" "${inJpg}"`).toString().trim().split(' ').map(Number);
const [w, h] = dim;

execSync(`convert "${inJpg}" -depth 8 /tmp/p2.rgba`);
const buf1 = fs.readFileSync('/tmp/p2.rgba');
const bufSilver = Buffer.from(buf1);
const bufSlate = Buffer.from(buf1);

// For P02: Case & buds are in range: x from 0.28 to 0.75, y from 0.28 to 0.78
for (let y = 0; y < h; y++) {
  for (let x = 0; x < w; x++) {
    const idx = (y * w + x) * 4;
    const r = buf1[idx];
    const g = buf1[idx+1];
    const b = buf1[idx+2];
    
    // Check if within product area or ear tips
    const inProductArea = (x > w * 0.05 && x < w * 0.85 && y > h * 0.25 && y < h * 0.9);
    // Dark elements like acoustic grilles, CE markings, led: preserve them!
    const isDarkFeature = (r < 70 && g < 70 && b < 70);
    const isGreenLed = (g > r + 30 && g > b + 30);
    
    if (inProductArea && !isDarkFeature && !isGreenLed) {
      // Soft distance weight to keep edges natural
      // For Stealth Slate:
      let [h1, s1, v1] = rgbToHsv(r, g, b);
      // Slate finish
      v1 = Math.max(0.12, v1 * 0.38);
      s1 = 0.05;
      const [nr1, ng1, nb1] = hsvToRgb(h1, s1, v1);
      bufSlate[idx] = nr1;
      bufSlate[idx+1] = ng1;
      bufSlate[idx+2] = nb1;

      // Space Silver finish
      let [h2, s2, v2] = rgbToHsv(r, g, b);
      v2 = Math.max(0.2, v2 * 0.68);
      s2 = 0.04;
      const [nr2, ng2, nb2] = hsvToRgb(h2, s2, v2);
      bufSilver[idx] = nr2;
      bufSilver[idx+1] = ng2;
      bufSilver[idx+2] = nb2;
    }
  }
}

fs.writeFileSync('/tmp/p2_silver.rgba', bufSilver);
fs.writeFileSync('/tmp/p2_slate.rgba', bufSlate);
execSync(`convert -size ${w}x${h} -depth 8 /tmp/p2_silver.rgba -quality 95 "${outSilver}"`);
execSync(`convert -size ${w}x${h} -depth 8 /tmp/p2_slate.rgba -quality 95 "${outSlate}"`);
console.log("P02 Done!");
