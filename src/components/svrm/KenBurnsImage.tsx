import { useState } from "react";

interface Props {
  src: string;
  alt: string;
  className?: string;
  direction?: 0 | 1 | 2 | 3;
}

// Slow Ken Burns motion via CSS keyframes defined in index.css.
// Shows a shimmer skeleton until the image decodes, then fades it in.
const KenBurnsImage = ({ src, alt, className = "", direction = 0 }: Props) => {
  const animClass = ["kb-a", "kb-b", "kb-c", "kb-d"][direction];
  const [loaded, setLoaded] = useState(false);
  return (
    <div className={`relative overflow-hidden ${className}`}>
      {!loaded && (
        <div className="absolute inset-0 bg-[linear-gradient(110deg,hsl(var(--muted))_8%,hsl(var(--muted-foreground)/0.12)_18%,hsl(var(--muted))_33%)] bg-[length:200%_100%] animate-shimmer" />
      )}
      <img
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        onLoad={() => setLoaded(true)}
        className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${loaded ? "opacity-100" : "opacity-0"} ${animClass}`}
      />
    </div>
  );
};

export default KenBurnsImage;
