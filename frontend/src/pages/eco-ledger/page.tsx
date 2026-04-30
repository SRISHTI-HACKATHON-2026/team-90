import { useEffect, useCallback, useRef, useState } from "react";
import type { SystemStatus, ResourceKey, ResourceLevel, Trend, WeatherSymbol, LogEntry } from "../../lib/mockData.ts";
import StatusPanel from "./_components/StatusPanel.tsx";
import ResourcePanel from "./_components/ResourcePanel.tsx";
import ActionPanel from "./_components/ActionPanel.tsx";
import WeatherPanel from "./_components/WeatherPanel.tsx";
import VerificationLog from "./_components/VerificationLog.tsx";
import SyncIndicator from "./_components/SyncIndicator.tsx";
import VoiceButton from "./_components/VoiceButton.tsx";
import HindiSpeaker from "./_components/HindiSpeaker.tsx";
import FakeSMSPanel from "../../components/FakeSMSPanel.tsx";
import FloatingNav from "../../components/Floatingnav.tsx";

/* ── API ── */

const API_BASE = import.meta.env.VITE_API_URL 

type ApiData = {
  water: number;
  waste: number;
  energy: number;
  water_status: string;
  waste_status: string;
  energy_status: string;
  ciu_score: number;
  status: string;
  worst: string | null;
  weather: string;
  trend: string;
  message: string;
};

/* ── Helpers (pure, no mock data) ── */

const RESOURCES = ["water", "waste", "energy"] as const;

function clock() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/** Map backend per-resource status to ResourceLevel for emojis/colors */
function statusToLevel(backendStatus: string): ResourceLevel {
  if (backendStatus === "good") return "low";       // 😊
  if (backendStatus === "moderate") return "medium"; // 😐
  return "high";                                     // 😰 (critical)
}

function statusToHistory(s: SystemStatus): WeatherSymbol[] {
  if (s === "green")  return ["sun", "sun", "sun", "cloud", "sun"];
  if (s === "yellow") return ["cloud", "sun", "cloud", "cloud", "sun"];
  return ["storm", "cloud", "storm", "cloud", "storm"];
}

function computeStreak(history: WeatherSymbol[]): number {
  let s = 0;
  for (let i = history.length - 1; i >= 0; i--) {
    if (history[i] === "sun") s++; else break;
  }
  return s;
}

/** Emotional background: muted tint of system status color */
const BG_TINT: Record<SystemStatus, string> = {
  green:  "#00E67609",
  yellow: "#FFD00009",
  red:    "#FF4B4B09",
};

const SEP = "1px solid #1c1c1c";

/* ── Demo Scenarios ── */

const DEMO_SCENARIOS: ApiData[] = [
  {
    water: 10, waste: 15, energy: 20,
    water_status: "good", waste_status: "good", energy_status: "moderate",
    ciu_score: 55, status: "yellow", worst: "energy",
    weather: "cloudy", trend: "up", message: "All resources healthy",
  },
  {
    water: 30, waste: 70, energy: 40,
    water_status: "moderate", waste_status: "critical", energy_status: "moderate",
    ciu_score: 0, status: "red", worst: "waste",
    weather: "storm", trend: "down", message: "WASTE is critical",
  },
  {
    water: 80, waste: 50, energy: 90,
    water_status: "critical", waste_status: "critical", energy_status: "critical",
    ciu_score: 0, status: "red", worst: "energy",
    weather: "storm", trend: "down", message: "ENERGY is critical",
  },
  {
    water: 5, waste: 8, energy: 12,
    water_status: "good", waste_status: "good", energy_status: "good",
    ciu_score: 75, status: "green", worst: "energy",
    weather: "sunny", trend: "up", message: "All resources healthy",
  },
];

/* ── Component ── */

