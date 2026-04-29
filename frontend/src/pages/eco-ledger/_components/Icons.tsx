/** Literal object icons for ultra-low-literacy recognition */

export function JerrycanIcon({ size = 48, color = "#e0e0e0" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="10" y="16" width="28" height="26" rx="3" fill={color} opacity="0.9" />
      {/* Handle */}
      <path d="M18 16 C18 8, 30 8, 30 16" stroke={color} strokeWidth="3.5" fill="none" strokeLinecap="round" />
      {/* Spout */}
      <rect x="20" y="10" width="8" height="6" rx="1.5" fill={color} />
      {/* Horizontal ridges */}
      <line x1="13" y1="27" x2="35" y2="27" stroke="#0006" strokeWidth="1.5" />
      <line x1="13" y1="33" x2="35" y2="33" stroke="#0006" strokeWidth="1.5" />
    </svg>
  );
}

export function TrashBagIcon({ size = 48, color = "#e0e0e0" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bag body */}
      <ellipse cx="24" cy="30" rx="14" ry="14" fill={color} opacity="0.9" />
      {/* Bag neck */}
      <rect x="18" y="12" width="12" height="10" rx="2" fill={color} opacity="0.9" />
      {/* Tie knot */}
      <path d="M21 12 C21 8, 17 7, 18 11" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <path d="M27 12 C27 8, 31 7, 30 11" stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" />
      <ellipse cx="24" cy="12" rx="3.5" ry="2" fill={color} />
    </svg>
  );
}

export function LightbulbIcon({ size = 48, color = "#e0e0e0" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bulb glass */}
      <circle cx="24" cy="20" r="11" fill={color} opacity="0.9" />
      {/* Base segments */}
      <rect x="19" y="31" width="10" height="4" rx="1" fill={color} opacity="0.75" />
      <rect x="20" y="35" width="8" height="3" rx="1" fill={color} opacity="0.6" />
      {/* Rays */}
      <line x1="24" y1="5" x2="24" y2="2" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="35" y1="9" x2="37" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="38" y1="20" x2="41" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="13" y1="9" x2="11" y2="7" stroke={color} strokeWidth="2" strokeLinecap="round" />
      <line x1="10" y1="20" x2="7" y2="20" stroke={color} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

type ActionIconProps = { resource: "water" | "waste" | "energy"; size?: number };

/** Illustrated action icons — silhouette-style visual verbs */
export function ActionIcon({ resource, size = 64 }: ActionIconProps) {
  if (resource === "water") {
    // Person closing a tap
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Person head */}
        <circle cx="20" cy="12" r="6" fill="#e0e0e0" />
        {/* Body */}
        <line x1="20" y1="18" x2="20" y2="36" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
        {/* Arm reaching to tap */}
        <line x1="20" y1="26" x2="38" y2="26" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
        {/* Tap */}
        <rect x="38" y="20" width="6" height="12" rx="2" fill="#e0e0e0" />
        <line x1="41" y1="20" x2="41" y2="16" stroke="#e0e0e0" strokeWidth="3" strokeLinecap="round" />
        {/* X = off */}
        <line x1="48" y1="10" x2="58" y2="20" stroke="#FF4B4B" strokeWidth="3" strokeLinecap="round" />
        <line x1="58" y1="10" x2="48" y2="20" stroke="#FF4B4B" strokeWidth="3" strokeLinecap="round" />
        {/* Legs */}
        <line x1="20" y1="36" x2="14" y2="52" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
        <line x1="20" y1="36" x2="26" y2="52" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }
  if (resource === "waste") {
    // Person putting bag in bin
    return (
      <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Person head */}
        <circle cx="16" cy="12" r="6" fill="#e0e0e0" />
        {/* Body */}
        <line x1="16" y1="18" x2="16" y2="36" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
        {/* Arm with bag */}
        <line x1="16" y1="24" x2="32" y2="24" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
        {/* Bag in hand */}
        <ellipse cx="36" cy="22" rx="5" ry="6" fill="#e0e0e0" />
        {/* Bin */}
        <rect x="44" y="28" width="14" height="20" rx="2" fill="#e0e0e0" />
        <rect x="42" y="26" width="18" height="4" rx="2" fill="#e0e0e0" />
        {/* Arrow down into bin */}
        <line x1="36" y1="28" x2="48" y2="36" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round" />
        <polyline points="44,35 48,36 48,32" fill="none" stroke="#00E676" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
        {/* Legs */}
        <line x1="16" y1="36" x2="10" y2="52" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
        <line x1="16" y1="36" x2="22" y2="52" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
      </svg>
    );
  }
  // Energy: person switching off light
  return (
    <svg width={size} height={size} viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Person head */}
      <circle cx="16" cy="12" r="6" fill="#e0e0e0" />
      {/* Body */}
      <line x1="16" y1="18" x2="16" y2="36" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
      {/* Arm to switch */}
      <line x1="16" y1="24" x2="36" y2="20" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
      {/* Switch */}
      <rect x="36" y="14" width="8" height="14" rx="3" fill="#e0e0e0" />
      <circle cx="40" cy="25" r="3" fill="#333" />
      {/* Bulb crossed out */}
      <circle cx="52" cy="18" r="7" fill="#e0e0e0" opacity="0.3" />
      <line x1="47" y1="13" x2="57" y2="23" stroke="#FF4B4B" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="57" y1="13" x2="47" y2="23" stroke="#FF4B4B" strokeWidth="2.5" strokeLinecap="round" />
      {/* Legs */}
      <line x1="16" y1="36" x2="10" y2="52" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
      <line x1="16" y1="36" x2="22" y2="52" stroke="#e0e0e0" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
