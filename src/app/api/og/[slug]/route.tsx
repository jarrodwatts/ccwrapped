import { ImageResponse } from "next/og";
import { getWrapped } from "@/lib/storage";
import { ARCHETYPE_DEFINITIONS } from "@/config/archetypes";

export const runtime = "edge";

const interRegular = fetch(
  "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hjp-Ek-_0ew.woff"
).then((res) => res.arrayBuffer());

const interBold = fetch(
  "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuI6fAZ9hjp-Ek-_0ew.woff"
).then((res) => res.arrayBuffer());

function formatNum(n: number): string {
  return n.toLocaleString("en-US");
}

function padNum(n: number, digits: number = 5): string {
  return Math.round(n).toString().padStart(digits, "0");
}

function hourLabel(h: number): string {
  if (h === 0) return "12AM";
  if (h === 12) return "12PM";
  if (h < 12) return `${h}AM`;
  return `${h - 12}PM`;
}

function dayName(d: number): string {
  return ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"][d] ?? "?";
}

const RED = "#E85A4F";
const WHITE90 = "rgba(255, 255, 255, 0.9)";
const WHITE40 = "rgba(255, 255, 255, 0.4)";
const WHITE35 = "rgba(255, 255, 255, 0.35)";
const WHITE25 = "rgba(255, 255, 255, 0.25)";
const BORDER = "rgba(255, 255, 255, 0.08)";
const CARD_BG = "rgba(255, 255, 255, 0.02)";
const CARD_BORDER = "rgba(255, 255, 255, 0.06)";

const cardStyle = {
  display: "flex" as const,
  flexDirection: "column" as const,
  flex: 1,
  background: CARD_BG,
  border: `1px solid ${CARD_BORDER}`,
  borderRadius: 8,
  padding: "28px 36px",
};

const labelStyle = {
  display: "flex" as const,
  fontSize: 18,
  color: WHITE35,
  letterSpacing: "0.1em",
};

const valueStyle = {
  display: "flex" as const,
  fontSize: 72,
  fontWeight: 700,
  color: RED,
  marginTop: 8,
};

