import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { MessageCircle, TrendingUp, Clock, Link2 } from "lucide-react";

type Click = {
  id: string;
  path: string | null;
  referrer: string | null;
  source_label: string | null;
  user_agent: string | null;
  created_at: string;
};

const RANGES: Record<string, number> = {
  "24h": 1,
  "7d": 7,
  "30d": 30,
  "90d": 90,
};

const AdminWhatsApp = () => {
  const [rangeKey, setRangeKey] = useState<keyof typeof RANGES>("30d");
  const [clicks, setClicks] = useState<Click[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const load = async () => {
      setLoading(true);
      setError(null);
      const since = new Date(Date.now() - RANGES[rangeKey] * 24 * 60 * 60 * 1000).toISOString();
      const { data, error } = await supabase
        .from("whatsapp_clicks")
        .select("*")
        .gte("created_at", since)
        .order("created_at", { ascending: false })
        .limit(5000);
      if (cancelled) return;
      if (error) setError(error.message);
      else setClicks((data as Click[]) || []);
      setLoading(false);
    };
    load();
    return () => {
      cancelled = true;
    };
  }, [rangeKey]);

  const total = clicks.length;

  const byDay = useMemo(() => {
    const map = new Map<string, number>();
    clicks.forEach((c) => {
      const d = new Date(c.created_at).toISOString().slice(0, 10);
      map.set(d, (map.get(d) || 0) + 1);
    });
    return Array.from(map.entries()).sort(([a], [b]) => (a < b ? 1 : -1));
  }, [clicks]);

  const byPath = useMemo(() => {
    const map = new Map<string, number>();
    clicks.forEach((c) => {
      const key = c.path || "(unknown)";
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).sort(([, a], [, b]) => b - a).slice(0, 20);
  }, [clicks]);

  const bySource = useMemo(() => {
    const map = new Map<string, number>();
    clicks.forEach((c) => {
      const key = (c.source_label || "(unlabelled)").slice(0, 60);
      map.set(key, (map.get(key) || 0) + 1);
    });
    return Array.from(map.entries()).sort(([, a], [, b]) => b - a).slice(0, 20);
  }, [clicks]);

  const maxDay = Math.max(1, ...byDay.map(([, n]) => n));
  const maxPath = Math.max(1, ...byPath.map(([, n]) => n));
  const maxSrc = Math.max(1, ...bySource.map(([, n]) => n));

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <p className="eyebrow">Analytics</p>
          <h1 className="font-serif text-3xl md:text-4xl mt-1">WhatsApp clicks</h1>
          <p className="text-muted-foreground text-sm mt-2">
            Every tap of a WhatsApp link across the site, logged in real time.
          </p>
        </div>
        <div className="flex gap-2">
          {Object.keys(RANGES).map((k) => (
            <button
              key={k}
              onClick={() => setRangeKey(k as keyof typeof RANGES)}
              className={`text-[11px] uppercase tracking-[0.24em] px-3 py-2 border transition-colors ${
                rangeKey === k
                  ? "border-primary text-foreground bg-surface-raised"
                  : "border-border/50 text-muted-foreground hover:text-foreground"
              }`}
            >
              {k}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p className="mt-6 text-sm text-destructive">Failed to load: {error}</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
        <Stat icon={<MessageCircle className="h-4 w-4" />} label="Total clicks" value={total} />
        <Stat
          icon={<TrendingUp className="h-4 w-4" />}
          label="Avg / day"
          value={byDay.length ? Math.round(total / byDay.length) : 0}
        />
        <Stat
          icon={<Clock className="h-4 w-4" />}
          label="Last click"
          value={clicks[0] ? new Date(clicks[0].created_at).toLocaleString() : "—"}
        />
      </div>

      <Section title="Clicks per day">
        {loading ? (
          <p className="text-sm text-muted-foreground">Loading…</p>
        ) : byDay.length === 0 ? (
          <Empty />
        ) : (
          <ul className="space-y-2">
            {byDay.map(([day, n]) => (
              <li key={day} className="grid grid-cols-[110px_1fr_50px] items-center gap-3">
                <span className="text-xs text-muted-foreground">{day}</span>
                <div className="h-2 bg-surface-raised rounded-sm overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${(n / maxDay) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-right tabular-nums">{n}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Top pages">
        {loading ? null : byPath.length === 0 ? (
          <Empty />
        ) : (
          <ul className="space-y-2">
            {byPath.map(([path, n]) => (
              <li key={path} className="grid grid-cols-[1fr_1fr_50px] items-center gap-3">
                <span className="text-xs text-foreground truncate" title={path}>{path}</span>
                <div className="h-2 bg-surface-raised rounded-sm overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(n / maxPath) * 100}%` }} />
                </div>
                <span className="text-xs text-right tabular-nums">{n}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Top link labels" icon={<Link2 className="h-4 w-4" />}>
        {loading ? null : bySource.length === 0 ? (
          <Empty />
        ) : (
          <ul className="space-y-2">
            {bySource.map(([label, n]) => (
              <li key={label} className="grid grid-cols-[1fr_1fr_50px] items-center gap-3">
                <span className="text-xs text-foreground truncate" title={label}>{label}</span>
                <div className="h-2 bg-surface-raised rounded-sm overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: `${(n / maxSrc) * 100}%` }} />
                </div>
                <span className="text-xs text-right tabular-nums">{n}</span>
              </li>
            ))}
          </ul>
        )}
      </Section>

      <Section title="Recent clicks">
        {loading ? null : clicks.length === 0 ? (
          <Empty />
        ) : (
          <div className="overflow-x-auto border border-border/40">
            <table className="w-full text-xs">
              <thead className="bg-surface-deep text-muted-foreground">
                <tr>
                  <th className="text-left px-3 py-2 font-normal uppercase tracking-[0.2em]">When</th>
                  <th className="text-left px-3 py-2 font-normal uppercase tracking-[0.2em]">Page</th>
                  <th className="text-left px-3 py-2 font-normal uppercase tracking-[0.2em]">Label</th>
                  <th className="text-left px-3 py-2 font-normal uppercase tracking-[0.2em]">Referrer</th>
                </tr>
              </thead>
              <tbody>
                {clicks.slice(0, 100).map((c) => (
                  <tr key={c.id} className="border-t border-border/30">
                    <td className="px-3 py-2 whitespace-nowrap text-muted-foreground">
                      {new Date(c.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">{c.path || "—"}</td>
                    <td className="px-3 py-2 max-w-[240px] truncate" title={c.source_label || ""}>
                      {c.source_label || "—"}
                    </td>
                    <td className="px-3 py-2 max-w-[240px] truncate text-muted-foreground" title={c.referrer || ""}>
                      {c.referrer || "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Section>
    </div>
  );
};

const Stat = ({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) => (
  <div className="border border-border/40 p-5 bg-surface-deep">
    <div className="flex items-center gap-2 text-muted-foreground text-[11px] uppercase tracking-[0.24em]">
      {icon} {label}
    </div>
    <p className="mt-3 font-serif text-2xl md:text-3xl text-foreground">{value}</p>
  </div>
);

const Section = ({
  title,
  icon,
  children,
}: {
  title: string;
  icon?: React.ReactNode;
  children: React.ReactNode;
}) => (
  <section className="mt-10">
    <div className="flex items-center gap-2 mb-4">
      {icon}
      <h2 className="eyebrow">{title}</h2>
    </div>
    {children}
  </section>
);

const Empty = () => (
  <p className="text-sm text-muted-foreground py-6 border border-dashed border-border/40 text-center">
    No clicks in this range yet.
  </p>
);

export default AdminWhatsApp;
