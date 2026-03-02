"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import { formatBytes, downloadBlob } from "@/lib/utils";

type Tab = "resize" | "crop" | "rotate" | "flip";
type OutputFormat = "jpg" | "png" | "webp";

const TAB_INFO: { key: Tab; label: string; icon: string }[] = [
  { key: "resize", label: "Resize", icon: "↔️" },
  { key: "crop",   label: "Crop",   icon: "✂️" },
  { key: "rotate", label: "Rotate", icon: "🔄" },
  { key: "flip",   label: "Flip",   icon: "🪞" },
];

const ASPECT_PRESETS = [
  { label: "Free",  ratio: null },
  { label: "1:1",   ratio: 1 },
  { label: "16:9",  ratio: 16 / 9 },
  { label: "4:3",   ratio: 4 / 3 },
  { label: "3:2",   ratio: 3 / 2 },
  { label: "9:16",  ratio: 9 / 16 },
];

const SOCIAL_PRESETS = [
  { label: "Instagram Square", w: 1080, h: 1080 },
  { label: "Instagram Story",  w: 1080, h: 1920 },
  { label: "Twitter/X Banner", w: 1500, h: 500  },
  { label: "YouTube Thumb",    w: 1280, h: 720  },
  { label: "Facebook Cover",   w: 820,  h: 312  },
  { label: "LinkedIn Banner",  w: 1584, h: 396  },
];

interface CropBox { x: number; y: number; w: number; h: number }

/* ─── helpers ──────────────────────────────────────────────── */

function imageToCanvas(img: HTMLImageElement): HTMLCanvasElement {
  const c = document.createElement("canvas");
  c.width  = img.naturalWidth;
  c.height = img.naturalHeight;
  c.getContext("2d")!.drawImage(img, 0, 0);
  return c;
}

function canvasToBlob(canvas: HTMLCanvasElement, format: OutputFormat, quality = 0.93): Promise<Blob> {
  const mime = format === "jpg" ? "image/jpeg" : format === "png" ? "image/png" : "image/webp";
  return new Promise((res, rej) =>
    canvas.toBlob((b) => (b ? res(b) : rej(new Error("Export failed"))), mime, quality)
  );
}

/* ─── component ─────────────────────────────────────────────── */

