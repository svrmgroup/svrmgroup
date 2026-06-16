import logoAsset from "@/assets/svrm-logo.png.asset.json";

interface Props {
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizes = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

const Logo = ({ size = "md", className = "" }: Props) => (
  <img
    src={logoAsset.url}
    alt="SVRM Group"
    width={256}
    height={256}
    className={`${sizes[size]} rounded-full object-cover ring-1 ring-primary/40 shadow-[0_0_20px_-4px_hsl(40_55%_60%_/_0.4)] ${className}`}
  />
);

export default Logo;
