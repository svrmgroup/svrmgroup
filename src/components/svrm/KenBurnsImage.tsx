import SmartImage from "./SmartImage";

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
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <SmartImage
        src={src}
        alt={alt}
        loading="lazy"
        decoding="async"
        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
        wrapperClassName="absolute inset-0 w-full h-full"
        className={`absolute inset-0 w-full h-full object-cover ${animClass}`}
      />
    </div>
  );
};

export default KenBurnsImage;