export default function EcoLedger() {
  const [data, setData] = useState<ApiData | null>(null);
  const [time, setTime] = useState(clock);
  const [mode, setMode] = useState<"live" | "demo">("live");
  const demoIndexRef = useRef(0);

  const handleMakeCall = async () => {
    try {
      const res = await fetch(`${API_BASE}/make-call`);
      const data = await res.json();
      if (!res.ok || data.error) {
        console.error("Call trigger error:", data.error ?? `HTTP ${res.status}`);
        return;
      }
      console.log("IVR call requested", data);
    } catch (err) {
      console.error("Call trigger error:", err);
    }
  };

  const fetchData = useCallback(async () => {
    try {
      const res = await fetch(`${API_BASE}/get-status`);
      const json = await res.json();
      console.log("LIVE:", json);
      setData(json);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  }, []);

  useEffect(() => {
    let dataInterval: ReturnType<typeof setInterval>;

    if (mode === "live") {
      fetchData();
      dataInterval = setInterval(fetchData, 3000);
    } else {
      // Demo: immediately show first scenario, then cycle
      setData(DEMO_SCENARIOS[demoIndexRef.current]);
      dataInterval = setInterval(() => {
        demoIndexRef.current = (demoIndexRef.current + 1) % DEMO_SCENARIOS.length;
        const scenario = DEMO_SCENARIOS[demoIndexRef.current];
        console.log("DEMO:", scenario);
        setData(scenario);
      }, 3000);
    }

    const clockInterval = setInterval(() => setTime(clock()), 1000);
    return () => { clearInterval(dataInterval); clearInterval(clockInterval); };
  }, [mode, fetchData]);

  /* ── Null guard ── */
  if (!data) return null;

  /* ── Map raw API values → component props ── */
  const status: SystemStatus =
    (["green", "yellow", "red"] as const).includes(data.status as SystemStatus)
      ? (data.status as SystemStatus)
      : "red";

  const worst: ResourceKey =
    data.worst && (["water", "waste", "energy"] as const).includes(data.worst as ResourceKey)
      ? (data.worst as ResourceKey)
      : "water";

  const trend: Trend = data.trend === "up" ? "up" : "down";

  const waterLevel  = statusToLevel(data.water_status  ?? "good");
  const wasteLevel  = statusToLevel(data.waste_status  ?? "good");
  const energyLevel = statusToLevel(data.energy_status ?? "good");
  const levels: Record<ResourceKey, ResourceLevel> = {
    water: waterLevel,
    waste: wasteLevel,
    energy: energyLevel,
  };

  const history = statusToHistory(status);
  const streak  = computeStreak(history);

  const log: LogEntry = {
    text: data.message ?? "No data yet",
    verifiedBy: "System",
    timeAgo: "just now",
  };

  return (
    <div style={{
      width: "100vw",
      height: "100vh",
      background: `#0c0c0c`,
      color: "#e0e0e0",
      fontFamily: "'Inter', sans-serif",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      boxSizing: "border-box",
      position: "relative",
      // Full-screen emotional background tint
      backgroundImage: `radial-gradient(ellipse at 50% 0%, ${BG_TINT[status]} 0%, transparent 70%)`,
    }}>
      <FloatingNav />

      {/* ── HEADER ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 44px",
        borderBottom: SEP,
        flexShrink: 0,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <span style={{
            fontSize: "0.9rem",
            fontWeight: 800,
            letterSpacing: "0.25em",
            color: "#e0e0e0",
          }}>
            ECO-LEDGER
          </span>
          <SyncIndicator isOnline={true} />
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <button
            onClick={() => setMode(mode === "live" ? "demo" : "live")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              padding: "4px 12px",
              borderRadius: 20,
              border: `1px solid ${mode === "live" ? "#00E67633" : "#FFD00033"}`,
              background: mode === "live" ? "#00E67612" : "#FFD00012",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              fontSize: "0.5rem",
              fontWeight: 700,
              letterSpacing: "0.2em",
              color: mode === "live" ? "#00E676" : "#FFD000",
              transition: "all 0.2s ease",
            }}
          >
            <span style={{
              width: 6, height: 6, borderRadius: "50%",
              background: mode === "live" ? "#00E676" : "#FFD000",
              boxShadow: `0 0 6px ${mode === "live" ? "#00E676" : "#FFD000"}`,
            }} />
            {mode === "live" ? "LIVE DATA" : "DEMO MODE"}
          </button>
          <span style={{
            fontSize: "0.8rem",
            fontWeight: 600,
            letterSpacing: "0.15em",
            color: "#2a2a2a",
            fontVariantNumeric: "tabular-nums",
          }}>
            {time}
          </span>
        </div>
      </div>

      {/* ── MAIN GRID ── */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "340px 1fr",
        minHeight: 0,
      }}>

        {/* LEFT: Status circle */}
        <div style={{ borderRight: SEP }}>
          <StatusPanel status={status} />
        </div>

        {/* RIGHT: Resources (top) + Action / Weather (bottom) */}
        <div style={{ display: "flex", flexDirection: "column" }}>

          {/* Resources row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            flex: "0 0 50%",
            minHeight: 0,
            borderBottom: SEP,
          }}>
            {RESOURCES.map((r, i) => (
              <div key={r} style={{
                borderRight: i < 2 ? SEP : undefined,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                <ResourcePanel
                  resource={r}
                  level={levels[r]}
                  isWorst={worst === r}
                />
              </div>
            ))}
          </div>

          {/* Action + Weather row */}
          <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            flex: 1,
            minHeight: 0,
          }}>
            <div style={{ borderRight: SEP }}>
              <ActionPanel worst={worst} />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <WeatherPanel
                history={history}
                trend={trend}
                streak={streak}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── VERIFICATION LOG ── */}
      <VerificationLog entry={log} />

      {/* ── FOOTER ── */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "8px 44px",
        borderTop: SEP,
        flexShrink: 0,
      }}>
        <span style={{
          fontSize: "0.5rem",
          letterSpacing: "0.25em",
          color: "#222",
          fontFamily: "'Inter', sans-serif",
        }}>
          UNIT EL-MOMBASA-01
        </span>
        <span style={{
          fontSize: "0.5rem",
          letterSpacing: "0.25em",
          color: "#222",
        }}>
          PUBLIC INFORMATION DISPLAY · REFRESHES EVERY 3s
        </span>
      </div>

      {/* ── VOICE BUTTON ── */}
      <VoiceButton status={status} ciuScore={data.ciu_score} />

      {/* ── HINDI SPEAKER ── */}
      <HindiSpeaker status={status} />

      <button
        type="button"
        onClick={handleMakeCall}
        style={{
          position: "fixed",
          right: 20,
          top: 84,
          zIndex: 61,
          borderRadius: 12,
          border: "1px solid rgba(255, 255, 255, 0.1)",
          background: "rgba(15, 15, 15, 0.92)",
          color: "#e5e7eb",
          padding: "10px 12px",
          fontSize: 12,
          fontWeight: 600,
          letterSpacing: "0.04em",
          boxShadow: "0 14px 32px rgba(0, 0, 0, 0.35)",
          cursor: "pointer",
        }}
      >
        📞 Call Me (IVR Demo)
      </button>

      <FakeSMSPanel />

    </div>
  );
}


