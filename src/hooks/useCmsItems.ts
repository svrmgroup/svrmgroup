import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface CmsItem {
  id: string;
  kind: string;
  slug: string;
  title: string;
  eyebrow: string | null;
  summary: string | null;
  description: string | null;
  image_url: string | null;
  price_zar: number | null;
  original_price_zar: number | null;
  price_prefix: string | null;
  price_suffix: string | null;
  cta_label: string | null;
  cta_href: string | null;
  category: string | null;
  meta: Record<string, any>;
  published: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

/** Fetch published CMS items for a kind. Silent-fail: returns [] on any error. */
export function useCmsItems(kind: string) {
  const [items, setItems] = useState<CmsItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let alive = true;
    (async () => {
      const { data, error } = await (supabase as any)
        .from("cms_items")
        .select("*")
        .eq("kind", kind)
        .eq("published", true)
        .order("sort_order", { ascending: true })
        .order("created_at", { ascending: false });
      if (!alive) return;
      if (error) {
        setItems([]);
      } else {
        setItems((data as CmsItem[]) || []);
      }
      setLoading(false);
    })();
    return () => { alive = false; };
  }, [kind]);

  return { items, loading };
}
