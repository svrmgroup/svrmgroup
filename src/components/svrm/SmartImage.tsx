import { ImgHTMLAttributes, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { resolveImageSource } from "@/lib/imageSources";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /** Wrapper className (applied to the shimmer container). */
  wrapperClassName?: string;
  /** Mark the LCP image so it loads with high priority. */
  priority?: boolean;
  /** Shown when `src` fails to load (e.g. an unavailable CDN pointer). */
  fallbackSrc?: string;
  /** Keep the original master for explicit expanded viewing. */
  original?: boolean;
};

/**
 * Image with a shimmer skeleton while loading and a soft fade-in on load.
 * Drop-in replacement for `<img>` — keep the same className for object-fit etc.
 *
 * Resilience: if the source fails we swap to `fallbackSrc` (when given) and
 * always stop the shimmer, so a broken image never leaves a permanently
 * animating placeholder on the page.
 */
const SmartImage = ({
  src,
  alt,
  className,
  wrapperClassName,
  priority = false,
  fallbackSrc,
  original = false,
  loading,
  fetchPriority,
  decoding,
  sizes = "100vw",
  srcSet,
  onLoad,
  onError,
  ...rest
}: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);
  const wrapperRef = useRef<HTMLSpanElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [nearViewport, setNearViewport] = useState(priority || loading === "eager");

  useEffect(() => {
    if (priority || loading === "eager") { setNearViewport(true); return; }
    const element = wrapperRef.current;
    if (!element) return;
    if (typeof IntersectionObserver === "undefined") { setNearViewport(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setNearViewport(true); observer.disconnect(); }
    }, { rootMargin: "250px" });
    observer.observe(element);
    return () => observer.disconnect();
  }, [priority, loading]);

  // Reset state when the source changes (carousels reuse the same node).
  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setFailed(false);
  }, [src]);

  useEffect(() => {
    const image = imageRef.current;
    if (image?.complete && image.naturalWidth > 0) setLoaded(true);
  }, [currentSrc, nearViewport]);

  const hasSrc = typeof currentSrc === "string" && currentSrc.trim().length > 0;
  const showShimmer = !loaded && !failed;
  const display = resolveImageSource(currentSrc, original);

  return (
    <span
      ref={wrapperRef}
      className={cn(
        "relative block overflow-hidden bg-surface-raised/40",
        showShimmer &&
          "bg-[linear-gradient(110deg,hsl(var(--muted))_8%,hsl(var(--muted-foreground)/0.12)_18%,hsl(var(--muted))_33%)] bg-[length:200%_100%] animate-shimmer",
        wrapperClassName,
      )}
    >
      {hasSrc && (priority || loading === "eager" || nearViewport) && (
        <img
          {...rest}
          ref={imageRef}
          src={display.src}
          srcSet={srcSet ?? display.srcSet}
          sizes={sizes}
          alt={alt}
          loading={priority ? "eager" : loading ?? "lazy"}
          decoding={decoding ?? "async"}
          {...({ fetchpriority: priority ? "high" : fetchPriority } as Record<string, string | undefined>)}
          onLoad={(e) => {
            setLoaded(true);
            onLoad?.(e);
          }}
          onError={(e) => {
            if (fallbackSrc && currentSrc !== fallbackSrc) {
              setCurrentSrc(fallbackSrc);
              return;
            }
            setFailed(true);
            onError?.(e);
          }}
          className={cn(
            "transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0",
            className,
          )}
        />
      )}
    </span>
  );
};

export default SmartImage;
