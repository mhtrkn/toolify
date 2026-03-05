import { getFeaturedPosts } from "@/lib/blog-data";
import Link from "next/link";
import BlogCover from "./BlogCover";

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
    month: "short",
    day: "numeric",
  });
}

export default function FeaturedBlogs() {
  const posts = getFeaturedPosts().slice(0, 4);

  if (posts.length === 0) return null;

  return (
    <section className="border-t border-slate-100 bg-white px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          From the Blog
        </p>
        <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
          Guides & Tutorials
        </h2>
        <p className="mt-2 text-slate-500">
          Learn how to get the most out of our free online tools.
        </p>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {posts.map((post) => {
            const colors = categoryColors[post.category] || {
              bg: "bg-slate-50",
              text: "text-slate-600",
            };

            return (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-lg"
              >
                {/* Cover */}
                <div className="relative aspect-video overflow-hidden">
                  <BlogCover
                    category={post.category}
                    title={post.title}
                    size="sm"
                  />
                </div>

                <div className="flex flex-1 flex-col p-4">
                  <div className="flex items-center justify-between gap-2 text-xs text-slate-400 mb-2">
                    <span
                      className={`rounded-full px-2 py-0.5 font-medium ${colors.bg} ${colors.text}`}
                    >
                      {post.category}
                    </span>
                    <time dateTime={post.publishedAt}>
                      {formatDate(post.publishedAt)}
                    </time>
                  </div>

                  <h3 className="mt-2 line-clamp-2 text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-red-600">
                    {post.title}
                  </h3>

                  <p className="mt-1.5 line-clamp-2 flex-1 text-xs leading-relaxed text-slate-500">
                    {post.excerpt}
                  </p>

                  <span className="mt-3 flex items-center gap-1 text-xs font-medium text-red-600">
                    Read more
                    <svg
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-700 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            View all articles
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
    </section>
  );
}
