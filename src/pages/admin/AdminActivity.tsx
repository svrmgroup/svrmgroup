import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Row { id: string; actor_email: string | null; action: string; entity_type: string | null; entity_id: string | null; details: any; created_at: string; }

const AdminActivity = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { (async () => {
    const { data, error } = await supabase.from("activity_log" as any).select("*").order("created_at", { ascending: false }).limit(500);
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows((data as any) || []);
  })(); }, []);

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Audit</p>
        <h1 className="font-serif text-3xl md:text-4xl mt-2">Activity log</h1>
      </header>
      <div className="card-luxury overflow-hidden">
        {loading ? <p className="p-6 text-xs text-muted-foreground">Loading…</p> : rows.length === 0 ? (
          <p className="p-6 text-xs text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-deep text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <tr><th className="px-4 py-3 text-left">When</th><th className="px-4 py-3 text-left">Actor</th><th className="px-4 py-3 text-left">Action</th><th className="px-4 py-3 text-left">Entity</th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t border-border/40">
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</td>
                  <td className="px-4 py-3 text-xs">{r.actor_email || "—"}</td>
                  <td className="px-4 py-3 text-xs">{r.action}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{r.entity_type ? `${r.entity_type}${r.entity_id ? ` · ${r.entity_id.slice(0,8)}` : ""}` : "—"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminActivity;
