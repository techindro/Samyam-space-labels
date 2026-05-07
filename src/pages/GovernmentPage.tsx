import { useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck } from "lucide-react";
import { getGovernmentPage, governmentPages } from "@/data/governmentPages";

const GovernmentPage = () => {
  const { slug = "" } = useParams();
  const navigate = useNavigate();
  const page = getGovernmentPage(slug);

  useEffect(() => {
    if (page) {
      document.title = `${page.label} — samyam`;
    }
  }, [page]);

  if (!page) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="container mx-auto px-4 py-32 text-center">
          <h1 className="text-3xl font-semibold mb-4">Government program not found</h1>
          <Button onClick={() => navigate("/")}>Back to home</Button>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = page.icon;
  const others = governmentPages.filter((p) => p.slug !== page.slug).slice(0, 4);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero */}
      <section className="relative pt-32 pb-20 overflow-hidden border-b border-border/50">
        <ParallelWebBg />
        <div className="container mx-auto px-4 relative z-10 max-w-5xl">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-border bg-card/50 text-xs font-medium text-muted-foreground mb-6">
            <ShieldCheck className="w-3.5 h-3.5" /> {page.hero.eyebrow} · ITAR Aware
          </div>
          <div className="flex items-start gap-5 mb-6">
            <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
              <Icon className="w-7 h-7 text-primary" />
            </div>
            <div>
              <h1 className="text-4xl md:text-5xl font-semibold tracking-tight mb-3">{page.hero.title}</h1>
              <p className="text-lg text-muted-foreground max-w-3xl">{page.hero.description}</p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3 mt-8">
            <Button onClick={() => navigate("/book-demo")} className="gap-2">
              Book a briefing <ArrowRight className="w-4 h-4" />
            </Button>
            <Button variant="outline" onClick={() => navigate("/build-ai")}>Explore platform</Button>
          </div>
          <div className="mt-12 rounded-2xl overflow-hidden border border-border shadow-2xl">
            <img src={page.image} alt={page.label} width={1280} height={720} className="w-full h-auto object-cover" />
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-b border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {page.stats.map((s) => (
              <div key={s.label} className="p-6 rounded-lg border border-border bg-card/50">
                <div className="text-2xl font-semibold mb-1">{s.value}</div>
                <div className="text-sm text-muted-foreground">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Capabilities */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-semibold mb-2">Capabilities</h2>
          <p className="text-muted-foreground mb-10">What samyam delivers across this program.</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {page.capabilities.map((c) => (
              <Card key={c.title} className="p-6 hover:border-primary/40 transition-colors">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-primary mt-0.5 shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{c.title}</h3>
                    <p className="text-sm text-muted-foreground">{c.description}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Use cases */}
      <section className="py-20 bg-card/30 border-y border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-semibold mb-2">Use cases</h2>
          <p className="text-muted-foreground mb-10">Where teams put samyam to work.</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {page.useCases.map((u) => (
              <Card key={u.title} className="p-6">
                <h3 className="font-semibold mb-2">{u.title}</h3>
                <p className="text-sm text-muted-foreground">{u.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Partners */}
      <section className="py-20">
        <div className="container mx-auto px-4 max-w-5xl">
          <h2 className="text-3xl font-semibold mb-2">Designed to work with</h2>
          <p className="text-muted-foreground mb-8">Programs and organisations this offering is aligned to.</p>
          <div className="flex flex-wrap gap-3">
            {page.partners.map((p) => (
              <span key={p} className="px-4 py-2 rounded-full border border-border bg-card/50 text-sm">{p}</span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <Card className="p-10 text-center bg-gradient-to-br from-primary/5 to-transparent">
            <h2 className="text-3xl font-semibold mb-3">Bring samyam into your program</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Book a confidential briefing to discuss requirements, security posture and a tailored pilot.
            </p>
            <Button size="lg" onClick={() => navigate("/book-demo")} className="gap-2">
              Book a briefing <ArrowRight className="w-4 h-4" />
            </Button>
          </Card>
        </div>
      </section>

      {/* Other programs */}
      <section className="py-16 border-t border-border/50">
        <div className="container mx-auto px-4 max-w-5xl">
          <h3 className="text-xl font-semibold mb-6">Other government programs</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {others.map((o) => {
              const OIcon = o.icon;
              return (
                <Link key={o.slug} to={`/government/${o.slug}`} className="group">
                  <Card className="overflow-hidden h-full hover:border-primary/40 transition-colors">
                    <div className="aspect-video overflow-hidden">
                      <img src={o.image} alt={o.label} loading="lazy" width={1280} height={720} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-5">
                      <OIcon className="w-5 h-5 text-primary mb-2" />
                      <div className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{o.label}</div>
                      <div className="text-xs text-muted-foreground">{o.subtitle}</div>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default GovernmentPage;
