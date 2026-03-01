"use client";

import { useRef, useState, useCallback } from "react";
import { formatBytes } from "@/lib/utils";

interface FileUploaderProps {
  accept?: string;
  multiple?: boolean;
  maxSizeMB?: number;
  onFiles: (files: File[]) => void;
  label?: string;
  hint?: string;
}

export default function FileUploader({
  accept,
  multiple = false,
  maxSizeMB = 50,
  onFiles,
  label = "Upload File",
  hint,
}: FileUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateFiles = (files: FileList): File[] => {
    const maxBytes = maxSizeMB * 1024 * 1024;
    const valid: File[] = [];
    for (const file of Array.from(files)) {
      if (file.size > maxBytes) {
        setError(`${file.name} exceeds ${maxSizeMB}MB limit.`);
        return [];
      }
      valid.push(file);
    }
    setError(null);
    return valid;
  };

  const handleFiles = useCallback(
    (files: FileList | null) => {
      if (!files || files.length === 0) return;
      const valid = validateFiles(files);
      if (valid.length > 0) onFiles(valid);
    },
    [onFiles, maxSizeMB]
  );

  const onDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const onDragLeave = () => setIsDragging(false);

  const onClick = () => inputRef.current?.click();

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div className="w-full">
      <div
        role="button"
        tabIndex={0}
        onClick={onClick}
        onKeyDown={onKeyDown}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        aria-label={label}
        className={`flex min-h-52 w-full cursor-pointer flex-col items-center justify-center gap-4 rounded-2xl border-2 border-dashed transition-colors focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 ${
          isDragging
            ? "border-red-400 bg-red-50"
            : "border-slate-300 bg-slate-50 hover:border-red-300 hover:bg-red-50/30"
        }`}
      >
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-7 w-7 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
            />
          </svg>
        </div>
        <div className="text-center">
          <p className="text-base font-semibold text-slate-700">
            {isDragging ? "Drop files here" : label}
          </p>
          <p className="mt-1 text-sm text-slate-500">
            Drag & drop or{" "}
            <span className="font-medium text-red-600">browse files</span>
          </p>
          {hint && <p className="mt-1 text-xs text-slate-400">{hint}</p>}
          <p className="mt-1 text-xs text-slate-400">
            Max file size: {formatBytes(maxSizeMB * 1024 * 1024)}
          </p>
        </div>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="sr-only"
          onChange={(e) => handleFiles(e.target.files)}
          aria-label={label}
        />
      </div>
      {error && (
        <p role="alert" className="mt-2 text-sm text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
