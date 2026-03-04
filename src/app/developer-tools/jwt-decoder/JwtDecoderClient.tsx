"use client";

import { useState, useCallback } from "react";
import { toast } from "sonner";
import type { JwtParts } from "@/lib/dev-utils";

const SAMPLE_JWT =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c";

export default function JwtDecoderClient() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<JwtParts | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"header" | "payload" | "signature">("payload");

  const decode = useCallback(async () => {
    const t = token.trim();
    if (!t) { setError("Please enter a JWT token."); return; }
    setError(null);
    try {
      const { decodeJwt } = await import("@/lib/dev-utils");
      setResult(decodeJwt(t));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Invalid JWT token.");
      setResult(null);
    }
  }, [token]);

  const copy = useCallback(async (text: string) => {
    await navigator.clipboard.writeText(text);
    toast.success("Copied!");
  }, []);

  const loadSample = () => {
    setToken(SAMPLE_JWT);
    setResult(null);
    setError(null);
  };

  const formatDate = (d: Date) =>
    d.toLocaleString(undefined, {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit", second: "2-digit",
    });

  const tabContent: Record<string, string> = result
    ? {
        header: JSON.stringify(result.header, null, 2),
        payload: JSON.stringify(result.payload, null, 2),
        signature: result.signature,
      }
    : {};

  return (
    <div className="space-y-5">
      {/* Security notice */}
      <div className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
        <span className="mt-px shrink-0">⚠️</span>
        <span>
          This tool <strong>decodes only</strong> — it does not verify signatures. Never paste
          production tokens into any online tool. Your token never leaves your browser.
        </span>
      </div>

      {/* Token input */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 px-4 py-2.5">
          <span className="text-xs font-semibold text-slate-500">JWT Token</span>
          <button
            type="button"
            onClick={loadSample}
            className="text-xs text-red-600 hover:underline"
          >
            Load sample
          </button>
        </div>
        <textarea
          value={token}
          onChange={(e) => { setToken(e.target.value); setError(null); setResult(null); }}
          className="w-full resize-none p-4 font-mono text-xs text-slate-700 focus:outline-none"
          rows={5}
          placeholder="Paste your JWT token here (eyJ…)"
          spellCheck={false}
        />
      </div>

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="button"
        onClick={decode}
        disabled={!token.trim()}
        className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
      >
        🔑 Decode JWT
      </button>

      {result && (
        <div className="space-y-4">
          {/* Status cards */}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {/* Algorithm */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Algorithm</p>
              <p className="mt-1 font-mono text-lg font-bold text-red-700">
                {(result.header.alg as string) || "—"}
              </p>
              <p className="text-xs text-slate-500">
                Type: {(result.header.typ as string) || "—"}
              </p>
            </div>

            {/* Expiry */}
            <div className={`rounded-xl border p-4 ${
              result.isExpired === null
                ? "border-slate-200 bg-white"
                : result.isExpired
                  ? "border-red-200 bg-red-50"
                  : "border-emerald-200 bg-emerald-50"
            }`}>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Expiry</p>
              {result.expiresAt ? (
                <>
                  <p className={`mt-1 text-sm font-bold ${result.isExpired ? "text-red-700" : "text-emerald-700"}`}>
                    {result.isExpired ? "⚠️ Expired" : "✅ Valid"}
                  </p>
                  <p className="text-xs text-slate-500">{formatDate(result.expiresAt)}</p>
                </>
              ) : (
                <p className="mt-1 text-sm text-slate-500">No expiry (exp)</p>
              )}
            </div>

            {/* Issued At */}
            <div className="rounded-xl border border-slate-200 bg-white p-4">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Issued At</p>
              {result.issuedAt ? (
                <>
                  <p className="mt-1 text-sm font-bold text-slate-700">iat claim</p>
                  <p className="text-xs text-slate-500">{formatDate(result.issuedAt)}</p>
                </>
              ) : (
                <p className="mt-1 text-sm text-slate-500">No issued-at (iat)</p>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <div className="flex border-b border-slate-100">
              {(["header", "payload", "signature"] as const).map((tab) => (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 py-2.5 text-xs font-semibold capitalize transition-colors ${
                    activeTab === tab
                      ? "border-b-2 border-red-600 text-red-700"
                      : "text-slate-500 hover:text-slate-700"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="relative">
              <pre className="overflow-x-auto p-4 font-mono text-xs text-slate-700 bg-slate-50 min-h-32">
                {tabContent[activeTab] || ""}
              </pre>
              <button
                type="button"
                onClick={() => copy(tabContent[activeTab] || "")}
                className="absolute right-3 top-3 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-600 hover:bg-slate-50 shadow-sm"
              >
                Copy
              </button>
            </div>
          </div>

          {/* Claims reference */}
          <details className="rounded-xl border border-slate-200 bg-white overflow-hidden">
            <summary className="cursor-pointer px-4 py-3 text-xs font-semibold text-slate-600 hover:bg-slate-50">
              JWT Standard Claims Reference ▾
            </summary>
            <div className="divide-y divide-slate-100 px-4 pb-2 text-xs">
              {[
                ["iss", "Issuer — who issued the token"],
                ["sub", "Subject — whom the token refers to"],
                ["aud", "Audience — who the token is intended for"],
                ["exp", "Expiration time (Unix timestamp)"],
                ["nbf", "Not before — token not valid before this time"],
                ["iat", "Issued at (Unix timestamp)"],
                ["jti", "JWT ID — unique identifier for this token"],
              ].map(([claim, desc]) => (
                <div key={claim} className="flex gap-3 py-2">
                  <code className="shrink-0 font-mono font-bold text-red-700 w-8">{claim}</code>
                  <span className="text-slate-500">{desc}</span>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
}
