import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";
import JwtDecoderClient from "./JwtDecoderClient";

export const metadata: Metadata = buildToolMetadata({
  toolName: "JWT Decoder",
  toolDescription:
    "Decode JSON Web Tokens (JWT) online — view header, payload, and claims. Check expiry and issued-at dates. 100% browser-based, token never sent to a server.",
  categorySlug: "developer-tools",
  toolSlug: "jwt-decoder",
  keywords: [
    "jwt decoder online free",
    "json web token decoder",
    "jwt inspector browser",
    "decode jwt token online",
    "jwt claims viewer",
    "jwt header payload decoder",
    "jwt expiry checker",
    "json web token analyzer",
    "jwt debugger free",
    "decode bearer token online",
  ],
});

const FAQS = [
  {
    question: "Does this tool verify the JWT signature?",
    answer:
      "No. This tool only decodes the base64url-encoded header and payload. Signature verification requires the secret/private key and is intentionally not supported for security reasons.",
  },
  {
    question: "Is my JWT token sent to a server?",
    answer:
      "No. Decoding uses base64 string operations in your browser. Your token never leaves your device.",
  },
  {
    question: "What claims are shown?",
    answer:
      "All claims in the payload are displayed. Standard claims like exp (expiration), iat (issued at), sub (subject), and iss (issuer) are also interpreted and shown with human-readable dates.",
  },
  {
    question: "How do I know if a token is expired?",
    answer:
      "If the token contains an exp claim, the decoder automatically compares it to the current time and displays 'Expired' or 'Valid' with a color indicator.",
  },
  {
    question: "What JWT algorithms are supported for decoding?",
    answer:
      "Decoding works for any JWT regardless of algorithm (HS256, RS256, ES256, etc.) since it only reads the base64url-encoded parts.",
  },
];

export default function JwtDecoderPage() {
  return (
    <>
      <JsonLd
        data={buildWebAppSchema({
          name: "JWT Decoder",
          description:
            "Free online JWT decoder — inspect header, payload, and claims with expiry status display.",
          slug: "jwt-decoder",
          categorySlug: "developer-tools",
        })}
      />
      <JsonLd
        data={buildBreadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Tools", url: `${SITE_URL}/tools` },
          { name: "Developer Tools", url: `${SITE_URL}/tools/developer-tools` },
          { name: "JWT Decoder", url: `${SITE_URL}/tools/developer-tools/jwt-decoder` },
        ])}
      />
      <JsonLd data={buildFaqSchema(FAQS)} />

      <ToolPageLayout
        breadcrumbs={[
          { label: "Tools", href: "/tools" },
          { label: "Developer Tools", href: "/tools/developer-tools" },
          { label: "JWT Decoder" },
        ]}
        title="JWT Decoder – Free Online JSON Web Token Inspector"
        description="Paste a JWT to instantly see its header, payload, and all claims. Expiry and issued-at dates are displayed in human-readable format. No server, no logs."
        howToSteps={[
          {
            title: "Paste your JWT",
            description: "Paste the JWT token (starting with eyJ…) into the input field, or load the sample token.",
          },
          {
            title: "Click Decode JWT",
            description: "The header and payload are decoded instantly and displayed in formatted JSON.",
          },
          {
            title: "Review claims",
            description: "Switch between Header, Payload, and Signature tabs. Expiry status is shown at a glance.",
          },
        ]}
        benefits={[
          {
            title: "Expiry status display",
            description: "Automatically detects the exp claim and shows whether the token is valid or expired.",
          },
          {
            title: "Tabbed view",
            description: "Switch cleanly between Header, Payload, and Signature with one click.",
          },
          {
            title: "Claims reference",
            description: "Built-in guide to standard JWT claims (iss, sub, aud, exp, nbf, iat, jti).",
          },
          {
            title: "100% private",
            description: "Your token never leaves your browser — no network requests, no server.",
          },
        ]}
        faqs={FAQS}
      >
        <JwtDecoderClient />
      </ToolPageLayout>
    </>
  );
}
