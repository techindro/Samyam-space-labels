import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";
import { generateText, Output } from "npm:ai";
import { z } from "npm:zod";
import { createLovableAiGatewayProvider } from "../_shared/ai-gateway.ts";

const BodySchema = z.object({
  imageUrl: z.string().url().max(4000),
  mode: z.enum(["detect", "segment"]).default("detect"),
  candidateLabels: z.array(z.string().min(1).max(60)).min(1).max(30),
  // Optional focus point (normalized 0..1) used by segment mode
  pointX: z.number().min(0).max(1).optional(),
  pointY: z.number().min(0).max(1).optional(),
});

const DetectOutput = z.object({
  detections: z
    .array(
      z.object({
        label: z.string(),
        confidence: z.number().min(0).max(1),
        // normalized 0..1 [x, y, w, h]
        box: z.array(z.number().min(0).max(1)).length(4),
      }),
    )
    .max(20),
});

const SegmentOutput = z.object({
  label: z.string(),
  confidence: z.number().min(0).max(1),
  // normalized 0..1 polygon [[x,y], ...]
  polygon: z.array(z.array(z.number().min(0).max(1)).length(2)).min(3).max(40),
});

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const apiKey = Deno.env.get("LOVABLE_API_KEY");
    if (!apiKey) {
      return new Response(JSON.stringify({ error: "AI is not configured" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) {
      return new Response(JSON.stringify({ error: parsed.error.flatten().fieldErrors }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { imageUrl, mode, candidateLabels, pointX, pointY } = parsed.data;

    const gateway = createLovableAiGatewayProvider(apiKey);
    const model = gateway("google/gemini-3.6-flash");

    const system =
      "You are a precise vision pre-labeling engine for satellite, aerial, SAR and ground imagery. " +
      "All coordinates you output are normalized to the image size, in the range 0 to 1, with origin at the top-left. " +
      "Only report objects you can actually see. Never invent objects.";

    const instruction =
      mode === "segment"
        ? `Segment the single most salient object${
            pointX !== undefined && pointY !== undefined
              ? ` located near normalized point (${pointX.toFixed(3)}, ${pointY.toFixed(3)})`
              : ""
          }. Return a tight outline polygon (8-24 points) tracing the object boundary, the best matching label from this list if one fits, otherwise a short descriptive label. Candidate labels: ${candidateLabels.join(", ")}.`
        : `Detect every clearly visible instance of these classes: ${candidateLabels.join(
            ", ",
          )}. Return up to 12 tight bounding boxes as [x, y, width, height] normalized to the image. Prefer precision over recall; skip anything below 0.35 confidence.`;

    const result = await generateText({
      model,
      system,
      output:
        mode === "segment"
          ? Output.object({ schema: SegmentOutput })
          : Output.object({ schema: DetectOutput }),
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: instruction },
            { type: "image", image: new URL(imageUrl) },
          ],
        },
      ],
    });

    const output = await result.output;

    return new Response(JSON.stringify({ mode, ...output }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "";
    const status = message.includes("429") ? 429 : message.includes("402") ? 402 : 500;
    console.error("[ai-prelabel] error", err);
    return new Response(
      JSON.stringify({
        error:
          status === 429
            ? "Rate limit reached. Please retry in a moment."
            : status === 402
              ? "AI credits exhausted. Please add credits to continue."
              : "Internal server error",
      }),
      { status, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
