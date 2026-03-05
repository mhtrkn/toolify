"use client";

import { useEffect, useState } from "react";

interface Props {
  content: string;
}

export default function BlogContent({ content }: Props) {
  const [html, setHtml] = useState("");

  useEffect(() => {
    async function parse() {
      const { marked } = await import("marked");
      marked.setOptions({ gfm: true, breaks: true });
      const result = await marked.parse(content);
      setHtml(result);
    }
    parse();
  }, [content]);

  if (!html) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-4 w-3/4 rounded bg-slate-200" />
        <div className="h-4 w-full rounded bg-slate-200" />
        <div className="h-4 w-5/6 rounded bg-slate-200" />
        <div className="h-4 w-2/3 rounded bg-slate-200" />
      </div>
    );
  }

  return (
    <div
      className="prose prose-slate max-w-none prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:leading-relaxed prose-a:text-red-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl prose-img:border prose-img:border-slate-200 prose-img:shadow-sm prose-code:rounded prose-code:bg-slate-100 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:font-medium prose-code:text-slate-800 prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:border prose-pre:border-slate-200 prose-pre:bg-slate-900 prose-pre:text-slate-100 prose-blockquote:border-red-300 prose-blockquote:bg-red-50/50 prose-blockquote:rounded-r-xl prose-blockquote:py-1 prose-table:text-sm prose-th:bg-slate-50 prose-th:px-4 prose-th:py-2 prose-td:px-4 prose-td:py-2"
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
