import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const { url } = await req.json() as { url?: string };

    if (!url || typeof url !== "string") {
      return NextResponse.json({ error: "URL is required." }, { status: 400 });
    }

    try {
      new URL(url);
    } catch {
      return NextResponse.json({ error: "Invalid URL format." }, { status: 400 });
    }

    const apiUrl = `https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`;
    
    const response = await fetch(apiUrl, {
      headers: { "User-Agent": "Toolify/1.0" },
    });

    if (!response.ok) {
      throw new Error(`TinyURL error: ${response.status}`);
    }

    const shortUrl = await response.text();

    return NextResponse.json({ shortUrl });
  } catch (error) {
    console.error("URL shortener error:", error);
    return NextResponse.json(
      { error: "Failed to shorten URL." },
      { status: 500 }
    );
  }
}