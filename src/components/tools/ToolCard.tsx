import Link from "next/link";
import type { Tool, ToolCategoryType } from "@/types/tool";

interface ToolCardProps {
  isHomepage?: boolean;
  tool: Tool;
}

const styles: Record<
  ToolCategoryType,
  {
    gradientFrom: string;
    gradientTo: string;
    overlay: string;
    ring: string;
    titleHover: string;
    borderHover: string;
    outputBg: string;
    outputText: string;
    ctaHover: string;
  }
> = {
  pdf: {
    gradientFrom: "from-red-50",
    gradientTo: "to-red-100",
    overlay: "from-red-200/40",
    ring: "focus-visible:ring-red-500",
    titleHover: "group-hover:text-red-600",
    borderHover: "hover:border-red-200",
    outputBg: "bg-red-50",
    outputText: "text-red-600",
    ctaHover: "group-hover:text-red-600",
  },
  image: {
    gradientFrom: "from-blue-50",
    gradientTo: "to-blue-100",
    overlay: "from-blue-200/40",
    ring: "focus-visible:ring-blue-500",
    titleHover: "group-hover:text-blue-600",
    borderHover: "hover:border-blue-200",
    outputBg: "bg-blue-50",
    outputText: "text-blue-600",
    ctaHover: "group-hover:text-blue-600",
  },
  video: {
    gradientFrom: "from-purple-50",
    gradientTo: "to-purple-100",
    overlay: "from-purple-200/40",
    ring: "focus-visible:ring-purple-500",
    titleHover: "group-hover:text-purple-600",
    borderHover: "hover:border-purple-200",
    outputBg: "bg-purple-50",
    outputText: "text-purple-600",
    ctaHover: "group-hover:text-purple-600",
  },
  file: {
    gradientFrom: "from-green-50",
    gradientTo: "to-green-100",
    overlay: "from-green-200/40",
    ring: "focus-visible:ring-green-500",
    titleHover: "group-hover:text-green-600",
    borderHover: "hover:border-green-200",
    outputBg: "bg-green-50",
    outputText: "text-green-600",
    ctaHover: "group-hover:text-green-600",
  },
  ocr: {
    gradientFrom: "from-orange-50",
    gradientTo: "to-orange-100",
    overlay: "from-orange-200/40",
    ring: "focus-visible:ring-orange-500",
    titleHover: "group-hover:text-orange-600",
    borderHover: "hover:border-orange-200",
    outputBg: "bg-orange-50",
    outputText: "text-orange-600",
    ctaHover: "group-hover:text-orange-600",
  },
  web: {
    gradientFrom: "from-indigo-50",
    gradientTo: "to-indigo-100",
    overlay: "from-indigo-200/40",
    ring: "focus-visible:ring-indigo-500",
    titleHover: "group-hover:text-indigo-600",
    borderHover: "hover:border-indigo-200",
    outputBg: "bg-indigo-50",
    outputText: "text-indigo-600",
    ctaHover: "group-hover:text-indigo-600",
  },
};

export default function ToolCard({ isHomepage = false, tool }: ToolCardProps) {
  const s = styles[tool.category];

  return (
    <Link
      href={`/${tool.categorySlug}/${tool.slug}`}
      className={`group relative flex h-full flex-col overflow-hidden rounded-2xl border border-stone-100 bg-white shadow-sm transition-all duration-500 ease-out hover:-translate-y-1 hover:shadow-2xl ${s.borderHover} focus-visible:outline-none focus-visible:ring-2 ${s.ring} focus-visible:ring-offset-2`}
    >
      {/* ── Visual top area ────────────────────────────── */}
      <div
        className={`relative h-36 w-full overflow-hidden bg-linear-to-br ${s.gradientFrom} ${s.gradientTo}`}
      >
        {/* Bottom gradient overlay (depth) */}
        <div
          className={`absolute inset-0 bg-linear-to-t ${s.overlay} via-transparent to-transparent opacity-60`}
        />

        {/* Centered icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className="select-none text-5xl transition-transform duration-500 ease-out group-hover:scale-110"
            role="img"
            aria-label={tool.name}
          >
            {tool.icon}
          </span>
        </div>

        {/* Badges — top left */}
        {(tool.popular || tool.isNew) && (
          <div className="absolute left-3 top-3 flex items-center gap-1.5">
            {tool.popular && (
              <span className="flex items-center gap-1 rounded-full bg-amber-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg">
                ★ Popular
              </span>
            )}
            {tool.isNew && (
              <span className="rounded-full bg-emerald-500 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-white shadow-lg">
                ✦ New
              </span>
            )}
          </div>
        )}

        {/* Arrow button — bottom right, appears on hover */}
        <div className="absolute bottom-3 right-3 flex h-8 w-8 translate-y-1 items-center justify-center rounded-full bg-white opacity-0 shadow-md transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="h-4 w-4 text-stone-700"
          >
            <path d="M7 7h10v10" />
            <path d="M7 17 17 7" />
          </svg>
        </div>
      </div>

      {/* ── Content area ───────────────────────────────── */}
      <div className="flex flex-1 flex-col gap-3 p-4">
        {/* Title + description */}
        <div>
          <h3
            className={`text-sm font-semibold leading-snug text-slate-900 transition-colors duration-200 ${s.titleHover}`}
          >
            {tool.name}
          </h3>
          <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500">
            {tool.shortDescription}
          </p>
        </div>

        <div className="flex-1" />

        {/* Format tags */}
        {tool.acceptedFormats && !isHomepage && (
          <div className="flex flex-wrap items-center gap-1">
            {tool.acceptedFormats.slice(0, 3).map((fmt) => (
              <span
                key={fmt}
                className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[11px] font-medium uppercase text-slate-500"
              >
                {fmt.replace(".", "")}
              </span>
            ))}
            {tool.outputFormat && (
              <>
                <span className="text-xs font-bold text-slate-400">→</span>
                <span
                  className={`rounded-md px-2 py-0.5 font-mono text-[11px] font-semibold ${s.outputBg} ${s.outputText}`}
                >
                  {tool.outputFormat}
                </span>
              </>
            )}
          </div>
        )}

        {/* Bottom row */}
        <div className="flex items-center justify-between border-t border-stone-100 pt-3">
          <span className="text-[11px] font-medium uppercase tracking-wider text-slate-400"></span>
          <span
            className={`text-xs font-medium text-slate-400 transition-colors duration-200 ${s.ctaHover}`}
          >
            Use Tool →
          </span>
        </div>
      </div>
    </Link>
  );
}
