import { useEffect, useRef, useState } from "react";
import { FunctionsHttpError } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

type Suggestion = { placeId: string; text: string };

async function callMaps<T>(body: Record<string, unknown>): Promise<T> {
  const { data, error } = await supabase.functions.invoke("maps-admin", { body });
  if (error) {
    let msg = error.message;
    if (error instanceof FunctionsHttpError) {
      try { msg = (await error.context.json()).error ?? msg; } catch { /* keep */ }
    }
    throw new Error(msg);
  }
  return data as T;
}

/** Admin-only address field with Google suggestions (biased to Cape Town). Free text still allowed. */
export function AddressInput({ value, onChange, placeholder, className }: {
  value: string; onChange: (v: string) => void; placeholder?: string; className?: string;
}) {
  const [items, setItems] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);
  const token = useRef<string>(crypto.randomUUID());
  const seq = useRef(0);
  const typed = useRef(false);

  useEffect(() => {
    if (!typed.current || value.trim().length < 3) { setItems([]); return; }
    const my = ++seq.current;
    const t = setTimeout(async () => {
      try {
        const r = await callMaps<{ suggestions: Suggestion[] }>({ action: "autocomplete", input: value, sessionToken: token.current });
        if (my === seq.current) { setItems(r.suggestions); setOpen(true); }
      } catch { if (my === seq.current) setItems([]); }
    }, 350);
    return () => clearTimeout(t);
  }, [value]);

  const pick = async (s: Suggestion) => {
    typed.current = false; setOpen(false); setItems([]); onChange(s.text);
    try {
      const r = await callMaps<{ label: string }>({ action: "details", placeId: s.placeId, sessionToken: token.current });
      if (r.label) onChange(r.label);
    } catch { /* keep suggestion text */ }
    token.current = crypto.randomUUID();
  };

  return (
    <div className="relative min-w-0">
      <input value={value} placeholder={placeholder} className={className} autoComplete="off"
        onChange={(e) => { typed.current = true; onChange(e.target.value); }}
        onFocus={() => items.length && setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)} />
      {open && items.length > 0 && (
        <ul className="absolute z-50 left-0 right-0 mt-1 max-h-60 overflow-auto border border-border bg-popover text-popover-foreground shadow-lg text-sm">
          {items.map((s) => (
            <li key={s.placeId}>
              <button type="button" onMouseDown={(e) => e.preventDefault()} onClick={() => pick(s)}
                className="w-full text-left px-3 py-2 hover:bg-muted">{s.text}</button>
            </li>
          ))}
          <li className="px-3 py-1 text-[10px] text-muted-foreground text-right">Powered by Google</li>
        </ul>
      )}
    </div>
  );
}

/** Shows estimated drive time/distance between two addresses on request. */
export function DriveTime({ from, to }: { from: string; to: string }) {
  const [state, setState] = useState<{ loading?: boolean; text?: string; err?: string }>({});
  useEffect(() => setState({}), [from, to]);
  if (from.trim().length < 3 || to.trim().length < 3) return null;
  const run = async () => {
    setState({ loading: true });
    try {
      const r = await callMaps<{ distanceMeters: number; durationSeconds: number }>({ action: "route", origin: from, destination: to });
      const mins = Math.round(r.durationSeconds / 60);
      const dur = mins >= 60 ? `${Math.floor(mins / 60)} h ${mins % 60} min` : `${mins} min`;
      setState({ text: `≈ ${dur} · ${(r.distanceMeters / 1000).toFixed(1)} km by road (current traffic)` });
    } catch (e) { setState({ err: (e as Error).message }); }
  };
  return (
    <div className="sm:col-span-2 text-[11px] text-muted-foreground flex flex-wrap items-center gap-2">
      <button type="button" onClick={run} disabled={state.loading}
        className="uppercase tracking-[0.2em] text-primary disabled:opacity-50">
        {state.loading ? "Calculating…" : "Calculate drive time"}
      </button>
      {state.text && <span>{state.text}</span>}
      {state.err && <span className="text-destructive">{state.err}</span>}
    </div>
  );
}
