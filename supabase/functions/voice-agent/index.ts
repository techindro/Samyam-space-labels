import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const agentPrompts: Record<string, string> = {
  "Data Annotation": `You are Samyam's Data Annotation AI assistant. You help users understand and work with data annotation for space, defense, and AI applications. You can explain annotation types (bounding boxes, segmentation, classification), best practices, quality assurance, and how Samyam's annotation platform works. Keep responses concise (2-3 sentences) and conversational since this is a voice interface.`,
  "Model Evaluation": `You are Samyam's Model Evaluation AI assistant. You help users understand AI model evaluation metrics, benchmarks, and methodologies. You can discuss accuracy, precision, recall, F1 scores, confusion matrices, and how Samyam evaluates models for space and defense applications. Keep responses concise (2-3 sentences) and conversational since this is a voice interface.`,
  "Dataset Query": `You are Samyam's Dataset Query AI assistant. You help users explore and query datasets for AI training. You can discuss dataset formats, filtering, search strategies, data quality metrics, and how to find the right training data for space and defense AI models. Keep responses concise (2-3 sentences) and conversational since this is a voice interface.`,
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, agentType } = await req.json();

    if (typeof message !== "string" || typeof agentType !== "string" || !message || !agentType) {
      return new Response(
        JSON.stringify({ error: "message and agentType are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (message.length > 500) {
      return new Response(
        JSON.stringify({ error: "Message too long (max 500 characters)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const allowedAgents = ["Data Annotation", "Model Evaluation", "Dataset Query"];
    if (!allowedAgents.includes(agentType)) {
      return new Response(
        JSON.stringify({ error: "Invalid agentType" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }


    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    const systemPrompt = agentPrompts[agentType] || agentPrompts["Data Annotation"];

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: message },
        ],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI gateway error:", response.status, text);
      return new Response(JSON.stringify({ error: "AI processing failed" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content || "I couldn't process that. Please try again.";

    return new Response(JSON.stringify({ reply }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("voice-agent error:", e);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
