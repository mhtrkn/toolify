import type { Metadata } from "next";
import ToolCard from "@/components/tools/ToolCard";
import JsonLd from "@/components/seo/JsonLd";
import { getToolsByCategory, getCategoryBySlug } from "@/lib/tools";
import { buildCategoryMetadata, SITE_URL } from "@/lib/metadata";
import { buildFaqSchema, buildBreadcrumbSchema } from "@/lib/structured-data";
import Link from "next/link";
import ToolHeader from "@/components/tools/ToolHeader";

export const metadata: Metadata = buildCategoryMetadata({
  categoryName: "Developer Tools",
  categoryDescription:
    "Free developer utilities — code formatter, regex tester, URL encoder/decoder, JWT decoder. Client-side, fast, no signup required.",
  categorySlug: "developer-tools",
  keywords: [
    "free developer tools online",
    "code formatter online",
    "regex tester free",
    "url encoder decoder online",
    "jwt decoder online",
    "developer utilities browser",
    "code beautifier online free",
    "json formatter online",
    "regex debugger free",
    "developer tools no install",
  ],
});

const FAQS = [
  {
    question: "Are all these developer tools free?",
    answer:
      "Yes. Every tool is 100% free with no account, API key, or subscription needed.",
  },
  {
    question: "Is my code or data sent to a server?",
    answer:
      "No. All tools run 100% in your browser. Your code, regex patterns, URLs, and JWT tokens never leave your device.",
  },
  {
    question: "Which languages does the code formatter support?",
    answer:
      "JSON, HTML, CSS, JavaScript, and SQL — both beautify and minify modes.",
  },
  {
    question: "Does the JWT decoder verify signatures?",
    answer:
      "No. It only decodes the base64url-encoded header and payload. Signature verification requires a secret/private key and is intentionally not supported for security reasons.",
  },
  {
    question: "What regex syntax does the regex tester support?",
    answer:
      "JavaScript (ECMAScript) regex syntax with full flag support: g (global), i (case-insensitive), m (multiline), and s (dotAll).",
  },
];

export default function DeveloperToolsPage() {
  const tools = getToolsByCategory("developer-tools");
  const category = getCategoryBySlug("developer-tools")!;

  const codeTools = tools.filter(
    (t) => t.slug === "code-formatter" || t.slug === "regex-tester",
  );
  const encodingTools = tools.filter(
    (t) => t.slug === "url-encoder-decoder" || t.slug === "jwt-decoder",
  );
  const otherTools = tools.filter(
    (t) => !codeTools.includes(t) && !encodingTools.includes(t),
  );

  return (
    <main className="min-h-screen bg-slate-50">
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Developer Tools", url: `${SITE_URL}/developer-tools` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      {/* Header */}
      <section className="border-b border-slate-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <ToolHeader
            title="Developer Tools – Free Online Code Formatter, Regex Tester & More"
            icon={category.icon}
            description={category.description}
            bgColor={category.bgColor}
            borderColor={category.borderColor}
          />
        </div>
      </section>

      {/* Code Tools */}
      {codeTools.length > 0 && (
        <section className="px-4 pt-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
              Code Formatter & Regex
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {codeTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Encoding Tools */}
      {encodingTools.length > 0 && (
        <section className="px-4 pt-8 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
              Encoding & Token Tools
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {encodingTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Other Tools */}
      {otherTools.length > 0 && (
        <section className="px-4 pt-8 pb-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <h2 className="mb-6 text-sm font-semibold uppercase tracking-widest text-slate-400">
              More Developer Tools
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
              {otherTools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SEO Text */}
      <section className="border-t border-slate-100 bg-white px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900">
            Essential Developer Utilities — No Install Required
          </h2>
          <p className="mt-3 text-slate-600">
            Stop switching between tabs to format JSON or test a regex. Our free
            developer tools let you{" "}
            <Link
              href="/developer-tools/code-formatter"
              className="text-red-600 hover:underline"
            >
              format and minify code
            </Link>{" "}
            for JSON, HTML, CSS, JavaScript, and SQL in seconds, or{" "}
            <Link
              href="/developer-tools/regex-tester"
              className="text-red-600 hover:underline"
            >
              test your regex patterns
            </Link>{" "}
            with live match highlighting and capture group display.
          </p>
          <p className="mt-3 text-slate-600">
            Need to{" "}
            <Link
              href="/developer-tools/url-encoder-decoder"
              className="text-red-600 hover:underline"
            >
              encode a URL
            </Link>{" "}
            or{" "}
            <Link
              href="/developer-tools/jwt-decoder"
              className="text-red-600 hover:underline"
            >
              decode a JWT token
            </Link>
            ? All tools run client-side — nothing is uploaded to any server.
            Fast, private, and always free.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section className="px-4 py-12 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-xl font-bold text-slate-900">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 divide-y divide-slate-100 rounded-xl border border-slate-100 bg-white">
            {FAQS.map((faq, i) => (
              <div key={i} className="px-6 py-5">
                <h3 className="font-semibold text-slate-900">{faq.question}</h3>
                <p className="mt-2 text-sm text-slate-600">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
