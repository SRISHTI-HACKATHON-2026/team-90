import { useState, useEffect, useRef } from "react";
import { TrendingDown, Home, AlertTriangle } from "lucide-react";

const GLASS_CARD = {
  background: "rgba(30,41,59,0.5)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
} as const;

const SHADOW_GOAL = { water: 5000, waste: 200, energy: 800 };
const CURRENT_USAGE = { water: 3800, waste: 140, energy: 610 };
const TOTAL_HOUSEHOLDS = 35;
const REPORTING_THRESHOLD = 0.9;

// Stable mock households (fixed seed via index)
const households = Array.from({ length: 35 }, (_, i) => ({
  id: `H${i + 1}`,
  reportingRate: i % 6 !== 0 ? 0.91 + (i % 10) * 0.009 : 0.6 + (i % 5) * 0.04,
  isWasting: i === 7,
}));

const savedWater = SHADOW_GOAL.water - CURRENT_USAGE.water;
const totalSavedBase = savedWater * 0.05;
const dividendPerHousehold = totalSavedBase / TOTAL_HOUSEHOLDS;
const eligibleCount = households.filter((h) => h.reportingRate >= REPORTING_THRESHOLD).length;
const wastingCount = households.filter((h) => h.isWasting).length;
const tensionScore = (wastingCount / TOTAL_HOUSEHOLDS) * 100;

function tensionColor(score: number): string {
  if (score < 30) return "#10B981";
  if (score <= 60) return "#F59E0B";
  return "#EF4444";
}

function tensionLabel(score: number): string {
  if (score < 30) return "All households cooperating — dividend accumulating";
  if (score <= 60) return "Some strain detected — monitor outliers";
  return "Dividend paused — intervention needed";
}

