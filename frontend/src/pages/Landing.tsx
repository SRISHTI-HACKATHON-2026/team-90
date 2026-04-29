import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";

export default function Landing() {
  const navigate = useNavigate();

  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        background: "#0c0c0c",
        color: "#e0e0e0",
        fontFamily: "'Inter', sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient background glow */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 50% 40%, rgba(0,230,118,0.06) 0%, transparent 65%)",
          pointerEvents: "none",
        }}
      />

      {/* Grid lines background */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
          pointerEvents: "none",
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 48,
          position: "relative",
          zIndex: 1,
        }}
      >
        {/* Logo / Title */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.1, ease: "easeOut" }}
            style={{
              width: 64,
              height: 64,
              borderRadius: 16,
              background: "rgba(0,230,118,0.1)",
              border: "1px solid rgba(0,230,118,0.3)",
              boxShadow: "0 0 32px rgba(0,230,118,0.15)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              marginBottom: 8,
            }}
          >
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="16" cy="16" r="12" stroke="#00E676" strokeWidth="2" fill="none" />
              <circle cx="16" cy="16" r="5" fill="#00E676" />
              <path d="M8 8 A12 12 0 0 1 24 8" stroke="#00E676" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
              <path d="M24 24 A12 12 0 0 1 8 24" stroke="#00E676" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
            </svg>
          </motion.div>

          <h1
            style={{
              fontSize: "3rem",
              fontWeight: 900,
              letterSpacing: "0.2em",
              color: "#e0e0e0",
              textTransform: "uppercase",
              margin: 0,
              textShadow: "0 0 40px rgba(0,230,118,0.2)",
            }}
          >
            Eco-Ledger
          </h1>

          <p
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.35em",
              color: "rgba(0,230,118,0.7)",
              textTransform: "uppercase",
              margin: 0,
            }}
          >
            Sovereign Resource Intelligence Platform
          </p>
        </div>

        {/* Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
          style={{
            display: "flex",
            gap: 20,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <LandingButton
            label="Kiosk Mode"
            subtitle="Community Display"
            color="#00E676"
            onClick={() => navigate("/")}
          />
          <LandingButton
            label="Admin Dashboard"
            subtitle="Command & Control"
            color="#10B981"
            onClick={() => navigate("/admin")}
          />
        </motion.div>

        {/* Footer note */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          style={{
            fontSize: "0.55rem",
            letterSpacing: "0.3em",
            color: "#2a2a2a",
            textTransform: "uppercase",
          }}
        >
          UNIT EL-MOMBASA-01 · SELECT INTERFACE
        </motion.p>
      </motion.div>
    </div>
  );
}

function LandingButton({
  label,
  subtitle,
  color,
  onClick,
}: {
  label: string;
  subtitle: string;
  color: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 6,
        padding: "24px 48px",
        borderRadius: 16,
        border: `1px solid ${color}33`,
        background: `${color}0d`,
        cursor: "pointer",
        fontFamily: "'Inter', sans-serif",
        transition: "all 0.2s ease",
        minWidth: 200,
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = `${color}1a`;
        el.style.boxShadow = `0 0 32px ${color}22`;
        el.style.borderColor = `${color}66`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget as HTMLButtonElement;
        el.style.background = `${color}0d`;
        el.style.boxShadow = "none";
        el.style.borderColor = `${color}33`;
      }}
    >
      <span
        style={{
          fontSize: "1.1rem",
          fontWeight: 800,
          letterSpacing: "0.15em",
          color,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: "0.55rem",
          fontWeight: 600,
          letterSpacing: "0.25em",
          color: `${color}99`,
          textTransform: "uppercase",
        }}
      >
        {subtitle}
      </span>
    </button>
  );
}
