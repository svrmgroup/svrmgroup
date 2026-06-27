interface Props {
  src: string;
  alt: string;
  className?: string;
  direction?: 0 | 1 | 2 | 3;
}

// Slow Ken Burns motion via CSS keyframes defined in index.css.
const KenBurnsImage = ({ src, alt, className = "", direction = 0 }: Props) => {
  const animClass = ["kb-a", "kb-b", "kb-c", "kb-d"][direction];
  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        loading="lazy"
        className={`absolute inset-0 w-full h-full object-cover ${animClass}`}
      />
    </div>
  );
};

export default KenBurnsImage;
