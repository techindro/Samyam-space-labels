import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import DataEngineSection from "@/components/DataEngineSection";
import TrustedBy from "@/components/TrustedBy";
import SolutionsSection from "@/components/SolutionsSection";
import AgenticSection from "@/components/AgenticSection";
import ProductsSection from "@/components/ProductsSection";
import LearnAISection from "@/components/LearnAISection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import ComplianceSection from "@/components/ComplianceSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <TrustedBy />
        <SolutionsSection />
        <AgenticSection />
        <ProductsSection />
        <LearnAISection />
        <TestimonialsSection />
        <CaseStudiesSection />
        <ComplianceSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
