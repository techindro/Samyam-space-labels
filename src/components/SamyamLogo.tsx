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
      {/* Emblem Image Container */}
      <div className={`relative ${sizeClasses[size]} shrink-0 rounded-full overflow-hidden shadow-sm group-hover:scale-105 transition-transform duration-300`}>
        <img
          src={samyamLogoImg}
          alt="Samyam AI Logo"
          className="w-full h-full object-cover mix-blend-multiply dark:mix-blend-normal"
        />
      </div>

      {/* Typography: Samyam with "ai" floating above the letter "m" */}
      {showText && (
        <div className="relative inline-flex items-center font-sans tracking-tight text-foreground leading-none pt-1">
          <span className={`${textSizes[size]} font-bold tracking-tight text-foreground inline-flex items-baseline`}>
            Samya
            <span className="relative inline-block">
              m
              <span
                className="absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-extrabold tracking-tight bg-gradient-to-r from-cosmic-purple to-cosmic-teal bg-clip-text text-transparent select-none font-mono"
                style={{ fontSize: size === "sm" ? "9px" : size === "lg" ? "13px" : "11px" }}
              >
                ai
              </span>
            </span>
          </span>
        </div>
      )}
    </Link>
  );
};

export default SamyamLogo;
