import type { LogEntry } from "../../../lib/mockData.ts";

export default function VerificationLog({ entry }: { entry: LogEntry }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 10,
      padding: "10px 44px",
      borderTop: "1px solid #1a1a1a",
    }}>
      {/* Checkmark trust token */}
      <span style={{ fontSize: "0.9rem", color: "#00E676", flexShrink: 0 }}>✔</span>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.65rem",
        fontWeight: 700,
        color: "#444",
        letterSpacing: "0.05em",
      }}>
        {entry.text}
      </span>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.6rem",
        color: "#2e2e2e",
        marginLeft: 4,
      }}>
        — Verified by {entry.verifiedBy} · {entry.timeAgo}
      </span>
    </div>
  );
}
