import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Send, CheckCircle } from "lucide-react";

const demoSchema = z.object({
  name: z.string().trim().min(1, "Name is required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  company: z.string().trim().max(100).optional(),
  role: z.string().trim().max(100).optional(),
  message: z.string().trim().max(1000).optional(),
});

type DemoForm = z.infer<typeof demoSchema>;

const BookDemo = () => {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const form = useForm<DemoForm>({
    resolver: zodResolver(demoSchema),
    defaultValues: { name: "", email: "", company: "", role: "", message: "" },
  });

  const onSubmit = async (data: DemoForm) => {
    setLoading(true);
    const { error } = await supabase.from("demo_requests").insert({
      name: data.name,
      email: data.email,
      company: data.company || null,
      role: data.role || null,
      message: data.message || null,
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
      <main className="container mx-auto px-4 py-24 max-w-lg">
        <Button variant="ghost" className="mb-6 text-muted-foreground" onClick={() => navigate("/")}>
          <ArrowLeft className="h-4 w-4 mr-2" /> Back to Home
        </Button>

        {submitted ? (
          <div className="text-center py-16 space-y-4">
            <CheckCircle className="h-16 w-16 text-cosmic-teal mx-auto" />
            <h2 className="font-display text-3xl font-bold">Thank You!</h2>
            <p className="text-muted-foreground">We've received your request and will be in touch shortly.</p>
            <Button onClick={() => navigate("/")} className="mt-4 bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground border-0">
              Return Home
            </Button>
          </div>
        ) : (
          <>
            <h1 className="font-display text-4xl font-bold mb-2">Book a Demo</h1>
            <p className="text-muted-foreground mb-8">Fill out the form and our team will get back to you within 24 hours.</p>

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <FormField control={form.control} name="name" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Full Name *</FormLabel>
                    <FormControl><Input placeholder="Jane Doe" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="email" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Work Email *</FormLabel>
                    <FormControl><Input type="email" placeholder="jane@company.com" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="company" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Company</FormLabel>
                    <FormControl><Input placeholder="Acme Corp" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="role" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Role</FormLabel>
                    <FormControl><Input placeholder="CTO" {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <FormField control={form.control} name="message" render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl><Textarea placeholder="Tell us about your use case..." {...field} /></FormControl>
                    <FormMessage />
                  </FormItem>
                )} />
                <Button type="submit" disabled={loading} className="w-full bg-gradient-to-r from-cosmic-purple to-cosmic-teal text-primary-foreground border-0">
                  {loading ? "Submitting..." : <><Send className="h-4 w-4 mr-2" /> Submit Request</>}
                </Button>
              </form>
            </Form>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default BookDemo;
