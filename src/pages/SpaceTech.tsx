import { Link } from "react-router-dom";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Satellite,
  Orbit,
  Moon,
  Rocket,
  Activity,
  Radar,
  Target,
  Globe2,
  ShieldCheck,
  Cpu,
  ExternalLink,
  Info,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const products = [
  {
    icon: Activity,
    title: "Orbital Telemetry",
    description: "Real-time downlink anomaly detection for spacecraft subsystems.",
    href: "/products/orbital-telemetry",
  },
  {
    icon: Orbit,
    title: "Space Debris Tracking",
    description: "Catalog resident space objects and score conjunction risk.",
    href: "/products/space-debris-tracking",
  },
  {
    icon: Moon,
    title: "Lunar Surface Mapping",
    description: "Sub-meter terrain labels for orbiter and lander autonomy.",
    href: "/products/lunar-surface-mapping",
  },
  {
    icon: Rocket,
    title: "Launch Trajectory Eval",
    description: "Pre-flight scoring for PSLV, GSLV, SSLV and LVM3 profiles.",
    href: "/products/launch-trajectory",
  },
];

const capabilities = [
  {
    icon: Satellite,
    title: "Earth Observation Labeling",
    desc: "EO / SAR / IR annotation with sub-pixel precision for orbital and aerial imagery.",
  },
  {
    icon: Radar,
    title: "Sensor Fusion Pipelines",
    desc: "Time-aligned multi-modal datasets combining SAR, EO/IR, radar and telemetry.",
  },
  {
    icon: Target,
    title: "Mission Simulation",
    desc: "Scenario-based evaluation with KPI tracking for autonomy and decision models.",
  },
  {
    icon: Globe2,
    title: "GEOINT Ready",
    desc: "Geospatial workflows aligned to Indian sovereign coordinate systems and standards.",
  },
  {
    icon: Cpu,
    title: "Edge-Class Models",
    desc: "Compact perception stacks tuned for on-board compute and downlink budgets.",
  },
  {
    icon: ShieldCheck,
    title: "ITAR Aware",
    desc: "Data segregation and access controls aligned with export-control best practice.",
  },
];

