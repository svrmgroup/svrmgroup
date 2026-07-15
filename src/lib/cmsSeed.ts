// One-click seeding / resyncing of every CMS collection from the static
// website content. Safe to run repeatedly — uses upsert on (slug) for legacy
// tables and (kind, slug) for the unified cms_items table, so existing edits
// are preserved on non-key columns only when the admin chooses "only add new".
import { supabase } from "@/integrations/supabase/client";
import { tours } from "@/data/tours";
import { vehicles } from "@/data/vehicles";
import { stays } from "@/data/stays";
import { posts as blogPosts } from "@/data/blog";
import { securityOfferings } from "@/data/security";
import { yachts } from "@/data/yachts";
import { jets, helicopters } from "@/data/aviation";

// Note: seed rows intentionally omit `image_url` when the source is a
// Vite-imported binary (e.g. `import img from "@/assets/foo.jpg"`). Those
// imports resolve to build-hashed paths (`/assets/foo-<hash>.jpg`) that
// change on every rebuild — persisting them into the DB creates permanently
// broken image references. Consumer components use `resolveImage` from
// `@/lib/cmsImages` to fall back to the static import by slug, so images
// stay stable regardless of what's stored in the CMS row.

export interface ResyncReport {
  table: string;
  kind?: string;
  inserted: number;
  updated: number;
  error?: string;
}

type Mode = "upsert" | "insert-missing";

/** Chunk to keep single requests small. */
async function upsertChunked(
  table: string,
  rows: any[],
  onConflict: string,
  mode: Mode,
): Promise<{ inserted: number; updated: number; error?: string }> {
  if (rows.length === 0) return { inserted: 0, updated: 0 };
  const client: any = supabase;
  let inserted = 0;
  let updated = 0;
  const size = 50;
  for (let i = 0; i < rows.length; i += size) {
    const batch = rows.slice(i, i + size);
    if (mode === "insert-missing") {
      // Fetch existing slugs (+kind) to skip.
      const slugs = batch.map((r) => r.slug);
      let q = client.from(table).select("slug" + (onConflict.includes("kind") ? ", kind" : "")).in("slug", slugs);
      if (onConflict.includes("kind") && batch[0]?.kind) q = q.eq("kind", batch[0].kind);
      const { data: existing } = await q;
      const existingKeys = new Set(
        (existing || []).map((r: any) => onConflict.includes("kind") ? `${r.kind}::${r.slug}` : r.slug),
      );
      const toInsert = batch.filter((r) =>
        !existingKeys.has(onConflict.includes("kind") ? `${r.kind}::${r.slug}` : r.slug),
      );
      if (toInsert.length) {
        const { error } = await client.from(table).insert(toInsert);
        if (error) return { inserted, updated, error: error.message };
        inserted += toInsert.length;
      }
    } else {
      const { error, data } = await client
        .from(table)
        .upsert(batch, { onConflict, ignoreDuplicates: false })
        .select("id");
      if (error) return { inserted, updated, error: error.message };
      updated += (data as any[])?.length ?? batch.length;
    }
  }
  return { inserted, updated };
}

// ---- Seed builders --------------------------------------------------------

function toursSeed() {
  return tours.map((t, i) => {
    const cheapest = t.packages
      .map((p) => p.fromZAR)
      .filter((n): n is number => typeof n === "number")
      .sort((a, b) => a - b)[0];
    return {
      slug: t.slug,
      title: t.label,
      summary: t.blurb,
      description: t.description,
      image_url: t.image,
      price_from: cheapest ?? null,
      currency: "ZAR",
      duration: t.packages[0]?.duration ?? null,
      published: true,
      sort_order: (i + 1) * 10,
      data: { packages: t.packages, video: t.video ?? null },
    };
  });
}

function vehiclesSeed() {
  return vehicles.map((v, i) => ({
    slug: v.slug,
    title: v.name,
    summary: v.tagline,
    image_url: v.image,
    price_per_day: v.fromZAR,
    currency: "ZAR",
    category: v.tier,
    published: true,
    sort_order: (i + 1) * 10,
    data: { rentalZAR: v.rentalZAR ?? null, selfDrive: v.selfDrive },
  }));
}

function staysSeed() {
  return stays.map((s, i) => ({
    slug: s.slug,
    title: s.name,
    summary: s.blurb,
    image_url: s.image,
    price_per_night: s.fromZAR,
    currency: "ZAR",
    bedrooms: parseInt((s.beds.match(/\d+/) || ["0"])[0], 10) || null,
    location: s.area,
    published: true,
    sort_order: (i + 1) * 10,
    data: { type: s.type, nox: !!s.nox, beds: s.beds },
  }));
}

