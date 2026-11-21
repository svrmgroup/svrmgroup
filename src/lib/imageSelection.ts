export type ImageRendition = { src: string; width: number };

/** Presentation-only selection: never change CMS or search-discovery URLs. */
export function selectImageSource(
  source: string | undefined,
  registry: Record<string, ImageRendition[]>,
  original = false,
) {
  if (!source || original) return { src: source, srcSet: undefined };
  let key = source;
  try {
    const url = new URL(source, "https://svrm.group");
    if (url.pathname.startsWith("/__l5e/")) key = url.pathname;
  } catch { /* Unknown sources retain their existing behavior. */ }
  const variants = registry[key];
  if (!variants?.length) return { src: source, srcSet: undefined };
  const unique = [...new Map(variants.map((v) => [v.width, v])).values()]
    .sort((a, b) => a.width - b.width);
  return {
    src: unique[unique.length - 1]?.src ?? source,
    srcSet: unique.map((v) => `${v.src} ${v.width}w`).join(", "),
  };
}