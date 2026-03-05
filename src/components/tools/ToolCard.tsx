import Link from "next/link";
import type { Tool, ToolCategoryType } from "@/types/tool";

interface ToolCardProps {
  isHomepage?: boolean;
  tool: Tool;
}

const styles: Record<
  ToolCategoryType,
  {
    iconBg: string;
    ring: string;
    titleHover: string;
    outputBg: string;
    outputText: string;
    ctaHover: string;
  }
> = {
  pdf: {
    iconBg: "bg-red-50",
    ring: "focus-visible:ring-red-400",
    titleHover: "group-hover:text-red-600",
    outputBg: "bg-red-50",
    outputText: "text-red-600",
    ctaHover: "group-hover:text-red-500",
  },
  image: {
    iconBg: "bg-blue-50",
    ring: "focus-visible:ring-blue-400",
    titleHover: "group-hover:text-blue-600",
    outputBg: "bg-blue-50",
    outputText: "text-blue-600",
    ctaHover: "group-hover:text-blue-500",
  },
  file: {
    iconBg: "bg-green-50",
    ring: "focus-visible:ring-green-400",
    titleHover: "group-hover:text-green-600",
    outputBg: "bg-green-50",
    outputText: "text-green-600",
    ctaHover: "group-hover:text-green-500",
  },
  ocr: {
    iconBg: "bg-orange-50",
    ring: "focus-visible:ring-orange-400",
    titleHover: "group-hover:text-orange-600",
    outputBg: "bg-orange-50",
    outputText: "text-orange-600",
    ctaHover: "group-hover:text-orange-500",
  },
  web: {
    iconBg: "bg-indigo-50",
    ring: "focus-visible:ring-indigo-400",
    titleHover: "group-hover:text-indigo-600",
    outputBg: "bg-indigo-50",
    outputText: "text-indigo-600",
    ctaHover: "group-hover:text-indigo-500",
  },
  social: {
    iconBg: "bg-rose-50",
    ring: "focus-visible:ring-rose-400",
    titleHover: "group-hover:text-rose-600",
    outputBg: "bg-rose-50",
    outputText: "text-rose-600",
    ctaHover: "group-hover:text-rose-500",
  },
  seo: {
    iconBg: "bg-teal-50",
    ring: "focus-visible:ring-teal-400",
    titleHover: "group-hover:text-teal-600",
    outputBg: "bg-teal-50",
    outputText: "text-teal-600",
    ctaHover: "group-hover:text-teal-500",
  },
  dev: {
    iconBg: "bg-violet-50",
    ring: "focus-visible:ring-violet-400",
    titleHover: "group-hover:text-violet-600",
    outputBg: "bg-violet-50",
    outputText: "text-violet-600",
    ctaHover: "group-hover:text-violet-500",
  },
};

export default function ToolCard({ isHomepage = false, tool }: ToolCardProps) {
  const s = styles[tool.category];

  return (
    <Link
      href={`/${tool.categorySlug}/${tool.slug}`}
      className={`group relative flex h-full flex-col rounded-xl border border-slate-100 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-200 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 ${s.ring} focus-visible:ring-offset-2`}
    >
      {/* Top row: icon badge + status badges */}
      <div className="flex items-start justify-between gap-2">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-2xl ${s.iconBg}`}
          role="img"
          aria-label={tool.name}
        >
          {tool.icon}
        </div>

        {(tool.popular || tool.isNew) && (
          <div className="flex items-center gap-1 pt-0.5">
            {tool.popular && (
              <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-amber-600">
                Popular
              </span>
            )}
            {tool.isNew && (
              <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-emerald-600">
                New
              </span>
            )}
          </div>
        )}
      </div>

      {/* Title + description */}
      <div className="mt-4 flex flex-1 flex-col">
        <h3
          className={`text-sm font-semibold leading-snug text-slate-900 transition-colors duration-150 ${s.titleHover}`}
        >
          {tool.name}
        </h3>
        <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
          {tool.shortDescription}
        </p>

        <div className="flex-1" />

        {/* Format tags — category pages only */}
        {tool.acceptedFormats && !isHomepage && (
          <div className="mt-3 flex flex-wrap items-center gap-1">
            {tool.acceptedFormats.slice(0, 3).map((fmt) => (
              <span
                key={fmt}
                className="rounded-md border border-slate-100 bg-slate-50 px-1.5 py-0.5 font-mono text-[10px] font-medium uppercase text-slate-500"
              >
                {fmt.replace(".", "")}
              </span>
            ))}
            {tool.outputFormat && (
              <>
                <span className="text-[10px] font-bold text-slate-300">→</span>
                <span
                  className={`rounded-md px-1.5 py-0.5 font-mono text-[10px] font-semibold ${s.outputBg} ${s.outputText}`}
                >
                  {tool.outputFormat}
                </span>
              </>
            )}
          </div>
        )}

        {/* CTA */}
        <div
          className={`mt-4 flex items-center gap-1 border-t border-slate-50 pt-3 text-xs font-medium text-slate-400 transition-colors duration-150 ${s.ctaHover}`}
        >
          Open tool
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  );
}
