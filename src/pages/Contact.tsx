import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone, Send, CheckCircle, MessageSquare, Clock, Linkedin } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ParallelWebBg from "@/components/ParallelWebBg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";

const contactSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  company: z.string().trim().max(100).optional(),
  subject: z.string().trim().min(1, "Subject is required").max(200),
  message: z.string().trim().min(10, "Message must be at least 10 characters").max(2000),
});

type ContactForm = z.infer<typeof contactSchema>;

const contactInfo = [
  {
    icon: Mail,
    label: "Email",
    value: "hello@samyam.ai",
    href: "mailto:hello@samyam.ai",
  },
  {
    icon: Linkedin,
    label: "LinkedIn",
    value: "Tech Indro",
    href: "https://www.linkedin.com/company/tech-indro",
  },
  {
    icon: MapPin,
    label: "Location",
    value: "Remote (India)",
    href: null,
  },
  {
    icon: Clock,
    label: "Response Time",
    value: "Within 24 hours",
    href: null,
  },
];

const Contact = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactForm>({
    resolver: zodResolver(contactSchema),
    defaultValues: { name: "", email: "", company: "", subject: "", message: "" },
  });

  const onSubmit = async (data: ContactForm) => {
    setLoading(true);
    // Store as a demo request with the subject/message
    const { error } = await supabase.from("demo_requests").insert({
      name: data.name,
      email: data.email,
      company: data.company || null,
      role: data.subject,
      message: data.message,
    });
    setLoading(false);

    if (error) {
      toast({ title: "Error", description: "Something went wrong. Please try again.", variant: "destructive" });
      return;
    }
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="relative overflow-hidden">
        <ParallelWebBg />
        <div className="absolute inset-0 bg-gradient-to-b from-cosmic-teal/5 via-transparent to-transparent pointer-events-none" />

        <section className="py-24 relative z-10">
          <div className="container mx-auto px-4 max-w-5xl">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center mb-16"
            >
              <div className="inline-flex items-center gap-2 mb-4 px-4 py-1.5 rounded-full border border-border bg-secondary/50">
                <MessageSquare className="h-3.5 w-3.5 text-cosmic-teal" />
                <span className="text-xs font-medium tracking-widest uppercase text-muted-foreground">Contact Us</span>
              </div>
              <h1 className="font-display text-4xl md:text-6xl font-bold mb-4">
                Get in{" "}
                <span className="bg-gradient-to-r from-cosmic-purple-glow to-cosmic-teal bg-clip-text text-transparent">
                  Touch
                </span>
              </h1>
              <p className="text-muted-foreground max-w-lg mx-auto">
                Have a question, partnership inquiry, or just want to say hello? We read every message.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-5 gap-10">
              {/* Contact Info */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="md:col-span-2 space-y-4"
              >
                <h2 className="font-display font-semibold text-lg mb-6">Contact Information</h2>
                {contactInfo.map((info) => {
                  const Icon = info.icon;
                  return (
                    <div key={info.label} className="glass-card rounded-xl p-4 flex items-start gap-4">
                      <div className="p-2.5 rounded-lg bg-secondary shrink-0">
                        <Icon className="h-4 w-4" />
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">{info.label}</p>
                        {info.href ? (
                          <a
                            href={info.href}
                            target={info.href.startsWith("http") ? "_blank" : undefined}
                            rel={info.href.startsWith("http") ? "noopener noreferrer" : undefined}
                            className="text-sm font-medium hover:text-cosmic-teal transition-colors"
                          >
                            {info.value}
                          </a>
                        ) : (
                          <p className="text-sm font-medium">{info.value}</p>
                        )}
                      </div>
                    </div>
                  );
                })}

                <div className="glass-card rounded-xl p-5 mt-6">
                  <p className="text-sm font-semibold mb-1">For Demo & Sales</p>
                  <p className="text-xs text-muted-foreground mb-3">
                    Looking to see Samyam in action? Book a personalised demo with our team.
                  </p>
                  <a
                    href="/book-demo"
                    className="text-xs font-medium text-cosmic-teal hover:underline inline-flex items-center gap-1"
                  >
                    Book a Demo →
                  </a>
                </div>
              </motion.div>

              {/* Form */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="md:col-span-3"
              >
                {submitted ? (
                  <div className="glass-card rounded-2xl p-12 text-center space-y-4 h-full flex flex-col items-center justify-center">
                    <CheckCircle className="h-16 w-16 text-cosmic-teal mx-auto" />
                    <h2 className="font-display text-2xl font-bold">Message Sent!</h2>
                    <p className="text-muted-foreground text-sm max-w-sm">
                      Thanks for reaching out. We'll get back to you within 24 hours.
                    </p>
                    <Button
                      onClick={() => { setSubmitted(false); form.reset(); }}
                      variant="outline"
                      className="mt-2"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <div className="glass-card rounded-2xl p-8">
                    <h2 className="font-display text-xl font-semibold mb-6">Send us a message</h2>
                    <Form {...form}>
                      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField control={form.control} name="name" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name *</FormLabel>
                              <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="email" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email *</FormLabel>
                              <FormControl><Input type="email" placeholder="jane@company.com" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <div className="grid sm:grid-cols-2 gap-4">
                          <FormField control={form.control} name="company" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Company</FormLabel>
                              <FormControl><Input placeholder="ISRO / Acme Corp" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                          <FormField control={form.control} name="subject" render={({ field }) => (
                            <FormItem>
                              <FormLabel>Subject *</FormLabel>
                              <FormControl><Input placeholder="Partnership inquiry" {...field} /></FormControl>
                              <FormMessage />
                            </FormItem>
                          )} />
                        </div>
                        <FormField control={form.control} name="message" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Message *</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Tell us how we can help..."
                                className="min-h-[140px] resize-none"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )} />
                        <Button
                          type="submit"
                          disabled={loading}
                          className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground border-0 hover:opacity-90"
                        >
                          {loading ? "Sending..." : <><Send className="h-4 w-4 mr-2" /> Send Message</>}
                        </Button>
                      </form>
                    </Form>
                  </div>
                )}
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;
