import { motion } from "framer-motion";
import { Check, Zap, Shield, Building2, ArrowRight, Sparkles, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";
import PricingRoiCalculator from "@/components/PricingRoiCalculator";
import { useRazorpayCheckout } from "@/hooks/useRazorpayCheckout";

const plans = [
  {
    name: "Starter",
    icon: Zap,
    price: "₹0",
    period: "Free forever",
    description: "For researchers and small teams exploring AI annotation.",
    color: "from-cosmic-teal/20 to-transparent",
    border: "border-border/50",
    badge: null,
    features: [
      "Up to 500 annotations/month",
      "3 active projects",
      "BBox & Polygon labeling",
      "COCO JSON export",
      "Community support",
      "Basic model evaluation",
    ],
    cta: "Get Started Free",
    href: "/auth",
    outlined: true,
  },
  {
    name: "Pro",
    icon: Shield,
    price: "₹9,999",
    period: "per month",
    description: "For growing teams that need scale, speed, and advanced tools.",
    color: "from-cosmic-purple/30 to-cosmic-teal/10",
    border: "border-foreground",
    badge: "Most Popular",
    features: [
      "Unlimited annotations",
      "Unlimited projects",
      "All annotation types",
      "All export formats",
      "Priority email support",
      "Advanced model evaluation",
      "Voice AI agents",
      "Dataset versioning",
      "Reviewer workflows",
      "Quality scoring",
    ],
    cta: "Start Pro Trial",
    href: "/book-demo",
    outlined: false,
  },
  {
    name: "Enterprise",
    icon: Building2,
    price: "Custom",
    period: "contact us",
    description: "For space agencies, defense contractors & large enterprises.",
    color: "from-foreground/5 to-transparent",
    border: "border-border/50",
    badge: null,
    features: [
      "Everything in Pro",
      "Dedicated infrastructure",
      "On-premise deployment",
      "ITAR-compliant pipeline",
      "SLA guarantees",
      "Custom annotation types",
      "Dedicated account manager",
      "SSO / SAML",
      "Audit logs & compliance",
      "Custom AI model training",
    ],
    cta: "Book a Briefing",
    href: "/book-demo",
    outlined: true,
  },
];

const apiPricing = [
  { api: "Text to Speech (Samyam Voice V1)", unit: "per 1K characters", price: "₹2.50" },
  { api: "Speech to Text (Samyam Scribe V1)", unit: "per minute", price: "₹1.80" },
  { api: "Document Digitisation (Samyam Vision)", unit: "per page", price: "₹3.00" },
  { api: "Voice AI Agent", unit: "per conversation", price: "₹5.00" },
  { api: "Dataset Query API", unit: "per 1K requests", price: "₹10.00" },
];

const Pricing = () => {
  const navigate = useNavigate();
  const { initiatePayment, isLoading: isPaymentLoading } = useRazorpayCheckout();

  const handleProPlanCheckout = () => {
    initiatePayment({
      amount: 999900, // ₹9,999 in paise
      planName: "Pro",
      onSuccess: () => {
        navigate("/dashboard");
      },
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative overflow-hidden">
        <ParallelWebBg />

        {/* Hero */}
        <section className="py-24 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-cosmic-purple/5 via-transparent to-transparent pointer-events-none" />
          <div className="container mx-auto px-4 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-border bg-secondary/50">
                <Sparkles className="h-3.5 w-3.5 text-cosmic-teal" />
                <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Pricing</span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                Simple,{" "}
                <span className="bg-gradient-to-r from-cosmic-purple-glow via-cosmic-teal to-cosmic-purple bg-clip-text text-transparent">
                  Transparent
                </span>{" "}
                Pricing
              </h1>
              <p className="text-muted-foreground max-w-xl mx-auto text-lg">
                Start free. Scale as you grow. No hidden fees, no surprises.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Plans */}
        <section className="pb-24 relative z-10">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
              {plans.map((plan, i) => {
                const Icon = plan.icon;
                return (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, duration: 0.5 }}
                    className={`relative rounded-2xl border ${plan.border} p-8 flex flex-col overflow-hidden ${
                      plan.badge ? "shadow-[0_0_40px_-12px_hsl(var(--foreground)/0.15)]" : ""
                    }`}
                  >
                    {/* BG gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${plan.color} pointer-events-none`} />

                    {plan.badge && (
                      <div className="absolute top-4 right-4 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full bg-foreground text-primary-foreground">
                        {plan.badge}
                      </div>
                    )}

                    <div className="relative z-10 flex flex-col flex-1">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="p-2 rounded-xl bg-secondary">
                          <Icon className="h-5 w-5" />
                        </div>
                        <span className="font-display text-lg font-semibold">{plan.name}</span>
                      </div>

                      <div className="mb-2">
                        <span className="font-display text-4xl font-bold">{plan.price}</span>
                        <span className="text-muted-foreground text-sm ml-2">{plan.period}</span>
                      </div>
                      <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{plan.description}</p>

                      <ul className="space-y-2.5 flex-1 mb-8">
                        {plan.features.map((f) => (
                          <li key={f} className="flex items-start gap-2.5 text-sm">
                            <Check className="h-4 w-4 text-cosmic-teal shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      {plan.name === "Pro" ? (
                        <Button
                          onClick={handleProPlanCheckout}
                          disabled={isPaymentLoading}
                          className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground border-0 hover:opacity-90"
                        >
                          {isPaymentLoading ? (
                            <>
                              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              Processing…
                            </>
                          ) : (
                            <>
                              {plan.cta} <ArrowRight className="h-4 w-4 ml-2" />
                            </>
                          )}
                        </Button>
                      ) : (
                        <Link to={plan.href}>
                          <Button
                            className={`w-full ${
                              plan.outlined
                                ? "border-foreground/30 hover:bg-secondary"
                                : "bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground border-0 hover:opacity-90"
                            }`}
                            variant={plan.outlined ? "outline" : "default"}
                          >
                            {plan.cta} <ArrowRight className="h-4 w-4 ml-2" />
                          </Button>
                        </Link>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Interactive ROI & Savings Calculator */}
        <PricingRoiCalculator />

        {/* API Pricing Table */}
        <section className="py-16 border-t border-border/30 relative z-10">
          <div className="container mx-auto px-4 max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-center mb-12"
            >
              <h2 className="font-display text-3xl font-bold mb-3">API Usage Pricing</h2>
              <p className="text-muted-foreground">Pay only for what you use. All APIs included in Pro & Enterprise.</p>
            </motion.div>

            <div className="glass-card rounded-2xl overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border/50 bg-secondary/30">
                    <th className="text-left px-6 py-4 text-sm font-semibold">API</th>
                    <th className="text-left px-6 py-4 text-sm font-semibold text-muted-foreground">Unit</th>
                    <th className="text-right px-6 py-4 text-sm font-semibold">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {apiPricing.map((row, i) => (
                    <tr
                      key={row.api}
                      className={`border-b border-border/30 hover:bg-secondary/20 transition-colors ${
                        i === apiPricing.length - 1 ? "border-b-0" : ""
                      }`}
                    >
                      <td className="px-6 py-4 text-sm font-medium">{row.api}</td>
                      <td className="px-6 py-4 text-sm text-muted-foreground">{row.unit}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-right text-cosmic-teal">{row.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <p className="text-center text-xs text-muted-foreground mt-4">
              All prices are exclusive of GST. Volume discounts available for enterprise customers.{" "}
              <Link to="/book-demo" className="text-foreground underline underline-offset-4">
                Contact us
              </Link>{" "}
              for custom pricing.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Pricing;
