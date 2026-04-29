import { useState } from "react";

type SendMode = "verified" | "observation";

const BACKEND_URL = "http://127.0.0.1:5000/simulate-sms";
const RESOURCES = ["water", "waste", "energy"] as const;

export default function FakeSMSPanel() {
  const [message, setMessage] = useState("");
  const [lastMessage, setLastMessage] = useState("");
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);

  const sendPayload = async (mode: SendMode, resource?: string, value?: number) => {
    setSending(true);
    setSent(false);

    try {
      const fallbackResource = RESOURCES[Math.floor(Math.random() * RESOURCES.length)];
      const selectedResource = mode === "verified" && resource ? resource : fallbackResource;
      const selectedValue = mode === "verified" && value !== undefined ? value : 120;
      const url = `${BACKEND_URL}?resource=${selectedResource}&value=${selectedValue}`;

      await fetch(url);

      setLastMessage(`${selectedResource} ${selectedValue}`);
      setMessage("");
      setSent(true);
    } catch (error) {
      console.error("Fake SMS send failed:", error);
      setSent(false);
    } finally {
      setSending(false);
    }
  };

  const handleSend = async () => {
    const parts = message.toLowerCase().trim().split(" ").filter(Boolean);

    if (parts.length === 2 && !Number.isNaN(Number(parts[1]))) {
      await sendPayload("verified", parts[0], Number(parts[1]));
      return;
    }

    await sendPayload("observation");
  };

  const sendQuickAlert = async (resource: string, value: number) => {
    setMessage(`${resource} ${value}`);
    await sendPayload("verified", resource, value);
  };

  return (
    <div
      style={{
        position: "fixed",
        right: 20,
        bottom: 20,
        width: 300,
        background: "rgba(15, 15, 15, 0.96)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: 16,
        boxShadow: "0 18px 48px rgba(0, 0, 0, 0.45)",
        backdropFilter: "blur(12px)",
        color: "#e5e7eb",
        zIndex: 60,
        padding: 14,
        fontFamily: "Inter, sans-serif",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase" }}>
            SMS Input (Demo)
          </div>
          <div style={{ fontSize: 11, color: "rgba(229, 231, 235, 0.6)", marginTop: 2 }}>
            Simulates basic phone input
          </div>
        </div>
        {sent ? (
          <span style={{ fontSize: 11, color: "#34d399", fontWeight: 600 }}>Sent ✓</span>
        ) : null}
      </div>

      <textarea
        value={message}
        onChange={(event) => setMessage(event.target.value)}
        placeholder="Type message e.g. water 50"
        rows={3}
        style={{
          width: "100%",
          resize: "none",
          borderRadius: 12,
          border: "1px solid rgba(255, 255, 255, 0.08)",
          background: "rgba(255, 255, 255, 0.03)",
          color: "#f3f4f6",
          padding: "10px 12px",
          outline: "none",
          fontSize: 13,
          lineHeight: 1.5,
          boxSizing: "border-box",
        }}
      />

      <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
        <button
          type="button"
          onClick={handleSend}
          disabled={sending}
          style={{
            flex: 1,
            border: "1px solid rgba(255, 255, 255, 0.08)",
            background: sending ? "rgba(255,255,255,0.05)" : "#111827",
            color: "#f9fafb",
            borderRadius: 10,
            padding: "9px 12px",
            fontSize: 12,
            fontWeight: 600,
            cursor: sending ? "not-allowed" : "pointer",
          }}
        >
          Send
        </button>
      </div>

      <div style={{ display: "flex", gap: 8, marginTop: 10, flexWrap: "wrap" }}>
        <button
          type="button"
          onClick={() => sendQuickAlert("water", 20)}
          style={quickButtonStyle}
        >
          💧 Water Alert
        </button>
        <button
          type="button"
          onClick={() => sendQuickAlert("waste", 80)}
          style={quickButtonStyle}
        >
          ♻ Waste Alert
        </button>
        <button
          type="button"
          onClick={() => sendQuickAlert("energy", 120)}
          style={quickButtonStyle}
        >
          ⚡ Energy Alert
        </button>
      </div>

      <div style={{ marginTop: 10, fontSize: 11, color: "rgba(229, 231, 235, 0.65)" }}>
        Last: {lastMessage || "No messages sent yet"}
      </div>
    </div>
  );
}

const quickButtonStyle: React.CSSProperties = {
  border: "1px solid rgba(255, 255, 255, 0.08)",
  background: "rgba(255, 255, 255, 0.03)",
  color: "#e5e7eb",
  borderRadius: 999,
  padding: "7px 10px",
  fontSize: 11,
  fontWeight: 600,
  cursor: "pointer",
};
