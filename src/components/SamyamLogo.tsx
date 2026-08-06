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
  sm: "text-lg",
  md: "text-2xl",
  lg: "text-3xl",
};

export const SamyamLogo = ({ className = "", showText = true, size = "md" }: Props) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-3 group select-none ${className}`}>
      {/* Larger Emblem Image Container */}
      <div className={`relative ${sizeClasses[size]} shrink-0 rounded-full overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300`}>
        <img
          src={samyamLogoImg}
          alt="Samyam AI Logo"
          className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
        />
      </div>

      {/* Typography: Samyam AI */}
      {showText && (
        <div className="flex items-center gap-1.5 font-sans tracking-tight text-foreground leading-none">
          <span className={`${textSizes[size]} font-bold tracking-tight text-foreground`}>Samyam</span>
          <span className={`${size === "sm" ? "text-sm" : size === "lg" ? "text-xl" : "text-lg"} font-extrabold tracking-tight bg-gradient-to-r from-cosmic-purple to-cosmic-teal bg-clip-text text-transparent`}>AI</span>
        </div>
      )}
    </Link>
  );
};

export default SamyamLogo;
