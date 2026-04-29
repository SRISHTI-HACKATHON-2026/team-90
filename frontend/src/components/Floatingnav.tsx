import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const NAV_ITEMS = [
  { label: "Home", path: "/home" },
  { label: "Kiosk", path: "/" },
  { label: "Admin", path: "/admin" },
];

export default function FloatingNav() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <div
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 8,
      }}
    >
      {/* Dropdown menu */}
      {open && (
        <div
          style={{
            background: "rgba(12,12,12,0.96)",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 12,
            overflow: "hidden",
            boxShadow: "0 16px 40px rgba(0,0,0,0.5)",
            backdropFilter: "blur(12px)",
            minWidth: 140,
          }}
        >
          {NAV_ITEMS.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => {
                  navigate(item.path);
                  setOpen(false);
                }}
                style={{
                  display: "block",
                  width: "100%",
                  padding: "10px 16px",
                  textAlign: "left",
                  background: isActive ? "rgba(0,230,118,0.1)" : "transparent",
                  border: "none",
                  borderBottom: "1px solid rgba(255,255,255,0.05)",
                  cursor: "pointer",
                  fontFamily: "'Inter', sans-serif",
                  fontSize: "0.7rem",
                  fontWeight: 700,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  color: isActive ? "#00E676" : "#e0e0e0",
                  transition: "background 0.15s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.05)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) (e.currentTarget as HTMLButtonElement).style.background = "transparent";
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>
      )}

      {/* Toggle button */}
      <button
        onClick={() => setOpen((v) => !v)}
        title="Navigation"
        style={{
          width: 40,
          height: 40,
          borderRadius: "50%",
          background: open ? "rgba(0,230,118,0.15)" : "rgba(12,12,12,0.9)",
          border: `1px solid ${open ? "rgba(0,230,118,0.4)" : "rgba(255,255,255,0.12)"}`,
          boxShadow: open ? "0 0 16px rgba(0,230,118,0.2)" : "0 4px 16px rgba(0,0,0,0.4)",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backdropFilter: "blur(8px)",
          transition: "all 0.2s ease",
          color: open ? "#00E676" : "#e0e0e0",
          fontSize: 16,
        }}
      >
        ☰
      </button>
    </div>
  );
}