export default function ImageEditorClient() {
  /* ── upload state ── */
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceImg,  setSourceImg]  = useState<HTMLImageElement | null>(null);
  /* current canvas stack — index 0 = original, last = current */
  const [canvasStack, setCanvasStack] = useState<string[]>([]);

  /* ── UI state ── */
  const [activeTab,     setActiveTab]     = useState<Tab>("resize");
  const [outputFormat,  setOutputFormat]  = useState<OutputFormat>("jpg");
  const [saving,        setSaving]        = useState(false);

  /* ── resize state ── */
  const [resizeW,      setResizeW]      = useState(0);
  const [resizeH,      setResizeH]      = useState(0);
  const [aspectLock,   setAspectLock]   = useState(true);
  const origRatioRef   = useRef(1);

  /* ── crop state ── */
  const cropContainerRef = useRef<HTMLDivElement>(null);
  const [cropBox,        setCropBox]       = useState<CropBox>({ x: 10, y: 10, w: 80, h: 80 }); // percentages
  const [cropAspect,     setCropAspect]    = useState<number | null>(null);
  const dragState = useRef<{ type: "move" | "resize"; startX: number; startY: number; startBox: CropBox } | null>(null);

  /* ── rotate state ── */
  const [rotateAngle, setRotateAngle] = useState(0);

  /* ── derived: current preview URL ── */
  const currentUrl = canvasStack[canvasStack.length - 1] ?? null;

  /* ──────────────────────────────────── load image ── */
  const loadFile = (files: File[]) => {
    const file = files[0];
    setSourceFile(file);
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      setSourceImg(img);
      origRatioRef.current = img.naturalWidth / img.naturalHeight;
      setResizeW(img.naturalWidth);
      setResizeH(img.naturalHeight);
      setCanvasStack([url]);
      toast.success("Image loaded", { description: `${img.naturalWidth} × ${img.naturalHeight}px` });
    };
    img.src = url;
  };

  /* keep resize inputs in sync with current canvas */
  useEffect(() => {
    if (!currentUrl || activeTab !== "resize") return;
    const img = new Image();
    img.onload = () => {
      setResizeW(img.naturalWidth);
      setResizeH(img.naturalHeight);
      origRatioRef.current = img.naturalWidth / img.naturalHeight;
    };
    img.src = currentUrl;
  }, [currentUrl, activeTab]);

  /* ──────────────────────────────────── undo ── */
  const undo = () => {
    if (canvasStack.length <= 1) return;
    const prev = canvasStack[canvasStack.length - 2];
    const removed = canvasStack[canvasStack.length - 1];
    // revoke object URL only if it's not the original file URL
    if (canvasStack.length > 2) URL.revokeObjectURL(removed);
    setCanvasStack((s) => s.slice(0, -1));
    toast("Undone", { description: "Last operation removed." });
    const img = new Image();
    img.onload = () => origRatioRef.current = img.naturalWidth / img.naturalHeight;
    img.src = prev;
  };

  const reset = () => {
    canvasStack.slice(1).forEach((url) => URL.revokeObjectURL(url));
    if (sourceFile) {
      const url = URL.createObjectURL(sourceFile);
      setCanvasStack([url]);
      const img = new Image();
      img.onload = () => {
        origRatioRef.current = img.naturalWidth / img.naturalHeight;
        setResizeW(img.naturalWidth);
        setResizeH(img.naturalHeight);
      };
      img.src = url;
    }
    toast("Reset", { description: "Reverted to original image." });
  };

  /* ──────────────────────────────────── apply helpers ── */
  const pushCanvas = (canvas: HTMLCanvasElement) => {
    const url = canvas.toDataURL(); // data URL so we don't lose it
    setCanvasStack((s) => [...s, url]);
  };

  const getWorkingImg = (): Promise<HTMLImageElement> =>
    new Promise((res) => {
      const img = new Image();
      img.onload = () => res(img);
      img.src = currentUrl!;
    });

  /* ──────────────────────────────────── RESIZE apply ── */
  const applyResize = async () => {
    if (!currentUrl) return;
    const img = await getWorkingImg();
    const c = document.createElement("canvas");
    c.width  = resizeW;
    c.height = resizeH;
    const ctx = c.getContext("2d")!;
    if (outputFormat === "jpg") { ctx.fillStyle = "#fff"; ctx.fillRect(0, 0, c.width, c.height); }
    ctx.drawImage(img, 0, 0, resizeW, resizeH);
    pushCanvas(c);
    origRatioRef.current = resizeW / resizeH;
    toast.success("Resized", { description: `${resizeW} × ${resizeH}px` });
  };

  /* ──────────────────────────────────── CROP ── */

  /* convert % box → pixel box on the *rendered* image */
  const getPixelCropBox = async (): Promise<{ x: number; y: number; w: number; h: number }> => {
    const img = await getWorkingImg();
    return {
      x: Math.round((cropBox.x / 100) * img.naturalWidth),
      y: Math.round((cropBox.y / 100) * img.naturalHeight),
      w: Math.round((cropBox.w / 100) * img.naturalWidth),
      h: Math.round((cropBox.h / 100) * img.naturalHeight),
    };
  };

  const applyCrop = async () => {
    if (!currentUrl) return;
    const img = await getWorkingImg();
    const px  = await getPixelCropBox();
    if (px.w < 2 || px.h < 2) { toast.error("Crop area too small"); return; }
    const c   = document.createElement("canvas");
    c.width   = px.w;
    c.height  = px.h;
    c.getContext("2d")!.drawImage(img, px.x, px.y, px.w, px.h, 0, 0, px.w, px.h);
    pushCanvas(c);
    setCropBox({ x: 10, y: 10, w: 80, h: 80 });
    toast.success("Cropped", { description: `${px.w} × ${px.h}px` });
  };

  /* crop drag logic (% coordinates inside container) */
  const onCropMouseDown = (e: React.MouseEvent, type: "move" | "resize") => {
    e.preventDefault();
    dragState.current = { type, startX: e.clientX, startY: e.clientY, startBox: { ...cropBox } };
  };

  const onCropMouseMove = useCallback((e: MouseEvent) => {
    if (!dragState.current || !cropContainerRef.current) return;
    const rect = cropContainerRef.current.getBoundingClientRect();
    const dx = ((e.clientX - dragState.current.startX) / rect.width)  * 100;
    const dy = ((e.clientY - dragState.current.startY) / rect.height) * 100;
    const sb = dragState.current.startBox;

    setCropBox((prev) => {
      if (dragState.current!.type === "move") {
        const nx = Math.max(0, Math.min(100 - sb.w, sb.x + dx));
        const ny = Math.max(0, Math.min(100 - sb.h, sb.y + dy));
        return { ...prev, x: nx, y: ny };
      } else {
        // resize from bottom-right
        let nw = Math.max(5, sb.w + dx);
        let nh = Math.max(5, sb.h + dy);
        if (cropAspect) nh = nw / cropAspect;
        nw = Math.min(100 - sb.x, nw);
        nh = Math.min(100 - sb.y, nh);
        return { ...prev, w: nw, h: nh };
      }
    });
  }, [cropAspect]);

  const onCropMouseUp = useCallback(() => { dragState.current = null; }, []);

  useEffect(() => {
    window.addEventListener("mousemove", onCropMouseMove);
    window.addEventListener("mouseup",   onCropMouseUp);
    return () => {
      window.removeEventListener("mousemove", onCropMouseMove);
      window.removeEventListener("mouseup",   onCropMouseUp);
    };
  }, [onCropMouseMove, onCropMouseUp]);

  /* preset aspect → adjust crop box */
  const applyCropAspect = (ratio: number | null) => {
    setCropAspect(ratio);
    if (ratio === null) return;
    setCropBox((prev) => {
      const nh = prev.w / ratio;
      const safeH = Math.min(nh, 100 - prev.y);
      const safeW = safeH * ratio;
      return { ...prev, w: safeW, h: safeH };
    });
  };

  /* ──────────────────────────────────── ROTATE apply ── */
  const applyRotate = async (deg: number) => {
    if (!currentUrl) return;
    const img  = await getWorkingImg();
    const rad  = (deg * Math.PI) / 180;
    const sin  = Math.abs(Math.sin(rad));
    const cos  = Math.abs(Math.cos(rad));
    const nw   = Math.round(img.naturalWidth * cos + img.naturalHeight * sin);
    const nh   = Math.round(img.naturalWidth * sin + img.naturalHeight * cos);
    const c    = document.createElement("canvas");
    c.width    = nw;
    c.height   = nh;
    const ctx  = c.getContext("2d")!;
    ctx.translate(nw / 2, nh / 2);
    ctx.rotate(rad);
    ctx.drawImage(img, -img.naturalWidth / 2, -img.naturalHeight / 2);
    pushCanvas(c);
    toast.success(`Rotated ${deg}°`);
  };

  /* ──────────────────────────────────── FLIP apply ── */
  const applyFlip = async (horizontal: boolean) => {
    if (!currentUrl) return;
    const img = await getWorkingImg();
    const c   = imageToCanvas(img);
    const ctx = c.getContext("2d")!;
    ctx.clearRect(0, 0, c.width, c.height);
    ctx.save();
    if (horizontal) { ctx.scale(-1, 1); ctx.drawImage(img, -c.width, 0); }
    else            { ctx.scale(1, -1); ctx.drawImage(img, 0, -c.height); }
    ctx.restore();
    pushCanvas(c);
    toast.success(horizontal ? "Flipped Horizontally" : "Flipped Vertically");
  };

  /* ──────────────────────────────────── DOWNLOAD ── */
  const handleDownload = async () => {
    if (!currentUrl || !sourceFile) return;
    setSaving(true);
    try {
      const img    = await getWorkingImg();
      const canvas = imageToCanvas(img);
      const blob   = await canvasToBlob(canvas, outputFormat);
      const ext    = outputFormat === "jpg" ? "jpg" : outputFormat;
      const name   = sourceFile.name.replace(/\.[^/.]+$/, `-edited.${ext}`);
      downloadBlob(blob, name);
      toast.success("Downloaded!", { description: name });
    } catch {
      toast.error("Export failed");
    } finally {
      setSaving(false);
    }
  };

  /* ──────────────────────────────────── RENDER ── */

  if (!sourceImg || canvasStack.length === 0) {
    return (
      <FileUploader
        accept=".jpg,.jpeg,.png,.webp,.bmp"
        multiple={false}
        maxSizeMB={50}
        onFiles={loadFile}
        label="Upload Image to Edit"
        hint="Supports JPG, PNG, WebP, BMP — up to 50MB"
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* ── top bar ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-2xl shrink-0">🖼️</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">{sourceFile?.name}</p>
            <p className="text-xs text-slate-400">{sourceFile && formatBytes(sourceFile.size)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={undo}
            disabled={canvasStack.length <= 1}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition-colors"
          >
            ↩ Undo
          </button>
          <button
            onClick={reset}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            ↺ Reset
          </button>
          <button
            onClick={() => {
              canvasStack.slice(1).forEach((u) => URL.revokeObjectURL(u));
              setSourceFile(null); setSourceImg(null); setCanvasStack([]);
            }}
            className="rounded-lg border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
          >
            New Image
          </button>
        </div>
      </div>

      {/* ── preview ── */}
      <div className="rounded-xl border border-slate-200 bg-white p-3">
        {activeTab === "crop" && currentUrl ? (
          <div
            ref={cropContainerRef}
            className="relative mx-auto select-none overflow-hidden rounded-lg"
            style={{ maxWidth: "100%", maxHeight: 400, display: "inline-block", width: "100%" }}
          >
            <img
              src={currentUrl}
              alt="Edit preview"
              className="block w-full rounded-lg object-contain"
              style={{ maxHeight: 400, userSelect: "none", pointerEvents: "none" }}
              draggable={false}
            />
            {/* dark overlay */}
            <div className="absolute inset-0 bg-black/40 pointer-events-none" />
            {/* crop box */}
            <div
              className="absolute border-2 border-white shadow-lg cursor-move"
              style={{
                left:   `${cropBox.x}%`,
                top:    `${cropBox.y}%`,
                width:  `${cropBox.w}%`,
                height: `${cropBox.h}%`,
                boxShadow: "inset 0 0 0 9999px rgba(0,0,0,0)", // clear inside
                background: "transparent",
              }}
              onMouseDown={(e) => onCropMouseDown(e, "move")}
            >
              {/* resize handle */}
              <div
                className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize rounded-sm bg-white border border-slate-300"
                style={{ transform: "translate(50%, 50%)" }}
                onMouseDown={(e) => { e.stopPropagation(); onCropMouseDown(e, "resize"); }}
              />
              {/* rule-of-thirds grid lines */}
              {[1/3, 2/3].map((t) => (
                <div key={`v${t}`} className="absolute top-0 bottom-0 w-px bg-white/40" style={{ left: `${t * 100}%` }} />
              ))}
              {[1/3, 2/3].map((t) => (
                <div key={`h${t}`} className="absolute left-0 right-0 h-px bg-white/40" style={{ top: `${t * 100}%` }} />
              ))}
              {/* corner handles */}
              {[
                "top-0 left-0 -translate-x-1/2 -translate-y-1/2",
                "top-0 right-0 translate-x-1/2 -translate-y-1/2",
                "bottom-0 left-0 -translate-x-1/2 translate-y-1/2",
              ].map((cls, i) => (
                <div key={i} className={`absolute h-3 w-3 rounded-sm bg-white border border-slate-300 ${cls}`} />
              ))}
            </div>
          </div>
        ) : (
          currentUrl && (
            <img
              src={currentUrl}
              alt="Edit preview"
              className="mx-auto block max-h-96 w-full rounded-lg object-contain"
            />
          )
        )}
      </div>

      {/* ── tabs ── */}
      <div className="rounded-xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex border-b border-slate-200">
          {TAB_INFO.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-3 text-sm font-semibold transition-colors ${
                activeTab === t.key
                  ? "border-b-2 border-red-500 bg-red-50 text-red-700"
                  : "text-slate-500 hover:bg-slate-50"
              }`}
            >
              <span className="hidden sm:inline mr-1">{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        <div className="p-5 space-y-4">
          {/* ── RESIZE ── */}
          {activeTab === "resize" && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-600">Width (px)</label>
                  <input
                    type="number" min={1} value={resizeW}
                    onChange={(e) => {
                      const v = Math.max(1, parseInt(e.target.value) || 1);
                      setResizeW(v);
                      if (aspectLock) setResizeH(Math.round(v / origRatioRef.current));
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-300"
                  />
                </div>
                <div>
                  <label className="block mb-1 text-xs font-semibold text-slate-600">Height (px)</label>
                  <input
                    type="number" min={1} value={resizeH}
                    onChange={(e) => {
                      const v = Math.max(1, parseInt(e.target.value) || 1);
                      setResizeH(v);
                      if (aspectLock) setResizeW(Math.round(v * origRatioRef.current));
                    }}
                    className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm focus:border-red-400 focus:outline-none focus:ring-1 focus:ring-red-300"
                  />
                </div>
              </div>

              <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-600">
                <div
                  onClick={() => setAspectLock((v) => !v)}
                  className={`relative h-5 w-9 rounded-full transition-colors ${aspectLock ? "bg-red-500" : "bg-slate-300"}`}
                >
                  <div className={`absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${aspectLock ? "translate-x-4" : "translate-x-0.5"}`} />
                </div>
                Lock aspect ratio
              </label>

              {/* social presets */}
              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Social Media Presets</p>
                <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3">
                  {SOCIAL_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => { setResizeW(p.w); setResizeH(p.h); setAspectLock(false); }}
                      className="rounded-lg border border-slate-200 px-2 py-1.5 text-left hover:border-red-300 hover:bg-red-50/40 transition-colors"
                    >
                      <p className="text-xs font-medium text-slate-700 truncate">{p.label}</p>
                      <p className="text-xs text-slate-400">{p.w}×{p.h}</p>
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={applyResize}
                className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Apply Resize
              </button>
            </>
          )}

          {/* ── CROP ── */}
          {activeTab === "crop" && (
            <>
              <p className="text-sm text-slate-600">Drag the white box on the preview to position your crop. Drag the bottom-right handle to resize.</p>

              <div>
                <p className="mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wide">Aspect Ratio</p>
                <div className="flex flex-wrap gap-2">
                  {ASPECT_PRESETS.map((p) => (
                    <button
                      key={p.label}
                      onClick={() => applyCropAspect(p.ratio)}
                      className={`rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                        cropAspect === p.ratio
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-slate-200 text-slate-600 hover:border-red-200 hover:bg-red-50/40"
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={applyCrop}
                className="w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
              >
                Apply Crop
              </button>
            </>
          )}

          {/* ── ROTATE ── */}
          {activeTab === "rotate" && (
            <>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                {[90, 180, 270, -90].map((deg) => (
                  <button
                    key={deg}
                    onClick={() => applyRotate(deg)}
                    className="rounded-xl border border-slate-200 py-3 text-sm font-semibold text-slate-700 hover:border-red-300 hover:bg-red-50/40 transition-colors"
                  >
                    {deg === -90 ? "−90°" : `+${deg}°`}
                  </button>
                ))}
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-slate-600">
                  Custom angle: <span className="font-semibold text-red-600">{rotateAngle}°</span>
                </label>
                <input
                  type="range" min={-180} max={180} step={1}
                  value={rotateAngle}
                  onChange={(e) => setRotateAngle(Number(e.target.value))}
                  className="w-full accent-red-600"
                />
                <div className="flex justify-between text-xs text-slate-400 mt-1">
                  <span>-180°</span>
                  <span>0°</span>
                  <span>+180°</span>
                </div>
                <button
                  onClick={() => applyRotate(rotateAngle)}
                  disabled={rotateAngle === 0}
                  className="mt-3 w-full rounded-xl bg-red-600 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-40 transition-colors"
                >
                  Apply {rotateAngle}° Rotation
                </button>
              </div>
            </>
          )}

          {/* ── FLIP ── */}
          {activeTab === "flip" && (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => applyFlip(true)}
                className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 py-6 text-slate-700 hover:border-red-300 hover:bg-red-50/40 transition-colors"
              >
                <span className="text-4xl">↔</span>
                <span className="text-sm font-semibold">Flip Horizontal</span>
              </button>
              <button
                onClick={() => applyFlip(false)}
                className="flex flex-col items-center gap-3 rounded-xl border border-slate-200 py-6 text-slate-700 hover:border-red-300 hover:bg-red-50/40 transition-colors"
              >
                <span className="text-4xl">↕</span>
                <span className="text-sm font-semibold">Flip Vertical</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ── export bar ── */}
      <div className="rounded-xl border border-slate-200 bg-white p-4">
        <div className="flex flex-wrap items-center gap-3">
          <div>
            <p className="mb-1.5 text-xs font-semibold text-slate-500 uppercase tracking-wide">Export Format</p>
            <div className="flex gap-2">
              {(["jpg", "png", "webp"] as OutputFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setOutputFormat(fmt)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-semibold uppercase transition-colors ${
                    outputFormat === fmt
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-slate-200 text-slate-600 hover:border-red-200"
                  }`}
                >
                  {fmt}
                </button>
              ))}
            </div>
          </div>

          <div className="ml-auto">
            <button
              onClick={handleDownload}
              disabled={saving}
              className="rounded-xl bg-red-600 px-6 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-60 transition-colors"
            >
              {saving ? "Saving…" : `⬇ Download ${outputFormat.toUpperCase()}`}
            </button>
          </div>
        </div>

        {canvasStack.length > 1 && (
          <p className="mt-2 text-xs text-slate-400">
            {canvasStack.length - 1} operation{canvasStack.length > 2 ? "s" : ""} applied · Undo available
          </p>
        )}
      </div>
    </div>
  );
}
