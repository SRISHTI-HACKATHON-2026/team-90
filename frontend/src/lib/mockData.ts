export type ResourceLevel = "high" | "medium" | "low";
export type SystemStatus  = "green" | "yellow" | "red";
export type ResourceKey   = "water" | "waste" | "energy";
export type WeatherSymbol = "sun" | "cloud" | "storm";
export type Trend         = "up" | "down";

export type LogEntry = {
  text: string;
  verifiedBy: string;
  timeAgo: string;
};

export type MockData = {
  water: ResourceLevel;
  waste: ResourceLevel;
  energy: ResourceLevel;
  status: SystemStatus;
  worst: ResourceKey;
  trend: Trend;
  history: WeatherSymbol[];
  streak: number;
  isOnline: boolean;
  log: LogEntry;
};

function randomLevel(): ResourceLevel {
  const r = Math.random();
  if (r < 0.33) return "low";
  if (r < 0.66) return "medium";
  return "high";
}

function randomWeather(): WeatherSymbol {
  const r = Math.random();
  if (r < 0.5) return "sun";
  if (r < 0.75) return "cloud";
  return "storm";
}

function computeStatus(w: ResourceLevel, wa: ResourceLevel, e: ResourceLevel): SystemStatus {
  const high = [w, wa, e].filter(l => l === "high").length;
  const med  = [w, wa, e].filter(l => l === "medium").length;
  if (high >= 2) return "red";
  if (high === 1 || med >= 2) return "yellow";
  return "green";
}

function computeWorst(w: ResourceLevel, wa: ResourceLevel, e: ResourceLevel): ResourceKey {
  const score: Record<ResourceLevel, number> = { high: 3, medium: 2, low: 1 };
  const entries: [ResourceKey, number][] = [
    ["water",  score[w]],
    ["waste",  score[wa]],
    ["energy", score[e]],
  ];
  return entries.sort((a, b) => b[1] - a[1])[0][0];
}

function computeStreak(history: WeatherSymbol[]): number {
  let s = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i] === "sun") s++; else break;
  }
  return s;
}

const LOG_POOL: LogEntry[] = [
  { text: "+3 Bags collected",  verifiedBy: "Capt. Musa",   timeAgo: "2 min ago" },
  { text: "Tap sealed — sector 4", verifiedBy: "Mrs. Akinyi", timeAgo: "5 min ago" },
  { text: "Generator off",      verifiedBy: "Elder Kofi",   timeAgo: "8 min ago" },
  { text: "+5 Bags cleared",    verifiedBy: "Capt. Musa",   timeAgo: "12 min ago" },
  { text: "Solar panel cleaned",verifiedBy: "Tech. Amara",  timeAgo: "15 min ago" },
];

export function getMockData(): MockData {
  const water  = randomLevel();
  const waste  = randomLevel();
  const energy = randomLevel();
  const status  = computeStatus(water, waste, energy);
  const worst   = computeWorst(water, waste, energy);
  const trend: Trend = Math.random() > 0.5 ? "up" : "down";
  const history: WeatherSymbol[] = Array.from({ length: 5 }, randomWeather);
  const streak  = computeStreak(history);
  const isOnline = Math.random() > 0.15;
  const log = LOG_POOL[Math.floor(Math.random() * LOG_POOL.length)];
  return { water, waste, energy, status, worst, trend, history, streak, isOnline, log };
}

