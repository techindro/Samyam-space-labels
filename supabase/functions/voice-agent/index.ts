import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@^2.95.3";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const agentPrompts: Record<string, string> = {
  "Data Annotation": `You are Samyam's Data Annotation AI assistant. You help users understand and work with data annotation for space, defense, and AI applications. You have access to real-time tools to list annotation tasks. If the user asks about their tasks or what work needs to be done, use list_my_annotation_tasks to fetch them. Keep responses concise (2-3 sentences) and conversational since this is a voice interface.`,
  "Model Evaluation": `You are Samyam's Model Evaluation AI assistant. You help users understand AI model evaluation metrics, benchmarks, and methodologies. You have access to real-time tools to list evaluation runs. If the user asks about model evaluations, status, or scores, use list_evaluation_runs to fetch them. Keep responses concise (2-3 sentences) and conversational since this is a voice interface.`,
  "Dataset Query": `You are Samyam's Dataset Query AI assistant. You help users explore and query datasets for AI training. You have access to real-time tools to list datasets. If the user asks about available datasets or training data, use list_datasets to fetch them. Keep responses concise (2-3 sentences) and conversational since this is a voice interface.`,
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

    const systemPrompt = agentPrompts[agentType] || agentPrompts["Data Annotation"];

    let messages = [
      { role: "system", content: systemPrompt },
      { role: "user", content: message },
    ];

    // First call to Lovable AI gateway with tool definitions
    let response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
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

      // Second call to Lovable AI gateway with tool results
      response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
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
