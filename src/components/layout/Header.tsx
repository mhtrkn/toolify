"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/tools";
import Image from "next/image";
import { clsx } from "@/lib/utils";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <Image
            src={"/icons/logo.png"}
            width={32}
            height={32}
            alt="toolify logo"
          />
          <span className="text-3xl font-bold text-slate-900">
            tool<span className="text-red-600">ify</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden items-center gap-1 lg:flex">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu button */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 lg:hidden"
          aria-label="Toggle menu"
        >
          <svg
            className="h-5 w-5 text-slate-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {mobileOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Nav */}
      <div
        className={clsx(
          "border-t border-slate-200 bg-white px-4 md:hidden transition duration-300",
          mobileOpen ? "h-auto opacity-100 py-3" : "h-0 opacity-0",
        )}
      >
        <nav className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
            >
              <Image
                src={`/icons/${cat.icon}.png`}
                alt={cat.description}
                width={36}
                height={36}
              />
              {cat.name}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
