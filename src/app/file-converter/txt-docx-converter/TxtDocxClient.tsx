"use client";

import { useState } from "react";
import { toast } from "sonner";
import FileUploader from "@/components/tools/FileUploader";
import ProgressBar from "@/components/tools/ProgressBar";
import { formatBytes } from "@/lib/utils";
import { escapeXml } from "@/lib/converters/data-format";

type Mode = "txt-to-docx" | "docx-to-txt";
type Status = "idle" | "ready" | "processing" | "done" | "error";

/** Build a minimal valid .docx blob from plain text using JSZip. */
async function buildDocx(text: string): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();

  const paragraphs = text
    .split(/\r?\n/)
    .map((line) =>
      line.trim()
        ? `<w:p><w:r><w:t xml:space="preserve">${escapeXml(line)}</w:t></w:r></w:p>`
        : `<w:p><w:pPr><w:spacing w:after="0"/></w:pPr></w:p>`
    )
    .join("\n    ");

  const docXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:body>
    ${paragraphs}
    <w:sectPr>
      <w:pgSz w:w="12240" w:h="15840"/>
      <w:pgMar w:top="1440" w:right="1440" w:bottom="1440" w:left="1440"/>
    </w:sectPr>
  </w:body>
</w:document>`;

  const relsXml = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument"
    Target="word/document.xml"/>
</Relationships>`;

  const wordRelsXml = `<?xml version="1.0" encoding="UTF-8"?>
<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">
  <Relationship Id="rId1"
    Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles"
    Target="styles.xml"/>
</Relationships>`;

  const contentTypesXml = `<?xml version="1.0" encoding="UTF-8"?>
<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">
  <Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/>
  <Default Extension="xml" ContentType="application/xml"/>
  <Override PartName="/word/document.xml"
    ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/>
  <Override PartName="/word/styles.xml"
    ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.styles+xml"/>
</Types>`;

  const stylesXml = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<w:styles xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main">
  <w:style w:type="paragraph" w:default="1" w:styleId="Normal">
    <w:name w:val="Normal"/>
    <w:rPr><w:sz w:val="24"/><w:szCs w:val="24"/></w:rPr>
  </w:style>
