import type { SystemStatus } from "../../../lib/mockData.ts";

const CFG: Record<SystemStatus, { color: string; face: string; word: string }> = {
  green:  { color: "#00E676", face: "😊", word: "GOOD"     },
  yellow: { color: "#FFD000", face: "😐", word: "WARNING"  },
  red:    { color: "#FF4B4B", face: "😰", word: "CRITICAL" },
};

export default function StatusPanel({ status }: { status: SystemStatus }) {
  const { color, face, word } = CFG[status];
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      height: "100%",
    }}>
      <div style={{
        width: 280,
        height: 280,
        borderRadius: "50%",
        border: `7px solid ${color}`,
        background: `${color}12`,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 10,
        flexShrink: 0,
      }}>
        <span style={{ fontSize: "4rem", lineHeight: 1 }}>{face}</span>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.7rem",
          fontWeight: 800,
          letterSpacing: "0.3em",
          color,
        }}>
          {word}
        </span>
      </div>
    </div>
  );
}