// Real, publicly available mission datasets (official sources)
const missions = [
  {
    label: "Sentinel-2 L2A",
    agency: "ESA Copernicus",
    tag: "EO / Optical",
    desc: "10 m multispectral surface reflectance, global 5-day revisit.",
    href: "https://dataspace.copernicus.eu/explore-data/data-collections/sentinel-data/sentinel-2",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/1/1e/Sentinel-2_pillars.jpg/640px-Sentinel-2_pillars.jpg",
    keyFields: [
      "Product type: S2MSI2A",
      "Spatial resolution: 10 / 20 / 60 m",
      "Temporal revisit: ≤ 5 days",
      "Cloud cover metadata",
      "13 spectral bands",
    ],
    access:
      "Create a free account at dataspace.copernicus.eu, use the Browser or API to search by MGRS tile and date, then download L2A products.",
  },
  {
    label: "Landsat 8/9 Collection 2",
    agency: "USGS / NASA",
    tag: "EO / Multispectral",
    desc: "30 m calibrated Level-2 surface reflectance & thermal.",
    href: "https://www.usgs.gov/landsat-missions/landsat-collection-2-level-2-science-products",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/89/Landsat_9_-_artist_rendering.jpg/640px-Landsat_9_-_artist_rendering.jpg",
    keyFields: [
      "Collection 2 Level-2 products",
      "Spatial resolution: 30 m (VIS/NIR/SWIR), 100 m TIR",
      "Landsat 8 / 9 OLI / TIRS",
      "Surface reflectance / surface temperature",
      "USGS scene ID / path-row",
    ],
    access:
      "Visit USGS Earth Explorer, define an area/path-row and date, select Landsat 8/9 Collection 2 Level-2 products, and download via HTTPS or EarthExplorer.",
  },
  {
    label: "Chandrayaan-2 TMC-2 / OHRC",
    agency: "ISRO PRADAN",
    tag: "Lunar",
    desc: "Terrain Mapping Camera and 25 cm OHRC lunar imagery.",
    href: "https://pradan.issdc.gov.in/ch2/",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2a/Chandrayaan-2_at_launch_pad.jpg/640px-Chandrayaan-2_at_launch_pad.jpg",
    keyFields: [
      "TMC-2 (5 m) and OHRC (25 cm) imagery",
      "Level-1B / 2A lunar products",
      "Metadata: orbit, incidence angle",
      "Chandrayaan-2 PRADAN archive",
    ],
    access:
      "Go to pradan.issdc.gov.in/ch2, register for ISRO PRADAN, then browse the data archive and request approved products.",
  },
  {
    label: "Space-Track TLE Catalog",
    agency: "USSF 18th SDS",
    tag: "SSA / Debris",
    desc: "Public two-line elements for tracked resident space objects.",
    href: "https://www.space-track.org/",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/9d/Debris-GEO1280.jpg/640px-Debris-GEO1280.jpg",
    keyFields: [
      "Two-line element sets (TLEs)",
      "Catalog number / NORAD ID",
      "Orbital elements: mean motion, inclination",
      "Epoch date",
      "Decay / launch metadata",
    ],
    access:
      "Register at space-track.org under Orbital Data Requests, agree to the terms, then query the TLE REST API or download bulk TLE catalogs.",
  },
  {
    label: "SDO AIA / HMI",
    agency: "NASA GSFC",
    tag: "Heliophysics",
    desc: "Full-disk EUV solar imagery and magnetograms, 12 s cadence.",
    href: "https://sdo.gsfc.nasa.gov/data/",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/6b/Solar_Dynamics_Observatory_1.jpg/640px-Solar_Dynamics_Observatory_1.jpg",
    keyFields: [
      "AIA: 304 Å, 171 Å, 193 Å, 211 Å channels",
      "HMI: line-of-sight magnetograms",
      "12-second cadence (AIA)",
      "1.5 arcsec / pixel resolution",
      "JSOC export system",
    ],
    access:
      "Use sdo.gsfc.nasa.gov/data/ or the JSOC Lookdata interface, pick an AIA wavelength and time range, then export as FITS or JPEG.",
  },
  {
    label: "Sentinel-1 GRD SAR",
    agency: "ESA Copernicus",
    tag: "SAR",
    desc: "C-band synthetic aperture radar, all-weather day/night.",
    href: "https://dataspace.copernicus.eu/explore-data/data-collections/sentinel-data/sentinel-1",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/6/67/Sentinel-1_pillars.jpg/640px-Sentinel-1_pillars.jpg",
    keyFields: [
      "Product: GRD Ground Range Detected",
      "C-band SAR, single / dual polarization",
      "Resolution: 10 – 40 m",
      "IW / EW / SM acquisition modes",
      "SAFE format with metadata XML",
    ],
    access:
      "Sign in to dataspace.copernicus.eu, search Sentinel-1 GRD by polygon and date, and download via API or the Data Space Dashboard.",
  },
  {
    label: "Bhuvan / RESOURCESAT-2A",
    agency: "ISRO NRSC",
    tag: "EO / India",
    desc: "AWiFS, LISS-III & LISS-IV Indian sub-continent imagery.",
    href: "https://bhuvan.nrsc.gov.in/",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/PSLV-C36_carrying_Resourcesat-2A_lifts_off_from_Sriharikota.jpg/640px-PSLV-C36_carrying_Resourcesat-2A_lifts_off_from_Sriharikota.jpg",
    keyFields: [
      "LISS-IV (5.8 m), LISS-III (23.5 m), AWiFS (56 m)",
      "Bhuvan geospatial data catalog",
      "Indian Remote Sensing products",
      "Coverage: Indian sub-continent",
      "Metadata: acquisition date, sensor, path-row",
    ],
    access:
      "Go to bhuvan.nrsc.gov.in, register for Bhuvan data services, search Resourcesat-2A products, and request download via the data portal.",
  },
  {
    label: "MODIS Terra / Aqua",
    agency: "NASA LAADS",
    tag: "EO / Climate",
    desc: "Daily global 250 m–1 km radiance & atmospheric products.",
    href: "https://ladsweb.modaps.eosdis.nasa.gov/",
    img: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/45/Terra_spacecraft_model.png/640px-Terra_spacecraft_model.png",
    keyFields: [
      "Terra / Aqua MODIS Level-1B / 2 / 3",
      "Spatial resolution: 250 m, 500 m, 1 km",
      "Atmospheric, land and ocean products",
      "Daily / 8-day / 16-day composites",
      "MODIS product IDs (e.g., MOD09GA, MYD09GA)",
    ],
    access:
      "Visit ladsweb.modaps.eosdis.nasa.gov, select a MODIS product and temporal range, draw an area, and download HDF files via HTTPS or order.",
  },
];

