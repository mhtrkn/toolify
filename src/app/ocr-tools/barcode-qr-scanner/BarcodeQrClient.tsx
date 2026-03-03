"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { downloadBlob } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// ── Types ─────────────────────────────────────────────────────────────────────
type MainTab = "scan-image" | "scan-webcam" | "generate";
type QrType = "url" | "text" | "wifi" | "vcard" | "email";
type WifiSecurity = "WPA" | "WEP" | "nopass";
type ScanStatus = "idle" | "scanning" | "done" | "error";

interface ScanResult {
  text: string;
  format: string;
}

// ── QR data builders ──────────────────────────────────────────────────────────
function buildQrData(type: QrType, fields: Record<string, string>): string {
  switch (type) {
    case "url":
      return fields.url || "";
    case "text":
      return fields.text || "";
    case "wifi":
      return `WIFI:T:${fields.security || "WPA"};S:${fields.ssid || ""};P:${fields.password || ""};;`;
    case "vcard":
      return [
        "BEGIN:VCARD",
        "VERSION:3.0",
        fields.name ? `FN:${fields.name}` : "",
        fields.org ? `ORG:${fields.org}` : "",
        fields.phone ? `TEL:${fields.phone}` : "",
        fields.email ? `EMAIL:${fields.email}` : "",
        fields.website ? `URL:${fields.website}` : "",
        "END:VCARD",
      ]
        .filter(Boolean)
        .join("\n");
    case "email":
      return `mailto:${fields.email || ""}?subject=${encodeURIComponent(fields.subject || "")}&body=${encodeURIComponent(fields.body || "")}`;
    default:
      return "";
  }
}

// ── Sub-components ────────────────────────────────────────────────────────────

