"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";

/* ---------- Color math helpers ---------- */

function hexToRgb(hex: string): [number, number, number] | null {
  const clean = hex.replace("#", "");
  if (!/^[0-9a-fA-F]{6}$/.test(clean)) return null;
  const n = parseInt(clean, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

function rgbToHex(r: number, g: number, b: number): string {
  return (
    "#" +
    [r, g, b]
      .map((v) => Math.max(0, Math.min(255, Math.round(v))).toString(16).padStart(2, "0"))
      .join("")
  );
}

function rgbToHsb(r: number, g: number, b: number): [number, number, number] {
  const rf = r / 255, gf = g / 255, bf = b / 255;
  const max = Math.max(rf, gf, bf), min = Math.min(rf, gf, bf);
  const d = max - min;
  const s = max === 0 ? 0 : d / max;
  const bv = max;
  let h = 0;
  if (d !== 0) {
    if (max === rf) h = ((gf - bf) / d) % 6;
    else if (max === gf) h = (bf - rf) / d + 2;
    else h = (rf - gf) / d + 4;
    h = Math.round(h * 60);
    if (h < 0) h += 360;
  }
  return [h, Math.round(s * 100), Math.round(bv * 100)];
}

function hsbToRgb(h: number, s: number, b: number): [number, number, number] {
  const sf = s / 100, bf = b / 100;
  const c = bf * sf;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = bf - c;
  let rf = 0, gf = 0, bl = 0;
  if (h < 60)      { rf = c; gf = x; }
  else if (h < 120){ rf = x; gf = c; }
  else if (h < 180){ gf = c; bl = x; }
  else if (h < 240){ gf = x; bl = c; }
  else if (h < 300){ rf = x; bl = c; }
  else             { rf = c; bl = x; }
  return [
    Math.round((rf + m) * 255),
    Math.round((gf + m) * 255),
    Math.round((bl + m) * 255),
  ];
}

function rotateHue(hex: string, degrees: number): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  const [h, s, b] = rgbToHsb(...rgb);
  const newH = (h + degrees + 360) % 360;
  return rgbToHex(...hsbToRgb(newH, s, b));
}

interface ColorInfo {
  hex: string;
  label: string;
}

function buildPalette(base: string): { complementary: ColorInfo[]; analogous: ColorInfo[]; triadic: ColorInfo[] } | null {
  const rgb = hexToRgb(base);
  if (!rgb) return null;
  const [h, s, b] = rgbToHsb(...rgb);

  const make = (hex: string, label: string): ColorInfo => ({ hex: hex.toUpperCase(), label });

  const comp = rotateHue(base, 180);
  const ana1 = rotateHue(base, -30);
  const ana2 = rotateHue(base, 30);
  const tri1 = rotateHue(base, 120);
  const tri2 = rotateHue(base, 240);

  // Shades of base
  const lighter = rgbToHex(...hsbToRgb(h, s, Math.min(100, b + 20)));
  const darker  = rgbToHex(...hsbToRgb(h, s, Math.max(0, b - 20)));

  return {
    complementary: [
      make(base.toUpperCase(), "Base"),
      make(lighter, "Light"),
      make(darker, "Dark"),
      make(comp, "Complement"),
    ],
    analogous: [
      make(ana1, "-30°"),
      make(base.toUpperCase(), "Base"),
      make(ana2, "+30°"),
      make(rotateHue(base, 60), "+60°"),
    ],
    triadic: [
      make(base.toUpperCase(), "Base"),
      make(tri1, "+120°"),
      make(tri2, "+240°"),
      make(comp, "Complement"),
    ],
  };
}

function getContrastColor(hex: string): string {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000000";
  const [r, g, b] = rgb;
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5 ? "#000000" : "#ffffff";
}

/* ---------- ColorSwatch component ---------- */

function ColorSwatch({ color }: { color: ColorInfo }) {
  const rgb = hexToRgb(color.hex);
  const hsb = rgb ? rgbToHsb(...rgb) : null;
  const text = getContrastColor(color.hex);

  const copy = async () => {
    await navigator.clipboard.writeText(color.hex);
    toast.success(`Copied ${color.hex}`);
  };

  return (
    <button
      onClick={copy}
      title={`Click to copy ${color.hex}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-200 text-left transition hover:scale-105 hover:shadow-md"
    >
      <div
        className="flex h-24 w-full items-end p-3"
        style={{ backgroundColor: color.hex, color: text }}
      >
        <span className="text-xs font-mono font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
          Click to copy
        </span>
      </div>
      <div className="bg-white px-3 py-2">
        <p className="text-xs font-semibold text-slate-500">{color.label}</p>
        <p className="font-mono text-sm font-bold text-slate-900">{color.hex}</p>
        {rgb && (
          <p className="text-xs text-slate-400 mt-0.5">
            rgb({rgb[0]}, {rgb[1]}, {rgb[2]})
          </p>
        )}
        {hsb && (
          <p className="text-xs text-slate-400">
            hsb({hsb[0]}°, {hsb[1]}%, {hsb[2]}%)
          </p>
        )}
      </div>
    </button>
  );
}

/* ---------- Main component ---------- */

export default function ColorPaletteClient() {
  const [hex, setHex] = useState("#6366f1");
  const [inputVal, setInputVal] = useState("#6366f1");
  const [error, setError] = useState<string | null>(null);

  const applyHex = useCallback((value: string) => {
    const v = value.startsWith("#") ? value : "#" + value;
    if (hexToRgb(v)) {
      setHex(v);
      setInputVal(v);
      setError(null);
    } else {
      setError("Invalid hex color. Use format #RRGGBB.");
    }
  }, []);

  const palette = buildPalette(hex);
  const rgb = hexToRgb(hex);
  const hsb = rgb ? rgbToHsb(...rgb) : null;

  const sections = palette
    ? [
        { title: "Complementary", colors: palette.complementary },
        { title: "Analogous", colors: palette.analogous },
        { title: "Triadic", colors: palette.triadic },
      ]
    : [];

  return (
    <div className="space-y-6">
      {/* Input */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <p className="mb-3 text-sm font-semibold text-slate-700">Base Color</p>
        <div className="flex items-center gap-3 flex-wrap">
          <input
            type="color"
            value={hex}
            onChange={(e) => applyHex(e.target.value)}
            className="h-12 w-12 cursor-pointer rounded-lg border border-slate-300 p-0.5"
            aria-label="Color picker"
          />
          <Input
            type="text"
            value={inputVal}
            onChange={(e) => {
              setInputVal(e.target.value);
              applyHex(e.target.value);
            }}
            placeholder="#6366f1"
            className="w-36 font-mono focus:border-indigo-400 focus:ring-indigo-300"
          />
          {rgb && (
            <span className="text-sm text-slate-500">
              RGB({rgb[0]}, {rgb[1]}, {rgb[2]})
              {hsb && ` · HSB(${hsb[0]}°, ${hsb[1]}%, ${hsb[2]}%)`}
            </span>
          )}
        </div>
        {error && <p role="alert" className="mt-2 text-sm text-red-600">{error}</p>}
      </div>

      {/* Palettes */}
      {sections.map((section) => (
        <div key={section.title} className="rounded-xl border border-slate-200 bg-white p-5">
          <h2 className="mb-4 text-sm font-semibold text-slate-700">{section.title}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {section.colors.map((c) => (
              <ColorSwatch key={c.hex + c.label} color={c} />
            ))}
          </div>
        </div>
      ))}

      <p className="text-center text-xs text-slate-400">
        Click any color swatch to copy its hex code to your clipboard.
      </p>
    </div>
  );
}
