export const API =
  (import.meta as any).env?.VITE_API_URL ||
  "http://127.0.0.1:5000"; // local fallback

export async function apiFetch(path: string, options?: RequestInit) {
  const url = `${API}${path}`;
  try {
    const res = await fetch(url, options);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
  } catch (e) {
    console.error("API error:", url, e);
    throw e;
  }
}