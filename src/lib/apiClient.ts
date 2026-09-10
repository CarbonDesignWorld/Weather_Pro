import { DayBrief, GeneratedCopyResponse, ChatMessage, ChatResponse } from "./types";
import { generateCopy } from "../api/generate-copy";
import { processChatTurn } from "../api/chat";

export async function requestCopyGeneration(brief: DayBrief): Promise<GeneratedCopyResponse> {
  // Try server endpoint first
  try {
    const res = await fetch("/api/generate-copy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current: brief.current,
        dayRange: brief.dayRange,
        wearIcons: brief.wear.icons,
        packIcons: brief.pack.icons,
        severity: brief.severity,
      }),
    });
    const contentType = res.headers.get("content-type") || "";
    if (res.ok && contentType.includes("application/json")) {
      const data = await res.json();
      if (data && !data.fallback && data.headline) {
        return data;
      }
    }
  } catch {
    // fallback to direct handler
  }

  const localKey = typeof window !== "undefined" ? localStorage.getItem("TODAY_GEMINI_API_KEY") || undefined : undefined;
  return generateCopy({
    current: brief.current,
    dayRange: brief.dayRange,
    wearIcons: brief.wear.icons,
    packIcons: brief.pack.icons,
    severity: brief.severity,
  }, localKey);
}

export async function sendChatMessage(messages: ChatMessage[], context: DayBrief): Promise<ChatResponse> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages, context }),
    });
    const contentType = res.headers.get("content-type") || "";
    if (res.ok && contentType.includes("application/json")) {
      const data = await res.json();
      if (data && data.message) {
        return data;
      }
    }
  } catch {
    // fallback to direct handler
  }

  const localKey = typeof window !== "undefined" ? localStorage.getItem("TODAY_GEMINI_API_KEY") || undefined : undefined;
  return processChatTurn({ messages, context, apiKey: localKey });
}
