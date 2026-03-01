import type { Metadata } from "next";
import Link from "next/link";
import ToolCard from "@/components/tools/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import { CATEGORIES, getPopularTools } from "@/lib/tools";
import { buildWebSiteSchema } from "@/lib/structured-data";
import { SITE_DESCRIPTION } from "@/lib/metadata";
import SearchBar from "@/components/home/SearchBar";
import Image from "next/image";
import { whyChooseData } from "@/lib/mockdata";

export const metadata: Metadata = {
  title: "Free Online Tools – PDF, Image, Video & File Converter",
  description: SITE_DESCRIPTION,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const popularTools = getPopularTools();


  return (
    <main>
      <JsonLd data={buildWebSiteSchema()} />

      {/* Hero */}
      <section className="bg-grid-pattern border-b border-slate-200 bg-white px-4 py-16 text-center sm:px-6 sm:py-26 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Free Online Tools –{" "}
            <span className="text-red-600">
              PDF, Image, Video & File Converter
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-lg text-slate-600">
            All the tools you need in one place. No software to install, no
            account required. Fast, free, and secure.
          </p>
          <div className="mt-8">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-slate-900">Tool Categories</h2>
          <p className="mt-2 text-slate-500">
            Choose a category to find the right tool for your task.
          </p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.slug}
                href={`/${cat.slug}`}
                className={`group flex flex-col items-center gap-3 rounded-xl border p-6 text-center transition-all hover:shadow-md ${cat.bgColor} ${cat.borderColor}`}
              >
                <Image src={`/icons/${cat.icon}.png`} alt={cat.description} width={36} height={36} />
                <div>
                  <p className={`font-semibold ${cat.color}`}>{cat.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Tools */}
      <section className="border-t border-slate-200 bg-white px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-2xl font-bold text-slate-900">Popular Tools</h2>
          <p className="mt-2 text-slate-500">
            Most-used tools trusted by millions of users every day.
          </p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {popularTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </div>
      </section>

      {/* Features / Trust Section */}
      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <h2 className="text-center text-2xl font-bold text-slate-900">
            Why Choose Toolify?
          </h2>
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {whyChooseData.map((feature) => (
              <div
                key={feature.title}
                className="rounded-xl border border-slate-200 bg-white p-6 text-center"
              >
                <div className="flex items-center justify-center mb-2">
                  <Image src={`/icons/${feature.icon}.png`} alt={feature.description} width={32} height={32} />
                </div>
                <h3 className="font-semibold text-slate-900">{feature.title}</h3>
                <p className="mt-2 text-sm text-slate-500">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEO Text */}
      <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl prose prose-slate">
          <h2 className="text-xl font-bold text-slate-900">
            The Best Free Online Tools for Everyday Tasks
          </h2>
          <p className="mt-3 text-slate-600">
            Toolify offers a comprehensive suite of free online tools to handle
            your everyday file conversion, editing, and optimization needs.
            Whether you need to convert a{" "}
            <Link href="/pdf-tools/pdf-to-jpg" className="text-red-600 hover:underline">
              PDF to JPG
            </Link>
            , compress images, extract audio from video, or convert documents —
            we have you covered.
          </p>
          <p className="mt-3 text-slate-600">
            All tools are designed to be beginner-friendly with a clean,
            distraction-free interface. No ads, no popups, no confusing options.
            Just upload your file, click the button, and download the result.
          </p>
        </div>
      </section>
    </main>
  );
}
