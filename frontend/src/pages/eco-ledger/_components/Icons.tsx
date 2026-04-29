/** Literal object icons for ultra-low-literacy recognition */

export function JerrycanIcon({ size = 48, color = "#e0e0e0" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body — taller, fills more of viewBox */}
      <rect x="7" y="14" width="30" height="28" rx="4" fill={color} opacity="0.9" />
      {/* Handle — thicker arc */}
      <path d="M15 14 C15 5, 33 5, 33 14" stroke={color} strokeWidth="4.5" fill="none" strokeLinecap="round" />
      {/* Spout — wider */}
      <rect x="18" y="7" width="12" height="8" rx="2.5" fill={color} />
      {/* Cap on spout */}
      <rect x="17" y="5" width="14" height="4" rx="2" fill={color} opacity="0.7" />
      {/* Horizontal ridges */}
      <line x1="10" y1="25" x2="38" y2="25" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
      <line x1="10" y1="32" x2="38" y2="32" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
      <line x1="10" y1="39" x2="38" y2="39" stroke="rgba(0,0,0,0.15)" strokeWidth="2" />
    </svg>
  );
}

export function TrashBagIcon({ size = 48, color = "#e0e0e0" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bag body — larger ellipse, lower center */}
      <ellipse cx="24" cy="32" rx="16" ry="13" fill={color} opacity="0.9" />
      {/* Neck */}
      <rect x="17" y="13" width="14" height="12" rx="3" fill={color} opacity="0.9" />
      {/* Left tie ribbon */}
      <path d="M20 13 C19 7, 13 6, 15 11" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Right tie ribbon */}
      <path d="M28 13 C29 7, 35 6, 33 11" stroke={color} strokeWidth="3" fill="none" strokeLinecap="round" />
      {/* Knot */}
      <ellipse cx="24" cy="13" rx="4.5" ry="3" fill={color} />
      {/* Bag highlight fold */}
      <path d="M14 28 Q16 22 20 26" stroke="rgba(0,0,0,0.1)" strokeWidth="2" fill="none" strokeLinecap="round" />
    </svg>
  );
}

