import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import JsonLd from "@/components/seo/JsonLd";
import BackToTop from "@/components/ui/back-to-top";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/metadata";
import {
  buildOrganizationSchema,
  buildSoftwareApplicationSchema,
  buildWebSiteSchema,
} from "@/lib/structured-data";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import Script from "next/script";
import { Toaster } from "sonner";
import "./globals.css";
import GlobalDragOverlay from "@/components/layout/GlobalDragOverlay";

const inter = Poppins({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} – Free Online Tools`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "free online tools",
    "pdf converter",
    "image compressor",
    "file converter",
    "ocr online",
    "word to pdf",
    "merge pdf online",
    "compress pdf free",
    "image resize online",
    "qr code generator",
    "developer tools online",
    "seo tools online",
    "privacy-first online tools",
    "no registration file converter",
    "browser based tools",
  ],
  applicationName: SITE_NAME,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  category: "technology",
  alternates: {
    canonical: SITE_URL,
    languages: {
      "en-US": SITE_URL,
    },
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `Free Online Tools – PDF, Image, SEO, Developer & File Converter | toolify`,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: `toolify – Free Online PDF, Image, SEO & Developer Tools`,
      },
    ],
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@fasttoolify",
    title: `Free Online Tools – PDF, Image, SEO, Developer & File Converter | toolify`,
    description:
      "Free online tools for PDF, image, SEO, and developer utilities. Merge PDFs, generate keywords, format code, decode JWTs — fast, secure, no registration.",
    images: [{ url: "/og-default.png", alt: "toolify – Free Online Tools" }],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  other: {
    "google-adsense-account": "ca-pub-8788445317754676",
    "theme-color": "#dc2626",
    "apple-mobile-web-app-title": SITE_NAME,
    "apple-mobile-web-app-capable": "yes",
    "mobile-web-app-capable": "yes",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-J8V5F2Q4EK"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-J8V5F2Q4EK');
        `}
        </Script>

        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-8788445317754676"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />

        {/* Google Tag Manager */}
        <Script id="gtm-script" strategy="afterInteractive">
          {`
          (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
          new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
          j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
          'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
          })(window,document,'script','dataLayer','GTM-W6LDZ757');
        `}
        </Script>
      </head>
      <body>
        {/* GTM Noscript */}
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-W6LDZ757"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          />
        </noscript>

        <JsonLd data={buildWebSiteSchema()} />
        <JsonLd data={buildOrganizationSchema()} />
        <JsonLd data={buildSoftwareApplicationSchema()} />
        <Analytics />
        <SpeedInsights />
        <Header />
        {children}
        <GlobalDragOverlay />
        <Toaster />
        <BackToTop />
        <Footer />
      </body>
    </html>
  );
}
