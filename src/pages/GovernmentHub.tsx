import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  ShieldCheck,
  ArrowRight,
  Search,
  Lock,
  Server,
  FileCheck,
  Globe2,
  Building2,
  Cpu,
  Eye,
  Radar,
  Satellite,
  Shield,
  Landmark,
  CheckCircle2,
  Sparkles,
} from "lucide-react";
import { governmentPages, GovernmentPage as GovPageType } from "@/data/governmentPages";

const GovernmentHub = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const filteredPages = governmentPages.filter((p) => {
    const matchesSearch =
      p.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.hero.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedCategory === "defence") {
      return matchesSearch && (p.slug.includes("defence") || p.slug.includes("border") || p.slug.includes("intelligence"));
    }
    if (selectedCategory === "space") {
      return matchesSearch && (p.slug.includes("space") || p.slug.includes("isro"));
    }
    if (selectedCategory === "governance") {
      return matchesSearch && (p.slug.includes("governance") || p.slug.includes("psu") || p.slug.includes("indiaai"));
    }
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-background text-foreground relative">
      <Navbar />
      <ParallelWebBg />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 border-b border-border/50">
        <div className="container mx-auto max-w-6xl text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-secondary/50 text-xs font-semibold text-foreground mb-6">
            <ShieldCheck className="w-4 h-4 text-foreground" /> Sovereign & ITAR-Aware AI Platform
          </div>

          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 text-foreground">
            Sovereign AI for Government & Defense
          </h1>

          <p className="text-muted-foreground text-lg max-w-3xl mx-auto mb-8 leading-relaxed">
            Mission-ready computer vision, geospatial intelligence (GEOINT), and natural language processing for India’s Armed Forces, ISRO, security agencies, and allied public-sector programs.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button size="lg" onClick={() => navigate("/book-demo")} className="gap-2 bg-foreground text-background hover:bg-foreground/90 font-semibold">
              Request Classified Briefing <ArrowRight className="w-4 h-4" />
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate("/security")} className="gap-2 border-border text-foreground">
              <Lock className="w-4 h-4" /> Security & Compliance Architecture
            </Button>
          </div>

          {/* Search & Category Filter */}
          <div className="mt-12 max-w-2xl mx-auto">
            <div className="relative mb-4">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search government programs (e.g., MoD, ISRO, Border, GEOINT, IndiaAI)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-background border border-border text-foreground placeholder-muted-foreground/60 text-sm focus:outline-none focus:ring-2 focus:ring-foreground/20 transition-all"
              />
            </div>

            <div className="flex items-center justify-center gap-2 overflow-x-auto py-1">
              {[
                { id: "all", label: "All Programs" },
                { id: "defence", label: "Defense & Military" },
                { id: "space", label: "Space & GEOINT" },
                { id: "governance", label: "Digital Governance & PSUs" },
              ].map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    selectedCategory === cat.id
                      ? "bg-foreground text-background font-semibold"
                      : "bg-secondary/60 text-muted-foreground hover:text-foreground hover:bg-secondary"
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compliance / Security Trust Grid */}
      <section className="py-12 border-b border-border/50 bg-secondary/20">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 rounded-xl border border-border/60 bg-background">
              <Server className="w-5 h-5 mx-auto mb-2 text-foreground" />
              <p className="font-semibold text-sm">100% Air-Gapped</p>
              <p className="text-xs text-muted-foreground">On-premise deployment ready</p>
            </div>
            <div className="p-4 rounded-xl border border-border/60 bg-background">
              <ShieldCheck className="w-5 h-5 mx-auto mb-2 text-foreground" />
              <p className="font-semibold text-sm">ITAR & DPDP Aware</p>
              <p className="text-xs text-muted-foreground">Strict export compliance</p>
            </div>
            <div className="p-4 rounded-xl border border-border/60 bg-background">
              <FileCheck className="w-5 h-5 mx-auto mb-2 text-foreground" />
              <p className="font-semibold text-sm">Sovereign Data Storage</p>
              <p className="text-xs text-muted-foreground">India datacenter residency</p>
            </div>
            <div className="p-4 rounded-xl border border-border/60 bg-background">
              <Lock className="w-5 h-5 mx-auto mb-2 text-foreground" />
              <p className="font-semibold text-sm">Granular RBAC</p>
              <p className="text-xs text-muted-foreground">Auditor & clearance controls</p>
            </div>
          </div>
        </div>
      </section>

      {/* Government Programs Grid */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
                Government & Strategic Programs
              </h2>
              <p className="text-muted-foreground text-sm">
                Explore mission-specific capabilities, use cases, and partner frameworks.
              </p>
            </div>
            <span className="text-xs text-muted-foreground px-3 py-1 rounded-full border border-border bg-secondary">
              {filteredPages.length} Programs Available
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPages.map((pg: GovPageType) => {
              const IconComp = pg.icon;
              return (
                <Card
                  key={pg.slug}
                  className="group overflow-hidden border border-border/80 bg-background hover:border-foreground/40 hover:shadow-xl transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-video overflow-hidden border-b border-border/50">
                    <img
                      src={pg.image}
                      alt={pg.label}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
                    <div className="absolute top-3 left-3 p-2 rounded-lg bg-background/90 border border-border text-foreground backdrop-blur-md">
                      <IconComp className="w-5 h-5" />
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded bg-secondary text-muted-foreground mb-2 inline-block">
                        {pg.hero.eyebrow}
                      </span>
                      <h3 className="text-lg font-bold text-foreground mb-2 group-hover:text-foreground/80 transition-colors">
                        {pg.label}
                      </h3>
                        <p className="text-xs text-muted-foreground mb-4 line-clamp-2">
                        {pg.subtitle}
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-1.5 mb-3 overflow-x-auto py-1 scrollbar-none">
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wider shrink-0 font-medium">Partners:</span>
                        {pg.partners.map((p) => {
                          const PartnerIcon = p.icon;
                          return (
                            <div key={p.name} className="h-6 px-2 py-0.5 rounded bg-secondary/80 border border-border flex items-center gap-1.5 shrink-0 text-foreground" title={p.name}>
                              {p.logo ? (
                                <img src={p.logo} alt={p.name} className="h-3.5 w-auto object-contain filter invert dark:invert-0" />
                              ) : (
                                <PartnerIcon className="w-3 h-3 text-foreground" />
                              )}
                              <span className="text-[10px] font-medium">{p.name}</span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="border-t border-border/50 pt-3 mb-4 space-y-1">
                        {pg.capabilities.slice(0, 2).map((cap) => (
                          <div key={cap.title} className="flex items-center gap-2 text-xs text-muted-foreground">
                            <CheckCircle2 className="w-3.5 h-3.5 text-foreground shrink-0" />
                            <span className="truncate">{cap.title}</span>
                          </div>
                        ))}
                      </div>

                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/government/${pg.slug}`)}
                        className="w-full justify-between border-border text-foreground hover:bg-foreground hover:text-background transition-all group-hover:border-foreground"
                      >
                        Explore Program <ArrowRight className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Defense & Sovereign Mission CTA */}
      <section className="py-20 px-4 border-t border-border/50 bg-secondary/30">
        <div className="container mx-auto max-w-4xl text-center">
          <Card className="p-10 border border-border bg-background shadow-2xl relative overflow-hidden">
            <div className="relative z-10">
              <div className="w-12 h-12 rounded-xl bg-secondary border border-border flex items-center justify-center mx-auto mb-4">
                <Shield className="w-6 h-6 text-foreground" />
              </div>
              <h2 className="text-3xl font-bold tracking-tight text-foreground mb-3">
                Deploy Sovereign AI in Your Defense Unit
              </h2>
              <p className="text-muted-foreground text-sm max-w-xl mx-auto mb-6 leading-relaxed">
                Contact our defense & security technical team for air-gapped installations, custom synthetic data pipelines, and tri-service model evaluations.
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Button size="lg" onClick={() => navigate("/book-demo")} className="gap-2 bg-foreground text-background font-semibold">
                  Schedule Briefing <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => navigate("/contact")} className="border-border text-foreground">
                  Contact Defense Desk
                </Button>
              </div>
            </div>
          </Card>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GovernmentHub;
