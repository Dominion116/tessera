"use client";

import { ChangeEvent, PointerEvent, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRightLeft,
  Circle,
  Download,
  Eraser,
  FileImage,
  Fingerprint,
  Globe,
  ListChecks,
  Lock,
  Minus,
  Pencil,
  Plus,
  Redo2,
  Square,
  Type,
  Undo2,
  Upload,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatBytes, formatUtcDate, svgToDataUrl } from "@/lib/format";
import {
  dateInputToUnix,
  FIELD_RULES,
  fieldError,
  parseAllowlistRoot,
  registrationFlags,
  svgSizeStatus,
  utf8Bytes,
} from "@/lib/registration";
import { CREATOR_TIMELOCK_DAYS } from "@/lib/poap-data";
import { repairSvgNamespace } from "@/lib/poap-contract";
import { frameImageAsSvg } from "@/lib/image-artwork";

type Tool = "brush" | "rectangle" | "circle" | "line" | "text";
type Point = { x: number; y: number };
type Shape =
  | { type: "path"; points: Point[]; color: string; width: number }
  | { type: "rectangle"; x: number; y: number; width: number; height: number; color: string; widthStroke: number; fill?: string }
  | { type: "circle"; cx: number; cy: number; radius: number; color: string; widthStroke: number; fill?: string }
  | { type: "polygon"; points: Point[]; color: string; widthStroke: number; fill?: string }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number; color: string; widthStroke: number }
  | { type: "text"; x: number; y: number; value: string; color: string; size?: number; anchor?: "start" | "middle" | "end" };

const CANVAS_SIZE = 400;
const FONT_STACK = "ui-sans-serif,system-ui,sans-serif";

type TemplatePalette = {
  id: string;
  name: string;
  accent: string;
  base: string;
  highlight: string;
};

type ArtworkTemplate = {
  id: string;
  name: string;
  description: string;
  palettes: TemplatePalette[];
  build: (palette: TemplatePalette) => Shape[];
};

