/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | toolify",
  description:
    "Read our Terms of Service to understand the rules and conditions for using our website.",
  robots: "index, follow",
};

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "acceptance", label: "Acceptance of Terms" },
  { id: "use-of-service", label: "Use of Service" },
  { id: "intellectual-property", label: "Intellectual Property" },
  { id: "file-processing", label: "File Processing" },
  { id: "disclaimer", label: "Disclaimer" },
  { id: "liability", label: "Limitation of Liability" },
  { id: "third-party", label: "Third-Party Links" },
  { id: "termination", label: "Termination" },
  { id: "changes", label: "Changes to Terms" },
  { id: "governing-law", label: "Governing Law" },
  { id: "contact", label: "Contact Information" },
];

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-red-600 uppercase tracking-wide">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            Terms of Service
          </h1>
          <p className="text-slate-500 text-base">
            Last updated:{" "}
            <span className="font-medium text-slate-700">March 1, 2026</span>
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-10 lg:grid lg:grid-cols-[220px_1fr] lg:gap-10">
        {/* Sidebar — Table of Contents */}
        <aside className="hidden lg:block">
          <div className="sticky top-20 bg-white border border-slate-200 rounded-xl p-4">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              On this page
            </p>
            <nav className="space-y-1">
              {sections.map((s) => (
                <a
                  key={s.id}
                  href={`#${s.id}`}
                  className="block px-3 py-1.5 rounded-lg text-sm text-slate-600 hover:text-red-600 hover:bg-red-50 transition-colors"
                >
                  {s.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        {/* Content */}
        <div className="space-y-6">
          {/* Introduction */}
          <Section id="introduction" title="1. Introduction">
            <p className="text-slate-600 leading-relaxed">
              Welcome to <strong className="text-slate-800">tool<span className="text-red-600">ify</span></strong> ("we", "our", "us"). By accessing and using this website, you agree to comply with and be bound by these Terms of Service.
            </p>
          </Section>

          {/* Acceptance */}
          <Section id="acceptance" title="2. Acceptance of Terms">
            <p className="text-slate-600 leading-relaxed">
              By using this website, you confirm that you have read, understood, and agreed to these Terms. If you do not agree, please discontinue use of our services.
            </p>
          </Section>

          {/* Use of Service */}
          <Section id="use-of-service" title="3. Use of Service">
            <ul className="space-y-2">
              {[
                "Use the website only for lawful purposes",
                "Do not upload illegal or harmful content",
                "Do not attempt to hack or disrupt our systems",
                "Do not misuse or overload our servers",
                "Respect intellectual property rights",
              ].map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-slate-600">
                  <svg className="w-4 h-4 text-red-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </Section>

          {/* Intellectual Property */}
          <Section id="intellectual-property" title="4. Intellectual Property">
            <p className="text-slate-600 leading-relaxed">
              All content, design, software, and trademarks on this website are owned by{" "}
              <strong className="text-slate-800">tool<span className="text-red-600">ify</span></strong>{" "}
              unless otherwise stated. You may not reproduce or redistribute any materials without permission.
            </p>
          </Section>

          {/* File Processing */}
          <Section id="file-processing" title="5. File Processing">
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 flex items-start gap-3">
              <svg className="w-5 h-5 text-amber-500 mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
              <p className="text-sm text-amber-800 leading-relaxed">
                Our tools process uploaded files automatically. We do not guarantee perfect accuracy, compatibility, or availability. Use the results at your own risk.
              </p>
            </div>
          </Section>

          {/* Disclaimer */}
          <Section id="disclaimer" title="6. Disclaimer">
            <p className="text-slate-600 leading-relaxed">
              All services are provided <strong className="text-slate-800">"as is"</strong> and{" "}
              <strong className="text-slate-800">"as available"</strong> without any warranties, expressed or implied. We do not guarantee uninterrupted or error-free service.
            </p>
          </Section>

          {/* Limitation of Liability */}
          <Section id="liability" title="7. Limitation of Liability">
            <div className="border-l-2 border-red-400 pl-4">
              <p className="text-slate-600 leading-relaxed">
                <strong className="text-slate-800">tool<span className="text-red-600">ify</span></strong> shall not be liable for any direct, indirect, incidental, or consequential damages resulting from the use or inability to use our services.
              </p>
            </div>
          </Section>

          {/* Third-Party Links */}
          <Section id="third-party" title="8. Third-Party Links">
            <p className="text-slate-600 leading-relaxed">
              Our website may contain links to third-party websites. We are not responsible for their content, policies, or practices. We encourage you to review the privacy policies of any third-party sites you visit.
            </p>
          </Section>

          {/* Termination */}
          <Section id="termination" title="9. Termination">
            <p className="text-slate-600 leading-relaxed">
              We reserve the right to restrict or terminate access to our services without prior notice if these Terms are violated.
            </p>
          </Section>

          {/* Changes */}
          <Section id="changes" title="10. Changes to Terms">
            <p className="text-slate-600 leading-relaxed">
              We may update these Terms at any time. Continued use of the website constitutes acceptance of the updated Terms. We recommend reviewing this page periodically.
            </p>
          </Section>

          {/* Governing Law */}
          <Section id="governing-law" title="11. Governing Law">
            <p className="text-slate-600 leading-relaxed">
              These Terms shall be governed and interpreted in accordance with the laws of your country of residence.
            </p>
          </Section>

          {/* Contact */}
          <Section id="contact" title="12. Contact Information">
            <p className="text-slate-600 mb-4">
              For questions regarding these Terms, please contact us:
            </p>
            <a
              href="mailto:mhturknn@gmail.com"
              className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              info@fasttoolify.com
            </a>
          </Section>

          {/* Footer note */}
          <p className="text-xs text-slate-400 text-center pb-4">
            By using Toolify, you agree to these Terms of Service.{" "}
            <Link href="/privacy-and-policy" className="text-red-500 hover:underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div id={id} className="bg-white border border-slate-200 rounded-xl p-6 scroll-mt-6">
      <h2 className="text-lg font-bold text-slate-900 mb-4 pb-3 border-b border-slate-100">
        {title}
      </h2>
      {children}
    </div>
  );
}
