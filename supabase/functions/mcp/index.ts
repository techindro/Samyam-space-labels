// supabase function: mcp
// Bundled from src/lib/mcp/index.ts by @lovable.dev/mcp-js.
// lovable-mcp-supabase-entry.ts
import mcp from "../../../src/lib/mcp/index.ts";
import { createSupabaseHandler } from "npm:@lovable.dev/mcp-js@0.22.2/stacks/supabase";

Deno.serve(createSupabaseHandler(mcp, { functionName: "mcp" }));
