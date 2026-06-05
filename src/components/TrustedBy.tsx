import isroLogo from "@/assets/logos/isro.png";
import nasaLogo from "@/assets/logos/nasa.png";
import spacexLogo from "@/assets/logos/spacex.png";
import esaLogo from "@/assets/logos/esa.png";
import boeingLogo from "@/assets/logos/boeing.png";
import lockheedLogo from "@/assets/logos/lockheed.svg";
import northropLogo from "@/assets/logos/northrop.svg";
import blueOriginLogo from "@/assets/logos/blueorigin.svg";
import planetLabsLogo from "@/assets/logos/planetlabs.svg";
import ParallelWebBg from "@/components/ParallelWebBg";

const logos = [
  { name: "ISRO", src: isroLogo },
  { name: "NASA", src: nasaLogo },
  { name: "SpaceX", src: spacexLogo },
  { name: "ESA", src: esaLogo },
  { name: "Boeing", src: boeingLogo },
  { name: "Lockheed Martin", src: lockheedLogo },
  { name: "Northrop Grumman", src: northropLogo },
  { name: "Blue Origin", src: blueOriginLogo },
  { name: "Planet Labs", src: planetLabsLogo },
];

const TrustedBy = () => {
  return (
    <section className="py-16 border-y border-border/30 relative overflow-hidden">
      <ParallelWebBg />
      <div className="container mx-auto px-4 relative z-10">
        <p className="text-center text-sm text-muted-foreground uppercase tracking-widest mb-10">
          Powering the Future with
        </p>
        <div className="overflow-hidden relative">
          <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-background to-transparent z-10" />
          <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-background to-transparent z-10" />
          <div className="flex animate-marquee whitespace-nowrap items-center">
            {[...logos, ...logos].map((logo, i) => (
              <div
                key={i}
                className="inline-flex items-center justify-center mx-8 px-6 py-3 rounded-lg border border-border/30 bg-secondary/30 min-w-[160px] h-16"
              >
                <img
                  src={logo.src}
                  alt={`${logo.name} logo`}
                  className="h-8 max-w-[120px] object-contain"
                  style={{ filter: 'brightness(0)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustedBy;
