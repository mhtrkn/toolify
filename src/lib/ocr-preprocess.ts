/**
 * OCR Image Preprocessing
 *
 * Applies a pipeline of image enhancements before sending to Tesseract.js.
 * The pipeline auto-detects whether the image is a "document" (text on white
 * background) or a "photo" (complex scene with text) and adapts accordingly:
 *
 *   Document: upscale → grayscale → contrast → sharpen → adaptive threshold
 *   Photo:    upscale → grayscale → contrast → sharpen  (no threshold)
 *
 * Adaptive thresholding is excellent for scanned documents but can destroy
 * text in photos, screenshots, or images with colored backgrounds.
 */

const MIN_DIMENSION = 1200; // px — upscale if smaller
const MAX_DIMENSION = 4000; // px — cap to prevent OOM on huge images

/**
 * Preprocess an image File/Blob for OCR.
 * Returns a PNG Blob (lossless) ready to pass to Tesseract.
 */
export async function preprocessForOcr(file: File | Blob): Promise<Blob> {
  const img = await loadImage(file);

  // 1. Determine output dimensions (upscale small images, cap huge ones)
  let { width, height } = img;
  const shortSide = Math.min(width, height);

  if (shortSide < MIN_DIMENSION) {
    const scale = MIN_DIMENSION / shortSide;
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  } else if (Math.max(width, height) > MAX_DIMENSION) {
    const scale = MAX_DIMENSION / Math.max(width, height);
    width = Math.round(width * scale);
    height = Math.round(height * scale);
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true })!;

  // 2. Draw (possibly scaled) image
  ctx.drawImage(img, 0, 0, width, height);

  // 3. Grayscale + contrast boost (in-place pixel manipulation)
  const imageData = ctx.getImageData(0, 0, width, height);
  toGrayscaleAndBoostContrast(imageData.data);
  ctx.putImageData(imageData, 0, 0);

  // 4. Unsharp mask (sharpening)
  const sharpened = unsharpMask(ctx, width, height, 0.8);
  ctx.putImageData(sharpened, 0, 0);

  // 5. Adaptive thresholding — only for document-like images
  if (isDocumentLike(ctx, width, height)) {
    const thresholded = adaptiveThreshold(ctx, width, height);
    ctx.putImageData(thresholded, 0, 0);
  }

  // 6. Export as lossless PNG
  return await canvasToBlob(canvas, "image/png");
}

// ── Helpers ──────────────────────────────────────────────────────────────────

function loadImage(file: File | Blob): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image for preprocessing"));
    };
    img.src = url;
  });
}

/**
 * Detect if the image looks like a scanned document (bimodal histogram:
 * mostly near-white and near-black pixels). If so, adaptive thresholding
 * will help. If not (photo, screenshot, colored background), thresholding
 * would destroy useful information.
 *
 * Uses a sampled check (every 4th pixel) for speed on large images.
 */
function isDocumentLike(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): boolean {
  const data = ctx.getImageData(0, 0, width, height).data;
  let nearWhite = 0; // pixel > 200
  let nearBlack = 0; // pixel < 55
  let total = 0;

  // Sample every 4th pixel for speed
  for (let i = 0; i < data.length; i += 16) {
    const v = data[i]; // already grayscale
    if (v > 200) nearWhite++;
    else if (v < 55) nearBlack++;
    total++;
  }

  // Document: > 65% of pixels are extreme (near-white OR near-black)
  const extremeRatio = (nearWhite + nearBlack) / total;
  // Also require majority to be background (near-white) — true for documents
  const bgRatio = nearWhite / total;

  return extremeRatio > 0.65 && bgRatio > 0.45;
}

/**
 * Convert to grayscale and apply a contrast curve.
 * Operates directly on the RGBA Uint8ClampedArray (in-place).
 */
function toGrayscaleAndBoostContrast(data: Uint8ClampedArray): void {
  const factor = 1.45; // contrast multiplier (1.0 = no change)
  const intercept = 128 * (1 - factor);

  for (let i = 0; i < data.length; i += 4) {
    // Luminosity grayscale weights
    const gray =
      0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];
    // Linear contrast stretch around mid-gray
    const c = Math.min(255, Math.max(0, factor * gray + intercept));
    data[i] = data[i + 1] = data[i + 2] = c;
    // data[i + 3] (alpha) unchanged
  }
}

/**
 * Unsharp mask: subtract a blurred version and add back to sharpen edges.
 * Returns a new ImageData with sharpened content.
 */
function unsharpMask(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  amount: number
): ImageData {
  // Get original
  const original = ctx.getImageData(0, 0, width, height);

  // Create an offscreen canvas for blurring
  const blurCanvas = document.createElement("canvas");
  blurCanvas.width = width;
  blurCanvas.height = height;
  const blurCtx = blurCanvas.getContext("2d", { willReadFrequently: true })!;
  blurCtx.filter = "blur(1.2px)";
  blurCtx.drawImage(ctx.canvas, 0, 0);
  const blurred = blurCtx.getImageData(0, 0, width, height);

  // Blend: sharpened = original + amount * (original - blurred)
  const out = ctx.createImageData(width, height);
  for (let i = 0; i < original.data.length; i += 4) {
    for (let c = 0; c < 3; c++) {
      const v =
        original.data[i + c] +
        amount * (original.data[i + c] - blurred.data[i + c]);
      out.data[i + c] = Math.min(255, Math.max(0, Math.round(v)));
    }
    out.data[i + 3] = 255;
  }
  return out;
}

/**
 * Adaptive (local) thresholding: for each pixel, compare against the mean of
 * a surrounding window. Text pixels go black, background goes white.
 * Works much better than global thresholding on uneven illumination.
 */
function adaptiveThreshold(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number
): ImageData {
  const src = ctx.getImageData(0, 0, width, height).data;
  const out = ctx.createImageData(width, height);
  const outData = out.data;

  const BLOCK = 31; // local window size (must be odd)
  const C = 8; // constant subtracted from local mean
  const half = Math.floor(BLOCK / 2);

  // Build integral image (sum table) for fast local means
  const integral = new Float64Array((width + 1) * (height + 1));
  const W = width + 1;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const v = src[(y * width + x) * 4]; // already grayscale (R channel)
      integral[(y + 1) * W + (x + 1)] =
        v +
        integral[y * W + (x + 1)] +
        integral[(y + 1) * W + x] -
        integral[y * W + x];
    }
  }

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const x1 = Math.max(0, x - half);
      const y1 = Math.max(0, y - half);
      const x2 = Math.min(width - 1, x + half);
      const y2 = Math.min(height - 1, y + half);

      const count = (x2 - x1 + 1) * (y2 - y1 + 1);
      const sum =
        integral[(y2 + 1) * W + (x2 + 1)] -
        integral[y1 * W + (x2 + 1)] -
        integral[(y2 + 1) * W + x1] +
        integral[y1 * W + x1];

      const mean = sum / count;
      const pixel = src[(y * width + x) * 4];
      const binary = pixel < mean - C ? 0 : 255;

      const idx = (y * width + x) * 4;
      outData[idx] = outData[idx + 1] = outData[idx + 2] = binary;
      outData[idx + 3] = 255;
    }
  }

  return out;
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Canvas toBlob failed"));
    }, type);
  });
}
