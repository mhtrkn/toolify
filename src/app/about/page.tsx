import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about toolify — who we are, what we build, and why we believe great tools should be free and fast for everyone.",
  alternates: { canonical: "/about" },
};

const stats = [
  { value: "40+", label: "Free Tools" },
  { value: "10K+", label: "Files Processed" },
  { value: "180+", label: "Countries Reached" },
  { value: "99.9%", label: "Uptime" },
];

const values = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Speed First",
    description: "Every tool is built to run instantly in your browser. No waiting, no server queues — just results.",
    accent: "bg-amber-50 text-amber-600 border-amber-100",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    title: "Privacy by Default",
    description: "Your files never leave your device when processed in-browser. What you upload stays yours.",
    accent: "bg-green-50 text-green-600 border-green-100",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
      </svg>
    ),
    title: "Built for Everyone",
    description: "No account. No software. No expertise required. If you have a browser, you have our tools.",
    accent: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    title: "Quality Output",
    description: "We obsess over output quality. Every tool is tested to produce the best possible result.",
    accent: "bg-violet-50 text-violet-600 border-violet-100",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white">

      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 px-4 py-24 sm:px-6 lg:px-8">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,_rgba(239,68,68,0.07),_transparent)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-red-50 opacity-70 blur-3xl -translate-y-1/2 translate-x-1/3"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 bottom-0 h-64 w-64 rounded-full bg-violet-50 opacity-60 blur-3xl translate-y-1/3 -translate-x-1/4"
        />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest shadow-sm mb-6">
            Our Story
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-6xl lg:text-5xl leading-[1.1]">
            Tools that work{" "}
            <span className="relative inline-block">
              <span className="text-red-600">for you</span>
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-200 rounded-full"
              />
            </span>
          </h1>
          <p className="mt-6 mx-auto max-w-2xl text-lg text-slate-500 leading-relaxed">
            toolify was built on a simple belief: the best tools should be free,
            fast, and private. No bloat. No accounts. Just results — right in your
            browser.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-red-100 transition-all hover:-translate-y-0.5 hover:bg-red-700"
            >
              Explore Our Tools
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-b border-slate-100 bg-slate-50 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <div className="grid grid-cols-2 gap-8 sm:grid-cols-4">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-4xl font-extrabold tracking-tight text-slate-900">
                  {s.value}
                </p>
                <p className="mt-1.5 text-sm font-medium text-slate-500">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-red-500 mb-3">
                Our Mission
              </p>
              <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl leading-tight">
                Democratizing access to professional-grade tools
              </h2>
              <p className="mt-5 text-slate-500 leading-relaxed">
                Too many essential utilities are locked behind expensive
                subscriptions, clunky desktop software, or privacy-invading
                cloud services. We set out to fix that.
              </p>
              <p className="mt-4 text-slate-500 leading-relaxed">
                Every tool on toolify is designed to run directly in your
                browser — meaning your files never need to touch our servers.
                Fast, private, and always free for core features.
              </p>
              <div className="mt-8 flex flex-wrap gap-2.5">
                {["Browser-native", "Zero signup", "Open output", "Privacy-safe"].map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-slate-200 bg-slate-50 px-4 py-1.5 text-xs font-semibold text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Visual card stack */}
            <div className="relative hidden lg:block">
              <div className="absolute top-4 left-8 right-8 h-52 rounded-2xl border border-slate-100 bg-slate-50 rotate-3 shadow-sm" />
              <div className="absolute top-2 left-4 right-4 h-52 rounded-2xl border border-red-100 bg-red-50 -rotate-1 shadow-sm" />
              <div className="relative mx-2 rounded-2xl border border-slate-200 bg-white p-7 shadow-xl">
                <div className="flex items-center gap-3 mb-5">
                  <Image src={"/icons/logo.png"} alt="toolify logo" width={32} height={32} />
                  <div>
                    <p className="font-bold text-slate-900 text-sm">toolify</p>
                    <p className="text-xs text-slate-400">40+ free tools</p>
                  </div>
                </div>
                <div className="space-y-2.5">
                  {["PDF Tools", "Image Tools", "File Converter Tools", "OCR Tools", "Web Tools", "Social Media Tools", "SEO Tools", "Developer Tools"].map((t) => (
                    <div key={t} className="flex items-center gap-2.5">
                      <div className="h-1.5 w-1.5 rounded-full bg-red-400 shrink-0" />
                      <span className="text-sm text-slate-600">{t}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 pt-4 border-t border-slate-100 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-green-500 shrink-0" />
                  <span className="text-xs text-slate-500">All tools running in-browser</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="border-t border-slate-100 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              What We Stand For
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900">
              Our core values
            </h2>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md"
              >
                <div
                  className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${v.accent} mb-4`}
                >
                  {v.icon}
                </div>
                <h3 className="font-bold text-slate-900 mb-2">{v.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact strip */}
      <section className="border-t border-slate-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-semibold text-slate-900">Have a question or feedback?</p>
            <p className="text-sm text-slate-500 mt-0.5">We&apos;d love to hear from you.</p>
          </div>
          <a
            href="mailto:mhturknn@gmail.com"
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-md"
          >
            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
            </svg>
            info@fasttoolify.com
          </a>
        </div>
      </section>

    </main>
  );
}
