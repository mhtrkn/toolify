import type { ConversionEngine } from "./types";

async function videoToMp3Blob(file: File): Promise<Blob> {
  const [{ createFFmpeg }, { fetchFile }] = await Promise.all([
    import("@ffmpeg/ffmpeg"),
    import("@ffmpeg/util"),
  ]);

  const ffmpeg = createFFmpeg({
    log: false,
  });

  if (!ffmpeg.isLoaded()) {
    await ffmpeg.load();
  }

  const ext = file.name.split(".").pop() ?? "mp4";
  const inputName = `input.${ext.toLowerCase()}`;
  const outputName = "output.mp3";

  ffmpeg.FS("writeFile", inputName, await fetchFile(file));

  await ffmpeg.run(
    "-i",
    inputName,
    "-vn",
    "-acodec",
    "libmp3lame",
    "-q:a",
    "2",
    outputName,
  );

  const data = ffmpeg.FS("readFile", outputName);

  // Clean up in-memory FS
  ffmpeg.FS("unlink", inputName);
  ffmpeg.FS("unlink", outputName);

  return new Blob([data.buffer], { type: "audio/mpeg" });
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

