import Navbar from "@/components/Navbar";
import DataEngineSection from "@/components/DataEngineSection";
import Footer from "@/components/Footer";

const BuildAI = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <DataEngineSection />
      </main>
      <Footer />
    </div>
  );
};

export default BuildAI;
