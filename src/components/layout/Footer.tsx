import Link from "next/link";
import { CATEGORIES, TOOLS } from "@/lib/tools";
import Image from "next/image";

export default function Footer() {
  const toolsByCategory = CATEGORIES.reduce(
    (acc, cat) => {
      acc[cat.slug] = TOOLS.filter((t) => t.categorySlug === cat.slug);
      return acc;
    },
    {} as Record<string, typeof TOOLS>,
  );

  const primaryCats = CATEGORIES.slice(0, 3);
  const secondaryCats = CATEGORIES.slice(3);

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-700">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* CTA Banner */}
        <div className="mb-14 overflow-hidden rounded-2xl bg-linear-to-br from-red-500 to-red-900 px-8 py-7 shadow-sm">
          <div className="flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-red-200">
                Privacy first
              </p>
              <h2 className="mt-1 text-xl font-bold text-white">
                Everything runs in your browser
              </h2>
              <p className="mt-1 text-sm text-red-100">
                No uploads to servers. No waiting. Just instant, private
                results.
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
        <div className="grid grid-cols-2 gap-x-8 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-2">
              <Image
                src={"/icons/logo.png"}
                width={28}
                height={28}
                alt="toolify logo"
              />
              <span className="text-xl font-bold text-slate-900">
                tool<span className="text-red-600">ify</span>
              </span>
            </Link>
            <p className="mt-3 max-w-xs text-sm leading-relaxed text-slate-500">
              Free online tools for PDF, image, video, and file conversion.
              Everything runs in your browser — fast, private, no sign-up.
            </p>
            <ul className="mt-4 space-y-1.5">
              {[
                "100% free to use",
                "No registration required",
                "Processed in your browser",
                "No file size limits",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-1.5 text-xs text-slate-400"
                >
                  <svg
                    className="h-3 w-3 shrink-0 text-green-500"
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
                </li>
              ))}
            </ul>
          </div>

          {/* Primary category columns: PDF, Image, Video */}
          {primaryCats.map((cat) => (
            <div key={cat.slug} className="col-span-1">
              <Link
                href={`/${cat.slug}`}
                className="text-xs font-semibold uppercase tracking-wider text-slate-700 transition-opacity hover:opacity-70"
              >
                {cat.name}
              </Link>
              <ul className="mt-3 space-y-2">
                {toolsByCategory[cat.slug]?.slice(0, 5).map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/${cat.slug}/${tool.slug}`}
                      className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-900"
                    >
                      {tool.name}
                      {tool.popular && (
                        <span
                          className="inline-block text-xs rounded-full text-amber-500"
                          title="Popular"
                        >
                          ★
                        </span>
                      )}
                    </Link>
                  </li>
                ))}
                <li>
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
              <div key={cat.slug} className={i > 0 ? "mt-6" : ""}>
                <Link
                  href={`/${cat.slug}`}
                  className="text-xs font-semibold uppercase tracking-wider text-slate-700 transition-opacity hover:opacity-70"
                >
                  {cat.name}
                </Link>
                <ul className="mt-2 space-y-1.5">
                  {toolsByCategory[cat.slug]?.slice(0, 3).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/${cat.slug}/${tool.slug}`}
                        className="inline-flex items-center gap-1.5 text-xs text-slate-500 transition-colors hover:text-slate-900"
                      >
                        {tool.name}
                        {tool.popular && (
                          <span
                            className="inline-block text-xs rounded-full text-amber-500"
                            title="Popular"
                          >
                            ★
                          </span>
                        )}
                      </Link>
                    </li>
                  ))}
                  <li>
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
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-10 flex flex-col items-center justify-between gap-3 border-t border-slate-200 pt-6 sm:flex-row">
          <p className="text-xs text-slate-400">
            © {new Date().getFullYear()} toolify. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            <Link
              href="/privacy-and-policy"
              className="text-xs text-slate-400 transition-colors hover:text-slate-700"
            >
              Privacy Policy
            </Link>
            <span className="text-slate-400 transition-colors hover:text-slate-700">
              ∙
            </span>
            <Link
              href="/terms"
              className="text-xs text-slate-400 transition-colors hover:text-slate-700"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
