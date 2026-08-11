/**
 * Adaptive video source selection.
 *
 * Every background video is transcoded to two lightweight renditions
 * (480p and 720p, video-only H.264 with faststart). At runtime we pick the
 * smallest rendition that still looks sharp on the current device, based on
 * viewport size, device pixel ratio, and the effective network type.
 */

type Pointer = { url: string };

// Eagerly collect every generated rendition pointer (tiny JSON files).
const modules = {
  ...(import.meta.glob("@/assets/videos/*-{480,720}.mp4.asset.json", {
    eager: true,
  }) as Record<string, { default: Pointer }>),
  ...(import.meta.glob("@/assets/*-{480,720}.mp4.asset.json", {
    eager: true,
  }) as Record<string, { default: Pointer }>),
};

type Renditions = { "480"?: string; "720"?: string };

const registry: Record<string, Renditions> = {};

for (const [path, mod] of Object.entries(modules)) {
  const file = path.split("/").pop() ?? "";
  const match = file.match(/^(.*)-(480|720)\.mp4\.asset\.json$/);
  if (!match) continue;
  const [, base, height] = match;
  registry[base] = { ...registry[base], [height]: mod.default.url };
}

/** Base filename of an asset URL, e.g. ".../hero-drone.mp4" -> "hero-drone". */
const baseNameOf = (url: string) => {
  const file = url.split("/").pop() ?? "";
  return file.replace(/\.mp4$/i, "").replace(/-(480|720)$/, "");
};

type Tier = "480" | "720";

const connectionInfo = () =>
  (navigator as unknown as {
    connection?: { saveData?: boolean; effectiveType?: string; downlink?: number };
  }).connection;

/** Chooses the best rendition tier for the current device and network. */
export const pickVideoTier = (): Tier => {
  if (typeof window === "undefined") return "480";

  const conn = connectionInfo();
  const effectiveType = conn?.effectiveType ?? "";
  const slowNetwork =
    conn?.saveData === true ||
    effectiveType === "slow-2g" ||
    effectiveType === "2g" ||
    effectiveType === "3g" ||
    (typeof conn?.downlink === "number" && conn.downlink > 0 && conn.downlink < 2);

  if (slowNetwork) return "480";

  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  // Background videos are cover-scaled, so the rendered pixel width is what matters.
  const renderedWidth = window.innerWidth * dpr;

  return renderedWidth <= 900 ? "480" : "720";
};

/**
 * Resolves an original video URL to the optimal rendition for this device.
 * Falls back to the original URL when no rendition has been generated.
 */
export const resolveVideoSource = (originalUrl: string, tier?: Tier): string => {
  const renditions = registry[baseNameOf(originalUrl)];
  if (!renditions) return originalUrl;
  const wanted = tier ?? pickVideoTier();
  return renditions[wanted] ?? renditions["720"] ?? renditions["480"] ?? originalUrl;
};
