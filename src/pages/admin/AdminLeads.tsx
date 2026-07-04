import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Search, Mail, Phone, Globe, MapPin, Copy, Download, Trash2, Loader2 } from "lucide-react";

type LeadStatus = "new" | "contacted" | "responded" | "signed" | "dead";

interface Lead {
  id: string;
  name: string;
  category: string | null;
  address: string | null;
  phone: string | null;
  website: string | null;
  emails: string[];
  place_id: string | null;
  rating: number | null;
  status: LeadStatus;
  notes: string | null;
  search_query: string | null;
  created_at: string;
}

interface SearchResult {
  place_id: string;
  name: string;
  address: string;
  phone: string | null;
  website: string | null;
  rating: number | null;
  review_count: number;
  category: string | null;
  lat: number | null;
  lng: number | null;
}

const STATUS_META: Record<LeadStatus, { label: string; className: string }> = {
  new: { label: "New", className: "bg-muted/20 text-muted-foreground border-border/40" },
  contacted: { label: "Contacted", className: "bg-blue-500/10 text-blue-300 border-blue-500/30" },
  responded: { label: "Responded", className: "bg-yellow-500/10 text-yellow-300 border-yellow-500/30" },
  signed: { label: "Signed", className: "bg-green-500/10 text-green-300 border-green-500/30" },
  dead: { label: "Dead", className: "bg-destructive/10 text-destructive border-destructive/30" },
};

