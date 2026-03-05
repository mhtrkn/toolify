"use client";

import { useState, useEffect, useRef } from "react";
import Button from "@/components/ui/button";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

type QrType = "url" | "wifi" | "vcard";
type WifiSecurity = "WPA" | "WEP" | "nopass";

interface WifiData {
  ssid: string;
  password: string;
  security: WifiSecurity;
  hidden: boolean;
}

interface VCardData {
  name: string;
  phone: string;
  email: string;
  organization: string;
  url: string;
}

function buildQrContent(type: QrType, url: string, wifi: WifiData, vcard: VCardData): string {
  if (type === "url") return url.trim();
  if (type === "wifi") {
    const { ssid, password, security, hidden } = wifi;
    return `WIFI:T:${security};S:${ssid};P:${password};H:${hidden ? "true" : "false"};;`;
  }
  // vCard
  return [
    "BEGIN:VCARD",
    "VERSION:3.0",
    vcard.name ? `FN:${vcard.name}` : "",
    vcard.phone ? `TEL:${vcard.phone}` : "",
    vcard.email ? `EMAIL:${vcard.email}` : "",
    vcard.organization ? `ORG:${vcard.organization}` : "",
    vcard.url ? `URL:${vcard.url}` : "",
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");
}

export default function QrCodeGeneratorClient() {
  const [qrType, setQrType] = useState<QrType>("url");
  const [url, setUrl] = useState("https://fasttoolify.com");
  const [wifi, setWifi] = useState<WifiData>({
    ssid: "",
    password: "",
    security: "WPA",
    hidden: false,
  });
  const [vcard, setVCard] = useState<VCardData>({
    name: "",
    phone: "",
    email: "",
    organization: "",
    url: "",
  });
  const [size, setSize] = useState(256);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const generateQr = async () => {
    setError(null);
    const content = buildQrContent(qrType, url, wifi, vcard);
    if (!content.trim()) {
      setError("Please enter content to encode in the QR code.");
      return;
    }
    try {
      const QRCode = await import("qrcode");
      const dataUrl = await QRCode.toDataURL(content, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: "M",
      });
      setQrDataUrl(dataUrl);
    } catch (e) {
      console.error(e);
      setError("Failed to generate QR code. Please check your input.");
    }
  };

  useEffect(() => {
    generateQr();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qrType, url, wifi, vcard, size, fgColor, bgColor]);

  const download = () => {
    if (!qrDataUrl) return;
    const a = document.createElement("a");
    a.href = qrDataUrl;
    a.download = "qrcode.png";
    a.click();
    toast.success("QR code downloaded!");
  };

  const copy = async () => {
    if (!qrDataUrl) return;
    try {
      const blob = await (await fetch(qrDataUrl)).blob();
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob })]);
      toast.success("QR code copied to clipboard!");
    } catch {
      toast.error("Copy not supported in this browser.");
    }
  };

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Controls */}
      <div className="space-y-5">
        {/* Type selector */}
        <div className="rounded-xl border border-slate-200 bg-white p-5">
          <p className="mb-3 text-sm font-semibold text-slate-700">QR Code Type</p>
          <div className="flex gap-2">
            {(["url", "wifi", "vcard"] as QrType[]).map((t) => (
              <button
                key={t}
                onClick={() => setQrType(t)}
                className={`flex-1 rounded-lg border py-2 text-sm font-medium transition-colors ${
                  qrType === t
                    ? "border-red-500 bg-red-50 text-red-700"
                    : "border-slate-200 text-slate-600 hover:border-slate-300"
                }`}
              >
                {t === "url" ? "🔗 URL" : t === "wifi" ? "📶 WiFi" : "👤 vCard"}
              </button>
            ))}
          </div>
        </div>

        {/* Content fields */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <p className="text-sm font-semibold text-slate-700">Content</p>

          {qrType === "url" && (
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">URL / Link</label>
              <Input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
              />
            </div>
          )}

          {qrType === "wifi" && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Network Name (SSID)</label>
                <Input
                  type="text"
                  value={wifi.ssid}
                  onChange={(e) => setWifi((p) => ({ ...p, ssid: e.target.value }))}
                  placeholder="MyNetwork"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Password</label>
                <Input
                  type="text"
                  value={wifi.password}
                  onChange={(e) => setWifi((p) => ({ ...p, password: e.target.value }))}
                  placeholder="••••••••"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Security</label>
                <Select
                  value={wifi.security}
                  onValueChange={(v) => setWifi((p) => ({ ...p, security: v as WifiSecurity }))}
                >
                  <SelectTrigger className="py-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">No password</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600">
                <Checkbox
                  checked={wifi.hidden}
                  onCheckedChange={(c) => setWifi((p) => ({ ...p, hidden: c as boolean }))}
                />
                Hidden network
              </label>
            </>
          )}

          {qrType === "vcard" && (
            <>
              {[
                { key: "name", label: "Full Name", placeholder: "Jane Doe" },
                { key: "phone", label: "Phone", placeholder: "+1 555 123 4567" },
                { key: "email", label: "Email", placeholder: "jane@example.com" },
                { key: "organization", label: "Organization", placeholder: "Acme Corp" },
                { key: "url", label: "Website", placeholder: "https://example.com" },
              ].map(({ key, label, placeholder }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-slate-500 mb-1">{label}</label>
                  <Input
                    type="text"
                    value={vcard[key as keyof VCardData]}
                    onChange={(e) => setVCard((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                  />
                </div>
              ))}
            </>
          )}
        </div>

        {/* Customization */}
        <div className="rounded-xl border border-slate-200 bg-white p-5 space-y-4">
          <p className="text-sm font-semibold text-slate-700">Customize</p>
          <div>
            <label className="block text-xs font-medium text-slate-500 mb-1">
              Size: {size}×{size}px
            </label>
            <input
              type="range"
              min={128}
              max={512}
              step={32}
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="w-full accent-red-600"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">QR Color</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={fgColor}
                  onChange={(e) => setFgColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border border-slate-300"
                />
                <span className="text-sm font-mono text-slate-600">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-500 mb-1">Background</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="h-9 w-9 cursor-pointer rounded border border-slate-300"
                />
                <span className="text-sm font-mono text-slate-600">{bgColor}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-slate-200 bg-white p-6 flex flex-col items-center gap-4">
          <p className="text-sm font-semibold text-slate-700 self-start">Preview</p>
          {error && (
            <p role="alert" className="text-sm text-red-600">{error}</p>
          )}
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt="QR Code"
              className="rounded-lg"
              style={{ width: Math.min(size, 280), height: Math.min(size, 280) }}
            />
          ) : (
            <div className="flex h-52 w-52 items-center justify-center rounded-lg border-2 border-dashed border-slate-200 text-slate-400 text-sm">
              QR code preview
            </div>
          )}
          <canvas ref={canvasRef} className="hidden" />
        </div>

        {qrDataUrl && (
          <div className="flex gap-3">
            <Button onClick={download} variant="primary" size="lg" className="flex-1">Download PNG</Button>
            <Button onClick={copy} variant="secondary" size="lg" className="flex-1">Copy Image</Button>
          </div>
        )}
      </div>
    </div>
  );
}
