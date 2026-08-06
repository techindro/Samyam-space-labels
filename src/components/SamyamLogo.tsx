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

const badgeStyles = {
  sm: "px-1.5 py-0.5 text-[9px] -translate-y-2.5 rounded-md",
  md: "px-2 py-0.5 text-[11px] -translate-y-3.5 rounded-lg",
  lg: "px-2.5 py-0.5 text-xs -translate-y-4 rounded-lg",
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

      {/* Typography: Geometric Sans-Serif font (Plus Jakarta Sans / Space Grotesk) for Samyam + black power AI pill badge */}
      {showText && (
        <div className="relative inline-flex items-center font-['Plus_Jakarta_Sans','Space_Grotesk',sans-serif] tracking-tight text-foreground leading-none">
          <span className={`${textSizes[size]} font-extrabold tracking-tight text-foreground`}>
            Samyam
          </span>
          <span
            className={`ml-1.5 ${badgeStyles[size]} font-mono font-black tracking-wider uppercase bg-black text-white dark:bg-white dark:text-black shadow-md select-none shrink-0 pointer-events-none`}
          >
            AI
          </span>
        </div>
      )}
    </Link>
  );
};

export default SamyamLogo;
