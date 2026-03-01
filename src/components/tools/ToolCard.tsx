import Link from "next/link";
import type { Tool } from "@/types/tool";

interface ToolCardProps {
  tool: Tool;
}

export default function ToolCard({ tool }: ToolCardProps) {
  return (
    <Link
      href={`/${tool.categorySlug}/${tool.slug}`}
      className="group flex flex-col gap-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-red-200 hover:shadow-md"
    >
      <div className="flex items-start justify-between">
        <span className="text-2xl" role="img" aria-label={tool.name}>
          {tool.icon}
        </span>
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
      <div>
        <h3 className="font-semibold text-slate-900 group-hover:text-red-600">
          {tool.name}
        </h3>
        <p className="mt-1 text-sm text-slate-500 line-clamp-2">
          {tool.shortDescription}
        </p>
      </div>
      {tool.acceptedFormats && (
        <div className="flex flex-wrap gap-1 mt-auto">
          {tool.acceptedFormats.slice(0, 3).map((fmt) => (
            <span
              key={fmt}
              className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-500 uppercase"
            >
              {fmt.replace(".", "")}
            </span>
          ))}
          {tool.outputFormat && (
            <>
              <span className="text-xs text-slate-400 self-center">→</span>
              <span className="rounded bg-red-50 px-1.5 py-0.5 text-xs text-red-600 font-medium">
                {tool.outputFormat}
              </span>
            </>
          )}
        </div>
      )}
    </Link>
  );
}
