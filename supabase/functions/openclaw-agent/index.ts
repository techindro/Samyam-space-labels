import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SYSTEM_PROMPT = `You are samyam's OpenClaw-backed operations agent.
samyam is a multimodal satellite data labeling platform for space and defense
(optical imagery, SAR, hyperspectral, sensor fusion, mission simulation, red-team probes).
Answer concisely and practically. If a request needs live platform data you do not have,
say what is missing instead of guessing.`;

const MAX_MESSAGE_LEN = 4000;
const MAX_MESSAGES = 20;

type ChatMessage = { role: "system" | "user" | "assistant"; content: string };

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  const json = (body: unknown, status = 200) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const gatewayUrl = Deno.env.get("OPENCLAW_GATEWAY_URL");
    const gatewayToken = Deno.env.get("OPENCLAW_GATEWAY_TOKEN");
    const model = Deno.env.get("OPENCLAW_MODEL") || "openclaw";

    if (!gatewayUrl) {
      return json({ error: "OpenClaw is not configured yet (missing gateway URL)." }, 503);
    }

    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return json({ error: "Invalid JSON body" }, 400);
    }

    const rawMessages = Array.isArray((body as any).messages)
      ? (body as any).messages
      : typeof (body as any).message === "string"
        ? [{ role: "user", content: (body as any).message }]
        : null;

    if (!rawMessages || rawMessages.length === 0) {
      return json({ error: "`message` (string) or `messages` (array) is required" }, 400);
    }
    if (rawMessages.length > MAX_MESSAGES) {
      return json({ error: `Too many messages (max ${MAX_MESSAGES})` }, 400);
    }

    const messages: ChatMessage[] = [];
    for (const m of rawMessages) {
      const role = m?.role;
      const content = m?.content;
      if (role !== "user" && role !== "assistant") {
        return json({ error: "Each message role must be 'user' or 'assistant'" }, 400);
      }
      if (typeof content !== "string" || content.length === 0) {
        return json({ error: "Each message needs non-empty string content" }, 400);
      }
      if (content.length > MAX_MESSAGE_LEN) {
        return json({ error: `Message too long (max ${MAX_MESSAGE_LEN} characters)` }, 400);
      }
      messages.push({ role, content });
    }

    const endpoint = `${gatewayUrl.replace(/\/+$/, "")}/v1/chat/completions`;

    const upstream = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(gatewayToken ? { Authorization: `Bearer ${gatewayToken}` } : {}),
      },
      body: JSON.stringify({
        model,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
        stream: false,
      }),
    });

    if (!upstream.ok) {
      const text = await upstream.text();
      console.error(`OpenClaw gateway error [${upstream.status}]: ${text}`);
      const status = upstream.status === 429 ? 429 : upstream.status === 401 ? 401 : 502;
      return json(
        {
          error:
            status === 401
              ? "OpenClaw gateway rejected the token."
              : status === 429
                ? "OpenClaw gateway is rate limited. Try again shortly."
                : "OpenClaw gateway request failed.",
          status: upstream.status,
        },
        status,
      );
    }

    const data = await upstream.json();
    const reply = data?.choices?.[0]?.message?.content ?? "";

    return json({ reply, model: data?.model ?? model });
  } catch (e) {
    console.error("openclaw-agent error:", e);
    return json({ error: "Internal server error" }, 500);
  }
});
