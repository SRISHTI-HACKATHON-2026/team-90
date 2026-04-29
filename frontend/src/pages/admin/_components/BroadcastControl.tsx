import { useState } from "react";
import { Send, Bot, Users, Shield, AlertTriangle, CheckCircle2, Radio, Zap, Wifi } from "lucide-react";
import { cn } from "@/lib/utils.ts";
import { toast } from "sonner";

type TargetGroup = "all" | "captains" | "red_zones";

const TARGET_OPTIONS: { id: TargetGroup; label: string; description: string; count: number; icon: React.ReactNode }[] = [
  { id: "all", label: "All Users", description: "Entire settlement network", count: 3230, icon: <Users size={14} /> },
  { id: "captains", label: "Captains Only", description: "Verified zone reporters", count: 47, icon: <Shield size={14} /> },
  { id: "red_zones", label: "Red Zones Only", description: "Critical & warning clusters only", count: 4, icon: <AlertTriangle size={14} /> },
];

const QUICK_TRIGGERS = [
  { id: "qt1", label: "WATER-CONSERVE", severity: "amber", message: "[ECO-ALERT] WATER CONSERVATION ADVISORY: Your zone is exceeding quota. Reduce consumption by 20% for the next 48h. Report compliance via app." },
  { id: "qt2", label: "WASTE-COLLECT", severity: "green", message: "[ECO-ALERT] COLLECTION NOTICE: Waste pickup is scheduled for 07:00 tomorrow. Sort materials and place at designated point. Non-compliance incurs penalty." },
  { id: "qt3", label: "ENERGY-SPIKE", severity: "red", message: "[CRITICAL] GRID INSTABILITY DETECTED: Your zone has exceeded energy threshold. Power down non-essential devices IMMEDIATELY until grid stabilizes." },
  { id: "qt4", label: "REPORT-DUE", severity: "green", message: "[REMINDER] DAILY REPORT DUE: Submit your resource readings via the Eco-Ledger app before 23:59 tonight. Missed submissions affect your CIU score." },
];

const MESSAGE_HISTORY = [
  { id: "m1", timestamp: "2026-04-28T12:00:00Z", target: "All Users", message: "DAILY REPORT DUE: Submission deadline in 2 hours. Please submit readings.", reach: 3180 },
  { id: "m2", timestamp: "2026-04-28T09:15:00Z", target: "Red Zones", message: "CRITICAL: Cluster-D and Cluster-I below threshold. Captains investigate.", reach: 180 },
  { id: "m3", timestamp: "2026-04-27T18:30:00Z", target: "Captains Only", message: "SITREP: Weekly sync call scheduled for Friday 10:00 WAT. Attendance mandatory.", reach: 45 },
];

const GLASS_CARD = { background: "rgba(30,41,59,0.5)", backdropFilter: "blur(12px)", border: "1px solid rgba(255,255,255,0.08)" } as const;

const SEVERITY_COLORS: Record<string, { color: string; bg: string; border: string }> = {
  green: { color: "#10B981", bg: "rgba(16,185,129,0.08)", border: "rgba(16,185,129,0.25)" },
  amber: { color: "#F59E0B", bg: "rgba(245,158,11,0.08)", border: "rgba(245,158,11,0.25)" },
  red: { color: "#EF4444", bg: "rgba(239,68,68,0.08)", border: "rgba(239,68,68,0.25)" },
};

