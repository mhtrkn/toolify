import type { Metadata } from "next";
import ToolPageLayout from "@/components/tools/ToolPageLayout";
import JsonLd from "@/components/seo/JsonLd";
import VideoToMp3Client from "./VideoToMp3Client";
import { buildToolMetadata, SITE_URL } from "@/lib/metadata";
import { buildWebAppSchema, buildBreadcrumbSchema, buildFaqSchema } from "@/lib/structured-data";

export const metadata: Metadata = buildToolMetadata({
  toolName: "Video to MP3",
  toolDescription:
    "Extract MP3 audio from any video file online for free. Supports MP4, AVI, MOV, MKV, WebM. High-quality 192kbps output. No registration needed.",
  categorySlug: "video-tools",
  toolSlug: "video-to-mp3",
  keywords: [
    "video to mp3",
    "extract audio from video",
    "mp4 to mp3",
    "convert video to audio",
    "youtube to mp3",
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
        title="Video to MP3 – Extract Audio from Video Online Free"
        description="Convert MP4, AVI, MOV and other video files to high-quality MP3 audio. Fast extraction with 192kbps output. No account needed."
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
