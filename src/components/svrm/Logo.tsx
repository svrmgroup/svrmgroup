import logoAsset from "@/assets/svrm-logo.png.asset.json";

interface Props {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizes = {
  sm: "h-10 w-10",
  md: "h-12 w-12",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
};

const Logo = ({ size = "md", className = "" }: Props) => (
  <img
    src={logoAsset.url}
    alt="SVRM Group"
    width={512}
    height={512}
    className={`${sizes[size]} rounded-full object-cover ${className}`}
  />
);

export default Logo;
