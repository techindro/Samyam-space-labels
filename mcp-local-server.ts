import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import listResearchPapers from "./src/lib/mcp/tools/list-research-papers";
import listBlogPosts from "./src/lib/mcp/tools/list-blog-posts";
import listDatasets from "./src/lib/mcp/tools/list-datasets";
import listMyAnnotationTasks from "./src/lib/mcp/tools/list-my-annotation-tasks";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get current directory of this script
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load .env variables from the script directory
const envPath = path.resolve(__dirname, "./.env");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf8");
  envContent.split("\n").forEach(line => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || "";
      if (value.startsWith('"') && value.endsWith('"')) {
        value = value.slice(1, -1);
      }
      process.env[key] = value;
    }
  });
}

// Ensure VITE_SUPABASE_URL is mapped to SUPABASE_URL for the tools
if (!process.env.SUPABASE_URL && process.env.VITE_SUPABASE_URL) {
  process.env.SUPABASE_URL = process.env.VITE_SUPABASE_URL;
}
if (!process.env.SUPABASE_PUBLISHABLE_KEY && process.env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  process.env.SUPABASE_PUBLISHABLE_KEY = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
}

const server = new McpServer({
  name: "samyam-local-mcp",
  version: "0.1.0",
});

const tools = [
  listResearchPapers,
  listBlogPosts,
  listDatasets,
  listMyAnnotationTasks
];

for (const tool of tools) {
  const toolName = tool.name;
  const toolDesc = tool.description || tool.title || "";
  const toolSchema = tool.inputSchema;
  
  server.tool(
    toolName,
    toolDesc,
    toolSchema,
    async (args) => {
      // Mock Context
      const ctx = {
        isAuthenticated: () => true,
        getToken: () => process.env.SUPABASE_PUBLISHABLE_KEY || "",
      };
      
      try {
        const result = await tool.handler(args, ctx as any);
        return {
          content: result.content,
          isError: result.isError || false
        };
      } catch (error: any) {
        return {
          content: [{ type: "text", text: `Error: ${error.message || error}` }],
          isError: true
        };
      }
    }
  );
}

async function start() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("Samyam Local MCP Server running on stdio");
}

start().catch(err => {
  console.error("Server failure:", err);
  process.exit(1);
});
