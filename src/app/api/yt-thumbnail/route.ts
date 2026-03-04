import { NextRequest, NextResponse } from "next/server";

const ALLOWED_QUALITIES = ["maxresdefault", "hqdefault", "mqdefault", "sddefault", "default"] as const;

export const runtime = "edge";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const quality = (req.nextUrl.searchParams.get("quality") ?? "maxresdefault") as string;

  if (!id || !/^[a-zA-Z0-9_-]{11}$/.test(id)) {
    return NextResponse.json({ error: "Invalid video ID" }, { status: 400 });
  }

  if (!ALLOWED_QUALITIES.includes(quality as (typeof ALLOWED_QUALITIES)[number])) {
    return NextResponse.json({ error: "Invalid quality parameter" }, { status: 400 });
  }

  const url = `https://img.youtube.com/vi/${id}/${quality}.jpg`;

  try {
    const response = await fetch(url, {
      headers: { "User-Agent": "Mozilla/5.0" },
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: "Thumbnail not available at this quality" },
        { status: 404 },
      );
    }

    const buffer = await response.arrayBuffer();

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/jpeg",
        "Content-Disposition": `attachment; filename="thumbnail-${id}-${quality}.jpg"`,
        "Cache-Control": "public, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch thumbnail" },
      { status: 500 },
    );
  }
}