function blogsSeed() {
  return blogPosts.map((p, i) => ({
    kind: "blogs",
    slug: p.slug,
    title: p.title,
    eyebrow: p.date,
    summary: p.excerpt,
    description: p.intro,
    image_url: p.image,
    category: p.category,
    cta_label: "Read article",
    cta_href: `/blog/${p.slug}`,
    published: true,
    sort_order: (i + 1) * 10,
    meta: {
      readTime: p.readTime,
      sections: p.sections,
      closing: p.closing ?? null,
      publishedISO: p.publishedISO ?? null,
      seoTitle: p.seoTitle ?? null,
      seoDescription: p.seoDescription ?? null,
      seoKeywords: p.seoKeywords ?? null,
      ogImage: p.ogImage ?? null,
    },
  }));
}

function offersSeed() {
  const rows = [
    {
      slug: "special-bmw-x3-self-drive",
      title: "BMW X3",
      eyebrow: "Special Offer · Self-drive",
      summary: "Compact luxury SUV, dialled in. Free delivery within Cape Town.",
      price_zar: 2000,
      original_price_zar: 3000,
      price_suffix: "/ day",
      cta_label: "Reserve the X3",
      cta_href: "/rentals",
      image_url: bmwx3,
    },
    {
      slug: "cape-honeymoon-signature",
      title: "Cape Honeymoon Signature",
      eyebrow: "New · Romantic",
      summary: "3 nights, hot-air balloon, helicopter beach picnic, petal turndowns.",
      price_zar: 48000,
      price_prefix: "From ",
      cta_label: "See romantic packages",
      cta_href: "/tours/romantic",
      image_url: romantic,
    },
    {
      slug: "private-s-class-days",
      title: "Private S-Class Days",
      eyebrow: "Chauffeur",
      summary: "Executive chauffeur with S-Class or E-Class, up to 8 hours in-city.",
      price_zar: 6500,
      price_prefix: "From ",
      price_suffix: "/ day",
      cta_label: "Book a chauffeur",
      cta_href: "/travel",
      image_url: chauffeur,
    },
    {
      slug: "sabi-sand-signature",
      title: "Sabi Sand Signature",
      eyebrow: "Safari",
      summary: "4 nights premium lodge, twice-daily game drives, flights included.",
      price_zar: 28000,
      price_prefix: "From ",
      price_suffix: "/ pp",
      cta_label: "View safari tours",
      cta_href: "/tours/safari",
      image_url: safariImg,
    },
    {
      slug: "camps-bay-villa-collection",
      title: "Camps Bay Villa",
      eyebrow: "Stays",
      summary: "Curated villas and residences across the Cape's best addresses.",
      price_zar: null,
      cta_label: "Browse stays",
      cta_href: "/stays",
      image_url: villaImg,
    },
  ];
  return rows.map((r, i) => ({ kind: "offers", published: true, sort_order: (i + 1) * 10, ...r }));
}

function aviationSeed() {
  const rows = [
    ...jets.map((a) => ({ ...a, category: "Jet" as const })),
    ...helicopters.map((a) => ({ ...a, category: "Helicopter" as const })),
  ];
  return rows.map((a, i) => ({
    kind: "aviation",
    slug: a.slug,
    title: a.name,
    summary: a.tagline,
    description: a.capacity,
    image_url: a.image,
    category: a.category,
    published: true,
    sort_order: (i + 1) * 10,
  }));
}

function yachtsSeed() {
  return yachts.map((y, i) => ({
    kind: "yachts",
    slug: y.slug,
    title: y.name,
    summary: y.tagline,
    description: y.capacity,
    image_url: y.image,
    published: true,
    sort_order: (i + 1) * 10,
  }));
}

function securitySeed() {
  return securityOfferings.map((s, i) => ({
    kind: "security",
    slug: s.slug,
    title: s.name,
    summary: s.tagline,
    description: s.highlights.map((h) => `• ${h}`).join("\n"),
    image_url: s.image,
    category: s.category,
    published: true,
    sort_order: (i + 1) * 10,
    meta: { highlights: s.highlights },
  }));
}

/** Master resync. */
export async function resyncAllCms(mode: Mode = "insert-missing"): Promise<ResyncReport[]> {
  const jobs: Array<{ table: string; kind?: string; rows: any[]; onConflict: string }> = [
    { table: "cms_tours", rows: toursSeed(), onConflict: "slug" },
    { table: "cms_vehicles", rows: vehiclesSeed(), onConflict: "slug" },
    { table: "cms_stays", rows: staysSeed(), onConflict: "slug" },
    { table: "cms_items", kind: "blogs", rows: blogsSeed(), onConflict: "kind,slug" },
    { table: "cms_items", kind: "offers", rows: offersSeed(), onConflict: "kind,slug" },
    { table: "cms_items", kind: "aviation", rows: aviationSeed(), onConflict: "kind,slug" },
    { table: "cms_items", kind: "yachts", rows: yachtsSeed(), onConflict: "kind,slug" },
    { table: "cms_items", kind: "security", rows: securitySeed(), onConflict: "kind,slug" },
  ];

  const out: ResyncReport[] = [];
  for (const j of jobs) {
    const r = await upsertChunked(j.table, j.rows, j.onConflict, mode);
    out.push({ table: j.table, kind: j.kind, ...r });
  }
  return out;
}
