/* eslint-disable react/no-unescaped-entities */
import { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Toolify",
  description:
    "Read our Privacy Policy to learn how we collect, use, and protect your data.",
  robots: "index, follow",
};

const sections = [
  { id: "introduction", label: "Introduction" },
  { id: "information", label: "Information We Collect" },
  { id: "usage", label: "How We Use Your Information" },
  { id: "advertising", label: "Google AdSense & Advertising" },
  { id: "file-privacy", label: "File Privacy" },
  { id: "data-protection", label: "Data Protection" },
  { id: "children", label: "Children's Information" },
  { id: "changes", label: "Changes to This Policy" },
  { id: "contact", label: "Contact Us" },
];

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Hero */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-12 sm:py-16">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-red-50">
              <svg className="w-5 h-5 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
              </svg>
            </div>
            <span className="text-sm font-medium text-red-600 uppercase tracking-wide">Legal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mb-3">
            Privacy Policy
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
          <Section id="introduction" title="1. Introduction" icon="info">
            <p className="text-slate-600 leading-relaxed">
              Welcome to <strong className="text-slate-800">tool<span className="text-red-600">ify</span></strong> ("we", "our", "us"). This Privacy Policy explains how we collect, use, and protect your information when you use our website.
            </p>
          </Section>

          {/* Information We Collect */}
          <Section id="information" title="2. Information We Collect" icon="database">
            <div className="space-y-4">
              <InfoBlock label="Personal Information">
                We do not require account registration and do not directly collect personal information such as name, address, or phone number.
              </InfoBlock>
              <InfoBlock label="Log Files">
                We may collect standard log data including IP address, browser type, device information, pages visited, and timestamps for analytics and security purposes.
              </InfoBlock>
              <InfoBlock label="Cookies">
                We use cookies to improve user experience, analyze traffic, and display relevant advertisements. You can disable cookies through your browser settings.
              </InfoBlock>
            </div>
          </Section>

          {/* How We Use */}
          <Section id="usage" title="3. How We Use Your Information" icon="chart">
            <ul className="space-y-2">
              {[
                "Operate and maintain our services",
                "Improve performance and features",
                "Analyze usage patterns",
                "Prevent abuse and fraud",
                "Display personalized advertisements",
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

          {/* Advertising */}
          <Section id="advertising" title="4. Google AdSense & Advertising Partners" icon="ad">
            <div className="space-y-3 text-slate-600 leading-relaxed">
              <p>
                We use Google AdSense to display advertisements. Google may use cookies (including DART cookies) to serve ads based on your visits to this and other websites.
              </p>
              <p>
                You may opt out of personalized advertising by visiting{" "}
                <Link
                  href="https://adssettings.google.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-red-600 hover:underline font-medium"
                >
                  adssettings.google.com
                </Link>.
              </p>
              <p>We have no control over cookies used by third-party advertisers.</p>
            </div>
          </Section>

          {/* File Privacy */}
          <Section id="file-privacy" title="5. File Privacy" icon="file">
            <div className="grid sm:grid-cols-2 gap-3">
              {[
                { icon: "bolt", text: "Files are processed automatically" },
                { icon: "eye-off", text: "Files are not reviewed manually" },
                { icon: "trash", text: "Files are deleted after processing" },
                { icon: "lock", text: "Files are not stored permanently" },
              ].map(({ text }) => (
                <div key={text} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                  <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span className="text-sm text-slate-700">{text}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Data Protection */}
          <Section id="data-protection" title="6. Data Protection" icon="shield">
            <p className="text-slate-600 leading-relaxed">
              We implement reasonable security measures to protect user data. However, no online platform is completely secure. We encourage you to use our services responsibly.
            </p>
          </Section>

          {/* Children */}
          <Section id="children" title="7. Children's Information" icon="user">
            <p className="text-slate-600 leading-relaxed">
              Our services are not intended for children under the age of <strong className="text-slate-800">13</strong>. We do not knowingly collect personal data from children. If you believe a child has provided us with personal information, please contact us immediately.
            </p>
          </Section>

          {/* Changes */}
          <Section id="changes" title="8. Changes to This Policy" icon="refresh">
            <p className="text-slate-600 leading-relaxed">
              We may update this Privacy Policy at any time. Any changes will be posted on this page with an updated date. We recommend reviewing this page periodically.
            </p>
          </Section>

          {/* Contact */}
          <Section id="contact" title="9. Contact Us" icon="mail">
            <p className="text-slate-600 mb-4">
              If you have questions about this Privacy Policy, feel free to reach out:
            </p>
            <a
              href="mailto:support@toolify.app"
              className="inline-flex items-center gap-2.5 bg-red-600 hover:bg-red-700 text-white font-medium text-sm px-5 py-2.5 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
              </svg>
              support@toolify.app
            </a>
          </Section>

          <p className="text-xs text-slate-400 text-center pb-4">
            By using toolify, you agree to these Privacy Policy.{" "}
            <Link href="/terms" className="text-red-500 hover:underline">
              Terms of Service
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
  icon: string;
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

function InfoBlock({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border-l-2 border-red-400 pl-4">
      <p className="text-sm font-semibold text-slate-800 mb-1">{label}</p>
      <p className="text-sm text-slate-600 leading-relaxed">{children}</p>
    </div>
  );
}
