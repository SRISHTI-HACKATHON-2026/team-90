import { useState } from "react";
import { Flag, AlertTriangle, CheckCircle2, Clock, Filter, Search, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils.ts";

type VerificationStatus = "verified" | "pending" | "flagged" | "rejected";
type Category = "water" | "waste" | "energy";

interface LogEntry {
  id: string;
  timestamp: string;
  source: string;
  category: Category;
  value: number;
  unit: string;
  rollingAvg: number;
  verificationStatus: VerificationStatus;
  zone: string;
  flagReason?: string;
}

const generateLogs = (): LogEntry[] => [
  { id: "L001", timestamp: "2026-04-28T14:32:11Z", source: "+234 803 4421 012", category: "waste",  value: 47,   unit: "kg",  rollingAvg: 38,  verificationStatus: "verified", zone: "Cluster-B" },
  { id: "L002", timestamp: "2026-04-28T14:31:05Z", source: "+234 806 7712 334", category: "water",  value: 320,  unit: "L",   rollingAvg: 250, verificationStatus: "pending",  zone: "Cluster-C" },
  { id: "L003", timestamp: "2026-04-28T14:30:44Z", source: "+234 801 9982 001", category: "energy", value: 14.2, unit: "kWh", rollingAvg: 11.8, verificationStatus: "verified", zone: "Cluster-A" },
  { id: "L004", timestamp: "2026-04-28T14:29:33Z", source: "+234 808 1223 889", category: "waste",  value: 500,  unit: "kg",  rollingAvg: 39,  verificationStatus: "flagged",  zone: "Cluster-D", flagReason: "Value exceeds 25% threshold by 1182%" },
  { id: "L005", timestamp: "2026-04-28T14:28:19Z", source: "+234 802 5543 667", category: "water",  value: 198,  unit: "L",   rollingAvg: 248, verificationStatus: "verified", zone: "Cluster-E" },
  { id: "L006", timestamp: "2026-04-28T14:27:55Z", source: "+234 807 3312 445", category: "energy", value: 9.5,  unit: "kWh", rollingAvg: 11.2, verificationStatus: "verified", zone: "Cluster-J" },
  { id: "L007", timestamp: "2026-04-28T14:26:40Z", source: "+234 805 8874 001", category: "waste",  value: 61,   unit: "kg",  rollingAvg: 41,  verificationStatus: "pending",  zone: "Cluster-G" },
  { id: "L008", timestamp: "2026-04-28T14:25:22Z", source: "+234 803 1100 221", category: "water",  value: 415,  unit: "L",   rollingAvg: 255, verificationStatus: "flagged",  zone: "Cluster-C", flagReason: "62.7% spike above rolling average" },
  { id: "L009", timestamp: "2026-04-28T14:24:10Z", source: "+234 806 4430 993", category: "energy", value: 13.1, unit: "kWh", rollingAvg: 10.4, verificationStatus: "verified", zone: "Cluster-K" },
  { id: "L010", timestamp: "2026-04-28T14:23:05Z", source: "+234 801 2299 554", category: "waste",  value: 28,   unit: "kg",  rollingAvg: 37,  verificationStatus: "verified", zone: "Cluster-H" },
  { id: "L011", timestamp: "2026-04-28T14:22:45Z", source: "+234 809 6677 112", category: "water",  value: 900,  unit: "L",   rollingAvg: 265, verificationStatus: "rejected", zone: "Cluster-I", flagReason: "Impossible value — flagged by system" },
  { id: "L012", timestamp: "2026-04-28T14:21:31Z", source: "+234 804 3321 009", category: "energy", value: 16.8, unit: "kWh", rollingAvg: 10.9, verificationStatus: "flagged",  zone: "Cluster-B", flagReason: "54.1% spike above rolling average" },
];

const CAT_CFG: Record<Category, { color: string; bg: string }> = {
  water:  { color: "#38bdf8", bg: "rgba(56,189,248,0.1)" },
  waste:  { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  energy: { color: "#10B981", bg: "rgba(16,185,129,0.1)" },
};

const STAT_CFG: Record<VerificationStatus, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  verified: { color: "#10B981", bg: "rgba(16,185,129,0.1)",  border: "rgba(16,185,129,0.25)", icon: <CheckCircle2 size={10} /> },
  pending:  { color: "#F59E0B", bg: "rgba(245,158,11,0.1)",  border: "rgba(245,158,11,0.25)", icon: <Clock size={10} /> },
  flagged:  { color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)",  icon: <AlertTriangle size={10} /> },
  rejected: { color: "#EF4444", bg: "rgba(239,68,68,0.08)",  border: "rgba(239,68,68,0.2)",  icon: <Flag size={10} /> },
};

const GLASS_CARD = {
  background: "rgba(30,41,59,0.5)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
} as const;

function isSpike(value: number, avg: number) { return (value - avg) / avg > 0.25; }
function formatTs(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

const HEADERS = ["Timestamp", "Source", "Zone", "Category", "Value", "Δ Avg", "Status", "Action"];
const COL_GRID = "grid-cols-[130px_155px_90px_95px_80px_95px_1fr_60px]";

export function AuditLog() {
  const [logs, setLogs] = useState<LogEntry[]>(generateLogs);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "all">("all");

  const flagEntry = (id: string) => {
    setLogs((prev) =>
      prev.map((l) => l.id === id ? { ...l, verificationStatus: "flagged" as const, flagReason: l.flagReason ?? "Manually flagged by admin" } : l)
    );
  };

  const filtered = logs.filter((l) => {
    const ms = search === "" || l.source.includes(search) || l.zone.toLowerCase().includes(search.toLowerCase());
    const mc = categoryFilter === "all" || l.category === categoryFilter;
    const mst = statusFilter === "all" || l.verificationStatus === statusFilter;
    return ms && mc && mst;
  });

  return (
    <section className="space-y-3">
      <div className="rounded-xl p-3 flex items-center gap-3 flex-wrap" style={GLASS_CARD}>
        <div
          className="flex items-center gap-2 flex-1 min-w-48 rounded-lg px-3 py-1.5"
          style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}
        >
          <Search size={12} style={{ color: "rgba(255,255,255,0.3)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by phone or zone..."
            className="bg-transparent text-xs text-white placeholder:text-white/25 outline-none w-full"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          />
        </div>

        <div className="flex items-center gap-1.5">
          <Filter size={10} style={{ color: "rgba(255,255,255,0.3)" }} />
          {(["all", "water", "waste", "energy"] as const).map((c) => (
            <button
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={cn("text-[10px] px-2.5 py-1 rounded-md uppercase tracking-widest cursor-pointer transition-all")}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                background: categoryFilter === c ? "rgba(16,185,129,0.15)" : "transparent",
                color: categoryFilter === c ? "#10B981" : "rgba(255,255,255,0.35)",
                border: categoryFilter === c ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent",
              }}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="w-px h-4" style={{ background: "rgba(255,255,255,0.08)" }} />

        <div className="flex items-center gap-1.5">
          {(["all", "verified", "pending", "flagged", "rejected"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={cn("text-[10px] px-2.5 py-1 rounded-md uppercase tracking-widest cursor-pointer transition-all")}
              style={{
                fontFamily: "JetBrains Mono, monospace",
                background: statusFilter === s ? "rgba(16,185,129,0.15)" : "transparent",
                color: statusFilter === s ? "#10B981" : "rgba(255,255,255,0.35)",
                border: statusFilter === s ? "1px solid rgba(16,185,129,0.3)" : "1px solid transparent",
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="ml-auto text-[10px] tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.3)" }}>
          {filtered.length}/{logs.length} entries
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={GLASS_CARD}>
        <div className={cn("grid gap-0 px-4 py-2.5", COL_GRID)} style={{ borderBottom: "1px solid rgba(255,255,255,0.06)", background: "rgba(0,0,0,0.2)" }}>
          {HEADERS.map((h) => (
            <span key={h} className="text-[9px] uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.3)" }}>{h}</span>
          ))}
        </div>

        <div className="overflow-auto" style={{ maxHeight: "calc(100vh - 280px)" }}>
          {filtered.map((log, idx) => {
            const catCfg = CAT_CFG[log.category];
            const stCfg = STAT_CFG[log.verificationStatus];
            const spike = isSpike(log.value, log.rollingAvg);
            const pct = ((log.value - log.rollingAvg) / log.rollingAvg * 100).toFixed(1);
            const isPos = log.value > log.rollingAvg;
            const isEven = idx % 2 === 0;

            return (
              <div
                key={log.id}
                className={cn("grid gap-0 px-4 py-2.5 items-center transition-colors", COL_GRID)}
                style={{
                  background: log.verificationStatus === "flagged"
                    ? "rgba(245,158,11,0.04)"
                    : log.verificationStatus === "rejected"
                    ? "rgba(239,68,68,0.05)"
                    : isEven
                    ? "rgba(255,255,255,0.015)"
                    : "transparent",
                  borderBottom: "1px solid rgba(255,255,255,0.04)",
                }}
                onMouseEnter={(e) => { (e.currentTarget as HTMLDivElement).style.background = "rgba(16,185,129,0.04)"; }}
                onMouseLeave={(e) => {
                  const bg = log.verificationStatus === "flagged"
                    ? "rgba(245,158,11,0.04)"
                    : log.verificationStatus === "rejected"
                    ? "rgba(239,68,68,0.05)"
                    : isEven ? "rgba(255,255,255,0.015)" : "transparent";
                  (e.currentTarget as HTMLDivElement).style.background = bg;
                }}
              >
                <span className="text-[11px] tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.4)" }}>
                  {formatTs(log.timestamp)}
                </span>

                <span className="text-[11px] tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.85)" }}>
                  {log.source}
                </span>

                <span className="text-[11px]" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.45)" }}>
                  {log.zone}
                </span>

                <span
                  className="text-[10px] px-2 py-0.5 rounded w-fit uppercase tracking-wider"
                  style={{ fontFamily: "JetBrains Mono, monospace", color: catCfg.color, background: catCfg.bg }}
                >
                  {log.category}
                </span>

                <div className="flex items-center gap-1.5">
                  {spike && (
                    <ShieldAlert size={12} style={{ color: "#EF4444", filter: "drop-shadow(0 0 4px rgba(239,68,68,0.7))", flexShrink: 0 }} />
                  )}
                  <span
                    className="text-[12px] font-semibold tabular-nums"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      color: spike ? "#EF4444" : "rgba(255,255,255,0.9)",
                      textShadow: spike ? "0 0 8px rgba(239,68,68,0.5)" : "none",
                    }}
                  >
                    {log.value}<span className="text-[9px] ml-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{log.unit}</span>
                  </span>
                </div>

                <div className="flex items-center gap-1">
                  {spike && <AlertTriangle size={8} style={{ color: "#EF4444", flexShrink: 0 }} />}
                  <span
                    className="text-[10px] tabular-nums font-semibold"
                    style={{
                      fontFamily: "JetBrains Mono, monospace",
                      color: spike ? "#EF4444" : isPos ? "#F59E0B" : "rgba(255,255,255,0.35)",
                    }}
                  >
                    {isPos ? "+" : ""}{pct}%
                  </span>
                </div>

                <div className="flex flex-col gap-0.5">
                  <span
                    className="text-[10px] px-2 py-0.5 rounded-full w-fit flex items-center gap-1 uppercase tracking-wider"
                    style={{ fontFamily: "JetBrains Mono, monospace", color: stCfg.color, background: stCfg.bg, border: `1px solid ${stCfg.border}` }}
                  >
                    {stCfg.icon} {log.verificationStatus}
                  </span>
                  {log.flagReason && (
                    <span className="text-[9px] truncate max-w-[180px]" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(239,68,68,0.6)" }}>
                      {log.flagReason}
                    </span>
                  )}
                </div>

                <button
                  onClick={() => flagEntry(log.id)}
                  disabled={log.verificationStatus === "flagged" || log.verificationStatus === "rejected"}
                  className={cn("flex items-center gap-1 text-[9px] px-2 py-1 rounded-md uppercase tracking-widest cursor-pointer transition-all")}
                  style={{
                    fontFamily: "JetBrains Mono, monospace",
                    ...(log.verificationStatus === "flagged" || log.verificationStatus === "rejected"
                      ? { color: "rgba(255,255,255,0.15)", cursor: "not-allowed" }
                      : { color: "#F59E0B", border: "1px solid rgba(245,158,11,0.3)", background: "transparent" }),
                  }}
                >
                  <Flag size={9} /> Flag
                </button>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-5 px-1">
        <div className="flex items-center gap-1.5">
          <ShieldAlert size={11} style={{ color: "#EF4444" }} />
          <span className="text-[10px]" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.3)" }}>
            Red Alert Badge = value &gt;25% above rolling average
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Flag size={10} style={{ color: "#F59E0B" }} />
          <span className="text-[10px]" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.3)" }}>
            Flag suspicious entries for manual review
          </span>
        </div>
      </div>
    </section>
  );
}