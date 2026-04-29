/**
 * Browser SpeechSynthesis utility for audio announcements.
 * Gracefully handles unsupported browsers and voice selection.
 */
export function speak(text: string, lang = "hi-IN") {
  if (!("speechSynthesis" in window)) return;

  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = lang;
  utterance.rate = 0.9;
  utterance.pitch = 1;

  // Try to find and use the specific language voice
  const voices = window.speechSynthesis.getVoices();
  const targetVoice = voices.find((v) => v.lang === lang);
  if (targetVoice) {
    utterance.voice = targetVoice;
  }

  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
}
