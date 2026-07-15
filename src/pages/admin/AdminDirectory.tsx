import { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Plus, Search, Star, StarOff, Copy, Trash2, Pencil, Upload, Download,
  Phone, Mail, MessageCircle, Globe, Clock, X,
} from "lucide-react";

const CATEGORIES = [
  "transport", "accommodation", "tours", "yachts", "aviation", "security",
  "wellness", "dining", "events", "photography", "staffing", "other",
] as const;

const STATUSES = ["active", "pending", "inactive"] as const;

type Category = typeof CATEGORIES[number];
type Status = typeof STATUSES[number];

interface Supplier {
  id: string;
  company_name: string;
  category: Category;
  country: string | null;
  city: string | null;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  whatsapp: string | null;
  website: string | null;
  services_offered: string[];
  rate_notes: string | null;
  rating: number | null;
  status: Status;
  preferred: boolean;
  last_contacted_at: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const emptyForm = (): Partial<Supplier> => ({
  company_name: "",
  category: "other",
  country: "",
  city: "",
  contact_name: "",
  email: "",
  phone: "",
  whatsapp: "",
  website: "",
  services_offered: [],
  rate_notes: "",
  rating: null,
  status: "active",
  preferred: false,
  notes: "",
});

// --- tiny CSV helpers (RFC-4180-ish) ---
function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"' && text[i + 1] === '"') { cur += '"'; i++; }
      else if (c === '"') { inQuotes = false; }
      else { cur += c; }
    } else {
      if (c === '"') inQuotes = true;
      else if (c === ",") { row.push(cur); cur = ""; }
      else if (c === "\n") { row.push(cur); rows.push(row); row = []; cur = ""; }
      else if (c === "\r") { /* skip */ }
      else cur += c;
    }
  }
  if (cur.length || row.length) { row.push(cur); rows.push(row); }
  return rows.filter((r) => r.some((v) => v.trim().length > 0));
}

