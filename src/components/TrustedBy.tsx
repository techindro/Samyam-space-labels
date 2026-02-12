const logos = [
  "ISRO", "NASA", "SpaceX", "ESA", "Boeing", "Lockheed Martin",
  "Northrop Grumman", "Blue Origin", "Rocket Lab", "Planet Labs",
];

const TrustedBy = () => {
  return (
    <section className="py-16 border-y border-border/30">
      <div className="container mx-auto px-4">
        <p className="text-center text-sm text-muted-foreground uppercase tracking-widest mb-10">
          Trusted by the world's leading space & defense organizations
        </p>
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex animate-marquee whitespace-nowrap">
            {[...logos, ...logos].map((name, i) => (
              <div
                key={i}
                className="inline-flex items-center justify-center mx-8 px-6 py-3 rounded-lg border border-border/30 bg-secondary/30 min-w-[160px]"
              >
                <span className="font-display text-sm font-semibold text-muted-foreground tracking-wider">
                  {name}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
