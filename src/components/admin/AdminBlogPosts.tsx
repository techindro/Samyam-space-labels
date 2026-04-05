import AdminCrudTable, { FieldDef } from "./AdminCrudTable";

const fields: FieldDef[] = [
  { name: "title", label: "Title", required: true },
  { name: "slug", label: "Slug", required: true },
  { name: "excerpt", label: "Excerpt", type: "textarea" },
  { name: "content", label: "Content", type: "textarea" },
  { name: "author", label: "Author" },
  { name: "cover_image_url", label: "Cover Image URL" },
  { name: "published", label: "Published", type: "boolean" },
];

const AdminBlogPosts = () => (
  <AdminCrudTable
    tableName="research_blog_posts"
    fields={fields}
    displayColumns={["title", "slug", "author", "published"]}
    title="Blog Posts"
  />
);

export default AdminBlogPosts;
