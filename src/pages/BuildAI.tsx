import Navbar from "@/components/Navbar";
import BuildAIHero from "@/components/BuildAIHero";
import TrustedBestSection from "@/components/TrustedBestSection";
import DataEngineExplainer from "@/components/DataEngineExplainer";
import DataEngineSection from "@/components/DataEngineSection";
import AnnotationTypesSection from "@/components/AnnotationTypesSection";
import QuickStartGuide from "@/components/QuickStartGuide";
import ResourcesSection from "@/components/ResourcesSection";
import Footer from "@/components/Footer";

const BuildAI = () => {
  return (
    <div className="min-h-screen bg-foreground">
      <Navbar variant="dark" />
      <main>
        <BuildAIHero />
        <TrustedBestSection />
        <DataEngineExplainer />
        <DataEngineSection />
        <AnnotationTypesSection />
        <QuickStartGuide />
        <ResourcesSection />
      </main>
      <Footer />
    </div>
  );
};

export default BuildAI;
