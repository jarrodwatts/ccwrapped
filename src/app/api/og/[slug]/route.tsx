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
  return key
    .split("_")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function formatMinutes(minutes: number): string {
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours > 0) {
    return `${hours}h ${mins.toString().padStart(2, "0")}m`;
  }
  return `${mins}m`;
}

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

const COLORS = {
  bg: "#050505",
  surface: "#0A0A0A",
  line: "rgba(255, 255, 255, 0.08)",
  border: "rgba(255, 255, 255, 0.10)",
  primary: "#E85A4F",
  primaryGlow: "rgba(232, 90, 79, 0.15)",
  text: "#FAFAFA",
  textSecondary: "#999999",
  textTertiary: "#666666",
  textMuted: "#444444",
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

  const goalEntries = Object.entries(payload.goals || {});
  const totalGoals = goalEntries.reduce((acc, [, count]) => acc + count, 0);
  const topGoals = goalEntries
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([name, count], i) => ({
      name: formatGoal(name),
      count,
      percent: totalGoals > 0 ? (count / totalGoals) * 100 : 0,
      isTop: i === 0,
    }));

  if (topGoals.length === 0) {
    topGoals.push({ name: "Coding", count: 100, percent: 100, isTop: true });
  }

  const hourDist = payload.timePatterns.hourDistribution;
  const dayDist = payload.timePatterns.dayOfWeekDistribution;

  const peakHourEntry = Object.entries(hourDist).sort(
    ([, a], [, b]) => b - a
  )[0];
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

  const getHeatColor = (value: number, isPeak: boolean): string => {
    if (isPeak) return COLORS.primary;
    if (value === 0) return COLORS.gray5;
    const intensity = Math.floor(value * 5);
    const shades = [
      "#2a1512", // very dark red
      "#3d1f1b", // dark red
      "#5c2e28", // muted red
      "#7a3d35", // medium red
      "#9a4d42", // lighter red
      "#b85a4f", // near primary
    ];
    return shades[Math.min(intensity, shades.length - 1)];
  };

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

  const BracketLabel = ({ children }: { children: string }) => (
    <div
      style={{
        display: "flex",
        fontFamily: "JetBrains Mono",
        fontSize: 14,
        letterSpacing: "0.15em",
        color: COLORS.textSecondary,
      }}
    >
      <span style={{ color: COLORS.textTertiary }}>[ </span>
      {children}
      <span style={{ color: COLORS.textTertiary }}> ]</span>
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
          padding: "24px 32px",
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

        {/* Subtle glow */}
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

        {/* Header - 60px */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            height: 60,
            paddingBottom: 12,
            borderBottom: `1px solid ${COLORS.line}`,
            position: "relative",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
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
              <span>
                ║<span style={{ color: COLORS.primary }}>W</span>║
              </span>
              <span style={{ color: COLORS.primary }}>╚═╝</span>
            </div>
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

        {/* Stats Row - 6 equal cells */}
        <div
          style={{
            display: "flex",
            height: 180,
            marginTop: 16,
            border: `1px solid ${COLORS.line}`,
            position: "relative",
          }}
        >
          <Corner position="tl" />
          <Corner position="tr" />
          <Corner position="bl" />
          <Corner position="br" />
          {[
            { label: "HOURS", value: Math.round(payload.stats.hours).toLocaleString(), isHero: true },
            { label: "SESSIONS", value: formatNum(payload.stats.sessions), isHero: false },
            { label: "MESSAGES", value: formatNum(payload.stats.messages), isHero: false },
            { label: "COMMITS", value: formatNum(payload.stats.commits), isHero: false },
            { label: "DAYS", value: formatNum(payload.stats.days), isHero: false },
            { label: "STREAK", value: String(payload.streaks.longest), isHero: false },
          ].map((stat, i) => (
            <div
              key={stat.label}
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                padding: "24px 20px",
                justifyContent: "center",
                alignItems: "center",
                borderRight: i < 5 ? `1px solid ${COLORS.line}` : "none",
                background: stat.isHero ? `radial-gradient(ellipse at center, ${COLORS.primaryGlow}, transparent)` : "transparent",
              }}
            >
              <div
                style={{
                  display: "flex",
                  fontFamily: "JetBrains Mono",
                  fontSize: 14,
                  letterSpacing: "0.15em",
                  color: COLORS.textMuted,
                }}
              >
                {stat.label}
              </div>
              <div
                style={{
                  display: "flex",
                  fontFamily: "JetBrains Mono",
                  fontSize: stat.isHero ? 72 : 48,
                  fontWeight: 700,
                  color: stat.isHero ? COLORS.primary : COLORS.text,
                  marginTop: 8,
                  lineHeight: 1,
                }}
              >
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Main Content - Two columns */}
        <div style={{ display: "flex", flex: 1, gap: 16, marginTop: 16 }}>
          {/* Left Column - Archetype, Focus, Activity stacked */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 16,
            }}
          >
            {/* Archetype Card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: `1px solid ${COLORS.line}`,
                padding: 24,
                position: "relative",
              }}
            >
              <Corner position="tl" />
              <Corner position="br" />

              <BracketLabel>ARCHETYPE</BracketLabel>

              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 20,
                  marginTop: 16,
                }}
              >
                <div style={{ display: "flex", fontSize: 56 }}>{def.emoji}</div>
                <div
                  style={{ display: "flex", flexDirection: "column", gap: 6 }}
                >
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
                      fontSize: 15,
                      color: COLORS.textSecondary,
                    }}
                  >
                    {def.shortDescription}
                  </div>
                </div>
              </div>
            </div>

            {/* Focus Card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: `1px solid ${COLORS.line}`,
                padding: 24,
                position: "relative",
              }}
            >
              <Corner position="tl" />
              <Corner position="br" />

              <BracketLabel>FOCUS</BracketLabel>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  marginTop: 16,
                }}
              >
                {topGoals.map((goal) => (
                  <div
                    key={goal.name}
                    style={{ display: "flex", alignItems: "center", gap: 16 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: 100,
                        fontFamily: "JetBrains Mono",
                        fontSize: 14,
                        color: COLORS.textTertiary,
                      }}
                    >
                      {goal.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: 1,
                        height: 22,
                        background: COLORS.gray5,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: `${Math.max(goal.percent, 2)}%`,
                          height: "100%",
                          background: goal.isTop
                            ? COLORS.primary
                            : COLORS.gray7,
                        }}
                      />
                    </div>
                    <div
                      style={{
                        display: "flex",
                        width: 50,
                        fontFamily: "JetBrains Mono",
                        fontSize: 14,
                        color: goal.isTop
                          ? COLORS.primary
                          : COLORS.textTertiary,
                        justifyContent: "flex-end",
                      }}
                    >
                      {Math.round(goal.percent)}%
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity Card - Takes remaining space */}
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

              <BracketLabel>WHEN YOU CODE</BracketLabel>

              {/* Hour distribution */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  marginTop: 16,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "JetBrains Mono",
                    fontSize: 14,
                    color: COLORS.textSecondary,
                  }}
                >
                  <span>BY HOUR</span>
                  <span>
                    peak:{" "}
                    <span style={{ color: COLORS.primary }}>{peakTimeStr}</span>
                  </span>
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 3,
                    height: 56,
                    border: `1px solid ${COLORS.line}`,
                    padding: 6,
                  }}
                >
                  {hourlyData.map((h, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        flex: 1,
                        height: "100%",
                        background: getHeatColor(h.value, h.isPeak),
                      }}
                    />
                  ))}
                </div>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "JetBrains Mono",
                    fontSize: 12,
                    color: COLORS.textMuted,
                  }}
                >
                  <span>00</span>
                  <span>12</span>
                  <span>24</span>
                </div>
              </div>

              {/* Divider */}
              <div
                style={{
                  display: "flex",
                  height: 1,
                  background: COLORS.line,
                  marginTop: 20,
                  marginBottom: 20,
                }}
              />

              {/* Day distribution */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 8,
                  flex: 1,
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontFamily: "JetBrains Mono",
                    fontSize: 14,
                    color: COLORS.textSecondary,
                  }}
                >
                  <span>BY DAY</span>
                  <span>
                    peak:{" "}
                    <span style={{ color: COLORS.primary }}>{peakDayStr}</span>
                  </span>
                </div>
                <div style={{ display: "flex", gap: 10, flex: 1 }}>
                  {dailyData.map((d, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        flex: 1,
                        gap: 8,
                        alignItems: "center",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          width: "100%",
                          flex: 1,
                          background: COLORS.gray5,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            width: "100%",
                            height: `${Math.max(d.value * 100, 10)}%`,
                            background: getHeatColor(d.value, d.isPeak),
                            alignSelf: "flex-end",
                          }}
                        />
                      </div>
                      <div
                        style={{
                          display: "flex",
                          fontFamily: "JetBrains Mono",
                          fontSize: 14,
                          color: d.isPeak ? COLORS.primary : COLORS.textMuted,
                        }}
                      >
                        {daysShort[i].charAt(0)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Tools + Highlights stacked */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              gap: 16,
            }}
          >
            {/* Tools Card */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                border: `1px solid ${COLORS.line}`,
                padding: 24,
                position: "relative",
              }}
            >
              <Corner position="tl" />
              <Corner position="tr" />
              <Corner position="bl" />
              <Corner position="br" />

              <BracketLabel>TOOLS</BracketLabel>

              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 14,
                  marginTop: 16,
                }}
              >
                {topTools.map((tool) => (
                  <div
                    key={tool.name}
                    style={{ display: "flex", alignItems: "center", gap: 16 }}
                  >
                    <div
                      style={{
                        display: "flex",
                        width: 130,
                        fontFamily: "JetBrains Mono",
                        fontSize: 16,
                        color: tool.isTop ? COLORS.primary : COLORS.textTertiary,
                      }}
                    >
                      {tool.name}
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flex: 1,
                        height: 24,
                        background: COLORS.gray5,
                      }}
                    >
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
                        width: 80,
                        fontFamily: "JetBrains Mono",
                        fontSize: 16,
                        color: tool.isTop ? COLORS.primary : COLORS.textMuted,
                        justifyContent: "flex-end",
                      }}
                    >
                      {formatNum(tool.count)}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Highlights Card - 3x3 Grid */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                border: `1px solid ${COLORS.line}`,
                position: "relative",
              }}
            >
              <Corner position="tl" />
              <Corner position="tr" />
              <Corner position="bl" />
              <Corner position="br" />

              {[
                [
                  { label: "BUSIEST DAY", value: formatDate(payload.highlights.busiestDay), sub: `${formatNum(payload.highlights.busiestDayMessages)} msgs` },
                  { label: "MARATHON", value: formatMinutes(payload.highlights.longestSessionMinutes), sub: "longest session" },
                  { label: "PROJECTS", value: String(payload.projectCount), sub: "worked on" },
                ],
                [
                  { label: "LINES CHANGED", value: formatNum(payload.stats.linesChanged), sub: "total edits" },
                  { label: "TOP TOOL", value: payload.highlights.topToolName, sub: `${formatNum(payload.highlights.topToolCount)} uses` },
                  { label: "RARE TOOL", value: payload.highlights.rarestTool, sub: "least used" },
                ],
                [
                  { label: "FIRST SESSION", value: formatDate(payload.highlights.firstSessionDate), sub: "started coding" },
                  { label: "ACTIVE DAYS", value: String(payload.streaks.totalActiveDays), sub: "total days" },
                  { label: "CURRENT STREAK", value: String(payload.streaks.current), sub: "days active" },
                ],
              ].map((row, rowIdx) => (
                <div
                  key={rowIdx}
                  style={{
                    display: "flex",
                    flex: 1,
                    borderTop: rowIdx > 0 ? `1px solid ${COLORS.line}` : "none",
                  }}
                >
                  {row.map((highlight, colIdx) => (
                    <div
                      key={highlight.label}
                      style={{
                        display: "flex",
                        flex: 1,
                        flexDirection: "column",
                        padding: 28,
                        justifyContent: "center",
                        borderLeft: colIdx > 0 ? `1px solid ${COLORS.line}` : "none",
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          fontFamily: "JetBrains Mono",
                          fontSize: 16,
                          color: COLORS.textSecondary,
                          letterSpacing: "0.12em",
                        }}
                      >
                        {highlight.label}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          fontFamily: "JetBrains Mono",
                          fontSize: 42,
                          fontWeight: 700,
                          color: COLORS.text,
                          marginTop: 12,
                          wordBreak: "break-word",
                          lineHeight: 1.1,
                        }}
                      >
                        {highlight.value}
                      </div>
                      <div
                        style={{
                          display: "flex",
                          fontFamily: "JetBrains Mono",
                          fontSize: 16,
                          color: COLORS.textTertiary,
                          marginTop: 8,
                        }}
                      >
                        {highlight.sub}
                      </div>
                    </div>
                  ))}
                </div>
              ))}
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
