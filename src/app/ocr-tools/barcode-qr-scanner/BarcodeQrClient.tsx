"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import Image from "next/image";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

// ── Types ─────────────────────────────────────────────────────────────────────
type MainTab = "scan-image" | "scan-webcam" | "generate";
type ScanStatus = "idle" | "scanning" | "done" | "error";

interface ScanResult {
  text: string;
  format: string;
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
      setResults([
        {
          text: result.getText(),
          format: result.getBarcodeFormat().toString(),
        },
      ]);
      setScanStatus("done");
      toast.success("Code detected!", {
        description: result.getText().slice(0, 60),
      });
    } catch {
      setError(
        "No barcode or QR code found in this image. Try a clearer, higher-resolution scan.",
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
          Supports QR Code, Code128, EAN-13, EAN-8, UPC-A, UPC-E, DataMatrix,
          PDF417, Aztec, Codabar
        </p>
      </div>
    );
  }

  if (scanStatus === "error") {
    return (
      <div className="space-y-4">
        <div className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4">
          {previewUrl && (
            <Image
              src={previewUrl}
              alt="Scanned"
              width={96}
              height={96}
              className="h-24 w-24 rounded-lg object-cover shrink-0"
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
          <Image
            src={previewUrl}
            alt="Scanned"
            width={112}
            height={112}
            className="h-28 w-28 rounded-lg object-contain bg-slate-50 shrink-0"
          />
        )}
        <div className="flex-1 space-y-3">
          {results.map((r, i) => (
            <div
              key={i}
              className="rounded-lg bg-green-50 border border-green-200 p-3"
            >
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
  const [cameras, setCameras] = useState<{ deviceId: string; label: string }[]>(
    [],
  );
  const [selectedCamera, setSelectedCamera] = useState("");

  useEffect(() => {
    // List cameras on mount
    (async () => {
      try {
        const { BrowserCodeReader } = await import("@zxing/browser");
        const devices = await BrowserCodeReader.listVideoInputDevices();
        const cams = devices.map((d) => ({
          deviceId: d.deviceId,
          label: d.label || `Camera ${d.deviceId.slice(0, 6)}`,
        }));
        setCameras(cams);
        if (cams.length > 0) setSelectedCamera(cams[0].deviceId);
      } catch {
        setError(
          "Could not access camera list. Please allow camera permission.",
        );
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
            setResult({
              text: res.getText(),
              format: res.getBarcodeFormat().toString(),
            });
            controls.stop();
            setScanning(false);
            toast.success("Code detected!");
          }
          // err is thrown when no code found in frame — that's normal, ignore
          void err;
        },
      );
      controlsRef.current = controls;
    } catch (e) {
      console.error(e);
      setError(
        "Camera access denied or not available. Please check browser permissions.",
      );
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
      <div
        className={`relative rounded-xl overflow-hidden bg-slate-900 ${scanning ? "block" : "hidden"}`}
      >
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
          <p className="text-sm text-slate-600">
            Point your camera at a QR code or barcode
          </p>
        </div>
      )}

      {error && (
        <div
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
        >
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
            <a
              href={result.text}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:underline"
            >
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

// ── Main component ────────────────────────────────────────────────────────────
export default function BarcodeQrClient() {
  const [tab, setTab] = useState<MainTab>("scan-image");

  const TABS: { value: MainTab; label: string; icon: string }[] = [
    { value: "scan-image", label: "Scan from Image", icon: "📷" },
    { value: "scan-webcam", label: "Webcam Scanner", icon: "📹" },
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
      </div>
    </div>
  );
}
