"use client";

import Link from "next/link";
import { useState } from "react";
import { CATEGORIES } from "@/lib/tools";
import Image from "next/image";
import { clsx } from "@/lib/utils";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm">
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

          <Link href={"/contact"} className="hidden md:flex items-center border border-red-600 justify-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium bg-red-600 text-white">
            {/* <Image src={"/icons/premium.png"} alt="toolify go premium button - icon" width={24} height={24} className="brightness-0 invert" /> */}
            Contact Us
          </Link>
        </div>
      </div>

      {/* Mobile Nav */}
      <div
        className={clsx(
          "absolute border top-18 py-3 rounded-xl left-2 right-2 border-slate-200 bg-white px-4 lg:hidden",
          "transition-all duration-300 ease-out",
          mobileOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 -translate-y-4 pointer-events-none",
        )}
      >
        <nav className="flex flex-col gap-1">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/tools/${cat.slug}`}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
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
          <div className="my-1 border-t border-slate-100" />
          <Link
            href="/tools"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <Image
              src={"/icons/tool.png"}
              width={36}
              height={36}
              alt="All Tool Icon"
            />
            All Tools
          </Link>
          <Link
            href="/blog"
            onClick={() => setMobileOpen(false)}
            className="flex items-center gap-2 rounded-lg px-3 py-3 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            <Image
              src={"/icons/blogs.png"}
              width={36}
              height={36}
              alt="Blogs Icon"
            />
            Blog
          </Link>
        </nav>
      </div>
    </header>
  );
}
