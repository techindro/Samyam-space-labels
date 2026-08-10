import { createOpenAICompatible } from "npm:@ai-sdk/openai-compatible";

/**
 * Provider bound to the Lovable AI Gateway.
 * The API key is sent via the `Lovable-API-Key` header (never `Authorization`).
 */
export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "lovable-gateway",
    baseURL: "https://ai.gateway.lovable.dev/v1",
    headers: { "Lovable-API-Key": apiKey },
  });
}
