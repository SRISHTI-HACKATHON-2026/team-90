/** Voice button — large, accessible, bottom-right */

const STATUS_MESSAGES: Record<string, string> = {
  green: "Our community status is Green. We are doing well. Keep saving water, waste, and energy.",
  yellow: "Our community status is Yellow. We need to take action. Please follow the instructions on screen.",
  red: "Our community status is Red. This is critical. Immediate action is required. Please act now.",
};

export default function VoiceButton({ status }: { status: "green" | "yellow" | "red" }) {
  const speak = () => {
    if (!("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const msg = new SpeechSynthesisUtterance(STATUS_MESSAGES[status]);
    msg.rate = 0.85;
    msg.pitch = 1;
    window.speechSynthesis.speak(msg);
  };

  return (
    <button
      onClick={speak}
      title="Hear status aloud"
      style={{
        position: "fixed",
        bottom: 28,
        right: 28,
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#1a1a1a",
        border: "2px solid #333",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
      }}
    >
      {/* Megaphone SVG */}
      <svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Horn body */}
        <path d="M4 10 L4 18 L8 18 L18 24 L18 4 L8 10 Z" fill="#e0e0e0" />
        {/* Sound waves */}
        <path d="M21 9 C23 11, 23 17, 21 19" stroke="#e0e0e0" strokeWidth="2" fill="none" strokeLinecap="round" />
        <path d="M23 6 C27 10, 27 18, 23 22" stroke="#e0e0e0" strokeWidth="1.5" fill="none" strokeLinecap="round" opacity="0.5" />
      </svg>
    </button>
  );
}
