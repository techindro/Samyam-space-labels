import { lazy, Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ErrorBoundary from "./components/ErrorBoundary";
import AutoScrollReveal from "./components/AutoScrollReveal";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import CookieConsent from "./components/CookieConsent";
import { FloatingAiWidget } from "./components/FloatingAiWidget";

// ── Eagerly loaded (above-the-fold critical paths) ───────────────────────────
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import NotFound from "./pages/NotFound";

// ── Lazy loaded pages (code-split, loaded on demand) ─────────────────────────
const Dashboard             = lazy(() => import("./pages/Dashboard"));
const BookDemo              = lazy(() => import("./pages/BookDemo"));
const BuildAI               = lazy(() => import("./pages/BuildAI"));
const SpaceTech             = lazy(() => import("./pages/SpaceTech"));
const Learn                 = lazy(() => import("./pages/Learn"));
const OpenClawChat          = lazy(() => import("./pages/OpenClawChat"));
const ForgotPassword        = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword         = lazy(() => import("./pages/ResetPassword"));
const ResearchPapers        = lazy(() => import("./pages/ResearchPapers"));
const SamyamLmPaper         = lazy(() => import("./pages/SamyamLmPaper"));
const ResearchBlog          = lazy(() => import("./pages/ResearchBlog"));
const FrontierLeaderboards  = lazy(() => import("./pages/FrontierLeaderboards"));
const PreferenceLeaderboard = lazy(() => import("./pages/PreferenceLeaderboard"));
const ResearchLabs          = lazy(() => import("./pages/ResearchLabs"));
const ResearchCareers       = lazy(() => import("./pages/ResearchCareers"));
const AdminDashboard        = lazy(() => import("./pages/AdminDashboard"));
const DeveloperTextToSpeech       = lazy(() => import("./pages/DeveloperTextToSpeech"));
const DeveloperSpeechToText       = lazy(() => import("./pages/DeveloperSpeechToText"));
const DeveloperDocumentDigitisation = lazy(() => import("./pages/DeveloperDocumentDigitisation"));
const GovernmentPage        = lazy(() => import("./pages/GovernmentPage"));
const GovernmentHub         = lazy(() => import("./pages/GovernmentHub"));
const ProductPage           = lazy(() => import("./pages/ProductPage"));
const OAuthConsent          = lazy(() => import("./pages/OAuthConsent"));
const AnnotationTool        = lazy(() => import("./pages/AnnotationTool"));
const DataUpload            = lazy(() => import("./pages/DataUpload"));
const QaWorkflow            = lazy(() => import("./pages/QaWorkflow"));
const IncomePayments        = lazy(() => import("./pages/IncomePayments"));
const Pricing               = lazy(() => import("./pages/Pricing"));
const About                 = lazy(() => import("./pages/About"));
const Contact               = lazy(() => import("./pages/Contact"));
const Docs                  = lazy(() => import("./pages/Docs"));
const PrivacyPolicy         = lazy(() => import("./pages/PrivacyPolicy"));
const TermsOfService        = lazy(() => import("./pages/TermsOfService"));
const CaseStudyDetail       = lazy(() => import("./pages/CaseStudyDetail"));
const Enterprise            = lazy(() => import("./pages/Enterprise"));
const Changelog             = lazy(() => import("./pages/Changelog"));
const Security              = lazy(() => import("./pages/Security"));
const Integrations          = lazy(() => import("./pages/Integrations"));
const Status                = lazy(() => import("./pages/Status"));
const Resources             = lazy(() => import("./pages/Resources"));
const AutonomousDriving     = lazy(() => import("./pages/AutonomousDriving"));

// ── Minimal page loader shown while lazy chunk downloads ─────────────────────
const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-background">
    <div className="flex flex-col items-center gap-3">
      <div className="h-8 w-8 rounded-full border-2 border-cosmic-teal border-t-transparent animate-spin" />
      <span className="text-sm text-muted-foreground">Loading...</span>
    </div>
  </div>
);

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <AutoScrollReveal />
          <Suspense fallback={<PageLoader />}>
            <Routes>
              {/* ── Critical (eager) ─────────────────────────── */}
              <Route path="/"    element={<Index />} />
              <Route path="/auth" element={<Auth />} />

              {/* ── Autonomous Driving ───────────────────────── */}
              <Route path="/autonomous-driving"  element={<AutonomousDriving />} />
              <Route path="/self-driving"        element={<AutonomousDriving />} />
              <Route path="/autonomous-vehicle"  element={<AutonomousDriving />} />

              {/* ── Auth helpers ─────────────────────────────── */}
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password"  element={<ResetPassword />} />

              {/* ── Core product pages ───────────────────────── */}
              <Route path="/book-demo"  element={<BookDemo />} />
              <Route path="/build-ai"   element={<BuildAI />} />
              <Route path="/space-tech" element={<SpaceTech />} />
              <Route path="/learn"      element={<Learn />} />
              <Route path="/openclaw-chat" element={<OpenClawChat />} />

              {/* ── Research ─────────────────────────────────── */}
              <Route path="/research/papers"               element={<ResearchPapers />} />
              <Route path="/research/papers/samyamlm"      element={<SamyamLmPaper />} />
              <Route path="/research/blog"                 element={<ResearchBlog />} />
              <Route path="/research/frontier-leaderboards" element={<FrontierLeaderboards />} />
              <Route path="/frontier-leaderboards"         element={<FrontierLeaderboards />} />
              <Route path="/research/preference-leaderboard" element={<PreferenceLeaderboard />} />
              <Route path="/preference-leaderboard"        element={<PreferenceLeaderboard />} />
              <Route path="/research/labs"                 element={<ResearchLabs />} />
              <Route path="/research/careers"              element={<ResearchCareers />} />

              {/* ── Protected user routes ─────────────────────── */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/admin"     element={<AdminRoute><AdminDashboard /></AdminRoute>} />

              {/* ── Developer APIs ───────────────────────────── */}
              <Route path="/developers/text-to-speech"       element={<DeveloperTextToSpeech />} />
              <Route path="/developers/speech-to-text"       element={<DeveloperSpeechToText />} />
              <Route path="/developers/document-digitisation" element={<DeveloperDocumentDigitisation />} />

              {/* ── Government ───────────────────────────────── */}
              <Route path="/government"       element={<GovernmentHub />} />
              <Route path="/government-hub"   element={<GovernmentHub />} />
              <Route path="/government/:slug" element={<GovernmentPage />} />

              {/* ── Products ─────────────────────────────────── */}
              <Route path="/products/:slug" element={<ProductPage />} />
              <Route path="/oauth/consent"  element={<OAuthConsent />} />

              {/* ── Annotation & Data Pipeline ───────────────── */}
              <Route path="/upload"          element={<DataUpload />} />
              <Route path="/data-upload"     element={<DataUpload />} />
              <Route path="/qa"              element={<QaWorkflow />} />
              <Route path="/qa-workflow"     element={<QaWorkflow />} />
              <Route path="/annotate"        element={<AnnotationTool />} />
              <Route path="/annotation"      element={<AnnotationTool />} />
              <Route path="/annotation-tool" element={<AnnotationTool />} />
              <Route path="/annotate/demo"   element={<AnnotationTool />} />
              <Route path="/annotate/:taskId" element={<AnnotationTool />} />

              {/* ── Financial ────────────────────────────────── */}
              <Route path="/income"   element={<IncomePayments />} />
              <Route path="/payments" element={<IncomePayments />} />
              <Route path="/payouts"  element={<IncomePayments />} />

              {/* ── Company / Legal ──────────────────────────── */}
              <Route path="/enterprise"         element={<Enterprise />} />
              <Route path="/pricing"            element={<Pricing />} />
              <Route path="/about"              element={<About />} />
              <Route path="/contact"            element={<Contact />} />
              <Route path="/docs"               element={<Docs />} />
              <Route path="/privacy"            element={<PrivacyPolicy />} />
              <Route path="/terms"              element={<TermsOfService />} />
              <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
              <Route path="/case-studies"       element={<CaseStudyDetail />} />
              <Route path="/changelog"          element={<Changelog />} />
              <Route path="/security"           element={<Security />} />
              <Route path="/integrations"       element={<Integrations />} />
              <Route path="/status"             element={<Status />} />
              <Route path="/resources"          element={<Resources />} />

              {/* ── Catch-all ────────────────────────────────── */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Suspense>
          <FloatingAiWidget />
          <CookieConsent />
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
