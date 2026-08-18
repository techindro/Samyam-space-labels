import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@^2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const samyamKnowledgeBase = `
ABOUT SAMYAM (SamyamLM):
Samyam is India's sovereign AI platform for Space Tech, Defense (MoD, DRDO, Armed Forces), ISRO satellite intelligence, and Enterprise Data Labeling.

PRODUCTS & CAPABILITIES:
1. Data Engine: Version-controlled, quality-scored datasets with reviewer audit trails for training AI models.
2. Model Evaluation & RLHF: Benchmark foundation and fine-tuned models with reproducible scoring, regression alerts, and pairwise human preference alignment.
3. Geospatial Labeling & Vision: Sub-pixel annotation of Electro-Optical (EO), Synthetic Aperture Radar (SAR), and Infrared (IR) satellite imagery. Exports in MS-COCO, YOLOv8, GeoJSON GIS, and Pascal VOC XML.
4. Sensor Fusion Datasets: Time-aligned multi-modal records combining SAR, EO/IR, radar, and telemetry with per-modality quality scoring.
5. Space & ISRO Telemetry: Real-time spacecraft downlink anomaly detection, orbital telemetry monitoring, PSLV/GSLV/SSLV launch trajectory evaluation, space debris tracking (conjunction analysis), and Chandrayaan lunar surface mapping.
6. Defense & Security (MoD, DRDO, Armed Forces, NTRO, BSF, Coast Guard): Tri-service data labeling, ITAR-aware workflows, air-gapped on-premise deployments, GEOINT, pattern-of-life detection, and 24/7 LoC/LAC border surveillance.
7. Indic Multilingual & Voice AI: Support for 22 Indian languages, Samyam Voice V1 (TTS), Samyam Scribe V1 (STT), IndicVQA multimodal models, and direct Hindi/Tamil/Telugu/Marathi voice-driven bounding box annotation.
8. CLI & Developer APIs: Command-line tool (samyamlm), vision pre-labeling APIs, document digitisation, and MeitY-empanelled cloud hosting.
9. Pricing & Enterprise: Free Tier for developers, Pro Tier for teams, and Enterprise/Defense Tier for air-gapped classified deployments.
`;

const agentPrompts: Record<string, string> = {
  "Data Annotation": `You are Samyam's Data Annotation AI assistant. ${samyamKnowledgeBase}
You answer ANY question related to Samyam, data annotation, satellite imagery labeling, ISRO datasets, defense workflows, export formats, or user tasks. Use list_my_annotation_tasks when the user asks about their tasks. Keep responses concise (2-3 sentences), helpful, and conversational. NEVER repeat the user's question back to them. Answer directly and naturally.`,
  "Model Evaluation": `You are Samyam's Model Evaluation AI assistant. ${samyamKnowledgeBase}
You answer ANY question related to Samyam, model benchmarking, RLHF alignment, red-team safety probes, launch trajectory evaluation, or evaluation metrics. Use list_evaluation_runs when the user asks about model evaluations. Keep responses concise (2-3 sentences), helpful, and conversational. NEVER repeat the user's question back to them. Answer directly and naturally.`,
  "Dataset Query": `You are Samyam's Dataset Query AI assistant. ${samyamKnowledgeBase}
You answer ANY question related to Samyam, space & defense training datasets, ISRO satellite tiles, sensor fusion, space debris, lunar maps, or developer APIs. Use list_datasets when the user asks about datasets. Keep responses concise (2-3 sentences), helpful, and conversational. NEVER repeat the user's question back to them. Answer directly and naturally.`,
};

const tools = [
  {
    type: "function",
    function: {
      name: "list_my_annotation_tasks",
      description: "List annotation tasks the user has access to. Call this if the user asks about their tasks or wants to view work.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "integer", description: "Max tasks to return (default 25)." },
          status: { type: "string", description: "Optional status filter (open, in_progress, submitted, approved, rejected)." }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_datasets",
      description: "List training datasets visible to the user. Call this when the user asks about available datasets.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "integer", description: "Max datasets to return (default 25)." }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_evaluation_runs",
      description: "List model evaluation runs. Call this when the user asks about model evaluations, status of evaluations, or scores.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "integer", description: "Max runs to return (default 25)." },
          status: { type: "string", description: "Optional status filter (queued, running, completed, failed)." }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_research_papers",
      description: "List published research papers with title, abstract, authors, and PDF URL.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "integer", description: "Max number of papers to return (default 20)." },
          search: { type: "string", description: "Optional search term to filter by title." }
        }
      }
    }
  },
  {
    type: "function",
    function: {
      name: "list_blog_posts",
      description: "List research blog posts.",
      parameters: {
        type: "object",
        properties: {
          limit: { type: "integer", description: "Max posts to return (default 20)." }
        }
      }
    }
  }
];

