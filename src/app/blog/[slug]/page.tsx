import Breadcrumb from "@/components/layout/Breadcrumb";
import JsonLd from "@/components/seo/JsonLd";
import BlogContent from "@/components/blog/BlogContent";
import BlogCard from "@/components/blog/BlogCard";
import { getAllPosts, getPostBySlug, getRelatedPosts } from "@/lib/blog-data";
import {
  buildBlogPostSchema,
  buildBreadcrumbSchema,
} from "@/lib/structured-data";
import { buildMetadata, SITE_URL } from "@/lib/metadata";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};

  return buildMetadata({
    title: post.metaTitle,
    description: post.metaDescription,
    path: `/blog/${post.slug}`,
    keywords: post.keywords,
    ogImage: post.coverImage,
  });
}

const categoryColors: Record<string, { bg: string; text: string }> = {
  "PDF Tools": { bg: "bg-red-50", text: "text-red-600" },
  "Image Tools": { bg: "bg-blue-50", text: "text-blue-600" },
  "File Converter": { bg: "bg-green-50", text: "text-green-600" },
  "OCR Tools": { bg: "bg-orange-50", text: "text-orange-600" },
  "Web Tools": { bg: "bg-indigo-50", text: "text-indigo-600" },
  "Social Media Tools": { bg: "bg-rose-50", text: "text-rose-600" },
  "SEO Tools": { bg: "bg-teal-50", text: "text-teal-600" },
  "Developer Tools": { bg: "bg-violet-50", text: "text-violet-600" },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const related = getRelatedPosts(post);
  const colors = categoryColors[post.category] || {
    bg: "bg-slate-50",
    text: "text-slate-600",
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd
        data={[
          buildBlogPostSchema({
            title: post.title,
            description: post.metaDescription,
            slug: post.slug,
            publishedAt: post.publishedAt,
            updatedAt: post.updatedAt,
            author: post.author,
            coverImage: post.coverImage,
          }),
          buildBreadcrumbSchema([
            { name: "Home", url: SITE_URL },
            { name: "Blog", url: `${SITE_URL}/blog` },
            { name: post.title, url: `${SITE_URL}/blog/${post.slug}` },
          ]),
        ]}
      />

      {/* Header */}
      <section className="border-b border-slate-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <Breadcrumb
            items={[{ label: "Blog", href: "/blog" }, { label: post.title }]}
          />

          <div className="mt-6 flex items-center gap-3">
            <span
              className={`rounded-full px-3 py-1 text-xs font-medium ${colors.bg} ${colors.text}`}
            >
              {post.category}
            </span>
            <time
              dateTime={post.publishedAt}
              className="text-sm text-slate-400"
            >
              {formatDate(post.publishedAt)}
            </time>
          </div>

          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-slate-500">
            {post.excerpt}
          </p>
        </div>
      </section>

      {/* Content + Sidebar */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          {/* Article */}
          <article className="w-full">
            <div className="rounded-2xl border border-slate-100 bg-white p-6 shadow-sm sm:p-10">
              <BlogContent content={post.content} />
            </div>

            {/* Tags */}
            <div className="mt-8 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-500"
                >
                  {tag}
                </span>
              ))}
            </div>
          </article>

          {/* Sidebar */}
          <aside className="mt-10">
            <div className="space-y-8">
              {/* Related Tools */}
              {post.relatedTools.length > 0 && (
                <div className="rounded-xl border border-slate-100 bg-white p-5 shadow-sm">
                  <h3 className="text-sm font-semibold uppercase tracking-widest text-slate-400">
                    Related Tools
                  </h3>
                  <ul className="mt-3 space-y-2">
                    {post.relatedTools.map((tool) => (
                      <li key={tool.href}>
                        <Link
                          href={tool.href}
                          className="group flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50 hover:text-red-600"
                        >
                          <svg
                            className="h-4 w-4 text-slate-400 transition-colors group-hover:text-red-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M13 10V3L4 14h7v7l9-11h-7z"
                            />
                          </svg>
                          {tool.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Share / CTA */}
              <div className="rounded-xl border border-slate-100 bg-linear-to-br from-red-50 to-white p-5 shadow-sm">
                <h3 className="text-sm font-semibold text-slate-900">
                  Try these tools for free
                </h3>
                <p className="mt-1 text-xs leading-relaxed text-slate-500">
                  All tools run in your browser. No signup, no uploads, 100%
                  private.
                </p>
                <Link
                  href="/tools"
                  className="mt-4 inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
                >
                  Browse all tools
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8l4 4m0 0l-4 4m4-4H3"
                    />
                  </svg>
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* Related Posts */}
      {related.length > 0 && (
        <section className="border-t border-slate-100 bg-white px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">
              Related Articles
            </h2>
            <div className="mt-6 grid gap-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
