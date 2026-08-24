import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import Dashboard from "./pages/Dashboard";
import BookDemo from "./pages/BookDemo";
import BuildAI from "./pages/BuildAI";
import SpaceTech from "./pages/SpaceTech";
import Learn from "./pages/Learn";
import OpenClawChat from "./pages/OpenClawChat";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResearchPapers from "./pages/ResearchPapers";
import SamyamLmPaper from "./pages/SamyamLmPaper";
import ResearchBlog from "./pages/ResearchBlog";
import FrontierLeaderboards from "./pages/FrontierLeaderboards";
import PreferenceLeaderboard from "./pages/PreferenceLeaderboard";
import ResearchLabs from "./pages/ResearchLabs";
import ResearchCareers from "./pages/ResearchCareers";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import NotFound from "./pages/NotFound";
import DeveloperTextToSpeech from "./pages/DeveloperTextToSpeech";
import DeveloperSpeechToText from "./pages/DeveloperSpeechToText";
import DeveloperDocumentDigitisation from "./pages/DeveloperDocumentDigitisation";
import GovernmentPage from "./pages/GovernmentPage";
import GovernmentHub from "./pages/GovernmentHub";
import ProductPage from "./pages/ProductPage";
import OAuthConsent from "./pages/OAuthConsent";
import AutoScrollReveal from "./components/AutoScrollReveal";
import AnnotationTool from "./pages/AnnotationTool";
import DataUpload from "./pages/DataUpload";
import QaWorkflow from "./pages/QaWorkflow";
import IncomePayments from "./pages/IncomePayments";
import Pricing from "./pages/Pricing";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Docs from "./pages/Docs";
import PrivacyPolicy from "./pages/PrivacyPolicy";
import TermsOfService from "./pages/TermsOfService";
import CookieConsent from "./components/CookieConsent";
import CaseStudyDetail from "./pages/CaseStudyDetail";
import ErrorBoundary from "./components/ErrorBoundary";
import Enterprise from "./pages/Enterprise";
import Changelog from "./pages/Changelog";
import Security from "./pages/Security";
import Integrations from "./pages/Integrations";
import Status from "./pages/Status";
import Resources from "./pages/Resources";
import { FloatingAiWidget } from "./components/FloatingAiWidget";


const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <ErrorBoundary>
        <BrowserRouter>
          <AutoScrollReveal />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/book-demo" element={<BookDemo />} />
            <Route path="/build-ai" element={<BuildAI />} />
            <Route path="/space-tech" element={<SpaceTech />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/openclaw-chat" element={<OpenClawChat />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/research/papers" element={<ResearchPapers />} />
            <Route path="/research/papers/samyamlm" element={<SamyamLmPaper />} />
            <Route path="/research/blog" element={<ResearchBlog />} />
            <Route path="/research/frontier-leaderboards" element={<FrontierLeaderboards />} />
            <Route path="/frontier-leaderboards" element={<FrontierLeaderboards />} />
            <Route path="/research/preference-leaderboard" element={<PreferenceLeaderboard />} />
            <Route path="/preference-leaderboard" element={<PreferenceLeaderboard />} />
            <Route path="/research/labs" element={<ResearchLabs />} />
            <Route path="/research/careers" element={<ResearchCareers />} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/developers/text-to-speech" element={<DeveloperTextToSpeech />} />
            <Route path="/developers/speech-to-text" element={<DeveloperSpeechToText />} />
            <Route path="/developers/document-digitisation" element={<DeveloperDocumentDigitisation />} />
            <Route path="/government" element={<GovernmentHub />} />
            <Route path="/government/:slug" element={<GovernmentPage />} />
            <Route path="/products/:slug" element={<ProductPage />} />
            <Route path="/oauth/consent" element={<OAuthConsent />} />
            {/* Annotation & Data Pipeline Routes */}
            <Route path="/upload" element={<DataUpload />} />
            <Route path="/data-upload" element={<DataUpload />} />
            <Route path="/qa" element={<QaWorkflow />} />
            <Route path="/qa-workflow" element={<QaWorkflow />} />
            <Route path="/annotate" element={<AnnotationTool />} />
            <Route path="/annotation" element={<AnnotationTool />} />
            <Route path="/annotation-tool" element={<AnnotationTool />} />
            <Route path="/annotate/demo" element={<AnnotationTool />} />
            {/* Annotation Tool — task-specific */}
            <Route path="/annotate/:taskId" element={<AnnotationTool />} />
            {/* Financial Operations, Income & Payout Routes */}
            <Route path="/income" element={<IncomePayments />} />
            <Route path="/payments" element={<IncomePayments />} />
            <Route path="/payouts" element={<IncomePayments />} />
            {/* New Pages */}
            <Route path="/enterprise" element={<Enterprise />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/docs" element={<Docs />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<TermsOfService />} />
            <Route path="/case-studies/:slug" element={<CaseStudyDetail />} />
            <Route path="/case-studies" element={<CaseStudyDetail />} />
            <Route path="/changelog" element={<Changelog />} />
            <Route path="/security" element={<Security />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/status" element={<Status />} />
            <Route path="/resources" element={<Resources />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <FloatingAiWidget />
          <CookieConsent />
        </BrowserRouter>
      </ErrorBoundary>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
