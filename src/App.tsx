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
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import ResearchPapers from "./pages/ResearchPapers";
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
import ProductPage from "./pages/ProductPage";
import AutoScrollReveal from "./components/AutoScrollReveal";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AutoScrollReveal />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth" element={<Auth />} />
          <Route path="/book-demo" element={<BookDemo />} />
          <Route path="/build-ai" element={<BuildAI />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/research/papers" element={<ResearchPapers />} />
          <Route path="/research/blog" element={<ResearchBlog />} />
          <Route path="/research/frontier-leaderboards" element={<FrontierLeaderboards />} />
          <Route path="/research/preference-leaderboard" element={<PreferenceLeaderboard />} />
          <Route path="/research/labs" element={<ResearchLabs />} />
          <Route path="/research/careers" element={<ResearchCareers />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/developers/text-to-speech" element={<DeveloperTextToSpeech />} />
          <Route path="/developers/speech-to-text" element={<DeveloperSpeechToText />} />
          <Route path="/developers/document-digitisation" element={<DeveloperDocumentDigitisation />} />
          <Route path="/government/:slug" element={<GovernmentPage />} />
          <Route path="/products/:slug" element={<ProductPage />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
