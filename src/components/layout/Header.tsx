"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { CATEGORIES } from "@/lib/tools";
import Image from "next/image";
import { clsx } from "@/lib/utils";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  const catIconBg: Record<string, string> = {
    pdf: "bg-red-50",
    image: "bg-blue-50",
    file: "bg-green-50",
    ocr: "bg-orange-50",
    web: "bg-indigo-50",
    social: "bg-rose-50",
    seo: "bg-teal-50",
    dev: "bg-violet-50",
  };

  useEffect(() => {
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    const onEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("keydown", onEsc);
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header className="sticky shadow-sm top-0 z-50 w-full bg-white/95 backdrop-blur-sm">
      <div className="h-16 flex items-center px-4 sm:px-6 lg:px-8">
        <div className="flex flex-1 items-center justify-between mx-auto max-w-5xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <Image
              src={"/icons/logo.png"}
              width={30}
              height={30}
              alt="toolify logo"
            />
            <span className="text-2xl font-medium text-slate-900">
              tool<span className="text-red-600">ify</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <header className="hidden items-center gap-4 md:flex">
            <Link
              href="/about"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              About
            </Link>
            <Link
              href="/blog"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Blogs
            </Link>
            <Link
              href="/tools"
              className="rounded-lg px-3 py-2 text-sm font-medium text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-900"
            >
              Tools
            </Link>
          </header>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 md:hidden"
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

          <Link
            href={"/contact"}
            className="hidden md:flex items-center border border-red-600 justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-red-600 text-white"
          >
            {/* <Image src={"/icons/premium.png"} alt="toolify go premium button - icon" width={24} height={24} className="brightness-0 invert" /> */}
            Contact Us
          </Link>
        </div>
      </div>

      {/* Mobile backdrop */}
      <div
        className={clsx(
          "fixed inset-0 top-16 bg-black/10 backdrop-blur-[2px] md:hidden transition-opacity duration-300",
          mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none",
        )}
        onClick={() => setMobileOpen(false)}
        aria-hidden="true"
      />

      {/* Mobile Nav */}
      <div
        className={clsx(
          "absolute top-20 left-3 right-3 rounded-2xl bg-white backdrop-blur-xl md:hidden overflow-hidden",
          "shadow-[0_8px_40px_-12px_rgba(0,0,0,0.12)] ring-1 ring-black/5",
          "transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]",
          mobileOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-3 scale-[0.98] pointer-events-none",
        )}
      >
        <nav className="p-2">
          {/* Categories */}
          <div className="space-y-0.5">
            {CATEGORIES.map((cat, i) => (
              <Link
                key={cat.slug}
                href={`/tools/${cat.slug}`}
                onClick={() => setMobileOpen(false)}
                style={{
                  transitionDelay: mobileOpen ? `${(i + 1) * 40}ms` : "0ms",
                }}
                className={clsx(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-300",
                  "hover:bg-slate-50/80 active:scale-[0.98]",
                  mobileOpen
                    ? "opacity-100 translate-x-0"
                    : "opacity-0 -translate-x-2",
                )}
              >
                <div
                  className={clsx(
                    "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl",
                    catIconBg[cat.id] || "bg-slate-50",
                  )}
                >
                  <Image
                    src={`/icons/${cat.icon}.png`}
                    alt=""
                    width={24}
                    height={24}
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-slate-800">
                    {cat.name}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {cat.description.split(".")[0]}
                  </p>
                </div>
              </Link>
            ))}
          </div>

          {/* Divider */}
          <div className="mx-3 my-2 h-px bg-linear-to-r from-transparent via-slate-200 to-transparent" />

          {/* Contact CTA */}
          <div className="p-2 pt-1">
            <Link
              href="/contact"
              onClick={() => setMobileOpen(false)}
              style={{
                transitionDelay: mobileOpen
                  ? `${(CATEGORIES.length + 3) * 40}ms`
                  : "0ms",
              }}
              className={clsx(
                "flex items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-3 text-sm font-semibold text-white transition-all duration-300",
                "hover:bg-red-700 active:scale-[0.98]",
                mobileOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-2",
              )}
            >
              Contact Us
            </Link>
          </div>
        </nav>
      </div>
    </header>
  );
}
