import type { ConversionEngine } from "./types";

const FFMPEG_CORE_BASE = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";

async function videoToMp3Blob(file: File): Promise<Blob> {
  const { FFmpeg } = await import("@ffmpeg/ffmpeg");
  const { toBlobURL, fetchFile } = await import("@ffmpeg/util");

  const ffmpeg = new FFmpeg();

  await ffmpeg.load({
    coreURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.js`, "text/javascript"),
    wasmURL: await toBlobURL(`${FFMPEG_CORE_BASE}/ffmpeg-core.wasm`, "application/wasm"),
  });

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "mp4";
  const inputName = `input.${ext}`;
  const outputName = "output.mp3";

  await ffmpeg.writeFile(inputName, await fetchFile(file));

  await ffmpeg.exec([
    "-i", inputName,
    "-vn",
    "-acodec", "libmp3lame",
    "-q:a", "2",
    outputName,
  ]);

  const data = await ffmpeg.readFile(outputName);

  await ffmpeg.deleteFile(inputName);
  await ffmpeg.deleteFile(outputName);

  // FileData is Uint8Array<ArrayBufferLike> | string. Copy into a plain
  // Uint8Array<ArrayBuffer> so the Blob constructor's strict type check passes.
  const raw = typeof data === "string" ? new TextEncoder().encode(data) : data;
  const plain = new Uint8Array(raw.byteLength);
  plain.set(raw as Uint8Array<ArrayBuffer>);
  return new Blob([plain], { type: "audio/mpeg" });
}

const videoEngine: ConversionEngine = {
  id: "video",

  async convert(file, targetFormat) {
    const fmt = targetFormat.toLowerCase();

    if (fmt === "mp3") {
      return videoToMp3Blob(file);
    }

    throw new Error(`Unsupported video conversion to "${targetFormat}"`);
  },
};

export default videoEngine;
