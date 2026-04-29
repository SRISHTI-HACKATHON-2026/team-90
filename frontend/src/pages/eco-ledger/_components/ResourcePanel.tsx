import type { ResourceKey, ResourceLevel } from "../../../lib/mockData.ts";
import { JerrycanIcon, TrashBagIcon, LightbulbIcon } from "./Icons.tsx";

const LABELS: Record<ResourceKey, string> = {
  water: "WATER",
  waste: "WASTE",
  energy: "ENERGY",
};

const STATUS_FACE: Record<ResourceLevel, string> = {
  low: "😊",
  medium: "😐",
  high: "😰",
};

const STATUS_COLOR: Record<ResourceLevel, string> = {
  low: "#00E676",
  medium: "#FFD000",
  high: "#FF4B4B",
};

function ResourceIcon({ resource, size, color }: { resource: ResourceKey; size: number; color: string }) {
  if (resource === "water") return <JerrycanIcon size={size} color={color} />;
  if (resource === "waste") return <TrashBagIcon size={size} color={color} />;
  return <LightbulbIcon size={size} color={color} />;
}

type Props = { resource: ResourceKey; level: ResourceLevel; isWorst: boolean };

export default function ResourcePanel({ resource, level, isWorst }: Props) {
  const color = STATUS_COLOR[level];
  const iconSize = isWorst ? 52 : 40;

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 14,
      height: "100%",
      padding: "20px 12px",
      borderTop: isWorst ? `3px solid ${color}` : "3px solid transparent",
      boxSizing: "border-box",
    }}>
      <ResourceIcon resource={resource} size={iconSize} color={isWorst ? color : "#555"} />
      <span style={{ fontSize: isWorst ? "2rem" : "1.6rem", lineHeight: 1 }}>
        {STATUS_FACE[level]}
      </span>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.55rem",
        fontWeight: 700,
        letterSpacing: "0.3em",
        color: isWorst ? color : "#3a3a3a",
      }}>
        {LABELS[resource]}
      </span>
    </div>
  );
}
