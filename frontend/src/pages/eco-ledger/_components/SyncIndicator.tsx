
/** Sync / offline indicator */
export default function SyncIndicator({ isOnline }: { isOnline: boolean }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: 5,
    }}>
      {/* Satellite SVG */}
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="7" cy="7" r="6" stroke={isOnline ? "#00E676" : "#FF4B4B"} strokeWidth="1.5" fill="none" />
        <circle cx="7" cy="7" r="2.5" fill={isOnline ? "#00E676" : "#FF4B4B"} />
        {/* Signal arcs */}
        {isOnline && (
          <>
            <path d="M3.5 3.5 A5 5 0 0 1 10.5 3.5" stroke="#00E676" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
            <path d="M10.5 10.5 A5 5 0 0 1 3.5 10.5" stroke="#00E676" strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.6" />
          </>
        )}
      </svg>
      <span style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: "0.5rem",
        fontWeight: 700,
        letterSpacing: "0.2em",
        color: isOnline ? "#00E676" : "#FF4B4B",
      }}>
        {isOnline ? "LIVE" : "OFFLINE"}
      </span>
    </div>
  );
}

