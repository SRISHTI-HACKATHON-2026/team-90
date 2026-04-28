import { useEffect, useState } from "react";
import { getMockData } from "../../lib/mockData.ts";
import type { MockData, SystemStatus } from "../../lib/mockData.ts";
import StatusPanel       from "./_components/StatusPanel.tsx";
import ResourcePanel     from "./_components/ResourcePanel.tsx";
import ActionPanel       from "./_components/ActionPanel.tsx";
import WeatherPanel      from "./_components/WeatherPanel.tsx";
import VerificationLog   from "./_components/VerificationLog.tsx";
import SyncIndicator     from "./_components/SyncIndicator.tsx";
import VoiceButton       from "./_components/VoiceButton.tsx";

const RESOURCES = ["water", "waste", "energy"] as const;

function clock() {
  return new Date().toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

/** Emotional background: muted tint of system status color */
const BG_TINT: Record<SystemStatus, string> = {
  green:  "#00E67609",
  yellow: "#FFD00009",
  red:    "#FF4B4B09",
};

const SEP = "1px solid #1c1c1c";

export default function EcoLedger() {
  const [data, setData] = useState<MockData>(getMockData);
  const [time, setTime] = useState(clock);

  useEffect(() => {
    const d = setInterval(() => setData(getMockData()), 5000);
    const c = setInterval(() => setTime(clock()), 1000);
    return () => { clearInterval(d); clearInterval(c); };
  }, []);

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
      backgroundImage: `radial-gradient(ellipse at 50% 0%, ${BG_TINT[data.status]} 0%, transparent 70%)`,
    }}>

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
          <SyncIndicator isOnline={data.isOnline} />
        </div>
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

      {/* ── MAIN GRID ── */}
      <div style={{
        flex: 1,
        display: "grid",
        gridTemplateColumns: "340px 1fr",
        minHeight: 0,
      }}>

        {/* LEFT: Status circle */}
        <div style={{ borderRight: SEP }}>
          <StatusPanel status={data.status} />
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
                  level={data[r]}
                  isWorst={data.worst === r}
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
              <ActionPanel worst={data.worst} />
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <WeatherPanel
                history={data.history}
                trend={data.trend}
                streak={data.streak}
              />
            </div>
          </div>

        </div>
      </div>

      {/* ── VERIFICATION LOG ── */}
      <VerificationLog entry={data.log} />

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
          PUBLIC INFORMATION DISPLAY · REFRESHES EVERY 5s
        </span>
      </div>

      {/* ── VOICE BUTTON ── */}
      <VoiceButton status={data.status} />

    </div>
  );
}