export function ResourceDividend() {
  const [totalDividend, setTotalDividend] = useState(totalSavedBase);
  const [paused, setPaused] = useState(tensionScore >= 50);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (tensionScore >= 50) {
      setPaused(true);
      return;
    }
    intervalRef.current = setInterval(() => {
      setTotalDividend((prev) => prev + 0.01);
    }, 3000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const tColor = tensionColor(tensionScore);

  return (
    <section className="space-y-3">
      {/* Row 1: Two cards */}
      <div className="grid grid-cols-2 gap-3">
        {/* Card 1: Community Dividend */}
        <div className="rounded-xl p-5" style={GLASS_CARD}>
          <div
            className="text-[9px] uppercase tracking-widest mb-3"
            style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.35)" }}
          >
            Estimated Community Dividend
          </div>
          <div
            className="text-4xl font-bold tabular-nums mb-3"
            style={{ fontFamily: "JetBrains Mono, monospace", color: "#10B981" }}
          >
            ₹{totalDividend.toFixed(2)}
          </div>
          <div className="flex items-center gap-2">
            <div
              className="w-2 h-2 rounded-full"
              style={{
                background: paused ? "#EF4444" : "#10B981",
                boxShadow: paused
                  ? "0 0 6px rgba(239,68,68,0.8)"
                  : "0 0 6px rgba(16,185,129,0.8)",
                animation: paused ? "none" : "pulse 1.5s ease-in-out infinite",
              }}
            />
            <span
              className="text-[10px] uppercase tracking-wider"
              style={{
                fontFamily: "JetBrains Mono, monospace",
                color: paused ? "#EF4444" : "#10B981",
              }}
            >
              {paused ? "paused — tension detected" : "accumulating"}
            </span>
          </div>
        </div>

        {/* Card 2: Per Household */}
        <div className="rounded-xl p-5" style={GLASS_CARD}>
          <div
            className="text-[9px] uppercase tracking-widest mb-3"
            style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.35)" }}
          >
            Dividend Per Household
          </div>
          <div
            className="text-4xl font-bold tabular-nums mb-3"
            style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.9)" }}
          >
            ₹{dividendPerHousehold.toFixed(2)}
          </div>
          <div className="flex items-center gap-1.5">
            <Home size={11} style={{ color: "rgba(255,255,255,0.3)" }} />
            <span
              className="text-[10px]"
              style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.4)" }}
            >
              eligible households:{" "}
              <span style={{ color: "#10B981" }}>{eligibleCount}</span> / {TOTAL_HOUSEHOLDS}
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Community Tension */}
      <div className="rounded-xl p-5" style={GLASS_CARD}>
        <div className="flex items-center justify-between mb-3">
          <div
            className="text-[9px] uppercase tracking-widest"
            style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.35)" }}
          >
            Community Tension
          </div>
          <div className="flex items-center gap-1.5">
            {tensionScore >= 30 && <AlertTriangle size={11} style={{ color: tColor }} />}
            <span
              className="text-[10px] tabular-nums font-semibold"
              style={{ fontFamily: "JetBrains Mono, monospace", color: tColor }}
            >
              {tensionScore.toFixed(1)}%
            </span>
          </div>
        </div>
        <div
          className="h-2.5 rounded-full w-full mb-3"
          style={{ background: "rgba(255,255,255,0.06)" }}
        >
          <div
            className="h-full rounded-full transition-all duration-700"
            style={{
              width: `${Math.min(tensionScore, 100)}%`,
              background: tColor,
              boxShadow: `0 0 8px ${tColor}88`,
            }}
          />
        </div>
        <div
          className="text-[10px]"
          style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.45)" }}
        >
          {tensionLabel(tensionScore)}
        </div>
      </div>

      {/* Row 3: Shadow Goal Progress */}
      <div className="rounded-xl p-5" style={GLASS_CARD}>
        <div
          className="text-[9px] uppercase tracking-widest mb-4"
          style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.35)" }}
        >
          Week 12 — Shadow Goal
        </div>
        <div className="space-y-4">
          {(["water", "waste", "energy"] as const).map((key) => {
            const used = CURRENT_USAGE[key];
            const goal = SHADOW_GOAL[key];
            const pct = Math.min((used / goal) * 100, 100);
            const underGoal = used < goal;
            const barColor = underGoal ? "#10B981" : "#EF4444";
            const units: Record<string, string> = { water: "L", waste: "kg", energy: "kWh" };
            return (
              <div key={key}>
                <div className="flex items-center justify-between mb-1.5">
                  <span
                    className="text-[10px] uppercase tracking-widest"
                    style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.5)" }}
                  >
                    {key}
                  </span>
                  <span
                    className="text-[11px] tabular-nums"
                    style={{ fontFamily: "JetBrains Mono, monospace", color: underGoal ? "#10B981" : "#EF4444" }}
                  >
                    {used.toLocaleString()} / {goal.toLocaleString()} {units[key]}
                  </span>
                </div>
                <div className="h-2 rounded-full" style={{ background: "rgba(255,255,255,0.06)" }}>
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${pct}%`,
                      background: barColor,
                      boxShadow: `0 0 6px ${barColor}66`,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Row 4: Household Reporting Status */}
      <div className="rounded-xl p-5" style={GLASS_CARD}>
        <div
          className="text-[9px] uppercase tracking-widest mb-4"
          style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.35)" }}
        >
          Household Reporting Status
        </div>
        <div className="flex flex-wrap gap-2">
          {households.map((h) => {
            const eligible = h.reportingRate >= REPORTING_THRESHOLD;
            const ratePct = (h.reportingRate * 100).toFixed(0);
            const tooltip = `${h.id} — ${ratePct}% reporting${h.isWasting ? " — WASTING" : ""}`;
            return (
              <div
                key={h.id}
                title={tooltip}
                className="w-9 h-9 rounded-md flex items-center justify-center cursor-default transition-transform hover:scale-110"
                style={
                  h.isWasting
                    ? {
                        background: "rgba(239,68,68,0.12)",
                        border: "1.5px solid #EF4444",
                        boxShadow: "0 0 8px rgba(239,68,68,0.5)",
                        animation: "pulse 1s ease-in-out infinite",
                      }
                    : eligible
                    ? {
                        background: "rgba(16,185,129,0.18)",
                        border: "1px solid rgba(16,185,129,0.45)",
                      }
                    : {
                        background:
                          "repeating-linear-gradient(45deg, rgba(100,116,139,0.18) 0px, rgba(100,116,139,0.18) 2px, transparent 2px, transparent 6px)",
                        border: "1px solid rgba(100,116,139,0.25)",
                      }
                }
              >
                <TrendingDown
                  size={11}
                  style={{
                    color: h.isWasting
                      ? "#EF4444"
                      : eligible
                      ? "#10B981"
                      : "rgba(100,116,139,0.5)",
                  }}
                />
              </div>
            );
          })}
        </div>
        <div className="flex items-center gap-5 mt-4 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(16,185,129,0.18)", border: "1px solid rgba(16,185,129,0.45)" }} />
            <span className="text-[9px] uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.35)" }}>Reporting ≥ 90%</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "repeating-linear-gradient(45deg, rgba(100,116,139,0.18) 0px, rgba(100,116,139,0.18) 2px, transparent 2px, transparent 6px)", border: "1px solid rgba(100,116,139,0.25)" }} />
            <span className="text-[9px] uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.35)" }}>Below threshold</span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-3 h-3 rounded-sm" style={{ background: "rgba(239,68,68,0.12)", border: "1.5px solid #EF4444" }} />
            <span className="text-[9px] uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.35)" }}>Wasting detected</span>
          </div>
        </div>
      </div>
    </section>
  );
}

