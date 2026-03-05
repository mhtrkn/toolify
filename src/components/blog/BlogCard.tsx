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
      className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-lg"
    >
      {/* Cover */}
      <div className="relative aspect-video overflow-hidden">
        <BlogCover category={post.category} title={post.title} />
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col p-5">
        {/* Meta */}
        <div className="flex items-center w-full justify-between gap-3 text-xs text-slate-400 mb-2">
          <span
            className={`rounded-full px-2.5 py-0.5 font-medium ${colors.bg} ${colors.text}`}
          >
            {post.category}
          </span>
          <div className="flex items-center justify-center gap-2">
            <time dateTime={post.publishedAt}>
              {formatDate(post.publishedAt)}
            </time>
          </div>
        </div>

        {/* Title */}
        <h3 className="mt-3 text-base font-semibold leading-snug text-slate-900 transition-colors group-hover:text-red-600 line-clamp-2">
          {post.title}
        </h3>

        {/* Excerpt */}
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-slate-500">
          {post.excerpt}
        </p>

        {/* Read more */}
        <div className="mt-4 flex items-center gap-1 text-sm font-medium text-red-600">
          Read more
          <svg
            className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
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
        </div>
      </div>
    </Link>
  );
}