function ScanFromImage() {
  const [scanStatus, setScanStatus] = useState<ScanStatus>("idle");
  const [results, setResults] = useState<ScanResult[]>([]);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanFile = async (file: File) => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    setScanStatus("scanning");
    setError(null);
    setResults([]);

    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      // Try to decode — throws if nothing found
      const result = await reader.decodeFromImageUrl(url);
      setResults([{ text: result.getText(), format: result.getBarcodeFormat().toString() }]);
      setScanStatus("done");
      toast.success("Code detected!", { description: result.getText().slice(0, 60) });
    } catch {
      setError(
        "No barcode or QR code found in this image. Try a clearer, higher-resolution scan."
      );
      setScanStatus("error");
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith("image/")) scanFile(file);
  };

  const reset = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl(null);
    setScanStatus("idle");
    setResults([]);
    setError(null);
  };

  const copyResult = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard");
  };

  if (scanStatus === "idle" || scanStatus === "scanning") {
    return (
      <div className="space-y-5">
        <label
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="flex cursor-pointer flex-col items-center justify-center gap-3 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 p-10 text-center hover:border-red-400 hover:bg-red-50 transition-colors"
        >
          <input
            type="file"
            accept="image/*"
            className="sr-only"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) scanFile(f);
            }}
          />
          <span className="text-4xl">📷</span>
          <div>
            <p className="font-semibold text-slate-700">
              {scanStatus === "scanning" ? "Scanning…" : "Upload image to scan"}
            </p>
            <p className="text-sm text-slate-500 mt-1">
              JPG, PNG, WEBP, BMP — drag & drop or click
            </p>
          </div>
          {scanStatus === "scanning" && (
            <div className="h-1.5 w-48 rounded-full bg-slate-200 overflow-hidden">
              <div className="h-full bg-red-500 animate-pulse w-full" />
            </div>
          )}
        </label>
        <p className="text-xs text-center text-slate-500">
          Supports QR Code, Code128, EAN-13, EAN-8, UPC-A, UPC-E, DataMatrix, PDF417, Aztec, Codabar
        </p>
      </div>
    );
  }

  if (scanStatus === "error") {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4">
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Scanned"
              className="h-24 w-24 rounded-lg object-cover flex-shrink-0"
            />
          )}
          <div
            role="alert"
            className="flex-1 rounded-lg bg-red-50 border border-red-200 p-3 text-sm text-red-700"
          >
            {error}
          </div>
        </div>
        <button
          onClick={reset}
          className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
        >
          Try Another Image
        </button>
      </div>
    );
  }

  // Done
  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-start rounded-xl border border-slate-200 bg-white p-4">
        {previewUrl && (
          <img
            src={previewUrl}
            alt="Scanned"
            className="h-28 w-28 rounded-lg object-contain bg-slate-50 flex-shrink-0"
          />
        )}
        <div className="flex-1 space-y-3">
          {results.map((r, i) => (
            <div key={i} className="rounded-lg bg-green-50 border border-green-200 p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                  {r.format.replace(/_/g, " ")}
                </span>
                <button
                  onClick={() => copyResult(r.text)}
                  className="text-xs text-green-600 hover:text-green-800 font-medium"
                >
                  Copy
                </button>
              </div>
              <p className="text-sm text-slate-800 break-all">{r.text}</p>
              {r.text.startsWith("http") && (
                <a
                  href={r.text}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-1 inline-block text-xs text-blue-600 hover:underline"
                >
                  Open link →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
      <button
        onClick={reset}
        className="rounded-xl border border-slate-200 px-5 py-2.5 text-sm text-slate-600 hover:bg-slate-50"
      >
        Scan Another
      </button>
    </div>
  );
}

// ── Webcam scanner ────────────────────────────────────────────────────────────
function ScanFromWebcam() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const controlsRef = useRef<{ stop: () => void } | null>(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState<ScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [cameras, setCameras] = useState<{ deviceId: string; label: string }[]>([]);
  const [selectedCamera, setSelectedCamera] = useState("");

  useEffect(() => {
    // List cameras on mount
    (async () => {
      try {
        const { BrowserCodeReader } = await import("@zxing/browser");
        const devices = await BrowserCodeReader.listVideoInputDevices();
        const cams = devices.map((d) => ({ deviceId: d.deviceId, label: d.label || `Camera ${d.deviceId.slice(0, 6)}` }));
        setCameras(cams);
        if (cams.length > 0) setSelectedCamera(cams[0].deviceId);
      } catch {
        setError("Could not access camera list. Please allow camera permission.");
      }
    })();

    return () => {
      controlsRef.current?.stop();
    };
  }, []);

  const startScan = useCallback(async () => {
    setResult(null);
    setError(null);
    setScanning(true);

    try {
      const { BrowserMultiFormatReader } = await import("@zxing/browser");
      const reader = new BrowserMultiFormatReader();
      const controls = await reader.decodeFromVideoDevice(
        selectedCamera || undefined,
        videoRef.current!,
        (res, err) => {
          if (res) {
            setResult({ text: res.getText(), format: res.getBarcodeFormat().toString() });
            controls.stop();
            setScanning(false);
            toast.success("Code detected!");
          }
          // err is thrown when no code found in frame — that's normal, ignore
          void err;
        }
      );
      controlsRef.current = controls;
    } catch (e) {
      console.error(e);
      setError("Camera access denied or not available. Please check browser permissions.");
      setScanning(false);
    }
  }, [selectedCamera]);

  const stopScan = () => {
    controlsRef.current?.stop();
    setScanning(false);
  };

  return (
    <div className="space-y-4">
      {cameras.length > 1 && (
        <Select value={selectedCamera} onValueChange={setSelectedCamera}>
          <SelectTrigger className="py-2.5">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {cameras.map((c) => (
              <SelectItem key={c.deviceId} value={c.deviceId}>
                {c.label || c.deviceId}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}

      {/* Video element always mounted but hidden when not scanning */}
      <div className={`relative rounded-xl overflow-hidden bg-slate-900 ${scanning ? "block" : "hidden"}`}>
        <video
          ref={videoRef}
          className="w-full aspect-video object-cover"
          autoPlay
          muted
          playsInline
        />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="w-48 h-48 border-2 border-red-500 rounded-lg opacity-60" />
        </div>
      </div>

      {!scanning && !result && (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 py-10 gap-3">
          <span className="text-4xl">📹</span>
          <p className="text-sm text-slate-600">Point your camera at a QR code or barcode</p>
        </div>
      )}

      {error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {result && !scanning && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-4 space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-green-700 uppercase tracking-wide">
              {result.format.replace(/_/g, " ")}
            </span>
            <button
              onClick={() => {
                navigator.clipboard.writeText(result.text);
                toast.success("Copied!");
              }}
              className="text-xs font-medium text-green-600 hover:text-green-800"
            >
              Copy
            </button>
          </div>
          <p className="text-sm text-slate-800 break-all">{result.text}</p>
          {result.text.startsWith("http") && (
            <a href={result.text} target="_blank" rel="noopener noreferrer" className="text-xs text-blue-600 hover:underline">
              Open link →
            </a>
          )}
        </div>
      )}

      <div className="flex gap-3">
        {!scanning ? (
          <button
            onClick={startScan}
            className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            {result ? "Scan Again" : "Start Camera Scan"}
          </button>
        ) : (
          <button
            onClick={stopScan}
            className="flex-1 rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-600 hover:bg-slate-50"
          >
            Stop
          </button>
        )}
      </div>
    </div>
  );
}

// ── QR Generator ──────────────────────────────────────────────────────────────
function QrGenerator() {
  const [qrType, setQrType] = useState<QrType>("url");
  const [fields, setFields] = useState<Record<string, string>>({
    url: "https://",
    text: "",
    ssid: "",
    password: "",
    security: "WPA",
    name: "",
    org: "",
    phone: "",
    email: "",
    website: "",
    subject: "",
    body: "",
  });
  const [qrDataUrl, setQrDataUrl] = useState<string | null>(null);
  const [fgColor, setFgColor] = useState("#000000");
  const [bgColor, setBgColor] = useState("#ffffff");
  const [size, setSize] = useState(300);
  const [ecLevel, setEcLevel] = useState<"L" | "M" | "Q" | "H">("M");
  const [generating, setGenerating] = useState(false);

  const set = (key: string, val: string) =>
    setFields((prev) => ({ ...prev, [key]: val }));

  const generate = async () => {
    const data = buildQrData(qrType, fields);
    if (!data.trim()) {
      toast.error("Please fill in the required fields");
      return;
    }
    setGenerating(true);
    try {
      const QRCode = await import("qrcode");
      const dataUrl = await QRCode.toDataURL(data, {
        width: size,
        margin: 2,
        color: { dark: fgColor, light: bgColor },
        errorCorrectionLevel: ecLevel,
      });
      setQrDataUrl(dataUrl);
    } catch (e) {
      console.error(e);
      toast.error("Failed to generate QR code");
    } finally {
      setGenerating(false);
    }
  };

  const downloadQr = () => {
    if (!qrDataUrl) return;
    fetch(qrDataUrl)
      .then((r) => r.blob())
      .then((blob) => downloadBlob(blob, `qr-${qrType}-${Date.now()}.png`));
    toast.success("QR code downloaded");
  };

  const QR_TYPES: { value: QrType; label: string; icon: string }[] = [
    { value: "url", label: "URL", icon: "🔗" },
    { value: "text", label: "Text", icon: "📝" },
    { value: "wifi", label: "WiFi", icon: "📶" },
    { value: "vcard", label: "vCard", icon: "👤" },
    { value: "email", label: "Email", icon: "✉️" },
  ];

  return (
    <div className="grid gap-6 md:grid-cols-2">
      {/* Left: Config */}
      <div className="space-y-5">
        {/* Type tabs */}
        <div>
          <p className="text-sm font-semibold text-slate-700 mb-2">QR Type</p>
          <div className="flex flex-wrap gap-2">
            {QR_TYPES.map((t) => (
              <button
                key={t.value}
                onClick={() => { setQrType(t.value); setQrDataUrl(null); }}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
                  qrType === t.value
                    ? "bg-red-600 text-white"
                    : "border border-slate-200 text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t.icon} {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic fields */}
        <div className="space-y-3">
          {qrType === "url" && (
            <Field label="URL" placeholder="https://example.com" value={fields.url} onChange={(v) => set("url", v)} />
          )}
          {qrType === "text" && (
            <Field label="Text" placeholder="Enter any text…" value={fields.text} onChange={(v) => set("text", v)} multiline />
          )}
          {qrType === "wifi" && (
            <>
              <Field label="Network Name (SSID)" placeholder="MyWiFi" value={fields.ssid} onChange={(v) => set("ssid", v)} />
              <Field label="Password" placeholder="••••••••" value={fields.password} onChange={(v) => set("password", v)} type="password" />
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">Security</label>
                <Select value={fields.security} onValueChange={(v) => set("security", v)}>
                  <SelectTrigger className="py-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {(["WPA", "WEP", "nopass"] as WifiSecurity[]).map((s) => (
                      <SelectItem key={s} value={s}>{s === "nopass" ? "None (open)" : s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
          {qrType === "vcard" && (
            <>
              <Field label="Full Name" placeholder="Jane Smith" value={fields.name} onChange={(v) => set("name", v)} />
              <Field label="Organization" placeholder="Acme Corp" value={fields.org} onChange={(v) => set("org", v)} />
              <Field label="Phone" placeholder="+1 555 000 0000" value={fields.phone} onChange={(v) => set("phone", v)} />
              <Field label="Email" placeholder="jane@example.com" value={fields.email} onChange={(v) => set("email", v)} type="email" />
              <Field label="Website" placeholder="https://example.com" value={fields.website} onChange={(v) => set("website", v)} />
            </>
          )}
          {qrType === "email" && (
            <>
              <Field label="Email Address" placeholder="contact@example.com" value={fields.email} onChange={(v) => set("email", v)} type="email" />
              <Field label="Subject" placeholder="Hello!" value={fields.subject} onChange={(v) => set("subject", v)} />
              <Field label="Body" placeholder="Your message…" value={fields.body} onChange={(v) => set("body", v)} multiline />
            </>
          )}
        </div>

        {/* Customization */}
        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-3">
          <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">Customization</p>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Foreground</label>
              <div className="flex items-center gap-2">
                <input type="color" value={fgColor} onChange={(e) => setFgColor(e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-slate-300 p-0.5" />
                <span className="text-xs text-slate-500 font-mono">{fgColor}</span>
              </div>
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Background</label>
              <div className="flex items-center gap-2">
                <input type="color" value={bgColor} onChange={(e) => setBgColor(e.target.value)} className="h-8 w-10 cursor-pointer rounded border border-slate-300 p-0.5" />
                <span className="text-xs text-slate-500 font-mono">{bgColor}</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-slate-600 mb-1">Size: {size}px</label>
              <input type="range" min={100} max={1000} step={50} value={size} onChange={(e) => setSize(+e.target.value)} className="w-full accent-red-600" />
            </div>
            <div>
              <label className="block text-xs text-slate-600 mb-1">Error Correction</label>
              <Select value={ecLevel} onValueChange={(v) => setEcLevel(v as "L" | "M" | "Q" | "H")}>
                <SelectTrigger className="py-1.5 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="L">L — Low (7%)</SelectItem>
                  <SelectItem value="M">M — Medium (15%)</SelectItem>
                  <SelectItem value="Q">Q — Quartile (25%)</SelectItem>
                  <SelectItem value="H">H — High (30%)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        <button
          onClick={generate}
          disabled={generating}
          className="w-full rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
        >
          {generating ? "Generating…" : "Generate QR Code"}
        </button>
      </div>

      {/* Right: Preview */}
      <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 gap-4">
        {qrDataUrl ? (
          <>
            <img src={qrDataUrl} alt="Generated QR Code" className="rounded-xl shadow-md max-w-full" style={{ width: Math.min(size, 280), height: Math.min(size, 280) }} />
            <button
              onClick={downloadQr}
              className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
            >
              Download PNG
            </button>
          </>
        ) : (
          <>
            <span className="text-5xl opacity-20">⬛</span>
            <p className="text-sm text-slate-400">QR code preview appears here</p>
          </>
        )}
      </div>
    </div>
  );
}

// ── Reusable field component ──────────────────────────────────────────────────
function Field({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  multiline = false,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <div>
      <label className="block text-xs font-semibold text-slate-600 mb-1">{label}</label>
      {multiline ? (
        <textarea
          rows={3}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-red-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none"
        />
      ) : (
        <Input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="focus:border-red-500 focus:ring-red-500"
        />
      )}
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BarcodeQrClient() {
  const [tab, setTab] = useState<MainTab>("scan-image");

  const TABS: { value: MainTab; label: string; icon: string }[] = [
    { value: "scan-image", label: "Scan from Image", icon: "📷" },
    { value: "scan-webcam", label: "Webcam Scanner", icon: "📹" },
    { value: "generate", label: "Generate QR", icon: "⬛" },
  ];

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex flex-wrap gap-2 rounded-xl border border-slate-200 bg-slate-50 p-1">
        {TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={`flex-1 min-w-fit rounded-lg px-4 py-2.5 text-sm font-medium transition-colors ${
              tab === t.value
                ? "bg-white text-slate-900 shadow-sm"
                : "text-slate-500 hover:text-slate-700"
            }`}
          >
            <span className="mr-1.5">{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* Panel */}
      <div className="rounded-xl border border-slate-200 bg-white p-6">
        {tab === "scan-image" && <ScanFromImage />}
        {tab === "scan-webcam" && <ScanFromWebcam />}
        {tab === "generate" && <QrGenerator />}
      </div>
    </div>
  );
}
