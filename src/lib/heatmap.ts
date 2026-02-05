export interface HeatmapDay {
  date: string;
  count: number;
}

export function buildHeatmap(
  dailyActivity: Record<string, number>,
  weeks: number = 52
): HeatmapDay[] {
  const today = new Date();
  const totalDays = weeks * 7;
  const days: HeatmapDay[] = [];

  for (let i = totalDays - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    const key = date.toISOString().slice(0, 10);
    days.push({ date: key, count: dailyActivity[key] ?? 0 });
  }

  return days;
}

export function getIntensityLevel(
  count: number,
  maxCount: number
): 0 | 1 | 2 | 3 | 4 {
  if (count === 0) return 0;
  if (maxCount === 0) return 1;
  const ratio = count / maxCount;
  if (ratio > 0.75) return 4;
  if (ratio > 0.5) return 3;
  if (ratio > 0.25) return 2;
  return 1;
}
