import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// Resend OTP Development Server Plugin
// Handles sending and verifying OTP via Resend API directly in Vite dev server
function resendOtpDevPlugin(env: Record<string, string>) {
  const otpStore = new Map<string, { otp: string; expiresAt: number }>();
  const apiKey = env.RESEND_API_KEY || process.env.RESEND_API_KEY || env.VITE_RESEND_API_KEY || "";
  const fromEmail = env.RESEND_FROM_EMAIL || process.env.RESEND_FROM_EMAIL || env.VITE_RESEND_FROM_EMAIL || "Samyam Space AI <onboarding@resend.dev>";

  return {
    name: "resend-otp-dev-plugin",
    configureServer(server: any) {
      server.middlewares.use(async (req: any, res: any, next: any) => {
        const url = req.url?.split("?")[0];

        // Status endpoint
        if (url === "/api/v1/auth/resend-otp/status" && req.method === "GET") {
          res.writeHead(200, { "Content-Type": "application/json" });
          return res.end(JSON.stringify({
            resend_configured: Boolean(apiKey && apiKey.length > 5),
            from_email: fromEmail,
            active_otps: otpStore.size,
          }));
        }

        // Send OTP endpoint
        if (url === "/api/v1/auth/resend-otp/send" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk: any) => { body += chunk; });
          req.on("end", async () => {
            try {
              const { email } = JSON.parse(body || "{}");
              if (!email || typeof email !== "string" || !email.includes("@")) {
                res.writeHead(400, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({ detail: "Invalid email address format." }));
              }
              const cleanEmail = email.trim().toLowerCase();
              const otpCode = Math.floor(100000 + Math.random() * 900000).toString();
              otpStore.set(cleanEmail, {
                otp: otpCode,
                expiresAt: Date.now() + 10 * 60 * 1000,
              });

              let delivery = "development_mode";
              let devCode: string | undefined = otpCode;
              let message = "OTP generated in Development Mode.";

              if (apiKey) {
                try {
                  const html = `
                    <div style="background:#050814;color:#fff;padding:32px;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;text-align:center;border-radius:12px;">
                      <h2 style="color:#38bdf8;margin:0 0 8px;">Samyam Space AI</h2>
                      <p style="color:#94a3b8;font-size:14px;margin:0 0 24px;">Spatial Vision AI & Data Labeling Platform</p>
                      <p style="color:#e2e8f0;font-size:15px;margin:0 0 16px;">Your one-time login verification code is:</p>
                      <div style="background:rgba(56,189,248,0.15);border:1px solid #38bdf8;border-radius:8px;padding:14px 28px;font-size:36px;letter-spacing:8px;font-weight:bold;color:#38bdf8;display:inline-block;">
                        ${otpCode}
                      </div>
                      <p style="color:#94a3b8;font-size:13px;margin:20px 0 0;">Valid for 10 minutes. Sent securely via <strong>Resend</strong>.</p>
                    </div>
                  `;
                  const emailRes = await fetch("https://api.resend.com/emails", {
                    method: "POST",
                    headers: {
                      "Authorization": `Bearer ${apiKey}`,
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      from: fromEmail,
                      to: [cleanEmail],
                      subject: `Your Samyam Space AI Login Code: ${otpCode}`,
                      html,
                    }),
                  });
                  const emailData = await emailRes.json().catch(() => ({}));
                  if (emailRes.ok) {
                    delivery = "resend_api";
                    devCode = undefined;
                    message = "OTP dispatched successfully via Resend.";
                  } else {
                    console.warn("[Resend Dev Server] Status:", emailRes.status, emailData);
                    message = `OTP generated (Resend API response: ${emailData.message || emailRes.status}). Dev code available.`;
                  }
                } catch (e: any) {
                  console.warn("[Resend Dev Server] Dispatch error:", e.message);
                }
              }

              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({
                success: true,
                message,
                delivery,
                dev_code: devCode,
              }));
            } catch (err: any) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ detail: err.message || "Failed to process request" }));
            }
          });
          return;
        }

        // Verify OTP endpoint
        if (url === "/api/v1/auth/resend-otp/verify" && req.method === "POST") {
          let body = "";
          req.on("data", (chunk: any) => { body += chunk; });
          req.on("end", async () => {
            try {
              const { email, otp } = JSON.parse(body || "{}");
              const cleanEmail = (email || "").trim().toLowerCase();
              const cleanOtp = (otp || "").trim();
              const record = otpStore.get(cleanEmail);

              if (record && record.otp === cleanOtp && Date.now() < record.expiresAt) {
                otpStore.delete(cleanEmail);
                res.writeHead(200, { "Content-Type": "application/json" });
                return res.end(JSON.stringify({
                  success: true,
                  verified: true,
                  message: "OTP verified successfully via Resend.",
                }));
              }

              res.writeHead(400, { "Content-Type": "application/json" });
              res.end(JSON.stringify({
                success: false,
                verified: false,
                detail: "Invalid or expired OTP code.",
              }));
            } catch (err: any) {
              res.writeHead(500, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ detail: err.message || "Failed to verify" }));
            }
          });
          return;
        }

        next();
      });
    },
  };
}

// https://vitejs.dev
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  return {
    server: {
      host: true,
      port: 8080,
      hmr: {
        overlay: false,
      },
    },

    preview: {
      host: true,
      strictPort: true,
      allowedHosts: [
        "samyam-space-labels-1.onrender.com",
        ".onrender.com"
      ]
    },
    plugins: [react(), resendOtpDevPlugin(env)],
  optimizeDeps: {
    esbuildOptions: {
      sourcemap: false,
    },
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("node_modules")) {
            if (id.includes("three") || id.includes("@react-three")) {
              return "three-vendor";
            }
            if (id.includes("recharts")) {
              return "recharts-vendor";
            }
            if (id.includes("@aws-sdk")) {
              return "aws-vendor";
            }
            if (id.includes("@supabase")) {
              return "supabase-vendor";
            }
            if (id.includes("lucide-react")) {
              return "icons-vendor";
            }
            if (id.includes("@radix-ui")) {
              return "radix-vendor";
            }
            if (id.includes("framer-motion")) {
              return "framer-vendor";
            }
          }
        },
      },
    },
  },
};
});

