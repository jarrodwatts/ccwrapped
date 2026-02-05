import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import type { StoredWrapped } from "@/lib/types";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse> {
  const { slug } = await params;

  const raw = await kv.get<string>(`wrapped:${slug}`);
  if (!raw) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const stored: StoredWrapped =
    typeof raw === "string" ? JSON.parse(raw) : raw;

  return NextResponse.json(stored, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=86400",
    },
  });
}
