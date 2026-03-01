"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { searchTools } from "@/lib/tools";
import type { Tool } from "@/types/tool";

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Tool[]>([]);
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const found = searchTools(query);
    setResults(found.slice(0, 6));
    setOpen(found.length > 0 && query.length > 1);
  }, [query]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className="relative mx-auto w-full max-w-xl">
      <div className="flex items-center gap-3 rounded-2xl border border-slate-300 bg-white px-4 py-3 shadow-sm focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
        <svg
          className="h-5 w-5 shrink-0 text-slate-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z"
          />
        </svg>
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search tools — PDF to JPG, Image Compressor..."
          className="w-full bg-transparent text-sm text-slate-800 placeholder-slate-400 outline-none"
          aria-label="Search tools"
          autoComplete="off"
        />
        {query && (
          <button
            onClick={() => { setQuery(""); setOpen(false); }}
            className="text-slate-400 hover:text-slate-600"
            aria-label="Clear search"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      {open && (
        <ul className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-lg">
          {results.map((tool) => (
            <li key={tool.slug}>
              <Link
                href={`/${tool.categorySlug}/${tool.slug}`}
                onClick={() => { setQuery(""); setOpen(false); }}
                className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50"
              >
                <span className="text-lg">{tool.icon}</span>
                <div className="text-left">
                  <p className="text-sm font-medium text-slate-900">{tool.name}</p>
                  <p className="text-xs text-slate-500">{tool.categoryName}</p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