</w:styles>`;

  zip.file("[Content_Types].xml", contentTypesXml);
  zip.file("_rels/.rels", relsXml);
  zip.file("word/document.xml", docXml);
  zip.file("word/styles.xml", stylesXml);
  zip.file("word/_rels/document.xml.rels", wordRelsXml);

  return zip.generateAsync({
    type: "blob",
    mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  });
}

export default function TxtDocxClient() {
  const [mode, setMode] = useState<Mode>("txt-to-docx");
  const [status, setStatus] = useState<Status>("idle");
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultName, setResultName] = useState("");
  const [extractedText, setExtractedText] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleFiles = (files: File[]) => {
    setFile(files[0]);
    setStatus("ready");
    setError(null);
    setResultUrl(null);
    setExtractedText("");
    toast.success("File Ready", { description: files[0].name });
  };

  const convert = async () => {
    if (!file) return;
    setStatus("processing");
    setProgress(20);
    setError(null);

    try {
      if (mode === "txt-to-docx") {
        const text = await file.text();
        setProgress(60);
        const blob = await buildDocx(text);
        const outName = file.name.replace(/\.txt$/i, "") + ".docx";
        setResultUrl(URL.createObjectURL(blob));
        setResultName(outName);
        setProgress(100);
        setStatus("done");
        toast.success("Converted to DOCX!", { description: outName });
      } else {
        // DOCX → TXT via mammoth
        const mod = await import("mammoth");
        const mammoth = mod.default ?? mod;
        setProgress(40);
        const ab = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer: ab });
        setProgress(90);
        const text = result.value;
        setExtractedText(text);
        const blob = new Blob([text], { type: "text/plain" });
        const outName = file.name.replace(/\.docx?$/i, "") + ".txt";
        setResultUrl(URL.createObjectURL(blob));
        setResultName(outName);
        setProgress(100);
        setStatus("done");
        toast.success("Text Extracted!", { description: outName });
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Conversion failed.";
      setError(msg);
      setStatus("error");
      toast.error("Conversion Failed", { description: msg });
    }
  };

  const download = () => {
    if (!resultUrl) return;
    const a = document.createElement("a");
    a.href = resultUrl;
    a.download = resultName;
    a.click();
    toast.success("Download Started");
  };

  const reset = () => {
    if (resultUrl) URL.revokeObjectURL(resultUrl);
    setFile(null);
    setStatus("idle");
    setProgress(0);
    setResultUrl(null);
    setResultName("");
    setExtractedText("");
    setError(null);
  };

  const isTxtMode = mode === "txt-to-docx";

  return (
    <div className="space-y-6">
      <p className="rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs text-slate-500">
        Files are automatically deleted after processing. All conversion happens in your browser.
      </p>

      {/* Mode toggle */}
      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white p-4">
        <button
          onClick={() => { setMode("txt-to-docx"); reset(); }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${mode === "txt-to-docx" ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          TXT → DOCX
        </button>
        <button
          onClick={() => { setMode(isTxtMode ? "docx-to-txt" : "txt-to-docx"); reset(); }}
          className="rounded-full border border-slate-200 p-2 text-slate-400 hover:bg-slate-50"
          aria-label="Switch direction"
        >
          ⇌
        </button>
        <button
          onClick={() => { setMode("docx-to-txt"); reset(); }}
          className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-colors ${mode === "docx-to-txt" ? "bg-red-600 text-white" : "text-slate-600 hover:bg-slate-50"}`}
        >
          DOCX → TXT
        </button>
      </div>

      {status === "idle" && (
        <FileUploader
          accept={isTxtMode ? ".txt" : ".docx,.doc"}
          maxSizeMB={20}
          onFiles={handleFiles}
          label={isTxtMode ? "Upload TXT File" : "Upload DOCX File"}
          hint={isTxtMode ? "Plain text file — up to 20MB" : "Supports .docx and .doc — up to 20MB"}
        />
      )}

      {status === "ready" && file && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{isTxtMode ? "📄" : "📝"}</span>
            <div>
              <p className="font-medium text-slate-900">{file.name}</p>
              <p className="text-sm text-slate-500">{formatBytes(file.size)}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={convert} className="flex-1 rounded-xl bg-red-600 py-3 text-sm font-semibold text-white hover:bg-red-700">
              Convert
            </button>
            <button onClick={reset} className="rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-600 hover:bg-slate-50">
              Change File
            </button>
          </div>
        </div>
      )}

      {status === "processing" && (
        <div className="rounded-xl border border-slate-200 bg-white p-8">
          <p className="mb-4 text-center font-medium text-slate-700">Converting…</p>
          <ProgressBar progress={progress} label="Processing" />
        </div>
      )}

      {status === "error" && error && (
        <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {status === "done" && resultUrl && (
        <div className="space-y-4">
          <div className="rounded-xl border border-red-200 bg-red-50 p-6 text-center space-y-4">
            <span className="flex mx-auto h-14 w-14 items-center justify-center rounded-full bg-red-100 text-2xl">✅</span>
            <div>
              <p className="font-semibold text-red-900">Conversion Complete!</p>
              <p className="text-sm text-red-700 mt-1">{resultName}</p>
            </div>
            <div className="flex gap-3 justify-center">
              <button onClick={download} className="rounded-xl bg-red-600 px-6 py-3 font-semibold text-white hover:bg-red-700">
                Download
              </button>
              <button onClick={reset} className="rounded-xl border border-slate-300 px-6 py-3 text-slate-600 hover:bg-slate-50">
                Convert Another
              </button>
            </div>
          </div>
          {extractedText && (
            <pre className="max-h-64 overflow-auto rounded-xl border border-slate-200 bg-slate-50 p-4 text-xs text-slate-700">
              {extractedText.slice(0, 3000)}
              {extractedText.length > 3000 ? "\n\n… (preview truncated)" : ""}
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