const barContainerStyle = {
  display: "flex" as const,
  alignItems: "flex-end" as const,
  gap: 4,
  marginTop: "auto",
  height: 40,
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const [fontRegular, fontBold] = await Promise.all([interRegular, interBold]);

  const { slug } = await params;
  const stored = await getWrapped(slug);

  if (!stored) {
    return new Response("Not found", { status: 404 });
  }

  const { payload } = stored;
  const def = ARCHETYPE_DEFINITIONS[payload.archetype];

  const topTools = Object.entries(payload.tools)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name]) => name)
    .join(" / ");

  const bars1 = [20, 35, 28, 45, 38, 52, 48, 60, 55, 70, 65, 80];
  const bars2 = [15, 25, 40, 35, 50, 45, 62, 58, 75, 68, 85, 90];
  const bars3 = [30, 42, 38, 55, 48, 65, 60, 72, 68, 78, 82, 88];
  const bars4 = [25, 32, 45, 40, 58, 52, 68, 62, 75, 80, 72, 85];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: "#0A0A0A",
          fontFamily: "Inter",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "40px 56px",
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ display: "flex", fontSize: 28, color: WHITE40 }}>
            W-01
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              fontWeight: 700,
              color: WHITE90,
              letterSpacing: "0.15em",
            }}
          >
            CLAUDE CODE WRAPPED
          </div>
          <div style={{ display: "flex", fontSize: 28, color: WHITE40 }}>+</div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "32px 56px",
            borderBottom: `1px solid ${BORDER}`,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
            <div style={{ display: "flex", fontSize: 40 }}>{def.emoji}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <div
                style={{
                  display: "flex",
                  fontSize: 32,
                  fontWeight: 700,
                  color: RED,
                  letterSpacing: "0.05em",
                }}
              >
                {def.name.toUpperCase()}
              </div>
              <div style={{ display: "flex", fontSize: 20, color: WHITE35 }}>
                {def.shortDescription}
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
            }}
          >
            <div
              style={{
                display: "flex",
                fontSize: 18,
                color: WHITE35,
                letterSpacing: "0.1em",
              }}
            >
              STREAK
            </div>
            <div
              style={{
                display: "flex",
                fontSize: 56,
                fontWeight: 700,
                color: RED,
              }}
            >
              {`${padNum(payload.streaks.longest, 2)}d`}
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            flex: 1,
            padding: "40px 56px",
            gap: 32,
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 32,
            }}
          >
            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={labelStyle}>SESSIONS</div>
                <div style={{ display: "flex", fontSize: 16, color: WHITE25 }}>
                  TOTAL
                </div>
              </div>
              <div style={valueStyle}>{padNum(payload.stats.sessions)}</div>
              <div style={barContainerStyle}>
                {bars1.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      width: 8,
                      height: `${h}%`,
                      background:
                        i === 11 ? RED : `rgba(232, 90, 79, ${0.2 + i * 0.05})`,
                      borderRadius: 2,
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={labelStyle}>MESSAGES</div>
                <div style={{ display: "flex", fontSize: 16, color: WHITE25 }}>
                  TOTAL
                </div>
              </div>
              <div style={valueStyle}>{formatNum(payload.stats.messages)}</div>
              <div style={barContainerStyle}>
                {bars2.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      width: 8,
                      height: `${h}%`,
                      background:
                        i === 11 ? RED : `rgba(232, 90, 79, ${0.2 + i * 0.05})`,
                      borderRadius: 2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 32,
            }}
          >
            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={labelStyle}>HOURS</div>
                <div style={{ display: "flex", fontSize: 16, color: WHITE25 }}>
                  TOTAL
                </div>
              </div>
              <div style={valueStyle}>
                {`${padNum(Math.round(payload.stats.hours))}h`}
              </div>
              <div style={barContainerStyle}>
                {bars3.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      width: 8,
                      height: `${h}%`,
                      background:
                        i === 11 ? RED : `rgba(232, 90, 79, ${0.2 + i * 0.05})`,
                      borderRadius: 2,
                    }}
                  />
                ))}
              </div>
            </div>

            <div style={cardStyle}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <div style={labelStyle}>COMMITS</div>
                <div style={{ display: "flex", fontSize: 16, color: WHITE25 }}>
                  TOTAL
                </div>
              </div>
              <div style={valueStyle}>{padNum(payload.stats.commits)}</div>
              <div style={barContainerStyle}>
                {bars4.map((h, i) => (
                  <div
                    key={i}
                    style={{
                      display: "flex",
                      width: 8,
                      height: `${h}%`,
                      background:
                        i === 11 ? RED : `rgba(232, 90, 79, ${0.2 + i * 0.05})`,
                      borderRadius: 2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "28px 56px",
            borderTop: `1px solid ${BORDER}`,
            background: CARD_BG,
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 32,
              fontSize: 18,
            }}
          >
            <div style={{ display: "flex", color: WHITE40 }}>
              {`PEAK ${hourLabel(payload.timePatterns.peakHour)} ${dayName(payload.timePatterns.peakDay)}`}
            </div>
            <div style={{ display: "flex", color: WHITE40 }}>
              {`${payload.streaks.totalActiveDays} ACTIVE DAYS`}
            </div>
            <div style={{ display: "flex", color: WHITE40 }}>
              {`${payload.projectCount} PROJECTS`}
            </div>
          </div>
          <div style={{ display: "flex", fontSize: 16, color: WHITE25 }}>
            {`TOP: ${topTools}`}
          </div>
        </div>
      </div>
    ),
    {
      width: 2400,
      height: 1260,
      fonts: [
        { name: "Inter", data: fontRegular, weight: 400, style: "normal" },
        { name: "Inter", data: fontBold, weight: 700, style: "normal" },
      ],
      headers: {
        "Cache-Control": "public, max-age=3600, s-maxage=86400",
      },
    }
  );
}
