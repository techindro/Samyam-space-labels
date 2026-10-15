import { corsHeaders } from "../_shared/cors.ts";

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { email } = await req.json();

    if (!email || typeof email !== "string" || !email.includes("@")) {
      return new Response(
        JSON.stringify({ error: "Invalid email address." }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const fromEmail = Deno.env.get("RESEND_FROM_EMAIL") || "Samyam Space AI <onboarding@resend.dev>";

    // Generate 6-digit OTP
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

    if (!resendApiKey) {
      return new Response(
        JSON.stringify({
          success: true,
          message: "RESEND_API_KEY is not set in Supabase Secrets. Using dev mode.",
          devCode: otpCode,
        }),
        { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const html = `
    <!DOCTYPE html>
    <html>
    <body style="margin:0;padding:0;background-color:#050814;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
      <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#050814;padding:40px 16px;">
        <tr>
          <td align="center">
            <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#0c1020;border:1px solid rgba(255,255,255,0.1);border-radius:16px;overflow:hidden;">
              <tr>
                <td style="padding:32px 32px 20px;text-align:center;">
                  <h1 style="color:#ffffff;font-size:22px;font-weight:700;margin:0;">Samyam Space AI</h1>
                  <p style="color:#94a3b8;font-size:13px;margin:6px 0 0;">Satellite-Based Spatial Vision & Autonomy Platform</p>
                </td>
              </tr>
              <tr>
                <td style="padding:36px 32px;text-align:center;">
                  <p style="color:#e2e8f0;font-size:15px;margin:0 0 18px;">Your one-time login verification code is:</p>
                  <div style="display:inline-block;background:rgba(56,189,248,0.12);border:1px solid rgba(56,189,248,0.4);border-radius:12px;padding:14px 32px;font-size:38px;font-weight:800;letter-spacing:10px;color:#38bdf8;">
                    ${otpCode}
                  </div>
                  <p style="color:#94a3b8;font-size:13px;margin:22px 0 0;">
                    Valid for <strong>10 minutes</strong>. Do not share this code.
                  </p>
                </td>
              </tr>
              <tr>
                <td style="padding:20px 32px;background:rgba(0,0,0,0.3);text-align:center;">
                  <p style="color:#64748b;font-size:11px;margin:0;">
                    Dispatched securely via <strong>Resend</strong>
                  </p>
                </td>
              </tr>
            </table>
          </td>
        </tr>
      </table>
    </body>
    </html>
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: fromEmail,
        to: [email],
        subject: `Your Samyam Space AI Login Code: ${otpCode}`,
        html,
      }),
    });

    const resData = await res.json();

    if (!res.ok) {
      return new Response(
        JSON.stringify({ error: resData.message || "Failed to send email via Resend", details: resData }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ success: true, message: "OTP sent via Resend", id: resData.id }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
