import { ImgHTMLAttributes, useState } from "react";
import { cn } from "@/lib/utils";

type Props = ImgHTMLAttributes<HTMLImageElement> & {
  /** Wrapper className (applied to the shimmer container). */
  wrapperClassName?: string;
  /** Mark the LCP image so it loads with high priority. */
  priority?: boolean;
};

/**
 * Image with a shimmer skeleton while loading and a soft fade-in on load.
 * Drop-in replacement for `<img>` — keep the same className for object-fit etc.
 */
const SmartImage = ({
  src,
  alt,
  className,
  wrapperClassName,
  priority = false,
  loading,
  fetchPriority,
  decoding,
  onLoad,
  ...rest
}: Props) => {
  const [loaded, setLoaded] = useState(false);

  const hasSrc = typeof src === "string" && src.trim().length > 0;

  return (
    <span
      className={cn(
        "relative block overflow-hidden bg-surface-raised/40",
        !loaded &&
          "bg-[linear-gradient(110deg,hsl(var(--muted))_8%,hsl(var(--muted-foreground)/0.12)_18%,hsl(var(--muted))_33%)] bg-[length:200%_100%] animate-shimmer",
        wrapperClassName,
      )}
    >
      {hasSrc && (
        <img
          {...rest}
          src={src}
          alt={alt}
          loading={priority ? "eager" : loading ?? "lazy"}
          decoding={decoding ?? "async"}
          fetchpriority={priority ? "high" : fetchPriority}
          onLoad={(e) => {
            setLoaded(true);
            onLoad?.(e);
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