const AdminLeads = () => {
  const [query, setQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [leads, setLeads] = useState<Lead[]>([]);
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "all">("all");
  const [scraping, setScraping] = useState<string | null>(null);

  const load = async () => {
    const { data } = await supabase.from("b2b_leads").select("*").order("created_at", { ascending: false });
    setLeads((data as any) || []);
  };
  useEffect(() => { load(); }, []);

  const savedPlaceIds = new Set(leads.map((l) => l.place_id).filter(Boolean));

  const search = async () => {
    if (!query.trim()) return toast.error("Enter a search query");
    setSearching(true);
    setResults([]);
    const { data, error } = await supabase.functions.invoke("find-businesses", {
      body: { query: query.trim() },
    });
    setSearching(false);
    if (error) return toast.error(error.message);
    if (data?.error) return toast.error(data.error);
    setResults(data?.results || []);
    if ((data?.results || []).length === 0) toast.info("No businesses found");
  };

  const saveLead = async (r: SearchResult) => {
    const { data: userData } = await supabase.auth.getUser();
    const { error } = await supabase.from("b2b_leads").insert({
      name: r.name,
      category: r.category,
      address: r.address,
      phone: r.phone,
      website: r.website,
      place_id: r.place_id,
      rating: r.rating,
      lat: r.lat,
      lng: r.lng,
      search_query: query,
      created_by: userData.user?.id,
    });
    if (error) return toast.error(error.message);
    toast.success(`${r.name} saved`);
    load();
  };

  const scrapeEmails = async (lead: Lead) => {
    if (!lead.website) return toast.error("No website to scrape");
    setScraping(lead.id);
    const { data, error } = await supabase.functions.invoke("scrape-business-emails", {
      body: { website: lead.website },
    });
    setScraping(null);
    if (error) return toast.error(error.message);
    if (data?.error) return toast.error(data.error);
    const emails: string[] = data?.emails || [];
    if (emails.length === 0) return toast.info("No emails found on site");
    await supabase.from("b2b_leads").update({ emails }).eq("id", lead.id);
    toast.success(`Found ${emails.length} email(s)`);
    load();
  };

  const updateLead = async (id: string, patch: Partial<Lead>) => {
    const { error } = await supabase.from("b2b_leads").update(patch as any).eq("id", id);
    if (error) return toast.error(error.message);
    setLeads((r) => r.map((x) => (x.id === id ? { ...x, ...patch } : x)));
  };

  const removeLead = async (id: string) => {
    if (!confirm("Delete this lead?")) return;
    const { error } = await supabase.from("b2b_leads").delete().eq("id", id);
    if (error) return toast.error(error.message);
    setLeads((r) => r.filter((x) => x.id !== id));
  };

  const exportCsv = () => {
    const filtered = statusFilter === "all" ? leads : leads.filter((l) => l.status === statusFilter);
    const headers = ["Name", "Category", "Address", "Phone", "Website", "Emails", "Rating", "Status", "Notes"];
    const rows = filtered.map((l) => [
      l.name, l.category || "", l.address || "", l.phone || "",
      l.website || "", (l.emails || []).join("; "), l.rating || "",
      l.status, (l.notes || "").replace(/\n/g, " "),
    ]);
    const csv = [headers, ...rows].map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `svrm-leads-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const filtered = statusFilter === "all" ? leads : leads.filter((l) => l.status === statusFilter);

  return (
    <div>
      <div className="mb-8">
        <p className="eyebrow">Business development</p>
        <h1 className="font-serif text-3xl md:text-4xl mt-2">B2B lead finder</h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-2xl">
          Search for businesses by keyword (e.g. "wedding planners Cape Town", "boutique hotels Camps Bay"). Save promising ones as leads, then scrape their websites for contact emails.
        </p>
      </div>

      {/* Search */}
      <div className="border border-border/40 bg-surface-raised p-5 mb-8">
        <div className="flex gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && search()}
            placeholder="e.g. luxury wedding planners Cape Town"
            className="flex-1 bg-background border border-border/60 px-4 py-3 text-sm focus:border-primary focus:outline-none"
          />
          <button onClick={search} disabled={searching}
            className="px-6 py-3 bg-primary text-primary-foreground text-xs uppercase tracking-[0.24em] hover:bg-primary-glow transition-colors disabled:opacity-60 flex items-center gap-2">
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            Search
          </button>
        </div>

        {results.length > 0 && (
          <div className="mt-5 space-y-2 max-h-[500px] overflow-y-auto">
            {results.map((r) => {
              const saved = savedPlaceIds.has(r.place_id);
              return (
                <div key={r.place_id} className="border border-border/30 p-4 flex items-start gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-base">{r.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{r.category} · {r.address}</p>
                    <div className="flex flex-wrap gap-3 mt-2 text-xs text-muted-foreground">
                      {r.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" /> {r.phone}</span>}
                      {r.website && <a href={r.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-gold hover:underline"><Globe className="h-3 w-3" /> Site</a>}
                      {r.rating && <span>★ {r.rating} ({r.review_count})</span>}
                    </div>
                  </div>
                  <button
                    disabled={saved}
                    onClick={() => saveLead(r)}
                    className="text-xs px-3 py-2 border border-primary/60 text-gold hover:bg-primary hover:text-primary-foreground transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    {saved ? "Saved" : "Save lead"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Saved leads */}
      <div className="flex items-baseline justify-between mb-4 flex-wrap gap-3">
        <div className="flex gap-2 flex-wrap">
          {(["all", ...Object.keys(STATUS_META)] as (LeadStatus | "all")[]).map((s) => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${statusFilter === s ? "border-primary bg-primary/10 text-gold" : "border-border/40 text-muted-foreground hover:text-foreground"}`}>
              {s === "all" ? `All (${leads.length})` : STATUS_META[s].label}
            </button>
          ))}
        </div>
        <button onClick={exportCsv} disabled={filtered.length === 0}
          className="flex items-center gap-2 text-xs text-gold hover:underline disabled:opacity-40">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="border border-border/40 p-12 text-center text-sm text-muted-foreground">No leads saved yet.</div>
      ) : (
        <div className="space-y-2">
          {filtered.map((l) => {
            const meta = STATUS_META[l.status];
            return (
              <div key={l.id} className="border border-border/40 bg-surface-raised p-5">
                <div className="flex items-start gap-4 flex-wrap">
                  <span className={`px-2.5 py-1 text-[9px] uppercase tracking-[0.2em] border ${meta.className}`}>{meta.label}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-serif text-lg">{l.name}</p>
                    <p className="text-xs text-muted-foreground">{l.category} · {l.address}</p>
                  </div>
                  <select value={l.status} onChange={(e) => updateLead(l.id, { status: e.target.value as LeadStatus })}
                    className="bg-background border border-border/60 px-2 py-1 text-xs focus:border-primary focus:outline-none">
                    {(Object.keys(STATUS_META) as LeadStatus[]).map((s) => <option key={s} value={s}>{STATUS_META[s].label}</option>)}
                  </select>
                </div>

                <div className="mt-4 flex flex-wrap gap-4 text-xs">
                  {l.phone && <span className="flex items-center gap-1.5 text-muted-foreground"><Phone className="h-3 w-3" /> {l.phone}</span>}
                  {l.website && <a href={l.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-gold hover:underline"><Globe className="h-3 w-3" /> {new URL(l.website).hostname}</a>}
                  {l.address && <span className="flex items-center gap-1.5 text-muted-foreground"><MapPin className="h-3 w-3" /> {l.address.slice(0, 40)}</span>}
                </div>

                <div className="mt-3">
                  {l.emails?.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {l.emails.map((e) => (
                        <span key={e} className="inline-flex items-center gap-1.5 text-xs bg-primary/10 border border-primary/30 px-2 py-1">
                          <Mail className="h-3 w-3 text-gold" /> {e}
                          <button onClick={() => { navigator.clipboard.writeText(e); toast.success("Copied"); }} className="ml-1 text-muted-foreground hover:text-gold">
                            <Copy className="h-2.5 w-2.5" />
                          </button>
                        </span>
                      ))}
                    </div>
                  ) : (
                    l.website && (
                      <button onClick={() => scrapeEmails(l)} disabled={scraping === l.id}
                        className="text-xs px-3 py-1.5 border border-border/60 hover:border-primary hover:text-gold transition-colors flex items-center gap-1.5 disabled:opacity-60">
                        {scraping === l.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Mail className="h-3 w-3" />}
                        {scraping === l.id ? "Scraping…" : "Scrape emails from site"}
                      </button>
                    )
                  )}
                </div>

                <textarea
                  defaultValue={l.notes || ""}
                  onBlur={(e) => e.target.value !== (l.notes || "") && updateLead(l.id, { notes: e.target.value || null })}
                  placeholder="Notes (last contact, next steps…)"
                  rows={2}
                  className="mt-3 w-full bg-background border border-border/60 px-3 py-2 text-xs focus:border-primary focus:outline-none"
                />

                <div className="mt-2 flex justify-between items-center">
                  {l.emails?.length > 0 && l.website && (
                    <button onClick={() => scrapeEmails(l)} disabled={scraping === l.id} className="text-[10px] text-muted-foreground hover:text-gold underline">
                      Re-scrape emails
                    </button>
                  )}
                  <button onClick={() => removeLead(l.id)} className="ml-auto flex items-center gap-1.5 text-xs text-destructive hover:underline">
                    <Trash2 className="h-3 w-3" /> Delete
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

export default AdminLeads;
