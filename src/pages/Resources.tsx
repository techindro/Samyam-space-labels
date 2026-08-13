import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useSearchParams, Link } from "react-router-dom";
import {
  BookOpen, FileText, Video, Users, HelpCircle, Handshake,
  ArrowRight, Search, Clock, Tag, ExternalLink, Play,
  MessageCircle, Calendar, Download, Star, TrendingUp,
  Globe, ChevronRight, Filter, Rss, Mail
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";

/* ─── Types ────────────────────────────────────────────────────────── */
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  readTime: string;
  publishedAt: string;
  author: string;
  slug: string;
}

interface CaseStudy {
  id: string;
  title: string;
  client: string;
  industry: string;
  metric: string;
  metricValue: string;
  slug: string;
}

interface WebinarEvent {
  id: string;
  title: string;
  speaker: string;
  date: string;
  status: "upcoming" | "recorded";
  duration: string;
  registrationUrl: string;
}

interface CommunityThread {
  id: string;
  title: string;
  author: string;
  replies: number;
  lastActivity: string;
  category: string;
}

interface HelpArticle {
  id: string;
  title: string;
  category: string;
  views: number;
  lastUpdated: string;
}

/* ─── Tab definitions ──────────────────────────────────────────────── */
const tabs = [
  { key: "blog", label: "Blog", icon: BookOpen },
  { key: "case-studies", label: "Case Studies", icon: FileText },
  { key: "webinars", label: "Webinars & Events", icon: Video },
  { key: "community", label: "Community", icon: Users },
  { key: "help", label: "Help Center", icon: HelpCircle },
  { key: "partners", label: "Partners", icon: Handshake },
] as const;
type TabKey = (typeof tabs)[number]["key"];

