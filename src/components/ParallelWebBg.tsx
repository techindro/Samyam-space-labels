const ParallelWebBg = () => (
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute inset-0" style={{
      backgroundImage: `
        repeating-linear-gradient(0deg, transparent, transparent 59px, hsl(var(--cosmic-purple) / 0.08) 59px, hsl(var(--cosmic-purple) / 0.08) 60px),
        repeating-linear-gradient(90deg, transparent, transparent 59px, hsl(var(--cosmic-teal) / 0.08) 59px, hsl(var(--cosmic-teal) / 0.08) 60px)
      `,
    }} />
    <div className="absolute inset-0" style={{
      backgroundImage: `
        repeating-linear-gradient(45deg, transparent, transparent 79px, hsl(var(--cosmic-purple) / 0.05) 79px, hsl(var(--cosmic-purple) / 0.05) 80px),
        repeating-linear-gradient(-45deg, transparent, transparent 79px, hsl(var(--cosmic-teal) / 0.05) 79px, hsl(var(--cosmic-teal) / 0.05) 80px)
      `,
    }} />
    <div className="absolute inset-0" style={{
      backgroundImage: `radial-gradient(circle 1.5px, hsl(var(--cosmic-teal) / 0.18) 1px, transparent 1px)`,
      backgroundSize: '60px 60px',
    }} />
  </div>
);

export default ParallelWebBg;
