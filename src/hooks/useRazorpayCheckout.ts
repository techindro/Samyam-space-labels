import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";

// ── Razorpay Window augmentation ──────────────────────────────────────────────
interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  image?: string;
  order_id?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  notes?: Record<string, string>;
  theme?: { color?: string };
  handler: (response: RazorpaySuccessResponse) => void;
  modal?: { ondismiss?: () => void };
}

interface RazorpaySuccessResponse {
  razorpay_payment_id: string;
  razorpay_order_id?: string;
  razorpay_signature?: string;
}

interface RazorpayInstance {
  open: () => void;
  on: (event: string, handler: (response: unknown) => void) => void;
}

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

// ── Hook types ────────────────────────────────────────────────────────────────
export interface InitiatePaymentParams {
  /** Amount in paise (e.g., 999900 = ₹9,999) */
  amount: number;
  /** Plan or product name shown in checkout */
  planName: string;
  /** Optional user info for prefill */
  userName?: string;
  userEmail?: string;
  userPhone?: string;
  /** Callback on successful payment */
  onSuccess?: (data: { paymentId: string }) => void;
}

export function useRazorpayCheckout() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const initiatePayment = useCallback(
    async ({
      amount,
      planName,
      userName,
      userEmail,
      userPhone,
      onSuccess,
    }: InitiatePaymentParams) => {
      setIsLoading(true);
      setError(null);

      try {
        // Verify Razorpay SDK is loaded
        if (typeof window.Razorpay === "undefined") {
          throw new Error(
            "Razorpay SDK not loaded. Please check your internet connection and try again."
          );
        }

        const keyId = import.meta.env.VITE_RAZORPAY_KEY_ID;
        if (!keyId || keyId.includes("XXXX")) {
          throw new Error(
            "Razorpay Key ID not configured. Please set VITE_RAZORPAY_KEY_ID in .env"
          );
        }

        // Open Razorpay Checkout directly (no server-side order creation needed)
        const options: RazorpayOptions = {
          key: keyId,
          amount, // amount in paise
          currency: "INR",
          name: "Samyam",
          description: `${planName} Plan Subscription`,
          image: "/samyam-logo.jpg",
          prefill: {
            name: userName || "",
            email: userEmail || "",
            contact: userPhone || "",
          },
          notes: { plan: planName },
          theme: { color: "#6366f1" },
          handler: (response: RazorpaySuccessResponse) => {
            // Payment successful
            setIsLoading(false);

            toast({
              title: "✓ Payment Successful!",
              description: `Your ${planName} plan subscription is now active. Payment ID: ${response.razorpay_payment_id}`,
            });

            onSuccess?.({
              paymentId: response.razorpay_payment_id,
            });
          },
          modal: {
            ondismiss: () => {
              setIsLoading(false);
              toast({
                title: "Payment Cancelled",
                description:
                  "You closed the payment window. No charges were made.",
              });
            },
          },
        };

        const rzp = new window.Razorpay(options);

        rzp.on("payment.failed", (response: unknown) => {
          const failedResponse = response as {
            error?: { description?: string; reason?: string };
          };
          const reason =
            failedResponse?.error?.description ||
            failedResponse?.error?.reason ||
            "Payment failed. Please try again.";
          setError(reason);
          setIsLoading(false);
          toast({
            title: "Payment Failed",
            description: reason,
            variant: "destructive",
          });
        });

        rzp.open();
      } catch (err) {
        const msg =
          err instanceof Error ? err.message : "An unexpected error occurred.";
        setError(msg);
        setIsLoading(false);
        toast({
          title: "Payment Error",
          description: msg,
          variant: "destructive",
        });
      }
    },
    [toast]
  );

  return { initiatePayment, isLoading, error };
}
