import { useEffect, useRef, useState } from "react";
import { PieChart, Pie, Cell, ResponsiveContainer } from "recharts";
import { TrendingUp, TrendingDown, Droplets, Trash2, Zap, Signal } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import type { StatusData } from "../page.tsx";

function deriveAnalytics(d: StatusData | null) {
  const water = d?.water ?? 0;
  const waste = d?.waste ?? 0;
  const energy = d?.energy ?? 0;

  // Calculate resource score as average of normalized values
  const resourceScore = (water + waste + energy) / 3;

  // Mock participation and stability (temporary, not derived from backend)
  const participation = 80; // % of active houses
  const stability = 90;     // system stability / anomaly score

  // Weighted CIU formula: 50% resource, 30% participation, 20% stability
  const ciu = Math.round(
    (resourceScore * 0.5) + (participation * 0.3) + (stability * 0.2)
  );

  // Normalize CIU to 0-100 gauge range
  const ciuEfficiency = Math.min(Math.max(ciu, 0), 100);

  return {
    ciuEfficiency,
    ciuDelta: d?.trend === "up" ? 12 : -5,
    confidenceScore: d ? 91 : 0,
    resources: {
      water: {
        label: "Water", value: water, unit: water > 100 ? "Over Quota" : "Usage",
        icon: Droplets, color: water > 100 ? "#EF4444" : "#10B981",
        status: water > 100 ? "warn" : "ok",
        financialNote: water > 100 ? `Over by ${water - 100}` : `${water} total`,
      },
      waste: {
        label: "Waste", value: waste, unit: waste > 100 ? "Over Collection Goal" : "Usage",
        icon: Trash2, color: waste > 100 ? "#EF4444" : "#10B981",
        status: waste > 100 ? "warn" : "ok",
        financialNote: waste > 100 ? `Over by ${waste - 100}` : `${waste} total`,
      },
      energy: {
        label: "Energy", value: energy, unit: energy > 100 ? "Over Grid Capacity" : "Grid Stability",
        icon: Zap, color: energy > 100 ? "#EF4444" : "#10B981",
        status: energy > 100 ? "warn" : "ok",
        financialNote: energy > 100 ? `Over by ${energy - 100}` : `${energy} total`,
      },
    },
    sensorReliability: { reportingRate: d ? 94 : 0, activeCaptains: d ? 47 : 0, totalCaptains: 50 },
  };
}

function useCountUp(target: number, duration = 1200) {
  const [val, setVal] = useState(0);
  const frame = useRef<number | null>(null);
  useEffect(() => {
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.round(eased * target));
      if (progress < 1) frame.current = requestAnimationFrame(tick);
    };
    frame.current = requestAnimationFrame(tick);
    return () => { if (frame.current !== null) cancelAnimationFrame(frame.current); };
  }, [target, duration]);
  return val;
}

