import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowLeft, Database } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { getProductBySlug, type ProductColumn } from "@/data/productPages";

const formatCell = (value: unknown, fmt?: ProductColumn["format"]) => {
  if (value === null || value === undefined || value === "") return "—";
  switch (fmt) {
    case "number":
      return Number(value).toLocaleString();
    case "score":
      return typeof value === "number" ? value.toFixed(3) : String(value);
    case "array":
      return Array.isArray(value) ? value.join(" · ") : String(value);
    case "boolean":
      return value ? "Yes" : "No";
    case "badge":
      return (
        <Badge variant="outline" className="capitalize">
          {String(value).replace(/_/g, " ")}
        </Badge>
      );
    default:
      return String(value);
  }
};

const ProductPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const product = getProductBySlug(slug);
  const [rows, setRows] = useState<any[] | null>(null);
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    if (!product) return;
    let alive = true;

    const load = async () => {
      const [listRes, countRes] = await Promise.all([
        supabase
          .from(product.table as never)
          .select("*")
          .order(product.orderBy, { ascending: false })
          .limit(25),
        supabase
          .from(product.table as never)
          .select("id", { count: "exact", head: true }),
      ]);
      if (!alive) return;
      setRows((listRes.data as any[]) ?? []);
      setCount(countRes.count ?? 0);
    };

    load();
    const id = window.setInterval(load, 30000);
    return () => {
      alive = false;
      window.clearInterval(id);
    };
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center space-y-3">
          <Database className="h-10 w-10 mx-auto text-muted-foreground" />
          <h1 className="font-display text-2xl font-semibold">Product not found</h1>
          <Button variant="outline" onClick={() => navigate("/")}>Back home</Button>
        </div>
      </div>
    );
  }

  const Icon = product.icon;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border/50">
        <ParallelWebBg />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `url(${product.image})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
        <div className="container mx-auto px-4 py-20 relative z-10">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" /> All products
          </button>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-xl bg-cosmic-purple/15 border border-cosmic-purple/30">
                <Icon className="h-6 w-6 text-cosmic-purple-glow" />
              </div>
              <span className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                {product.hero.eyebrow}
              </span>
              {product.badge && (
                <Badge variant="outline" className="border-cosmic-purple/40 text-cosmic-purple-glow">
                  {product.badge}
                </Badge>
              )}
            </div>
            <h1 className="font-display text-4xl sm:text-5xl font-bold mb-4 leading-tight">
              {product.hero.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              {product.hero.description}
            </p>
            <div className="flex items-baseline gap-3">
              <span className="font-display text-4xl font-bold text-cosmic-teal tabular-nums">
                {count === null ? "—" : count.toLocaleString()}
              </span>
              <span className="text-sm uppercase tracking-wider text-muted-foreground">
                {product.metricLabel} in backend
              </span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Live table */}
      <section className="py-16 container mx-auto px-4">
        <div className="flex items-end justify-between mb-6">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground mb-2">
              Live backend records
            </p>
            <h2 className="font-display text-2xl font-semibold">
              Latest {product.metricLabel}
            </h2>
          </div>
          <span className="text-xs text-muted-foreground">
            Auto-refreshes every 30s · showing up to 25
          </span>
        </div>

        <div className="glass-card rounded-xl overflow-hidden border border-border/50">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40 border-b border-border/50">
                <tr>
                  <th className="text-left font-medium px-4 py-3 text-muted-foreground uppercase tracking-wider text-xs">
                    {product.primaryColumn.replace(/_/g, " ")}
                  </th>
                  {product.columns.map((c) => (
                    <th
                      key={c.key}
                      className="text-left font-medium px-4 py-3 text-muted-foreground uppercase tracking-wider text-xs"
                    >
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rows === null && (
                  <tr>
                    <td
                      colSpan={product.columns.length + 1}
                      className="px-4 py-10 text-center text-muted-foreground"
                    >
                      Loading…
                    </td>
                  </tr>
                )}
                {rows && rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={product.columns.length + 1}
                      className="px-4 py-10 text-center text-muted-foreground"
                    >
                      No records yet.
                    </td>
                  </tr>
                )}
                {rows?.map((r, i) => (
                  <tr
                    key={r.id ?? i}
                    className="border-b border-border/30 last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-4 py-3 font-medium max-w-[420px] truncate">
                      {String(r[product.primaryColumn] ?? "—")}
                    </td>
                    {product.columns.map((c) => (
                      <td key={c.key} className="px-4 py-3 text-muted-foreground">
                        {formatCell(r[c.key], c.format)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default ProductPage;
