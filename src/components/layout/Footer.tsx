import Link from "next/link";
import { CATEGORIES } from "@/lib/tools";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="text-3xl font-bold text-slate-900">
              tool<span className="text-red-600">ify</span>
            </Link>
            <p className="mt-3 text-sm text-slate-500">
              Free online tools for PDF, image, video, and file conversion.
              Fast, secure, and no registration required.
            </p>
          </div>

          {/* Tool Categories */}
          {CATEGORIES.slice(0, 3).map((cat) => (
            <div key={cat.slug}>
              <h3 className="text-sm font-semibold text-slate-900">
                {cat.name}
              </h3>
              <ul className="mt-3 space-y-2">
                <li>
                  <Link
                    href={`/${cat.slug}`}
                    className="text-sm text-slate-500 hover:text-slate-900"
                  >
                    All {cat.name}
                  </Link>
                </li>
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-slate-200 pt-8 sm:flex-row">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Toolify. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/privacy" className="text-sm text-slate-400 hover:text-slate-600">
              Privacy Policy
            </Link>
            <Link href="/terms" className="text-sm text-slate-400 hover:text-slate-600">
              Terms of Service
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
