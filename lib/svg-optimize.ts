/**
 * Client-side SVG optimization with SVGO's browser build. Registration
 * stores the raw SVG in contract bytecode, so every byte saved is a byte
 * the creator does not pay to deploy. Optimization only ever runs on an
 * explicit click, and the before and after byte counts are shown so the
 * result is never a silent rewrite of the creator's artwork.
 */

export type SvgOptimization = {
  svg: string;
  before: number;
  after: number;
  saved: number;
  improved: boolean;
};

const encoder = new TextEncoder();

/**
 * Runs SVGO's default preset. That preset keeps the viewBox and any title,
 * and in SVGO 4 it never removes embedded raster images, so framed image
 * uploads survive the pass. The browser build is imported on demand so it
 * stays out of the initial bundle and is never evaluated during server
 * rendering. Throws only if SVGO cannot parse the input; the caller reports
 * that in the interface.
 */
export async function optimizeSvgArtwork(svg: string): Promise<SvgOptimization> {
  const { optimize } = await import("svgo/browser");
  const before = encoder.encode(svg).length;
  const result = optimize(svg, {
    multipass: true,
    plugins: ["preset-default"],
  });

  const optimized = result.data;
  const after = encoder.encode(optimized).length;

  return {
    svg: optimized,
    before,
    after,
    saved: Math.max(0, before - after),
    improved: after < before,
  };
}
