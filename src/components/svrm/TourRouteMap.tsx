import { useEffect, useRef, useState } from "react";

// Approximate public landmark coordinates for the classic Cape Peninsula loop.
const STOPS = [
  { name: "V&A Waterfront", lat: -33.9036, lng: 18.4208 },
  { name: "Camps Bay", lat: -33.9509, lng: 18.3776 },
  { name: "Chapman's Peak Drive", lat: -34.0886, lng: 18.3586 },
  { name: "Cape Point", lat: -34.3568, lng: 18.4970 },
  { name: "Boulders Beach (penguins)", lat: -34.1975, lng: 18.4510 },
  { name: "Kalk Bay", lat: -34.1283, lng: 18.4485 },
];

declare global { interface Window { __svrmMapInit?: () => void; google?: any } }

let loader: Promise<void> | null = null;
function loadMaps(): Promise<void> {
  if (window.google?.maps?.Map) return Promise.resolve();
  if (loader) return loader;
  const env = import.meta.env as Record<string, string | undefined>;
  const key = env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_BROWSER_KEY"];
  const channel = env["VITE_LOVABLE_CONNECTOR_GOOGLE_MAPS_TRACKING_ID"] ?? "";
  if (!key) return Promise.reject(new Error("no key"));
  loader = new Promise((resolve, reject) => {
    window.__svrmMapInit = () => resolve();
    const s = document.createElement("script");
    s.src = `https://maps.googleapis.com/maps/api/js?key=${key}&loading=async&callback=__svrmMapInit&channel=${channel}&region=ZA&language=en`;
    s.async = true;
    s.onerror = () => { loader = null; reject(new Error("load failed")); };
    document.head.appendChild(s);
  });
  return loader;
}

const DARK = [
  { elementType: "geometry", stylers: [{ color: "#1b1d22" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9a9384" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#1b1d22" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1a24" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#2c2f36" }] },
  { featureType: "poi", stylers: [{ visibility: "off" }] },
  { featureType: "transit", stylers: [{ visibility: "off" }] },
];

export function TourRouteMap() {
  const el = useRef<HTMLDivElement>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    // Skip on credential-bearing dev preview hosts.
    if (location.hostname.includes("lovableproject.com")) { setFailed(true); return; }
    const io = new IntersectionObserver((entries) => {
      if (!entries[0].isIntersecting) return;
      io.disconnect();
      loadMaps().then(() => {
        if (!el.current) return;
        const g = window.google.maps;
        const map = new g.Map(el.current, {
          center: { lat: -34.1, lng: 18.43 }, zoom: 9, styles: DARK, clickableIcons: false,
          disableDefaultUI: true, zoomControl: true, gestureHandling: "cooperative",
        });
        const path = [...STOPS, STOPS[0]].map(({ lat, lng }) => ({ lat, lng }));
        new g.Polyline({ path, map, strokeColor: "#c9a96e", strokeOpacity: 0.9, strokeWeight: 3, geodesic: true });
        const bounds = new g.LatLngBounds();
        STOPS.forEach((s, i) => {
          bounds.extend(s);
          new g.Marker({ position: { lat: s.lat, lng: s.lng }, map, title: s.name,
            label: { text: String(i + 1), color: "#111", fontWeight: "600" } });
        });
        map.fitBounds(bounds, 40);
      }).catch(() => setFailed(true));
    }, { rootMargin: "200px" });
    if (el.current) io.observe(el.current);
    return () => io.disconnect();
  }, []);

  return (
    <div className="grid md:grid-cols-[1fr_240px] gap-6 items-start">
      <div className="relative h-[340px] md:h-[420px] border border-border/40 bg-surface-raised">
        <div ref={el} className="absolute inset-0" aria-label="Map of the Cape Peninsula tour route" />
        {failed && (
          <div className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground p-6 text-center">
            Map preview loads on the live website.
          </div>
        )}
      </div>
      <ol className="space-y-3 text-sm">
        {STOPS.map((s, i) => (
          <li key={s.name} className="flex gap-3">
            <span className="text-primary font-serif w-5">{i + 1}</span>
            <span className="text-foreground/90">{s.name}</span>
          </li>
        ))}
        <li className="text-xs text-muted-foreground pt-2">Route is a guide — your chauffeur adapts it to weather, traffic and your pace.</li>
      </ol>
    </div>
  );
}
