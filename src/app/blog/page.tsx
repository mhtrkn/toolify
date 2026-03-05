import Breadcrumb from "@/components/layout/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPosts } from "@/lib/blog-data";
import { buildBreadcrumbSchema, buildCollectionPageSchema } from "@/lib/structured-data";
import { buildMetadata, SITE_URL } from "@/lib/metadata";
import type { Metadata } from "next";

export const metadata: Metadata = buildMetadata({
  title: "Blog – Free Online Tool Guides & Tips",
  description:
    "Learn how to use free online PDF, image, SEO, and developer tools with step-by-step guides, tips, and best practices. No software needed.",
  path: "/blog",
  keywords: [
    "online tools blog",
    "pdf tools guide",
    "free developer tools tips",
    "seo tools tutorial",
    "file converter how to",
  ],
});

export default function BlogListPage() {
  const posts = getAllPosts();

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Blog", url: `${SITE_URL}/blog` },
        ])}
      />
      <JsonLd
        data={buildCollectionPageSchema({
          name: "Blog – Free Online Tool Guides & Tips",
          description:
            "Learn how to use free online PDF, image, SEO, and developer tools with step-by-step guides, tips, and best practices.",
          url: `${SITE_URL}/blog`,
        })}
      />

      {/* Header */}
      <section className="border-b border-slate-100 bg-white px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Breadcrumb
            items={[{ label: "Blog" }]}
          />
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Blogs
          </h1>
          <p className="mt-3 max-w-2xl text-base md:text-lg text-slate-500">
            Guides, tips, and tutorials on how to get the most out of free
            online tools for PDF, image, developer, and SEO tasks.
          </p>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
