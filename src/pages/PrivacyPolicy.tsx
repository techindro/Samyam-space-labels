import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";

const PrivacyPolicy = () => {
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
              <h1 className="font-display text-4xl font-bold mb-2">Privacy Policy</h1>
              <p className="text-muted-foreground text-sm mb-10">Last updated: July 29, 2026</p>

              <div className="prose prose-sm max-w-none space-y-8 text-foreground/80 leading-relaxed">
                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">1. Who We Are</h2>
                  <p>
                    Samyam is an AI data infrastructure platform operated by Tech Indro (hereafter "Samyam", "we", "our", or "us").
                    Our registered address is in India. For any privacy-related queries, contact us at{" "}
                    <a href="mailto:privacy@samyam.ai" className="text-foreground underline underline-offset-4">privacy@samyam.ai</a>.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">2. What Data We Collect</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li><strong>Account Data:</strong> Name, email address, username when you register.</li>
                    <li><strong>Profile Data:</strong> Avatar, full name, role, company — when you optionally provide them.</li>
                    <li><strong>Usage Data:</strong> Pages visited, features used, API calls made — for improving the platform.</li>
                    <li><strong>Annotation Data:</strong> Any datasets, labels, or files you upload to our platform.</li>
                    <li><strong>Communication Data:</strong> Messages sent via contact forms or support emails.</li>
                    <li><strong>Technical Data:</strong> IP address, browser type, device info, cookies.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">3. How We Use Your Data</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>To provide and improve our annotation, evaluation, and AI services.</li>
                    <li>To authenticate your account and ensure security.</li>
                    <li>To send important service notifications and updates (not marketing without consent).</li>
                    <li>To respond to support requests and inquiries.</li>
                    <li>To comply with legal obligations under Indian IT law and applicable regulations.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">4. Data Storage & Security</h2>
                  <p>
                    Your data is stored securely on Supabase infrastructure (AWS-backed). We implement
                    industry-standard security measures including encryption at rest, TLS in transit,
                    and role-based access controls. We do not sell your personal data to third parties.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">5. Cookies</h2>
                  <p>
                    We use essential cookies for authentication and session management.
                    We may use analytics cookies (with your consent) to understand how our platform is used.
                    You can manage cookie preferences through our Cookie Consent settings.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">6. Your Rights</h2>
                  <ul className="list-disc pl-6 space-y-2">
                    <li>Access the data we hold about you.</li>
                    <li>Request correction of inaccurate data.</li>
                    <li>Request deletion of your account and associated data.</li>
                    <li>Export your data in a portable format.</li>
                    <li>Withdraw consent for optional data processing at any time.</li>
                  </ul>
                  <p className="mt-3">
                    To exercise these rights, email{" "}
                    <a href="mailto:privacy@samyam.ai" className="text-foreground underline underline-offset-4">privacy@samyam.ai</a>.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">7. Third-Party Services</h2>
                  <p>We use the following third-party services, each governed by their own privacy policies:</p>
                  <ul className="list-disc pl-6 space-y-1 mt-2">
                    <li>Supabase — database & authentication</li>
                    <li>Vercel / hosting infrastructure</li>
                    <li>Google Analytics (optional, consent-based)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">8. Changes to This Policy</h2>
                  <p>
                    We may update this policy from time to time. We will notify you of significant changes
                    by email or a prominent notice on our platform. The "Last updated" date above reflects
                    the most recent revision.
                  </p>
                </section>

                <section>
                  <h2 className="font-display text-xl font-semibold text-foreground mb-3">9. Contact</h2>
                  <p>
                    For any privacy concerns:{" "}
                    <a href="mailto:privacy@samyam.ai" className="text-foreground underline underline-offset-4">privacy@samyam.ai</a>
                    {" "}or use our{" "}
                    <Link to="/contact" className="text-foreground underline underline-offset-4">Contact page</Link>.
                  </p>
                </section>
              </div>

              <div className="mt-12 pt-8 border-t border-border/30 flex flex-wrap gap-4 text-sm text-muted-foreground">
                <Link to="/terms" className="hover:text-foreground transition-colors">Terms of Service</Link>
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

export default PrivacyPolicy;
