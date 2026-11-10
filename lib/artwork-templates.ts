export type Point = { x: number; y: number };

export type Shape =
  | { type: "path"; points: Point[]; color: string; width: number }
  | { type: "rectangle"; x: number; y: number; width: number; height: number; color: string; widthStroke: number; fill?: string }
  | { type: "circle"; cx: number; cy: number; radius: number; color: string; widthStroke: number; fill?: string }
  | { type: "polygon"; points: Point[]; color: string; widthStroke: number; fill?: string }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number; color: string; widthStroke: number }
  | {
      type: "text";
      x: number;
      y: number;
      value: string;
      color: string;
      size?: number;
      anchor?: "start" | "middle" | "end";
      fontFamily?: string;
      fontWeight?: string | number;
    };

export const CANVAS_SIZE = 400;
export const FONT_SANS = "ui-sans-serif,system-ui,sans-serif";
export const FONT_MONO = "ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,monospace";
export const FONT_SERIF = "Georgia,Cambria,'Times New Roman',Times,serif";

export type TemplatePalette = {
  id: string;
  name: string;
  accent: string;
  base: string;
  highlight: string;
};

export type ArtworkCategory = "all" | "heritage" | "ecosystem" | "builder" | "achievement";

export type ArtworkTemplate = {
  id: string;
  name: string;
  category: ArtworkCategory;
  description: string;
  palettes: TemplatePalette[];
  build: (palette: TemplatePalette) => Shape[];
};

export const sparkle = (cx: number, cy: number, radius: number, color: string): Shape => ({
  type: "polygon",
  points: [
    { x: cx, y: cy - radius },
    { x: cx + radius * 0.3, y: cy - radius * 0.3 },
    { x: cx + radius, y: cy },
    { x: cx + radius * 0.3, y: cy + radius * 0.3 },
    { x: cx, y: cy + radius },
    { x: cx - radius * 0.3, y: cy + radius * 0.3 },
    { x: cx - radius, y: cy },
    { x: cx - radius * 0.3, y: cy - radius * 0.3 },
  ],
  color,
  widthStroke: 0,
  fill: color,
});

export const bolt = (color: string, offsetX = 0, offsetY = 0, scale = 1): Shape => ({
  type: "polygon",
  points: [
    { x: 114 * scale + offsetX, y: 46 * scale + offsetY },
    { x: 97 * scale + offsetX, y: 80 * scale + offsetY },
    { x: 106 * scale + offsetX, y: 80 * scale + offsetY },
    { x: 86 * scale + offsetX, y: 116 * scale + offsetY },
    { x: 113 * scale + offsetX, y: 82 * scale + offsetY },
    { x: 104 * scale + offsetX, y: 82 * scale + offsetY },
    { x: 122 * scale + offsetX, y: 46 * scale + offsetY },
  ],
  color,
  widthStroke: 0,
  fill: color,
});

export const star5 = (cx: number, cy: number, outerR: number, innerR: number, color: string, widthStroke = 0, fill?: string): Shape => {
  const points: Point[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = (i * Math.PI) / 5 - Math.PI / 2;
    points.push({
      x: cx + r * Math.cos(angle),
      y: cy + r * Math.sin(angle),
    });
  }
  return {
    type: "polygon",
    points,
    color,
    widthStroke,
    fill: fill ?? (widthStroke === 0 ? color : "none"),
  };
};

export const hexagon = (cx: number, cy: number, radius: number, color: string, widthStroke = 4, fill?: string): Shape => {
  const points: Point[] = [];
  for (let i = 0; i < 6; i++) {
    const angle = (i * Math.PI) / 3 - Math.PI / 6;
    points.push({
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    });
  }
  return {
    type: "polygon",
    points,
    color,
    widthStroke,
    fill: fill ?? "none",
  };
};

export const diamondShape = (cx: number, cy: number, width: number, height: number, color: string, widthStroke = 0, fill?: string): Shape => ({
  type: "polygon",
  points: [
    { x: cx, y: cy - height / 2 },
    { x: cx + width / 2, y: cy },
    { x: cx, y: cy + height / 2 },
    { x: cx - width / 2, y: cy },
  ],
  color,
  widthStroke,
  fill: fill ?? color,
});

