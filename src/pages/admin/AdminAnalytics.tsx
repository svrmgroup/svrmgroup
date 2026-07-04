import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { subDays, format } from "date-fns";

type Range = 7 | 30 | 90;

const AdminAnalytics = () => {
  const [range, setRange] = useState<Range>(30);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    enquiries: 0,
    rentalReqs: 0,
    manualBookings: 0,
    revenueBooked: 0,
    whatsAppClicks: 0,
    leadsTotal: 0,
    leadsSigned: 0,
    leadsContacted: 0,
  });
  const [byDayWA, setByDayWA] = useState<Array<{ day: string; count: number }>>([]);
  const [topPaths, setTopPaths] = useState<Array<{ path: string; count: number }>>([]);
  const [topSources, setTopSources] = useState<Array<{ source: string; count: number }>>([]);

  useEffect(() => { load(); }, [range]);

  const load = async () => {
    setLoading(true);
    const since = subDays(new Date(), range).toISOString();

    const [enq, rent, book, wa, leads] = await Promise.all([
      supabase.from("enquiries").select("id", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("rental_requests").select("id", { count: "exact", head: true }).gte("created_at", since),
      supabase.from("manual_bookings").select("subtotal,created_at").gte("created_at", since),
      supabase.from("whatsapp_clicks").select("path,source_label,created_at").gte("created_at", since),
      supabase.from("b2b_leads").select("status,created_at"),
    ]);

    const revenueBooked = (book.data || []).reduce((s, b: any) => s + Number(b.subtotal || 0), 0);

    // WhatsApp by day
    const dayMap: Record<string, number> = {};
    for (let i = range - 1; i >= 0; i--) {
      dayMap[format(subDays(new Date(), i), "MMM d")] = 0;
    }
    const pathMap: Record<string, number> = {};
    const sourceMap: Record<string, number> = {};
    for (const c of (wa.data || []) as any[]) {
      const day = format(new Date(c.created_at), "MMM d");
      if (day in dayMap) dayMap[day]++;
      pathMap[c.path || "/"] = (pathMap[c.path || "/"] || 0) + 1;
      const src = c.source_label || "unlabelled";
      sourceMap[src] = (sourceMap[src] || 0) + 1;
    }

    setStats({
      enquiries: enq.count || 0,
      rentalReqs: rent.count || 0,
      manualBookings: (book.data || []).length,
      revenueBooked,
      whatsAppClicks: (wa.data || []).length,
      leadsTotal: (leads.data || []).length,
      leadsSigned: (leads.data || []).filter((l: any) => l.status === "signed").length,
      leadsContacted: (leads.data || []).filter((l: any) => l.status === "contacted").length,
    });
    setByDayWA(Object.entries(dayMap).map(([day, count]) => ({ day, count })));
    setTopPaths(Object.entries(pathMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([path, count]) => ({ path, count })));
    setTopSources(Object.entries(sourceMap).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([source, count]) => ({ source, count })));
    setLoading(false);
  };

  const maxWA = Math.max(1, ...byDayWA.map((d) => d.count));
  const maxPath = Math.max(1, ...topPaths.map((p) => p.count));
  const maxSource = Math.max(1, ...topSources.map((s) => s.count));

  return (
    <div>
      <div className="flex items-baseline justify-between mb-8 flex-wrap gap-3">
        <div>
          <p className="eyebrow">Overview</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-2">Analytics</h1>
        </div>
        <div className="flex gap-2">
          {([7, 30, 90] as Range[]).map((r) => (
            <button key={r} onClick={() => setRange(r)}
              className={`px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] border ${range === r ? "border-primary bg-primary/10 text-gold" : "border-border/40 text-muted-foreground hover:text-foreground"}`}>
              Last {r}d
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <p className="text-sm text-muted-foreground">Loading…</p>
      ) : (
        <>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
            <Stat label="Enquiries" value={stats.enquiries} />
            <Stat label="Rental requests" value={stats.rentalReqs} />
            <Stat label="Manual bookings" value={stats.manualBookings} />
            <Stat label="Revenue booked" value={`ZAR ${stats.revenueBooked.toLocaleString()}`} />
            <Stat label="WhatsApp clicks" value={stats.whatsAppClicks} />
            <Stat label="Leads (total)" value={stats.leadsTotal} />
            <Stat label="Leads contacted" value={stats.leadsContacted} />
            <Stat label="Leads signed" value={stats.leadsSigned} />
          </div>

          <Section title="WhatsApp clicks per day">
            <div className="flex items-end gap-1 h-40">
              {byDayWA.map((d) => (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-1 group">
                  <div className="w-full bg-primary/60 hover:bg-primary transition-colors relative" style={{ height: `${(d.count / maxWA) * 100}%`, minHeight: d.count > 0 ? "2px" : "0" }}>
                    <span className="absolute -top-5 left-1/2 -translate-x-1/2 text-[9px] text-gold opacity-0 group-hover:opacity-100 whitespace-nowrap">{d.count}</span>
                  </div>
                  <span className="text-[8px] text-muted-foreground rotate-45 origin-left mt-2 whitespace-nowrap">{d.day}</span>
                </div>
              ))}
            </div>
          </Section>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Section title="Top pages (WhatsApp)">
              {topPaths.length === 0 ? <p className="text-xs text-muted-foreground">No clicks yet.</p> : topPaths.map((p) => (
                <div key={p.path} className="flex items-center gap-3 text-xs mb-2">
                  <span className="w-40 truncate text-muted-foreground">{p.path}</span>
                  <div className="flex-1 h-2 bg-border/30 relative">
                    <div className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${(p.count / maxPath) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right text-gold">{p.count}</span>
                </div>
              ))}
            </Section>
            <Section title="Top sources (WhatsApp)">
              {topSources.length === 0 ? <p className="text-xs text-muted-foreground">No clicks yet.</p> : topSources.map((s) => (
                <div key={s.source} className="flex items-center gap-3 text-xs mb-2">
                  <span className="w-40 truncate text-muted-foreground">{s.source}</span>
                  <div className="flex-1 h-2 bg-border/30 relative">
                    <div className="absolute inset-y-0 left-0 bg-gold" style={{ width: `${(s.count / maxSource) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right text-gold">{s.count}</span>
                </div>
              ))}
            </Section>
          </div>
        </>
      )}
    </div>
  );
};

const Stat = ({ label, value }: { label: string; value: string | number }) => (
  <div className="border border-border/40 bg-surface-raised p-4">
    <p className="text-[9px] uppercase tracking-[0.24em] text-muted-foreground">{label}</p>
    <p className="font-serif text-2xl mt-2 text-foreground">{value}</p>
  </div>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
  <div className="border border-border/40 bg-surface-raised p-5 mb-4">
    <p className="eyebrow mb-4">{title}</p>
    {children}
  </div>
);

export default AdminAnalytics;
