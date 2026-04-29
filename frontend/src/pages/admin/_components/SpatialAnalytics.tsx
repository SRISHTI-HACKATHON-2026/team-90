import { useState } from "react";
import { AreaChart, Area, ResponsiveContainer } from "recharts";
import { MapPin, Users, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";

type ZoneStatus = "healthy" | "warning" | "critical" | "dark";

interface Zone {
  id: string;
  population: number;
  reportingAccuracy: number;
  ciuDensity: number;
  status: ZoneStatus;
  col: number;
  row: number;
  trend: { hour: string; value: number }[];
}

const zones: Zone[] = [
  { id: "Cluster-A", population: 620, reportingAccuracy: 97, ciuDensity: 91, status: "healthy", col: 0, row: 0, trend: [{ hour: "06h", value: 88 }, { hour: "09h", value: 91 }, { hour: "12h", value: 94 }, { hour: "15h", value: 91 }, { hour: "18h", value: 95 }] },
  { id: "Cluster-B", population: 450, reportingAccuracy: 98, ciuDensity: 85, status: "healthy", col: 1, row: 0, trend: [{ hour: "06h", value: 80 }, { hour: "09h", value: 83 }, { hour: "12h", value: 88 }, { hour: "15h", value: 85 }, { hour: "18h", value: 87 }] },
  { id: "Cluster-C", population: 310, reportingAccuracy: 72, ciuDensity: 58, status: "warning", col: 2, row: 0, trend: [{ hour: "06h", value: 70 }, { hour: "09h", value: 65 }, { hour: "12h", value: 60 }, { hour: "15h", value: 58 }, { hour: "18h", value: 55 }] },
  { id: "Cluster-D", population: 180, reportingAccuracy: 41, ciuDensity: 22, status: "critical", col: 3, row: 0, trend: [{ hour: "06h", value: 45 }, { hour: "09h", value: 38 }, { hour: "12h", value: 30 }, { hour: "15h", value: 25 }, { hour: "18h", value: 22 }] },
  { id: "Cluster-E", population: 530, reportingAccuracy: 95, ciuDensity: 88, status: "healthy", col: 0, row: 1, trend: [{ hour: "06h", value: 85 }, { hour: "09h", value: 87 }, { hour: "12h", value: 90 }, { hour: "15h", value: 88 }, { hour: "18h", value: 91 }] },
  { id: "Cluster-F", population: 0, reportingAccuracy: 0, ciuDensity: 0, status: "dark", col: 1, row: 1, trend: [{ hour: "06h", value: 5 }, { hour: "09h", value: 2 }, { hour: "12h", value: 0 }, { hour: "15h", value: 0 }, { hour: "18h", value: 0 }] },
  { id: "Cluster-G", population: 290, reportingAccuracy: 68, ciuDensity: 47, status: "warning", col: 2, row: 1, trend: [{ hour: "06h", value: 60 }, { hour: "09h", value: 55 }, { hour: "12h", value: 50 }, { hour: "15h", value: 48 }, { hour: "18h", value: 47 }] },
  { id: "Cluster-H", population: 410, reportingAccuracy: 89, ciuDensity: 76, status: "healthy", col: 3, row: 1, trend: [{ hour: "06h", value: 72 }, { hour: "09h", value: 74 }, { hour: "12h", value: 78 }, { hour: "15h", value: 76 }, { hour: "18h", value: 79 }] },
  { id: "Cluster-I", population: 150, reportingAccuracy: 29, ciuDensity: 15, status: "critical", col: 0, row: 2, trend: [{ hour: "06h", value: 30 }, { hour: "09h", value: 22 }, { hour: "12h", value: 18 }, { hour: "15h", value: 15 }, { hour: "18h", value: 12 }] },
  { id: "Cluster-J", population: 480, reportingAccuracy: 91, ciuDensity: 82, status: "healthy", col: 1, row: 2, trend: [{ hour: "06h", value: 78 }, { hour: "09h", value: 80 }, { hour: "12h", value: 84 }, { hour: "15h", value: 82 }, { hour: "18h", value: 83 }] },
  { id: "Cluster-K", population: 360, reportingAccuracy: 83, ciuDensity: 71, status: "healthy", col: 2, row: 2, trend: [{ hour: "06h", value: 68 }, { hour: "09h", value: 70 }, { hour: "12h", value: 73 }, { hour: "15h", value: 71 }, { hour: "18h", value: 74 }] },
  { id: "Cluster-L", population: 0, reportingAccuracy: 0, ciuDensity: 0, status: "dark", col: 3, row: 2, trend: [{ hour: "06h", value: 8 }, { hour: "09h", value: 3 }, { hour: "12h", value: 0 }, { hour: "15h", value: 0 }, { hour: "18h", value: 0 }] },
];

const STATUS_CFG: Record<ZoneStatus, { label: string; color: string; glow: string; bg: string; border: string; icon: React.ReactNode }> = {
  healthy: { label: "Healthy", color: "#10B981", glow: "rgba(16,185,129,0.4)", bg: "rgba(16,185,129,0.07)", border: "rgba(16,185,129,0.25)", icon: <CheckCircle2 size={10} /> },
  warning: { label: "Warning", color: "#F59E0B", glow: "rgba(245,158,11,0.4)", bg: "rgba(245,158,11,0.07)", border: "rgba(245,158,11,0.25)", icon: <AlertTriangle size={10} /> },
  critical: { label: "Critical", color: "#EF4444", glow: "rgba(239,68,68,0.5)", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.3)", icon: <AlertTriangle size={10} /> },
  dark: { label: "Dark Zone", color: "#6B7280", glow: "transparent", bg: "transparent", border: "rgba(255,255,255,0.05)", icon: <XCircle size={10} /> },
};

const GLASS_CARD = {
  background: "rgba(30,41,59,0.5)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
} as const;

const HAZARD_BG = `repeating-linear-gradient(
  -45deg,
  rgba(255,255,255,0.02) 0px,
  rgba(255,255,255,0.02) 4px,
  transparent 4px,
  transparent 12px
)`;

function ZoneTooltip({ zone }: { zone: Zone }) {
  const cfg = STATUS_CFG[zone.status];

  return (
    <div
      className="absolute z-50 bottom-full left-1/2 -translate-x-1/2 mb-2 w-52 rounded-xl p-3 shadow-2xl pointer-events-none"
      style={{
        background: "rgba(2,6,23,0.96)",
        backdropFilter: "blur(16px)",
        border: `1px solid ${cfg.border}`,
        boxShadow: `0 0 24px ${cfg.glow}`,
      }}
    >
      <div className="flex items-center justify-between mb-2.5">
        <span className="text-xs font-bold text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>{zone.id}</span>
        <span className="flex items-center gap-1 text-[9px] uppercase px-1.5 py-0.5 rounded-full" style={{ fontFamily: "JetBrains Mono, monospace", color: cfg.color, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
          {cfg.icon} {cfg.label}
        </span>
      </div>
      <div className="space-y-1.5 mb-3">
        {[
          { label: "Population", value: zone.population.toLocaleString(), icon: <Users size={9} /> },
          { label: "Reporting Accuracy", value: `${zone.reportingAccuracy}% Verified`, color: cfg.color },
          { label: "CIU Density", value: `${zone.ciuDensity}/100` },
        ].map((row) => (
          <div key={row.label} className="flex justify-between items-center">
            <span className="text-[10px] flex items-center gap-1" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.4)" }}>
              {row.icon ?? null}
              {row.label}
            </span>
            <span className="text-[10px] font-semibold" style={{ fontFamily: "JetBrains Mono, monospace", color: row.color ?? "rgba(255,255,255,0.85)" }}>{row.value}</span>
          </div>
        ))}
      </div>
      <div className="h-12 -mx-1">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={zone.trend}>
            <defs>
              <linearGradient id={`tt-${zone.id}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={cfg.color} stopOpacity={0.35} />
                <stop offset="95%" stopColor={cfg.color} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area type="monotone" dataKey="value" stroke={cfg.color} strokeWidth={1.5} fill={`url(#tt-${zone.id})`} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <div className="text-[9px] text-center mt-1" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.3)" }}>6h Trend</div>
    </div>
  );
}

function ZoneCell({ zone }: { zone: Zone }) {
  const [hovered, setHovered] = useState(false);
  const cfg = STATUS_CFG[zone.status];
  const isDark = zone.status === "dark";
  const isCritical = zone.status === "critical";

  return (
    <div
      className="relative cursor-pointer rounded-xl p-3 flex flex-col gap-1.5 h-32 transition-all duration-200"
      style={{
        background: isDark ? HAZARD_BG : cfg.bg,
        backdropFilter: isDark ? "none" : "blur(8px)",
        border: `1px solid ${hovered ? cfg.border : isDark ? "rgba(255,255,255,0.04)" : "rgba(255,255,255,0.06)"}`,
        boxShadow: hovered
          ? `0 0 20px ${cfg.glow}, 0 0 0 1px ${cfg.border}`
          : isCritical
            ? `0 0 16px ${cfg.glow}`
            : "none",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {isCritical && (
        <div
          className="absolute inset-0 rounded-xl pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at center, ${cfg.glow} 0%, transparent 70%)`,
            animation: "breathe 1.8s ease-in-out infinite",
          }}
        />
      )}

      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-1.5">
          <MapPin size={10} style={{ color: cfg.color }} />
          <span className="text-[11px] font-semibold text-white" style={{ fontFamily: "JetBrains Mono, monospace" }}>{zone.id}</span>
        </div>
        <span style={{ color: cfg.color }}>{cfg.icon}</span>
      </div>

      {!isDark ? (
        <>
          <div className="text-[10px] flex items-center gap-1 relative z-10" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.4)" }}>
            <Users size={8} /> {zone.population.toLocaleString()}
          </div>
          <div className="mt-auto relative z-10">
            <div className="h-1 rounded-full overflow-hidden" style={{ background: "rgba(255,255,255,0.08)" }}>
              <div
                className="h-full rounded-full"
                style={{
                  width: `${zone.ciuDensity}%`,
                  background: `linear-gradient(90deg, ${cfg.color}55, ${cfg.color})`,
                  boxShadow: `0 0 6px ${cfg.color}88`,
                }}
              />
            </div>
            <div className="text-[9px] mt-0.5 font-semibold tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace", color: cfg.color }}>
              {zone.ciuDensity} CIU
            </div>
          </div>
        </>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center gap-1 relative z-10">
          <div className="text-[9px] uppercase tracking-[0.2em]" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.2)" }}>
            ⚠ Blackout
          </div>
          <div className="text-[8px] uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.15)" }}>
            No Signal
          </div>
        </div>
      )}

      {hovered && <ZoneTooltip zone={zone} />}
    </div>
  );
}

