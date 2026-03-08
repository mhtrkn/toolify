import type { ConversionEngine } from "./types";
import { imageToPdfBlob } from "@/lib/global-converters";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  webp: "image/webp",
  gif: "image/gif",
  bmp: "image/bmp",
  tiff: "image/tiff",
};

function imageToImageBlob(file: File, fmt: string): Promise<Blob> {
  const mime = MIME[fmt] ?? "image/png";

  return new Promise((resolve, reject) => {
    const src = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) {
          reject(new Error("Canvas not supported"));
          return;
        }

        if (fmt === "jpg" || fmt === "jpeg") {
          ctx.fillStyle = "#ffffff";
          ctx.fillRect(0, 0, canvas.width, canvas.height);
        }

        ctx.drawImage(img, 0, 0);

        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error("toBlob failed"));
            } else {
              resolve(blob);
            }
          },
          mime,
          fmt === "jpg" || fmt === "jpeg" ? 0.92 : undefined,
        );
      } finally {
        URL.revokeObjectURL(src);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(src);
      reject(new Error("Failed to load image"));
    };

    img.src = src;
  });
}

const imageEngine: ConversionEngine = {
  id: "image",

  async convert(file, targetFormat) {
    const fmt = targetFormat.toLowerCase();

    if (fmt === "pdf") {
      return imageToPdfBlob(file);
    }

    if (fmt in MIME) {
      return imageToImageBlob(file, fmt);
    }

    throw new Error(`Unsupported image conversion to "${targetFormat}"`);
  },
};

export default imageEngine;

