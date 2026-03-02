import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import VideoToMp3Client from "./VideoToMp3Client";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Video to MP3",
  toolDescription:
    "Extract audio from video files and convert to MP3 online for free. Supports MP4, AVI, MOV, MKV, and WebM. Browser-based — no uploads, fast and private.",
  categorySlug: "video-tools",
  toolSlug: "video-to-mp3",
  keywords: [
    "video to mp3 converter free",
    "extract audio from video online",
    "mp4 to mp3 free",
    "convert video to audio online",
    "video audio extractor browser",
    "mov to mp3 converter free",
    "mkv to mp3 online free",
    "webm to mp3 converter",
    "video to mp3 no software",
    "free audio extractor from video",
  ],
});

const FAQS = [
  {
    question: "How do I convert a video to MP3?",
    answer:
      "Upload your video file, click 'Extract MP3 Audio', and download the MP3 file when conversion is complete.",
  },
  {
    question: "What video formats does this tool support?",
    answer:
      "We support MP4, AVI, MOV, MKV, WebM, FLV, WMV, and most common video formats.",
  },
  {
    question: "What bitrate is the output MP3?",
    answer:
      "The output MP3 is encoded at 192kbps, 44.1kHz stereo — excellent quality for music and voice recordings.",
  },
  {
    question: "Is there a file size limit?",
    answer:
      "You can upload video files up to 500MB. Processing time depends on the file size.",
  },
];

export default function VideoToMp3Page() {
  return (
    <>
      <JsonLd data={buildWebAppSchema({ name: "Video to MP3", description: "Extract MP3 audio from video files.", slug: "video-to-mp3", categorySlug: "video-tools" })} />
      <JsonLd data={buildBreadcrumbSchema([
        { name: "Home", url: SITE_URL },
        { name: "Video Tools", url: `${SITE_URL}/video-tools` },
        { name: "Video to MP3", url: `${SITE_URL}/video-tools/video-to-mp3` },
      ])} />
      <JsonLd data={buildFaqSchema(FAQS)} />
      <ToolPageLayout
        breadcrumbs={[
          { label: "Video Tools", href: "/video-tools" },
          { label: "Video to MP3" },
        ]}
        title="Video to MP3 Converter – Extract Audio from Video Free"
        description="Extract MP3 audio from MP4, AVI, MOV, MKV, and WebM video files online. 192kbps output quality. No uploads — all processing runs in your browser."
        howToSteps={[
          { title: "Upload Video", description: "Select or drag your video file (MP4, AVI, MOV, MKV, WebM)." },
          { title: "Convert", description: "Click 'Extract MP3 Audio' to start the conversion." },
          { title: "Download MP3", description: "Preview the audio and download your MP3 file." },
        ]}
        benefits={[
          { title: "High Quality", description: "Output at 192kbps stereo MP3 — studio-grade audio quality." },
          { title: "All Video Formats", description: "Works with MP4, AVI, MOV, MKV, WebM, and more." },
          { title: "Audio Preview", description: "Listen to the extracted audio before downloading." },
          { title: "Fast Conversion", description: "Browser-based processing for quick turnaround times." },
        ]}
        faqs={FAQS}
      >
        <VideoToMp3Client />
      </ToolPageLayout>
    </>
  );
}
