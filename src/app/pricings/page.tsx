import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pricing – Free & Premium Plans | toolify",
  description:
    "Choose the plan that fits your needs. Start free, upgrade anytime. No hidden fees.",
  alternates: { canonical: "/pricings" },
};

const plans = [
  {
    name: "Free",
    badge: null,
    price: 0,
    period: "forever",
    description: "Perfect for occasional use. No credit card required.",
    cta: "Get Started Free",
    ctaHref: "/tools",
    highlight: false,
    features: [
      { text: "Access to all basic tools", included: true },
      { text: "Up to 5 files per day", included: true },
      { text: "Max file size 25 MB", included: true },
      { text: "Standard processing speed", included: true },
      { text: "Watermark-free output", included: true },
      { text: "Priority processing", included: false },
      { text: "Batch processing (up to 50 files)", included: false },
      { text: "API access", included: false },
      { text: "Premium support", included: false },
    ],
  },
  {
    name: "Pro",
    badge: "Most Popular",
    price: 9,
    period: "month",
    description: "Ideal for freelancers and power users who need more.",
    cta: "Start Pro — $9/mo",
    ctaHref: "#",
    highlight: true,
    features: [
      { text: "Access to all tools", included: true },
      { text: "Unlimited files per day", included: true },
      { text: "Max file size 500 MB", included: true },
      { text: "Priority processing speed", included: true },
      { text: "Watermark-free output", included: true },
      { text: "Priority processing", included: true },
      { text: "Batch processing (up to 50 files)", included: true },
      { text: "API access", included: false },
      { text: "Premium support", included: false },
    ],
  },
  {
    name: "Pro - Max",
    badge: null,
    price: 19,
    period: "month",
    description: "For teams and businesses that demand scale and control.",
    cta: "Start Pro Max — $19/mo",
    ctaHref: "#",
    highlight: false,
    features: [
      { text: "Access to all tools", included: true },
      { text: "Unlimited files per day", included: true },
      { text: "Max file size 2 GB", included: true },
      { text: "Blazing-fast processing", included: true },
      { text: "Watermark-free output", included: true },
      { text: "Priority processing", included: true },
      { text: "Batch processing (unlimited)", included: true },
      { text: "Full API access", included: true },
      { text: "Dedicated premium support", included: true },
    ],
  },
];

const faqs = [
  {
    q: "Can I cancel my subscription anytime?",
    a: "Yes. You can cancel at any time from your account settings. Your plan stays active until the end of the billing period.",
  },
  {
    q: "Is my data safe?",
    a: "Absolutely. All files are processed in-browser when possible, and any server-side uploads are deleted immediately after processing.",
  },
  {
    q: "Do I need a credit card for the Free plan?",
    a: "No credit card is required. Just start using the tools right away.",
  },
  {
    q: "Can I upgrade or downgrade later?",
    a: "Yes. You can switch plans at any time. Upgrades take effect immediately, downgrades at the next billing cycle.",
  },
];

