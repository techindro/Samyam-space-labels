import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import TrustedBy from "@/components/TrustedBy";
import SolutionsSection from "@/components/SolutionsSection";
import AgenticSection from "@/components/AgenticSection";
import ProductsSection from "@/components/ProductsSection";
import LearnAISection from "@/components/LearnAISection";
import TestimonialsSection from "@/components/TestimonialsSection";
import CaseStudiesSection from "@/components/CaseStudiesSection";
import ComplianceSection from "@/components/ComplianceSection";
import ExperienceSamyam from "@/components/ExperienceSamyam";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <ScrollReveal><TrustedBy /></ScrollReveal>
        <ScrollReveal><SolutionsSection /></ScrollReveal>
        <ScrollReveal><AgenticSection /></ScrollReveal>
        <ScrollReveal><ProductsSection /></ScrollReveal>
        <ScrollReveal><LearnAISection /></ScrollReveal>
        <ScrollReveal><TestimonialsSection /></ScrollReveal>
        <ScrollReveal><CaseStudiesSection /></ScrollReveal>
        <ScrollReveal><ComplianceSection /></ScrollReveal>
        <ScrollReveal><ExperienceSamyam /></ScrollReveal>
      </main>
      <Footer />
    </div>
  );
};

export default Index;
