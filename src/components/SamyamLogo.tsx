import samyamLogoImg from "@/assets/samyam-logo.jpg";
import { Link } from "react-router-dom";

interface Props {
  className?: string;
  showText?: boolean;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-10 w-10",
  md: "h-14 w-14",
  lg: "h-16 w-16",
};

const textSizes = {
  sm: "text-xl",
  md: "text-3xl",
  lg: "text-4xl",
};

const aiBadgeSizes = {
  sm: "text-[10px] -top-3",
  md: "text-xs -top-4",
  lg: "text-sm -top-5",
};

export const SamyamLogo = ({ className = "", showText = true, size = "md" }: Props) => {
  return (
    <Link to="/" className={`inline-flex items-center gap-3.5 group select-none ${className}`}>
      {/* Prominent Large Emblem Container */}
      <div className={`relative ${sizeClasses[size]} shrink-0 rounded-full bg-white p-0.5 shadow-md border border-border/50 group-hover:scale-105 transition-transform duration-300`}>
        <img
          src={samyamLogoImg}
          alt="Samyam AI Logo"
          className="w-full h-full object-cover rounded-full"
        />
      </div>

      {/* Typography: Samyam with prominent "AI" floating directly over the letter "m" */}
      {showText && (
        <div className="relative inline-flex items-center font-sans tracking-tight text-foreground leading-none pt-1.5">
          <span className={`${textSizes[size]} font-extrabold tracking-tight text-foreground inline-flex items-baseline`}>
            Samya
            <span className="relative inline-block">
              m
              <span
                className={`absolute ${aiBadgeSizes[size]} left-1/2 -translate-x-1/2 font-black tracking-wider uppercase bg-gradient-to-r from-cosmic-purple via-cosmic-purple to-cosmic-teal bg-clip-text text-transparent select-none font-mono drop-shadow-sm`}
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