export function BroadcastControl() {
  const [targetGroup, setTargetGroup] = useState<TargetGroup>("all");
  const [message, setMessage] = useState("");
  const [autoNudge, setAutoNudge] = useState(false);
  const [sending, setSending] = useState(false);
  const MAX_CHARS = 160;

  const handleSend = async () => {
    if (!message.trim()) { toast.error("Message cannot be empty"); return; }
    setSending(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSending(false);
    const t = TARGET_OPTIONS.find((o) => o.id === targetGroup);
    toast.success(`Transmission dispatched to ${t?.count.toLocaleString()} recipients`);
    setMessage("");
  };

  return (
    <section className="grid grid-cols-12 gap-3">
      <div className="col-span-7 space-y-3">
        <div className="rounded-xl p-4 space-y-4" style={GLASS_CARD}>
          <div className="flex items-center justify-between pb-3" style={{ borderBottom: "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-2">
              <Radio size={14} style={{ color: "#10B981" }} />
              <span className="text-xs font-semibold uppercase tracking-[0.2em]" style={{ fontFamily: "Inter, sans-serif", color: "#10B981" }}>SITREP — Broadcast Composer</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#10B981", boxShadow: "0 0 6px rgba(16,185,129,0.8)", animation: "breathe 1.5s ease-in-out infinite" }} />
              <span className="text-[10px] uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace", color: "#10B981" }}>SMS Gateway · Active</span>
            </div>
          </div>

          <div>
            <div className="text-[10px] uppercase tracking-widest mb-2" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.35)" }}>Target Group</div>
            <div className="grid grid-cols-3 gap-2">
              {TARGET_OPTIONS.map((opt) => {
                const isActive = targetGroup === opt.id;
                return (
                  <button key={opt.id} onClick={() => setTargetGroup(opt.id)} className="text-left rounded-lg p-3 transition-all cursor-pointer" style={{ background: isActive ? "rgba(16,185,129,0.1)" : "rgba(255,255,255,0.03)", border: isActive ? "1px solid rgba(16,185,129,0.35)" : "1px solid rgba(255,255,255,0.07)", boxShadow: isActive ? "0 0 12px rgba(16,185,129,0.15)" : "none" }}>
                    <div className="flex items-center justify-between mb-1.5">
                      <span style={{ color: isActive ? "#10B981" : "rgba(255,255,255,0.35)" }}>{opt.icon}</span>
                      <span className="text-xs font-bold tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace", color: isActive ? "#10B981" : "rgba(255,255,255,0.5)" }}>{opt.count.toLocaleString()}</span>
                    </div>
                    <div className="text-[11px] font-semibold" style={{ fontFamily: "Inter, sans-serif", color: isActive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.45)" }}>{opt.label}</div>
                    <div className="text-[9px] mt-0.5 leading-tight" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.25)" }}>{opt.description}</div>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={11} style={{ color: "rgba(255,255,255,0.35)" }} />
              <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.35)" }}>Quick-Trigger — /get-status Presets</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {QUICK_TRIGGERS.map((qt) => {
                const sev = SEVERITY_COLORS[qt.severity];
                return (
                  <button key={qt.id} onClick={() => setMessage(qt.message)} className="text-left p-2.5 rounded-lg transition-all cursor-pointer" style={{ background: sev.bg, border: `1px solid ${sev.border}` }}>
                    <div className="flex items-center gap-1.5 mb-1">
                      <div className="w-1.5 h-1.5 rounded-full" style={{ background: sev.color, boxShadow: `0 0 4px ${sev.color}` }} />
                      <span className="text-[9px] font-bold uppercase tracking-widest" style={{ fontFamily: "JetBrains Mono, monospace", color: sev.color }}>{qt.label}</span>
                    </div>
                    <p className="text-[9px] leading-relaxed line-clamp-2" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.4)" }}>{qt.message}</p>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.35)" }}>Message Body</span>
              <span className="text-[10px] tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace", color: message.length > MAX_CHARS * 0.85 ? "#F59E0B" : "rgba(255,255,255,0.3)" }}>{message.length}/{MAX_CHARS}</span>
            </div>
            <textarea value={message} onChange={(e) => { if (e.target.value.length <= MAX_CHARS) setMessage(e.target.value); }} rows={4} placeholder="[ECO-ALERT] Type your transmission or use a quick-trigger above..." className="w-full rounded-lg px-3 py-2.5 text-xs text-white placeholder:text-white/20 outline-none resize-none transition-all" style={{ fontFamily: "JetBrains Mono, monospace", background: "rgba(0,0,0,0.3)", border: "1px solid rgba(255,255,255,0.08)" }} />
          </div>

          <button onClick={handleSend} disabled={sending || !message.trim()} className={cn("w-full flex items-center justify-center gap-2 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all cursor-pointer")} style={{ fontFamily: "Inter, sans-serif", background: sending || !message.trim() ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, rgba(16,185,129,0.9), rgba(16,185,129,0.7))", color: sending || !message.trim() ? "rgba(255,255,255,0.2)" : "#020617", boxShadow: sending || !message.trim() ? "none" : "0 0 24px rgba(16,185,129,0.35)", cursor: sending || !message.trim() ? "not-allowed" : "pointer" }}>
            {sending ? (<><div className="w-3 h-3 border border-current border-t-transparent rounded-full animate-spin" />Transmitting...</>) : (<><Send size={12} />Dispatch to {TARGET_OPTIONS.find((t) => t.id === targetGroup)?.count.toLocaleString()} Recipients</>)}
          </button>
        </div>
      </div>

      <div className="col-span-5 space-y-3">
        <div className="rounded-xl p-4 space-y-3" style={GLASS_CARD}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bot size={13} style={{ color: autoNudge ? "#10B981" : "rgba(255,255,255,0.4)" }} />
              <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.4)" }}>AI Auto-Nudge Engine</span>
            </div>
            <button onClick={() => setAutoNudge(!autoNudge)} className="relative rounded-full transition-all duration-300 cursor-pointer" style={{ width: "42px", height: "22px", background: autoNudge ? "rgba(16,185,129,0.8)" : "rgba(255,255,255,0.1)", border: autoNudge ? "1px solid rgba(16,185,129,0.5)" : "1px solid rgba(255,255,255,0.12)", boxShadow: autoNudge ? "0 0 12px rgba(16,185,129,0.4)" : "none" }}>
              <div className="absolute top-[3px] w-4 h-4 bg-white rounded-full shadow transition-all duration-300" style={{ left: autoNudge ? "calc(100% - 19px)" : "3px" }} />
            </button>
          </div>
          <div className="rounded-lg p-3" style={{ background: autoNudge ? "rgba(16,185,129,0.06)" : "rgba(0,0,0,0.2)", border: autoNudge ? "1px solid rgba(16,185,129,0.2)" : "1px solid rgba(255,255,255,0.06)" }}>
            <div className="flex items-center gap-1.5 mb-2">
              <Wifi size={10} style={{ color: autoNudge ? "#10B981" : "rgba(255,255,255,0.3)" }} />
              <span className="text-[9px] uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: autoNudge ? "rgba(16,185,129,0.7)" : "rgba(255,255,255,0.3)" }}>/get-status · System Analysis</span>
            </div>
            <p className="text-[11px] leading-relaxed" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.65)" }}>Water usage in Cluster-C is +62% above rolling average. Energy spike detected in Cluster-B (+54%). Recommend immediate conservation nudge to affected red zones.</p>
            {autoNudge && (
              <div className="mt-2 pt-2 flex items-center gap-1.5" style={{ borderTop: "1px solid rgba(16,185,129,0.15)" }}>
                <CheckCircle2 size={10} style={{ color: "#10B981" }} />
                <span className="text-[10px]" style={{ fontFamily: "JetBrains Mono, monospace", color: "#10B981" }}>Auto-dispatch active — AI will transmit alerts on anomaly detection</span>
              </div>
            )}
          </div>
        </div>

        <div className="rounded-xl p-4" style={GLASS_CARD}>
          <div className="flex items-center justify-between mb-3 pb-2.5" style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
            <span className="text-[10px] uppercase tracking-widest" style={{ fontFamily: "Inter, sans-serif", color: "rgba(255,255,255,0.4)" }}>Transmission Log</span>
            <span className="text-[9px] uppercase tracking-wider" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(16,185,129,0.6)" }}>{MESSAGE_HISTORY.length} dispatched</span>
          </div>
          <div className="space-y-2">
            {MESSAGE_HISTORY.map((msg) => (
              <div key={msg.id} className="rounded-lg p-2.5" style={{ background: "rgba(0,0,0,0.25)", border: "1px solid rgba(255,255,255,0.05)" }}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[9px] tabular-nums" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.3)" }}>{new Date(msg.timestamp).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false })}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-[9px] uppercase" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(16,185,129,0.7)" }}>{msg.target}</span>
                    <span className="flex items-center gap-0.5 text-[9px]" style={{ fontFamily: "JetBrains Mono, monospace", color: "#10B981" }}><CheckCircle2 size={8} /> {msg.reach.toLocaleString()}</span>
                  </div>
                </div>
                <p className="text-[10px] truncate" style={{ fontFamily: "JetBrains Mono, monospace", color: "rgba(255,255,255,0.4)" }}>{msg.message}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
