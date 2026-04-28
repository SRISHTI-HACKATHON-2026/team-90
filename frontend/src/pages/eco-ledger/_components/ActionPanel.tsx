import type { ResourceKey } from "../../../lib/mockData.ts";
import { ActionIcon } from "./Icons.tsx";

const ACTION_TEXT: Record<ResourceKey, string> = {
  water:  "USE LESS WATER",
  waste:  "CLEAR WASTE AREA",
  energy: "SAVE ELECTRICITY",
};

export default function ActionPanel({ worst }: { worst: ResourceKey }) {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "flex-start",
      padding: "0 48px",
      gap: 16,
      width: "100%",
      height: "100%",
      boxSizing: "border-box",
    }}>
      {/* Illustrated visual verb */}
      <ActionIcon resource={worst} size={72} />

      {/* Minimal text fallback */}
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "0.55rem",
          fontWeight: 700,
          letterSpacing: "0.3em",
          color: "#3a3a3a",
        }}>
          ⚠ ACTION REQUIRED
        </span>
        <span style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "1.6rem",
          fontWeight: 800,
          letterSpacing: "0.05em",
          color: "#FF4B4B",
          lineHeight: 1.15,
        }}>
          {ACTION_TEXT[worst]}
        </span>
      </div>
    </div>
  );
}
