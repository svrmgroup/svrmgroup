interface WordmarkProps {
  size?: "sm" | "lg";
  align?: "left" | "center";
}

/**
 * SVRM brand mark: white serif letters with a thin gold line below
 * that tapers to a sharp point on the right.
 */
const Wordmark = ({ size = "sm", align = "left" }: WordmarkProps) => {
  const textClass =
    size === "lg" ? "text-3xl tracking-[0.42em]" : "text-2xl tracking-[0.4em]";
  const lineWidth = size === "lg" ? 64 : 48;
  const wrapAlign = align === "center" ? "items-center" : "items-start";

  return (
    <span className={`inline-flex flex-col ${wrapAlign} leading-none`}>
      <span className={`font-serif text-foreground ${textClass}`}>SVRM</span>
      <svg
        width={lineWidth}
        height="3"
        viewBox={`0 0 ${lineWidth} 3`}
        className="mt-1.5 block"
        aria-hidden="true"
      >
        {/* Tapered line: full height on the left, sharpens to a point on the right */}
        <polygon
          points={`0,1 ${lineWidth - 2},0 ${lineWidth},1.5 ${lineWidth - 2},3 0,2`}
          fill="hsl(var(--primary))"
        />
      </svg>
    </span>
  );
};

export default Wordmark;
