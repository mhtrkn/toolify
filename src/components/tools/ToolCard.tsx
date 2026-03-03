import Link from "next/link";
import type { Tool } from "@/types/tool";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/${tool.categorySlug}/${tool.slug}`}
      className="group relative flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-red-300 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-50 text-2xl transition-colors duration-200 group-hover:bg-red-50">
          <span role="img" aria-label={tool.name}>
            {tool.icon}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          {tool.popular && (
            <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-medium text-red-600">
              Popular
            </span>
          )}
          {tool.isNew && (
            <span className="rounded-full bg-green-50 px-2 py-0.5 text-xs font-medium text-green-600">
              New
            </span>
          )}
        </div>
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-slate-900 transition-colors duration-200 group-hover:text-red-600">
          {tool.name}
        </h3>
        <p className="mt-1 text-sm text-slate-500 line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>
      {tool.acceptedFormats && (
        <div className="mt-auto flex flex-wrap items-center gap-1">
          {tool.acceptedFormats.slice(0, 3).map((fmt) => (
            <span
              key={fmt}
              className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-xs uppercase text-slate-500"
            >
              {fmt.replace(".", "")}
            </span>
          ))}
          {tool.outputFormat && (
            <>
              <span className="self-center text-xs text-slate-400">→</span>
              <span className="rounded bg-red-50 px-1.5 py-0.5 font-mono text-xs font-medium text-red-600">
                {tool.outputFormat}
              </span>
            </>
          )}
        </div>
      )}
      <span className="absolute bottom-4 right-4 translate-x-1 opacity-0 transition-all duration-200 group-hover:translate-x-0 group-hover:opacity-100">
        <svg
          className="h-4 w-4 text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      </span>
    </Link>
  );
}
