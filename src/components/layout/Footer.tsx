import Link from "next/link";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import Image from "next/image";

export default function Footer() {
  const toolsByCategory = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.slug] = TOOLS.filter((t) => t.categorySlug === cat.slug);
      return acc;
    },
    {} as Record<string, typeof TOOLS>
  );

  const features = [
    "100% free to use",
    "No registration required",
    "Processed in your browser",
    "No file size limits",
  ];

  const primaryCats = CATEGORIES.slice(0, 3);
  const secondaryCats = CATEGORIES.slice(3);

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-700">
      <div className="mx-auto max-w-7xl px-4 pt-14 pb-8 sm:px-6 lg:px-8">

        {/* CTA Banner */}
        <div className="mb-14 overflow-hidden rounded-2xl bg-linear-to-br from-red-600 to-red-500 px-8 py-7 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-red-200">
                Privacy first
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                Everything runs in your browser
              </h2>
              <p className="mt-1 text-sm text-red-100">
                No uploads to servers. No waiting. Just instant, private results.
              </p>
            </div>
            <Link
              href="/pdf-tools"
              className="shrink-0 rounded-xl bg-white px-6 py-2.5 text-sm font-semibold text-red-600 transition-colors hover:bg-red-50"
            >
              Browse all tools →
            </Link>
          </div>
        </div>

        {/* Main grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-6">

          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image src={"/icons/logo.png"} width={32} height={32} alt="toolify logo" />
              <span className="text-2xl font-bold text-slate-900">
                tool<span className="text-red-600">ify</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Free online tools for PDF, image, video, and file conversion.
              Everything runs in your browser — fast, private, and no sign-up
              needed.
            </p>

            {/* Feature pills */}
            <div className="mt-5 flex flex-wrap gap-2">
              {features.map((f) => (
                <span
                  key={f}
                  className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-700"
                >
                  <svg
                    className="h-3 w-3 shrink-0"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {f}
                </span>
              ))}
            </div>

            {/* Stats */}
            <div className="mt-7 flex gap-5">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-50">
                  <svg
                    className="h-4 w-4 text-red-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{TOOLS.length}+</p>
                  <p className="text-xs text-slate-400">Free tools</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                  <svg
                    className="h-4 w-4 text-blue-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zm10 0a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-lg font-bold text-slate-900">{CATEGORIES.length}</p>
                  <p className="text-xs text-slate-400">Categories</p>
                </div>
              </div>
            </div>
          </div>

          {/* Primary category columns: PDF, Image, Video */}
          {primaryCats.map((cat) => (
            <div key={cat.slug} className="col-span-1">
              <Link
                href={`/${cat.slug}`}
                className={`text-sm font-semibold uppercase tracking-wider text-slate-900 transition-opacity hover:opacity-70`}
              >
                {cat.name}
              </Link>
              <ul className="mt-4 space-y-2.5">
                {toolsByCategory[cat.slug]?.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/${cat.slug}/${tool.slug}`}
                      className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
                    >
                      {tool.name}
                      {tool.popular && (
                        <span
                          className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"
                          title="Popular"
                        />
                      )}
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <Link
                    href={`/${cat.slug}`}
                    className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                  >
                    View all →
                  </Link>
                </li>
              </ul>
            </div>
          ))}

          {/* Last column: File Converter + OCR + Web stacked */}
          <div className="col-span-1">
            {secondaryCats.map((cat, i) => (
              <div key={cat.slug} className={i > 0 ? "mt-8" : ""}>
                <Link
                  href={`/${cat.slug}`}
                  className={`text-sm font-semibold uppercase tracking-wider text-slate-900 transition-opacity hover:opacity-70`}
                >
                  {cat.name}
                </Link>
                <ul className="mt-4 space-y-2.5">
                  {toolsByCategory[cat.slug]?.slice(0, 5).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/${cat.slug}/${tool.slug}`}
                        className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
                      >
                        {tool.name}
                        {tool.popular && (
                          <span
                            className="inline-block h-1.5 w-1.5 rounded-full bg-red-500"
                            title="Popular"
                          />
                        )}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-1">
                    <Link
                      href={`/${cat.slug}`}
                      className="text-sm font-medium text-red-600 transition-colors hover:text-red-700"
                    >
                      View all →
                    </Link>
                  </li>
                </ul>
              </div>
            ))}

            {/* Legal links */}
            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-wider text-slate-900">
                Legal
              </p>
              <ul className="mt-4 space-y-2.5">
                <li>
                  <Link
                    href="/privacy-and-policy"
                    className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-slate-500 transition-colors hover:text-slate-900"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-8 sm:flex-row">
          <div className="flex items-center gap-2">
            <p className="text-sm text-slate-400">
              © {new Date().getFullYear()} toolify. All rights reserved.
            </p>
          </div>
          <p className="text-sm text-slate-400">
            No bloat. No paywalls. Just tools that work.
          </p>
        </div>
      </div>
    </footer>
  );
}
