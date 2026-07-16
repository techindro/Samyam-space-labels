import { auth, defineMcp } from "@lovable.dev/mcp-js";
import listResearchPapers from "./tools/list-research-papers";
import listBlogPosts from "./tools/list-blog-posts";
import listDatasets from "./tools/list-datasets";
import listMyAnnotationTasks from "./tools/list-my-annotation-tasks";

const projectRef = import.meta.env.VITE_SUPABASE_PROJECT_ID ?? "project-ref-unset";

export default defineMcp({
  name: "samyam-mcp",
  title: "samyam",
  version: "0.1.0",
  instructions:
    "Tools for samyam's satellite data labeling platform. Read research papers, blog posts, datasets, and the signed-in user's annotation tasks. All data access respects the signed-in user's permissions.",
  auth: auth.oauth.issuer({
    issuer: `https://${projectRef}.supabase.co/auth/v1`,
    acceptedAudiences: "authenticated",
  }),
  tools: [listResearchPapers, listBlogPosts, listDatasets, listMyAnnotationTasks],
});
