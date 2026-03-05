/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import { CATEGORIES } from "@/lib/tools";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center px-4 py-16 text-center">
      <Image
        src={"/icons/404.png"}
        alt="404 not found"
        width={256}
        height={256}
      />
      <h1 className="mt-4 text-2xl font-bold text-slate-900">Page Not Found</h1>
      <p className="mt-2 text-slate-500">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link
        href="/"
        className="mt-2 mb-4 inline-flex items-center justify-center rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition-colors duration-150 hover:bg-red-700"
      >
        back to home
      </Link>

      <div className="mt-8 flex flex-wrap justify-center gap-2">
        {CATEGORIES.map((cat) => (
          <Link
            key={cat.slug}
            href={`/tools/${cat.slug}`}
            className="flex items-center gap-2 rounded-xl border border-slate-100 px-4 py-2.5 text-sm text-slate-600 transition-colors duration-150 hover:bg-slate-50"
          >
            <Image
              src={`/icons/${cat.icon}.png`}
              alt={cat.description}
              width={32}
              height={32}
            />
            {cat.name}
          </Link>
        ))}
      </div>
    </main>
  );
}
