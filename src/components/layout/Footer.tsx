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

  return (
    <footer className="border-t border-slate-200 bg-slate-50 text-slate-700">
      <div className="mx-auto max-w-5xl max-sm:px-4 py-12">
        {/* CTA Banner */}
        {/* <div className="mb-16 overflow-hidden rounded-2xl bg-linear-to-br from-red-500 to-red-900 px-8 py-8 shadow-md sm:px-10">
          <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-200">
                Privacy first
              </p>
              <h2 className="mt-2 text-2xl font-bold text-white sm:text-3xl">
                Everything runs in your browser
              </h2>
              <p className="mt-2 text-sm text-red-100 sm:text-base">
                No uploads to servers. No waiting. Just instant, private
                results.
              </p>
            </div>
            <Link
              href="/tools"
              className="shrink-0 rounded-xl bg-white px-8 py-3.5 text-sm font-bold text-red-600 shadow-sm transition-all hover:bg-red-50 hover:shadow-md hover:-translate-y-0.5"
            >
              Browse all tools →
            </Link>
          </div>
        </div> */}

        {/* Main Content: Brand (Left) + Categories Grid (Right) */}
        <div className="flex flex-col gap-12 lg:flex-row lg:gap-16">
          {/* Brand & Info Column */}
          <div className="lg:w-[30%] shrink-0">
            <Link
              href="/"
              className="inline-flex items-center gap-2 transition-opacity hover:opacity-80"
            >
              <Image
                src={"/icons/logo.png"}
                width={32}
                height={32}
                alt="toolify logo"
              />
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
                tool<span className="text-red-600">ify</span>
              </span>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-slate-500 max-w-sm lg:max-w-none">
              Free online tools for PDF, image, video, and file conversion.
              Everything runs in your browser — fast, private, no sign-up.
            </p>
            <ul className="mt-6 space-y-2.5">
              {[
                "100% free to use",
                "No registration required",
                "Processed in your browser",
                "No file size limits",
              ].map((f) => (
                <li
                  key={f}
                  className="flex items-center gap-2.5 text-sm text-slate-500"
                >
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-green-100 text-green-600">
                    <svg
                      className="h-3 w-3"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  {f}
                </li>
              ))}
            </ul>
          </div>

          {/* Categories Flexible Grid */}
          <div className="grid flex-1 grid-cols-2 gap-x-8 gap-y-10 sm:grid-cols-3 lg:grid-cols-4">
            {CATEGORIES.map((cat) => (
              <div key={cat.slug} className="flex flex-col">
                <Link
                  href={`/tools/${cat.slug}`}
                  className="text-sm font-semibold uppercase tracking-wider text-slate-900 transition-colors hover:text-red-600"
                >
                  {cat.name}
                </Link>
                <ul className="mt-4 flex flex-col space-y-3">
                  {toolsByCategory[cat.slug]?.slice(0, 4).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${cat.slug}/${tool.slug}`}
                        className="group flex items-center gap-2 text-sm text-slate-500 transition-colors hover:text-slate-900"
                      >
                        <span className="truncate">{tool.name}</span>
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
                  {/* View All Link */}
                  {(toolsByCategory[cat.slug]?.length ?? 0) > 4 && (
                    <li className="pt-1">
                      <Link
                        href={`/tools/${cat.slug}`}
                        className="inline-flex items-center text-sm font-semibold text-red-600 transition-colors hover:text-red-800"
                      >
                        View all{" "}
                        <span aria-hidden="true" className="ml-1">
                          →
                        </span>
                      </Link>
                    </li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} toolify. All rights reserved.
          </p>
          <div className="flex items-center gap-4 text-sm text-slate-500">
            <Link
              href="/privacy-and-policy"
              className="transition-colors hover:text-slate-900"
            >
              Privacy Policy
            </Link>
            <span className="h-4 w-px bg-slate-300" aria-hidden="true"></span>
            <Link
              href="/terms"
              className="transition-colors hover:text-slate-900"
            >
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
