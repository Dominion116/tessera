import { describe, expect, it } from "vitest";
import {
  ACCENT_STAMPS,
  ARTWORK_TEMPLATES,
  CANVAS_SIZE,
  hexagon,
  Shape,
  star5,
} from "@/lib/artwork-templates";

const toSvgString = (shapes: Shape[]) => {
  const content = shapes
    .map((shape) => {
      if (shape.type === "path") {
        return `<path d="M ${shape.points.map((p) => `${p.x} ${p.y}`).join(" L ")}" fill="none" stroke="${shape.color}" stroke-width="${shape.width}" stroke-linecap="round" stroke-linejoin="round"/>`;
      }
      if (shape.type === "rectangle") {
        return `<rect x="${shape.x}" y="${shape.y}" width="${shape.width}" height="${shape.height}" fill="${shape.fill ?? "none"}" stroke="${shape.color}" stroke-width="${shape.widthStroke}"/>`;
      }
      if (shape.type === "circle") {
        return `<circle cx="${shape.cx}" cy="${shape.cy}" r="${shape.radius}" fill="${shape.fill ?? "none"}" stroke="${shape.color}" stroke-width="${shape.widthStroke}"/>`;
      }
      if (shape.type === "polygon") {
        return `<polygon points="${shape.points.map((p) => `${p.x},${p.y}`).join(" ")}" fill="${shape.fill ?? "none"}" stroke="${shape.color}" stroke-width="${shape.widthStroke}" stroke-linejoin="round"/>`;
      }
      if (shape.type === "line") {
        return `<line x1="${shape.x1}" y1="${shape.y1}" x2="${shape.x2}" y2="${shape.y2}" stroke="${shape.color}" stroke-width="${shape.widthStroke}" stroke-linecap="round"/>`;
      }
      return `<text x="${shape.x}" y="${shape.y}" fill="${shape.color}" font-size="${shape.size ?? 24}">${shape.value}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}">${content}</svg>`;
};

describe("Artwork Templates & Accents", () => {
  it("has at least 10 distinct artwork templates", () => {
    expect(ARTWORK_TEMPLATES.length).toBeGreaterThanOrEqual(10);
  });

  it("ensures each template has a unique id, name, description, and palettes", () => {
    const ids = new Set<string>();
    for (const template of ARTWORK_TEMPLATES) {
      expect(ids.has(template.id)).toBe(false);
      ids.add(template.id);
      expect(template.name.length).toBeGreaterThan(0);
      expect(template.description.length).toBeGreaterThan(0);
      expect(template.palettes.length).toBeGreaterThanOrEqual(3);

      for (const palette of template.palettes) {
        expect(palette.accent).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(palette.base).toMatch(/^#[0-9a-fA-F]{6}$/);
        expect(palette.highlight).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    }
  });

  it("generates valid and byte-efficient SVG for every template and palette", () => {
    for (const template of ARTWORK_TEMPLATES) {
      for (const palette of template.palettes) {
        const shapes = template.build(palette);
        expect(shapes.length).toBeGreaterThan(0);
        const svg = toSvgString(shapes);

        // Standard checks
        expect(svg.startsWith("<svg")).toBe(true);
        expect(svg.endsWith("</svg>")).toBe(true);
        expect(svg).toContain(`viewBox="0 0 ${CANVAS_SIZE} ${CANVAS_SIZE}"`);

        // Check byte size: templates must be lean for onchain bytecode (well under 5 KB, even under 3 KB)
        const bytes = new TextEncoder().encode(svg).length;
        expect(bytes).toBeLessThan(4000);
      }
    }
  });

  it("generates valid shapes for all accent stamps", () => {
    expect(ACCENT_STAMPS.length).toBeGreaterThanOrEqual(6);
    for (const stamp of ACCENT_STAMPS) {
      const shapes = stamp.create(200, 200, "#2dd4bf");
      expect(shapes.length).toBeGreaterThan(0);
      const svg = toSvgString(shapes);
      expect(svg).toContain("<svg");
    }
  });

  it("generates star, hexagon, and stamp vectors accurately with custom fills and strokes", () => {
    const star = star5(200, 200, 40, 18, "#2dd4bf", 2, "#2dd4bf");
    expect(star.type).toBe("polygon");
    if (star.type === "polygon") {
      expect(star.points.length).toBe(10);
      expect(star.fill).toBe("#2dd4bf");
      expect(star.widthStroke).toBe(2);
    }

    const hex = hexagon(200, 200, 50, "#0ea5e9", 4, "none");
    expect(hex.type).toBe("polygon");
    if (hex.type === "polygon") {
      expect(hex.points.length).toBe(6);
      expect(hex.fill).toBe("none");
      expect(hex.widthStroke).toBe(4);
    }
  });
});