export type AccentStamp = {
  id: string;
  name: string;
  iconName: string;
  create: (cx: number, cy: number, color: string) => Shape[];
};

export const ACCENT_STAMPS: AccentStamp[] = [
  {
    id: "sparkle",
    name: "Sparkle",
    iconName: "Sparkles",
    create: (cx, cy, color) => [sparkle(cx, cy, 26, color)],
  },
  {
    id: "star",
    name: "5-Point Star",
    iconName: "Star",
    create: (cx, cy, color) => [star5(cx, cy, 32, 14, color)],
  },
  {
    id: "bolt",
    name: "Lightning Bolt",
    iconName: "Zap",
    create: (cx, cy, color) => [bolt(color, cx - 104, cy - 81, 1)],
  },
  {
    id: "diamond",
    name: "Diamond",
    iconName: "Gem",
    create: (cx, cy, color) => [
      diamondShape(cx, cy, 54, 54, color, 0, color),
      diamondShape(cx, cy, 30, 30, "#ffffff", 0, "#ffffff"),
    ],
  },
  {
    id: "shield-crest",
    name: "Shield Crest",
    iconName: "Shield",
    create: (cx, cy, color) => [
      {
        type: "polygon",
        points: [
          { x: cx, y: cy + 40 },
          { x: cx + 32, y: cy + 18 },
          { x: cx + 32, y: cy - 35 },
          { x: cx, y: cy - 40 },
          { x: cx - 32, y: cy - 35 },
          { x: cx - 32, y: cy + 18 },
        ],
        color,
        widthStroke: 4,
        fill: "none",
      },
      star5(cx, cy - 8, 14, 6, color),
    ],
  },
  {
    id: "target",
    name: "Target Crosshair",
    iconName: "Crosshair",
    create: (cx, cy, color) => [
      { type: "circle", cx, cy, radius: 28, color, widthStroke: 3, fill: "none" },
      { type: "circle", cx, cy, radius: 12, color, widthStroke: 2, fill: "none" },
      { type: "circle", cx, cy, radius: 4, color, widthStroke: 0, fill: color },
      { type: "line", x1: cx - 36, y1: cy, x2: cx + 36, y2: cy, color, widthStroke: 2 },
      { type: "line", x1: cx, y1: cy - 36, x2: cx, y2: cy + 36, color, widthStroke: 2 },
    ],
  },
  {
    id: "crown",
    name: "Crown",
    iconName: "Crown",
    create: (cx, cy, color) => [
      {
        type: "polygon",
        points: [
          { x: cx - 36, y: cy + 18 },
          { x: cx + 36, y: cy + 18 },
          { x: cx + 42, y: cy - 14 },
          { x: cx + 20, y: cy - 2 },
          { x: cx, y: cy - 24 },
          { x: cx - 20, y: cy - 2 },
          { x: cx - 42, y: cy - 14 },
        ],
        color,
        widthStroke: 0,
        fill: color,
      },
      { type: "circle", cx: cx - 42, cy: cy - 18, radius: 4, color, widthStroke: 0, fill: color },
      { type: "circle", cx, cy: cy - 28, radius: 4, color, widthStroke: 0, fill: color },
      { type: "circle", cx: cx + 42, cy: cy - 18, radius: 4, color, widthStroke: 0, fill: color },
    ],
  },
];

