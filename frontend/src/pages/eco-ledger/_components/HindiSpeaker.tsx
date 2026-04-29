import { speak } from "../../../lib/speak.ts";

/**
 * Hindi language speaker button
 * Speaks status alerts in Hindi with voice synthesis
 */
export default function HindiSpeaker({ status }: { status: "green" | "yellow" | "red" }) {
  const HINDI_MESSAGES: Record<string, string> = {
    green: "हमारे समुदाय की स्थिति ठीक है। पानी, कचरा और बिजली बचाते रहें।",
    yellow: "हमारे समुदाय को कार्रवाई की आवश्यकता है। कृपया स्क्रीन पर निर्देशों का पालन करें।",
    red: "यह गंभीर है। तुरंत कार्रवाई की आवश्यकता है। कृपया अभी कार्रवाई करें।",
  };

  const handleHindiSpeak = () => {
    speak(HINDI_MESSAGES[status], "hi-IN");
  };

  return (
    <button
      onClick={handleHindiSpeak}
      title="हिंदी में सुनें"
      style={{
        position: "fixed",
        bottom: 100,
        right: 28,
        width: 64,
        height: 64,
        borderRadius: "50%",
        background: "#1a1a1a",
        border: "2px solid #9b59b6",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 100,
        fontSize: "28px",
        transition: "all 0.2s ease",
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#2d1a4d";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#c39bd3";
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLButtonElement).style.background = "#1a1a1a";
        (e.currentTarget as HTMLButtonElement).style.borderColor = "#9b59b6";
      }}
    >
      🔊
    </button>
  );
}