function CIUGauge({ score, delta, confidence }: { score: number; delta: number; confidence: number }) {
  const displayed = useCountUp(score);
  const filled = score;
  const empty = 100 - filled;
  const isPositive = delta >= 0;
  const arcColor = score >= 80 ? "#10B981" : score >= 60 ? "#F59E0B" : "#EF4444";
  const glowColor = score >= 80 ? "rgba(16,185,129,0.35)" : score >= 60 ? "rgba(245,158,11,0.35)" : "rgba(239,68,68,0.5)";
  const breathDuration = score < 60 ? "1.2s" : score < 80 ? "2.4s" : "3.5s";

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative">
        <div className="absolute inset-0 rounded-full pointer-events-none" style={{ background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`, animation: `breathe ${breathDuration} ease-in-out infinite`, width: "220px", height: "130px", top: "-20px", left: "-10px" }} />
        <div className="relative w-52 h-28">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={[{ value: filled }, { value: empty }]} cx="50%" cy="100%" startAngle={180} endAngle={0} innerRadius={60} outerRadius={80} dataKey="value" strokeWidth={0}>
                <Cell fill={arcColor} />
                <Cell fill="rgba(255,255,255,0.05)" />
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
            <span className="font-bold tabular-nums my-2 text-3xl" style={{ fontFamily: "JetBrains Mono, monospace", color: arcColor, textShadow: `0 0 20px ${arcColor}66` }}>{displayed}</span>
            <span className="text-[10px] mt-0.5" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.35)" }}>/ 100</span>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-2">
        {isPositive ? <TrendingUp size={13} style={{ color: "#10B981" }} /> : <TrendingDown size={13} style={{ color: "#EF4444" }} />}
        <span className="text-sm font-semibold tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace", color: isPositive ? "#10B981" : "#EF4444" }}>{isPositive ? "▲" : "▼"} {Math.abs(delta)}%</span>
        <span className="text-[10px]" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.35)" }}>vs 24h</span>
      </div>
      <div className="mt-2 px-3 py-1 rounded-full text-[10px] tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace", background: "rgba(16,185,129,0.08)", border: "1px solid rgba(16,185,129,0.2)", color: "rgba(16,185,129,0.8)" }}>Confidence: {confidence}%</div>
    </div>
  );
}

function ResourceBar({ label, value, unit, icon: Icon, color, status, financialNote }: { label: string; value: number; unit: string; icon: React.ElementType; color: string; status: string; financialNote: string }) {
  const displayValue = status === "warn" ? value - 100 : value;
  const barValue = Math.min(value, 100);
  const countedVal = useCountUp(displayValue, 1400);
  const isWarn = status === "warn";

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={13} style={{ color }} />
          <span className="text-[11px] font-medium uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.5)" }}>{label}</span>
        </div>
        <div className="flex items-center gap-2">
          {isWarn && <span className="text-[9px] px-1.5 py-0.5 rounded uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace", background: "rgba(239,68,68,0.15)", color: "#EF4444", border: "1px solid rgba(239,68,68,0.3)" }}>Over</span>}
          <span className="text-sm font-semibold tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace", color }}>{isWarn ? `+${countedVal}%` : `${countedVal}%`}</span>
        </div>
      </div>
      <div className="h-2 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.06)" }}>
        <div className="h-full rounded-full relative overflow-hidden" style={{ width: `${barValue}%`, transition: "width 1.2s cubic-bezier(0.4,0,0.2,1)" }}>
          <div className="absolute inset-0 rounded-full" style={{ background: isWarn ? "linear-gradient(90deg, #F59E0B, #EF4444)" : `linear-gradient(90deg, ${color}66, ${color}, ${color}66)`, backgroundSize: "200% 100%", animation: "flowBar 2s linear infinite" }} />
        </div>
      </div>
      <div className="flex items-center justify-between">
        <span className="text-[10px]" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.35)" }}>{displayValue}% {unit}</span>
        <span className={cn("text-[10px]", isWarn ? "text-red-400" : "text-emerald-400/70")} style={{ fontFamily: "JetBrains Mono, monospace" }}>{financialNote}</span>
      </div>
    </div>
  );
}

function SensorMetric({ reportingRate, activeCaptains, totalCaptains }: { reportingRate: number; activeCaptains: number; totalCaptains: number }) {
  const counted = useCountUp(reportingRate, 1600);
  const arcColor = reportingRate >= 90 ? "#10B981" : reportingRate >= 70 ? "#F59E0B" : "#EF4444";
  const circumference = 125.7;
  const dashLen = reportingRate / 100 * circumference;

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className="relative">
        <svg width="110" height="62" viewBox="0 0 110 62">
          <path d="M 12 56 A 44 44 0 0 1 98 56" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="9" strokeLinecap="round" />
          <path d="M 12 56 A 44 44 0 0 1 98 56" fill="none" stroke={arcColor} strokeWidth="9" strokeLinecap="round" strokeDasharray={`${dashLen} ${circumference}`} style={{ filter: `drop-shadow(0 0 5px ${arcColor}88)` }} />
        </svg>
        <div className="absolute inset-0 flex items-end justify-center pb-1">
          <span className="text-xl font-bold tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace", color: arcColor, textShadow: `0 0 12px ${arcColor}88` }}>{counted}%</span>
        </div>
      </div>
      <div className="text-center space-y-1">
        <div className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.4)" }}>Reporting Rate</div>
        <div className="flex items-center justify-center gap-1.5">
          <Signal size={11} style={{ color: "#10B981" }} />
          <span className="text-xs tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.8)" }}>{activeCaptains}<span style={{ color: "rgba(255,255,255,0.35)" }}>/{totalCaptains}</span></span>
        </div>
      </div>
    </div>
  );
}

const GLASS_CARD = { background: "rgba(30,41,59,0.5)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" } as const;

export function PerformanceHeader({ statusData }: { statusData: StatusData | null }) {
  const analytics = deriveAnalytics(statusData);
  const { resources } = analytics;

  return (
    <>
      <style>{`
        @keyframes breathe {
          0%, 100% { opacity: 0.4; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1.05); }
        }
        @keyframes flowBar {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
      <section className="grid grid-cols-12 gap-3">
        <div className="col-span-3 rounded-xl p-4 flex flex-col" style={GLASS_CARD}>
          <div className="flex items-center justify-between mb-3">
            <div className="flex flex-col gap-0.5">
              <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.4)" }}>Global CIU Efficiency</span>
              <span className="text-[8px] uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.25)" }}>Composite Score</span>
            </div>
            <span className="text-[9px] px-2 py-0.5 rounded-full uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace", background: "rgba(16,185,129,0.1)", color: "#10B981", border: "1px solid rgba(16,185,129,0.2)" }}>Live</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <CIUGauge score={analytics.ciuEfficiency} delta={analytics.ciuDelta} confidence={analytics.confidenceScore} />
          </div>
        </div>

        <div className="col-span-6 rounded-xl p-4" style={GLASS_CARD}>
          <div className="mb-4">
            <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.4)" }}>Resource Distribution</span>
          </div>
          <div className="space-y-5">
            <ResourceBar {...resources.water} />
            <ResourceBar {...resources.waste} />
            <ResourceBar {...resources.energy} />
          </div>
        </div>

        <div className="col-span-3 rounded-xl p-4 flex flex-col" style={GLASS_CARD}>
          <div className="mb-3">
            <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.4)" }}>Sensor Reliability</span>
          </div>
          <div className="flex-1 flex items-center justify-center">
            <SensorMetric {...analytics.sensorReliability} />
          </div>
          <div className="grid grid-cols-2 gap-2 mt-3 pt-3" style={{ borderTop: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="text-center">
              <div className="text-2xl font-bold tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace", color: "#10B981", textShadow: "0 0 12px rgba(16,185,129,0.5)" }}>47</div>
              <div className="text-[9px] uppercase tracking-widest mt-0.5" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.35)" }}>Active</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace", color: "#EF4444", textShadow: "0 0 12px rgba(239,68,68,0.5)" }}>3</div>
              <div className="text-[9px] uppercase tracking-widest mt-0.5" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.35)" }}>Offline</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