export const ARTWORK_TEMPLATES: ArtworkTemplate[] = [
  {
    id: "mosaic",
    name: "Mosaic tile",
    category: "heritage",
    description: "Filled and framed tiles, a center diamond and stamped lettering",
    palettes: [
      { id: "tide", name: "Tide", accent: "#14b8a6", base: "#475569", highlight: "#f59e0b" },
      { id: "violet", name: "Violet dusk", accent: "#8b5cf6", base: "#64748b", highlight: "#f43f5e" },
      { id: "moss", name: "Moss", accent: "#4d7c0f", base: "#57534e", highlight: "#d97706" },
    ],
    build: (palette) => [
      { type: "rectangle", x: 28, y: 28, width: 344, height: 344, color: palette.base, widthStroke: 6 },
      { type: "rectangle", x: 44, y: 44, width: 148, height: 148, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "rectangle", x: 208, y: 44, width: 148, height: 148, color: palette.base, widthStroke: 5 },
      { type: "rectangle", x: 44, y: 208, width: 148, height: 148, color: palette.base, widthStroke: 5 },
      { type: "rectangle", x: 208, y: 208, width: 148, height: 148, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "rectangle", x: 96, y: 96, width: 44, height: 44, color: palette.highlight, widthStroke: 0, fill: palette.highlight },
      { type: "rectangle", x: 260, y: 260, width: 44, height: 44, color: palette.highlight, widthStroke: 0, fill: palette.highlight },
      { type: "polygon", points: [{ x: 200, y: 164 }, { x: 236, y: 200 }, { x: 200, y: 236 }, { x: 164, y: 200 }], color: palette.highlight, widthStroke: 0, fill: palette.highlight },
      { type: "text", x: 282, y: 130, value: "POAP", color: palette.base, size: 36, anchor: "middle" },
      { type: "line", x1: 246, y1: 146, x2: 318, y2: 146, color: palette.accent, widthStroke: 4 },
      { type: "text", x: 118, y: 294, value: "2026", color: palette.base, size: 36, anchor: "middle" },
      { type: "line", x1: 82, y1: 310, x2: 154, y2: 310, color: palette.accent, widthStroke: 4 },
    ],
  },
  {
    id: "orbit",
    name: "Orbit seal",
    category: "ecosystem",
    description: "Rings, compass ticks, a satellite and a stamped year",
    palettes: [
      { id: "aurora", name: "Aurora", accent: "#2dd4bf", base: "#94a3b8", highlight: "#fbbf24" },
      { id: "nebula", name: "Nebula", accent: "#a78bfa", base: "#94a3b8", highlight: "#38bdf8" },
      { id: "ember", name: "Ember", accent: "#fb923c", base: "#a8a29e", highlight: "#facc15" },
    ],
    build: (palette) => [
      { type: "circle", cx: 200, cy: 200, radius: 152, color: palette.base, widthStroke: 6 },
      { type: "circle", cx: 200, cy: 200, radius: 112, color: palette.accent, widthStroke: 4 },
      { type: "line", x1: 200, y1: 44, x2: 200, y2: 64, color: palette.base, widthStroke: 4 },
      { type: "line", x1: 200, y1: 336, x2: 200, y2: 356, color: palette.base, widthStroke: 4 },
      { type: "line", x1: 44, y1: 200, x2: 64, y2: 200, color: palette.base, widthStroke: 4 },
      { type: "line", x1: 336, y1: 200, x2: 356, y2: 200, color: palette.base, widthStroke: 4 },
      { type: "circle", cx: 200, cy: 200, radius: 40, color: palette.accent, widthStroke: 7 },
      { type: "circle", cx: 200, cy: 200, radius: 12, color: palette.highlight, widthStroke: 0, fill: palette.highlight },
      { type: "circle", cx: 279, cy: 121, radius: 11, color: palette.highlight, widthStroke: 0, fill: palette.highlight },
      sparkle(318, 84, 13, palette.accent),
      sparkle(80, 312, 11, palette.highlight),
      { type: "text", x: 200, y: 116, value: "TESSERA", color: palette.base, size: 20, anchor: "middle" },
      { type: "text", x: 200, y: 288, value: "IN ORBIT", color: palette.base, size: 26, anchor: "middle" },
      { type: "text", x: 200, y: 314, value: "SINCE 2026", color: palette.accent, size: 14, anchor: "middle" },
    ],
  },
  {
    id: "signal",
    name: "Signal badge",
    category: "builder",
    description: "Rising bars, a broadcast mast, a bolt and a live stamp",
    palettes: [
      { id: "pulse", name: "Pulse", accent: "#06b6d4", base: "#64748b", highlight: "#f97316" },
      { id: "matrix", name: "Matrix", accent: "#22c55e", base: "#475569", highlight: "#eab308" },
      { id: "ruby", name: "Ruby", accent: "#ef4444", base: "#52525b", highlight: "#fb7185" },
    ],
    build: (palette) => [
      { type: "rectangle", x: 32, y: 32, width: 336, height: 336, color: palette.base, widthStroke: 6 },
      bolt(palette.highlight),
      { type: "text", x: 200, y: 84, value: "ON AIR", color: palette.base, size: 24, anchor: "middle" },
      { type: "line", x1: 296, y1: 58, x2: 296, y2: 92, color: palette.base, widthStroke: 4 },
      { type: "circle", cx: 296, cy: 48, radius: 9, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "line", x1: 314, y1: 66, x2: 296, y2: 82, color: palette.accent, widthStroke: 3 },
      { type: "line", x1: 278, y1: 66, x2: 296, y2: 82, color: palette.accent, widthStroke: 3 },
      { type: "rectangle", x: 84, y: 246, width: 40, height: 64, color: palette.accent, widthStroke: 5 },
      { type: "rectangle", x: 146, y: 196, width: 40, height: 114, color: palette.accent, widthStroke: 5 },
      { type: "rectangle", x: 208, y: 146, width: 40, height: 164, color: palette.accent, widthStroke: 5 },
      { type: "rectangle", x: 270, y: 96, width: 40, height: 214, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "line", x1: 64, y1: 318, x2: 336, y2: 318, color: palette.base, widthStroke: 5 },
      { type: "line", x1: 120, y1: 310, x2: 120, y2: 326, color: palette.base, widthStroke: 3 },
      { type: "line", x1: 200, y1: 310, x2: 200, y2: 326, color: palette.base, widthStroke: 3 },
      { type: "line", x1: 280, y1: 310, x2: 280, y2: 326, color: palette.base, widthStroke: 3 },
      { type: "text", x: 200, y: 352, value: "MEETUP 2026", color: palette.base, size: 18, anchor: "middle" },
    ],
  },
  {
    id: "farcaster",
    name: "Farcaster Crest",
    category: "ecosystem",
    description: "Isometric community cube, arched dome bezel and channel stamp",
    palettes: [
      { id: "amethyst", name: "Amethyst", accent: "#855DCD", base: "#475569", highlight: "#c084fc" },
      { id: "fc-gold", name: "Guild Gold", accent: "#855DCD", base: "#64748b", highlight: "#fbbf24" },
      { id: "fc-cyan", name: "Cyber Violet", accent: "#a855f7", base: "#334155", highlight: "#38bdf8" },
    ],
    build: (palette) => [
      {
        type: "polygon",
        points: [
          { x: 100, y: 36 },
          { x: 300, y: 36 },
          { x: 364, y: 100 },
          { x: 364, y: 300 },
          { x: 300, y: 364 },
          { x: 100, y: 364 },
          { x: 36, y: 300 },
          { x: 36, y: 100 },
        ],
        color: palette.accent,
        widthStroke: 6,
      },
      {
        type: "polygon",
        points: [
          { x: 106, y: 48 },
          { x: 294, y: 48 },
          { x: 352, y: 106 },
          { x: 352, y: 294 },
          { x: 294, y: 352 },
          { x: 106, y: 352 },
          { x: 48, y: 294 },
          { x: 48, y: 106 },
        ],
        color: palette.base,
        widthStroke: 2,
      },
      {
        type: "polygon",
        points: [{ x: 200, y: 120 }, { x: 245, y: 145 }, { x: 200, y: 170 }, { x: 155, y: 145 }],
        color: palette.highlight,
        widthStroke: 0,
        fill: palette.highlight,
      },
      {
        type: "polygon",
        points: [{ x: 155, y: 145 }, { x: 200, y: 170 }, { x: 200, y: 225 }, { x: 155, y: 200 }],
        color: palette.accent,
        widthStroke: 0,
        fill: palette.accent,
      },
      {
        type: "polygon",
        points: [{ x: 200, y: 170 }, { x: 245, y: 145 }, { x: 245, y: 200 }, { x: 200, y: 225 }],
        color: palette.base,
        widthStroke: 0,
        fill: palette.base,
      },
      { type: "circle", cx: 200, cy: 172, radius: 68, color: palette.accent, widthStroke: 3 },
      sparkle(115, 115, 12, palette.highlight),
      sparkle(285, 115, 12, palette.highlight),
      { type: "text", x: 200, y: 280, value: "FARCASTER", color: palette.accent, size: 24, anchor: "middle", fontWeight: 700 },
      { type: "line", x1: 120, y1: 296, x2: 280, y2: 296, color: palette.base, widthStroke: 3 },
      { type: "text", x: 200, y: 322, value: "COMMUNITY CLUB", color: palette.highlight, size: 14, anchor: "middle" },
    ],
  },
  {
    id: "cypherpunk",
    name: "Terminal Frame",
    category: "builder",
    description: "CRT monitor bezel, code prompt chevrons, scan grid and block header",
    palettes: [
      { id: "crt-green", name: "Green CRT", accent: "#22c55e", base: "#1e293b", highlight: "#86efac" },
      { id: "amber-phosphor", name: "Amber CRT", accent: "#f59e0b", base: "#292524", highlight: "#fde68a" },
      { id: "cyber-cyan", name: "Hacker Cyan", accent: "#06b6d4", base: "#1e1e2e", highlight: "#67e8f9" },
    ],
    build: (palette) => [
      { type: "rectangle", x: 24, y: 24, width: 352, height: 352, color: palette.accent, widthStroke: 5, fill: palette.base },
      { type: "rectangle", x: 36, y: 36, width: 328, height: 32, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "circle", cx: 54, cy: 52, radius: 6, color: palette.base, widthStroke: 0, fill: palette.base },
      { type: "circle", cx: 72, cy: 52, radius: 6, color: palette.base, widthStroke: 0, fill: palette.base },
      { type: "circle", cx: 90, cy: 52, radius: 6, color: palette.base, widthStroke: 0, fill: palette.base },
      { type: "text", x: 200, y: 58, value: "CONSOLE://POAP", color: palette.base, size: 14, anchor: "middle", fontFamily: FONT_MONO, fontWeight: 700 },
      { type: "text", x: 50, y: 110, value: "> INIT_EVENT(84532)", color: palette.highlight, size: 16, anchor: "start", fontFamily: FONT_MONO },
      { type: "text", x: 50, y: 140, value: "> PROOF_VALIDATED: OK", color: palette.accent, size: 15, anchor: "start", fontFamily: FONT_MONO },
      { type: "rectangle", x: 50, y: 170, width: 300, height: 100, color: palette.accent, widthStroke: 3 },
      { type: "text", x: 200, y: 215, value: "{ BUILDER }", color: palette.highlight, size: 30, anchor: "middle", fontFamily: FONT_MONO, fontWeight: 700 },
      { type: "text", x: 200, y: 248, value: "VERIFIED ATTENDANCE", color: palette.accent, size: 13, anchor: "middle", fontFamily: FONT_MONO },
      { type: "line", x1: 50, y1: 295, x2: 350, y2: 295, color: palette.accent, widthStroke: 2 },
      { type: "text", x: 50, y: 325, value: "STATUS: 100% ONCHAIN", color: palette.highlight, size: 13, anchor: "start", fontFamily: FONT_MONO },
      { type: "text", x: 50, y: 350, value: "STORAGE: SSTORE2_BYTECODE", color: palette.accent, size: 11, anchor: "start", fontFamily: FONT_MONO },
    ],
  },
  {
    id: "laurel",
    name: "Roman Medallion",
    category: "heritage",
    description: "Imperial coin rings, twin laurel branches and classical Roman seal",
    palettes: [
      { id: "gold-medal", name: "Imperial Gold", accent: "#d97706", base: "#451a03", highlight: "#fbbf24" },
      { id: "bronze-patina", name: "Verdigris Bronze", accent: "#0d9488", base: "#134e4a", highlight: "#5eead4" },
      { id: "silver-medal", name: "Sterling Silver", accent: "#94a3b8", base: "#334155", highlight: "#f1f5f9" },
    ],
    build: (palette) => [
      { type: "circle", cx: 200, cy: 200, radius: 168, color: palette.accent, widthStroke: 8 },
      { type: "circle", cx: 200, cy: 200, radius: 152, color: palette.highlight, widthStroke: 2 },
      { type: "circle", cx: 200, cy: 200, radius: 140, color: palette.base, widthStroke: 4 },
      {
        type: "polygon",
        points: [{ x: 200, y: 120 }, { x: 248, y: 168 }, { x: 200, y: 216 }, { x: 152, y: 168 }],
        color: palette.highlight,
        widthStroke: 4,
        fill: palette.accent,
      },
      star5(200, 168, 18, 8, palette.highlight),
      { type: "circle", cx: 124, cy: 150, radius: 10, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "circle", cx: 116, cy: 180, radius: 11, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "circle", cx: 122, cy: 212, radius: 10, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "circle", cx: 138, cy: 240, radius: 9, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "circle", cx: 276, cy: 150, radius: 10, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "circle", cx: 284, cy: 180, radius: 11, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "circle", cx: 278, cy: 212, radius: 10, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "circle", cx: 262, cy: 240, radius: 9, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "text", x: 200, y: 92, value: "T E S S E R A", color: palette.highlight, size: 20, anchor: "middle", fontFamily: FONT_SERIF, fontWeight: 700 },
      { type: "text", x: 200, y: 282, value: "ATTENDANCE", color: palette.highlight, size: 22, anchor: "middle", fontFamily: FONT_SERIF, fontWeight: 700 },
      { type: "text", x: 200, y: 312, value: "• MMXXVI •", color: palette.accent, size: 14, anchor: "middle", fontFamily: FONT_SERIF },
    ],
  },
  {
    id: "shield",
    name: "Champion Shield",
    category: "achievement",
    description: "Heraldic tournament crest, victory star cluster and chevron dividers",
    palettes: [
      { id: "gold-shield", name: "Victory Gold", accent: "#eab308", base: "#451a03", highlight: "#fef08a" },
      { id: "azure-shield", name: "Royal Azure", accent: "#3b82f6", base: "#172554", highlight: "#93c5fd" },
      { id: "crimson-shield", name: "Honor Red", accent: "#ef4444", base: "#450a0a", highlight: "#fca5a5" },
    ],
    build: (palette) => [
      {
        type: "polygon",
        points: [
          { x: 200, y: 370 },
          { x: 334, y: 280 },
          { x: 334, y: 60 },
          { x: 200, y: 40 },
          { x: 66, y: 60 },
          { x: 66, y: 280 },
        ],
        color: palette.accent,
        widthStroke: 7,
      },
      {
        type: "polygon",
        points: [
          { x: 200, y: 348 },
          { x: 318, y: 268 },
          { x: 318, y: 76 },
          { x: 200, y: 58 },
          { x: 82, y: 76 },
          { x: 82, y: 268 },
        ],
        color: palette.base,
        widthStroke: 3,
      },
      {
        type: "polygon",
        points: [
          { x: 200, y: 190 },
          { x: 314, y: 125 },
          { x: 314, y: 165 },
          { x: 200, y: 230 },
          { x: 86, y: 165 },
          { x: 86, y: 125 },
        ],
        color: palette.accent,
        widthStroke: 0,
        fill: palette.accent,
      },
      star5(200, 125, 34, 15, palette.highlight),
      star5(130, 265, 15, 7, palette.highlight),
      star5(270, 265, 15, 7, palette.highlight),
      { type: "text", x: 200, y: 295, value: "CHAMPION", color: palette.highlight, size: 24, anchor: "middle", fontWeight: 700 },
      { type: "text", x: 200, y: 325, value: "NPC SEASON ONE", color: palette.accent, size: 14, anchor: "middle" },
    ],
  },
  {
    id: "blueprint",
    name: "Blueprint Matrix",
    category: "builder",
    description: "Technical drafting grid, precision crosshairs, corner calipers and spec stamps",
    palettes: [
      { id: "blueprint-cobalt", name: "Cobalt Spec", accent: "#0284c7", base: "#075985", highlight: "#38bdf8" },
      { id: "dark-cad", name: "CAD Graphite", accent: "#94a3b8", base: "#334155", highlight: "#e2e8f0" },
      { id: "solar-amber", name: "Schematic Amber", accent: "#d97706", base: "#78350f", highlight: "#fde68a" },
    ],
    build: (palette) => [
      { type: "rectangle", x: 30, y: 30, width: 340, height: 340, color: palette.accent, widthStroke: 4 },
      { type: "line", x1: 20, y1: 50, x2: 50, y2: 50, color: palette.highlight, widthStroke: 3 },
      { type: "line", x1: 50, y1: 20, x2: 50, y2: 50, color: palette.highlight, widthStroke: 3 },
      { type: "line", x1: 350, y1: 20, x2: 350, y2: 50, color: palette.highlight, widthStroke: 3 },
      { type: "line", x1: 350, y1: 50, x2: 380, y2: 50, color: palette.highlight, widthStroke: 3 },
      { type: "line", x1: 20, y1: 350, x2: 50, y2: 350, color: palette.highlight, widthStroke: 3 },
      { type: "line", x1: 50, y1: 350, x2: 50, y2: 380, color: palette.highlight, widthStroke: 3 },
      { type: "line", x1: 350, y1: 350, x2: 350, y2: 380, color: palette.highlight, widthStroke: 3 },
      { type: "line", x1: 350, y1: 350, x2: 380, y2: 350, color: palette.highlight, widthStroke: 3 },
      { type: "line", x1: 200, y1: 45, x2: 200, y2: 355, color: palette.base, widthStroke: 2 },
      { type: "line", x1: 45, y1: 200, x2: 355, y2: 200, color: palette.base, widthStroke: 2 },
      { type: "circle", cx: 200, cy: 200, radius: 100, color: palette.accent, widthStroke: 3 },
      { type: "circle", cx: 200, cy: 200, radius: 60, color: palette.highlight, widthStroke: 2 },
      { type: "circle", cx: 200, cy: 200, radius: 8, color: palette.highlight, widthStroke: 0, fill: palette.highlight },
      { type: "text", x: 50, y: 80, value: "SPEC // BASE 84532", color: palette.highlight, size: 13, anchor: "start", fontFamily: FONT_MONO },
      { type: "text", x: 200, y: 180, value: "PROOF", color: palette.highlight, size: 22, anchor: "middle", fontFamily: FONT_MONO, fontWeight: 700 },
      { type: "text", x: 200, y: 232, value: "SYSTEM VALID", color: palette.accent, size: 13, anchor: "middle", fontFamily: FONT_MONO },
      { type: "text", x: 350, y: 335, value: "LATENCY: 0.9ms", color: palette.highlight, size: 11, anchor: "end", fontFamily: FONT_MONO },
    ],
  },
  {
    id: "ticket",
    name: "Tessera Ticket Stub",
    category: "achievement",
    description: "Perforated event admission pass, barcode lines and admit stamp",
    palettes: [
      { id: "vintage-kraft", name: "Vintage Kraft", accent: "#d97706", base: "#78350f", highlight: "#fed7aa" },
      { id: "midnight-pass", name: "Midnight Pass", accent: "#6366f1", base: "#312e81", highlight: "#c7d2fe" },
      { id: "neon-rave", name: "Neon Pass", accent: "#ec4899", base: "#831843", highlight: "#fbcfe8" },
    ],
    build: (palette) => [
      { type: "rectangle", x: 30, y: 70, width: 340, height: 260, color: palette.accent, widthStroke: 5, fill: palette.base },
      { type: "line", x1: 140, y1: 75, x2: 140, y2: 325, color: palette.highlight, widthStroke: 3 },
      { type: "circle", cx: 140, cy: 70, radius: 14, color: palette.highlight, widthStroke: 3, fill: "#0a0a0a" },
      { type: "circle", cx: 140, cy: 330, radius: 14, color: palette.highlight, widthStroke: 3, fill: "#0a0a0a" },
      { type: "line", x1: 56, y1: 110, x2: 56, y2: 230, color: palette.highlight, widthStroke: 4 },
      { type: "line", x1: 66, y1: 110, x2: 66, y2: 230, color: palette.highlight, widthStroke: 2 },
      { type: "line", x1: 74, y1: 110, x2: 74, y2: 230, color: palette.highlight, widthStroke: 6 },
      { type: "line", x1: 86, y1: 110, x2: 86, y2: 230, color: palette.highlight, widthStroke: 3 },
      { type: "line", x1: 96, y1: 110, x2: 96, y2: 230, color: palette.highlight, widthStroke: 5 },
      { type: "line", x1: 108, y1: 110, x2: 108, y2: 230, color: palette.highlight, widthStroke: 2 },
      { type: "line", x1: 118, y1: 110, x2: 118, y2: 230, color: palette.highlight, widthStroke: 4 },
      { type: "text", x: 88, y: 265, value: "#0084532", color: palette.accent, size: 13, anchor: "middle", fontFamily: FONT_MONO },
      { type: "text", x: 250, y: 125, value: "ADMIT ONE", color: palette.highlight, size: 28, anchor: "middle", fontWeight: 700 },
      { type: "line", x1: 170, y1: 145, x2: 330, y2: 145, color: palette.accent, widthStroke: 3 },
      { type: "text", x: 250, y: 185, value: "TESSERA POAP", color: palette.highlight, size: 18, anchor: "middle" },
      { type: "text", x: 250, y: 220, value: "ONCHAIN EVENT", color: palette.accent, size: 14, anchor: "middle" },
      { type: "rectangle", x: 175, y: 250, width: 150, height: 42, color: palette.accent, widthStroke: 2 },
      { type: "text", x: 250, y: 278, value: "AUTHENTIC", color: palette.highlight, size: 16, anchor: "middle", fontFamily: FONT_MONO, fontWeight: 700 },
    ],
  },
  {
    id: "node",
    name: "Base Genesis",
    category: "ecosystem",
    description: "Concentric Base orb, network satellite beacons and pulse indicators",
    palettes: [
      { id: "base-blue", name: "Base Blue", accent: "#0052FF", base: "#1e3a8a", highlight: "#60a5fa" },
      { id: "teal-pulse", name: "Solstice Teal", accent: "#0d9488", base: "#134e4a", highlight: "#2dd4bf" },
      { id: "sol-amber", name: "Solar Core", accent: "#ea580c", base: "#431407", highlight: "#fde047" },
    ],
    build: (palette) => [
      { type: "circle", cx: 200, cy: 200, radius: 160, color: palette.base, widthStroke: 4 },
      { type: "circle", cx: 200, cy: 200, radius: 120, color: palette.accent, widthStroke: 3 },
      { type: "circle", cx: 200, cy: 200, radius: 76, color: palette.accent, widthStroke: 0, fill: palette.accent },
      { type: "circle", cx: 200, cy: 200, radius: 24, color: palette.highlight, widthStroke: 0, fill: palette.highlight },
      { type: "circle", cx: 200, cy: 80, radius: 12, color: palette.highlight, widthStroke: 0, fill: palette.highlight },
      { type: "circle", cx: 304, cy: 260, radius: 14, color: palette.highlight, widthStroke: 0, fill: palette.highlight },
      { type: "circle", cx: 96, cy: 260, radius: 10, color: palette.highlight, widthStroke: 0, fill: palette.highlight },
      sparkle(200, 35, 14, palette.accent),
      sparkle(345, 150, 12, palette.accent),
      sparkle(55, 150, 12, palette.accent),
      { type: "text", x: 200, y: 320, value: "BASE ONCHAIN", color: palette.highlight, size: 20, anchor: "middle", fontWeight: 700 },
      { type: "text", x: 200, y: 345, value: "CHAIN ID: 84532", color: palette.accent, size: 12, anchor: "middle", fontFamily: FONT_MONO },
    ],
  },
];