function toCsv(rows: (string | number | null | undefined)[][]): string {
  return rows.map((r) => r.map((v) => {
    const s = v == null ? "" : String(v);
    if (/[",\n\r]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
    return s;
  }).join(",")).join("\n");
}

const AdminDirectory = () => {
  const [rows, setRows] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [catFilter, setCatFilter] = useState<Category | "all">("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [countryFilter, setCountryFilter] = useState<string>("all");
  const [minRating, setMinRating] = useState(0);
  const [preferredOnly, setPreferredOnly] = useState(false);

  const [showEdit, setShowEdit] = useState(false);
  const [editing, setEditing] = useState<Partial<Supplier>>(emptyForm());
  const [servicesInput, setServicesInput] = useState("");

  const fileRef = useRef<HTMLInputElement>(null);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("suppliers_directory" as any)
      .select("*")
      .order("preferred", { ascending: false })
      .order("company_name", { ascending: true });
    setLoading(false);
    if (error) return toast.error(error.message);
    setRows((data as any) || []);
  };

  useEffect(() => { load(); }, []);

  const countries = useMemo(
    () => Array.from(new Set(rows.map((r) => r.country).filter(Boolean) as string[])).sort(),
    [rows],
  );

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return rows.filter((r) => {
      if (catFilter !== "all" && r.category !== catFilter) return false;
      if (statusFilter !== "all" && r.status !== statusFilter) return false;
      if (countryFilter !== "all" && r.country !== countryFilter) return false;
      if (minRating > 0 && (r.rating ?? 0) < minRating) return false;
      if (preferredOnly && !r.preferred) return false;
      if (q) {
        const hay = [
          r.company_name, r.contact_name, r.email, r.phone, r.city, r.country,
          r.notes, r.rate_notes, (r.services_offered || []).join(" "),
        ].filter(Boolean).join(" ").toLowerCase();
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [rows, search, catFilter, statusFilter, countryFilter, minRating, preferredOnly]);

  const openNew = () => {
    setEditing(emptyForm());
    setServicesInput("");
    setShowEdit(true);
  };

  const openEdit = (s: Supplier) => {
    setEditing({ ...s });
    setServicesInput((s.services_offered || []).join(", "));
    setShowEdit(true);
  };

  const save = async () => {
    if (!editing.company_name?.trim()) return toast.error("Company name is required");
    const services = servicesInput.split(",").map((s) => s.trim()).filter(Boolean);
    const payload: any = {
      company_name: editing.company_name!.trim(),
      category: editing.category || "other",
      country: editing.country || null,
      city: editing.city || null,
      contact_name: editing.contact_name || null,
      email: editing.email || null,
      phone: editing.phone || null,
      whatsapp: editing.whatsapp || editing.phone || null,
      website: editing.website || null,
      services_offered: services,
      rate_notes: editing.rate_notes || null,
      rating: editing.rating ?? null,
      status: editing.status || "active",
      preferred: !!editing.preferred,
      notes: editing.notes || null,
    };
    let error;
    if (editing.id) {
      ({ error } = await supabase.from("suppliers_directory" as any).update(payload).eq("id", editing.id));
    } else {
      const { data: userData } = await supabase.auth.getUser();
      payload.created_by = userData.user?.id ?? null;
      ({ error } = await supabase.from("suppliers_directory" as any).insert(payload));
    }
    if (error) return toast.error(error.message);
    toast.success(editing.id ? "Supplier updated" : "Supplier added");
    setShowEdit(false);
    load();
  };

  const del = async (id: string) => {
    if (!confirm("Delete supplier permanently?")) return;
    const { error } = await supabase.from("suppliers_directory" as any).delete().eq("id", id);
    if (error) return toast.error(error.message);
    toast.success("Deleted");
    load();
  };

  const togglePreferred = async (s: Supplier) => {
    const { error } = await supabase.from("suppliers_directory" as any)
      .update({ preferred: !s.preferred }).eq("id", s.id);
    if (error) return toast.error(error.message);
    load();
  };

  const logContact = async (s: Supplier) => {
    const { error } = await supabase.from("suppliers_directory" as any)
      .update({ last_contacted_at: new Date().toISOString() }).eq("id", s.id);
    if (error) return toast.error(error.message);
    toast.success("Contact logged");
    load();
  };

  const copy = async (val: string | null, label: string) => {
    if (!val) return;
    try { await navigator.clipboard.writeText(val); toast.success(`${label} copied`); }
    catch { toast.error("Copy failed"); }
  };

  const exportCsv = () => {
    const header = [
      "company_name","category","country","city","contact_name","email","phone","whatsapp",
      "website","services_offered","rate_notes","rating","status","preferred","last_contacted_at","notes",
    ];
    const data = filtered.map((r) => [
      r.company_name, r.category, r.country, r.city, r.contact_name, r.email, r.phone, r.whatsapp,
      r.website, (r.services_offered || []).join("; "), r.rate_notes, r.rating, r.status,
      r.preferred ? "true" : "false", r.last_contacted_at, r.notes,
    ]);
    const csv = toCsv([header, ...data]);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = `suppliers-directory-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click(); URL.revokeObjectURL(url);
  };

  const importCsv = async (file: File) => {
    try {
      const text = await file.text();
      const grid = parseCsv(text);
      if (grid.length < 2) return toast.error("CSV is empty");
      const header = grid[0].map((h) => h.trim().toLowerCase());
      const idx = (k: string) => header.indexOf(k);
      const iName = idx("company_name");
      if (iName < 0) return toast.error("Missing 'company_name' column");

      const existingEmails = new Map(rows.map((r) => [(r.email || "").toLowerCase(), r]));
      const existingNames = new Map(rows.map((r) => [r.company_name.toLowerCase(), r]));

      const toInsert: any[] = [];
      let skipped = 0;
      for (let i = 1; i < grid.length; i++) {
        const row = grid[i];
        const name = row[iName]?.trim();
        if (!name) continue;
        const email = idx("email") >= 0 ? (row[idx("email")] || "").trim() : "";
        const dup = (email && existingEmails.get(email.toLowerCase()))
          || existingNames.get(name.toLowerCase());
        if (dup) { skipped++; continue; }
        const services = idx("services_offered") >= 0
          ? (row[idx("services_offered")] || "").split(/[;,]/).map((s) => s.trim()).filter(Boolean)
          : [];
        const rawCat = idx("category") >= 0 ? (row[idx("category")] || "").trim().toLowerCase() : "other";
        const rawStatus = idx("status") >= 0 ? (row[idx("status")] || "").trim().toLowerCase() : "active";
        toInsert.push({
          company_name: name,
          category: (CATEGORIES as readonly string[]).includes(rawCat) ? rawCat : "other",
          country: idx("country") >= 0 ? row[idx("country")] || null : null,
          city: idx("city") >= 0 ? row[idx("city")] || null : null,
          contact_name: idx("contact_name") >= 0 ? row[idx("contact_name")] || null : null,
          email: email || null,
          phone: idx("phone") >= 0 ? row[idx("phone")] || null : null,
          whatsapp: idx("whatsapp") >= 0 ? row[idx("whatsapp")] || null : null,
          website: idx("website") >= 0 ? row[idx("website")] || null : null,
          services_offered: services,
          rate_notes: idx("rate_notes") >= 0 ? row[idx("rate_notes")] || null : null,
          rating: idx("rating") >= 0 && row[idx("rating")] ? Number(row[idx("rating")]) : null,
          status: (STATUSES as readonly string[]).includes(rawStatus) ? rawStatus : "active",
          preferred: idx("preferred") >= 0 ? /^(true|1|yes)$/i.test(row[idx("preferred")] || "") : false,
          notes: idx("notes") >= 0 ? row[idx("notes")] || null : null,
        });
      }

      if (!toInsert.length) return toast.info(`Nothing to import — ${skipped} duplicate(s) skipped`);
      const { data: userData } = await supabase.auth.getUser();
      const uid = userData.user?.id ?? null;
      const { error } = await supabase.from("suppliers_directory" as any)
        .insert(toInsert.map((r) => ({ ...r, created_by: uid })));
      if (error) return toast.error(error.message);
      toast.success(`Imported ${toInsert.length}, skipped ${skipped}`);
      load();
    } catch (e: any) {
      toast.error(e?.message || "Import failed");
    }
  };

  const fmtDate = (iso: string | null) => {
    if (!iso) return "—";
    const d = new Date(iso);
    const days = Math.floor((Date.now() - d.getTime()) / 86400000);
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 30) return `${days}d ago`;
    return d.toLocaleDateString();
  };

  return (
    <div className="space-y-8">
      <header className="flex flex-wrap items-baseline justify-between gap-3">
        <div>
          <p className="eyebrow">Growth</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Supplier directory</h1>
          <p className="text-xs text-muted-foreground mt-2">Global B2B partners across every service line.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <input
            ref={fileRef}
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) importCsv(f);
              if (fileRef.current) fileRef.current.value = "";
            }}
          />
          <button onClick={() => fileRef.current?.click()} className="btn-ghost text-xs flex items-center gap-2">
            <Upload className="h-3.5 w-3.5" /> Import CSV
          </button>
          <button onClick={exportCsv} className="btn-ghost text-xs flex items-center gap-2">
            <Download className="h-3.5 w-3.5" /> Export
          </button>
          <button onClick={openNew} className="btn-luxury text-xs flex items-center gap-2">
            <Plus className="h-3.5 w-3.5" /> New supplier
          </button>
        </div>
      </header>

      {/* Filters */}
      <div className="card-luxury p-4 grid gap-3 md:grid-cols-6">
        <label className="relative md:col-span-2">
          <Search className="h-3.5 w-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company, contact, services…"
            className="input-luxury text-sm pl-9 w-full"
          />
        </label>
        <select value={catFilter} onChange={(e) => setCatFilter(e.target.value as any)} className="input-luxury text-sm capitalize">
          <option value="all">All categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)} className="input-luxury text-sm capitalize">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={countryFilter} onChange={(e) => setCountryFilter(e.target.value)} className="input-luxury text-sm">
          <option value="all">All countries</option>
          {countries.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <div className="flex items-center gap-2">
          <select value={minRating} onChange={(e) => setMinRating(Number(e.target.value))} className="input-luxury text-sm flex-1">
            <option value={0}>Any rating</option>
            {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}★+</option>)}
          </select>
          <label className="flex items-center gap-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground whitespace-nowrap">
            <input type="checkbox" checked={preferredOnly} onChange={(e) => setPreferredOnly(e.target.checked)} />
            Pref
          </label>
        </div>
      </div>

      {/* Table */}
      <div className="card-luxury overflow-hidden">
        {loading ? (
          <p className="p-6 text-xs text-muted-foreground">Loading…</p>
        ) : filtered.length === 0 ? (
          <p className="p-6 text-xs text-muted-foreground">
            {rows.length === 0 ? "No suppliers yet — add one or import a CSV." : "No suppliers match these filters."}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm min-w-[900px]">
              <thead className="bg-surface-deep text-[10px] uppercase tracking-[0.24em] text-muted-foreground">
                <tr>
                  <th className="px-3 py-3 text-left w-8"></th>
                  <th className="px-3 py-3 text-left">Company</th>
                  <th className="px-3 py-3 text-left">Category</th>
                  <th className="px-3 py-3 text-left">Location</th>
                  <th className="px-3 py-3 text-left">Contact</th>
                  <th className="px-3 py-3 text-left">Rating</th>
                  <th className="px-3 py-3 text-left">Status</th>
                  <th className="px-3 py-3 text-left">Last contact</th>
                  <th className="px-3 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-t border-border/40 hover:bg-surface-raised/30">
                    <td className="px-3 py-3">
                      <button onClick={() => togglePreferred(s)} title={s.preferred ? "Unpin" : "Pin as preferred"}>
                        {s.preferred ? <Star className="h-4 w-4 fill-primary text-primary" /> : <StarOff className="h-4 w-4 text-muted-foreground/50" />}
                      </button>
                    </td>
                    <td className="px-3 py-3">
                      <p className="font-medium">{s.company_name}</p>
                      {s.contact_name && <p className="text-[11px] text-muted-foreground">{s.contact_name}</p>}
                      {s.services_offered?.length > 0 && (
                        <p className="text-[10px] text-muted-foreground/70 mt-1 truncate max-w-[240px]">
                          {s.services_offered.join(" · ")}
                        </p>
                      )}
                    </td>
                    <td className="px-3 py-3 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{s.category}</td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">
                      {[s.city, s.country].filter(Boolean).join(", ") || "—"}
                    </td>
                    <td className="px-3 py-3">
                      <div className="flex flex-wrap gap-1">
                        {s.email && (
                          <button onClick={() => copy(s.email, "Email")} className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <Mail className="h-3 w-3" /> <Copy className="h-2.5 w-2.5" />
                          </button>
                        )}
                        {s.phone && (
                          <button onClick={() => copy(s.phone, "Phone")} className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <Phone className="h-3 w-3" /> <Copy className="h-2.5 w-2.5" />
                          </button>
                        )}
                        {s.whatsapp && (
                          <a href={`https://wa.me/${s.whatsapp.replace(/[^0-9]/g, "")}`} target="_blank" rel="noreferrer"
                            className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <MessageCircle className="h-3 w-3" />
                          </a>
                        )}
                        {s.website && (
                          <a href={s.website.startsWith("http") ? s.website : `https://${s.website}`} target="_blank" rel="noreferrer"
                            className="text-xs inline-flex items-center gap-1 text-muted-foreground hover:text-foreground">
                            <Globe className="h-3 w-3" />
                          </a>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-xs">
                      {s.rating ? "★".repeat(s.rating) + "☆".repeat(5 - s.rating) : <span className="text-muted-foreground/60">—</span>}
                    </td>
                    <td className="px-3 py-3">
                      <span className={`text-[10px] uppercase tracking-[0.2em] px-2 py-0.5 rounded border ${
                        s.status === "active" ? "border-green-500/40 text-green-300"
                        : s.status === "pending" ? "border-yellow-500/40 text-yellow-300"
                        : "border-muted-foreground/30 text-muted-foreground"
                      }`}>{s.status}</span>
                    </td>
                    <td className="px-3 py-3 text-xs text-muted-foreground">{fmtDate(s.last_contacted_at)}</td>
                    <td className="px-3 py-3 text-right whitespace-nowrap space-x-2">
                      <button onClick={() => logContact(s)} title="Log contact" className="text-muted-foreground hover:text-primary">
                        <Clock className="h-3.5 w-3.5 inline" />
                      </button>
                      <button onClick={() => openEdit(s)} className="text-muted-foreground hover:text-foreground"><Pencil className="h-3.5 w-3.5 inline" /></button>
                      <button onClick={() => del(s.id)} className="text-muted-foreground hover:text-destructive"><Trash2 className="h-3.5 w-3.5 inline" /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit modal */}
      {showEdit && (
        <div className="fixed inset-0 z-50 flex items-start md:items-center justify-center bg-black/70 p-4 overflow-y-auto">
          <div className="bg-surface-deep border border-border/60 w-full max-w-2xl my-8">
            <div className="flex items-center justify-between p-5 border-b border-border/40">
              <div>
                <p className="eyebrow">Supplier</p>
                <h2 className="font-serif text-2xl mt-1">{editing.id ? "Edit supplier" : "New supplier"}</h2>
              </div>
              <button onClick={() => setShowEdit(false)} className="text-muted-foreground hover:text-foreground">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-5 grid md:grid-cols-2 gap-3">
              <label className="md:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Company name *</span>
                <input value={editing.company_name || ""} onChange={(e) => setEditing({ ...editing, company_name: e.target.value })} className="input-luxury text-sm w-full mt-1" />
              </label>
              <label>
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Category</span>
                <select value={editing.category || "other"} onChange={(e) => setEditing({ ...editing, category: e.target.value as Category })} className="input-luxury text-sm w-full mt-1 capitalize">
                  {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </label>
              <label>
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Status</span>
                <select value={editing.status || "active"} onChange={(e) => setEditing({ ...editing, status: e.target.value as Status })} className="input-luxury text-sm w-full mt-1 capitalize">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </label>
              <label>
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Country</span>
                <input value={editing.country || ""} onChange={(e) => setEditing({ ...editing, country: e.target.value })} className="input-luxury text-sm w-full mt-1" />
              </label>
              <label>
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">City</span>
                <input value={editing.city || ""} onChange={(e) => setEditing({ ...editing, city: e.target.value })} className="input-luxury text-sm w-full mt-1" />
              </label>
              <label>
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Contact name</span>
                <input value={editing.contact_name || ""} onChange={(e) => setEditing({ ...editing, contact_name: e.target.value })} className="input-luxury text-sm w-full mt-1" />
              </label>
              <label>
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Email</span>
                <input type="email" value={editing.email || ""} onChange={(e) => setEditing({ ...editing, email: e.target.value })} className="input-luxury text-sm w-full mt-1" />
              </label>
              <label>
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Phone</span>
                <input value={editing.phone || ""} onChange={(e) => setEditing({ ...editing, phone: e.target.value })} className="input-luxury text-sm w-full mt-1" />
              </label>
              <label>
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">WhatsApp</span>
                <input value={editing.whatsapp || ""} onChange={(e) => setEditing({ ...editing, whatsapp: e.target.value })} placeholder="Defaults to phone" className="input-luxury text-sm w-full mt-1" />
              </label>
              <label className="md:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Website</span>
                <input value={editing.website || ""} onChange={(e) => setEditing({ ...editing, website: e.target.value })} className="input-luxury text-sm w-full mt-1" />
              </label>
              <label className="md:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Services offered (comma-separated)</span>
                <input value={servicesInput} onChange={(e) => setServicesInput(e.target.value)} className="input-luxury text-sm w-full mt-1" placeholder="Airport transfers, VIP chauffeur, Armoured vehicles" />
              </label>
              <label>
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Rating</span>
                <select value={editing.rating ?? ""} onChange={(e) => setEditing({ ...editing, rating: e.target.value ? Number(e.target.value) : null })} className="input-luxury text-sm w-full mt-1">
                  <option value="">Unrated</option>
                  {[1, 2, 3, 4, 5].map((n) => <option key={n} value={n}>{n}★</option>)}
                </select>
              </label>
              <label className="flex items-end gap-2 pb-2">
                <input type="checkbox" checked={!!editing.preferred} onChange={(e) => setEditing({ ...editing, preferred: e.target.checked })} />
                <span className="text-xs text-muted-foreground">Preferred partner (pinned to top)</span>
              </label>
              <label className="md:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Rate notes</span>
                <textarea value={editing.rate_notes || ""} onChange={(e) => setEditing({ ...editing, rate_notes: e.target.value })} rows={2} className="input-luxury text-sm w-full mt-1" />
              </label>
              <label className="md:col-span-2">
                <span className="text-[10px] uppercase tracking-[0.24em] text-muted-foreground">Notes</span>
                <textarea value={editing.notes || ""} onChange={(e) => setEditing({ ...editing, notes: e.target.value })} rows={3} className="input-luxury text-sm w-full mt-1" />
              </label>
            </div>
            <div className="p-5 border-t border-border/40 flex justify-end gap-2">
              <button onClick={() => setShowEdit(false)} className="btn-ghost text-xs">Cancel</button>
              <button onClick={save} className="btn-luxury text-xs">{editing.id ? "Save changes" : "Add supplier"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDirectory;
