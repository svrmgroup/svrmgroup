import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const ROLES = ["admin","super_admin","ops_manager","viewer","staff"] as const;

interface Row { id: string; user_id: string; role: string; created_at: string; }

const AdminRoles = () => {
  const [rows, setRows] = useState<Row[]>([]);
  const [emails, setEmails] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [newUserId, setNewUserId] = useState("");
  const [newRole, setNewRole] = useState<string>("admin");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase.from("user_roles").select("*").order("created_at", { ascending: false });
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows((data as any) || []);
  };
  useEffect(() => { load(); }, []);

  const grant = async () => {
    if (!newUserId.trim()) return toast.error("Paste a user id");
    const { error } = await supabase.from("user_roles").insert({ user_id: newUserId.trim(), role: newRole as any });
    if (error) return toast.error(error.message);
    toast.success("Role granted");
    setNewUserId("");
    load();
  };

  const revoke = async (id: string) => {
    if (!confirm("Revoke this role?")) return;
    const { error } = await supabase.from("user_roles").delete().eq("id", id);
    if (error) return toast.error(error.message);
    load();
  };

  return (
    <div className="space-y-6">
      <header>
        <p className="eyebrow">Access</p>
        <h1 className="font-serif text-3xl md:text-4xl mt-2">Users &amp; roles</h1>
        <p className="text-xs text-muted-foreground mt-2">Grant admin console access. The user must sign up at <span className="text-foreground">/admin/login</span> first, then paste their user id here.</p>
      </header>

      <div className="card-luxury p-5 space-y-3">
        <p className="eyebrow">Grant role</p>
        <div className="grid md:grid-cols-3 gap-2">
          <input placeholder="User id (UUID)" value={newUserId} onChange={e => setNewUserId(e.target.value)} className="input-luxury text-sm md:col-span-2"/>
          <select value={newRole} onChange={e => setNewRole(e.target.value)} className="input-luxury text-sm capitalize">
            {ROLES.map(r => <option key={r} value={r}>{r.replace("_"," ")}</option>)}
          </select>
        </div>
        <button onClick={grant} className="btn-luxury text-xs flex items-center gap-2"><Plus className="h-3.5 w-3.5"/> Grant</button>
      </div>

      <div className="card-luxury overflow-hidden">
        {loading ? <p className="p-6 text-xs text-muted-foreground">Loading…</p> : rows.length === 0 ? (
          <p className="p-6 text-xs text-muted-foreground">No roles assigned.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-surface-deep text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
              <tr><th className="px-4 py-3 text-left">User id</th><th className="px-4 py-3 text-left">Role</th><th className="px-4 py-3 text-left">Since</th><th></th></tr>
            </thead>
            <tbody>
              {rows.map(r => (
                <tr key={r.id} className="border-t border-border/40">
                  <td className="px-4 py-3 font-mono text-xs">{r.user_id}</td>
                  <td className="px-4 py-3 text-xs capitalize">{r.role.replace("_"," ")}</td>
                  <td className="px-4 py-3 text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right"><button onClick={() => revoke(r.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5"/></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminRoles;