const sparkle = (cx: number, cy: number, radius: number, color: string): Shape => ({
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

const bolt = (color: string): Shape => ({
  type: "polygon",
  points: [
    { x: 114, y: 46 },
    { x: 97, y: 80 },
    { x: 106, y: 80 },
    { x: 86, y: 116 },
    { x: 113, y: 82 },
    { x: 104, y: 82 },
    { x: 122, y: 46 },
  ],
  color,
  widthStroke: 0,
  fill: color,
});

const ARTWORK_TEMPLATES: ArtworkTemplate[] = [
  {
    id: "mosaic",
    name: "Mosaic tile",
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
];

const toolItems: { id: Tool; label: string; icon: typeof Pencil }[] = [
  { id: "brush", label: "Brush", icon: Pencil },
  { id: "rectangle", label: "Rectangle", icon: Square },
  { id: "circle", label: "Circle", icon: Circle },
  { id: "line", label: "Line", icon: Minus },
  { id: "text", label: "Text", icon: Type },
];

const escapeXml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const toSvg = (shapes: Shape[]) => {
  const content = shapes
    .map((shape) => {
      if (shape.type === "path") {
        return `<path d="M ${shape.points.map((point) => `${point.x} ${point.y}`).join(" L ")}" fill="none" stroke="${shape.color}" stroke-width="${shape.width}" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      if (shape.type === "rectangle") {
        return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" fill="${shape.fill ?? "none"}" stroke="${shape.color}" stroke-width="${shape.widthStroke}"/>`;
      }
      if (shape.type === "circle") {
        return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.radius}" fill="${shape.fill ?? "none"}" stroke="${shape.color}" stroke-width="${shape.widthStroke}"/>`;
      }
      if (shape.type === "polygon") {
        return `<polygon points="${shape.points.map((point) => `${point.x},${point.y}`).join(" ")}" fill="${shape.fill ?? "none"}" stroke="${shape.color}" stroke-width="${shape.widthStroke}" stroke-linejoin="round"/>`;
      }
      if (shape.type === "line") {
        return `<line x1="${shape.x1}" y1="${shape.y1}" x2="${shape.x2}" y2="${shape.y2}" stroke="${shape.color}" stroke-width="${shape.widthStroke}" stroke-linecap="round"/>`;
      }
      return `<text x="${shape.x}" y="${shape.y}" fill="${shape.color}" font-family="${FONT_STACK}" font-size="${shape.size ?? 24}"${shape.anchor ? ` text-anchor="${shape.anchor}"` : ""}>${escapeXml(shape.value)}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}">${content}</svg>`;
};

const sanitizeSvg = (source: string) => {
  const document = new DOMParser().parseFromString(source, "image/svg+xml");
  document.querySelectorAll("script, foreignObject").forEach((node) => node.remove());
  document.querySelectorAll("*").forEach((node) => {
    [...node.attributes].forEach((attribute) => {
      if (attribute.name.toLowerCase().startsWith("on")) {
        node.removeAttribute(attribute.name);
      }
    });
  });
  return document.documentElement.outerHTML;
};

const renderShape = (shape: Shape, index: number) => {
  switch (shape.type) {
    case "path":
      return <path key={index} d={`M ${shape.points.map((point) => `${point.x} ${point.y}`).join(" L ")}`} fill="none" stroke={shape.color} strokeWidth={shape.width} strokeLinecap="round" strokeLinejoin="round" />;
    case "rectangle":
      return <rect key={index} x={shape.x} y={shape.y} width={shape.width} height={shape.height} fill={shape.fill ?? "none"} stroke={shape.color} strokeWidth={shape.widthStroke} />;
    case "circle":
      return <circle key={index} cx={shape.cx} cy={shape.cy} r={shape.radius} fill={shape.fill ?? "none"} stroke={shape.color} strokeWidth={shape.widthStroke} />;
    case "polygon":
      return <polygon key={index} points={shape.points.map((point) => `${point.x},${point.y}`).join(" ")} fill={shape.fill ?? "none"} stroke={shape.color} strokeWidth={shape.widthStroke} strokeLinejoin="round" />;
    case "line":
      return <line key={index} x1={shape.x1} y1={shape.y1} x2={shape.x2} y2={shape.y2} stroke={shape.color} strokeWidth={shape.widthStroke} strokeLinecap="round" />;
    case "text":
      return <text key={index} x={shape.x} y={shape.y} fill={shape.color} fontFamily={FONT_STACK} fontSize={shape.size ?? 24} textAnchor={shape.anchor}>{shape.value}</text>;
  }
};

type AllowlistChoice = "none" | "later" | "now";

const CreatePoapView = () => {
  const svgInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<SVGSVGElement>(null);
  const [step, setStep] = useState<1 | 2>(1);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [eventDateInput, setEventDateInput] = useState("");
  const [externalUrl, setExternalUrl] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [isSoulbound, setIsSoulbound] = useState(true);
  const [allowlistChoice, setAllowlistChoice] = useState<AllowlistChoice>("none");
  const [allowlistRootInput, setAllowlistRootInput] = useState("");
  const [reviewed, setReviewed] = useState(false);
  const [tool, setTool] = useState<Tool>("brush");
  const [color, setColor] = useState("#2dd4bf");
  const [strokeWidth, setStrokeWidth] = useState(4);
  const [textValue, setTextValue] = useState("Tessera");
  const [shapes, setShapes] = useState<Shape[]>([]);
  const [history, setHistory] = useState<Shape[][]>([]);
  const [future, setFuture] = useState<Shape[][]>([]);
  const [draft, setDraft] = useState<Point[] | null>(null);
  const [start, setStart] = useState<Point | null>(null);
  const [uploadedSvg, setUploadedSvg] = useState<string | null>(null);
  const [importedKind, setImportedKind] = useState<"svg" | "image" | null>(null);
  const [importError, setImportError] = useState<string | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [selectedPalette, setSelectedPalette] = useState<string | null>(null);

  const loadTemplate = (template: ArtworkTemplate, palette: TemplatePalette) => {
    setShapes(template.build(palette));
    setHistory([]);
    setFuture([]);
    setUploadedSvg(null);
    setImportedKind(null);
    setImportError(null);
    setSelectedTemplate(template.id);
    setSelectedPalette(palette.id);
    setColor(palette.accent);
  };

  const pointFromEvent = (event: PointerEvent<SVGSVGElement>): Point | null => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const bounds = canvas.getBoundingClientRect();
    return {
      x: Math.max(0, Math.min(CANVAS_SIZE, ((event.clientX - bounds.left) / bounds.width) * CANVAS_SIZE)),
      y: Math.max(0, Math.min(CANVAS_SIZE, ((event.clientY - bounds.top) / bounds.height) * CANVAS_SIZE)),
    };
  };

  const commit = (next: Shape[]) => {
    setHistory((current) => [...current, shapes]);
    setShapes(next);
    setFuture([]);
    setUploadedSvg(null);
    setImportedKind(null);
    setImportError(null);
    setSelectedTemplate(null);
    setSelectedPalette(null);
  };

  const onPointerDown = (event: PointerEvent<SVGSVGElement>) => {
    const point = pointFromEvent(event);
    if (!point) return;
    canvasRef.current?.setPointerCapture(event.pointerId);
    if (tool === "brush") {
      setDraft([point]);
    } else {
      setStart(point);
    }
  };

  const onPointerMove = (event: PointerEvent<SVGSVGElement>) => {
    if (tool !== "brush" || !draft) return;
    const point = pointFromEvent(event);
    if (!point) return;
    setDraft((current) => [...(current ?? []), point]);
  };

  const onPointerUp = (event: PointerEvent<SVGSVGElement>) => {
    const point = pointFromEvent(event);
    if (!point) return;
    if (tool === "brush" && draft && draft.length > 1) {
      commit([...shapes, { type: "path", points: [...draft, point], color, width: strokeWidth }]);
    } else if (start) {
      const x = Math.min(start.x, point.x);
      const y = Math.min(start.y, point.y);
      const width = Math.abs(point.x - start.x);
      const height = Math.abs(point.y - start.y);
      const next =
        tool === "rectangle"
          ? { type: "rectangle" as const, x, y, width, height, color, widthStroke: strokeWidth }
          : tool === "circle"
            ? { type: "circle" as const, cx: start.x, cy: start.y, radius: Math.hypot(point.x - start.x, point.y - start.y), color, widthStroke: strokeWidth }
            : tool === "line"
              ? { type: "line" as const, x1: start.x, y1: start.y, x2: point.x, y2: point.y, color, widthStroke: strokeWidth }
              : { type: "text" as const, x: start.x, y: start.y, value: textValue, color };
      if (tool === "text" || width > 2 || height > 2) commit([...shapes, next]);
    }
    setDraft(null);
    setStart(null);
  };

  const undo = () => {
    const previous = history.at(-1);
    if (!previous) return;
    setFuture((current) => [shapes, ...current]);
    setShapes(previous);
    setHistory((current) => current.slice(0, -1));
    setUploadedSvg(null);
    setImportedKind(null);
    setImportError(null);
  };

  const redo = () => {
    const next = future[0];
    if (!next) return;
    setHistory((current) => [...current, shapes]);
    setShapes(next);
    setFuture((current) => current.slice(1));
    setUploadedSvg(null);
    setImportedKind(null);
    setImportError(null);
  };

  const clear = () => {
    if (shapes.length || uploadedSvg) commit([]);
  };

  const recolorArtwork = () => {
    if (!shapes.length) return;
    commit(shapes.map((shape) => ({ ...shape, color })));
  };

  const exportSvg = () => {
    const source = uploadedSvg ?? toSvg(shapes);
    const blob = new Blob([source], { type: "image/svg+xml" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${name.trim().toLowerCase().replace(/[^a-z0-9]+/g, "-") || "tessera-poap"}.svg`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importSvg = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const source = String(reader.result ?? "");
      if (source.includes("<svg")) {
        // Imported artwork with a missing or malformed root `xmlns` previews
        // fine inline but renders blank once the browser loads it as an
        // image document, so the namespace is repaired before the artwork
        // can be registered onchain.
        setUploadedSvg(sanitizeSvg(repairSvgNamespace(source)));
        setImportedKind("svg");
        setImportError(null);
        setShapes([]);
        setHistory([]);
        setFuture([]);
        setSelectedTemplate(null);
        setSelectedPalette(null);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  const importImage = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setImportError(null);
    frameImageAsSvg(file)
      .then((envelope) => {
        setUploadedSvg(envelope.svg);
        setImportedKind("image");
        setShapes([]);
        setHistory([]);
        setFuture([]);
        setSelectedTemplate(null);
        setSelectedPalette(null);
      })
      .catch((error: unknown) => {
        setImportError(
          error instanceof Error
            ? error.message
            : "That image could not be framed into the onchain artwork."
        );
      });
  };

  const preview = uploadedSvg ? (
    <g dangerouslySetInnerHTML={{ __html: uploadedSvg.replace(/^<svg[^>]*>|<\/svg>$/g, "") }} />
  ) : (
    <>
      {shapes.map(renderShape)}
      {draft?.length ? <path d={`M ${draft.map((point) => `${point.x} ${point.y}`).join(" L ")}`} fill="none" stroke={color} strokeWidth={strokeWidth} strokeLinecap="round" /> : null}
    </>
  );

  const artworkSource = uploadedSvg ?? (shapes.length ? toSvg(shapes) : "");
  const hasArtwork = artworkSource.length > 0;
  const size = useMemo(() => svgSizeStatus(artworkSource), [artworkSource]);
  const nameError = fieldError(name, FIELD_RULES.name);
  const descriptionError = fieldError(description, FIELD_RULES.description);
  const locationError = fieldError(location, FIELD_RULES.location);
  const externalUrlError = fieldError(externalUrl, FIELD_RULES.externalUrl);
  const allowlistRootError =
    allowlistChoice === "now" && !parseAllowlistRoot(allowlistRootInput)
      ? "The commitment must be 0x followed by 32 bytes of hex, from the tool that built your list."
      : null;
  const eventDate = dateInputToUnix(eventDateInput);

  const detailsReady =
    !nameError &&
    !descriptionError &&
    !locationError &&
    !externalUrlError &&
    hasArtwork &&
    size.level !== "over";
  const registrationReady = detailsReady && !allowlistRootError;

  const stepOneBlockers = [
    !hasArtwork && "Artwork is required.",
    Boolean(nameError) && nameError,
    Boolean(descriptionError) && descriptionError,
    Boolean(locationError) && locationError,
    Boolean(externalUrlError) && externalUrlError,
    size.level === "over" && size.message,
  ].filter(Boolean) as string[];

  const sizeTone =
    size.level === "over"
      ? "border-red-400/30 bg-red-400/[0.06] text-red-700 dark:text-red-300"
      : size.level === "warn"
        ? "border-amber-400/30 bg-amber-400/[0.06] text-amber-700 dark:text-amber-300"
        : "border-border/70 bg-background/50 text-fg-secondary";

  return (
    <div className="dashboard-page mx-auto grid w-full max-w-7xl grid-cols-12 gap-6 p-6">
      <header className="col-span-12 flex flex-col gap-2 border-b border-border/60 pb-5">
        <p className="text-xs font-medium tracking-[0.16em] text-teal-600 uppercase dark:text-teal-300">Creator studio</p>
        <h1 className="text-2xl font-semibold tracking-tight md:text-3xl">Create a POAP</h1>
        <p className="max-w-xl text-sm leading-6 text-fg-secondary">Register an event and shape its artwork here: draw it, start from a preset, import an SVG, or upload a PNG, JPEG, GIF, WebP or AVIF image.</p>
        <ol className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-fg-tertiary" aria-label="Registration steps">
          <li className={step === 1 ? "font-medium text-foreground" : ""}>
            <span className="tabular-nums">1</span>. Artwork and details
          </li>
          <li aria-hidden="true" className="text-fg-tertiary/70">→</li>
          <li className={step === 2 ? "font-medium text-foreground" : ""}>
            <span className="tabular-nums">2</span>. Registration choices
          </li>
        </ol>
      </header>

      {step === 1 ? (
        <>
      <Card className="dashboard-panel col-span-12 xl:col-span-7">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div><CardTitle>Artwork</CardTitle><CardDescription>Draw in vectors or frame an uploaded image. Either way the artwork the contract stores stays SVG.</CardDescription></div>
            <Badge variant="accent">400 × 400</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-medium">Start with a template</p>
                <p className="text-xs text-fg-tertiary">Each preset is editable vector artwork with its own palettes. Pick a swatch, then draw, recolor or import your own.</p>
              </div>
              <Badge variant="outline">Editable SVG</Badge>
            </div>
            <div className="grid gap-2 sm:grid-cols-3">
              {ARTWORK_TEMPLATES.map((template) => {
                const templateActive = selectedTemplate === template.id;
                return (
                  <div
                    key={template.id}
                    className={`rounded-lg border p-2 transition-[border-color,background-color] duration-180 ${templateActive ? "border-teal-400/50 bg-teal-400/[0.08]" : "border-border/70 bg-background/45"}`}
                  >
                    <button
                      type="button"
                      onClick={() => loadTemplate(template, template.palettes[0])}
                      aria-pressed={templateActive}
                      className="flex w-full items-center gap-3 rounded-md p-1 text-left outline-none focus-visible:ring-2 focus-visible:ring-teal-400"
                    >
                      <svg viewBox="0 0 400 400" aria-hidden="true" className="size-12 shrink-0 rounded-md bg-background p-1">
                        {template.build(template.palettes[0]).map(renderShape)}
                      </svg>
                      <span className="min-w-0">
                        <span className="block truncate text-xs font-medium">{template.name}</span>
                        <span className="mt-0.5 block line-clamp-2 text-[11px] leading-4 text-fg-tertiary">{template.description}</span>
                      </span>
                    </button>
                    <div className="mt-2 flex items-center gap-1.5 pl-1" role="group" aria-label={`${template.name} color palettes`}>
                      {template.palettes.map((palette) => {
                        const paletteActive = templateActive && selectedPalette === palette.id;
                        return (
                          <button
                            key={palette.id}
                            type="button"
                            title={palette.name}
                            aria-label={`${palette.name} palette`}
                            aria-pressed={paletteActive}
                            onClick={() => loadTemplate(template, palette)}
                            className={`size-5 cursor-pointer rounded-full outline-none transition-transform duration-150 hover:scale-110 focus-visible:ring-2 focus-visible:ring-teal-400 ${paletteActive ? "ring-2 ring-teal-400 ring-offset-1 ring-offset-background" : "border border-border"}`}
                            style={{ background: `linear-gradient(90deg, ${palette.accent} 0%, ${palette.accent} 33%, ${palette.base} 33%, ${palette.base} 66%, ${palette.highlight} 66%, ${palette.highlight} 100%)` }}
                          />
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-[1fr_auto]">
            <div className="flex flex-wrap gap-1 rounded-lg border border-border/70 bg-background/45 p-1">
              {toolItems.map((item) => {
                const Icon = item.icon;
                return <button key={item.id} type="button" title={item.label} aria-label={item.label} onClick={() => setTool(item.id)} className={`flex size-9 items-center justify-center rounded-md outline-none transition-colors focus-visible:ring-2 focus-visible:ring-teal-400 ${tool === item.id ? "bg-teal-400/15 text-teal-600 dark:text-teal-300" : "text-fg-tertiary hover:bg-muted hover:text-foreground"}`}><Icon aria-hidden="true" className="size-4" /></button>;
              })}
            </div>
            <div className="flex gap-1">
              <button type="button" title="Undo" aria-label="Undo" disabled={!history.length} onClick={undo} className="flex size-9 items-center justify-center rounded-md border border-border/70 text-fg-tertiary transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-teal-400"><Undo2 className="size-4" /></button>
              <button type="button" title="Redo" aria-label="Redo" disabled={!future.length} onClick={redo} className="flex size-9 items-center justify-center rounded-md border border-border/70 text-fg-tertiary transition-colors hover:bg-muted hover:text-foreground disabled:pointer-events-none disabled:opacity-35 focus-visible:ring-2 focus-visible:ring-teal-400"><Redo2 className="size-4" /></button>
              <button type="button" title="Clear canvas" aria-label="Clear canvas" onClick={clear} className="flex size-9 items-center justify-center rounded-md border border-border/70 text-fg-tertiary transition-colors hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-teal-400"><Eraser className="size-4" /></button>
            </div>
          </div>

          <div className="mx-auto w-full max-w-[440px] rounded-xl border border-border/70 bg-[radial-gradient(var(--border)_1px,transparent_1px)] bg-size-[16px_16px] p-5 shadow-[inset_0_1px_0_oklch(1_0_0_/_6%),0_8px_24px_oklch(0_0_0_/_5%)]">
            <svg ref={canvasRef} viewBox="0 0 400 400" role="img" aria-label="POAP artwork canvas" className="aspect-square w-full touch-none rounded-lg bg-background/85" onPointerDown={onPointerDown} onPointerMove={onPointerMove} onPointerUp={onPointerUp}>
              {preview}
            </svg>
          </div>

          <div className="grid gap-3 sm:grid-cols-[auto_auto_1fr] sm:items-end">
            <label className="flex items-center gap-2 text-sm text-fg-secondary">Color <input type="color" value={color} onChange={(event) => setColor(event.target.value)} className="size-9 cursor-pointer rounded-md border border-border/70 bg-transparent p-1" /></label>
            <Button type="button" variant="outline" size="sm" disabled={!shapes.length} onClick={recolorArtwork}>Apply color</Button>
            <label className="flex items-center gap-2 text-sm text-fg-secondary">Stroke <input type="number" min="1" max="24" value={strokeWidth} onChange={(event) => setStrokeWidth(Number(event.target.value) || 1)} className="h-9 w-16 rounded-md border border-input bg-transparent px-2 text-sm tabular-nums outline-none focus-visible:ring-2 focus-visible:ring-teal-400" /></label>
            {tool === "text" ? <label className="flex min-w-0 flex-col gap-1 text-xs text-fg-tertiary">Text<input value={textValue} onChange={(event) => setTextValue(event.target.value)} className="h-9 rounded-md border border-input bg-transparent px-3 text-sm text-foreground outline-none focus-visible:ring-2 focus-visible:ring-teal-400" /></label> : <span />}
          </div>

          <div className={`flex flex-wrap items-center justify-between gap-2 rounded-lg border p-4 text-sm leading-6 ${sizeTone}`} aria-live="polite">
            <p className="min-w-64 flex-1">{hasArtwork ? size.message : "No artwork yet. Draw, load a template, import an SVG, or upload an image."}</p>
            {hasArtwork ? (
              <Badge variant="outline" className="tabular-nums">
                {formatBytes(size.rawBytes)} raw · {formatBytes(size.onchainBytes)} stored
              </Badge>
            ) : null}
          </div>

          <div className="flex flex-wrap items-center gap-2 border-t border-border/70 pt-4">
            <input ref={svgInputRef} type="file" accept="image/svg+xml,.svg" onChange={importSvg} className="sr-only" />
            <input ref={imageInputRef} type="file" accept="image/png,image/jpeg,image/gif,image/webp,image/avif" onChange={importImage} className="sr-only" />
            <Button type="button" variant="outline" onClick={() => svgInputRef.current?.click()}><Upload aria-hidden="true" />Import SVG</Button>
            <Button type="button" variant="outline" onClick={() => imageInputRef.current?.click()}><FileImage aria-hidden="true" />Import image</Button>
            <Button type="button" variant="outline" onClick={exportSvg}><Download aria-hidden="true" />Export SVG</Button>
            {uploadedSvg ? <Badge variant="accent" className="ml-auto self-center"><FileImage aria-hidden="true" />{importedKind === "image" ? "Image framed as SVG" : "Imported SVG"}</Badge> : null}
          </div>
          {importError ? (
            <p role="alert" className="rounded-lg border border-red-400/30 bg-red-400/[0.06] px-3 py-2 text-xs leading-5 text-red-700 dark:text-red-300">{importError}</p>
          ) : null}
        </CardContent>
      </Card>

      <Card className="dashboard-panel col-span-12 xl:col-span-5">
        <CardHeader><CardTitle>Event details</CardTitle><CardDescription>These fields become the POAP metadata at registration. The contract measures them in bytes: most accented letters cost two, emoji cost four.</CardDescription></CardHeader>
        <CardContent className="flex flex-col gap-5">
          <label className="flex flex-col gap-2 text-sm font-medium">POAP name<Input value={name} onChange={(event) => setName(event.target.value)} placeholder="Base builders night" maxLength={128} aria-invalid={Boolean(nameError)} /><span className={`text-xs font-normal ${nameError ? "text-red-600 dark:text-red-400" : "text-fg-tertiary"}`}>{nameError ?? `${utf8Bytes(name)} / 128 bytes`}</span></label>
          <label className="flex flex-col gap-2 text-sm font-medium">Description<textarea value={description} onChange={(event) => setDescription(event.target.value)} placeholder="What happened at this event? One line: line breaks cannot be stored." maxLength={512} rows={3} className="min-h-20 resize-y rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none placeholder:text-muted-foreground focus-visible:ring-2 focus-visible:ring-teal-400" aria-invalid={Boolean(descriptionError)} /><span className={`text-xs font-normal ${descriptionError ? "text-red-600 dark:text-red-400" : "text-fg-tertiary"}`}>{descriptionError ?? `${utf8Bytes(description)} / 512 bytes`}</span></label>
          <label className="flex flex-col gap-2 text-sm font-medium">Event date<Input type="date" value={eventDateInput} onChange={(event) => setEventDateInput(event.target.value)} /><span className="text-xs font-normal text-fg-tertiary">Optional. Stored as a UTC date on the badge.</span></label>
          <label className="flex flex-col gap-2 text-sm font-medium">Location<Input value={location} onChange={(event) => setLocation(event.target.value)} placeholder="Lisbon, Portugal" maxLength={128} aria-invalid={Boolean(locationError)} /><span className={`text-xs font-normal ${locationError ? "text-red-600 dark:text-red-400" : "text-fg-tertiary"}`}>{locationError ?? "Optional, up to 128 bytes"}</span></label>
          <label className="flex flex-col gap-2 text-sm font-medium">External link<Input value={externalUrl} onChange={(event) => setExternalUrl(event.target.value)} placeholder="https://your-event.site" maxLength={128} aria-invalid={Boolean(externalUrlError)} /><span className={`text-xs font-normal ${externalUrlError ? "text-red-600 dark:text-red-400" : "text-fg-tertiary"}`}>{externalUrlError ?? "Optional, up to 128 bytes"}</span></label>
          <Button type="button" size="lg" className="w-full" disabled={!detailsReady} onClick={() => { setStep(2); setReviewed(false); }}><Plus aria-hidden="true" />Continue to registration</Button>
          {stepOneBlockers.length > 0 ? (
            <ul className="flex flex-col gap-1 text-xs leading-5 text-fg-tertiary">
              {stepOneBlockers.slice(0, 2).map((blocker) => (
                <li key={blocker}>{blocker}</li>
              ))}
            </ul>
          ) : null}
        </CardContent>
      </Card>
        </>
      ) : (
        <>
      <Card className="dashboard-panel col-span-12 xl:col-span-7">
        <CardHeader>
          <div className="flex items-center justify-between gap-4">
            <div><CardTitle>Registration choices</CardTitle><CardDescription>Two settings the contract locks on day {CREATOR_TIMELOCK_DAYS}, and the invitation-list decision.</CardDescription></div>
            <Badge variant="outline" className="tabular-nums">flags {registrationFlags(isSoulbound, isPublic)}</Badge>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-7">
          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-semibold">Who can mint</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-[border-color,background-color] duration-180 hover:border-teal-400/40 outline-none focus-within:ring-2 focus-within:ring-teal-400 ${isPublic ? "border-teal-400/50 bg-teal-400/[0.08]" : "border-border/70 bg-background/45"}`}>
                <input type="radio" name="who-can-mint" checked={isPublic} onChange={() => setIsPublic(true)} className="mt-1 accent-teal-500" />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm font-medium"><Globe aria-hidden="true" className="size-4 text-teal-600 dark:text-teal-300" />Anyone</span>
                  <span className="text-xs leading-5 text-fg-secondary">Anyone who finds the event page claims their own badge. No list to manage, nothing to hand out.</span>
                </span>
              </label>
              <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-[border-color,background-color] duration-180 hover:border-teal-400/40 outline-none focus-within:ring-2 focus-within:ring-teal-400 ${!isPublic ? "border-teal-400/50 bg-teal-400/[0.08]" : "border-border/70 bg-background/45"}`}>
                <input type="radio" name="who-can-mint" checked={!isPublic} onChange={() => setIsPublic(false)} className="mt-1 accent-teal-500" />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm font-medium"><Lock aria-hidden="true" className="size-4 text-teal-600 dark:text-teal-300" />Only invited wallets</span>
                  <span className="text-xs leading-5 text-fg-secondary">Attendees need an invitation list, a code you sign for them, or a badge you drop into their wallet.</span>
                </span>
              </label>
            </div>
            <p className="rounded-lg border border-amber-400/30 bg-amber-400/[0.06] p-3 text-xs leading-5 text-amber-700 dark:text-amber-300">Whichever way this is set on day {CREATOR_TIMELOCK_DAYS} after registration is how it stays forever. A closed mint can never be opened after that date, and an open one can never be closed.</p>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="text-sm font-semibold">Transfer rules</legend>
            <div className="grid gap-3 sm:grid-cols-2">
              <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-[border-color,background-color] duration-180 hover:border-teal-400/40 outline-none focus-within:ring-2 focus-within:ring-teal-400 ${isSoulbound ? "border-teal-400/50 bg-teal-400/[0.08]" : "border-border/70 bg-background/45"}`}>
                <input type="radio" name="transfer-rules" checked={isSoulbound} onChange={() => setIsSoulbound(true)} className="mt-1 accent-teal-500" />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm font-medium"><Fingerprint aria-hidden="true" className="size-4 text-teal-600 dark:text-teal-300" />Bound to the wallet</span>
                  <span className="text-xs leading-5 text-fg-secondary">The badge stays in the wallet that minted it. Proof of presence, not something to trade. This cannot be changed later.</span>
                </span>
              </label>
              <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-[border-color,background-color] duration-180 hover:border-teal-400/40 outline-none focus-within:ring-2 focus-within:ring-teal-400 ${!isSoulbound ? "border-teal-400/50 bg-teal-400/[0.08]" : "border-border/70 bg-background/45"}`}>
                <input type="radio" name="transfer-rules" checked={!isSoulbound} onChange={() => setIsSoulbound(false)} className="mt-1 accent-teal-500" />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm font-medium"><ArrowRightLeft aria-hidden="true" className="size-4 text-teal-600 dark:text-teal-300" />Free to move</span>
                  <span className="text-xs leading-5 text-fg-secondary">The badge can be sent or sold after minting. Choose this for art and collectibles rather than proof. This cannot be changed later.</span>
                </span>
              </label>
            </div>
          </fieldset>

          <fieldset className="flex flex-col gap-3">
            <legend className="flex items-center gap-2 text-sm font-semibold">Invitation list</legend>
            <div className="grid gap-3">
              <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-[border-color,background-color] duration-180 hover:border-teal-400/40 outline-none focus-within:ring-2 focus-within:ring-teal-400 ${allowlistChoice === "none" ? "border-teal-400/50 bg-teal-400/[0.08]" : "border-border/70 bg-background/45"}`}>
                <input type="radio" name="invitation-list" checked={allowlistChoice === "none"} onChange={() => setAllowlistChoice("none")} className="mt-1 accent-teal-500" />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-sm font-medium">No invitation list</span>
                  <span className="text-xs leading-5 text-fg-secondary">Minting works through the choices above only. The one-time list setting stays unused.</span>
                </span>
              </label>
              <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-[border-color,background-color] duration-180 hover:border-teal-400/40 outline-none focus-within:ring-2 focus-within:ring-teal-400 ${allowlistChoice === "later" ? "border-teal-400/50 bg-teal-400/[0.08]" : "border-border/70 bg-background/45"}`}>
                <input type="radio" name="invitation-list" checked={allowlistChoice === "later"} onChange={() => setAllowlistChoice("later")} className="mt-1 accent-teal-500" />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="flex items-center gap-2 text-sm font-medium"><ListChecks aria-hidden="true" className="size-4 text-teal-600 dark:text-teal-300" />Attach one later</span>
                  <span className="text-xs leading-5 text-fg-secondary">Register without a list, then attach it from the manage screen exactly once, any time in the first {CREATOR_TIMELOCK_DAYS} days. Keeps the door open for late attendee lists.</span>
                </span>
              </label>
              <label className={`flex cursor-pointer items-start gap-3 rounded-lg border p-4 transition-[border-color,background-color] duration-180 hover:border-teal-400/40 outline-none focus-within:ring-2 focus-within:ring-teal-400 ${allowlistChoice === "now" ? "border-teal-400/50 bg-teal-400/[0.08]" : "border-border/70 bg-background/45"}`}>
                <input type="radio" name="invitation-list" checked={allowlistChoice === "now"} onChange={() => setAllowlistChoice("now")} className="mt-1 accent-teal-500" />
                <span className="flex min-w-0 flex-col gap-1">
                  <span className="text-sm font-medium">Attach one at registration (advanced)</span>
                  <span className="text-xs leading-5 text-fg-secondary">Paste the 32-byte commitment for your list now. It can never be replaced, so the list must already be final.</span>
                </span>
              </label>
              {allowlistChoice === "now" ? (
                <label className="flex flex-col gap-2 pl-1 text-sm font-medium">List commitment
                  <Input value={allowlistRootInput} onChange={(event) => setAllowlistRootInput(event.target.value)} placeholder="0x followed by 64 hexadecimal characters" spellCheck={false} className="font-mono text-xs" aria-invalid={Boolean(allowlistRootError)} />
                  <span className={`text-xs font-normal ${allowlistRootError ? "text-red-600 dark:text-red-400" : "text-fg-tertiary"}`}>{allowlistRootError ?? "A 0x value, 32 bytes of hex, produced by the tool that built your list."}</span>
                </label>
              ) : null}
            </div>
          </fieldset>

          <Button type="button" variant="outline" onClick={() => setStep(1)}><ArrowLeft aria-hidden="true" />Back to artwork and details</Button>
        </CardContent>
      </Card>

      <Card className="dashboard-panel col-span-12 xl:col-span-5">
        <CardHeader><CardTitle>Review</CardTitle><CardDescription>Exactly what the registration will store, field by field.</CardDescription></CardHeader>
        <CardContent className="flex flex-col gap-5">
          <div className="flex items-center gap-4">
            {/* Inline SVG data URL, which next/image cannot optimize. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={svgToDataUrl(artworkSource)} alt={name || "POAP artwork"} width={56} height={56} className="size-14 shrink-0 rounded-lg border border-border/70" />
            <div className="flex min-w-0 flex-col">
              <p className="truncate text-sm font-semibold">{name || "Untitled POAP"}</p>
              <p className="text-xs text-fg-tertiary tabular-nums">{hasArtwork ? `${formatBytes(size.rawBytes)} raw · ${formatBytes(size.onchainBytes)} as stored onchain` : "No artwork"}</p>
            </div>
          </div>
          <dl className="grid gap-2 text-sm">
            <div className="flex justify-between gap-4"><dt className="text-fg-tertiary">Who can mint</dt><dd className="text-right font-medium">{isPublic ? "Anyone" : "Only invited wallets"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-fg-tertiary">Transfer</dt><dd className="text-right font-medium">{isSoulbound ? "Bound to the minting wallet" : "Free to move"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-fg-tertiary">Invitation list</dt><dd className="text-right font-medium">{allowlistChoice === "none" ? "None" : allowlistChoice === "later" ? `Attachable once, within ${CREATOR_TIMELOCK_DAYS} days` : "Commitment attached now"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-fg-tertiary">Event date</dt><dd className="text-right font-medium">{eventDate > 0n ? formatUtcDate(eventDate) : "Not set"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-fg-tertiary">Location</dt><dd className="text-right font-medium">{location || "Not set"}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-fg-tertiary">External link</dt><dd className="max-w-[60%] truncate text-right font-medium">{externalUrl || "Not set"}</dd></div>
          </dl>
          {size.level !== "ok" ? <p className={`rounded-lg border p-3 text-xs leading-5 ${sizeTone}`}>{size.message}</p> : null}
          {reviewed ? (
            <div className="flex flex-col gap-3">
              <div className="rounded-lg border border-teal-400/30 bg-teal-400/10 p-4 text-sm leading-6 text-teal-700 dark:text-teal-300">
                <p className="font-medium">The registration is prepared.</p>
                <p className="mt-1">The artwork, the metadata and every choice above are what the contract will store. The two settings that lock on day {CREATOR_TIMELOCK_DAYS} are recorded with the same transaction.</p>
              </div>
              <Button type="button" variant="outline" onClick={() => setReviewed(false)}><ArrowLeft aria-hidden="true" />Back to choices</Button>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              <Button type="button" size="lg" disabled={!registrationReady} onClick={() => setReviewed(true)}><Plus aria-hidden="true" />Prepare registration</Button>
              <p className="text-xs leading-5 text-fg-tertiary">No transaction is submitted from this screen. When the registration transaction is confirmed, the event number, the artwork and these choices land onchain together.</p>
              {!registrationReady && allowlistRootError ? <p className="text-xs text-red-600 dark:text-red-400">{allowlistRootError}</p> : null}
            </div>
          )}
        </CardContent>
      </Card>
        </>
      )}
    </div>
  );
};

export default CreatePoapView;
