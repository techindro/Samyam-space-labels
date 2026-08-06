interface Props {
  className?: string;
  variant?: "dark" | "light";
}

const MonochromeGridBg = ({ className = "", variant = "dark" }: Props) => {
  const isLight = variant === "light";
  const lineColor = isLight ? "rgba(0, 0, 0, 0.08)" : "rgba(255, 255, 255, 0.07)";
  const diagColor = isLight ? "rgba(0, 0, 0, 0.05)" : "rgba(255, 255, 255, 0.04)";
  const dotColor = isLight ? "rgba(0, 0, 0, 0.25)" : "rgba(255, 255, 255, 0.2)";

  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      {/* Horizontal & Vertical Grid */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(0deg, transparent, transparent 59px, ${lineColor} 59px, ${lineColor} 60px),
            repeating-linear-gradient(90deg, transparent, transparent 59px, ${lineColor} 59px, ${lineColor} 60px)
          `,
        }}
      />
      {/* Diagonal Grid Lines (45° and -45°) */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, transparent, transparent 79px, ${diagColor} 79px, ${diagColor} 80px),
            repeating-linear-gradient(-45deg, transparent, transparent 79px, ${diagColor} 79px, ${diagColor} 80px)
          `,
        }}
      />
      {/* Dot Grid Intersections */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `radial-gradient(circle 1.5px, ${dotColor} 1px, transparent 1px)`,
          backgroundSize: '60px 60px',
        }}
      />
    </div>
  );
};

export default MonochromeGridBg;
