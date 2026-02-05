import { ImageResponse } from "next/og";
import { kv } from "@vercel/kv";
import sharp from "sharp";
import type { StoredWrapped } from "@/lib/types";
import { ARCHETYPES } from "@/config/archetypes";

export const runtime = "nodejs";

const SIZE = { width: 1200, height: 630 };

let cachedFont: ArrayBuffer | null = null;
async function getFont(): Promise<ArrayBuffer> {
  if (cachedFont) return cachedFont;
  const res = await fetch(
    "https://cdn.jsdelivr.net/fontsource/fonts/inter@5.1.0/latin-700-normal.ttf"
  );
  cachedFont = await res.arrayBuffer();
  return cachedFont;
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug } = await params;

  const raw = await kv.get<string>(`wrapped:${slug}`);
  if (!raw) {
    return new Response("Not found", { status: 404 });
  }

  const stored: StoredWrapped =
    typeof raw === "string" ? JSON.parse(raw) : raw;
  const { payload } = stored;

  const archetypeConfig = ARCHETYPES[payload.archetype];
  const font = await getFont();

  const topTools = Object.entries(payload.tools)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name]) => name);

  const imageResponse = new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: "#0A0A0A",
          position: "relative",
          fontFamily: "Inter",
          overflow: "hidden",
        }}
      >
        {/* Background gradient */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(135deg, #0A0A0A 0%, #1A1210 40%, #0A0A0A 100%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(217,119,87,0.12) 0%, transparent 60%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(217,119,87,0.08) 0%, transparent 60%)",
          }}
        />

        {/* Content */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            height: "100%",
            padding: 48,
            position: "relative",
          }}
        >
          {/* Top: Title */}
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            <span
              style={{
                fontSize: 16,
                color: "rgba(255,255,255,0.4)",
                letterSpacing: "0.15em",
                textTransform: "uppercase" as const,
                fontWeight: 600,
              }}
            >
              Claude Code Wrapped
            </span>
          </div>

          {/* Center: Archetype */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 12,
            }}
          >
            <span style={{ fontSize: 64 }}>{archetypeConfig.emoji}</span>
            <span
              style={{
                fontSize: 48,
                color: "#FFFFFF",
                fontWeight: 700,
                letterSpacing: "-0.02em",
              }}
            >
              {archetypeConfig.name}
            </span>
            <span
              style={{
                fontSize: 20,
                color: "rgba(255,255,255,0.5)",
                maxWidth: 600,
                textAlign: "center" as const,
              }}
            >
              {archetypeConfig.shortDescription}
            </span>
          </div>

          {/* Bottom: Stats row */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
            }}
          >
            <div style={{ display: "flex", gap: 32 }}>
              <StatBadge
                label="Sessions"
                value={payload.stats.sessions.toLocaleString()}
              />
              <StatBadge
                label="Messages"
                value={payload.stats.messages.toLocaleString()}
              />
              <StatBadge
                label="Streak"
                value={`${payload.highlights.longestStreak}d`}
              />
              <StatBadge label="Top Tools" value={topTools.join(", ")} />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  backgroundColor: "#D97757",
                  boxShadow: "0 0 10px #D97757",
                }}
              />
              <span
                style={{
                  color: "#D97757",
                  fontSize: 16,
                  fontWeight: 600,
                  letterSpacing: "0.05em",
                }}
              >
                ccwrapped.com
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...SIZE,
      fonts: [
        {
          name: "Inter",
          data: font,
          weight: 700,
          style: "normal" as const,
        },
      ],
    }
  );

  const buffer = await imageResponse.arrayBuffer();
  const png = await sharp(Buffer.from(buffer))
    .png({ compressionLevel: 1 })
    .toBuffer();

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control":
        "public, max-age=86400, s-maxage=86400, stale-while-revalidate=3600",
    },
  });
}

function StatBadge({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontSize: 11,
          color: "rgba(255,255,255,0.4)",
          textTransform: "uppercase" as const,
          letterSpacing: "0.1em",
          fontWeight: 500,
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 22,
          color: "#FFFFFF",
          fontWeight: 700,
          letterSpacing: "-0.02em",
        }}
      >
        {value}
      </span>
    </div>
  );
}
