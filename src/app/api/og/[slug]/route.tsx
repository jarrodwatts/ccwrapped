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

const jetBrainsMono = fetch(
  "https://fonts.gstatic.com/l/font?kit=tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOT&skey=48ad01c60053c2ae&v=v24"
).then((res) => res.arrayBuffer());

function formatNum(n: number): string {
  if (typeof n !== "number" || isNaN(n)) return "0";
  if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
  if (n >= 1000) return `${(n / 1000).toFixed(1)}K`;
  return n.toLocaleString("en-US");
}

function formatGoal(key: string): string {
  return key.split("_").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" ");
}

/**
 * Terminal Aesthetic Color System
 * Monochrome base with coral accents for key highlights only
 */
const COLORS = {
  bg: "#050505",
  surface: "#0A0A0A",
  line: "rgba(255, 255, 255, 0.08)",
  border: "rgba(255, 255, 255, 0.10)",
  // Coral - use sparingly
  primary: "#E85A4F",
  primaryGlow: "rgba(232, 90, 79, 0.15)",
  // Text hierarchy
  text: "#FAFAFA",
  textSecondary: "#999999",
  textTertiary: "#666666",
  textMuted: "#444444",
  // Grays for bars
  gray5: "#222222",
  gray7: "#333333",
  gray9: "#555555",
};

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> }
): Promise<Response> {
  const [fontRegular, fontBold, fontMono] = await Promise.all([
    interRegular,
    interBold,
    jetBrainsMono,
  ]);

  const { slug } = await params;
  const stored = await getWrapped(slug);

  if (!stored) {
    return new Response("Not found", { status: 404 });
  }

  const { payload } = stored;
  const def = ARCHETYPE_DEFINITIONS[payload.archetype];

  // Process Tools
  const toolEntries = Object.entries(payload.tools);
  const totalToolUsage = toolEntries.reduce((acc, [, count]) => acc + count, 0);
  const topTools = toolEntries
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([name, count], i) => ({
      name,
      count,
      percent: totalToolUsage > 0 ? (count / totalToolUsage) * 100 : 0,
      isTop: i === 0,
    }));

  // Process Goals
  const goalEntries = Object.entries(payload.goals || {});
  const totalGoals = goalEntries.reduce((acc, [, count]) => acc + count, 0);
  const topGoals = goalEntries
    .sort(([, a], [, b]) => b - a)
    .slice(0, 4)
    .map(([name, count], i) => ({
      name: formatGoal(name),
      count,
      percent: totalGoals > 0 ? (count / totalGoals) * 100 : 0,
      isTop: i === 0,
    }));

  if (topGoals.length === 0) {
    topGoals.push({ name: "Coding", count: 100, percent: 100, isTop: true });
  }

  // Activity Processing
  const hourDist = payload.timePatterns.hourDistribution;
  const dayDist = payload.timePatterns.dayOfWeekDistribution;

  const peakHourEntry = Object.entries(hourDist).sort(([, a], [, b]) => b - a)[0];
  const peakHour = parseInt(peakHourEntry?.[0] ?? "0");
  const peakDayEntry = Object.entries(dayDist).sort(([, a], [, b]) => b - a)[0];
  const peakDayIdx = parseInt(peakDayEntry?.[0] ?? "0");
  const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const peakTimeStr = `${peakHour.toString().padStart(2, "0")}:00`;
  const peakDayStr = daysShort[peakDayIdx];

  const maxHour = Math.max(...Object.values(hourDist), 1);
  const hourlyData = Array.from({ length: 24 }, (_, i) => ({
    value: (hourDist[String(i)] ?? 0) / maxHour,
    isPeak: i === peakHour,
  }));
  const maxDay = Math.max(...Object.values(dayDist), 1);
  const dailyData = Array.from({ length: 7 }, (_, i) => ({
    value: (dayDist[String(i)] ?? 0) / maxDay,
    isPeak: i === peakDayIdx,
  }));

  // Corner marker component
  const Corner = ({ position }: { position: string }) => (
    <div
      style={{
        display: "flex",
        position: "absolute",
        fontFamily: "JetBrains Mono",
        fontSize: 14,
        color: COLORS.textMuted,
        ...({
          tl: { top: -8, left: -8 },
          tr: { top: -8, right: -8 },
          bl: { bottom: -8, left: -8 },
          br: { bottom: -8, right: -8 },
        }[position] || {}),
      }}
    >
      +
    </div>
  );

  // Bracket label component
  const BracketLabel = ({ children }: { children: string }) => (
    <div
      style={{
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontSize: 12,
        letterSpacing: "0.15em",
        color: COLORS.textTertiary,
      }}
    >
      <span style={{ color: COLORS.textMuted }}>[ </span>
      {children}
      <span style={{ color: COLORS.textMuted }}> ]</span>
    </div>
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          backgroundColor: COLORS.bg,
          fontFamily: "Inter",
          padding: "48px",
          color: COLORS.text,
          position: "relative",
        }}
      >
        {/* Grid pattern background */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `linear-gradient(${COLORS.line} 1px, transparent 1px), linear-gradient(90deg, ${COLORS.line} 1px, transparent 1px)`,
            backgroundSize: "48px 48px",
            opacity: 0.5,
          }}
        />

        {/* Subtle glow - radial gradient for Satori compatibility */}
        <div
          style={{
            display: "flex",
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 400,
            background: `radial-gradient(ellipse 800px 400px at 50% 0%, ${COLORS.primaryGlow}, transparent)`,
          }}
        />

        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 32,
            paddingBottom: 24,
            borderBottom: `1px solid ${COLORS.line}`,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            {/* ASCII Logo */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                fontFamily: "JetBrains Mono",
                fontSize: 10,
                lineHeight: 1.1,
                color: COLORS.textTertiary,
              }}
            >
              <span style={{ color: COLORS.primary }}>╔═╗</span>
              <span>║<span style={{ color: COLORS.primary }}>W</span>║</span>
              <span style={{ color: COLORS.primary }}>╚═╝</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              <div
                style={{
                  display: "flex",
                  fontFamily: "JetBrains Mono",
                  fontSize: 14,
                  letterSpacing: "0.1em",
                  color: COLORS.textSecondary,
                }}
              >
                CLAUDE CODE WRAPPED
              </div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              fontFamily: "JetBrains Mono",
              fontSize: 12,
              color: COLORS.textMuted,
            }}
          >
            ccwrapped.com
          </div>
        </div>

        {/* Main Content */}
        <div style={{ display: "flex", flex: 1, gap: 32 }}>
          {/* Left Column: Identity */}
          <div style={{ display: "flex", flexDirection: "column", width: 440, gap: 24 }}>
            {/* Archetype Card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                border: `1px solid ${COLORS.line}`,
                padding: 32,
                position: "relative",
              }}
            >
              <Corner position="tl" />
              <Corner position="tr" />
              <Corner position="bl" />
              <Corner position="br" />

              <BracketLabel>ARCHETYPE</BracketLabel>

              <div style={{ display: "flex", alignItems: "center", gap: 20, marginTop: 24 }}>
                <div style={{ display: "flex", fontSize: 56 }}>{def.emoji}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div
                    style={{
                      display: "flex",
                      fontSize: 28,
                      fontWeight: 700,
                      color: COLORS.primary,
                    }}
                  >
                    {def.name}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      fontSize: 14,
                      color: COLORS.textSecondary,
                    }}
                  >
                    {def.shortDescription}
                  </div>
                </div>
              </div>

              {/* Focus Areas */}
              <div style={{ display: "flex", flexDirection: "column", marginTop: 32, gap: 12 }}>
                <BracketLabel>FOCUS</BracketLabel>
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 8 }}>
                  {topGoals.map((goal) => (
                    <div key={goal.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          width: 90,
                          fontFamily: "JetBrains Mono",
                          fontSize: 12,
                          color: COLORS.textTertiary,
                        }}
                      >
                        {goal.name}
                      </div>
                      <div style={{ display: "flex", flex: 1, height: 20, background: COLORS.gray5 }}>
                        <div
                          style={{
                            display: "flex",
                            width: `${Math.max(goal.percent, 2)}%`,
                            height: "100%",
                            background: goal.isTop ? COLORS.primary : COLORS.gray7,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: 40,
                          fontFamily: "JetBrains Mono",
                          fontSize: 12,
                          color: goal.isTop ? COLORS.primary : COLORS.textTertiary,
                          justifyContent: "flex-end",
                        }}
                      >
                        {Math.round(goal.percent)}%
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Streak Card */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                border: `1px solid ${COLORS.line}`,
                padding: "20px 24px",
                position: "relative",
              }}
            >
              <Corner position="tl" />
              <Corner position="br" />
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: 24 }}>🔥</span>
                <BracketLabel>STREAK</BracketLabel>
              </div>
              <div style={{ display: "flex", alignItems: "baseline", gap: 8 }}>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "JetBrains Mono",
                    fontSize: 36,
                    fontWeight: 700,
                    color: COLORS.primary,
                  }}
                >
                  {payload.streaks.longest}
                </div>
                <div
                  style={{
                    display: "flex",
                    fontFamily: "JetBrains Mono",
                    fontSize: 14,
                    color: COLORS.textMuted,
                  }}
                >
                  days
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Stats & Data */}
          <div style={{ display: "flex", flexDirection: "column", flex: 1, gap: 24 }}>
            {/* Stats Grid */}
            <div style={{ display: "flex", gap: 0, border: `1px solid ${COLORS.line}`, position: "relative" }}>
              <Corner position="tl" />
              <Corner position="tr" />
              <Corner position="bl" />
              <Corner position="br" />
              {[
                { label: "SESSIONS", value: formatNum(payload.stats.sessions), highlight: true },
                { label: "MESSAGES", value: formatNum(payload.stats.messages), highlight: false },
                { label: "HOURS", value: Math.round(payload.stats.hours).toLocaleString(), highlight: false },
                { label: "COMMITS", value: formatNum(payload.stats.commits), highlight: false },
              ].map((stat, i) => (
                <div
                  key={stat.label}
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    flex: 1,
                    padding: 24,
                    gap: 8,
                    borderLeft: i > 0 ? `1px solid ${COLORS.line}` : "none",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      fontFamily: "JetBrains Mono",
                      fontSize: 10,
                      letterSpacing: "0.1em",
                      color: COLORS.textMuted,
                    }}
                  >
                    {stat.label}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      fontFamily: "JetBrains Mono",
                      fontSize: 36,
                      fontWeight: 700,
                      color: stat.highlight ? COLORS.primary : COLORS.text,
                    }}
                  >
                    {stat.value}
                  </div>
                </div>
              ))}
            </div>

            {/* Activity & Tools Row */}
            <div style={{ display: "flex", flex: 1, gap: 24 }}>
              {/* Activity Patterns */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  border: `1px solid ${COLORS.line}`,
                  padding: 24,
                  position: "relative",
                }}
              >
                <Corner position="tl" />
                <Corner position="br" />

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                  <BracketLabel>WHEN YOU CODE</BracketLabel>
                  <div
                    style={{
                      display: "flex",
                      fontFamily: "JetBrains Mono",
                      fontSize: 12,
                      color: COLORS.textTertiary,
                    }}
                  >
                    peak:{" "}
                    <span style={{ color: COLORS.primary, marginLeft: 4 }}>
                      {peakTimeStr} {peakDayStr}
                    </span>
                  </div>
                </div>

                {/* Hour distribution */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
                  <div
                    style={{
                      display: "flex",
                      fontFamily: "JetBrains Mono",
                      fontSize: 10,
                      color: COLORS.textMuted,
                    }}
                  >
                    BY HOUR
                  </div>
                  <div style={{ display: "flex", gap: 2, height: 32, border: `1px solid ${COLORS.line}`, padding: 4 }}>
                    {hourlyData.map((h, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          flex: 1,
                          height: "100%",
                          background: h.isPeak ? COLORS.primary : COLORS.gray7,
                          opacity: Math.max(h.value, 0.15),
                        }}
                      />
                    ))}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      fontFamily: "JetBrains Mono",
                      fontSize: 10,
                      color: COLORS.textMuted,
                    }}
                  >
                    <span>00</span>
                    <span>06</span>
                    <span>12</span>
                    <span>18</span>
                    <span>24</span>
                  </div>
                </div>

                {/* Day distribution */}
                <div style={{ display: "flex", flexDirection: "column", gap: 8, flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      fontFamily: "JetBrains Mono",
                      fontSize: 10,
                      color: COLORS.textMuted,
                    }}
                  >
                    BY DAY
                  </div>
                  <div style={{ display: "flex", gap: 8, flex: 1, alignItems: "flex-end" }}>
                    {dailyData.map((d, i) => (
                      <div
                        key={i}
                        style={{
                          display: "flex",
                          flexDirection: "column",
                          flex: 1,
                          height: "100%",
                          gap: 6,
                          alignItems: "center",
                          justifyContent: "flex-end",
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            height: `${Math.max(d.value * 100, 10)}%`,
                            background: d.isPeak ? COLORS.primary : COLORS.gray7,
                          }}
                        />
                        <div
                          style={{
                            display: "flex",
                            fontFamily: "JetBrains Mono",
                            fontSize: 10,
                            color: d.isPeak ? COLORS.primary : COLORS.textMuted,
                          }}
                        >
                          {daysShort[i]}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Tools */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  flex: 1,
                  border: `1px solid ${COLORS.line}`,
                  padding: 24,
                  position: "relative",
                }}
              >
                <Corner position="tl" />
                <Corner position="br" />

                <BracketLabel>TOOLS</BracketLabel>

                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16, flex: 1 }}>
                  {topTools.map((tool) => (
                    <div key={tool.name} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          width: 80,
                          fontFamily: "JetBrains Mono",
                          fontSize: 12,
                          color: COLORS.textTertiary,
                        }}
                      >
                        {tool.name}
                      </div>
                      <div style={{ display: "flex", flex: 1, height: 20, background: COLORS.gray5 }}>
                        <div
                          style={{
                            display: "flex",
                            width: `${Math.max(tool.percent, 2)}%`,
                            height: "100%",
                            background: tool.isTop ? COLORS.primary : COLORS.gray7,
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          width: 50,
                          fontFamily: "JetBrains Mono",
                          fontSize: 12,
                          color: tool.isTop ? COLORS.primary : COLORS.textMuted,
                          justifyContent: "flex-end",
                        }}
                      >
                        {formatNum(tool.count)}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Comment annotation */}
                <div
                  style={{
                    display: "flex",
                    fontFamily: "JetBrains Mono",
                    fontSize: 11,
                    color: COLORS.textMuted,
                    fontStyle: "italic",
                    marginTop: 12,
                  }}
                >
                  // {toolEntries.length} tools mastered
                </div>
              </div>
            </div>
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
        { name: "JetBrains Mono", data: fontMono, weight: 400, style: "normal" },
      ],
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    }
  );
}