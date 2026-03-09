import type { BlogPost } from "@/types/blog";
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

export default function BlogCard({ post }: { post: BlogPost }) {
  const colors = categoryColors[post.category] || {
    bg: "bg-slate-50",
    text: "text-slate-600",
  };

  return (
    <Link
      href={`/blog/${post.slug}`}
      className="group flex flex-row overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:border-slate-200 hover:shadow-md"
    >
      {/* Cover */}
      <div className="relative w-32 shrink-0 sm:w-40">
        <BlogCover category={post.category} title={post.title} size="sm" className="rounded-none" />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-4">
        {/* Meta */}
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-2">
            <span className={`rounded-full px-2.5 py-0.5 font-medium ${colors.bg} ${colors.text}`}>
              {post.category}
            </span>
            <time dateTime={post.publishedAt}>{formatDate(post.publishedAt)}</time>
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold leading-snug text-slate-900 transition-colors group-hover:text-red-600 line-clamp-2">
            {post.title}
          </h3>

          {/* Excerpt */}
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {post.excerpt}
          </p>
        </div>

        {/* Read more */}
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-red-600">
          Read more
          <svg
            className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