export function LightbulbIcon({ size = 48, color = "#e0e0e0" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bulb glass — bigger circle */}
      <circle cx="24" cy="20" r="13" fill={color} opacity="0.9" />
      {/* Base segments — wider */}
      <rect x="18" y="33" width="12" height="5" rx="1.5" fill={color} opacity="0.8" />
      <rect x="19" y="38" width="10" height="4" rx="1.5" fill={color} opacity="0.65" />
      {/* Flat base cap */}
      <rect x="20" y="42" width="8" height="2.5" rx="1.5" fill={color} opacity="0.5" />
      {/* Rays — longer, evenly distributed */}
      <line x1="24" y1="4" x2="24" y2="1" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="8" x2="38.5" y2="5.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="41" y1="20" x2="44" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="36" y1="32" x2="38.5" y2="34.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="8" x2="9.5" y2="5.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="7" y1="20" x2="4" y2="20" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      <line x1="12" y1="32" x2="9.5" y2="34.5" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
      {/* Filament hint */}
      <path d="M20 22 Q24 17 28 22" stroke="rgba(0,0,0,0.15)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}

type ActionIconProps = { resource: "water" | "waste" | "energy"; size?: number };

/** Illustrated action icons — silhouette-style visual verbs */
export function ActionIcon({ resource, size = 64 }: ActionIconProps) {
  if (resource === "water") {
    // Person closing a tap — bigger figure, thicker strokes, tap fills more space
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="14" cy="10" r="7" fill="#e0e0e0" />
        {/* Body */}
        <line x1="14" y1="17" x2="14" y2="38" stroke="#e0e0e0" strokeWidth="5" strokeLinecap="round" />
        {/* Arm reaching to tap */}
        <line x1="14" y1="26" x2="34" y2="26" stroke="#e0e0e0" strokeWidth="5" strokeLinecap="round" />
        {/* Tap body */}
        <rect x="34" y="19" width="9" height="14" rx="3" fill="#e0e0e0" />
        {/* Tap pipe going down */}
        <line x1="38.5" y1="33" x2="38.5" y2="40" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
        {/* Tap handle (horizontal lever) */}
        <line x1="32" y1="19" x2="45" y2="19" stroke="#e0e0e0" strokeWidth="3.5" strokeLinecap="round" />
        {/* No-water X badge */}
        <circle cx="54" cy="12" r="8" fill="rgba(255,75,75,0.15)" />
        <line x1="49" y1="7" x2="59" y2="17" stroke="#FF4B4B" strokeWidth="3" strokeLinecap="round" />
        <line x1="59" y1="7" x2="49" y2="17" stroke="#FF4B4B" strokeWidth="3" strokeLinecap="round" />
        {/* Legs */}
        <line x1="14" y1="38" x2="8" y2="56" stroke="#e0e0e0" strokeWidth="5" strokeLinecap="round" />
        <line x1="14" y1="38" x2="20" y2="56" stroke="#e0e0e0" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }

  if (resource === "waste") {
    // Person putting bag in bin — bin is large and prominent, person is clear
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Head */}
        <circle cx="12" cy="10" r="7" fill="#e0e0e0" />
        {/* Body */}
        <line x1="12" y1="17" x2="12" y2="38" stroke="#e0e0e0" strokeWidth="5" strokeLinecap="round" />
        {/* Arm with bag */}
        <line x1="12" y1="24" x2="28" y2="24" stroke="#e0e0e0" strokeWidth="5" strokeLinecap="round" />
        {/* Bag in hand */}
        <ellipse cx="32" cy="22" rx="6" ry="7" fill="#e0e0e0" />
        <line x1="30" y1="15" x2="28" y2="11" stroke="#e0e0e0" strokeWidth="2.5" strokeLinecap="round" />
        <line x1="34" y1="15" x2="36" y2="11" stroke="#e0e0e0" strokeWidth="2.5" strokeLinecap="round" />
        {/* Bin lid */}
        <rect x="42" y="26" width="18" height="4" rx="2" fill="#e0e0e0" />
        {/* Bin body */}
        <rect x="44" y="30" width="14" height="28" rx="3" fill="#e0e0e0" opacity="0.9" />
        {/* Bin vertical lines */}
        <line x1="51" y1="33" x2="51" y2="55" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
        <line x1="55" y1="33" x2="55" y2="55" stroke="rgba(0,0,0,0.12)" strokeWidth="1.5" />
        {/* Drop arrow */}
        <line x1="36" y1="29" x2="43" y2="29" stroke="#00E676" strokeWidth="3" strokeLinecap="round" strokeDasharray="2 2" />
        {/* Legs */}
        <line x1="12" y1="38" x2="6" y2="56" stroke="#e0e0e0" strokeWidth="5" strokeLinecap="round" />
        <line x1="12" y1="38" x2="18" y2="56" stroke="#e0e0e0" strokeWidth="5" strokeLinecap="round" />
      </svg>
    );
  }

  // Energy: person flipping a large wall switch off
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Head */}
      <circle cx="12" cy="10" r="7" fill="#e0e0e0" />
      {/* Body */}
      <line x1="12" y1="17" x2="12" y2="38" stroke="#e0e0e0" strokeWidth="5" strokeLinecap="round" />
      {/* Arm raised to switch */}
      <line x1="12" y1="22" x2="34" y2="16" stroke="#e0e0e0" strokeWidth="5" strokeLinecap="round" />
      {/* Switch housing */}
      <rect x="34" y="8" width="12" height="22" rx="4" fill="#e0e0e0" />
      {/* Switch paddle — in OFF position (down) */}
      <rect x="37" y="18" width="6" height="10" rx="2" fill="#555" />
      {/* Switch label OFF */}
      <rect x="37" y="10" width="6" height="6" rx="1.5" fill="rgba(0,0,0,0.1)" />
      {/* Struck-out bulb top right */}
      <circle cx="54" cy="14" r="8" fill="#e0e0e0" opacity="0.25" />
      <line x1="49" y1="9" x2="59" y2="19" stroke="#FF4B4B" strokeWidth="3" strokeLinecap="round" />
      <line x1="59" y1="9" x2="49" y2="19" stroke="#FF4B4B" strokeWidth="3" strokeLinecap="round" />
      {/* Legs */}
      <line x1="12" y1="38" x2="6" y2="56" stroke="#e0e0e0" strokeWidth="5" strokeLinecap="round" />
      <line x1="12" y1="38" x2="18" y2="56" stroke="#e0e0e0" strokeWidth="5" strokeLinecap="round" />
    </svg>
  );
}