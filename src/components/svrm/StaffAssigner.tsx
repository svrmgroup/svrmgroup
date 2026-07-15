import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Plus, Trash2, UserCheck } from "lucide-react";

export interface PendingAssignment {
  staff_id: string;
  role: string;
}

interface StaffOption {
  id: string;
  full_name: string;
  role: string;
  custom_role_title?: string | null;
}

interface RowAssignment {
  id: string;
  staff_id: string;
  role: string | null;
  status: string;
}

interface Props {
  /** When provided, assignments are read/written directly to booking_assignments. */
  bookingId?: string | null;
  /** Controlled mode used when creating a new booking (no id yet). */
  value?: PendingAssignment[];
  onChange?: (next: PendingAssignment[]) => void;
  compact?: boolean;
}

const StaffAssigner = ({ bookingId, value, onChange, compact }: Props) => {
  const [staff, setStaff] = useState<StaffOption[]>([]);
  const [rows, setRows] = useState<RowAssignment[]>([]);
  const [staffId, setStaffId] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const { data } = await supabase
        .from("staff" as any)
        .select("id, full_name, role, custom_role_title")
        .eq("is_active", true)
        .order("full_name");
      setStaff((data as any) || []);
    })();
  }, []);

  const loadRows = async () => {
    if (!bookingId) return;
    setLoading(true);
    const { data } = await supabase
      .from("booking_assignments" as any)
      .select("id, staff_id, role, status")
      .eq("booking_id", bookingId);
    setRows((data as any) || []);
    setLoading(false);
  };
  useEffect(() => { if (bookingId) loadRows(); }, [bookingId]);

  const staffLabel = (s: StaffOption) =>
    `${s.full_name} — ${s.custom_role_title || s.role}`;

  const add = async () => {
    if (!staffId) return toast.error("Select a staff member");
    if (bookingId) {
      const { data: userData } = await supabase.auth.getUser();
      const { error } = await supabase.from("booking_assignments" as any).insert({
        booking_id: bookingId,
        staff_id: staffId,
        role: role.trim() || null,
        created_by: userData.user?.id ?? null,
      });
      if (error) return toast.error(error.message);
      toast.success("Staff assigned");
      setStaffId(""); setRole("");
      loadRows();
    } else if (onChange) {
      if ((value || []).some((v) => v.staff_id === staffId)) return toast.error("Already added");
      onChange([...(value || []), { staff_id: staffId, role: role.trim() }]);
      setStaffId(""); setRole("");
    }
  };

  const removeRow = async (id: string) => {
    await supabase.from("booking_assignments" as any).delete().eq("id", id);
    loadRows();
  };

  const removePending = (sid: string) => {
    onChange?.((value || []).filter((v) => v.staff_id !== sid));
  };

  const current = bookingId
    ? rows.map((r) => ({ id: r.id, staff_id: r.staff_id, role: r.role || "", status: r.status }))
    : (value || []).map((v) => ({ id: v.staff_id, staff_id: v.staff_id, role: v.role, status: "pending" }));

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2">
        <UserCheck className="h-3.5 w-3.5 text-gold" />
        <p className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Assigned staff</p>
      </div>

      {current.length > 0 && (
        <div className="space-y-1.5">
          {current.map((a) => {
            const s = staff.find((x) => x.id === a.staff_id);
            return (
              <div key={a.id} className="flex items-center gap-2 text-xs bg-background border border-border/40 px-3 py-2">
                <span className="flex-1 truncate">
                  {s ? staffLabel(s) : a.staff_id}
                  {a.role && <span className="text-muted-foreground"> · {a.role}</span>}
                </span>
                {bookingId && (
                  <span className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground">{a.status}</span>
                )}
                <button
                  onClick={() => (bookingId ? removeRow(a.id) : removePending(a.staff_id))}
                  className="text-muted-foreground hover:text-destructive"
                  aria-label="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}

      <div className={`grid gap-2 ${compact ? "grid-cols-12" : "grid-cols-1 md:grid-cols-12"}`}>
        <select
          value={staffId}
          onChange={(e) => setStaffId(e.target.value)}
          className="col-span-7 bg-background border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        >
          <option value="">Select staff…</option>
          {staff.map((s) => (
            <option key={s.id} value={s.id}>{staffLabel(s)}</option>
          ))}
        </select>
        <input
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Role on booking (optional)"
          className="col-span-3 bg-background border border-border/60 px-3 py-2 text-sm focus:border-primary focus:outline-none"
        />
        <button
          type="button"
          onClick={add}
          disabled={loading}
          className="col-span-2 flex items-center justify-center gap-1 border border-primary/60 text-gold text-xs px-3 py-2 hover:bg-primary/10 transition-colors disabled:opacity-50"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      </div>
      {staff.length === 0 && (
        <p className="text-[10px] text-muted-foreground">No active staff yet. Add team members in Staff.</p>
      )}
    </div>
  );
};

export default StaffAssigner;
