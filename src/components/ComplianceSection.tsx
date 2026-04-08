import { motion } from "framer-motion";
import { ShieldCheck } from "lucide-react";
import ParallelWebBg from "@/components/ParallelWebBg";

const badges = ["SOC 2 Type II", "ISO 27001", "ITAR Aware", "Data Encryption", "Access Controls"];

const ComplianceSection = () => {
  return (
    <section className="py-16 border-y border-border/30 relative overflow-hidden">
      <ParallelWebBg />
      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <ShieldCheck className="h-8 w-8 text-cosmic-teal mx-auto mb-4" />
          <p className="text-sm text-muted-foreground uppercase tracking-widest mb-8">
            Security & compliance standards we follow
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {badges.map((badge) => (
              <div
                key={badge}
                className="px-5 py-2.5 rounded-full border border-border/50 bg-secondary/30 text-sm font-medium text-muted-foreground"
              >
                {badge}
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default ComplianceSection;
