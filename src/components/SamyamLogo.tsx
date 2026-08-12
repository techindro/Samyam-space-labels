import samyamLogoImg from "@/assets/samyam-logo.jpg";
import { Link } from "react-router-dom";

interface Props {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-8 w-8",
  md: "h-9 w-9 md:h-11 md:w-11",
  lg: "h-12 w-12 md:h-14 md:w-14",
};

const textSizes = {
  sm: "text-lg md:text-xl",
  md: "text-xl sm:text-2xl md:text-[26px]",
  lg: "text-2xl sm:text-3xl md:text-4xl",
};

export const SamyamLogo = ({ className = "", showText = true, size = "md" }: Props) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Emblem Container */}
      <div className={`relative ${sizeClasses[size]} shrink-0 rounded-full overflow-hidden group-hover:scale-105 transition-transform duration-300`}>
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
