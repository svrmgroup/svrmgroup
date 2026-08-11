import { useEffect, useRef, useState } from "react";
import { resolveVideoSource } from "@/lib/videoSources";

interface Props {
  src: string;
  poster?: string;
  className?: string;
  /** Rendered while video is disabled/loading (defaults to the poster image). */
  posterClassName?: string;
}

/** Returns true when the user asked for reduced motion (live-updating). */
export const usePrefersReducedMotion = () => {
  const [reduced, setReduced] = useState(() =>
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function"
      ? window.matchMedia("(prefers-reduced-motion: reduce)").matches
      : false
  );

  useEffect(() => {
    if (typeof window === "undefined" || typeof window.matchMedia !== "function") return;
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  return reduced;
};

/** True on constrained connections / data-saver, where a heavy loop is wasteful. */
const isSaveData = () => {
  const conn = (navigator as unknown as {
    connection?: { saveData?: boolean; effectiveType?: string };
  }).connection;
  if (!conn) return false;
  if (conn.saveData) return true;
  return conn.effectiveType === "slow-2g" || conn.effectiveType === "2g";
};

/**
 * Performance-conscious looping background video:
 * - never loads bytes until it scrolls near the viewport
 * - falls back to the poster image for reduced-motion or data-saver users
 * - pauses when offscreen or when the tab is hidden (saves battery on mobile)
 * - fades in only once the first frame is decodable, so there is no flash
 */
const BackgroundVideo = ({ src, poster, className = "", posterClassName }: Props) => {
  const reduced = usePrefersReducedMotion();
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);
  const [saveData, setSaveData] = useState(false);
  // Resolved on the client so the chosen rendition matches the real device/network.
  const [resolvedSrc, setResolvedSrc] = useState(src);

  useEffect(() => {
    setSaveData(isSaveData());
  }, []);

  useEffect(() => {
    setResolvedSrc(resolveVideoSource(src));
  }, [src]);

  const enabled = !reduced && !saveData;

  // Load + play only while near/inside the viewport.
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !enabled || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
        if (entry.isIntersecting) setShouldLoad(true);
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [enabled]);

  // Pause offscreen or on hidden tabs; resume otherwise.
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !enabled) return;
    const sync = () => {
      const active = inView && !document.hidden;
      if (active) {
        const p = video.play();
        if (p && typeof p.catch === "function") p.catch(() => undefined);
      } else {
        video.pause();
      }
    };
    sync();
    document.addEventListener("visibilitychange", sync);
    return () => document.removeEventListener("visibilitychange", sync);
  }, [inView, enabled, shouldLoad]);

  return (
    <div ref={containerRef} className={`absolute inset-0 ${className}`} aria-hidden="true">
      {poster && (
        <img
          src={poster}
          alt=""
          aria-hidden="true"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            ready ? "opacity-0" : "opacity-100"
          } ${posterClassName ?? ""}`}
        />
      )}
      {enabled && shouldLoad && (
        <video
          ref={videoRef}
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
          muted
          loop
          playsInline
          autoPlay
          preload="auto"
          poster={poster}
          disablePictureInPicture
          disableRemotePlayback
          tabIndex={-1}
          aria-hidden="true"
          onLoadedData={() => setReady(true)}
          onCanPlay={() => setReady(true)}
          key={resolvedSrc}
        >
          <source src={resolvedSrc} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

export default BackgroundVideo;
