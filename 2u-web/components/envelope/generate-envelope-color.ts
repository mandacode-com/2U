function adjustLightness(hex: string, percent: number): string {
  const hsl = hexToHSL(hex);
  hsl.l = Math.min(100, Math.max(0, hsl.l + percent));
  return HSLToHex(hsl);
}

function hexToHSL(hex: string) {
  let r = 0,
    g = 0,
    b = 0;
  hex = hex.replace("#", "");
  if (hex.length === 3) {
    r = parseInt(hex[0] + hex[0], 16);
    g = parseInt(hex[1] + hex[1], 16);
    b = parseInt(hex[2] + hex[2], 16);
  } else {
    r = parseInt(hex.substring(0, 2), 16);
    g = parseInt(hex.substring(2, 4), 16);
    b = parseInt(hex.substring(4, 6), 16);
  }

  r /= 255;
  g /= 255;
  b /= 255;
  const max = Math.max(r, g, b),
    min = Math.min(r, g, b);
  let h = 0,
    s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (max === g) h = (b - r) / d + 2;
    else if (max === b) h = (r - g) / d + 4;
    h /= 6;
  }

  return {
    h: Math.round(h * 360),
    s: Math.round(s * 100),
    l: Math.round(l * 100),
  };
}

function HSLToHex({ h, s, l }: { h: number; s: number; l: number }): string {
  l /= 100;
  s /= 100;
  const k = (n: number) => (n + h / 30) % 12;
  const a = s * Math.min(l, 1 - l);
  const f = (n: number) =>
    Math.round(
      255 * (l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)))),
    );
  return `#${[f(0), f(8), f(4)].map((x) => x.toString(16).padStart(2, "0")).join("")}`;
}

export function generateEnvelopeColors(envelopeColor: string, letterColor: string) {
  return {
    letterColor,
    innerColor: adjustLightness(envelopeColor, +20),
    topColor: adjustLightness(envelopeColor, +10),
    sidalColor: adjustLightness(envelopeColor, -5),
    bottomColor: adjustLightness(envelopeColor, -15),
  };
}
