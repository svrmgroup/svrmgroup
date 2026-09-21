import { ImgHTMLAttributes, useEffect, useState } from "react";
import { cn } from "@/lib/utils";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /** Wrapper className (applied to the shimmer container). */
  wrapperClassName?: string;
  /** Mark the LCP image so it loads with high priority. */
  priority?: boolean;
  /** Shown when `src` fails to load (e.g. an unavailable CDN pointer). */
  fallbackSrc?: string;
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
  loading,
  fetchPriority,
  decoding,
  onLoad,
  onError,
  ...rest
}: Props) => {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);
  const [currentSrc, setCurrentSrc] = useState(src);

  // Reset state when the source changes (carousels reuse the same node).
  useEffect(() => {
    setCurrentSrc(src);
    setLoaded(false);
    setFailed(false);
  }, [src]);

  const hasSrc = typeof currentSrc === "string" && currentSrc.trim().length > 0;
  const showShimmer = !loaded && !failed;

  return (
    <span
      className={cn(
        "relative block overflow-hidden bg-surface-raised/40",
        showShimmer &&
          "bg-[linear-gradient(110deg,hsl(var(--muted))_8%,hsl(var(--muted-foreground)/0.12)_18%,hsl(var(--muted))_33%)] bg-[length:200%_100%] animate-shimmer",
        wrapperClassName,
      )}
    >
      {hasSrc && (
        <img
          {...rest}
          src={currentSrc}
          alt={alt}
          loading={priority ? "eager" : loading ?? "lazy"}
          decoding={priority ? "sync" : decoding ?? "async"}
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
