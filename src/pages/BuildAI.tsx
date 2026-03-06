import Navbar from "@/components/Navbar";
import DataEngineSection from "@/components/DataEngineSection";
import QuickStartGuide from "@/components/QuickStartGuide";
import Footer from "@/components/Footer";

const BuildAI = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <DataEngineSection />
        <QuickStartGuide />
      </main>
      <Footer />
    </div>
  );
};

export default BuildAI;
