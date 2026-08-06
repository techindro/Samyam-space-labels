import samyamLogoImg from "@/assets/samyam-logo.jpg";
import { Link } from "react-router-dom";

interface Props {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-7 w-7",
  md: "h-9 w-9",
  lg: "h-12 w-12",
};

const textSizes = {
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
};

export const SamyamLogo = ({ className = "", showText = true, size = "md" }: Props) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-2.5 group select-none ${className}`}>
      {/* Emblem Image Container */}
      <div className={`relative ${sizeClasses[size]} shrink-0 rounded-full overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300`}>
        <img
          src={samyamLogoImg}
          alt="Samyam.ai Logo"
          className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
        />
      </div>

      {/* Typography: samyam.ai */}
      {showText && (
        <div className="flex items-baseline font-sans font-bold tracking-tight text-foreground leading-none">
          <span className={`${textSizes[size]} font-extrabold tracking-tight`}>samyam</span>
          <span className="text-cosmic-purple text-xs font-semibold ml-0.5 font-mono">.ai</span>
        </div>
      )}
    </Link>
  );
};

export default SamyamLogo;