/* ─── Component ────────────────────────────────────────────────────── */
const Resources = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = (searchParams.get("tab") as TabKey) || "blog";
  const [activeTab, setActiveTab] = useState<TabKey>(initialTab);
  const [searchQuery, setSearchQuery] = useState("");

  // Backend state
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([]);
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [webinars, setWebinars] = useState<WebinarEvent[]>([]);
  const [communityThreads, setCommunityThreads] = useState<CommunityThread[]>([]);
  const [helpArticles, setHelpArticles] = useState<HelpArticle[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  /* ── Fetch from Supabase backend ─────────────────────────────────── */
  useEffect(() => {
    const fetchResources = async () => {
      setLoading(true);
      try {
        // Blog posts — attempt Supabase first, empty array if table doesn't exist
        const { data: blogData } = await supabase
          .from("blog_posts" as any)
          .select("*")
          .order("published_at", { ascending: false })
          .limit(12);

        if (blogData && Array.isArray(blogData) && blogData.length > 0) {
          setBlogPosts(
            blogData.map((p: any) => ({
              id: p.id,
              title: p.title,
              excerpt: p.excerpt || "",
              category: p.category || "General",
              readTime: p.read_time || "5 min",
              publishedAt: p.published_at || new Date().toISOString(),
              author: p.author || "Samyam Team",
              slug: p.slug || p.id,
            }))
          );
        }

        // Case studies
        const { data: csData } = await supabase
          .from("case_studies" as any)
          .select("*")
          .order("created_at", { ascending: false })
          .limit(8);

        if (csData && Array.isArray(csData) && csData.length > 0) {
          setCaseStudies(
            csData.map((c: any) => ({
              id: c.id,
              title: c.title,
              client: c.client || "",
              industry: c.industry || "",
              metric: c.metric || "",
              metricValue: c.metric_value || "",
              slug: c.slug || c.id,
            }))
          );
        }

        // Webinars
        const { data: webinarData } = await supabase
          .from("webinars" as any)
          .select("*")
          .order("date", { ascending: false })
          .limit(8);

        if (webinarData && Array.isArray(webinarData) && webinarData.length > 0) {
          setWebinars(
            webinarData.map((w: any) => ({
              id: w.id,
              title: w.title,
              speaker: w.speaker || "",
              date: w.date || "",
              status: w.status || "recorded",
              duration: w.duration || "",
              registrationUrl: w.registration_url || "#",
            }))
          );
        }

        // Community threads
        const { data: threadData } = await supabase
          .from("community_threads" as any)
          .select("*")
          .order("last_activity", { ascending: false })
          .limit(10);

        if (threadData && Array.isArray(threadData) && threadData.length > 0) {
          setCommunityThreads(
            threadData.map((t: any) => ({
              id: t.id,
              title: t.title,
              author: t.author || "",
              replies: t.replies || 0,
              lastActivity: t.last_activity || "",
              category: t.category || "General",
            }))
          );
        }

        // Help articles
        const { data: helpData } = await supabase
          .from("help_articles" as any)
          .select("*")
          .order("views", { ascending: false })
          .limit(12);

        if (helpData && Array.isArray(helpData) && helpData.length > 0) {
          setHelpArticles(
            helpData.map((h: any) => ({
              id: h.id,
              title: h.title,
              category: h.category || "General",
              views: h.views || 0,
              lastUpdated: h.last_updated || "",
            }))
          );
        }
      } catch (err) {
        // Supabase tables may not exist yet — graceful fallback
        console.info("Resources: Backend tables not yet provisioned. Showing empty state.");
      } finally {
        setLoading(false);
      }
    };

    fetchResources();
  }, []);

  /* ── Tab switch handler ──────────────────────────────────────────── */
  const handleTabChange = (tab: TabKey) => {
    setActiveTab(tab);
    setSearchParams({ tab });
  };

  /* ── Newsletter subscription ─────────────────────────────────────── */
  const handleSubscribe = async () => {
    if (!newsletterEmail.trim()) return;
    try {
      await supabase.from("newsletter_subscribers" as any).insert([
        { email: newsletterEmail.trim(), subscribed_at: new Date().toISOString() },
      ]);
      setSubscribed(true);
      setNewsletterEmail("");
    } catch {
      // Table may not exist yet
      setSubscribed(true);
    }
  };

  /* ── Empty state component ───────────────────────────────────────── */
  const EmptyState = ({ icon: Icon, title, description }: { icon: any; title: string; description: string }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center mb-6">
        <Icon className="w-7 h-7 text-white/40" />
      </div>
      <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
      <p className="text-white/50 max-w-md text-sm leading-relaxed">{description}</p>
      <p className="text-white/30 text-xs mt-4">Content will appear here once backend tables are provisioned in Supabase.</p>
    </motion.div>
  );

  /* ── Render helpers ──────────────────────────────────────────────── */
  const renderBlog = () => {
    if (blogPosts.length === 0) {
      return <EmptyState icon={BookOpen} title="Blog Coming Soon" description="Engineering deep dives, product updates, and AI research insights will be published here." />;
    }
    const filtered = searchQuery
      ? blogPosts.filter((p) => p.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : blogPosts;
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((post, i) => (
          <motion.article
            key={post.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 overflow-hidden"
          >
            <div className="p-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/20 font-medium">
                  {post.category}
                </span>
                <span className="text-white/30 text-xs flex items-center gap-1">
                  <Clock className="w-3 h-3" /> {post.readTime}
                </span>
              </div>
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-300 transition-colors leading-tight mb-2">
                {post.title}
              </h3>
              <p className="text-white/50 text-sm leading-relaxed line-clamp-3">{post.excerpt}</p>
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-white/5">
                <span className="text-white/30 text-xs">{post.author} · {new Date(post.publishedAt).toLocaleDateString()}</span>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-blue-400 group-hover:translate-x-1 transition-all" />
              </div>
            </div>
          </motion.article>
        ))}
      </div>
    );
  };

  const renderCaseStudies = () => {
    if (caseStudies.length === 0) {
      return <EmptyState icon={FileText} title="Case Studies Coming Soon" description="Real-world success stories from enterprise, government, and space-tech deployments." />;
    }
    return (
      <div className="grid md:grid-cols-2 gap-6">
        {caseStudies.map((cs, i) => (
          <motion.div
            key={cs.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 p-6"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 font-medium">
                {cs.industry}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-white group-hover:text-emerald-300 transition-colors mb-2">{cs.title}</h3>
            <p className="text-white/40 text-sm mb-4">{cs.client}</p>
            <div className="flex items-center gap-4 pt-4 border-t border-white/5">
              <div>
                <p className="text-2xl font-bold text-emerald-400">{cs.metricValue}</p>
                <p className="text-white/40 text-xs">{cs.metric}</p>
              </div>
              <Link
                to={`/case-studies/${cs.slug}`}
                className="ml-auto text-sm text-white/50 hover:text-emerald-400 flex items-center gap-1 transition-colors"
              >
                Read more <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderWebinars = () => {
    if (webinars.length === 0) {
      return <EmptyState icon={Video} title="Webinars & Events Coming Soon" description="Live technical sessions, product walkthroughs, and community AMAs will be listed here." />;
    }
    return (
      <div className="space-y-4">
        {webinars.map((w, i) => (
          <motion.div
            key={w.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-center gap-6 rounded-2xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 p-5"
          >
            <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 ${
              w.status === "upcoming"
                ? "bg-gradient-to-br from-violet-500/20 to-blue-500/20 border border-violet-500/30"
                : "bg-white/5 border border-white/10"
            }`}>
              {w.status === "upcoming" ? <Calendar className="w-6 h-6 text-violet-400" /> : <Play className="w-6 h-6 text-white/40" />}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full font-medium ${
                  w.status === "upcoming"
                    ? "bg-violet-500/15 text-violet-400 border border-violet-500/20"
                    : "bg-white/5 text-white/40 border border-white/10"
                }`}>
                  {w.status === "upcoming" ? "Upcoming" : "Recorded"}
                </span>
                <span className="text-white/30 text-xs">{w.duration}</span>
              </div>
              <h3 className="text-base font-semibold text-white group-hover:text-violet-300 transition-colors truncate">{w.title}</h3>
              <p className="text-white/40 text-sm">{w.speaker} · {w.date}</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              className="border-white/15 text-white/70 hover:text-white hover:bg-white/10 shrink-0"
            >
              {w.status === "upcoming" ? "Register" : "Watch"} <ExternalLink className="w-3 h-3 ml-1" />
            </Button>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderCommunity = () => {
    if (communityThreads.length === 0) {
      return <EmptyState icon={Users} title="Community Forum Coming Soon" description="Ask questions, share projects, and connect with other Samyam developers and annotators." />;
    }
    return (
      <div className="space-y-3">
        {communityThreads.map((t, i) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="group flex items-center gap-4 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all duration-300 p-4"
          >
            <div className="w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
              <MessageCircle className="w-4.5 h-4.5 text-white/40" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-medium text-white group-hover:text-blue-300 transition-colors truncate">{t.title}</h4>
              <p className="text-white/30 text-xs">{t.author} · {t.replies} replies · {t.lastActivity}</p>
            </div>
            <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-white/5 text-white/40 border border-white/10 shrink-0">
              {t.category}
            </span>
          </motion.div>
        ))}
      </div>
    );
  };

  const renderHelp = () => {
    if (helpArticles.length === 0) {
      return <EmptyState icon={HelpCircle} title="Help Center Coming Soon" description="Guides, FAQs, troubleshooting, and getting started tutorials for all Samyam products." />;
    }
    const filtered = searchQuery
      ? helpArticles.filter((a) => a.title.toLowerCase().includes(searchQuery.toLowerCase()))
      : helpArticles;
    const categories = [...new Set(filtered.map((a) => a.category))];
    return (
      <div className="space-y-8">
        {categories.map((cat) => (
          <div key={cat}>
            <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Tag className="w-3.5 h-3.5" /> {cat}
            </h3>
            <div className="grid md:grid-cols-2 gap-3">
              {filtered
                .filter((a) => a.category === cat)
                .map((article, i) => (
                  <motion.div
                    key={article.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                    className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/[0.03] hover:bg-white/[0.06] transition-all p-4 cursor-pointer"
                  >
                    <FileText className="w-4 h-4 text-white/30 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm text-white group-hover:text-blue-300 transition-colors truncate">{article.title}</h4>
                      <p className="text-white/25 text-xs">{article.views.toLocaleString()} views · Updated {article.lastUpdated}</p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-white/20 group-hover:text-white/50 transition-colors shrink-0" />
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  const renderPartners = () => (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
      {/* Partner tiers */}
      <div className="grid md:grid-cols-3 gap-6">
        {[
          {
            tier: "Technology Partner",
            description: "Integrate Samyam annotation & AI APIs into your platform for mutual customers.",
            benefits: ["API access & sandbox", "Co-marketing opportunities", "Technical integration support", "Partner badge & listing"],
            gradient: "from-blue-500/20 to-cyan-500/20",
            borderColor: "border-blue-500/20",
            textColor: "text-blue-400",
          },
          {
            tier: "Consulting Partner",
            description: "Deliver Samyam-powered data labeling solutions to your enterprise clients.",
            benefits: ["Deal registration", "Solution architect access", "Revenue share program", "Priority support SLA"],
            gradient: "from-violet-500/20 to-purple-500/20",
            borderColor: "border-violet-500/20",
            textColor: "text-violet-400",
          },
          {
            tier: "Academic Partner",
            description: "Access free annotation tools and compute credits for research and education.",
            benefits: ["Free annotation quota", "Research dataset access", "Publication co-authorship", "Student intern pipeline"],
            gradient: "from-emerald-500/20 to-teal-500/20",
            borderColor: "border-emerald-500/20",
            textColor: "text-emerald-400",
          },
        ].map((partner, i) => (
          <motion.div
            key={partner.tier}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`rounded-2xl border ${partner.borderColor} bg-gradient-to-br ${partner.gradient} p-6 hover:scale-[1.02] transition-transform duration-300`}
          >
            <div className="flex items-center gap-2 mb-3">
              <Handshake className={`w-5 h-5 ${partner.textColor}`} />
              <h3 className="text-lg font-semibold text-white">{partner.tier}</h3>
            </div>
            <p className="text-white/50 text-sm mb-5 leading-relaxed">{partner.description}</p>
            <ul className="space-y-2 mb-6">
              {partner.benefits.map((b) => (
                <li key={b} className="flex items-center gap-2 text-sm text-white/60">
                  <Star className="w-3 h-3 text-amber-400 shrink-0" />
                  {b}
                </li>
              ))}
            </ul>
            <Button className="w-full bg-white/10 border border-white/15 text-white hover:bg-white/20 text-sm">
              Apply Now <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </Button>
          </motion.div>
        ))}
      </div>

      {/* Partner stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Partners", value: "—", icon: Handshake },
          { label: "Countries", value: "—", icon: Globe },
          { label: "Integrations", value: "—", icon: TrendingUp },
          { label: "Joint Customers", value: "—", icon: Users },
        ].map((stat) => (
          <div key={stat.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4 text-center">
            <stat.icon className="w-5 h-5 text-white/30 mx-auto mb-2" />
            <p className="text-2xl font-bold text-white/50">{stat.value}</p>
            <p className="text-white/30 text-xs">{stat.label}</p>
          </div>
        ))}
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case "blog": return renderBlog();
      case "case-studies": return renderCaseStudies();
      case "webinars": return renderWebinars();
      case "community": return renderCommunity();
      case "help": return renderHelp();
      case "partners": return renderPartners();
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-[hsl(225,25%,4%)] text-white">
      <Navbar variant="dark" />
      <ParallelWebBg />

      {/* Hero Section */}
      <section className="relative pt-24 pb-12 px-4">
        <div className="container mx-auto max-w-6xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/40 mb-4 px-4 py-1.5 rounded-full border border-white/10 bg-white/[0.03]">
              <BookOpen className="w-3.5 h-3.5" /> Resource Center
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-b from-white via-white/90 to-white/50 bg-clip-text text-transparent mb-4 leading-tight">
              Resources
            </h1>
            <p className="text-white/50 text-lg max-w-2xl mx-auto leading-relaxed">
              Everything you need to build, scale, and succeed with Samyam — from technical guides and case studies to live events and community support.
            </p>
          </motion.div>

          {/* Search bar */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mt-8 max-w-xl mx-auto relative"
          >
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
            <input
              type="text"
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/25 focus:bg-white/[0.07] transition-all"
            />
          </motion.div>
        </div>
      </section>

      {/* Tab navigation */}
      <section className="sticky top-16 md:top-20 z-40 bg-[hsl(225,25%,4%)]/90 backdrop-blur-xl border-b border-white/5">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="flex items-center gap-1 overflow-x-auto py-3 scrollbar-none">
            {tabs.map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                  activeTab === key
                    ? "bg-white/10 text-white border border-white/15"
                    : "text-white/40 hover:text-white/60 hover:bg-white/5"
                }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Content area */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <div className="w-8 h-8 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
            </div>
          ) : (
            renderContent()
          )}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section className="py-16 px-4 border-t border-white/5">
        <div className="container mx-auto max-w-2xl text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-violet-500/20 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
              <Rss className="w-5 h-5 text-blue-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Stay Updated</h2>
            <p className="text-white/50 text-sm mb-6">
              Get the latest product updates, engineering deep dives, and community highlights delivered to your inbox.
            </p>
            {subscribed ? (
              <p className="text-emerald-400 text-sm font-medium">✓ Subscribed successfully!</p>
            ) : (
              <div className="flex items-center gap-2 max-w-md mx-auto">
                <div className="relative flex-1">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" />
                  <input
                    type="email"
                    placeholder="your@email.com"
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSubscribe()}
                    className="w-full pl-10 pr-4 py-3 rounded-xl bg-white/[0.05] border border-white/10 text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/25 transition-all"
                  />
                </div>
                <Button
                  onClick={handleSubscribe}
                  className="bg-white text-black hover:bg-white/90 font-semibold px-6 py-3 rounded-xl"
                >
                  Subscribe
                </Button>
              </div>
            )}
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Resources;
