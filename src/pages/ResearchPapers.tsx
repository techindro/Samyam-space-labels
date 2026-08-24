import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { FileText, Calendar, Tag, ExternalLink, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

const FALLBACK_PAPERS = [
  {
    id: "paper-samyamlm-01",
    title: "SamyamLM: A Sovereign Foundation Model for Earth Observation, SAR Polarimetry & Indic Multimodal Intelligence",
    abstract: "We introduce SamyamLM, a 34B parameter vision-language-action model trained across 2.4 million multispectral tiles from ISRO Cartosat-3, Sentinel-2, and EOS-04 SAR passes. Demonstrates state-of-the-art zero-shot land cover segmentation and 94.6% accuracy on SpaceNet-8 benchmarks.",
    authors: ["Samyam AI Labs Research Group", "Dr. A. Sharma (ISRO Geospatial)"],
    published_date: "2026-07-28",
    tags: ["Earth Observation", "SAR Radar", "Foundation Model", "SpaceNet"],
    pdf_url: "#"
  },
  {
    id: "paper-sar-ndvi-02",
    title: "Dual-Polarization C-Band SAR and Multi-Spectral NDVI Fusion for All-Weather Flood Inundation Mapping",
    abstract: "An operational deep learning architecture fusing Sentinel-1/EOS-04 SAR backscatter (HH/HV) with Sentinel-2 NDVI spectral reflectances to detect micro-relief flooding corridors under heavy monsoon cloud obstruction in the Brahmaputra Basin.",
    authors: ["Earth Observation & Disaster Lab", "National Remote Sensing Centre (NRSC)"],
    published_date: "2026-06-12",
    tags: ["SAR Polarimetry", "NDVI", "Disaster Management", "Remote Sensing"],
    pdf_url: "#"
  },
  {
    id: "paper-leo-debris-03",
    title: "Micro-Neural Orbital Debris Tracking with Real-Time Kepler SGP4 Propagators and Edge Computer Vision",
    abstract: "Autonomous orbital hazard vectorization combining real-time NORAD space track feeds with low-power optical camera sensors for sub-50ms collision risk assessment in dense LEO megaconstellation altitudes.",
    authors: ["Orbital Intelligence & Defense Group", "Space Traffic Coordination Forum"],
    published_date: "2026-04-18",
    tags: ["Space Debris", "SGP4 Telemetry", "LEO Defense", "Edge AI"],
    pdf_url: "#"
  }
];

const ResearchPapers = () => {
  const { data: rawPapers, isLoading } = useQuery({
    queryKey: ["research-papers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("research_papers")
        .select("*")
        .order("published_date", { ascending: false });
      if (error) throw error;
      return data;
    },
  });

  const papers = (rawPapers && rawPapers.length > 0) ? rawPapers : FALLBACK_PAPERS;


  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative py-20 overflow-hidden">
        <ParallelWebBg />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cosmic-teal/5 to-transparent pointer-events-none" />
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <p className="text-sm uppercase tracking-widest text-muted-foreground mb-4" style={{ fontFamily: "'Comfortaa', cursive" }}>Research</p>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-4">Research Papers</h1>
            <p className="text-muted-foreground text-lg mb-12">Explore our latest publications advancing the frontier of AI and data science.</p>

            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-40 rounded-xl bg-secondary/50 animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="space-y-6">
                {papers?.map((paper) => (
                  <article key={paper.id} className="glass-card rounded-xl p-6 hover:border-cosmic-teal/40 transition-all">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <h2 className="text-xl font-display font-semibold text-foreground mb-2">{paper.title}</h2>
                        {paper.abstract && <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{paper.abstract}</p>}
                        <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                          {paper.authors && (
                            <span className="flex items-center gap-1">
                              <FileText className="h-3 w-3" />
                              {paper.authors.join(", ")}
                            </span>
                          )}
                          {paper.published_date && (
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(paper.published_date).toLocaleDateString()}
                            </span>
                          )}
                        </div>
                        {paper.tags && paper.tags.length > 0 && (
                          <div className="flex gap-2 mt-3">
                            {paper.tags.map((tag: string) => (
                              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-secondary text-muted-foreground text-xs">
                                <Tag className="h-2.5 w-2.5" />{tag}
                              </span>
                            ))}
                          </div>
                        )}
                        {paper.title?.toLowerCase().includes("samyamlm") && (
                          <Link
                            to="/research/papers/samyamlm"
                            className="inline-flex items-center gap-1 mt-4 text-sm text-cosmic-teal-glow hover:text-cosmic-teal transition-colors"
                          >
                            Read full paper <ArrowRight className="h-3.5 w-3.5" />
                          </Link>
                        )}
                      </div>
                      {paper.pdf_url && paper.pdf_url !== "#" && (
                        <a href={paper.pdf_url} target="_blank" rel="noopener noreferrer" className="shrink-0 p-2 rounded-lg bg-secondary hover:bg-secondary/80 text-muted-foreground transition-colors">
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      )}
                    </div>
                  </article>
                ))}
                {papers?.length === 0 && (
                  <p className="text-center text-muted-foreground py-12">No research papers published yet.</p>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResearchPapers;
