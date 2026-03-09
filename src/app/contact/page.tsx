import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with the toolify team. We're here to help with questions, feedback, and partnership inquiries.",
  alternates: { canonical: "/contact" },
};

const channels = [
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
      </svg>
    ),
    label: "Email",
    value: "info@fasttoolify.com",
    href: "mailto:mhturknn@gmail.com",
    description: "For general questions and support.",
    accent: "bg-red-50 text-red-600 border-red-100",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
      </svg>
    ),
    label: "Feedback",
    value: "Share your thoughts",
    href: "mailto:mhturknn@gmail.com?subject=Feedback",
    description: "Feature requests, bug reports, ideas.",
    accent: "bg-blue-50 text-blue-600 border-blue-100",
  },
  {
    icon: (
      <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 14.15v4.25c0 1.094-.787 2.036-1.872 2.18-2.087.277-4.216.42-6.378.42s-4.291-.143-6.378-.42c-1.085-.144-1.872-1.086-1.872-2.18v-4.25m16.5 0a2.18 2.18 0 00.75-1.661V8.706c0-1.081-.768-2.015-1.837-2.175a48.114 48.114 0 00-3.413-.387m4.5 8.006c-.194.165-.42.295-.673.38A23.978 23.978 0 0112 15.75c-2.648 0-5.195-.429-7.577-1.22a2.016 2.016 0 01-.673-.38m0 0A2.18 2.18 0 013 12.489V8.706c0-1.081.768-2.015 1.837-2.175a48.111 48.111 0 013.413-.387m7.5 0V5.25A2.25 2.25 0 0013.5 3h-3a2.25 2.25 0 00-2.25 2.25v.894m7.5 0a48.667 48.667 0 00-7.5 0M12 12.75h.008v.008H12v-.008z" />
      </svg>
    ),
    label: "Business",
    value: "Partnership & Ads",
    href: "mailto:mhturknn@gmail.com?subject=Business%20Inquiry",
    description: "Advertising, partnerships, sponsorships.",
    accent: "bg-violet-50 text-violet-600 border-violet-100",
  },
];

const faqs = [
  {
    q: "How quickly do you respond?",
    a: "We typically respond within 24–48 hours on business days.",
  },
  {
    q: "I found a bug. How do I report it?",
    a: "Email us with the tool name and a brief description of the issue. Screenshots are always helpful.",
  },
  {
    q: "Can I request a new tool?",
    a: "Absolutely. We review all feature requests and prioritize based on user demand.",
  },
  {
    q: "Do you offer API access?",
    a: "API access is available on our Business plan. Reach out via the Business channel above.",
  },
];

export default function ContactPage() {
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
          className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-red-50 opacity-60 blur-3xl -translate-y-1/2 translate-x-1/3"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-0 bottom-0 h-64 w-64 rounded-full bg-blue-50 opacity-50 blur-3xl translate-y-1/3 -translate-x-1/4"
        />

        <div className="relative mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-2 py-1 text-[10px] font-semibold text-slate-500 uppercase tracking-widest shadow-sm mb-6">
            Get in Touch
          </div>
          <h1 className="text-4xl font-semibold tracking-tight text-slate-900 sm:text-5xl leading-[1.1]">
            We&apos;d love to{" "}
            <span className="relative inline-block">
              <span className="text-red-600">hear from you</span>
              <span
                aria-hidden
                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-red-200 rounded-full"
              />
            </span>
          </h1>
          <p className="mt-6 mx-auto max-w-xl text-lg text-slate-500 leading-relaxed">
            Whether you have a question, found a bug, or just want to say hello —
            our inbox is always open.
          </p>
        </div>
      </section>

      {/* Contact channels */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="grid gap-5 sm:grid-cols-3">
            {channels.map((ch) => (
              <a
                key={ch.label}
                href={ch.href}
                className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-7 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-300 hover:shadow-lg"
              >
                <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl border ${ch.accent}`}>
                  {ch.icon}
                </div>
                <div>
                  <p className="font-semibold text-slate-900 mb-0.5">{ch.label}</p>
                  <p className="text-sm font-medium text-slate-500 mb-2">{ch.description}</p>
                  <p className="text-sm font-semibold text-red-600 group-hover:underline underline-offset-2">
                    {ch.value}
                  </p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Quick info strip */}
      <section className="border-t border-b border-slate-100 bg-slate-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl grid gap-8 sm:grid-cols-3 text-center">
          <div>
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm">
              <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <p className="font-semibold text-slate-900 text-sm">Response Time</p>
            <p className="mt-1 text-sm text-slate-500">Within 24–48 hours</p>
          </div>
          <div>
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm">
              <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 012.25-2.25h13.5A2.25 2.25 0 0121 7.5v11.25m-18 0A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75m-18 0v-7.5A2.25 2.25 0 015.25 9h13.5A2.25 2.25 0 0121 11.25v7.5" />
              </svg>
            </div>
            <p className="font-semibold text-slate-900 text-sm">Working Hours</p>
            <p className="mt-1 text-sm text-slate-500">
              Mon – Fri, 09:00 – 18:00
              <br></br>(Istanbul Time, UTC+3)
            </p>
          </div>
          <div>
            <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-white border border-slate-200 shadow-sm">
              <svg className="h-5 w-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
              </svg>
            </div>
            <p className="font-semibold text-slate-900 text-sm">Location</p>
            <p className="mt-1 text-sm text-slate-500">Remote — Worldwide</p>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">
              FAQ
            </p>
            <h2 className="text-3xl font-medium tracking-tight text-slate-900">
              Common questions
            </h2>
          </div>
          <div className="space-y-4">
            {faqs.map((faq) => (
              <div
                key={faq.q}
                className="rounded-xl border border-slate-100 bg-slate-50 px-6 py-5"
              >
                <p className="font-semibold text-slate-900 mb-2">{faq.q}</p>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Bottom strip */}
      <section className="border-t border-slate-100 px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-semibold text-slate-900">Not sure where to start?</p>
            <p className="text-sm text-slate-500 mt-0.5">
              Browse our tools — most answers are right there.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Link
              href="/tools"
              className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-red-700"
            >
              Explore Tools
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition-all hover:-translate-y-0.5 hover:border-slate-300"
            >
              About Us
            </Link>
          </div>
        </div>
      </section>

    </main>
  );
}