const SpaceTech = () => {
  const [open, setOpen] = useState(false);
  const [selectedMission, setSelectedMission] = useState<null | typeof missions[0]>(null);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-4 overflow-hidden star-field">
        <ParallelWebBg />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/10 via-transparent to-background pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-cosmic-purple/5 rounded-full blur-[120px]" />
        <div className="absolute top-1/3 right-1/4 w-[400px] h-[400px] bg-cosmic-teal/5 rounded-full blur-[100px]" />

        <div className="container mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-border/50 bg-secondary/50 text-sm text-muted-foreground mb-6">
              <Sparkles className="h-4 w-4 text-cosmic-teal" />
              <span style={{ fontFamily: "'Comfortaa', cursive" }}>space tech</span>
            </div>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-6">
              AI for{" "}
              <span className="bg-gradient-to-r from-cosmic-purple-glow via-cosmic-teal to-cosmic-purple bg-clip-text text-transparent">
                Space Missions
              </span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Data engines, evaluations, and perception stacks built for ISRO-class programs — from Earth observation to lunar autonomy.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground hover:opacity-90 border-0 text-base px-8">
                <Link to="/book-demo">Book a Briefing <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-border/50 text-foreground hover:bg-secondary/50 text-base px-8">
                <Link to="/products/orbital-telemetry">Explore Products <ArrowRight className="h-4 w-4 ml-2" /></Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Products */}
      <section className="relative py-24 overflow-hidden">
        <ParallelWebBg />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-purple/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <p className="text-muted-foreground text-sm tracking-[0.3em] uppercase mb-3" style={{ fontFamily: "'Comfortaa', cursive" }}>
              space products
            </p>
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-foreground mb-4">
              Four backends. One mission stack.
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Each product is wired to a live backend — inspect the records powering real space workflows.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {products.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
              >
                <div className="glass-card h-full rounded-2xl border border-border/40 bg-card/40 backdrop-blur-sm p-7 hover:border-cosmic-teal/40 hover:bg-card/60 transition-all duration-300 flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cosmic-purple/20 to-cosmic-teal/20 flex items-center justify-center mb-5">
                    <p.icon className="w-6 h-6 text-cosmic-teal" />
                  </div>
                  <h3 className="font-display text-lg font-semibold text-foreground mb-3 leading-snug">
                    {p.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-7 flex-1">
                    {p.description}
                  </p>
                  <Button
                    asChild
                    className="w-full h-11 rounded-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground hover:opacity-90 text-sm font-semibold shadow-lg shadow-cosmic-purple/20"
                  >
                    <Link to={p.href}>
                      Open Product <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="relative py-24 overflow-hidden">
        <ParallelWebBg />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold mb-4">
              Full-stack{" "}
              <span className="bg-gradient-to-r from-cosmic-purple-glow via-cosmic-teal to-cosmic-purple bg-clip-text text-transparent">
                space capabilities
              </span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              From raw pixels to mission-ready perception — six capabilities that keep spacecraft, launches and downlinks trustworthy.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {capabilities.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08 }}
                className="glass-card rounded-xl p-6 hover:border-cosmic-purple/40 transition-all group"
              >
                <div className="p-3 rounded-lg bg-cosmic-purple/10 group-hover:bg-cosmic-purple/20 transition-colors w-fit mb-4">
                  <c.icon className="h-6 w-6 text-cosmic-purple-glow" />
                </div>
                <h3 className="font-display text-xl font-semibold mb-2">{c.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{c.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Missions strip */}
      <section className="relative py-20 overflow-hidden">
        <ParallelWebBg />
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center mb-10">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground mb-3" style={{ fontFamily: "'Comfortaa', cursive" }}>
              live mission datasets
            </p>
            <h2 className="font-display text-3xl sm:text-4xl font-bold mb-3">
              Real, public{" "}
              <span className="bg-gradient-to-r from-cosmic-purple-glow via-cosmic-teal to-cosmic-purple bg-clip-text text-transparent">
                space data sources
              </span>
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-sm sm:text-base">
              We ingest, curate and label from open agency archives — ESA Copernicus, NASA, USGS and ISRO — so every model is grounded in verifiable imagery.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-6xl mx-auto">
            {missions.map((m) => (
              <button
                key={m.label}
                type="button"
                onClick={() => {
                  setSelectedMission(m);
                  setOpen(true);
                }}
                className="group text-left glass-card rounded-xl overflow-hidden border border-border/60 hover:border-cosmic-purple/50 transition-all hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-cosmic-purple/40"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-muted">
                  <img
                    src={m.img}
                    alt={`${m.label} — ${m.agency}`}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.currentTarget as HTMLImageElement).src = '/placeholder.svg'; }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                  <span className="absolute top-2 left-2 text-[10px] px-2 py-0.5 rounded-full bg-background/80 backdrop-blur border border-border text-foreground">
                    {m.tag}
                  </span>
                </div>
                <div className="p-4">
                  <h3 className="font-display text-sm font-semibold mb-1 group-hover:text-cosmic-purple-glow transition-colors">
                    {m.label}
                  </h3>
                  <p className="text-[11px] uppercase tracking-wider text-cosmic-teal mb-2">{m.agency}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-3">{m.desc}</p>
                  <span className="inline-flex items-center gap-1 text-xs font-medium text-cosmic-purple-glow">
                    <Info className="h-3 w-3" /> View dataset details
                  </span>
                </div>
              </button>
            ))}
          </div>

          <p className="text-center text-xs text-muted-foreground mt-6">
            Imagery © respective agencies (ESA, NASA, USGS, ISRO). Links point to official public data portals.
          </p>
        </div>
      </section>

      <Dialog open={open} onOpenChange={setOpen}>
        {selectedMission && (
          <DialogContent className="max-w-2xl p-0 overflow-hidden border border-border/60 bg-card">
            <div className="relative aspect-[16/9] overflow-hidden bg-muted">
              <img
                src={selectedMission.img}
                alt={`${selectedMission.label} — ${selectedMission.agency}`}
                className="w-full h-full object-cover"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/40 to-transparent" />
              <span className="absolute top-3 left-3 text-[10px] px-2.5 py-1 rounded-full bg-background/80 backdrop-blur border border-border text-foreground">
                {selectedMission.tag}
              </span>
            </div>
            <div className="p-6 pt-0">
              <DialogHeader className="text-left mt-[-3rem] relative z-10">
                <DialogTitle className="font-display text-2xl sm:text-3xl font-bold text-foreground">
                  {selectedMission.label}
                </DialogTitle>
                <DialogDescription className="text-xs uppercase tracking-wider text-cosmic-teal">
                  {selectedMission.agency}
                </DialogDescription>
              </DialogHeader>
              <div className="mt-4 space-y-5">
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">Description</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedMission.desc}</p>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-2">Key fields</h4>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {selectedMission.keyFields.map((field) => (
                      <li key={field} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-cosmic-teal flex-shrink-0" />
                        {field}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-foreground mb-1">How to access</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{selectedMission.access}</p>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <Button asChild className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground hover:opacity-90 border-0">
                    <a href={selectedMission.href} target="_blank" rel="noopener noreferrer">
                      Open source portal <ExternalLink className="h-4 w-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>

      {/* CTA */}
      <section className="relative py-24 overflow-hidden">
        <ParallelWebBg />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-teal/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10 text-center max-w-3xl">
          <h2 className="font-display text-3xl sm:text-5xl font-bold mb-4">
            Ready to launch your{" "}
            <span className="bg-gradient-to-r from-cosmic-purple-glow via-cosmic-teal to-cosmic-purple bg-clip-text text-transparent">
              space AI stack?
            </span>
          </h2>
          <p className="text-muted-foreground text-lg mb-8">
            Book a mission briefing and we'll walk you through data engines, evaluations and deployment pathways for your program.
          </p>
          <Button asChild size="lg" className="bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground hover:opacity-90 border-0 text-base px-8">
            <Link to="/book-demo">Book a Briefing <ArrowRight className="h-4 w-4 ml-2" /></Link>
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default SpaceTech;
