import { NextResponse } from "next/server";
import { kv } from "@vercel/kv";
import { nanoid } from "nanoid";
import { wrappedPayloadSchema } from "@/lib/types";
import type { StoredWrapped } from "@/lib/types";

const MAX_PAYLOAD_SIZE = 10_000;

export async function POST(request: Request): Promise<NextResponse> {
  const contentLength = request.headers.get("content-length");
  if (contentLength && Number(contentLength) > MAX_PAYLOAD_SIZE) {
    return NextResponse.json(
      { error: "Payload too large" },
      { status: 413 }
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid JSON" },
      { status: 400 }
    );
  }

  const result = wrappedPayloadSchema.safeParse(body);
  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid payload", details: result.error.issues },
      { status: 400 }
    );
  }

  const slug = nanoid(12);
  const stored: StoredWrapped = {
    payload: result.data,
    createdAt: new Date().toISOString(),
    slug,
  };

  await kv.set(`wrapped:${slug}`, JSON.stringify(stored), { ex: 60 * 60 * 24 * 90 });

  return NextResponse.json({ slug });
}
