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
  md: "text-2xl sm:text-[26px]",
  lg: "text-3xl sm:text-4xl",
};

export const SamyamLogo = ({ className = "", showText = true, size = "md" }: Props) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Emblem Container */}
      <div className={`relative ${sizeClasses[size]} shrink-0 rounded-full bg-white p-0.5 shadow-md border border-border/50 group-hover:scale-105 transition-transform duration-300`}>
        <img
          src={samyamLogoImg}
          alt="Samyam Logo"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Typography: Only "Samyam" in clean medium weight geometric sans */}
      {showText && (
        <span className={`${textSizes[size]} font-medium tracking-wide text-foreground/90 font-['Plus_Jakarta_Sans','Space_Grotesk',sans-serif] leading-none`}>
          Samyam
        </span>
      )}
    </Link>
  );
};

export default SamyamLogo;
