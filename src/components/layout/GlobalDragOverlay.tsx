"use client";
import { useEffect, useRef, useState } from "react";

export default function GlobalDragOverlay() {
  const [visible, setVisible] = useState(false);
  const dragCounter = useRef(0);

  useEffect(() => {
    const handleDragEnter = (e: DragEvent) => {
      e.preventDefault();
      if (!e.dataTransfer?.types.includes("Files")) return;

      dragCounter.current += 1;
      setVisible(true);
    };

    const handleDragLeave = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current -= 1;
      if (dragCounter.current <= 0) {
        dragCounter.current = 0;
        setVisible(false);
      }
    };

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault();
    };

    const handleDrop = (e: DragEvent) => {
      e.preventDefault();
      dragCounter.current = 0;
      setVisible(false);
      const files = e.dataTransfer?.files;
      if (!files || files.length === 0) return;
      window.dispatchEvent(new CustomEvent("global-files-dropped", { detail: files }));
    };

    window.addEventListener("dragenter", handleDragEnter);
    window.addEventListener("dragleave", handleDragLeave);
    window.addEventListener("dragover", handleDragOver);
    window.addEventListener("drop", handleDrop);

    return () => {
      window.removeEventListener("dragenter", handleDragEnter);
      window.removeEventListener("dragleave", handleDragLeave);
      window.removeEventListener("dragover", handleDragOver);
      window.removeEventListener("drop", handleDrop);
    };
  }, []);

  if (!visible) return null;

  return (
    <div className="fixed inset-0 z-9999 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm transition-all duration-300">
      {/* Outer Glow & Dashed Border Container */}
      <div className="pointer-events-none relative flex h-full w-full flex-col items-center justify-center rounded-3xl border-4 border-dashed border-red-400/60 bg-linear-to-b from-red-500/10 to-red-600/20 shadow-2xl">

        {/* Animated Icon Circle */}
        <div className="mb-8 flex aspect-square w-28 items-center justify-center rounded-full bg-red-600/90 text-white shadow-[0_0_40px_-10px_rgba(235,37,37,0.8)] animate-bounce duration-500">
          <svg
            className="h-14 w-14"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>

        {/* Text Content */}
        <div className="text-center space-y-3 px-4">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white drop-shadow-md">
            Drop to upload
          </h2>
          <p className="text-lg md:text-xl font-medium text-red-100/80">
            Release your files to start the magic
          </p>
        </div>

        {/* Subtle Decorative Gradient */}
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_center,var(--tw-gradient-stops))] from-red-500/10 via-transparent to-transparent" />
      </div>
    </div>
  );
}
