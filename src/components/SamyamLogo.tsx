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
  sm: "-top-3 px-1 py-0.5 text-[8px]",
  md: "-top-3.5 px-1.5 py-0.5 text-[9px] sm:text-[10px]",
  lg: "-top-4 px-2 py-0.5 text-xs",
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

      {/* Typography: Samyam with "AI" pill badge directly superscript OVER the letter "m" */}
      {showText && (
        <div className="relative inline-flex items-center font-sans tracking-tight text-foreground leading-none pt-2">
          <span className={`${textSizes[size]} font-extrabold tracking-tight text-foreground inline-flex items-baseline`}>
            Samya
            <span className="relative inline-block">
              m
              <span
                className={`absolute ${badgeTopOffsets[size]} left-1/2 -translate-x-1/2 rounded-md bg-foreground text-background font-mono font-black tracking-wider uppercase shadow-sm select-none shrink-0 pointer-events-none`}
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
