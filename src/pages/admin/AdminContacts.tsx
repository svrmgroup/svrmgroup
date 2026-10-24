import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Mail, Phone, Download, Trash2, Search, Globe } from "lucide-react";
import { countryLabel } from "@/lib/countryCodes";

interface ContactRow {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  country: string | null;
  country_iso: string | null;
  source_page: string | null;
  enquiry_count: number;
  first_enquiry_at: string;
  last_enquiry_at: string;
  notes: string | null;
}

const SAST = "Africa/Johannesburg";
const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-ZA", {
    timeZone: SAST,
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

const AdminContacts = () => {
  const [rows, setRows] = useState<ContactRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [countryFilter, setCountryFilter] = useState<string>("all");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("contacts")
      .select("*")
      .order("last_enquiry_at", { ascending: false });
    if (error) toast.error(error.message);
    setRows((data as ContactRow[]) || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const update = async (id: string, patch: Partial<ContactRow>) => {
    const { error } = await supabase.from("contacts").update(patch).eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const remove = async (id: string) => {
    if (!confirm("Remove this contact from the database?")) return;
    const { error } = await supabase.from("contacts").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setRows((r) => r.filter((x) => x.id !== id));
  };

  const displayCountry = (r: ContactRow) => r.country || countryLabel(r.phone) || null;

  const countries = useMemo(() => {
    const set = new Map<string, number>();
    for (const r of rows) {
      const c = displayCountry(r);
      if (c) set.set(c, (set.get(c) || 0) + 1);
    }
    return [...set.entries()].sort((a, b) => b[1] - a[1]);
  }, [rows]);

  const filtered = rows.filter((r) => {
    if (countryFilter !== "all") {
      const c = displayCountry(r);
      if (countryFilter === "unknown" ? c : c !== countryFilter) return false;
    }
    if (!search.trim()) return true;
    const q = search.trim().toLowerCase();
    return [r.name, r.email, r.phone, displayCountry(r), r.source_page]
      .filter(Boolean)
      .some((v) => String(v).toLowerCase().includes(q));
  });

  const exportCsv = () => {
    const headers = ["Name", "Email", "Phone", "Country", "Enquiries", "First enquiry", "Last enquiry", "Source", "Notes"];
    const lines = filtered.map((r) => [
      r.name,
      r.email,
      r.phone || "",
      displayCountry(r) || "",
      String(r.enquiry_count),
      fmtDate(r.first_enquiry_at),
      fmtDate(r.last_enquiry_at),
      r.source_page || "",
      (r.notes || "").replace(/\n/g, " "),
    ]);
    const csv = [headers, ...lines]
      .map((l) => l.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `svrm-contacts-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className="eyebrow">People</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Contacts database</h1>
          <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
            Everyone who has ever enquired, saved automatically with their name, contact details and country.
          </p>
        </div>
        <p className="text-xs text-muted-foreground">{rows.length} contacts</p>
      </div>

      {/* Search + export */}
      <div className="flex gap-2 mb-6 flex-wrap">
        <div className="flex-1 min-w-[220px] flex items-center gap-2 bg-background border border-border/60 px-4 focus-within:border-primary">
          <Search className="h-4 w-4 text-muted-foreground shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search name, email, phone, country…"
            className="flex-1 bg-transparent py-3 text-sm focus:outline-none"
          />
        </div>
        <button
          onClick={exportCsv}
          disabled={filtered.length === 0}
          className="flex items-center gap-2 px-5 py-3 border border-border/60 text-xs uppercase tracking-[0.22em] text-gold hover:border-primary transition-colors disabled:opacity-40"
        >
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      {/* Country filter */}
      {countries.length > 0 && (
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setCountryFilter("all")}
            className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${
              countryFilter === "all"
                ? "border-primary bg-primary/10 text-gold"
                : "border-border/40 text-muted-foreground hover:text-foreground"
            }`}
          >
            All ({rows.length})
          </button>
          {countries.map(([c, n]) => (
            <button
              key={c}
              onClick={() => setCountryFilter(c)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${
                countryFilter === c
                  ? "border-primary bg-primary/10 text-gold"
                  : "border-border/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              {c} · {n}
            </button>
          ))}
          {rows.some((r) => !displayCountry(r)) && (
            <button
              onClick={() => setCountryFilter("unknown")}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${
                countryFilter === "unknown"
                  ? "border-primary bg-primary/10 text-gold"
                  : "border-border/40 text-muted-foreground hover:text-foreground"
              }`}
            >
              No country
            </button>
          )}
        </div>
      )}

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="border border-border/40 p-12 text-center text-sm text-muted-foreground">
          {rows.length === 0
            ? "No contacts yet — everyone who enquires is saved here automatically."
            : "No contacts match your search."}
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((r) => {
            const country = displayCountry(r);
            return (
              <div key={r.id} className="border border-border/40 bg-surface-raised p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg truncate">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">
                      {r.email}
                      {r.phone ? ` · ${r.phone}` : ""}
                    </p>
                  </div>
                  {country ? (
                    <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] border border-primary/40 bg-primary/10 text-gold whitespace-nowrap">
                      {country}
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-[10px] uppercase tracking-[0.18em] border border-border/40 text-muted-foreground whitespace-nowrap flex items-center gap-1.5">
                      <Globe className="h-3 w-3" /> Unknown
                    </span>
                  )}
                </div>

                <div className="mt-3 flex flex-wrap gap-4 text-xs">
                  <a
                    href={`mailto:${r.email}`}
                    className="flex items-center gap-1.5 text-gold hover:underline"
                  >
                    <Mail className="h-3 w-3" /> Email
                  </a>
                  {r.phone && (
                    <a
                      href={`https://wa.me/${r.phone.replace(/[^0-9]/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-gold hover:underline"
                    >
                      <Phone className="h-3 w-3" /> WhatsApp
                    </a>
                  )}
                  <span className="text-muted-foreground">
                    {r.enquiry_count} {r.enquiry_count === 1 ? "enquiry" : "enquiries"}
                  </span>
                  <span className="text-muted-foreground">
                    First: {fmtDate(r.first_enquiry_at)} · Last: {fmtDate(r.last_enquiry_at)}
                  </span>
                  {r.source_page && (
                    <span className="text-muted-foreground">From: {r.source_page}</span>
                  )}
                </div>

                <textarea
                  defaultValue={r.notes || ""}
                  onBlur={(e) =>
                    e.target.value !== (r.notes || "") &&
                    update(r.id, { notes: e.target.value || null })
                  }
                  placeholder="Notes (preferences, follow-ups…)"
                  rows={1}
                  className="mt-3 w-full bg-background border border-border/60 px-3 py-2 text-xs focus:border-primary focus:outline-none"
                />

                <div className="mt-2 flex justify-end">
                  <button
                    onClick={() => remove(r.id)}
                    className="flex items-center gap-1.5 text-xs text-destructive hover:underline"
                  >
                    <Trash2 className="h-3 w-3" /> Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
