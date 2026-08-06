import samyamLogoImg from "@/assets/samyam-logo.jpg";
import { Link } from "react-router-dom";

interface Props {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-11 w-11",
  lg: "h-14 w-14",
};

const textSizes = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-4xl",
};

export const SamyamLogo = ({ className = "", showText = true, size = "md" }: Props) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Emblem Container */}
      <div className={`relative ${sizeClasses[size]} shrink-0 rounded-full bg-white p-0.5 shadow-md border border-border/50 group-hover:scale-105 transition-transform duration-300`}>
        <img
          src={samyamLogoImg}
          alt="samyam AI Logo"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Typography: Scale AI Style (lowercase "samyam" + uppercase "AI" in bold geometric sans) */}
      {showText && (
        <div className="inline-flex items-baseline gap-2 font-['Plus_Jakarta_Sans','Space_Grotesk',sans-serif] tracking-tight leading-none">
          <span className={`${textSizes[size]} font-bold tracking-tight text-foreground`}>
            Samyam
          </span>
          <span className={`${textSizes[size]} font-bold tracking-tight text-foreground uppercase`}>
            AI
          </span>
        </div>
      )}
    </Link>
  );
};

export default SamyamLogo;
