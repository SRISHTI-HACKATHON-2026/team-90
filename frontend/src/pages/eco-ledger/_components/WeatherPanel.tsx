import type { Trend, WeatherSymbol } from "../../../lib/mockData.ts";

const ICONS: Record<WeatherSymbol, string> = { sun: "☀", cloud: "⛅", storm: "⛈" };

type Props = { history: WeatherSymbol[]; trend: Trend; streak: number };

export default function WeatherPanel({ history, trend, streak }: Props) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      padding: "0 44px",
      gap: 20,
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
    }}>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.55rem",
          fontWeight: 700,
          letterSpacing: "0.3em",
          color: "#3a3a3a",
        }}>
          LAST 5 DAYS
        </span>
        <div style={{ display: "flex", gap: 14 }}>
          {history.map((h, i) => (
            <span key={i} style={{ fontSize: "1.5rem", opacity: i === history.length - 1 ? 1 : 0.35 }}>
              {ICONS[h]}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.55rem",
          fontWeight: 700,
          letterSpacing: "0.3em",
          color: "#3a3a3a",
        }}>
          TREND
        </span>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.9rem",
          fontWeight: 700,
          letterSpacing: "0.08em",
          color: trend === "up" ? "#00E676" : "#FF4B4B",
        }}>
          {trend === "up" ? "▲ IMPROVING" : "▼ DECLINING"}
        </span>
      </div>

      {streak >= 2 && (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ fontSize: "1rem" }}>🔥</span>
          <span style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "0.75rem",
            fontWeight: 700,
            letterSpacing: "0.1em",
            color: "#00E676",
          }}>
            {streak} DAY STREAK
          </span>
        </div>
      )}
    </div>
  );
}
