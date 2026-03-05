"use client";

import { useState } from "react";
import { toast } from "sonner";
import Button from "@/components/ui/button";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import LottieLoader from "@/components/tools/LottieLoader";
import { formatBytes, cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";

type Status = "idle" | "ready" | "processing" | "done" | "error";

export default function ProtectPdfClient() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<Status>("idle");
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setStatus("ready");
    setError(null);
    setResultUrl(null);
    toast.success("File Selected", { description: `${files[0].name} is ready to protect.` });
  };

  const protect = async () => {
    if (!file) return;
    if (password.length < 4) { setError("Password must be at least 4 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }

    setStatus("processing");
    setProgress(10);
    setError(null);
    try {
      const pdfjsLib = await import("pdfjs-dist");
      pdfjsLib.GlobalWorkerOptions.workerSrc = "/pdf.worker.min.mjs";
      setProgress(15);
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: new Uint8Array(arrayBuffer) }).promise;
      const total = pdf.numPages;
      setProgress(20);
      const firstPage = await pdf.getPage(1);
      const vp0 = firstPage.getViewport({ scale: 1.5 });
      const { jsPDF } = await import("jspdf");
      const orientation = vp0.width > vp0.height ? "landscape" : "portrait";
      const jspdf = new jsPDF({
        orientation,
        unit: "px",
        format: [vp0.width, vp0.height],
        compress: true,
        encryption: {
          userPassword: password,
          ownerPassword: password + "__owner__",
          userPermissions: ["print"],
        },
      });
      setProgress(25);
      for (let i = 1; i <= total; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 1.5 });
        const canvas = document.createElement("canvas");
        canvas.width = viewport.width;
        canvas.height = viewport.height;
        const ctx = canvas.getContext("2d")!;
        await page.render({ canvasContext: ctx, viewport, canvas }).promise;
        const imgData = canvas.toDataURL("image/jpeg", 0.85);
        if (i > 1) {
          jspdf.addPage([viewport.width, viewport.height], viewport.width > viewport.height ? "landscape" : "portrait");
        }
        jspdf.addImage(imgData, "JPEG", 0, 0, viewport.width, viewport.height);
        setProgress(25 + Math.round((i / total) * 65));
      }
      setProgress(92);
      const pdfBlob = jspdf.output("blob");
      setResultUrl(URL.createObjectURL(pdfBlob));
      setProgress(100);
      setStatus("done");
      toast.success("PDF Protected!", {
        description: "Your PDF is now password-protected and ready to download.",
      });
    } catch (e) {
      console.error(e);
      const msg = "Could not protect this PDF. The file may be corrupted or already encrypted.";
      setError(msg);
      toast.error("Protection Failed", { description: msg });
      setStatus("error");
    }
  };

  const download = () => {
    if (!resultUrl || !file) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = file.name.replace(".pdf", "-protected.pdf");
    a.click();
    toast.success("Download Started", { description: "Your password-protected PDF is being downloaded." });
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setPassword("");
    setConfirmPassword("");
    setStatus("idle");
    setProgress(0);
    setError(null);
    setResultUrl(null);
  };

  const passwordsMatch = confirmPassword.length > 0 && password === confirmPassword;
  const passwordMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  return (
    <div className="space-y-6">
      {status === "idle" && (
        <FileUploader accept=".pdf" maxSizeMB={100} onFiles={handleFiles} label="Upload PDF to Protect" hint="Supports PDF up to 100MB" />
      )}
      {status === "ready" && file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-3xl">📄</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError(null); }}
                  placeholder="Enter password"
                  className="pr-16 focus:ring-red-400"
                  autoComplete="new-password"
                />
                <button type="button" onClick={() => setShowPassword((v) => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600">
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {password.length > 0 && password.length < 4 && <p className="mt-1 text-xs text-amber-600">Minimum 4 characters</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Confirm Password</label>
              <Input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => { setConfirmPassword(e.target.value); setError(null); }}
                placeholder="Re-enter password"
                className={cn(
                  "focus:ring-1",
                  passwordMismatch
                    ? "border-red-400 focus:border-red-400 focus:ring-red-400"
                    : passwordsMatch
                    ? "border-green-400 focus:border-green-400 focus:ring-green-400"
                    : "focus:border-red-400 focus:ring-red-400"
                )}
                autoComplete="new-password"
              />
              {passwordMismatch && <p className="mt-1 text-xs text-red-600">Passwords do not match</p>}
              {passwordsMatch && <p className="mt-1 text-xs text-green-600">Passwords match</p>}
            </div>
          </div>
          <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-xs text-slate-600 space-y-1">
            <p><strong>Note:</strong> Pages are re-rendered as images to apply encryption. Viewers can open and print with the password.</p>
            <p className="text-slate-400">Remember your password — there is no recovery option.</p>
          </div>
          {error && <div role="alert" className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
          <div className="flex gap-3">
            <Button onClick={protect} variant="primary" size="lg" className="flex-1" disabled={!password || !confirmPassword}>Protect PDF</Button>
            <Button onClick={reset} variant="secondary" size="lg" className="px-4">Change File</Button>
          </div>
        </div>
      )}
      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <LottieLoader message="Encrypting PDF…" />
          <div className="mt-4"><ProgressBar progress={progress} label="Processing" /></div>
          <p className="mt-3 text-center text-xs text-slate-400">Rendering pages and applying password protection…</p>
        </div>
      )}
      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
      )}
      {status === "done" && resultUrl && file && (
        <div className="rounded-xl border border-green-200 bg-green-50 p-6 text-center space-y-4">
          <div className="flex justify-center">
            <span className="flex h-14 w-14 items-center justify-center rounded-full bg-green-100 text-2xl">🔒</span>
          </div>
          <div>
            <p className="font-semibold text-green-900">PDF Protected!</p>
            <p className="text-sm text-green-700 mt-1">Your PDF is now password-protected. Keep your password safe.</p>
          </div>
          <div className="flex gap-3 justify-center">
            <Button onClick={download} variant="primary" size="lg">Download Protected PDF</Button>
            <Button onClick={reset} variant="secondary" size="lg">Protect Another</Button>
          </div>
        </div>
      )}
    </div>
  );
}
