import { ImageResponse } from "next/og";
import { getWrapped } from "@/lib/storage";
import { ARCHETYPE_DEFINITIONS } from "@/config/archetypes";

export const runtime = "edge";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const { slug } = await params;
  const stored = await getWrapped(slug);

  if (!stored) {
    return new Response("Not found", { status: 404 });
  }

  const { payload } = stored;
  const def = ARCHETYPE_DEFINITIONS[payload.archetype];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#0A0A0A",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(circle at 50% 30%, rgba(217, 119, 87, 0.15) 0%, transparent 60%)",
          }}
        />

        <div style={{ fontSize: 80, marginBottom: 16 }}>{def.emoji}</div>

        <div
          style={{
            fontSize: 48,
            fontWeight: 700,
            color: "#D97757",
            marginBottom: 8,
          }}
        >
          {def.name}
        </div>

        <div
          style={{
            fontSize: 24,
            color: "rgba(255, 255, 255, 0.5)",
            display: "flex",
            gap: 24,
            marginTop: 16,
          }}
        >
          <span>{payload.stats.sessions.toLocaleString()} sessions</span>
          <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>·</span>
          <span>{payload.stats.messages.toLocaleString()} messages</span>
          <span style={{ color: "rgba(255, 255, 255, 0.2)" }}>·</span>
          <span>{payload.streaks.longest}-day streak</span>
        </div>

        <div
          style={{
            position: "absolute",
            bottom: 40,
            fontSize: 18,
            color: "rgba(255, 255, 255, 0.2)",
          }}
        >
          Claude Code Wrapped
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
