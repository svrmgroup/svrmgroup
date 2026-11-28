/** Stable, per-page variety: the same key always picks the same questions, so search data stays consistent. */
export const seedOf = (str: string) => { let h = 2166136261; for (const c of str) h = Math.imul(h ^ c.charCodeAt(0), 16777619); return h >>> 0; };

export function pickStable<T>(items: T[], key: string, n: number): T[] {
  let h = seedOf(key);
  return items
    .map((item) => { h = Math.imul(h ^ (h >>> 15), 2246822507) >>> 0; return { item, k: h }; })
    .sort((a, b) => a.k - b.k)
    .slice(0, n)
    .map((x) => x.item);
}
