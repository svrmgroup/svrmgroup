import { supabase } from "@/integrations/supabase/client";

export async function logActivity(action: string, entity_type?: string, entity_id?: string, details: Record<string, unknown> = {}) {
  try {
    const { data } = await supabase.auth.getUser();
    if (!data.user) return;
    await supabase.from("activity_log" as any).insert({
      actor_id: data.user.id,
      actor_email: data.user.email ?? null,
      action, entity_type: entity_type ?? null, entity_id: entity_id ?? null,
      details: details as any,
    });
  } catch { /* silent */ }
}