async function handleToolCall(supabaseClient: any, name: string, args: any) {
  switch (name) {
    case "list_my_annotation_tasks": {
      let query = supabaseClient
        .from("annotation_tasks")
        .select("*")
        .order("created_at", { ascending: false });
      if (args.status) {
        query = query.eq("status", args.status);
      }
      query = query.limit(args.limit ?? 25);
      const { data, error } = await query;
      if (error) throw error;
      return { tasks: data };
    }
    case "list_datasets": {
      const { data, error } = await supabaseClient
        .from("datasets")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(args.limit ?? 25);
      if (error) throw error;
      return { datasets: data };
    }
    case "list_evaluation_runs": {
      let query = supabaseClient
        .from("evaluation_runs")
        .select("*")
        .order("created_at", { ascending: false });
      if (args.status) {
        query = query.eq("status", args.status);
      }
      query = query.limit(args.limit ?? 25);
      const { data, error } = await query;
      if (error) throw error;
      return { evaluations: data };
    }
    case "list_research_papers": {
      let query = supabaseClient
        .from("research_papers")
        .select("id, title, abstract, authors, tags, pdf_url, published_date")
        .order("published_date", { ascending: false });
      if (args.search) {
        query = query.ilike("title", `%${args.search}%`);
      }
      query = query.limit(args.limit ?? 20);
      const { data, error } = await query;
      if (error) throw error;
      return { papers: data };
    }
    case "list_blog_posts": {
      const { data, error } = await supabaseClient
        .from("research_blog_posts")
        .select("id, title, excerpt, author, published_at, slug")
        .order("published_at", { ascending: false })
        .limit(args.limit ?? 20);
      if (error) throw error;
      return { posts: data };
    }
    default:
      throw new Error(`Tool ${name} not found`);
  }
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, agentType, userInfo } = await req.json();

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

    const apiKey = Deno.env.get("AI_API_KEY") || Deno.env.get("GEMINI_API_KEY") || Deno.env.get("OPENAI_API_KEY");
    if (!apiKey) {
      throw new Error("AI_API_KEY, GEMINI_API_KEY, or OPENAI_API_KEY is not configured");
    }

    const aiGatewayUrl = Deno.env.get("AI_GATEWAY_URL") || "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions";

    // Set up Supabase client with user's authentication headers if available
    const authHeader = req.headers.get("Authorization") || "";
    const supabaseUrl = Deno.env.get("SUPABASE_URL") ?? "";
    const supabaseServiceRole = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
    const supabaseClient = createClient(supabaseUrl, supabaseServiceRole, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: authHeader ? { Authorization: authHeader } : undefined,
      },
    });

    let systemPrompt = agentPrompts[agentType] || agentPrompts["Data Annotation"];
    if (userInfo && (userInfo.name || userInfo.email)) {
      const nameStr = userInfo.name || userInfo.email.split("@")[0];
      systemPrompt += ` The active user interacting with you is ${nameStr} (email: ${userInfo.email}, ID: ${userInfo.id}). Address them directly by name, personalize your responses to their specific tasks, datasets, and account status, and provide helpful guidance as their personal Samyam AI assistant.`;
    } else {
      systemPrompt += ` The user is currently visiting as an unauthenticated guest. If they ask about their profile, account, or tasks, warmly advise them to sign in to access their personalized workspace.`;
    }

    const messages: any[] = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ];

    // First call to AI gateway with tool definitions
    let response = await fetch(aiGatewayUrl, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages,
        tools,
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

    let data = await response.json();
    let assistantMessage = data.choices?.[0]?.message;

    // Check for tool calls
    if (assistantMessage?.tool_calls && assistantMessage.tool_calls.length > 0) {
      // Append assistant's decision to call tools to the messages history
      messages.push(assistantMessage);

      // Execute each requested tool call
      for (const toolCall of assistantMessage.tool_calls) {
        const { name, arguments: argsString } = toolCall.function;
        let args = {};
        try {
          args = JSON.parse(argsString);
        } catch (e) {
          console.error(`Failed to parse arguments for tool ${name}:`, e);
        }

        try {
          const result = await handleToolCall(supabaseClient, name, args);
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: name,
            content: JSON.stringify(result),
          });
        } catch (error: any) {
          console.error(`Error executing tool ${name}:`, error);
          messages.push({
            role: "tool",
            tool_call_id: toolCall.id,
            name: name,
            content: JSON.stringify({ error: error.message || String(error) }),
          });
        }
      }

      // Second call to AI gateway with tool results
      response = await fetch(aiGatewayUrl, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-3-flash-preview",
          messages,
        }),
      });

      if (!response.ok) {
        const text = await response.text();
        console.error("AI gateway error after tool execution:", response.status, text);
        return new Response(JSON.stringify({ error: "AI processing failed after tool call" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      data = await response.json();
      assistantMessage = data.choices?.[0]?.message;
    }

    const reply = assistantMessage?.content || "I couldn't process that. Please try again.";

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