export function SpatialAnalytics() {
  const rows = 3;
  const cols = 4;
  const grid: (Zone | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));

  zones.forEach((zone) => {
    grid[zone.row][zone.col] = zone;
  });

  const counts = {
    healthy: zones.filter((zone) => zone.status === "healthy").length,
    warning: zones.filter((zone) => zone.status === "warning").length,
    critical: zones.filter((zone) => zone.status === "critical").length,
    dark: zones.filter((zone) => zone.status === "dark").length,
  };

  return (
    <section className="rounded-xl p-4" style={GLASS_CARD}>
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.4)" }}>
            Spatial Analytics - Zonal Grid
          </span>
          <p className="text-[10px] mt-0.5" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.25)" }}>
            Hover any zone to inspect density, population &amp; accuracy
          </p>
        </div>
        <div className="flex items-center gap-4">
          {(Object.entries(counts) as [ZoneStatus, number][]).map(([status, count]) => {
            const cfg = STATUS_CFG[status];
            return (
              <div key={status} className="flex items-center gap-1.5">
                <span style={{ color: cfg.color }}>{cfg.icon}</span>
                <span className="text-[10px]" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.4)" }}>
                  {count} {cfg.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-3 pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
        <span className="text-[9px] uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.3)" }}>
          CIU Density:
        </span>
        <div className="flex-1 h-1.5 rounded-full" style={{ background: "linear-gradient(90deg, #EF4444, #F59E0B, #10B981)" }} />
        <span className="text-[9px]" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.3)" }}>
          0 - 100
        </span>
      </div>

      <div className="grid grid-cols-4 gap-3">
        {grid.flat().map((zone, index) => {
          const cell = zone ? <ZoneCell zone={zone} /> : <div className="h-32 rounded-xl" style={{ border: "1px dashed rgba(255,255,255,0.05)" }} />;
          return <div key={zone?.id ?? index}>{cell}</div>;
        })}
      </div>
    </section>
  );
}
