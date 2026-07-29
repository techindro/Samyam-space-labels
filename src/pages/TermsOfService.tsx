import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative overflow-hidden">
        <ParallelWebBg />
        <section className="py-20 relative z-10">
          <div className="container mx-auto px-4 max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <p className="text-xs uppercase tracking-widest text-muted-foreground mb-3">Legal</p>
              <h1 className="font-display text-4xl font-bold mb-2">Terms of Service</h1>
              <p className="text-muted-foreground text-sm mb-10">Last updated: July 29, 2026</p>

              <div className="prose prose-sm max-w-none space-y-8 text-foreground/80 leading-relaxed">
                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Acceptance of Terms</h2>
                  <p>
                    By accessing or using the Samyam platform ("Service"), you agree to be bound by these Terms of Service
                    ("Terms"). If you do not agree to these Terms, you may not access or use the Service.
                    These Terms constitute a legally binding agreement between you and Tech Indro (operating as "Samyam").
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. Eligibility</h2>
                  <p>
                    You must be at least 18 years of age to use this Service. By using the Service,
                    you represent and warrant that you meet this requirement and that you have the legal
                    authority to enter into these Terms on behalf of yourself or any organization you represent.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. Account Registration</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>You must provide accurate and complete information when creating an account.</li>
                    <li>You are responsible for maintaining the confidentiality of your login credentials.</li>
                    <li>You must notify us immediately of any unauthorized access to your account.</li>
                    <li>We reserve the right to suspend or terminate accounts that violate these Terms.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Acceptable Use</h2>
                  <p>You agree NOT to use the Service to:</p>
                  <ul className="list-disc pl-6 space-y-2 mt-2">
                    <li>Upload, store, or process any data you do not have rights to use.</li>
                    <li>Attempt to gain unauthorized access to any system or network.</li>
                    <li>Violate any applicable law, regulation, or third-party rights.</li>
                    <li>Reverse engineer, decompile, or disassemble any part of the Service.</li>
                    <li>Use the Service to train competing AI models without express written permission.</li>
                    <li>Upload content that is illegal, harmful, or violates privacy rights.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Intellectual Property</h2>
                  <p>
                    The Service, including all software, algorithms, UI, documentation, and branding,
                    is the exclusive property of Tech Indro / Samyam. You are granted a limited,
                    non-exclusive, non-transferable license to access and use the Service for your
                    internal business purposes.
                  </p>
                  <p className="mt-3">
                    You retain ownership of all data, labels, and content you upload to the platform.
                    By uploading content, you grant Samyam a limited license to process that content
                    solely for the purpose of providing the Service to you.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Payment & Billing</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Paid plans are billed monthly or annually as selected during subscription.</li>
                    <li>All prices are in Indian Rupees (INR) and exclusive of applicable taxes (GST).</li>
                    <li>Refunds are available within 7 days of initial purchase for annual plans.</li>
                    <li>We reserve the right to change pricing with 30 days' notice.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">7. Data & Confidentiality</h2>
                  <p>
                    We treat your uploaded data as confidential. We will not share your data with
                    third parties except as necessary to provide the Service or as required by law.
                    See our <Link to="/privacy" className="text-foreground underline underline-offset-4">Privacy Policy</Link> for
                    full details on how we handle your data.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">8. Service Availability</h2>
                  <p>
                    We aim for 99.5% uptime but do not guarantee uninterrupted service.
                    Scheduled maintenance will be communicated in advance. We are not liable for
                    any losses arising from temporary service unavailability.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">9. Limitation of Liability</h2>
                  <p>
                    To the fullest extent permitted by law, Samyam shall not be liable for any
                    indirect, incidental, special, or consequential damages arising from your use
                    of the Service. Our total liability shall not exceed the amount you paid us
                    in the 3 months preceding the claim.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">10. Governing Law</h2>
                  <p>
                    These Terms are governed by the laws of India. Any disputes arising from these
                    Terms shall be subject to the exclusive jurisdiction of courts in India.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">11. Changes to Terms</h2>
                  <p>
                    We may modify these Terms at any time. We will provide notice of material changes
                    via email or prominent notice on the platform. Continued use after changes
                    constitutes acceptance of the new Terms.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">12. Contact</h2>
                  <p>
                    For any questions about these Terms:{" "}
                    <a href="mailto:legal@samyam.ai" className="text-foreground underline underline-offset-4">legal@samyam.ai</a>
                  </p>
                </section>
              </div>

              <div className="mt-12 pt-8 border-t border-border/30 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link to="/contact" className="hover:text-foreground transition-colors">Contact Us</Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default TermsOfService;
