import { supabase } from "@/integrations/supabase/client";

const FASTAPI_URL = import.meta.env.VITE_FASTAPI_URL || "http://localhost:8000";

export interface SendOtpResult {
  success: boolean;
  message: string;
  delivery?: "resend_api" | "development_mode" | "supabase_smtp";
  devCode?: string;
  error?: string;
}

export interface VerifyOtpResult {
  success: boolean;
  verified: boolean;
  message: string;
  error?: string;
}

/**
 * Dispatches an OTP via Resend API or Supabase Custom SMTP
 */
export async function sendOtpViaResend(email: string): Promise<SendOtpResult> {
  const cleanEmail = email.trim().toLowerCase();

  // Candidate API base URLs: current origin (Vite dev server / production proxy) + FASTAPI_URL
  const candidateUrls = [
    "", // Relative to current domain (handled by Vite dev middleware or production ingress)
    FASTAPI_URL,
  ].filter((url, idx, arr) => url !== undefined && (idx === 0 || url !== arr[0]));

  // 1. Try Resend OTP API endpoints
  for (const baseUrl of candidateUrls) {
    try {
      const endpoint = `${baseUrl}/api/v1/auth/resend-otp/send`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail }),
      });

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          message: data.message || "OTP code dispatched via Resend.",
          delivery: data.delivery,
          devCode: data.dev_code,
        };
      }
    } catch (err) {
      // Endpoint unreachable, continue to next candidate
    }
  }

  // 2. Try Supabase Edge Function (send-resend-otp)
  try {
    const { data, error } = await supabase.functions.invoke("send-resend-otp", {
      body: { email: cleanEmail },
    });
    if (!error && data?.success) {
      return {
        success: true,
        message: data.message || "OTP code sent to your email via Resend.",
        delivery: "resend_api",
        devCode: data.devCode,
      };
    }
  } catch (err) {
    console.warn("[ResendAuth] Supabase function fallback...", err);
  }

  // 3. Fallback to Supabase native signInWithOtp (which uses Resend if SMTP is configured in Supabase)
  try {
    const { error } = await supabase.auth.signInWithOtp({ email: cleanEmail });
    if (error) {
      return {
        success: false,
        message: error.message,
        error: error.message,
      };
    }
    return {
      success: true,
      message: "Check your email for the one-time login code.",
      delivery: "supabase_smtp",
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || "Unable to dispatch OTP.",
      error: err.message,
    };
  }
}

/**
 * Verifies an OTP code (checks Resend store first, then Supabase verifyOtp)
 */
export async function verifyOtpViaResend(email: string, otp: string): Promise<VerifyOtpResult> {
  const cleanEmail = email.trim().toLowerCase();
  const cleanOtp = otp.trim();

  // Candidate API base URLs
  const candidateUrls = [
    "",
    FASTAPI_URL,
  ].filter((url, idx, arr) => url !== undefined && (idx === 0 || url !== arr[0]));

  // 1. Try Resend verification endpoints
  for (const baseUrl of candidateUrls) {
    try {
      const endpoint = `${baseUrl}/api/v1/auth/resend-otp/verify`;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, otp: cleanOtp }),
      });

      if (res.ok) {
        const data = await res.json();
        if (data.verified) {
          // Create local user session fallback if needed
          const sessionPayload = {
            user: {
              id: `usr_${cleanEmail.replace(/[^a-zA-Z0-9]/g, "_")}`,
              email: cleanEmail,
              user_metadata: { username: cleanEmail.split("@")[0] },
            },
            provider: "resend_otp",
          };
          localStorage.setItem("samyam_resend_session", JSON.stringify(sessionPayload));

          return {
            success: true,
            verified: true,
            message: data.message || "OTP verified successfully via Resend.",
          };
        }
      } else {
        const errData = await res.json().catch(() => ({}));
        console.warn("[ResendAuth] Verify response:", errData.detail || errData.message);
      }
    } catch (err) {
      // Continue to next candidate
    }
  }

  // 2. Try Supabase native verifyOtp
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      email: cleanEmail,
      token: cleanOtp,
      type: "email",
    });

    if (!error && data?.session) {
      return {
        success: true,
        verified: true,
        message: "Successfully signed in with Supabase.",
      };
    }

    if (error) {
      return {
        success: false,
        verified: false,
        message: error.message,
        error: error.message,
      };
    }
  } catch (err: any) {
    return {
      success: false,
      verified: false,
      message: err.message || "Verification failed.",
      error: err.message,
    };
  }

  return {
    success: false,
    verified: false,
    message: "Invalid or expired OTP code.",
  };
}
