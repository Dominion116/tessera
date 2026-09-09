/**
 * Raster artwork upload support for the Create studio. The contract only
 * stores SVG, so an uploaded PNG, JPEG, GIF, WebP or AVIF file is framed
 * inside a square SVG envelope whose `<image>` carries the raster as a
 * data URL. The result is ordinary SVG everywhere downstream: the byte
 * ceilings, the onchain projection and the `<img>` render path never know
 * the difference. The source is center-cropped to a square and re-encoded
 * at falling resolutions until the envelope fits the storage ceiling, so
 * a photographic upload does not silently blow past the onchain limits.
 */

import { utf8Bytes } from "./registration";
import {
  SVG_HARD_LIMIT_BYTES,
  SVG_SOFT_LIMIT_BYTES,
} from "./poap-data";

export type ArtworkEnvelope = {
  svg: string;
  format: "png" | "jpeg";
  side: number;
  rawBytes: number;
};

type RasterSource = {
  draw: CanvasImageSource;
  width: number;
  height: number;
};

const ACCEPTED_TYPES = new Set([
  "image/png",
  "image/jpeg",
  "image/gif",
  "image/webp",
  "image/avif",
]);

const FRAME_SIZES = [400, 360, 320, 288, 256, 224, 192, 160, 128];

const JPEG_QUALITY = 0.82;

const SVG_FRAME_VIEWBOX = 400;

function frameEnvelope(dataUrl: string): string {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${SVG_FRAME_VIEWBOX} ${SVG_FRAME_VIEWBOX}"><image href="${dataUrl}" width="${SVG_FRAME_VIEWBOX}" height="${SVG_FRAME_VIEWBOX}" preserveAspectRatio="xMidYMid slice"/></svg>`;
}

function decodeFromFile(file: File): Promise<RasterSource> {
  if (typeof createImageBitmap === "function") {
    return createImageBitmap(file, { imageOrientation: "from-image" })
      .then((bitmap) => ({
        draw: bitmap,
        width: bitmap.width,
        height: bitmap.height,
      }))
      .catch(() => decodeFromObjectUrl(file));
  }
  return decodeFromObjectUrl(file);
}

function decodeFromObjectUrl(file: File): Promise<RasterSource> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(url);
      resolve({
        draw: image,
        width: image.naturalWidth,
        height: image.naturalHeight,
      });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("decode-failed"));
    };
    image.src = url;
  });
}

function sourceHasAlpha(source: RasterSource): boolean {
  const probe = document.createElement("canvas");
  const side = 24;
  probe.width = side;
  probe.height = side;
  const context = probe.getContext("2d");
  if (!context) return false;
  context.drawImage(source.draw, 0, 0, side, side);
  const pixels = context.getImageData(0, 0, side, side).data;
  for (let index = 3; index < pixels.length; index += 4) {
    if (pixels[index] < 250) return true;
  }
  return false;
}

function squareCanvas(source: RasterSource, side: number): HTMLCanvasElement {
  const canvas = document.createElement("canvas");
  canvas.width = side;
  canvas.height = side;
  const context = canvas.getContext("2d");
  if (!context) throw new Error("canvas-unavailable");
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  const crop = Math.min(source.width, source.height);
  context.drawImage(
    source.draw,
    (source.width - crop) / 2,
    (source.height - crop) / 2,
    crop,
    crop,
    0,
    0,
    side,
    side
  );
  return canvas;
}

function flattenToWhite(canvas: HTMLCanvasElement): void {
  const context = canvas.getContext("2d");
  if (!context) return;
  context.globalCompositeOperation = "destination-over";
  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, canvas.width, canvas.height);
}

function tryEncode(canvas: HTMLCanvasElement, type: "image/png" | "image/jpeg") {
  if (type === "image/jpeg") {
    flattenToWhite(canvas);
    return canvas.toDataURL("image/jpeg", JPEG_QUALITY);
  }
  return canvas.toDataURL("image/png");
}

/**
 * Frame one raster upload as an onchain-ready SVG envelope. Throws with a
 * user-facing message when the file is not a supported image, cannot be
 * decoded, or stays over the contract ceiling even at the smallest frame.
 */
export async function frameImageAsSvg(file: File): Promise<ArtworkEnvelope> {
  if (!ACCEPTED_TYPES.has(file.type)) {
    throw new Error(
      "Choose a PNG, JPEG, GIF, WebP or AVIF image to frame as artwork."
    );
  }

  let source: RasterSource;
  try {
    source = await decodeFromFile(file);
  } catch {
    throw new Error(
      "That file could not be read as an image. Export it as PNG, JPEG, GIF, WebP or AVIF, then upload again."
    );
  }
  if (source.width === 0 || source.height === 0) {
    throw new Error(
      "That file could not be read as an image. Export it as PNG, JPEG, GIF, WebP or AVIF, then upload again."
    );
  }

  const alpha = file.type !== "image/jpeg" && sourceHasAlpha(source);
  const cropSide = Math.min(source.width, source.height);
  let hardFit: ArtworkEnvelope | null = null;

  for (const side of FRAME_SIZES) {
    if (side > cropSide) continue;

    const canvas = squareCanvas(source, side);
    const formats: ("png" | "jpeg")[] = alpha ? ["png"] : ["png", "jpeg"];
    let best: ArtworkEnvelope | null = null;

    for (const format of formats) {
      try {
        const dataUrl = tryEncode(
          canvas,
          format === "png" ? "image/png" : "image/jpeg"
        );
        const svg = frameEnvelope(dataUrl);
        const rawBytes = utf8Bytes(svg);
        if (!best || rawBytes < best.rawBytes) {
          best = { svg, format, side, rawBytes };
        }
      } catch {
        // One encoder failing (for example a canvas too large for PNG) is
        // not fatal while a smaller frame may still encode.
      }
    }

    if (best) {
      if (best.rawBytes <= SVG_SOFT_LIMIT_BYTES) return best;
      if (best.rawBytes <= SVG_HARD_LIMIT_BYTES && !hardFit) {
        hardFit = best;
      }
    }
  }

  if (hardFit) return hardFit;

  throw new Error(
    "This image is too detailed to fit the onchain byte ceiling. Try a simpler or smaller image, or draw the artwork as an SVG."
  );
}