export default function PricingsPage() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-slate-100 bg-gradient-to-b from-slate-50 to-white px-4 py-24 text-center sm:px-6 lg:px-8">
        {/* Decorative blobs */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 h-[500px] w-[900px] rounded-full bg-red-50 opacity-60 blur-3xl"
        />
        <div className="relative mx-auto max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-100 bg-red-50 px-4 py-1.5 text-xs font-semibold text-red-600 uppercase tracking-widest mb-6">
            Pricing
          </div>
          <h1 className="text-5xl font-extrabold tracking-tight text-slate-900 sm:text-6xl">
            Simple, transparent{" "}
            <span className="text-red-600">pricing</span>
          </h1>
          <p className="mt-5 text-lg text-slate-500 leading-relaxed">
            Start free. Upgrade when you need more power. No surprises, no hidden fees.
          </p>
        </div>
      </section>

      {/* Plans */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 lg:grid-cols-3 lg:items-stretch">
            {plans.map((plan) => (
              <PricingCard key={plan.name} plan={plan} />
            ))}
          </div>

          <p className="mt-8 text-center text-sm text-slate-400">
            All plans include a{" "}
            <span className="font-medium text-slate-600">7-day free trial</span>{" "}
            on paid tiers. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="border-t border-slate-100 bg-slate-50 px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              Compare
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Full feature breakdown
            </h2>
          </div>

          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-6 py-4 text-left font-semibold text-slate-500 w-1/2">
                    Feature
                  </th>
                  {plans.map((p) => (
                    <th
                      key={p.name}
                      className={`px-6 py-4 text-center font-bold ${p.highlight ? "text-red-600" : "text-slate-900"
                        }`}
                    >
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ["Daily file limit", "5 files", "Unlimited", "Unlimited"],
                  ["Max file size", "25 MB", "500 MB", "2 GB"],
                  ["Processing speed", "Standard", "Priority", "Blazing fast"],
                  ["Watermark-free", true, true, true],
                  ["Batch processing", false, "Up to 50", "Unlimited"],
                  ["API access", false, false, true],
                  ["Support", "Community", "Email", "Dedicated"],
                ].map(([feature, free, pro, biz], i) => (
                  <tr
                    key={i}
                    className="border-b border-slate-50 hover:bg-slate-50 transition-colors"
                  >
                    <td className="px-6 py-4 text-slate-700 font-medium">
                      {feature}
                    </td>
                    {[free, pro, biz].map((val, j) => (
                      <td key={j} className="px-6 py-4 text-center">
                        {typeof val === "boolean" ? (
                          val ? (
                            <CheckIcon className="mx-auto text-green-500" />
                          ) : (
                            <XIcon className="mx-auto text-slate-300" />
                          )
                        ) : (
                          <span
                            className={`font-medium ${j === 1 ? "text-red-600" : "text-slate-700"
                              }`}
                          >
                            {val}
                          </span>
                        )}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* Testimonials / trust */}
      <section className="px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <div className="grid gap-6 sm:grid-cols-3">
            {[
              {
                quote:
                  "toolify Pro saved me hours every week. The batch processing alone is worth it.",
                author: "Alex M.",
                role: "Freelance Designer",
              },
              {
                quote:
                  "We integrated the API into our workflow. The Business plan pays for itself.",
                author: "Sara K.",
                role: "Product Manager",
              },
              {
                quote:
                  "Started on Free, upgraded to Pro in a day. Couldn't go back.",
                author: "James L.",
                role: "Content Creator",
              },
            ].map((t) => (
              <div
                key={t.author}
                className="rounded-2xl border border-slate-100 bg-slate-50 p-6"
              >
                <div className="flex gap-0.5 mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg
                      key={i}
                      className="h-4 w-4 text-amber-400 fill-amber-400"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-slate-600 text-sm leading-relaxed italic mb-4">
                  &ldquo;{t.quote}&rdquo;
                </p>
                <p className="text-sm font-semibold text-slate-900">{t.author}</p>
                <p className="text-xs text-slate-400">{t.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="border-t border-slate-100 bg-white px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="mb-10 text-center">
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
              FAQ
            </p>
            <h2 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
              Frequently asked questions
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

      {/* Bottom CTA */}
      <section className="border-t border-slate-100 bg-gradient-to-br from-slate-900 to-slate-800 px-4 py-20 text-center sm:px-6 lg:px-8">
        <div className="mx-auto max-w-xl">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to get started?
          </h2>
          <p className="text-slate-400 mb-8">
            Join thousands of users who trust toolify every day. No commitment required.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/tools"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-6 py-3 text-sm font-semibold text-slate-900 shadow transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              Start for Free
            </Link>
            <Link
              href="#"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold text-white backdrop-blur transition-all hover:-translate-y-0.5 hover:bg-white/20"
            >
              View Pro Plan
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

function PricingCard({
  plan,
}: {
  plan: (typeof plans)[number];
}) {
  return (
    <div
      className={`relative flex flex-col rounded-2xl border p-8 transition-all duration-200 ${plan.highlight
        ? "border-red-200 bg-gradient-to-b from-red-50 to-white shadow-xl shadow-red-100 scale-[1.02]"
        : "border-slate-200 bg-white hover:shadow-md hover:-translate-y-0.5"
        }`}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-600 px-3.5 py-1 text-xs font-bold text-white shadow-md shadow-red-200">
            <svg className="h-3 w-3 fill-white" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
            {plan.badge}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="mb-6">
        <p
          className={`text-xs font-bold uppercase tracking-widest mb-2 ${plan.highlight ? "text-red-500" : "text-slate-400"
            }`}
        >
          {plan.name}
        </p>
        <div className="flex items-end gap-1 mb-2">
          <span className="text-5xl font-extrabold text-slate-900">
            {plan.price === 0 ? "Free" : `$${plan.price}`}
          </span>
          {plan.price > 0 && (
            <span className="text-slate-400 text-sm mb-2">/ {plan.period}</span>
          )}
        </div>
        <p className="text-sm text-slate-500">{plan.description}</p>
      </div>

      {/* CTA */}
      <Link
        href={plan.ctaHref}
        className={`mb-8 inline-flex items-center justify-center rounded-xl px-5 py-3 text-sm font-semibold transition-all hover:-translate-y-0.5 ${plan.highlight
          ? "bg-red-600 text-white shadow-md shadow-red-200 hover:bg-red-700 hover:shadow-lg hover:shadow-red-200"
          : "border border-slate-200 bg-white text-slate-800 hover:border-slate-300 hover:shadow-sm"
          }`}
      >
        {plan.cta}
      </Link>

      {/* Divider */}
      <div
        className={`mb-6 h-px ${plan.highlight ? "bg-red-100" : "bg-slate-100"}`}
      />

      {/* Features */}
      <ul className="space-y-3 flex-1">
        {plan.features.map((f) => (
          <li key={f.text} className="flex items-center gap-3">
            {f.included ? (
              <CheckIcon className="shrink-0 text-green-500" />
            ) : (
              <XIcon className="shrink-0 text-slate-300" />
            )}
            <span
              className={`text-sm ${f.included ? "text-slate-700" : "text-slate-400"
                }`}
            >
              {f.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function CheckIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
    </svg>
  );
}

function XIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`h-4 w-4 ${className}`}
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={2.5}
    >
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
  );
}
