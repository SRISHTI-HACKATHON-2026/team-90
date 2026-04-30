import { useState, useEffect } from "react";
import { Flag, AlertTriangle, CheckCircle2, Clock, Filter, Search, ShieldAlert } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import type { BackendLog } from "../page.tsx";

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

const UNIT_MAP: Record<string, string> = { water: "L", waste: "kg", energy: "kWh" };
const AVG_MAP: Record<string, number> = { water: 250, waste: 40, energy: 12 };

function mapBackendLogs(raw: BackendLog[]): LogEntry[] {
  return raw.map((l, i) => {
    const resource = (l.resource ?? "water") as Category;
    const value = l.value ?? 0;
    const avg = AVG_MAP[resource] ?? 30;
    const status: VerificationStatus =
      l.type === "verified" ? "verified"
        : l.type === "observation" ? "pending"
          : "pending";
    return {
      id: `API-${i}`,
      timestamp: l.time ?? new Date().toISOString(),
      source: l.sender ?? l.phone ?? "Unknown",
      category: (["water", "waste", "energy"].includes(resource) ? resource : "water") as Category,
      value,
      unit: UNIT_MAP[resource] ?? "",
      rollingAvg: avg,
      verificationStatus: status,
      zone: "Live",
      flagReason: l.message ?? undefined,
    };
  });
}

const CAT_CFG: Record<Category, { color: string; bg: string }> = {
  water: { color: "#38bdf8", bg: "rgba(56,189,248,0.1)" },
  waste: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)" },
  energy: { color: "#10B981", bg: "rgba(16,185,129,0.1)" },
};

const STAT_CFG: Record<VerificationStatus, { color: string; bg: string; border: string; icon: React.ReactNode }> = {
  verified: { color: "#10B981", bg: "rgba(16,185,129,0.1)", border: "rgba(16,185,129,0.25)", icon: <CheckCircle2 size={10} /> },
  pending: { color: "#F59E0B", bg: "rgba(245,158,11,0.1)", border: "rgba(245,158,11,0.25)", icon: <Clock size={10} /> },
  flagged: { color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.2)", icon: <AlertTriangle size={10} /> },
  rejected: { color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.2)", icon: <Flag size={10} /> },
};

const GLASS_CARD = {
  background: "rgba(30,41,59,0.5)",
  backdropFilter: "blur(12px)",
  border: "1px solid rgba(255,255,255,0.08)",
} as const;

function isSpike(value: number, avg: number) { return avg > 0 && (value - avg) / avg > 0.25; }
function formatTs(iso: string) {
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

const HEADERS = ["Timestamp", "Source", "Zone", "Category", "Value", "Δ Avg", "Status", "Action"];
const COL_GRID = "grid-cols-[130px_155px_90px_95px_80px_95px_1fr_60px]";

// FIX: Use the correct FastAPI port (5000) and the /logs endpoint.
const API_BASE = import.meta.env.VITE_API_URL || "http://127.0.0.1:5000";

export function AuditLog({ backendLogs }: { backendLogs: BackendLog[] }) {
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<Category | "all">("all");
  const [statusFilter, setStatusFilter] = useState<VerificationStatus | "all">("all");
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch(`${API_BASE}/logs`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      console.log("AUDIT LOGS:", data);
      setLogs(mapBackendLogs(data));
      setError(null);
    } catch (err) {
      console.error("Audit log fetch error:", err);
      // FIX: Fall back to parent-provided logs so the table isn't blank
      // even if the direct fetch fails (e.g. CORS in dev).
      if (backendLogs?.length) {
        setLogs(mapBackendLogs(backendLogs));
      }
      setError(err instanceof Error ? err.message : "Failed to fetch logs");
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchLogs();

    // FIX: Poll every 5 seconds so new IVR/SMS entries appear without refresh
    const interval = setInterval(fetchLogs, 5000);
    return () => clearInterval(interval);
  }, [backendLogs]);

  // FIX: Re-run if parent pushes new backendLogs (e.g. on first load race condition)
  useEffect(() => {
    if (logs.length === 0 && backendLogs?.length) {
      setLogs(mapBackendLogs(backendLogs));
    }
  }, [backendLogs]);

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
      {/* FIX: Show error banner if /logs fetch failed, so it's visible during debugging */}
      {error && (
        <div
          className="rounded-lg px-3 py-2 text-xs flex items-center gap-2"
          style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#EF4444", fontFamily: "JetBrains Mono, monospace" }}
        >
          <AlertTriangle size={12} />
          API error: {error} — showing fallback data
        </div>
      )}

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
          {filtered.length === 0 && (
            <div className="px-4 py-8 text-center text-xs" style={{ color: "rgba(255,255,255,0.35)", fontFamily: "JetBrains Mono, monospace" }}>
              No audit logs found.
            </div>
          )}
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
                  {log.source || "-"}
                </span>

                <span className="text-[11px]" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.45)" }}>
                  {log.zone || "-"}
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
                    {log.value ?? "-"}<span className="text-[9px] ml-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{log.unit || ""}</span>
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