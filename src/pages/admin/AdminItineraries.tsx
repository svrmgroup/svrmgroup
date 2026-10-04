import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import {
  Plus, FilePlus2, ClipboardPaste, Link2, Search, Copy, Trash2, FileDown, ChevronUp, ChevronDown,
  GripVertical, Save, Eye, X, Loader2, RefreshCw, ArrowLeft, Sparkles,
} from "lucide-react";
import {
  type ItData, type ItDay, type ItActivity, type ItStatus, STATUSES, normalise, emptyData, emptyDay, emptyActivity,
  daysFromAi, aiParse, buildFromBooking, bookingFacts, bookingDiff, INCLUSION_PRESETS, INFO_PRESETS, uid, defaultIntro, type BookingRow,
} from "@/lib/itinerary";
import { renderItineraryBlob, downloadItineraryPdf } from "@/lib/itineraryPdf";
import { ImageStrip, inputCls } from "@/components/admin/itinerary/ItineraryImages";

interface Row {
  id: string; client_name: string; booking_code: string | null; booking_id: string | null;
  start_date: string | null; end_date: string | null; status: ItStatus; data: ItData; created_at: string; updated_at: string;
}

const statusTone: Record<ItStatus, string> = {
  draft: "border-border text-muted-foreground", sent: "border-sky-500/50 text-sky-300",
  confirmed: "border-primary text-primary", completed: "border-emerald-500/50 text-emerald-300", cancelled: "border-destructive/60 text-destructive",
};
const fmt = (iso?: string | null) => iso ? new Date(iso.length === 10 ? iso + "T00:00:00" : iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" }) : "—";
const lbl = "text-[10px] uppercase tracking-[0.22em] text-muted-foreground";

// ---------------- Booking picker ----------------
const BookingPicker = ({ open, onClose, onPick }: { open: boolean; onClose: () => void; onPick: (b: BookingRow) => void }) => {
  const [rows, setRows] = useState<BookingRow[]>([]);
  const [q, setQ] = useState("");
  useEffect(() => {
    if (!open) return;
    supabase.from("manual_bookings").select("id, booking_code, client_name, client_email, client_phone, start_date, end_date, created_at").order("created_at", { ascending: false }).limit(500)
      .then(({ data }) => setRows((data || []) as any));
  }, [open]);
  const list = rows.filter((r) => !q || [r.client_name, r.booking_code, r.client_phone, r.client_email, r.start_date, r.end_date, r.created_at?.slice(0, 10), fmt(r.start_date), fmt(r.created_at)]
    .join(" ").toLowerCase().includes(q.toLowerCase()));
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader><DialogTitle className="font-serif">Generate from booking</DialogTitle></DialogHeader>
        <div className="relative">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Name, reference, phone, email or date…" className={inputCls + " pl-9"} />
        </div>
        <div className="divide-y divide-border/40 mt-2">
          {list.map((r) => (
            <button key={r.id} onClick={() => onPick(r)} className="w-full text-left py-3 px-2 hover:bg-surface-raised flex justify-between gap-3">
              <div>
                <p className="text-sm text-foreground">{r.client_name}</p>
                <p className="text-[11px] text-muted-foreground">{r.booking_code} · {r.client_phone || r.client_email || "no contact"}</p>
              </div>
              <div className="text-right text-[11px] text-muted-foreground">
                <p>Travel {fmt(r.start_date)}</p><p>Booked {fmt(r.created_at)}</p>
              </div>
            </button>
          ))}
          {!list.length && <p className="text-sm text-muted-foreground py-8 text-center">No bookings match.</p>}
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ---------------- Main page ----------------
const AdminItineraries = () => {
  const [params, setParams] = useSearchParams();
  const editId = params.get("id");
  const bookingParam = params.get("booking");
  const [rows, setRows] = useState<Row[]>([]);
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const [picker, setPicker] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [working, setWorking] = useState<string | null>(null);
  const navigate = useNavigate();

  const load = async () => {
    setLoading(true);
    const { data } = await (supabase as any).from("itineraries").select("*").order("updated_at", { ascending: false });
    setRows(data || []); setLoading(false);
  };
  useEffect(() => { if (!editId) load(); }, [editId]);

  const create = async (data: ItData, booking?: { id: string; code: string }) => {
    const { data: row, error } = await (supabase as any).from("itineraries").insert({
      client_name: data.client.name || "", booking_code: booking?.code || data.client.ref || null, booking_id: booking?.id || null,
      start_date: data.client.arrival || null, end_date: data.client.departure || null, status: "draft", data,
    }).select().single();
    if (error) { toast.error(error.message); return; }
    setParams({ id: row.id });
  };

  const fromBooking = async (b: { id: string; booking_code: string }) => {
    setPicker(false);
    const { data: existing } = await (supabase as any).from("itineraries").select("id").eq("booking_id", b.id).order("updated_at", { ascending: false }).limit(1);
    if (existing?.[0] && confirm("This booking already has an itinerary. Open it? (Cancel to create a new one)")) { setParams({ id: existing[0].id }); return; }
    setWorking("Building itinerary from booking…");
    try { await create(await buildFromBooking(b.id), { id: b.id, code: b.booking_code }); }
    catch (e: any) { toast.error(e.message); }
    setWorking(null);
  };

  // Deep link from a booking page: /admin/itineraries?booking=<id>
  useEffect(() => {
    if (!bookingParam || editId) return;
    (async () => {
      const { data: b } = await supabase.from("manual_bookings").select("id, booking_code").eq("id", bookingParam).maybeSingle();
      setParams({}, { replace: true });
      if (b) fromBooking(b as any);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [bookingParam]);

  const duplicate = async (r: Row) => {
    const { data: row, error } = await (supabase as any).from("itineraries").insert({
      client_name: r.client_name, booking_code: r.booking_code, booking_id: r.booking_id, start_date: r.start_date, end_date: r.end_date, status: "draft", data: r.data,
    }).select().single();
    if (error) return toast.error(error.message);
    toast.success("Duplicated"); setParams({ id: row.id });
  };
  const remove = async (r: Row) => {
    if (!confirm(`Delete itinerary for ${r.client_name}?`)) return;
    await (supabase as any).from("itineraries").delete().eq("id", r.id);
    setRows((x) => x.filter((y) => y.id !== r.id));
  };

  if (editId) return <Editor id={editId} onBack={() => setParams({})} />;

  const list = rows.filter((r) => !q || `${r.client_name} ${r.booking_code} ${r.status} ${r.start_date}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <div className="space-y-8">
      <div>
        <p className="eyebrow">Operations</p>
        <h1 className="font-serif text-3xl md:text-4xl mt-1">Itinerary Maker</h1>
        <p className="text-sm text-muted-foreground mt-2">Create branded, brochure-style SVRM itineraries in minutes.</p>
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        <button onClick={() => create(emptyData())} className="card-luxury p-5 text-left hover:border-primary transition-colors">
          <FilePlus2 className="h-5 w-5 text-primary" /><p className="font-serif text-lg mt-3">Create blank itinerary</p>
          <p className="text-xs text-muted-foreground mt-1">Start from scratch, day by day.</p>
        </button>
        <button onClick={() => setPasteOpen(true)} className="card-luxury p-5 text-left hover:border-primary transition-colors">
          <ClipboardPaste className="h-5 w-5 text-primary" /><p className="font-serif text-lg mt-3">Paste itinerary</p>
          <p className="text-xs text-muted-foreground mt-1">From WhatsApp, email or notes — auto-structured.</p>
        </button>
        <button onClick={() => setPicker(true)} className="card-luxury p-5 text-left hover:border-primary transition-colors">
          <Link2 className="h-5 w-5 text-primary" /><p className="font-serif text-lg mt-3">Generate from booking</p>
          <p className="text-xs text-muted-foreground mt-1">Pull client, dates, staff and services.</p>
        </button>
      </div>

      {working && <p className="flex items-center gap-2 text-sm text-primary"><Loader2 className="h-4 w-4 animate-spin" /> {working}</p>}

      <div className="space-y-3">
        <div className="relative max-w-md">
          <Search className="h-4 w-4 absolute left-3 top-2.5 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search itineraries…" className={inputCls + " pl-9"} />
        </div>
        {loading ? <p className="text-xs text-muted-foreground">Loading…</p> : list.length === 0 ? (
          <p className="text-sm text-muted-foreground py-10 text-center card-luxury">No itineraries yet.</p>
        ) : (
          <div className="card-luxury divide-y divide-border/40">
            {list.map((r) => (
              <div key={r.id} className="p-4 flex flex-wrap items-center gap-3">
                <button onClick={() => setParams({ id: r.id })} className="flex-1 min-w-[200px] text-left">
                  <p className="text-sm text-foreground">{r.client_name || "Untitled"}</p>
                  <p className="text-[11px] text-muted-foreground">{fmt(r.start_date)} – {fmt(r.end_date)} · edited {fmt(r.updated_at)} · created {fmt(r.created_at)}</p>
                </button>
                {r.booking_code && <span className="text-[11px] text-muted-foreground">{r.booking_code}</span>}
                <span className={`text-[10px] uppercase tracking-[0.2em] border px-2 py-0.5 ${statusTone[r.status]}`}>{r.status}</span>
                <div className="flex gap-1">
                  <IconBtn title="Download PDF" onClick={() => downloadItineraryPdf(normalise(r.data))}><FileDown className="h-4 w-4" /></IconBtn>
                  <IconBtn title="Duplicate" onClick={() => duplicate(r)}><Copy className="h-4 w-4" /></IconBtn>
                  {r.booking_id && <IconBtn title="Open booking" onClick={() => navigate(`/admin/manual?open=${r.booking_id}`)}><Link2 className="h-4 w-4" /></IconBtn>}
                  <IconBtn title="Delete" onClick={() => remove(r)}><Trash2 className="h-4 w-4" /></IconBtn>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <BookingPicker open={picker} onClose={() => setPicker(false)} onPick={fromBooking} />
      <PasteDialog open={pasteOpen} onClose={() => setPasteOpen(false)} onDone={(d) => { setPasteOpen(false); create(d); }} />
    </div>
  );
};

const IconBtn = ({ children, ...p }: React.ButtonHTMLAttributes<HTMLButtonElement>) => (
  <button {...p} className="p-2 text-muted-foreground hover:text-primary transition-colors">{children}</button>
);

// ---------------- Paste ----------------
const PasteDialog = ({ open, onClose, onDone, existing }: { open: boolean; onClose: () => void; onDone: (d: ItData) => void; existing?: ItData }) => {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const run = async () => {
    setBusy(true);
    try {
      const r = await aiParse(text);
      const d = existing ? normalise(JSON.parse(JSON.stringify(existing))) : emptyData();
      const days = daysFromAi(r);
      if (!days.length) throw new Error("Couldn't find any itinerary items in that text.");
      d.days = existing ? [...d.days.filter((x) => x.activities.length || x.title), ...days] : days;
      if (!existing) {
        d.client.name = r.client_name || ""; d.client.guests = r.guests || ""; d.client.accommodation = r.accommodation || "";
        d.client.vehicle = r.vehicle || ""; d.client.destination = r.destination || "Cape Town";
        d.client.arrival = days.find((x) => x.date)?.date || ""; d.client.departure = [...days].reverse().find((x) => x.date)?.date || "";
        d.intro = defaultIntro((r.client_name || "").split(" ")[0]);
      }
      if (r.notes?.length) d.info.push({ label: "Notes", value: r.notes.join("\n") });
      setText(""); onDone(d);
    } catch (e: any) { toast.error(e.message); }
    setBusy(false);
  };
  return (
    <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
      <DialogContent className="max-w-2xl">
        <DialogHeader><DialogTitle className="font-serif">Paste itinerary</DialogTitle></DialogHeader>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={12} className={inputCls}
          placeholder="e.g. 5 October airport pickup EK778 at 18:05, take guests to Waterfront hotel. 6 October Cape Peninsula tour at 9am including Boulders Beach and Cape Point." />
        <p className="text-[11px] text-muted-foreground">We'll organise it into days, times, places, flights and notes. You can edit everything before the PDF.</p>
        <div className="flex justify-end">
          <button disabled={busy || text.trim().length < 5} onClick={run} className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 text-xs uppercase tracking-[0.2em] disabled:opacity-40">
            {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />} Generate itinerary
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

// ---------------- Editor ----------------
const Editor = ({ id, onBack }: { id: string; onBack: () => void }) => {
  const [row, setRow] = useState<Row | null>(null);
  const [d, setD] = useState<ItData | null>(null);
  const [status, setStatus] = useState<ItStatus>("draft");
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [pdfUrl, setPdfUrl] = useState<string | null>(null);
  const [rendering, setRendering] = useState(false);
  const [mobilePreview, setMobilePreview] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [diff, setDiff] = useState<ReturnType<typeof bookingDiff> | null>(null);
  const [diffSel, setDiffSel] = useState<string[]>([]);
  const [dragDay, setDragDay] = useState<number | null>(null);
  const [dragAct, setDragAct] = useState<{ d: number; a: number } | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    (supabase as any).from("itineraries").select("*").eq("id", id).maybeSingle().then(({ data }: any) => {
      if (!data) { toast.error("Itinerary not found"); onBack(); return; }
      setRow(data); setD(normalise(data.data)); setStatus(data.status);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const update = (fn: (x: ItData) => void) => setD((cur) => {
    if (!cur) return cur; const n: ItData = JSON.parse(JSON.stringify(cur)); fn(n); setDirty(true); return n;
  });

  // Live preview (debounced)
  const seq = useRef(0);
  useEffect(() => {
    if (!d) return;
    const my = ++seq.current;
    const t = setTimeout(async () => {
      setRendering(true);
      try {
        const blob = await renderItineraryBlob(d);
        if (my !== seq.current) return;
        setPdfUrl((old) => { if (old) URL.revokeObjectURL(old); return URL.createObjectURL(blob); });
      } catch (e) { console.error(e); }
      setRendering(false);
    }, 900);
    return () => clearTimeout(t);
  }, [d]);

  const save = async (silent = false) => {
    if (!d) return;
    if (!d.client.name.trim()) { toast.error("Add the client name first"); return; }
    setSaving(true);
    const first = d.client.arrival || d.days.find((x) => x.date)?.date || null;
    const last = d.client.departure || [...d.days].reverse().find((x) => x.date)?.date || null;
    const { error } = await (supabase as any).from("itineraries").update({
      client_name: d.client.name, booking_code: d.client.ref || row?.booking_code || null, start_date: first, end_date: last, status, data: d,
    }).eq("id", id);
    setSaving(false);
    if (error) return toast.error(error.message);
    setDirty(false); if (!silent) toast.success("Itinerary saved");
  };
  // Autosave a few seconds after edits stop
  useEffect(() => { if (!dirty || !d?.client.name.trim()) return; const t = setTimeout(() => save(true), 4000); return () => clearTimeout(t); }, [d, dirty, status]); // eslint-disable-line

  const refresh = async () => {
    if (!row?.booking_id || !d) return;
    try {
      const fresh = await bookingFacts(row.booking_id);
      const changes = bookingDiff(d, fresh);
      if (!changes.length) return toast.success("Already up to date with the booking");
      setDiff(changes); setDiffSel(changes.map((c) => c.key));
    } catch (e: any) { toast.error(e.message); }
  };

  if (!d || !row) return <p className="text-xs text-muted-foreground">Loading…</p>;

  const setDay = (i: number, fn: (x: ItDay) => void) => update((x) => fn(x.days[i]));
  const setAct = (i: number, j: number, fn: (x: ItActivity) => void) => update((x) => fn(x.days[i].activities[j]));
  const moveDay = (i: number, j: number) => update((x) => { if (j < 0 || j >= x.days.length) return; const [m] = x.days.splice(i, 1); x.days.splice(j, 0, m); });
  const moveAct = (di: number, i: number, dj: number, j: number) => update((x) => {
    const src = x.days[di].activities; if (!x.days[dj]) return;
    const [m] = src.splice(i, 1); const dst = x.days[dj].activities; dst.splice(Math.max(0, Math.min(j, dst.length)), 0, m);
  });
  const nextDate = (iso: string) => { if (!iso) return ""; const t = new Date(iso + "T00:00:00"); t.setDate(t.getDate() + 1); return t.toISOString().slice(0, 10); };

  const preview = (
    <div className="relative h-full bg-surface-deep border border-border/40">
      {rendering && <div className="absolute top-2 right-2 z-10 flex items-center gap-1 text-[10px] text-primary"><Loader2 className="h-3 w-3 animate-spin" /> Updating</div>}
      {pdfUrl ? <iframe title="Itinerary preview" src={pdfUrl + "#toolbar=0&view=FitH"} className="w-full h-full" /> : <p className="p-6 text-xs text-muted-foreground">Preparing preview…</p>}
    </div>
  );

  return (
    <div className="space-y-6 -mx-0 md:-mr-10">
      {/* Top bar */}
      <div className="flex flex-wrap items-center gap-3 sticky top-14 md:top-0 z-20 bg-background/95 backdrop-blur py-3 border-b border-border/40">
        <button onClick={async () => { if (dirty) await save(true); onBack(); }} className="text-muted-foreground hover:text-foreground"><ArrowLeft className="h-4 w-4" /></button>
        <h1 className="font-serif text-xl flex-1 min-w-[140px] truncate">{d.client.name || "New itinerary"}</h1>
        {row.booking_id && (
          <Link to={`/admin/manual?open=${row.booking_id}`} className="text-[11px] text-primary underline-offset-2 hover:underline">Linked booking: {row.booking_code || "open"}</Link>
        )}
        <select value={status} onChange={(e) => { setStatus(e.target.value as ItStatus); setDirty(true); }} className={inputCls + " w-32 py-1.5 capitalize"}>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        {row.booking_id && <button onClick={refresh} className="inline-flex items-center gap-1.5 border border-border/60 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] hover:border-primary"><RefreshCw className="h-3.5 w-3.5" /> Refresh from booking</button>}
        <button onClick={() => setPasteOpen(true)} className="inline-flex items-center gap-1.5 border border-border/60 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em] hover:border-primary"><ClipboardPaste className="h-3.5 w-3.5" /> Paste more</button>
        <button onClick={() => save()} className="inline-flex items-center gap-1.5 border border-primary text-primary px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]">
          {saving ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Save className="h-3.5 w-3.5" />} {dirty ? "Save" : "Saved"}
        </button>
        <button onClick={() => downloadItineraryPdf(d)} className="inline-flex items-center gap-1.5 bg-primary text-primary-foreground px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]"><FileDown className="h-3.5 w-3.5" /> Download PDF</button>
        <button onClick={() => setMobilePreview(true)} className="lg:hidden inline-flex items-center gap-1.5 border border-border/60 px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]"><Eye className="h-3.5 w-3.5" /> Preview</button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* EDITOR */}
        <div className="space-y-8 min-w-0">
          <Section title="Cover photo">
            <ImageStrip images={d.cover ? [d.cover] : []} label={d.cover ? "Change cover" : "Add cover photo"}
              onChange={(imgs) => update((x) => { x.cover = imgs.length ? imgs[imgs.length - 1] : null; })} />
            <p className="text-[11px] text-muted-foreground mt-1">Optional — without one, the classic SVRM black, cream and gold cover is used.</p>
          </Section>

          <Section title="Client information">
            <div className="grid sm:grid-cols-2 gap-3">
              {([
                ["name", "Client / lead guest *"], ["ref", "Booking reference"], ["guests", "Number of guests"], ["phone", "Phone"],
                ["email", "Email"], ["destination", "Destination"], ["arrival", "Arrival date", "date"], ["departure", "Departure date", "date"],
                ["accommodation", "Accommodation"], ["vehicle", "Vehicle"], ["chauffeur", "Chauffeur / driver"], ["concierge", "Concierge"], ["security", "Security (if applicable)"],
              ] as [keyof ItData["client"], string, string?][]).map(([k, label, type]) => (
                <label key={k} className="block"><span className={lbl}>{label}</span>
                  <input type={type || "text"} value={d.client[k]} onChange={(e) => update((x) => { x.client[k] = e.target.value; })} className={inputCls + " mt-1"} />
                </label>
              ))}
            </div>
          </Section>

          <Section title="Opening message">
            <textarea rows={5} value={d.intro} onChange={(e) => update((x) => { x.intro = e.target.value; })} className={inputCls} placeholder="Optional welcome message" />
          </Section>

          <Section title="Itinerary">
            <div className="space-y-4">
              {d.days.map((day, di) => (
                <div key={day.id} className="border border-border/50 bg-surface-deep/40"
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={() => {
                    if (dragDay !== null && dragDay !== di) moveDay(dragDay, di);
                    else if (dragAct && dragAct.d !== di) moveAct(dragAct.d, dragAct.a, di, day.activities.length);
                    setDragDay(null); setDragAct(null);
                  }}>
                  <div className="flex items-center gap-2 px-3 py-2 border-b border-border/40">
                    <span draggable onDragStart={() => setDragDay(di)} className="cursor-grab text-muted-foreground"><GripVertical className="h-4 w-4" /></span>
                    <span className="text-[10px] uppercase tracking-[0.3em] text-primary">Day {String(di + 1).padStart(2, "0")}</span>
                    <div className="flex-1" />
                    <IconBtn title="Move up" onClick={() => moveDay(di, di - 1)}><ChevronUp className="h-4 w-4" /></IconBtn>
                    <IconBtn title="Move down" onClick={() => moveDay(di, di + 1)}><ChevronDown className="h-4 w-4" /></IconBtn>
                    <IconBtn title="Duplicate day" onClick={() => update((x) => { const c = JSON.parse(JSON.stringify(x.days[di])); c.id = uid(); c.activities.forEach((a: ItActivity) => { a.id = uid(); }); x.days.splice(di + 1, 0, c); })}><Copy className="h-4 w-4" /></IconBtn>
                    <IconBtn title="Delete day" onClick={() => confirm("Delete this day?") && update((x) => { x.days.splice(di, 1); })}><Trash2 className="h-4 w-4" /></IconBtn>
                  </div>
                  <div className="p-3 space-y-3">
                    <div className="grid sm:grid-cols-[1fr_160px] gap-3">
                      <input value={day.title} onChange={(e) => setDay(di, (x) => { x.title = e.target.value; })} placeholder="Day title, e.g. Cape Peninsula Experience" className={inputCls} />
                      <input type="date" value={day.date} onChange={(e) => setDay(di, (x) => { x.date = e.target.value; })} className={inputCls} />
                    </div>
                    <ImageStrip images={day.images} label="Add day photos" onChange={(imgs) => setDay(di, (x) => { x.images = imgs; })} />
                    <textarea rows={2} value={day.notes} onChange={(e) => setDay(di, (x) => { x.notes = e.target.value; })} placeholder="Day notes (optional)" className={inputCls} />

                    {day.activities.map((a, ai) => (
                      <div key={a.id} className="border border-border/40 bg-background p-3 space-y-2"
                        onDragOver={(e) => e.preventDefault()}
                        onDrop={(e) => { e.stopPropagation(); if (dragAct) moveAct(dragAct.d, dragAct.a, di, ai); setDragAct(null); setDragDay(null); }}>
                        <div className="flex items-center gap-2">
                          <span draggable onDragStart={(e) => { e.stopPropagation(); setDragAct({ d: di, a: ai }); }} className="cursor-grab text-muted-foreground"><GripVertical className="h-4 w-4" /></span>
                          <input type="time" value={a.time} onChange={(e) => setAct(di, ai, (x) => { x.time = e.target.value; })} className={inputCls + " w-28"} />
                          <input value={a.title} onChange={(e) => setAct(di, ai, (x) => { x.title = e.target.value; })} placeholder="Activity / service" className={inputCls + " flex-1"} />
                        </div>
                        <textarea rows={2} value={a.description} onChange={(e) => setAct(di, ai, (x) => { x.description = e.target.value; })} placeholder="Description" className={inputCls} />
                        <details className="group">
                          <summary className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground cursor-pointer select-none">More details</summary>
                          <div className="grid sm:grid-cols-2 gap-2 mt-2">
                            {([["pickup", "Pick-up location"], ["dropoff", "Drop-off location"], ["venue", "Restaurant / venue"], ["accommodation", "Accommodation"],
                              ["vehicle", "Vehicle"], ["driver", "Driver / chauffeur"], ["confirmation", "Confirmation / flight / ref"], ["notes", "Notes"]] as [keyof ItActivity, string][]).map(([k, ph]) => (
                              <input key={k} value={a[k] as string} onChange={(e) => setAct(di, ai, (x) => { (x as any)[k] = e.target.value; })} placeholder={ph} className={inputCls} />
                            ))}
                          </div>
                        </details>
                        <ImageStrip images={a.images} onChange={(imgs) => setAct(di, ai, (x) => { x.images = imgs; })} />
                        <div className="flex justify-end gap-1 -mb-1">
                          <IconBtn title="Move up" onClick={() => moveAct(di, ai, di, ai - 1)}><ChevronUp className="h-4 w-4" /></IconBtn>
                          <IconBtn title="Move down" onClick={() => moveAct(di, ai, di, ai + 1)}><ChevronDown className="h-4 w-4" /></IconBtn>
                          <IconBtn title="Duplicate" onClick={() => setDay(di, (x) => { x.activities.splice(ai + 1, 0, { ...JSON.parse(JSON.stringify(a)), id: uid() }); })}><Copy className="h-4 w-4" /></IconBtn>
                          <IconBtn title="Delete" onClick={() => setDay(di, (x) => { x.activities.splice(ai, 1); })}><Trash2 className="h-4 w-4" /></IconBtn>
                        </div>
                      </div>
                    ))}
                    <button onClick={() => setDay(di, (x) => { x.activities.push(emptyActivity()); })} className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-primary"><Plus className="h-3.5 w-3.5" /> Add activity</button>
                  </div>
                </div>
              ))}
              <button onClick={() => update((x) => { const last = x.days[x.days.length - 1]; x.days.push(emptyDay({ date: nextDate(last?.date || ""), activities: [emptyActivity()] })); })}
                className="w-full border border-dashed border-primary/60 py-3 text-xs uppercase tracking-[0.24em] text-primary inline-flex items-center justify-center gap-2"><Plus className="h-4 w-4" /> Add day</button>
            </div>
          </Section>

          <Section title="Inclusions">
            <div className="flex flex-wrap gap-2">
              {INCLUSION_PRESETS.map((p) => {
                const on = d.inclusions.includes(p);
                return <button key={p} onClick={() => update((x) => { x.inclusions = on ? x.inclusions.filter((y) => y !== p) : [...x.inclusions, p]; })}
                  className={`px-3 py-1 text-xs border ${on ? "border-primary text-primary" : "border-border/60 text-muted-foreground"}`}>{p}</button>;
              })}
            </div>
            <div className="space-y-2 mt-3">
              {d.inclusions.filter((x) => !INCLUSION_PRESETS.includes(x)).map((inc) => (
                <div key={inc} className="flex gap-2 items-center text-sm"><span className="flex-1">{inc}</span>
                  <IconBtn onClick={() => update((x) => { x.inclusions = x.inclusions.filter((y) => y !== inc); })}><X className="h-3.5 w-3.5" /></IconBtn></div>
              ))}
              <input placeholder="Type a custom inclusion and press Enter" className={inputCls}
                onKeyDown={(e) => { const v = (e.target as HTMLInputElement).value.trim(); if (e.key === "Enter" && v) { update((x) => { if (!x.inclusions.includes(v)) x.inclusions.push(v); }); (e.target as HTMLInputElement).value = ""; } }} />
            </div>
          </Section>

          <Section title="Important information">
            <div className="space-y-3">
              {d.info.map((it, i) => (
                <div key={i} className="flex gap-2 items-start">
                  <div className="flex-1 space-y-1">
                    <input list="info-presets" value={it.label} onChange={(e) => update((x) => { x.info[i].label = e.target.value; })} placeholder="Heading" className={inputCls} />
                    <textarea rows={2} value={it.value} onChange={(e) => update((x) => { x.info[i].value = e.target.value; })} className={inputCls} />
                  </div>
                  <IconBtn onClick={() => update((x) => { x.info.splice(i, 1); })}><Trash2 className="h-4 w-4" /></IconBtn>
                </div>
              ))}
              <datalist id="info-presets">{INFO_PRESETS.map((p) => <option key={p} value={p} />)}</datalist>
              <button onClick={() => update((x) => { x.info.push({ label: "", value: "" }); })} className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-primary"><Plus className="h-3.5 w-3.5" /> Add information</button>
            </div>
          </Section>

          <Section title="Pricing">
            <label className="flex items-center gap-3 text-sm cursor-pointer">
              <input type="checkbox" checked={d.pricing.show} onChange={(e) => update((x) => { x.pricing.show = e.target.checked; })} className="accent-primary h-4 w-4" />
              Show pricing on itinerary
            </label>
            <p className="text-[11px] text-muted-foreground mt-1">When off, no prices appear anywhere on the PDF.</p>
            {d.pricing.show && (
              <div className="space-y-3 mt-4">
                {d.pricing.items.map((it, i) => (
                  <div key={i} className="flex gap-2">
                    <input value={it.label} onChange={(e) => update((x) => { x.pricing.items[i].label = e.target.value; })} className={inputCls + " flex-1"} placeholder="Service" />
                    <input type="number" value={it.amount} onChange={(e) => update((x) => { x.pricing.items[i].amount = Number(e.target.value); })} className={inputCls + " w-32"} />
                    <IconBtn onClick={() => update((x) => { x.pricing.items.splice(i, 1); })}><Trash2 className="h-4 w-4" /></IconBtn>
                  </div>
                ))}
                <button onClick={() => update((x) => { x.pricing.items.push({ label: "", amount: 0 }); })} className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.2em] text-primary"><Plus className="h-3.5 w-3.5" /> Add service price</button>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  <label><span className={lbl}>Currency</span>
                    <select value={d.pricing.currency} onChange={(e) => update((x) => { x.pricing.currency = e.target.value; })} className={inputCls + " mt-1"}>
                      {["ZAR", "USD", "EUR", "GBP"].map((c) => <option key={c}>{c}</option>)}
                    </select></label>
                  {(["total", "deposit", "paid", "balance"] as const).map((k) => (
                    <label key={k}><span className={lbl}>{k === "total" ? "Total package" : k === "paid" ? "Amount paid" : k}</span>
                      <input type="number" value={d.pricing[k]} onChange={(e) => update((x) => { x.pricing[k] = Number(e.target.value); })} className={inputCls + " mt-1"} /></label>
                  ))}
                  <label><span className={lbl}>Payment due</span>
                    <input type="date" value={d.pricing.dueDate} onChange={(e) => update((x) => { x.pricing.dueDate = e.target.value; })} className={inputCls + " mt-1"} /></label>
                </div>
              </div>
            )}
          </Section>
        </div>

        {/* PREVIEW (desktop) */}
        <div className="hidden lg:block">
          <div className="sticky top-20 h-[calc(100vh-7rem)]">{preview}</div>
        </div>
      </div>

      {mobilePreview && (
        <div className="lg:hidden fixed inset-0 z-50 bg-background flex flex-col">
          <div className="flex items-center justify-between p-3 border-b border-border/40">
            <span className="font-serif">Preview</span>
            <div className="flex gap-2">
              <button onClick={() => downloadItineraryPdf(d)} className="bg-primary text-primary-foreground px-3 py-1.5 text-[11px] uppercase tracking-[0.18em]">Download</button>
              <button onClick={() => setMobilePreview(false)}><X className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="flex-1">{preview}</div>
        </div>
      )}

      <PasteDialog open={pasteOpen} existing={d} onClose={() => setPasteOpen(false)} onDone={(n) => { setPasteOpen(false); setD(n); setDirty(true); toast.success("Added to itinerary — review the new days"); }} />

      <Dialog open={!!diff} onOpenChange={(o) => !o && setDiff(null)}>
        <DialogContent className="max-w-xl">
          <DialogHeader><DialogTitle className="font-serif">Changes from booking</DialogTitle></DialogHeader>
          <p className="text-xs text-muted-foreground">Choose what to import. Your day-by-day edits are never overwritten.</p>
          <div className="divide-y divide-border/40 max-h-[50vh] overflow-y-auto">
            {diff?.map((c) => (
              <label key={c.key} className="flex gap-3 py-2.5 text-sm cursor-pointer">
                <input type="checkbox" className="accent-primary mt-1" checked={diffSel.includes(c.key)} onChange={(e) => setDiffSel((s) => e.target.checked ? [...s, c.key] : s.filter((x) => x !== c.key))} />
                <div><p className="text-foreground">{c.label}</p>
                  <p className="text-[11px] text-muted-foreground"><span className="line-through">{c.from || "empty"}</span> → <span className="text-primary">{c.to}</span></p></div>
              </label>
            ))}
          </div>
          <div className="flex justify-end">
            <button onClick={() => { update((x) => diff?.filter((c) => diffSel.includes(c.key)).forEach((c) => c.apply(x))); setDiff(null); toast.success("Imported selected changes"); }}
              className="bg-primary text-primary-foreground px-5 py-2 text-xs uppercase tracking-[0.2em]">Import selected</button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <section><p className="eyebrow mb-3">{title}</p>{children}</section>
);

export default AdminItineraries;
