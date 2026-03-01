import Breadcrumb from "@/components/layout/Breadcrumb";

interface ToolPageLayoutProps {
  breadcrumbs: { label: string; href?: string }[];
  title: string;
  description: string;
  children: React.ReactNode;
  howToSteps?: { title: string; description: string }[];
  benefits?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
}

export default function ToolPageLayout({
  breadcrumbs,
  title,
  description,
  children,
  howToSteps,
  benefits,
  faqs,
}: ToolPageLayoutProps) {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <section className="border-b border-slate-200 bg-white px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          <Breadcrumb items={breadcrumbs} />
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {title}
          </h1>
          <p className="mt-3 text-lg text-slate-600">{description}</p>
        </div>
      </section>

      {/* Tool UI */}
      <section className="px-4 py-10 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">{children}</div>
      </section>

      {/* How To */}
      {howToSteps && howToSteps.length > 0 && (
        <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900">How to Use</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-3">
              {howToSteps.map((step, i) => (
                <div key={i} className="flex gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
                    {i + 1}
                  </span>
                  <div>
                    <h3 className="font-semibold text-slate-900">{step.title}</h3>
                    <p className="mt-1 text-sm text-slate-500">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Benefits */}
      {benefits && benefits.length > 0 && (
        <section className="px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900">Why Use Our Tool?</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {benefits.map((b, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-5"
                >
                  <h3 className="font-semibold text-slate-900">{b.title}</h3>
                  <p className="mt-1 text-sm text-slate-500">{b.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <section className="border-t border-slate-200 bg-white px-4 py-12 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-2xl font-bold text-slate-900">
              Frequently Asked Questions
            </h2>
            <div className="mt-6 divide-y divide-slate-200">
              {faqs.map((faq, i) => (
                <div key={i} className="py-5">
                  <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                  <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
