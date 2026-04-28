import { useEffect, useState } from "react";
import { Activity, Radio, Layers, BarChart3, Antenna, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils.ts";

type Tab = "overview" | "audit" | "broadcast";

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
  { id: "overview", label: "Command Overview", icon: <BarChart3 size={14} /> },
  { id: "audit", label: "Audit Log", icon: <Layers size={14} /> },
  { id: "broadcast", label: "Broadcast Control", icon: <Radio size={14} /> },
];

export function CommandHeader({ activeTab, onTabChange }: Props) {
  const [now, setNow] = useState(new Date());
  const [syncing, setSyncing] = useState(false);
  const [pulse, setPulse] = useState(true);

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const sync = () => {
      setSyncing(true);
      setTimeout(() => setSyncing(false), 1400);
    };
    sync();
    const id = setInterval(sync, 12000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    const id = setInterval(() => setPulse((p) => !p), 800);
    return () => clearInterval(id);
  }, []);

  const timeStr = now.toLocaleTimeString("en-US", { hour12: false });
  const dateStr = now.toLocaleDateString("en-US", { month: "short", day: "2-digit", year: "numeric" });

  return (
    <header
      className="border-b border-white/[0.08] px-6 py-0 flex items-center justify-between gap-4 shrink-0"
      style={{ background: "rgba(2,6,23,0.95)", backdropFilter: "blur(12px)" }}
    >
      <div className="flex items-center gap-3 py-3">
        <div
          className="flex items-center justify-center w-9 h-9 rounded-lg"
          style={{
            background: "rgba(16,185,129,0.15)",
            border: "1px solid rgba(16,185,129,0.4)",
            boxShadow: "0 0 12px rgba(16,185,129,0.2)",
          }}
        >
          <Antenna size={16} style={{ color: "#10B981" }} />
        </div>
        <div>
          <div className="text-sm font-semibold tracking-[0.2em] text-white uppercase" style={{ fontFamily: "Inter, sans-serif" }}>
            Eco-Ledger
          </div>
          <div className="text-[10px] tracking-widest uppercase" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(16,185,129,0.7)" }}>
            Sovereign Resilience · Admin Hub
          </div>
        </div>
      </div>

      <nav className="flex items-end gap-0 self-stretch">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={cn(
              "flex items-center gap-2 px-5 py-3 text-xs font-medium tracking-widest uppercase transition-all cursor-pointer border-b-2 self-stretch",
              activeTab === tab.id
                ? "border-emerald-400 text-emerald-400"
                : "border-transparent text-white/40 hover:text-white/70 hover:bg-white/[0.04]"
            )}
            style={{ fontFamily: "Inter, sans-serif" }}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </nav>

      <div className="flex items-center gap-5 py-3">
        <div className="flex items-center gap-2">
          <RefreshCw
            size={12}
            className={cn("transition-colors", syncing ? "animate-spin text-emerald-400" : "text-white/30")}
          />
          <span
            className="text-[10px] tracking-wider uppercase"
            style={{ fontFamily: "JetBrains Mono, monospace", color: syncing ? "#10B981" : "rgba(255,255,255,0.3)" }}
          >
            {syncing ? "Syncing..." : "Synced"}
          </span>
        </div>

        <div className="w-px h-4 bg-white/10" />

        <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full transition-all duration-300"
            style={{
              background: "#10B981",
              boxShadow: pulse ? "0 0 8px 3px rgba(16,185,129,0.6)" : "0 0 2px 1px rgba(16,185,129,0.3)",
            }}
          />
          <Activity size={11} style={{ color: "#10B981" }} />
          <span
            className="text-[10px] font-semibold tracking-widest uppercase"
            style={{ fontFamily: "JetBrains Mono, monospace", color: "#10B981" }}
          >
            Live
          </span>
        </div>

        <div className="w-px h-4 bg-white/10" />

        <div className="text-right">
          <div
            className="text-xs font-semibold tabular-nums text-white"
            style={{ fontFamily: "JetBrains Mono, monospace" }}
          >
            {timeStr}
          </div>
          <div
            className="text-[10px] tabular-nums"
            style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.4)" }}
          >
            {dateStr}
          </div>
        </div>
      </div>
    </header>
  );
}