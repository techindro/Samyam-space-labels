import { createOpenAICompatible } from "npm:@ai-sdk/openai-compatible";

/**
 * Samyam AI Gateway Provider
 */
export function createSamyamAiGatewayProvider(apiKey: string) {
  const baseURL = Deno.env.get("AI_GATEWAY_URL") || "https://generativelanguage.googleapis.com/v1beta/openai";
  return createOpenAICompatible({
    name: "samyam-ai-gateway",
    baseURL,
    headers: { Authorization: `Bearer ${apiKey}` },
  });
}
