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
  svg: "image/svg+xml",
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
          fmt === "jpg" || fmt === "jpeg" ? 0.95 : undefined,
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

/**
 * Raster image → SVG via imagetracerjs (client-side vectorization).
 * Works best for logos, icons, and simple graphics.
 */
async function imageToSvgBlob(file: File): Promise<Blob> {
  const ImageTracer = (await import("imagetracerjs")).default;

  const src = URL.createObjectURL(file);
  try {
    return await new Promise<Blob>((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement("canvas");
          canvas.width = img.naturalWidth;
          canvas.height = img.naturalHeight;
          const ctx = canvas.getContext("2d")!;
          ctx.drawImage(img, 0, 0);
          const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
          const svgStr = ImageTracer.imagedataToSVG(imageData, { scale: 1 });
          resolve(new Blob([svgStr], { type: "image/svg+xml" }));
        } catch (e) {
          reject(e);
        }
      };
      img.onerror = () => reject(new Error("Failed to load image"));
      img.src = src;
    });
  } finally {
    URL.revokeObjectURL(src);
  }
}

const imageEngine: ConversionEngine = {
  id: "image",

  async convert(file, targetFormat) {
    const fmt = targetFormat.toLowerCase();

    if (fmt === "pdf") {
      return imageToPdfBlob(file);
    }

    if (fmt === "svg") {
      return imageToSvgBlob(file);
    }

    // SVG input can be drawn to canvas like any other image format
    if (fmt in MIME) {
      return imageToImageBlob(file, fmt);
    }

    throw new Error(`Unsupported image conversion to "${targetFormat}"`);
  },
};

export default imageEngine;

