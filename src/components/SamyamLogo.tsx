import samyamLogoImg from "@/assets/samyam-logo.jpg";
import { Link } from "react-router-dom";

interface Props {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-9 w-9",
  md: "h-12 w-12",
  lg: "h-16 w-16",
};

const textSizes = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-4xl",
};

const badgeTopOffsets = {
  sm: "-top-2.5 text-[9px]",
  md: "-top-3.5 text-[11px]",
  lg: "-top-4.5 text-xs",
};

export const SamyamLogo = ({ className = "", showText = true, size = "md" }: Props) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Emblem Container */}
      <div className={`relative ${sizeClasses[size]} shrink-0 rounded-full bg-white p-0.5 shadow-md border border-border/50 group-hover:scale-105 transition-transform duration-300`}>
        <img
          src={samyamLogoImg}
          alt="Samyam AI Logo"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Typography: Samyam with borderless "AI" superscript in exact same color over letter "m" */}
      {showText && (
        <div className="relative inline-flex items-center font-sans tracking-tight text-foreground leading-none pt-2">
          <span className={`${textSizes[size]} font-extrabold tracking-tight text-foreground inline-flex items-baseline`}>
            Samya
            <span className="relative inline-block">
              m
              <span
                className={`absolute ${badgeTopOffsets[size]} left-1/2 -translate-x-1/2 text-foreground font-mono font-bold tracking-wider uppercase select-none shrink-0 pointer-events-none`}
              >
                AI
              </span>
            </span>
          </span>
        </div>
      )}
    </Link>
  );
};

export default SamyamLogo;
