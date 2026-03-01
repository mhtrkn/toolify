import Link from "next/link";
import { CATEGORIES, TOOLS } from "@/lib/tools";

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
      <div className="mx-auto max-w-7xl px-4 pt-16 pb-8 sm:px-6 lg:px-8">
        {/* Main grid */}
        <div className="grid grid-cols-2 gap-x-8 gap-y-12 lg:grid-cols-6">
          {/* Brand column */}
          <div className="col-span-2 lg:col-span-2">
            <Link href="/" className="inline-block">
              <span className="text-2xl font-bold text-slate-900">
                tool<span className="text-red-600">ify</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-500">
              Free online tools for PDF, image, video, and file conversion.
              Everything runs in your browser — fast, private, and no sign-up
              needed.
            </p>

            <ul className="mt-5 space-y-2">
              {features.map((f) => (
                <li key={f} className="flex items-center gap-2 text-sm text-slate-500">
                  <svg
                    className="h-4 w-4 shrink-0 text-green-600"
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

            {/* Stats */}
            <div className="mt-6 flex gap-6">
              <div>
                <p className="text-lg font-bold text-slate-900">14+</p>
                <p className="text-xs text-slate-400">Free tools</p>
              </div>
              <div>
                <p className="text-lg font-bold text-slate-900">5</p>
                <p className="text-xs text-slate-400">Categories</p>
              </div>
            </div>
          </div>

          {/* Primary category columns: PDF, Image, Video */}
          {primaryCats.map((cat) => (
            <div key={cat.slug} className="col-span-1">
              <Link
                href={`/${cat.slug}`}
                className="text-sm font-semibold uppercase tracking-wider text-slate-900 hover:text-red-600 transition-colors"
              >
                {cat.name}
              </Link>
              <ul className="mt-4 space-y-2.5">
                {toolsByCategory[cat.slug]?.map((tool) => (
                  <li key={tool.slug}>
                    <Link
                      href={`/${cat.slug}/${tool.slug}`}
                      className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      {tool.name}
                    </Link>
                  </li>
                ))}
                <li className="pt-1">
                  <Link
                    href={`/${cat.slug}`}
                    className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
                  >
                    View all →
                  </Link>
                </li>
              </ul>
            </div>
          ))}

          {/* Last column: File Converter + OCR stacked */}
          <div className="col-span-1">
            {secondaryCats.map((cat, i) => (
              <div key={cat.slug} className={i > 0 ? "mt-8" : ""}>
                <Link
                  href={`/${cat.slug}`}
                  className="text-sm font-semibold uppercase tracking-wider text-slate-900 hover:text-red-600 transition-colors"
                >
                  {cat.name}
                </Link>
                <ul className="mt-4 space-y-2.5">
                  {toolsByCategory[cat.slug]?.map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/${cat.slug}/${tool.slug}`}
                        className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                      >
                        {tool.name}
                      </Link>
                    </li>
                  ))}
                  <li className="pt-1">
                    <Link
                      href={`/${cat.slug}`}
                      className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
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
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-sm text-slate-500 hover:text-slate-900 transition-colors"
                  >
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-14 border-t border-slate-200 pt-8 flex flex-col items-center justify-between gap-3 sm:flex-row">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} toolify. All rights reserved.
          </p>
          <p className="text-sm text-slate-400">
            No bloat. No paywalls. Just tools that work.
          </p>
        </div>
      </div>
    </footer>
  );
}
